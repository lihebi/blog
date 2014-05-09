---

layout: hebi-post
title: Yeoman & Grunt & Bower
location: 合肥
time: 08:49:25

---

## Grunt

```
grunt --help # list all available tasks
```

#### Workflow

```
# Preview an app you have generated (with Livereload).
grunt serve

# Run the unit tests for an app.
grunt test

# Build an optimized, production-ready version of your app.
grunt
```

#### grunt wildcard

```
exports.warnOn = 'Gruntfile.js';        // Warn on a Gruntfile.js file.
exports.warnOn = '*.js';            // Warn on any .js file.
exports.warnOn = '*';               // Warn on any non-dotfile or non-dotdir.
exports.warnOn = '.*';              // Warn on any dotfile or dotdir.
exports.warnOn = '{.*,*}';          // Warn on any file or dir (dot or non-dot).
exports.warnOn = '!*/**';           // Warn on any file (ignoring dirs).
exports.warnOn = '*.{png,gif,jpg}'; // Warn on any image file.

// This is another way of writing the last example.
exports.warnOn = ['*.png', '*.gif', '*.jpg'];
```

## 杂

```
# Not only will this install <module> locally,
# but it will automatically be added to the devDependencies section, using a tilde version range.
npm install <module> --save-dev.
# 会同时把它加入bower.json
bower install bootstrap --save
```

## Bower

```
npm install -g bower

bower help
bower search xxx
bower install xxx
bower install xxx#version

bower install # in bower.json

bower uninstall xxx

bower init # create bower.json

bower list
bower update xxx
bower info bootstrap
bower uninstall jquery
```

## Yeoman

```
npm install -g yo
npm install -g generator-webapp
cd myapp
yo webapp


for angularjs app:
npm install -g generator-angular
yo angular
```

#### Workflow

```
yo webapp
grunt serve
grunt test
grunt
```

#### Use bower with yeoman

```
# Scaffold a new application.
yo webapp

# Search Bower's registry for the plug-in we want.
bower search jquery-pjax

# Install it and save it to bower.json
bower install jquery-pjax --save

# If you're using RequireJS...
# (be aware that currently the webapp generator does not include RequireJS and the following command only applies to generators that do)
grunt bower
> Injects your Bower dependencies into your RequireJS configuration.

# If you're not using RequireJS...
grunt bowerInstall
> Injects your dependencies into your index.html file.
```
