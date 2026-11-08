import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Squid Grid',
  tagline: 'Smart-meter integration: IoT · HES · MDM · Prepaid',
  favicon: 'img/favicon.svg',

  url: 'https://grid.squid.wiki',
  baseUrl: '/',
  organizationName: 'squid-wiki',
  projectName: 'grid',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  i18n: {defaultLocale: 'en', locales: ['en']},

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/squid-wiki/grid/edit/main/site/',
        },
        blog: false,
        theme: {customCss: './src/css/custom.css'},
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {respectPrefersColorScheme: true},
    navbar: {
      title: 'Squid Grid',
      logo: {alt: 'Squid', src: 'img/favicon.svg'},
      items: [
        {type: 'docSidebar', sidebarId: 'main', position: 'left', label: 'Docs'},
        {href: 'https://squid.wiki', label: 'squid.wiki', position: 'right'},
        {href: 'https://github.com/squid-wiki/grid', label: 'GitHub', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Squid 3G',
          items: [
            {label: 'Grid · Energy', href: 'https://grid.squid.wiki'},
            {label: 'Game · Gaming', href: 'https://game.squid.wiki'},
            {label: 'Gain · Investing', href: 'https://gain.squid.wiki'},
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Squid Wiki · Content CC BY-NC-SA 4.0 · Code Apache 2.0`,
    },
    prism: {theme: prismThemes.github, darkTheme: prismThemes.dracula},
  } satisfies Preset.ThemeConfig,
};

export default config;
