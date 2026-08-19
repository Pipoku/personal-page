export const siteConfig = {
  web3FormsKey: '',
};

export const profile = {
  name: 'Renzo Emiliano Carletti',
  firstName: 'Renzo',
  role: 'Decoupled Drupal & React Engineer',
  roles: [
    'Decoupled Drupal & React Engineer',
    'Headless CMS Architect',
    'REST API Specialist',
    'DevOps-Minded Developer',
  ],
  location: 'Paraná, Entre Ríos, AR',
  email: 'renzocarletti@hotmail.com',
  phone: '+54 9 343 4295 881',
  linkedin: 'https://www.linkedin.com/in/renzo-emiliano-carletti-7bbaba20b/',
  github: 'https://github.com/Pipoku',
  summary:
    'Mid-Senior Full-Stack Developer with 5+ years engineering high-performance web applications and modernizing legacy systems. Specialist in headless CMS architectures (Drupal + React) and REST API development, translating complex business needs into scalable systems — while bridging technical and non-technical stakeholders.',
  highlights: [
    '5+ years building high-performance web apps',
    'Led Drupal-to-headless CMS transformation',
    '30% faster load times, 40% lower infra costs',
    '57,000+ active users on university portals',
  ],
};

export const stats = [
  { value: 30, suffix: '%', id: 'load', label: 'load time reduction' },
  { value: 40, suffix: '%', id: 'infra', label: 'infrastructure costs cut' },
  { value: 57, suffix: 'K+', id: 'users', label: 'active users supported' },
  { value: 786, suffix: 'K+', id: 'events', label: 'events processed' },
  { value: 80, suffix: '%', id: 'auto', label: 'manual tasks automated' },
  { value: 5, suffix: '+', id: 'years', label: 'years of experience' },
];

export const projects = [
  {
    name: 'e-UADER',
    url: 'https://e.uader.edu.ar/',
    role: 'full',
    tagline: 'UADER e-learning platform',
    desc: 'Online learning portal: course and diploma catalog, 5-step self-enrollment, Drupal Commerce + Moodle REST integration and automatic digital certification (state or university).',
    tech: ['Drupal', 'Moodle', 'REST APIs', 'Commerce'],
    metric: '1,100+ enrollments in its first month',
    featured: true,
  },
  {
    name: 'Ingresantes UADER',
    url: 'https://ingresantes.uader.edu.ar/',
    role: 'full',
    tagline: 'First door for future students',
    desc: 'Prospective-student portal: career finder across 4 faculties and 16 localities, pre-inscription workflows, orientation tools and downloadable academic offers.',
    tech: ['Drupal', 'Paragraphs', 'Views'],
    metric: '4 faculties · 16 localities',
    featured: true,
  },
  {
    name: 'Buenos Aires Ciudad',
    url: 'https://buenosaires.gob.ar/inicio/',
    role: 'consultant',
    tagline: 'City government portal',
    desc: 'Drupal 8 → 10 migration for the City of Buenos Aires: content remodeling, Paragraphs, bug fixing and ongoing support as Drupal consultant via CyS.',
    tech: ['Drupal 8→10', 'Paragraphs'],
    metric: null,
    featured: false,
  },
  {
    name: 'Club San Jorge',
    url: 'https://clubsanjorge.com.ar/',
    role: 'modernization',
    tagline: 'Legacy modernization',
    desc: 'Refined a legacy project with little standardization: applied modern patterns, cleaner structure and maintainable practices.',
    tech: ['PHP', 'Legacy → Modern'],
    metric: null,
    featured: false,
  },
];

