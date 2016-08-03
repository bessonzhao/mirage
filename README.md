# Mirage

A modern feeling theme for Jenkins CI server.

### Screenshots

<img src="http://unfinisheddev.com/assets/mirage-dashbord.jpg" alt="Jenkins Dashboard" />

<img src="http://unfinisheddev.com/assets/mirage-console-output.jpg" alt="Jenkins Console Output" />

<img src="http://unfinisheddev.com/assets/mirage-configure.jpg" alt="Jenkins Configuration Screen" />

## Installation in Jenkins

If you want everybody who accesses your Jenkins server to see this theme you will need access to install a couple plugins and configure the system.

1. Install [Jenkins Simple Theme Plugin](https://wiki.jenkins-ci.org/display/JENKINS/Simple+Theme+Plugin)
2. Install [jQuery Plugin](https://wiki.jenkins-ci.org/display/JENKINS/jQuery+Plugin)
2. Upload the `dist/mirage.min.css`, `dist/mirage.min.js` and `logo.png` files to a location that is acceesible over HTTP to all your visitors (the `userContent` directory of your Jenkins install is a simple location for this)
3. In Jenkins, click "Manage Jenkins", then "Configure System", then specify the CSS and Javascript URL's for this theme in the Theme section. If you are hosting this theme in `userContent` and using Jenkins default settings, you would enter the following URLs

```
http://<your-jenkins-url>:8080/userContent/mirage.min.css
http://<your-jenkins-url>:8080/userContent/mirage.min.js
```

## Building the Theme

If you want to make modifications to the theme to better suit your branding or taste, you will need a few tools installed:

* [NodeJS](http://nodejs.org)
* [Gulp](http://http://gulpjs.com)

There are a number of tasks available in Gulp. However, there are really only 3 you will need to run:

```
gulp
```

This will run the default task, which will lint the files, compile the Sass and JavaScript, copy required files into the `build` directory (which is mounted in the docker container) and refresh BrowserSync.

```
gulp build
```

This will lint the files, compile the Sass and JavaScript, copy required files into the `build` directory (which is mounted in the docker container).

```
gulp build --release
```

This will ensure all of the asset files are minified and no sourcemaps are generated. All of the minified files will be output to the `dist` directory.

Optionally, if you want to use the [Docker](https://www.docker.com/) container to preview your changes you will need a working [Docker](https://www.docker.com/) environment

There is a `docker-compose.yml` file in the root of the repo that will ensure all of the correct volumes are mounted in the container so the theme files are available. Simple run

```
docker-compose up
```

### Styles

The CSS is compiled from the sass files in `src/sass`. The master file, `src/sass/mirage.scss` includes all of the required files. If you add a new object or component you will need to ensure you import it in this file.

A large amount of the styling can be modified by updating the values in `src/sass/_settings.scss`. This will allow you to change text colours, background colours, font families & sizes, etc. You may find that modifying this file gives you all you need for your updates.

#### Import Order

I have tried, where possible to follow the architecture for the styles that [Harry Roberts](https://twitter.com/csswizardry) recommends in [InuitCSS](https://github.com/inuitcss/getting-started) although as I have no control over the markup of Jenkins there are instances where I've had to deviate.

* *Settings*: Global variables, site-wide settings, config switches, etc.
* *Tools*: Site-wide mixins and functions.
* *Generic*: Low-specificity, far-reaching rulesets (e.g. resets).
* *Base*: Unclassed HTML elements (e.g. a {}, blockquote {}, address {}).
* *Objects*: Objects, abstractions, and design patterns (e.g. .media {}).
* *Components*: Discrete, complete chunks of UI (e.g. .carousel {}). This is the * one layer that inuitcss doesn’t get involved with.
* *Trumps*: High-specificity, very explicit selectors. Overrides and helper classes (e.g. .hidden {}).

#### A Note on IDs for CSS Rules

Generally it is agreed that using IDs for your CSS rules is bad practice. However, as the default Jenkins styles do make heavy use of IDs in their CSS I have also had to in order to match the specificity.

#### Vendor Prefixes

We use the [Autoprefixer](https://www.npmjs.com/package/autoprefixer) module to add vendor prefixes to our CSS automatically. By default the browsers we'll add prefixes for are defined in the `COMPATIBILITY` constant in the `Gulpfile.js`.

## This is *NOT* an Attack on Jenkins

This theme is not an attack or criticism of Jenkins of the developers of Jenkins in anyway! I've used a number of CI servers and I continue to be impressed how it matches and often beats the features and reliability of those others that charge for usage.

I made this theme as a bit of fun and learning opportunity. I hope people like it and use it but this theme is useless without Jenkins, remember that.
