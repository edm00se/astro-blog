import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://astro.edm00se.codes/",
  author: "Eric McCormick",
  user: "edm00se",
  gravatar: {
    url: "https://avatars.githubusercontent.com/u/622118?v=4&s=240",
    width: "240",
    height: "240"
  },
  profile: "https://edm00se.codes/",
  desc: "software development, operations, tooling, and tech musings",
  title: "Dev | Blog",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 3,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  editPost: {
    url: "https://github.com/edm00se/astro-blog/edit/main/src/content/blog",
    text: "Suggest Changes",
    appendFilePath: true,
  },
};

export const LOCALE = {
  lang: "en", // html lang code. Set this empty and default will be "en"
  langTag: ["en-US"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/edm00se",
    linkTitle: ` ${SITE.user} on GitHub`,
    active: true,
  },
  {
    name: "Mastodon",
    href: "https://hachyderm.io/@edm00se",
    linkTitle: `${SITE.user} on Mastodon`,
    active: true,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/edm00se",
    linkTitle: `${SITE.user} on Instagram`,
    active: true,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/c/edm00se",
    linkTitle: `${SITE.user} on YouTube`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:edm00se@gmail.com",
    linkTitle: `Send an email to ${SITE.user}`,
    active: false,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/emccormick",
    linkTitle: `${SITE.user} on LinkedIn`,
    active: false,
  },
];
