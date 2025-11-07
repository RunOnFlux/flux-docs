import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Flux Documentation',
  tagline: 'Build, Deploy & Manage on the Decentralized Cloud',
  favicon: 'img/favicon.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://docs.runonflux.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'runonflux', // Usually your GitHub org/user name.
  projectName: 'flux-docs', // Usually your repo name.

  onBrokenLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/', // Serve docs at the site's root
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/runonflux/flux-docs/edit/main/',
        },
        blog: false, // Disable blog for now
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        indexDocs: true,
        indexBlog: false,
        indexPages: false,
        docsRouteBasePath: '/',
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 8,
        searchResultContextMaxLength: 50,
      },
    ],
  ],

  themeConfig: {
    // Social card image for sharing
    image: 'img/flux-logo.png',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Flux Docs',
      logo: {
        alt: 'Flux Logo',
        src: 'img/flux-icon.svg',
        srcDark: 'img/flux-icon.svg',
        width: 32,
        height: 32,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          to: '/fluxcloud/introduction',
          label: 'FluxCloud',
          position: 'left',
        },
        {
          to: '/fluxnodes/what-are-fluxnodes',
          label: 'FluxNodes',
          position: 'left',
        },
        {
          to: '/fluxedge/overview',
          label: 'FluxEdge',
          position: 'left',
        },
        {
          to: '/fluxcore/overview',
          label: 'FluxCore',
          position: 'left',
        },
        {
          href: 'https://github.com/runonflux',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Ecosystem',
          items: [
            {
              label: 'FluxCloud',
              to: '/fluxcloud/introduction',
            },
            {
              label: 'FluxNodes',
              to: '/fluxnodes/what-are-fluxnodes',
            },
            {
              label: 'FluxEdge',
              to: '/fluxedge/overview',
            },
            {
              label: 'FluxCore',
              to: '/fluxcore/overview',
            },
          ],
        },
        {
          title: 'Products',
          items: [
            {
              label: 'Zelcore Wallet',
              href: 'https://zelcore.io/',
            },
            {
              label: 'SSP Wallet',
              href: 'https://sspwallet.io/',
            },
            {
              label: 'Ecko Wallet',
              href: 'https://ecko.finance/',
            },
            {
              label: 'FluxAI',
              href: 'https://ai.runonflux.com/',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Documentation',
              to: '/',
            },
            {
              label: 'Support',
              href: 'https://support.runonflux.io/support/home',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/runonflux',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.com/invite/runonflux',
            },
            {
              label: 'X (Twitter)',
              href: 'https://x.com/RunOnFlux',
            },
            {
              label: 'Telegram',
              href: 'https://t.me/runonflux',
            },
          ],
        },
        {
          title: 'Company',
          items: [
            {
              label: 'Official Website',
              href: 'https://runonflux.com',
            },
            {
              label: 'Blog',
              href: 'https://runonflux.com/blog/',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} InFlux Technologies`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
