const VS_POINTS = `
attribute vec3 aPos;
attribute vec3 aColor;
uniform mat4 uMV;
uniform float uPointSize;
varying vec3 vColor;
void main() {
  gl_Position = uMV * vec4(aPos, 1.0);
  vColor = aColor;
  gl_PointSize = uPointSize;
}`;

const FS_POINTS = `
precision mediump float;
varying vec3 vColor;
void main() {
  vec2 uv = gl_PointCoord * 2.0 - 1.0;
  float d = dot(uv, uv);
  float a = exp(-d * 3.0);
  gl_FragColor = vec4(vColor, a * 0.9);
}`;

const VS_LINES = `
attribute vec3 aPos;
uniform mat4 uMV;
void main() {
  gl_Position = uMV * vec4(aPos, 1.0);
}`;

const FS_LINES = `
precision mediump float;
uniform vec4 uColor;
void main() {
  gl_FragColor = uColor;
}`;

const VERT_SRC = `vec3 rotateY(vec3 p, float a) {
  float c = cos(a); float s = sin(a);
  return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
}
vec3 rotateX(vec3 p, float a) {
  float c = cos(a); float s = sin(a);
  return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z);
}`;

function mat4Identity() {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

function mat4Perspective(fovy, aspect, near, far) {
  const f = 1.0 / Math.tan(fovy / 2);
  const nf = 1.0 / (near - far);
  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ];
}

function mat4Multiply(a, b) {
  const out = new Array(16);
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      out[c * 4 + r] =
        a[0 * 4 + r] * b[c * 4 + 0] +
        a[1 * 4 + r] * b[c * 4 + 1] +
        a[2 * 4 + r] * b[c * 4 + 2] +
        a[3 * 4 + r] * b[c * 4 + 3];
    }
  }
  return out;
}

function mat4LookAt(eye, target, up) {
  let zx = eye[0] - target[0], zy = eye[1] - target[1], zz = eye[2] - target[2];
  const zl = Math.hypot(zx, zy, zz);
  zx /= zl; zy /= zl; zz /= zl;
  let xx = up[1] * zz - up[2] * zy;
  let xy = up[2] * zx - up[0] * zz;
  let xz = up[0] * zy - up[1] * zx;
  const xl = Math.hypot(xx, xy, xz);
  xx /= xl; xy /= xl; xz /= xl;
  const yx = zy * xz - zz * xy;
  const yy = zz * xx - zx * xz;
  const yz = zx * xy - zy * xx;
  return [
    xx, yx, zx, 0,
    xy, yy, zy, 0,
    xz, yz, zz, 0,
    -(xx * eye[0] + xy * eye[1] + xz * eye[2]),
    -(yx * eye[0] + yy * eye[1] + yz * eye[2]),
    -(zx * eye[0] + zy * eye[1] + zz * eye[2]),
    1,
  ];
}

function compile(gl, type, src) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

function program(gl, vs, fs) {
  const v = compile(gl, gl.VERTEX_SHADER, vs);
  const f = compile(gl, gl.FRAGMENT_SHADER, fs);
  const p = gl.createProgram();
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(p));
    return null;
  }
  return p;
}

