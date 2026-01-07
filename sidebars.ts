import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Main documentation sidebar - preserving exact order from GitBook SUMMARY.md
  docsSidebar: [
    // Home Section
    {
      type: 'category',
      label: 'Home',
      items: [
        'index',
        'home/flux-ecosystem',
        'home/influx-technologies',
      ],
    },

    // FluxCloud Section
    {
      type: 'category',
      label: 'FluxCloud',
      items: [
        'fluxcloud/introduction',
        {
          type: 'category',
          label: 'CLOUD',
          items: [
            'fluxcloud/cloud/README',
            {
              type: 'category',
              label: 'Dashboard',
              items: [
                'fluxcloud/cloud/dashboard/README',
                'fluxcloud/cloud/dashboard/overview',
                'fluxcloud/cloud/dashboard/resources',
                'fluxcloud/cloud/dashboard/map',
                'fluxcloud/cloud/dashboard/rewards',
                'fluxcloud/cloud/dashboard/node-list',
              ],
            },
            {
              type: 'category',
              label: 'Applications',
              items: [
                'fluxcloud/cloud/applications/README',
                {
                  type: 'category',
                  label: 'Management',
                  items: [
                    'fluxcloud/cloud/applications/management/README',
                    {
                      type: 'category',
                      label: 'Manage App',
                      items: [
                        'fluxcloud/cloud/applications/management/manage-app/README',
                        'fluxcloud/cloud/applications/management/manage-app/specifications',
                        'fluxcloud/cloud/applications/management/manage-app/information',
                        'fluxcloud/cloud/applications/management/manage-app/file-changes',
                        'fluxcloud/cloud/applications/management/manage-app/monitoring',
                        'fluxcloud/cloud/applications/management/manage-app/logs',
                        'fluxcloud/cloud/applications/management/manage-app/secure-shell',
                        'fluxcloud/cloud/applications/management/manage-app/control',
                        'fluxcloud/cloud/applications/management/manage-app/backup-and-restore',
                        'fluxcloud/cloud/applications/management/manage-app/instances',
                        'fluxcloud/cloud/applications/management/manage-app/subscription',
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'category',
              label: 'Register New App',
              items: [
                'fluxcloud/cloud/register-new-app/README',
                'fluxcloud/cloud/register-new-app/general',
                'fluxcloud/cloud/register-new-app/geolocation',
                'fluxcloud/cloud/register-new-app/priority-nodes',
                'fluxcloud/cloud/register-new-app/components',
                'fluxcloud/cloud/register-new-app/review',
                'fluxcloud/cloud/register-new-app/custom-domain-setup',
              ],
            },
            {
              type: 'category',
              label: 'Marketplace',
              items: [
                'fluxcloud/cloud/marketplace/README',
                {
                  type: 'category',
                  label: 'Games',
                  items: [
                    'fluxcloud/cloud/marketplace/games/README',
                    'fluxcloud/cloud/marketplace/games/palworld',
                    'fluxcloud/cloud/marketplace/games/enshrouded',
                    'fluxcloud/cloud/marketplace/games/minecraft',
                  ],
                },
                {
                  type: 'category',
                  label: 'WordPress',
                  items: [
                    'fluxcloud/cloud/marketplace/wordpress/README',
                    'fluxcloud/cloud/marketplace/wordpress/wordpress-details',
                    'fluxcloud/cloud/marketplace/wordpress/registration-steps',
                    'fluxcloud/cloud/marketplace/wordpress/custom-domain-setup',
                    'fluxcloud/cloud/marketplace/wordpress/admin-setup',
                  ],
                },
                {
                  type: 'category',
                  label: 'Kaspa Nodes',
                  items: [
                    'fluxcloud/cloud/marketplace/kaspa-nodes/README',
                    'fluxcloud/cloud/marketplace/kaspa-nodes/manual-deployment',
                  ],
                },
              ],
            },
            {
              type: 'category',
              label: 'FluxDrive',
              items: [
                'fluxcloud/cloud/fluxdrive/README',
                'fluxcloud/cloud/fluxdrive/fluxdrive-pro',
              ],
            },
            'fluxcloud/cloud/cost-calculator',
            {
              type: 'category',
              label: 'Shared Database',
              items: [
                'fluxcloud/cloud/shared-database/README',
                'fluxcloud/cloud/shared-database/general',
                'fluxcloud/cloud/shared-database/component',
                'fluxcloud/cloud/shared-database/review',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'HOME',
          items: [
            'fluxcloud/home/README',
            {
              type: 'category',
              label: 'Dashboard',
              items: [
                'fluxcloud/home/dashboard/README',
                'fluxcloud/home/dashboard/overview',
                'fluxcloud/home/dashboard/resources',
                'fluxcloud/home/dashboard/map',
                'fluxcloud/home/dashboard/rewards',
                'fluxcloud/home/dashboard/list',
              ],
            },
            {
              type: 'category',
              label: 'Applications',
              items: [
                'fluxcloud/home/applications/README',
                {
                  type: 'category',
                  label: 'Management',
                  items: [
                    'fluxcloud/home/applications/management/README',
                    {
                      type: 'category',
                      label: 'Manage App',
                      items: [
                        'fluxcloud/home/applications/management/manage-app/README',
                        {
                          type: 'category',
                          label: 'Local App Management',
                          items: [
                            'fluxcloud/home/applications/management/manage-app/local-app-management/README',
                            'fluxcloud/home/applications/management/manage-app/local-app-management/specifications',
                            'fluxcloud/home/applications/management/manage-app/local-app-management/information',
                            'fluxcloud/home/applications/management/manage-app/local-app-management/monitoring',
                            'fluxcloud/home/applications/management/manage-app/local-app-management/file-changes',
                            'fluxcloud/home/applications/management/manage-app/local-app-management/logs',
                            'fluxcloud/home/applications/management/manage-app/local-app-management/application-control',
                            'fluxcloud/home/applications/management/manage-app/local-app-management/backup-and-restore',
                            'fluxcloud/home/applications/management/manage-app/local-app-management/interactive-terminal',
                          ],
                        },
                        {
                          type: 'category',
                          label: 'Global App Management',
                          items: [
                            'fluxcloud/home/applications/management/manage-app/global-app-management/README',
                            'fluxcloud/home/applications/management/manage-app/global-app-management/global-control',
                            'fluxcloud/home/applications/management/manage-app/global-app-management/running-instances',
                            'fluxcloud/home/applications/management/manage-app/global-app-management/update-renew',
                            'fluxcloud/home/applications/management/manage-app/global-app-management/cancel-subscription',
                          ],
                        },
                      ],
                    },
                    'fluxcloud/home/applications/management/custom-domain-setup',
                  ],
                },
                'fluxcloud/home/applications/global-apps',
                {
                  type: 'category',
                  label: 'Register New App',
                  items: [
                    'fluxcloud/home/applications/register-new-app/README',
                    'fluxcloud/home/applications/register-new-app/details',
                    'fluxcloud/home/applications/register-new-app/component',
                    'fluxcloud/home/applications/register-new-app/enterprise-nodes-optional',
                    'fluxcloud/home/applications/register-new-app/validate-and-pay',
                  ],
                },
                {
                  type: 'category',
                  label: 'Marketplace',
                  items: [
                    'fluxcloud/home/applications/marketplace/README',
                    {
                      type: 'category',
                      label: 'Kaspa Nodes',
                      items: [
                        'fluxcloud/home/applications/marketplace/kaspa-nodes/README',
                        'fluxcloud/home/applications/marketplace/kaspa-nodes/manual-deployment',
                      ],
                    },
                  ],
                },
                {
                  type: 'category',
                  label: 'Shared Database',
                  items: [
                    'fluxcloud/home/applications/shared-database/README',
                    'fluxcloud/home/applications/shared-database/details',
                    'fluxcloud/home/applications/shared-database/component',
                    'fluxcloud/home/applications/shared-database/validate-and-pay',
                    'fluxcloud/home/applications/shared-database/developer-notes',
                  ],
                },
              ],
            },
          ],
        },
        // Note: FluxCloud API is an external link (https://docs.runonflux.io/) - skipped
      ],
    },

    // FluxOrbit Section
    {
      type: 'category',
      label: 'FluxOrbit',
      items: [
        'fluxorbit/introduction',
        {
          type: 'category',
          label: 'Getting Started',
          items: [
            'fluxorbit/getting-started/quick-start',
            'fluxorbit/getting-started/installation',
            'fluxorbit/getting-started/first-deployment',
            'fluxorbit/getting-started/deployment-guidelines',
          ],
        },
        {
          type: 'category',
          label: 'Configuration',
          items: [
            'fluxorbit/configuration/environment-reference',
          ],
        },
        {
          type: 'category',
          label: 'Deployment Hooks',
          items: [
            'fluxorbit/hooks/deployment-hooks',
          ],
        },
        {
          type: 'category',
          label: 'CI/CD Integration',
          items: [
            'fluxorbit/ci-cd/github-webhooks',
            'fluxorbit/ci-cd/gitlab-integration',
            'fluxorbit/ci-cd/bitbucket-setup',
          ],
        },
        {
          type: 'category',
          label: 'API Reference',
          items: [
            'fluxorbit/api/webhook-api',
          ],
        },
        {
          type: 'category',
          label: 'Troubleshooting',
          items: [
            'fluxorbit/troubleshooting/common-issues',
          ],
        },
        {
          type: 'category',
          label: 'Deployment Guides',
          items: [
            'fluxorbit/guides/deploying-nodejs',
            'fluxorbit/guides/deploying-python',
            'fluxorbit/guides/deploying-ruby',
            'fluxorbit/guides/deploying-go',
            'fluxorbit/guides/deploying-bun',
            'fluxorbit/guides/deploying-rust',
            'fluxorbit/guides/deploying-java',
            'fluxorbit/guides/deploying-dotnet',
            'fluxorbit/guides/deploying-php',
            'fluxorbit/guides/gpu-ai-applications',
            'fluxorbit/guides/pr-preview-deployments',
          ],
        },
      ],
    },

    // FluxNodes Section
    {
      type: 'category',
      label: 'FluxNodes',
      items: [
        'fluxnodes/what-are-fluxnodes',
        {
          type: 'category',
          label: 'Legacy FluxNode',
          items: [
            'fluxnodes/legacy-fluxnode/README',
            'fluxnodes/legacy-fluxnode/before-you-start',
            {
              type: 'category',
              label: 'Step-by-Step Guide',
              items: [
                'fluxnodes/legacy-fluxnode/step-by-step-guide/README',
                {
                  type: 'category',
                  label: 'Step 1: Prepare Flux Collateral',
                  items: [
                    'fluxnodes/legacy-fluxnode/step-by-step-guide/step-1-prepare-flux-collateral/README',
                    'fluxnodes/legacy-fluxnode/step-by-step-guide/step-1-prepare-flux-collateral/create-a-new-flux-wallet',
                    'fluxnodes/legacy-fluxnode/step-by-step-guide/step-1-prepare-flux-collateral/send-the-required-amount-of-flux-to-your-wallet',
                  ],
                },
                {
                  type: 'category',
                  label: 'Step 2: Choose Your Hosting Setup',
                  items: [
                    'fluxnodes/legacy-fluxnode/step-by-step-guide/step-2-choose-your-hosting-setup/README',
                    'fluxnodes/legacy-fluxnode/step-by-step-guide/step-2-choose-your-hosting-setup/virtualized-server-using-windows',
                    'fluxnodes/legacy-fluxnode/step-by-step-guide/step-2-choose-your-hosting-setup/raspberry-pi',
                    'fluxnodes/legacy-fluxnode/step-by-step-guide/step-2-choose-your-hosting-setup/nvidia-jetson',
                  ],
                },
                {
                  type: 'category',
                  label: 'Step 3: Install the FluxNode Software',
                  items: [
                    'fluxnodes/legacy-fluxnode/step-by-step-guide/step-3-install-the-fluxnode-software/README',
                    'fluxnodes/legacy-fluxnode/step-by-step-guide/step-3-install-the-fluxnode-software/connect-to-server-via-ssh',
                    'fluxnodes/legacy-fluxnode/step-by-step-guide/step-3-install-the-fluxnode-software/install-os-updates',
                    'fluxnodes/legacy-fluxnode/step-by-step-guide/step-3-install-the-fluxnode-software/networking-configuration',
                    {
                      type: 'category',
                      label: 'Install FluxNode Software',
                      items: [
                        'fluxnodes/legacy-fluxnode/step-by-step-guide/step-3-install-the-fluxnode-software/install-fluxnode-software/README',
                        'fluxnodes/legacy-fluxnode/step-by-step-guide/step-3-install-the-fluxnode-software/install-fluxnode-software/install-docker-option-1',
                        {
                          type: 'category',
                          label: 'Create Installation Configuration (Option 6)',
                          items: [
                            'fluxnodes/legacy-fluxnode/step-by-step-guide/step-3-install-the-fluxnode-software/install-fluxnode-software/create-installation-configuration-option-6/README',
                            'fluxnodes/legacy-fluxnode/step-by-step-guide/step-3-install-the-fluxnode-software/install-fluxnode-software/create-installation-configuration-option-6/zelcore-configuration',
                            'fluxnodes/legacy-fluxnode/step-by-step-guide/step-3-install-the-fluxnode-software/install-fluxnode-software/create-installation-configuration-option-6/ssp-wallet-configuration',
                          ],
                        },
                        'fluxnodes/legacy-fluxnode/step-by-step-guide/step-3-install-the-fluxnode-software/install-fluxnode-software/install-fluxnode-option-2',
                      ],
                    },
                  ],
                },
                {
                  type: 'category',
                  label: 'Step 4: Start Your FluxNode',
                  items: [
                    'fluxnodes/legacy-fluxnode/step-by-step-guide/step-4-start-your-fluxnode/README',
                    'fluxnodes/legacy-fluxnode/step-by-step-guide/step-4-start-your-fluxnode/start-via-zelcore',
                    'fluxnodes/legacy-fluxnode/step-by-step-guide/step-4-start-your-fluxnode/start-via-ssp',
                  ],
                },
              ],
            },
            'fluxnodes/legacy-fluxnode/diagnosing-issues',
            'fluxnodes/legacy-fluxnode/watchdog-and-uptime-monitoring',
            'fluxnodes/legacy-fluxnode/update-and-maintenance',
            {
              type: 'category',
              label: 'Multitoolbox',
              items: [
                'fluxnodes/legacy-fluxnode/multitoolbox/README',
                'fluxnodes/legacy-fluxnode/multitoolbox/option-3-analyzer-and-fixer',
                'fluxnodes/legacy-fluxnode/multitoolbox/option-4-install-watchdog',
                'fluxnodes/legacy-fluxnode/multitoolbox/option-5-restore-flux-blockchain',
                'fluxnodes/legacy-fluxnode/multitoolbox/option-6-create-install-config-file',
                'fluxnodes/legacy-fluxnode/multitoolbox/option-7-re-install-flux-os',
                'fluxnodes/legacy-fluxnode/multitoolbox/option-8-daemon-configuration',
                'fluxnodes/legacy-fluxnode/multitoolbox/option-11-reconfigure-flux-os',
                'fluxnodes/legacy-fluxnode/multitoolbox/option-13-mongodb-repair',
                'fluxnodes/legacy-fluxnode/multitoolbox/option-14-enable-multi-node-upnp',
              ],
            },
            {
              type: 'category',
              label: 'Advanced Topics',
              items: [
                'fluxnodes/legacy-fluxnode/advanced-topics/README',
                'fluxnodes/legacy-fluxnode/advanced-topics/maintenance-window',
                'fluxnodes/legacy-fluxnode/advanced-topics/fluxnode-lxc-permission-fix',
                'fluxnodes/legacy-fluxnode/advanced-topics/proxmox-fractus-node-setup',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'ArcaneOS FluxNode',
          items: [
            'fluxnodes/arcaneos-fluxnode/README',
            'fluxnodes/arcaneos-fluxnode/how-to-install-arcane-os',
            {
              type: 'category',
              label: 'Step-by-Step Guide',
              items: [
                'fluxnodes/arcaneos-fluxnode/step-by-step-guide/README',
                'fluxnodes/arcaneos-fluxnode/step-by-step-guide/create-a-virtual-machine',
                'fluxnodes/arcaneos-fluxnode/step-by-step-guide/os-installation',
                'fluxnodes/arcaneos-fluxnode/step-by-step-guide/platform-key-configuration',
                {
                  type: 'category',
                  label: '4. Configure Your FluxNode',
                  items: [
                    'fluxnodes/arcaneos-fluxnode/step-by-step-guide/configure-your-fluxnode/README',
                    'fluxnodes/arcaneos-fluxnode/step-by-step-guide/configure-your-fluxnode/send-the-required-amount-of-flux-to-your-wallet',
                    'fluxnodes/arcaneos-fluxnode/step-by-step-guide/configure-your-fluxnode/manual-configuration',
                    'fluxnodes/arcaneos-fluxnode/step-by-step-guide/configure-your-fluxnode/configure-via-zelcore-token',
                    'fluxnodes/arcaneos-fluxnode/step-by-step-guide/configure-your-fluxnode/configure-via-ssp-token',
                  ],
                },
                'fluxnodes/arcaneos-fluxnode/step-by-step-guide/configure-notifications',
                'fluxnodes/arcaneos-fluxnode/step-by-step-guide/configure-ssh-access',
                'fluxnodes/arcaneos-fluxnode/step-by-step-guide/confirm-settings',
                'fluxnodes/arcaneos-fluxnode/step-by-step-guide/finalizing-the-configuration',
                'fluxnodes/arcaneos-fluxnode/step-by-step-guide/accessing-the-system',
              ],
            },
          ],
        },
        'fluxnodes/titan-node-staking',
        'fluxnodes/managed-fluxnode-service',
        'fluxnodes/claim-parallel-assets',
        'fluxnodes/unlocking-fluxnode-collateral',
      ],
    },

    // FluxEdge Section
    {
      type: 'category',
      label: 'FluxEdge',
      items: [
        'fluxedge/overview',
        'fluxedge/home',
        {
          type: 'category',
          label: 'Projects',
          items: [
            'fluxedge/projects/README',
            {
              type: 'category',
              label: 'Overview',
              items: [
                'fluxedge/projects/overview/README',
                'fluxedge/projects/overview/machine-overview',
                'fluxedge/projects/overview/projects-overview',
              ],
            },
            {
              type: 'category',
              label: 'Deploy App',
              items: [
                'fluxedge/projects/deploy-app/README',
                'fluxedge/projects/deploy-app/quick-launch',
                'fluxedge/projects/deploy-app/custom-deployment',
                'fluxedge/projects/deploy-app/local-storage',
              ],
            },
            'fluxedge/projects/rent-machine',
          ],
        },
        'fluxedge/rate-and-review-machines',
        {
          type: 'category',
          label: 'Account',
          items: [
            'fluxedge/account/README',
            {
              type: 'category',
              label: 'Overview',
              items: [
                'fluxedge/account/overview/README',
                'fluxedge/account/overview/deposit-funds',
              ],
            },
            {
              type: 'category',
              label: 'Audit',
              items: [
                'fluxedge/account/audit/README',
                'fluxedge/account/audit/logs',
                'fluxedge/account/audit/login',
                'fluxedge/account/audit/machines',
                'fluxedge/account/audit/projects',
                'fluxedge/account/audit/balance',
              ],
            },
            'fluxedge/account/contact-details',
            {
              type: 'category',
              label: 'Settings',
              items: [
                'fluxedge/account/settings/README',
                'fluxedge/account/settings/general-settings',
                {
                  type: 'category',
                  label: 'Security Settings',
                  items: [
                    'fluxedge/account/settings/security-settings/README',
                    'fluxedge/account/settings/security-settings/how-to-set-up-an-anti-phishing-code-on-fluxedge',
                  ],
                },
                'fluxedge/account/settings/notification-settings',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'FAQs',
          items: [
            'fluxedge/faqs/README',
            'fluxedge/faqs/billing-and-payments',
            'fluxedge/faqs/deployment-and-management',
            'fluxedge/faqs/security',
            'fluxedge/faqs/general-information',
          ],
        },
        'fluxedge/protocol-roadmap',
      ],
    },

    // FluxCore Section
    {
      type: 'category',
      label: 'FluxCore',
      items: [
        'fluxcore/overview',
        'fluxcore/fluxcore-web',
        {
          type: 'category',
          label: 'Installation',
          items: [
            'fluxcore/installation/README',
            {
              type: 'category',
              label: 'Windows Installation',
              items: [
                'fluxcore/installation/windows-installation/README',
                {
                  type: 'category',
                  label: 'Troubleshooting',
                  items: [
                    'fluxcore/installation/windows-installation/troubleshooting/README',
                    'fluxcore/installation/windows-installation/troubleshooting/wslrun-wsl.exe-l-exit-status-0xffffffff',
                    'fluxcore/installation/windows-installation/troubleshooting/how-to-download-logs',
                    'fluxcore/installation/windows-installation/troubleshooting/efficient-steps-to-safely-cleanse-your-windows-system-of-fluxcore',
                  ],
                },
              ],
            },
            'fluxcore/installation/linux-headless-installation',
            {
              type: 'category',
              label: 'Linux Installation',
              items: [
                'fluxcore/installation/linux-installation/README',
                {
                  type: 'category',
                  label: 'Troubleshooting',
                  items: [
                    'fluxcore/installation/linux-installation/troubleshooting/README',
                    'fluxcore/installation/linux-installation/troubleshooting/how-to-uninstall-rancher-on-linux-via-command',
                    'fluxcore/installation/linux-installation/troubleshooting/how-to-uninstall-rancher-on-linux-via-ui',
                  ],
                },
              ],
            },
            'fluxcore/installation/fluxcore-supported-nvidia-drivers',
          ],
        },
        'fluxcore/home',
        {
          type: 'category',
          label: 'Machines',
          items: [
            'fluxcore/machines/README',
            'fluxcore/machines/discover-your-machine-id-and-password',
            'fluxcore/machines/how-to-add-machines-to-your-local-fluxcore-gui',
            'fluxcore/machines/connecting-to-your-fluxcore-server-from-another-pc-on-your-local-network-without-installation',
            {
              type: 'category',
              label: 'Individual Machine',
              items: [
                'fluxcore/machines/individual-machine/README',
                'fluxcore/machines/individual-machine/overview',
                'fluxcore/machines/individual-machine/benchmark',
                'fluxcore/machines/individual-machine/hardware',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Mining',
          items: [
            'fluxcore/mining/README',
            'fluxcore/mining/all-about-the-mining-dashboard-module',
            'fluxcore/mining/overclocking-oc-profiles',
            'fluxcore/mining/auto-switch',
          ],
        },
        {
          type: 'category',
          label: 'Services',
          items: [
            'fluxcore/services/README',
            'fluxcore/services/service-module-overview',
            'fluxcore/services/pouw-oc-profiles',
            'fluxcore/services/machine-pricing',
            'fluxcore/services/claiming-rewards',
            'fluxcore/services/faqs',
          ],
        },
        {
          type: 'category',
          label: 'Account',
          items: [
            'fluxcore/account/README',
            'fluxcore/account/overview',
            {
              type: 'category',
              label: 'Audit',
              items: [
                'fluxcore/account/audit/README',
                'fluxcore/account/audit/logs',
                'fluxcore/account/audit/login',
                'fluxcore/account/audit/mining',
                'fluxcore/account/audit/leases',
                'fluxcore/account/audit/rewards-claimed',
              ],
            },
            {
              type: 'category',
              label: 'OC Profiles',
              items: [
                'fluxcore/account/oc-profiles/README',
                'fluxcore/account/oc-profiles/mining-profiles',
                'fluxcore/account/oc-profiles/pouw-profiles',
              ],
            },
            'fluxcore/account/modules',
            'fluxcore/account/contact-details',
            {
              type: 'category',
              label: 'Settings',
              items: [
                'fluxcore/account/settings/README',
                'fluxcore/account/settings/general-settings',
                {
                  type: 'category',
                  label: 'Security Settings',
                  items: [
                    'fluxcore/account/settings/security-settings/README',
                    'fluxcore/account/settings/security-settings/how-to-set-up-an-anti-phishing-code-on-fluxcore',
                  ],
                },
                'fluxcore/account/settings/notification-settings',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'FAQs',
          items: [
            'fluxcore/faqs/README',
            'fluxcore/faqs/rewards-information',
            'fluxcore/faqs/provider-information',
            'fluxcore/faqs/general-information',
            'fluxcore/faqs/security-and-maintenance',
          ],
        },
      ],
    },

    // Resources Section
    {
      type: 'category',
      label: 'Resources',
      items: [
        // Note: External links skipped:
        // - Proof-of-Useful-Work Litepaper (https://pouwlitepaper.app.runonflux.io/)
        // - FluxEdge Economics v1 (https://jetpack2_38080.app.runonflux.io/ipfs/...)
        {
          type: 'category',
          label: 'Socials',
          items: [
            'resources/socials/README',
            // Note: External links in this section would typically be handled via link items or external links
            // For now, keeping only the README
          ],
        },
        // Note: Additional external links skipped:
        // - Terms of Service (https://runonflux.com/terms-of-service/)
        // - Privacy Policy (https://runonflux.com/privacy-policy/)
        // - Blog (https://runonflux.com/blog/)
        // - Support (https://support.runonflux.io/support/home)
      ],
    },
  ],
};

export default sidebars;
