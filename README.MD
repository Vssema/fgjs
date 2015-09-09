##FogCloud
	This is the js for FogCloud, and js's name is fgjs, you can try var fg = require("fgjs");

watchify fgjs.js -o FG-0.0.1.min.js
browserify fgjs.js -t | uglifyjs -cm >  FG-0.0.1.min.js