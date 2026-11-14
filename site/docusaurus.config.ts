import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Squid Wiki · 能源',
  tagline: '智能电表接入：IoT · HES · MDM · 预付费',
  favicon: 'img/favicon.svg',

  url: 'https://energy.squid.wiki',
  baseUrl: '/',
  organizationName: 'squid-wiki',
  projectName: 'energy',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  i18n: {defaultLocale: 'zh-Hans', locales: ['zh-Hans']},

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/squid-wiki/energy/edit/main/site/',
        },
        blog: false,
        theme: {customCss: './src/css/custom.css'},
        gtag: {trackingID: 'G-8M670Q2TMT', anonymizeIP: true},
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {respectPrefersColorScheme: true},
    navbar: {
      title: 'Squid Wiki · 能源',
      logo: {alt: 'Squid', src: 'img/favicon.svg'},
      items: [
        {type: 'docSidebar', sidebarId: 'main', position: 'left', label: '文档'},
        {href: 'https://squid.wiki', label: 'squid.wiki', position: 'right'},
        {href: 'https://github.com/squid-wiki/energy', label: 'GitHub', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Squid Wiki',
          items: [
            {label: 'Energy · 能源', href: 'https://energy.squid.wiki'},
            {label: 'Game · 游戏', href: 'https://game.squid.wiki'},
            {label: 'Finance · 理财', href: 'https://finance.squid.wiki'},
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Squid Wiki · Content CC BY-NC-SA 4.0 · Code Apache 2.0 · 本站使用 Google Analytics 统计匿名访问数据`,
    },
    prism: {theme: prismThemes.github, darkTheme: prismThemes.dracula},
  } satisfies Preset.ThemeConfig,
};

export default config;
