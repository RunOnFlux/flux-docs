---
description: Effortlessly access your Fluxcore machines from anywhere, anytime!
---

# FluxCore Web



<img src="/.gitbook/assets/Screenshot 2024-11-05 110124.png" alt=""/>

We are pleased to introduce SSO (Single Sign-On) external login for managing your Fluxcore machines. Sign in on this page, or sign up to create an account if you don’t already have one!\
[https://app.fluxcore.ai/](https://app.fluxcore.ai/)



<img src="/.gitbook/assets/image (55).png" alt=""/>

Once you’re signed in, you’ll be welcomed by a selection screen. Here, please choose one of the options below to designate a "local machine." This setting can be adjusted anytime if you need to switch to a different machine. In this view, you can manually sort your machines or use the search function to quickly find the machine you’d like to connect to. You can also add a machine by entering its Machine ID and password if you've just set one up!

Additionally, we offer a [Linux headless installation script](installation/linux-headless-installation) that gets your machines set up and ready in seconds, making it easy to configure systems without a display.

<img src="/.gitbook/assets/image (56).png" alt=""/>

If you need to exit your current machine session, just click the icon in the top right corner to return to the main selection screen. Switching machines is rarely necessary, but this option is available if you encounter any issues with a specific machine. Remember, you can control all connected machines from whichever one you're currently using.\
\
**FAQ:**\
**Why do I have to sign in twice?**

_To enhance security, this process requires two steps: first, an initial authentication to establish a secure connection, followed by a secondary local authentication on the device itself. This ensures both network and device-level security._

**Why can't i access my machine through Fluxcor WEB,  i get this message ?**\


<img src="/.gitbook/assets/image (57).png" alt=""/>

1. To solve the above issue you can either uninstall FluxCore by ssh into your machine and run\
   `bash -i <(curl -s https://download.fluxcore.ai/setup.sh)` \
   and select option 2 to uninstall then after completion you need to install FluxCore again .\

2. If you want an easier way without reinstall FluxCore we provide this command you run when you ssh into your machine :\
   `sudo su -`\
   `cd /home/fluxuser` \
   `./fluxcore-linux-amd64 -resetTunnel`\
   \
   after 5 minutes you should be able to connect to that machine, be patient sometimes it takes longer.
