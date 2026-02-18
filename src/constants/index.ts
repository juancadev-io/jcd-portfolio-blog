// REDES SOCIALES - Social Media
export const SOCIAL_LINKS = {
  github: "https://github.com/juancadev-io",
  youtube: "https://www.youtube.com/@juanca-dev",
  twitter: "https://twitter.com/juancadev_io",
  linkedin: "https://www.linkedin.com/in/juancadev-io",
} as const;

// EMPRESAS / TRABAJOS - Work Experience
export const WORK_COMPANIES = {
  dafiti: "https://www.dafiti.com.co/",
  bancodeBogota: "https://www.bancodebogota.com/",
  canastto: "https://www.linkedin.com/company/canastto-com/",
} as const;

// CONTACTO - Contact
export const CONTACT = {
  email: {
    link: "hello@juancadev.com",
    display: "hello@juancadev.com",
  },
  linkedin: {
    link: "https://www.linkedin.com/in/juancadev-io/",
    display: "Juan Camilo Farfan",
  },
  twitter: {
    link: "https://twitter.com/juancadev_io",
    display: "@juancadev_io",
  },
} as const;

// INFORMACIÓN DEL SITIO - Site Info
export const SITE_INFO = {
  siteTitle: "JuancaDev",
  brandName: "JUANCADEV",
} as const;

// RUTAS NAVEGACIÓN - Navigation Routes
export const ROUTES = {
  home: (lang?: string) => `/${lang || ""}`,
  blog: (lang?: string) => `/${lang || ""}/blog`,
  about: (lang?: string) => `/${lang || ""}/about`,
  blogPost: (lang: string, slug: string) => `/${lang}/blog/${slug}`,
  blogTag: (lang: string, tag: string) => `/${lang}/blog/tag/${tag}`,
} as const;