export function initHeroCanvas(id) {
  const canvas = document.getElementById(id);
  if (!canvas) return;

  const gl =
    canvas.getContext('webgl', { alpha: true, antialias: false, powerPreference: 'high-performance' }) ||
    canvas.getContext('experimental-webgl', { alpha: true, antialias: false });
  if (!gl) {
    canvas.style.display = 'none';
    return;
  }

  let disposed = false;
  let running = false;
  let rafId = 0;
  let ctxLost = false;

  const isMobile = window.matchMedia('(max-width: 720px)').matches;
  const lowPower =
    (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
  const count = lowPower ? (isMobile ? 45 : 80) : isMobile ? 110 : 200;
  const dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.25 : 1.75);
  const speed = lowPower ? 0.5 : 1;
  const lineEvery = lowPower ? 14 : 8;
  const container = canvas.parentElement;

  const pointProgram = program(gl, VERT_SRC + '\n' + VS_POINTS, FS_POINTS);
  const lineProgram = program(gl, VERT_SRC + '\n' + VS_LINES, FS_LINES);

  const uPointMV = gl.getUniformLocation(pointProgram, 'uMV');
  const uPointSize = gl.getUniformLocation(pointProgram, 'uPointSize');
  const uLineMV = gl.getUniformLocation(lineProgram, 'uMV');
  const uLineColor = gl.getUniformLocation(lineProgram, 'uColor');

  const radius = 3.4;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const palette = [
    [0.486, 0.424, 1.0],
    [0.133, 0.827, 0.933],
    [0.91, 0.475, 0.976],
  ];
  for (let i = 0; i < count; i++) {
    const r = radius * Math.cbrt(Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
    const c = palette[(Math.random() * palette.length) | 0];
    col[i * 3] = c[0];
    col[i * 3 + 1] = c[1];
    col[i * 3 + 2] = c[2];
  }

  const maxPairs = count * count;
  const lineData = new Float32Array(maxPairs * 2 * 3);
  let lineVerts = 0;

  function buildLines() {
    lineVerts = 0;
    const MAX_D = 0.85;
    const MAX_D2 = MAX_D * MAX_D;
    let k = 0;
    for (let i = 0; i < count; i++) {
      const ix = pos[i * 3], iy = pos[i * 3 + 1], iz = pos[i * 3 + 2];
      for (let j = i + 1; j < count; j++) {
        const dx = ix - pos[j * 3];
        const dy = iy - pos[j * 3 + 1];
        const dz = iz - pos[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < MAX_D2) {
          lineData[k++] = ix;
          lineData[k++] = iy;
          lineData[k++] = iz;
          lineData[k++] = pos[j * 3];
          lineData[k++] = pos[j * 3 + 1];
          lineData[k++] = pos[j * 3 + 2];
        }
      }
    }
    lineVerts = k / 3;
  }

  function setup() {
    const pb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pb);
    gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(pointProgram, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

    const cb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cb);
    gl.bufferData(gl.ARRAY_BUFFER, col, gl.STATIC_DRAW);
    const aCol = gl.getAttribLocation(pointProgram, 'aColor');
    gl.enableVertexAttribArray(aCol);
    gl.vertexAttribPointer(aCol, 3, gl.FLOAT, false, 0, 0);

    const lb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, lb);
    gl.bufferData(gl.ARRAY_BUFFER, lineData, gl.DYNAMIC_DRAW);
    const lPos = gl.getAttribLocation(lineProgram, 'aPos');
    gl.enableVertexAttribArray(lPos);
    gl.vertexAttribPointer(lPos, 3, gl.FLOAT, false, 0, 0);

    return { pb, cb, lb };
  }

  let buffers = setup();
  buildLines();

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.clearColor(0, 0, 0, 0);
  gl.useProgram(lineProgram);
  gl.uniform4f(uLineColor, 0.486, 0.424, 1.0, 0.14);

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const onPointer = (e) => {
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = -(e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener('pointermove', onPointer, { passive: true });

  let rotationY = 0;
  let rotationX = 0;
  let t = 0;
  let frame = 0;

  const tick = () => {
    if (!running) return;
    rafId = requestAnimationFrame(tick);
    t += 0.002;
    frame++;
    rotationY += 0.0012 * speed;
    rotationX += 0.0004 * speed;

    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    gl.viewport(0, 0, w * dpr, h * dpr);

    const scale = 1 + Math.sin(t * 10) * 0.02;
    const proj = mat4Perspective((60 * Math.PI) / 180, w / h, 0.1, 100);
    const view = mat4LookAt([mouse.x * 0.6, mouse.y * 0.6, 7], [0, 0, 0], [0, 1, 0]);
    const rotY = mat4Identity();
    rotY[0] = Math.cos(rotationY); rotY[2] = Math.sin(rotationY);
    rotY[8] = -Math.sin(rotationY); rotY[10] = Math.cos(rotationY);
    const rotX = mat4Identity();
    rotX[5] = Math.cos(rotationX); rotX[6] = -Math.sin(rotationX);
    rotX[9] = Math.sin(rotationX); rotX[10] = Math.cos(rotationX);
    const mvp = mat4Multiply(mat4Multiply(mat4Multiply(proj, view), rotY), rotX);
    for (let i = 0; i < 16; i++) mvp[i] *= scale;

    gl.clear(gl.COLOR_BUFFER_BIT);

    if (frame % lineEvery === 0) buildLines();
    gl.useProgram(lineProgram);
    gl.uniformMatrix4fv(uLineMV, false, mvp);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.lb);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, lineData.subarray(0, lineVerts * 3));
    gl.drawArrays(gl.LINES, 0, lineVerts);

    gl.useProgram(pointProgram);
    gl.uniformMatrix4fv(uPointMV, false, mvp);
    gl.uniform1f(uPointSize, 3.0 * dpr);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.pb);
    gl.drawArrays(gl.POINTS, 0, count);
  };

  function start() {
    if (running || disposed || ctxLost) return;
    running = true;
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
  }

  const onVisibility = () => {
    if (document.hidden) stop();
    else start();
  };
  document.addEventListener('visibilitychange', onVisibility);

  const inView = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) start();
        else stop();
      });
    },
    { threshold: 0.05 }
  );
  inView.observe(canvas);

  const onResize = () => {
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
  };
  onResize();
  window.addEventListener('resize', onResize, { passive: true });

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    ctxLost = true;
    stop();
    canvas.style.opacity = '0';
  });

  canvas.addEventListener('webglcontextrestored', () => {
    ctxLost = false;
    buffers = setup();
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.clearColor(0, 0, 0, 0);
    gl.useProgram(lineProgram);
    gl.uniform4f(uLineColor, 0.486, 0.424, 1.0, 0.14);
    canvas.style.opacity = '1';
    start();
  });

  start();

  window.addEventListener('beforeunload', () => {
    disposed = true;
    stop();
    inView.disconnect();
    window.removeEventListener('pointermove', onPointer);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibility);
  });
}