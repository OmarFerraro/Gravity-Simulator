// app
var removeEntry;
var collapseEntry;
var openEntry;


define([
	'jquery',
	'underscore',
	'utility/canvasUtil',
	'modules/render',
	'modules/spacetime',
	'modules/gui',
        'modules/guiSupport'
], function($, _, canvasUtil, render, spacetime, gui, guySupport){

	var app = {};

	app.initialize = function(canvasId){
		var canvas = document.getElementById(canvasId);
		var ctx = canvas.getContext('2d');
		var massMultiplier = 200;

		// Initialize the canvas utility, includes features such as autoresize
		canvasUtil.initialize(canvas);
		canvasUtil.autoResize();

		// Initialize spacetime simulation
		spacetime.initialize(massMultiplier);
		spacetime.startLoop();

		// Initialize render module
		render.initialize(canvas, spacetime, massMultiplier);
		render.startLoop();

		// Initialize GUI
		gui.initialize(guiSupport, spacetime, render, canvas, massMultiplier);
	}

	return app;

});
