---
title: "Headless DDE Builds With Jenkins CI"
description: "automation is king"
pubDatetime: 2016-03-25
published: true
series: build-automation
tags: ["xpages", "dde", "jenkins"]
canonical_url: false
category: xpages
permalink: /headless-dde-and-jenkins/
redirect_from: /xpages/headless-dde-and-jenkins/
toc: true
---

### Intro

[Last time](/xpages/xsltproc-and-headless-dde/) I described a major building block which has made my efforts to have a build automation machine (in the process of being turned into a vm) for my largest application. This includes a number of advantages, from being able to produce a copy of the application design at a given commit/tag/version from its git repository on demand or on schedule. It also means that the many possibilities when it comes to being able to hook in the creation of a current javadoc, unit testing, and more. The sky is the limit and I'm setting down some of what I do with my current headless dde build task from my Jenkins CI instance.

Please note, I'm not much in favor of repeating myself or others' works. While I wrote a fair amount about some of the basics of task runner use, much of which can be found elsewhere, I did so to build a platform for the uninitiated, as my focus was always on the end goal of how it hooks into my development workflow; the workflow of a developer with Domino/XPages, that's the unique aspect. When it comes to this post, I won't be talking about the details of what to do to create a Jenkins CI instance or perform some of the already well established requirements, but rather I'm going to assume that:

- you know what [headless designer](https://www-10.lotus.com/ldd/ddwiki.nsf/dx/Headless_Designer_Wiki) (dde) means
- you're familiar with what [Jenkins CI](https://jenkins.io/) is
- you've read a combination of [Cameron Gregor's](https://camerongregor.com/2014/08/09/build-system-for-xpages-and-osgi-plugins/) blog post [Martin Pradny's](https://www.pradny.com/2014/03/build-xpages-app-from-git-with-jenkins.html) post on the subject; I recommend both
- you know that [automating this stuff](https://www.youtube.com/watch?v=6BIDNfOrnAY) is possibly one of the coolest things ever

### What We Need

- Windows OS w/
  - Domino Designer installed for headless DDE builds
  - Notes SSO (so no pw prompt; this worked for me, others have recommended a Notes ID w/ no password, use your discretion or a friendly aligned admin's discretion)
  - `DESIGNER_AUTO_ENABLED=true` set in `notes.ini`
  - similar/same Designer and Server environments
    - at same FP/version as server environments
    - any dependent OSGi plugins for DDE installed
    - any dependent JARs from server/apps installed to `<installDir>/jvm/lib/ext/`
  - (optional) recommended: Notes Client Killer installed
- Jenkins CI installed as an "app"
  - to run as logged in user (does not happen if done as a Windows service, sadly; gets a little fiddly)
  - configured to allow interacting with the desktop (may only apply to Jenkins as a service, but it's set up in my environment)
  - task will contain (by my implementation) 4 steps (optional 5th)
    1. (optional\*, unless large NSF w/ build issues) the xslt processing assets (from [my last blog post](/xpages/xsltproc-and-headless-dde/)) to ensure a clean ODP import by headless DDE
    2. (optional) Notes Client Killer (helps, in case Jenkins task +/- headless DDE gets hung; at a minimum, have a separate Jenkins task to call the client killer)
    3. PowerShell (installed for Windows, also a PS script, below) to execute the headless DDE build
    4. scan the `HEADLESS0.log` for whether to mark the task a failure (Jenkins had mis-reported "SUCCESS" when the headless DDE call failed to build a usable NSF)
    5. (optional) [SonarQube](https://www.sonarqube.org/) [analysis](https://docs.sonarqube.org/display/SONAR/Analyzing+Source+Code) ([previously covered](https://edm00se.io/self-promotion/docker-plus-sonarqube))
- git/hg/scm repository access to the project(s) in question, at least visible to the Jenkins instance
- (optional) a SonarQube (server) environment set up, scanner installed and config'd correctly for shell use w/ Jenkins
- (optional) recommended: Color ANSI plugin (to make better console output for Jenkins)

Go ahead, I'll wait while you set it all up (yes, I'm full of snarcasm).

### Steps In A Headless Designer Task

The below are different "build" scripts (some as BASH-like/compatible, one in particular is PowerShell, with the Jenkins PowerShell plugin). Together, they make up a larger "Jenkins task", which I started as a "Freestyle project" and set up the git repository association for. In theory, I could drive every release to the master branch into a build, but currently, I've added a build parameter, so that I am prompted for either a git commit or tag (in my case, version numbers) of which to build. Otherwise, things like setting up email notifications, etc. are all up to you.

#### 1. Metadata Filtering

If you're unlucky enough to have a large enough Domino application to not want to use Build Automatically in DDE and not be able to benefit from the use of swiper, you'll want to filter your metadata before the headless designer import, as with my experience, dde will choke and create a useless file. This script ensures a fetch from the git remote (origin) and pulls down the specified Jenkins build parameter (`$TAGNAME`) from which to build. It then checks for a `package.json` and `Gruntfile.js` in the project, copying in a boilerplate copy (in [yesterday's blog post](/xpages/xsltproc-and-headless-dde/)) and updates the relative ODP (On Disk Project) path, as needed. The boilerplate `Gruntfile.js` assumes an ODP directory of `ODP/`, so the script here is changing that to `NSF/`. Lastly, it runs the install of the npm dependencies; not much, mostly just grunt and a couple grunt plugins.

{% gist "edm00se", "d30002d54e07fe13f2ae", "1-xsltproc4domino.sh" %}

#### 2. Killing Previous Notes Processes

This is debatable, but after having no (visually noticeable) notes process running and not seeing any successful builds, I added this to the Jenkins task. I keep a separate "admin" task which is just the [notes client killer](https://www.xpagedeveloper.com/software/client-killer), for emergencies. It's worth noting, the Jenkins instance shouldn't attempt more than one headless dde build at a time.

{% gist "edm00se", "d30002d54e07fe13f2ae", "2-notesKiller.bat" %}

#### 3. Headless DDE

Time to build. This is an adapted version of the PowerShell script from Egor Margineanu, which I found out about from Cameron's blog post. Up front, I'm defining the project name, then the build name (which drives off the build number and project name).

{% gist "edm00se", "d30002d54e07fe13f2ae", "3-headlessDDE.ps1" %}

#### 4. Improving Build Status

I had a few builds get flagged by Jenkins as successful, even though they failed to generate anything worthwhile. To compensate, this script checks for the `HEADLESSS0.log` and checks its contents for "job error", to see if dde is reporting out a failure; it flags the build accordingly.

{% gist "edm00se", "d30002d54e07fe13f2ae", "4-setBuildStatus.sh" %}

#### 5. (Optional) Send to SonarQube

Let's face it, I really like SonarQube. It may not amount to much more than an automated peer review, but that's good and insightful stuff. You can skip this, obviously; mine's (currently) pushing to a docker image on the same PC, [like I demonstrated previously](/self-promotion/docker-plus-sonarqube/).

{% gist "edm00se", "d30002d54e07fe13f2ae", "5-sonar.sh" %}

### Summary

All in all, this is a big topic, but full of incredibly useful potential for those of us looking to "level up" our development workflows. Automation is king, in IT much in the same way that my accounting professor would exclaim "cash is king"; in my opinion. The more we can automate, the more we can focus on _actual development_.
