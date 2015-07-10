# BIS Analysis Data Visualization Template

## Intro

* **Public git repository**: [https://github.com/UK-BIS-Analysis/BIS_Viz_Toolkit](https://github.com/UK-BIS-Analysis/BIS_Viz_Toolkit)
* **Private git repository**: [https://bitbucket.org/fmerletti/dbis_bis_viz_toolkit](https://bitbucket.org/fmerletti/dbis_bis_viz_toolkit)
* **Licence**: [MIT](http://opensource.org/licenses/MIT)

### Libraries, frameworks and tools used:

Frontend:

* [Bootstrap](http://getbootstrap.com/): General look, UI, responsiveness
* [jQuery](https://jquery.com/): UI management
* [RequireJS](http://requirejs.org/): Packaging and modularization of the app
* [D3](http://d3js.org/): Graphing and map
* [C3](http://c3js.org): Reusable charts
* [Crossfilter](https://github.com/square/crossfilter): Used as an in-browser database
* [Modernizr](http://modernizr.com/): For checking feature support in browsers

Development tools:

* [Bower.io](http://bower.io/): To manage library dependencies
* [Grunt](http://gruntjs.com/): To package and minify the application

Both are command line tools and depend on NodeJS and NPM being installed on a system. See [nodejs.org](https://nodejs.org/) for installation instructions.

## Technical overview



### Build process: packaging and optimization

The source code of the application is optimized and minified for production use unsing [Grunt](http://gruntjs.com/) based on the ```Gruntfile.js```
script. To run the optimization and generate production code make sure you have all dependencies installed by running (you only need to do
this once on your system):

    npm install
    
You can then generate production code simply by running:

    grunt

The distributable build is generated in the ```build``` directory.

### Code style, notes & other practices

* Normally external libraries would be excluded from the repository and be retrieved upon install using bower. However to make the 
  visualization more portable, even on systems that do not have npm and bower installed they are included in this git repo.
* Remember to modify the index.dev.html file instead of the index.html file in development.
* Variables are preferably named using camelCase
* Indenting is 2 spaces (no tabs)

### Credits

Coding by [Francesco Merletti](http://fm.to.it).

Contacts:

* Email: [me@fm.to.it](mailto:me@fm.to.it)
* Twitter: [@mjs2020](http://fm.to.it/tw)
* Github: [@mjs2020](http://fm.to.it/gh)