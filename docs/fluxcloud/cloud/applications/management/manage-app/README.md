# Manage App

The **Manage App** section is your control panel for operating and maintaining your application on the Flux Cloud. It offers both granular and global control over your app’s deployment, behavior, and resources.

This is where developers, sysadmins, and DevOps teams go to keep their apps performant, secure, and under control.

#### How To Access

> **Management → My Active Apps → Manage**

Open the **Management** tab in the **Applications** menu, select an application from **My Active Apps**, and click **Manage**.

***

### Choosing The Right Tool

A quick reference to help you choose the right tool for the task, with links to detailed documentation and answers to frequently asked questions.

| **If you want to…**                         | **Go to…**                                                                       |
| ------------------------------------------- | -------------------------------------------------------------------------------- |
| Debug a specific app instance               | Local App Management (see tabs below)                                            |
| View or compare node-level specs            | [Specifications](specifications)                                                 |
| Inspect container metadata                  | [Information](information)                                                       |
| Monitor real-time system usage              | [Monitoring](monitoring#stats-overview)                                          |
| Analyze historical performance trends       | [Monitoring](monitoring#stats-overview)                                          |
| Track file-system changes                   | [File Changes](file-changes)                                                     |
| See running processes inside your container | [Monitoring](monitoring#processes-overview)                                      |
| Read your app's logs                        | [Log Files](logs)                                                                |
| Start, stop, pause, or redeploy single node | [Control](control)                                                               |
| Run a terminal or modify files in-container | [Secure Shell](secure-shell), [Volume Browser](secure-shell#volume-browser)     |
| Backup or restore container data            | [Backup & Restore](backup-and-restore)                                           |
| Manage global deployment (all nodes)        | [Control](control)                                                               |
| View all running instances across the world | [Instances](instances)                                                           |
| Cancel or pause billing/subscription        | [Subscription](subscription#cancel)                                              |
| Update your app's configuration or version  | [Subscription](subscription#update)                                              |

***

### Frequently Asked Questions

#### How can I update my app after it's deployed?

Read more about [Update App](subscription#update)

***

#### Where do I open a shell inside my container?

You need to access the interactive terminal tool for the FluxNode you want to control. Read more about [Secure Shell](secure-shell)

***

#### How do I back up my data?

Navigate to **Component Control → Backup & Restore** and choose **Create Backup.** Read more about [Backup & Restore](backup-and-restore)

***

#### How do I cancel my subscription without losing data?

First back up your container via **Component Control → Backup & Restore**, then cancel at **Global App Management → Cancel Subscription**. Read more about [Subscription](subscription#cancel)