export const experience = [
  {
    company: 'CyS Informática',
    role: 'Specialized Drupal Consultant',
    period: '02/2026 — 04/2026',
    meta: 'Remote · Contract',
    bullets: [
      'Architected Drupal 10 content governance via role-based access control (RBAC), aligning business rules across dev, staging and production.',
      'Engineered JSON:API integrations and complex publishing workflows to secure unpublished content and improve data integrity.',
      'Resolved configuration drift and dependency conflicts by standardizing environment management with Composer, DDEV and Drush.',
      'Audited and refactored custom and contributed modules, cutting technical debt and boosting maintainability.',
    ],
  },
  {
    company: 'Activarte',
    role: 'Full-Stack Developer (Drupal + React)',
    period: '2023 — 2026',
    meta: 'Remote',
    bullets: [
      'Led the transformation of a monolithic CMS into a high-performance headless architecture with React, REST APIs and OAuth2 — 30% faster load times and 40% lower infrastructure costs.',
      'Developed and optimized high-frequency REST endpoints and secure OAuth2 flows for robust data security and fast front/back communication.',
      'Delivered dynamic, performant UIs by building custom React components consuming complex JSON:API payloads.',
      'Accelerated delivery managing Agile sprints in Jira and collaborating via cross-functional code reviews on Bitbucket.',
      'Mentored team members, keeping code quality high across the whole development lifecycle.',
    ],
  },
  {
    company: 'UADER — Rectorado',
    role: 'Drupal / Moodle Developer',
    period: '2021 — Present',
    meta: 'Part-time · In-office',
    bullets: [
      'Directed end-to-end development of three mission-critical university web portals serving 57,000+ active users and 786,000+ events with high availability.',
      'Automated high-volume admin workflows with ECA and custom Drupal modules, reducing manual tasks by 80% and minimizing human error.',
      'Stabilized core infrastructure, cutting system downtime by 25% through proactive debugging and server optimization.',
      'Engineered an automated course subscription platform on Moodle REST APIs — 1,100+ new enrollments in its first month.',
      'Led technical mentorship and training, guiding the team on Drupal best practices and project lifecycle management.',
    ],
  },
];

export const skills = [
  {
    group: 'Languages & Frameworks',
    items: ['React.js', 'PHP', 'JavaScript (ES6+)', 'Java', 'Symfony', 'jQuery', 'Bootstrap', 'Sass', 'HTML5', 'CSS3', 'SQL'],
  },
  {
    group: 'CMS & Ecosystem',
    items: ['Drupal 9/10/11', 'Theming', 'Custom Modules', 'Hooks', 'Entity API', 'Configuration Management', 'Commerce', 'ECA', 'Moodle'],
  },
  {
    group: 'Web Dev & Performance',
    items: ['RESTful APIs', 'JSON:API', 'OAuth2', 'Web Optimization', 'Xdebug', 'Chrome DevTools'],
  },
  {
    group: 'Databases & Tools',
    items: ['MySQL', 'PostgreSQL', 'CI/CD', 'Pantheon', 'Composer', 'DDEV', 'Drush', 'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Docker', 'Kubernetes', 'AWS', 'VPN', 'SSH'],
  },
  {
    group: 'Security & Methodologies',
    items: ['OWASP Principles', 'Secure Authentication', 'Agile (Scrum, Kanban)', 'Jira'],
  },
];

export const certifications = [
  { name: 'Diploma in DevOps Engineering', issuer: 'Mundos E', date: 'Apr 2025' },
  { name: 'React.js', issuer: 'Coder House', date: 'Jun 2023' },
  { name: 'JavaScript', issuer: 'Coder House', date: 'Jun 2023' },
  { name: 'Web Development', issuer: 'Coder House', date: 'Mar 2023' },
  { name: 'Git Version Control', issuer: 'Gugler', date: 'Jan 2023' },
  { name: 'Java Programming — Level 1', issuer: 'Gugler', date: 'Jul 2020' },
  { name: 'English — Advanced', issuer: 'Advance', date: 'Dec 2014' },
];

export const education = [
  {
    school: 'Autonomous University of Entre Ríos',
    degree: "Associate Degree: Information Systems",
    detail: 'Minor: Information Systems Analyst',
    period: 'Graduated 2025',
  },
  {
    school: 'Centenario High School',
    degree: 'High School Diploma: Economics',
    detail: 'Minor: Economics and Administration',
    period: '2011 — 2015',
  },
];

export const languages = [
  { name: 'Spanish', level: 'Native' },
  { name: 'English', level: 'Fluent · Professional Working Proficiency' },
];