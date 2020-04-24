# :file_folder: habiticaScripts

![Repo status](https://www.repostatus.org/badges/latest/active.svg)
[![Build Status](https://travis-ci.com/Markkop/habiticaScripts.svg?branch=master)](https://travis-ci.com/Markkop/habiticaScripts)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/1d211bd40a704168a38fd73bea1eb535)](https://www.codacy.com/manual/Markkop/habiticaScripts?utm_source=github.com&utm_medium=referral&utm_content=Markkop/habiticaScripts&utm_campaign=Badge_Grade)
[![codecov](https://codecov.io/gh/Markkop/habiticaScripts/branch/master/graph/badge.svg)](https://codecov.io/gh/Markkop/habiticaScripts)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/Markkop/habiticaScripts/issues)
[![Awesome Badges](https://img.shields.io/badge/badges-awesome-green.svg)](https://github.com/Naereen/badges)

:rocket: **habiticaCustomSkills project has been renamed to habiticaScripts**

## Motivation

While using Habitica to organize myself I ended up **outleveling my friends** and wondered how I could adjust my leveling process to keep up with the party.
That's how this project begins. By creating new skills and **consuming experience points** , I've slow down my leveling in exchange for other resources such hp, Then I got pretty hyped to expand these customizations even further with other people contributions and transformed a single script file in this cool **custom suite**. We even have badges!

## How to install these scripts

1.  Install the userscript manager **Violentmonkey** for [FireFox](https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/) or [Chrome](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag?hl=en)
2.  Go to [dist](https://github.com/Markkop/habiticaScripts/tree/master/dist) folder, select a script and view it as raw by clicking in the `Raw` button
3.  Confirm userscript instalation
4.  Access/reload [Habitica](https://habitica.com/)'s home

## Scripts

### 🍅 habiticaPomodoro

Transforms a task named **#pomodoro** to a Pomodoro Timer. It emits a **sound** after each time interval and at the end of the last, it **scores** a good habit on Habitica. Both time intervals can be customized.

**[Click here](https://github.com/Markkop/habiticaScripts/raw/master/dist/habiticaPomodoro.user.js) to install**
<img src="https://i.imgur.com/73GEP1U.gif"/>

### 🔮 habiticaCustomSkills

Get new customizable **skills** for your class. It's possibile to consume or reward **hp**, **mana**, **exp** and **gold**. Modifiers can be **flat**, **%max**, **%current** or **random** values.

**[Click here](https://github.com/Markkop/habiticaScripts/raw/master/dist/habiticaCustomSkills.user.js) to install**
<img src="https://i.imgur.com/HMcUVEq.png"/>

### ⌨️ habiticaShortcuts

Bang! Using the keyboard we went to the moon! With shortcuts we can reacha series of places that make our lives easier!

**[Click here](//:nope.com/Markkop/habiticaScripts/raw/master/dist/habiticaCustomSkills.user.js) to install**
<img src="https://i.imgur.com/nope.png"/>

## How to develop

1.  Allow Violentmonkey to [access file urls](https://violentmonkey.github.io/posts/how-to-edit-scripts-with-your-favorite-editor/#install-a-local-script) in Chrome
2.  Drag the script file in local `dist` folder to the browser or run `google-chrome dist/scriptName.js`
3.  Confirm userscript installation and keep this tab open to track changes
4.  Run `npm install` to install dependencies
5.  Run `npm run dev` and select `build:watch` to rebuild on file change
6.  On another terminal run `npm run dev` and select `test:watch` to watch tests on file change

Tip: Use [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and [Formatting Toggle](https://marketplace.visualstudio.com/items?itemName=tombonnike.vscode-status-bar-format-toggle) for code formatting
