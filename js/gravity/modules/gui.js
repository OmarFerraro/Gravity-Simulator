// modules/gui
// handles user input between spacetime and renderer
var gui = null;
    var removeEntry = function(entry) {
        var fieldset = document.getElementById(entry + "_entry");

        gui.deleteSpaceObject(entry);
    }

    var collapseEntry = function(entry) {
        var fieldset = document.getElementById(entry + "_entry");
        var collapseButton = document.getElementById(entry + "_collapse");
        var expandButton = document.getElementById(entry + "_expand");

        collapseButton.dataset.visible = "false";
        expandButton.dataset.visible = "true";
        fieldset.dataset.collapsed = "true";
    }

    var openEntry = function(entry) {
        var fieldset = document.getElementById(entry + "_entry");
        var collapseButton = document.getElementById(entry + "_collapse");
        var expandButton = document.getElementById(entry + "_expand");

        collapseButton.dataset.visible = "true";
        expandButton.dataset.visible = "false";
        fieldset.dataset.collapsed = "false";
    }

    var cameraFocusChanged = function() {
        gui.changeFocus();
    }

define([
	'jquery',
	'underscore'
], function($, _){

	/**************
		Private
	**************/

	var spacetime      = undefined;
	var render 		   = undefined;
	var canvas 		   = undefined;
	var massMultiplier = undefined; // How exagurated the size of the objects are (humans like that)

	// Function that controls the left mouse which controls the massbuilder
	/*
		States:
			placement
			mass
			velocity
	*/

	var mouse = {
		visible: true,
		x: 0,
		y: 0,
		x2: 0,
		y2: 0,
		radius: 0,
		state: 'placement'
	};

	var massBuilder = function(e){
		switch(mouse.state){
			case 'placement':
				// This state ^
				mouse.state = 'mass';
				mouse.x2 = e.clientX;
				mouse.y2 = e.clientY;
				mouse.radius = 0;
			break;
			case 'mass':
				// This state ^
				mouse.radius = Math.sqrt(Math.pow(mouse.x-mouse.x2,2)+Math.pow(mouse.y-mouse.y2,2));

				if (e.type === 'mousedown') {
					mouse.state = 'velocity';
				};
			break;
			case 'velocity':
				// This state ^

				if (e.type === 'mousedown') {
					mouse.radius /= render.getCamera().zoom;

					spacetime.addObject({
						x: render.getCamera().getMouseX(mouse.x2),
						y: render.getCamera().getMouseY(mouse.y2),
						velX: -(mouse.x - mouse.x2) / 100,
						velY: -(mouse.y - mouse.y2) / 100,
						mass: (4/3*Math.PI) * Math.pow(mouse.radius, 3) / massMultiplier,
						density: 1,
						path: []
					});

					// Reset state machine
					mouse.state = 'placement';
					mouse.radius = 0;
				};
			break;
		}
	}

	var mouseMove = function(e){
		// console.log('x:' + e.clientX + ' y:' + e.clientY);
		mouse.x = e.clientX;
		mouse.y = e.clientY;

		if (mouse.state === 'mass' || mouse.state === 'velocity') {
			massBuilder(e);
		};

		render.setMouse(mouse);
	}

	/*************
		Public
	*************/

	var guiApi = {};


    window.removeEntry = this.removeEntry;
    window.collapseEntry = this.collapseEntry;
    window.openEntry = this.openEntry;

    guiApi.changeFocus = function() {
        var toggleFocusContainer = document.getElementById('menu-toggle-focus-container');
        var focusContainer = document.getElementById('menu-focus-object-container');
        var focusFields = document.getElementsByName('cameraFocus');
		var focusedId = document.getElementById('focused-object-id');

        for(var i=0; i<focusFields.length; i++) {
            var currentField = focusFields[i];

            if(currentField.dataset.celestial && currentField.dataset.property) {
                var id = currentField.dataset.celestial;
                var property = currentField.dataset.property;

                currentSystem[id][property] = currentField.checked;

                if(currentField.checked) {
                    focusedId.innerHTML = id;
                    toggleFocusContainer.checked = true;
                    focusContainer.dataset.visible = "true";
                }
            } else if(currentField.checked) {
                focusedId.innerHTML = "";
                toggleFocusContainer.checked = false;
                focusContainer.dataset.visible = "false";
            }
        }
    }

    guiApi.deleteSpaceObject = function(id) {
        delete currentSystem[id];
        code.innerHTML = this.prettyfyCode("Custom", currentSystem);
        this.initializeCodeFields();
        this.changeFocus();

        if(selectedButton) {
            selectedButton.dataset.selected = "false";
        }
        currentButton = null;
        selectedButton = null;
    }

    gui = guiApi;

	guiApi.prettyfyCode = function(title, spaceObjects) {
        var code = '<h2 id="systemTitle">' + title + '</h2>';

        code += '<div><label>No cameraFocus';
        code += ': <input id="noFocus" type="radio" name="cameraFocus" onclick="cameraFocusChanged(this);" checked /></div>';

        for(var key in spaceObjects) {
            var currentObject = spaceObjects[key];
            var closeButton = '<span id="' + key + '_remove" onclick="removeEntry(\'' + key + '\')">&#11197;</span> ';
            var collapseButton = '<span id="' + key + '_collapse" onclick="collapseEntry(\'' + key + '\')" data-visible="true">&#11206;</span>';
            var expandButton = '<span id="' + key + '_expand" onclick="openEntry(\'' + key + '\')" data-visible="false">&#11208;</span>';

            code += '<fieldset id="' + key + '_entry" data-collapsed="false"><legend> ' + closeButton + collapseButton + expandButton + key + '</legend>';

            for(var label in currentObject) {
                if(label !== "path" && label !== "id") {
                    code += '<div>';
                    code += '<label>' + label;

                    if(label === "color") {
                        code += ': <div class="colorBox" style="background-color: ' + currentObject[label] + '"></div>';
                    } else if(label === "cameraFocus") {
                        code += ': <input id="' + key + '_' + label + '" data-celestial="' + key + '" data-property="' + label + '" type="radio" name="cameraFocus" onclick="cameraFocusChanged(this);" ' + (currentObject[label] ? "checked":"" ) + '/>';
                    } else {
                        code += ': <input id="' + key + '_' + label + '" data-celestial="' + key + '" data-property="' + label + '" type="text" class="spaceObjectProperty field" placeholder="' + currentObject[label] + '"/>';
                    }
                    code += '</label></div>';
                }
            }

            code += "</fieldset>";
        }

        return code;
    }

    guiApi.resizeField = function(element) {
        var currentSpan = document.getElementById("widthCaluculator");
        var text = element.value;
        var id = element.dataset.celestial;
        var property = element.dataset.property;

        if(text === "") {
            text = element.placeholder;
        }

        currentSpan.dataset.visible = "true";
        currentSpan.innerHTML = text;
        element.style.width = currentSpan.offsetWidth + "px";
        currentSpan.dataset.visible = "false";

        if("" + currentSystem[id][property] !== text) {
            document.getElementById("systemTitle").innerHTML = "Custom";
            currentSystem[id][property] = parseFloat(text);

            if(selectedButton) {
                selectedButton.dataset.selected = "false";
            }

            currentButton = null;
            selectedButton = null;
        }
    }

    var currentSystem = null;
    var lastSelectedIndex = -1;
    guiApi.initSpaceSystem = function() {
        for(var key in currentSystem) {
            currentSystem[key].path = [];
            currentSystem[key].id= key;
            spacetime.addObject( currentSystem[key] );
        }
    }

    guiApi.initializeCodeFields = function() {
        var elements = document.getElementsByClassName("spaceObjectProperty field");
        for(var i=0; i<elements.length; i++) {
            this.resizeField(elements[i]);
            elements[i].addEventListener("input",
                function(evt) {
                    guiApi.resizeField(evt.currentTarget);
                }
            );
        }
    }

	guiApi.initialize = function(p_spacetime, p_render, p_canvas, p_massMultiplier) {
		spacetime = p_spacetime;
		render = p_render;
		canvas = p_canvas;
		massMultiplier = p_massMultiplier;

		var startPanel = document.getElementById('startPanel');
		var menu = document.getElementById('menu');

        var addNewSpaceObject = document.getElementById('add');
		addNewSpaceObject.addEventListener('click', function() {
            var id = prompt("Please enter the new object name", "celestial" + Date.now());
            if (id != null && id.trim!=="" && !currentSystem[id]) {
                currentSystem[id] = {
            		"x": 0,
            		"y": 0,
            		"velX": 0,
            		"velY": 0,
            		"deltaVelX": 0,
            		"deltaVelY": 0,
            		"mass": 0,
            		"density": 0,
                    "cameraFocus": false,
                    "color": "#FFFF00"
            	};

                code.innerHTML = guiApi.prettyfyCode("Custom", currentSystem);
                guiApi.initializeCodeFields();
                guiApi.changeFocus();
                if(selectedButton) {
                    selectedButton.dataset.selected = "false";
                }
                currentButton = null;
                selectedButton = null;

                code.scrollTop = code.scrollHeight;
            }
		});

		var emptyBtn = document.getElementById('empty');
		emptyBtn.addEventListener('click', function() {
            if(selectedButton) {
                selectedButton.dataset.selected = "false";
            }
            selectedButton = null;
            code.innerHTML = "";
            currentSystem = {};
		});

		var gravityDisk = document.getElementById('gravityDisk');
		gravityDisk.addEventListener('click', function() {
            lastSelectedIndex = -1;

            if(selectedButton) {
                selectedButton.dataset.selected = "false";
            }
            selectedButton = null;
            code.innerHTML = "";

            var starCenterX = 350;
            var starCenterY = 100;

            currentSystem = {
                "Star": {
            		"x": starCenterX,
            		"y": starCenterY,
            		"velX": 0,
            		"velY": 0,
            		"deltaVelX": 0,
            		"deltaVelY": 0,
            		"mass": 0,
            		"density": 0,
                    "cameraFocus": false,
                    "color": ('#' + Math.floor(Math.random()*16777215).toString(16)).toUpperCase()
                }
            }

    		for (var i = 0; i < 100; i++) {
    			var radian = Math.random() * 2 * Math.PI;

    			var height = canvas.height;
    			var width = canvas.width;

    			// var distance = Math.sqrt(Math.pow(370, 2) * Math.random()) + 30; // Distributed
    			var distance = (Math.random()*250) + 100; // Favorable to cluster near center

    			var x = starCenterX + Math.cos(radian)*distance;
    			var y = starCenterY + Math.sin(radian)*distance;

    			var beltSpeed = 1000;
    			var speedRand = Math.random() * 10 + 0.995

                currentSystem["Dust_" + (i + 1)] = {
    				x: x,
    				y: y,
    				velX: Math.cos(radian + Math.PI/2 + (Math.PI/180*0.5 - Math.PI/180*1)) * Math.sqrt(1.55/distance) * speedRand,
    				velY: Math.sin(radian + Math.PI/2 + (Math.PI/180*0.5 - Math.PI/180*1)) * Math.sqrt(1.55/distance) * speedRand,
    				deltaVelX: 0,
    				deltaVelY: 0,
    				mass: Math.random() * 0.1,
    				density: 1,
                    cameraFocus: false,
                    color: ('#' + Math.floor(Math.random()*16777215).toString(16)).toUpperCase()
                }
    		}

            code.innerHTML = guiApi.prettyfyCode(this.value, currentSystem);
            guiApi.initializeCodeFields();
            guiApi.changeFocus();
		});

		var submitbtn = document.getElementById('submit');
		submitbtn.addEventListener('click', function() {
            guiApi.initSpaceSystem();
            startPanel.dataset.visible="false";
            menu.dataset.visible="true";
		});

		document.getElementById('menu-toggle-grid').checked = 1;
		document.getElementById('menu-toggle-grid').addEventListener('change', function() {
			render.toggleGrid();
		});

		var massMultiplierInput = document.getElementById('menu-mass-multiplier');
		massMultiplierInput.value = 200;
		massMultiplierInput.addEventListener('change', function() {
			massMultiplier = massMultiplierInput.value;
			render.updateMassMultiplier(massMultiplierInput.value);
			spacetime.updateMassMultiplier(massMultiplierInput.value);
		});

		var zoomInput = document.getElementById('menu-zoom');
		zoomInput.value = 1;
		zoomInput.addEventListener('change', function() {
			render.changeZoom(zoomInput.value);
		});

		var speedInput = document.getElementById('menu-speed');
		speedInput.value = 1;
		speedInput.addEventListener('change', function() {
			spacetime.calculationSpeed(speedInput.value);
		});

		var mainmenubtn = document.getElementById('menu-main-menu');
		mainmenubtn.addEventListener('click', function() {
			spacetime.clearSpacetime();
            startPanel.dataset.visible="true";
            menu.dataset.visible="false";
		});

		var clearspacebtn = document.getElementById('menu-restart-spacetime');
		clearspacebtn.addEventListener('click', function() {
			spacetime.clearSpacetime();
            guiApi.initSpaceSystem();
		});

		var clearspacebtn = document.getElementById('menu-clear-spacetime');
		clearspacebtn.addEventListener('click', function() {
			spacetime.clearSpacetime();
		});

        var toggleFocusContainer = document.getElementById('menu-toggle-focus-container');
        var focusContainer = document.getElementById('menu-focus-object-container');
		toggleFocusContainer.addEventListener('click', function() {
			focusContainer.dataset.visible = "" + this.checked;
            if(this.checked) {
                focusedId.innerHTML = spacetime.cycleFocus();
            } else {
                spacetime.clearFocus();
            }
		});

		var lastFocusBtn = document.getElementById('menu-focus-last');
		var nextFocusBtn = document.getElementById('menu-focus-next');
		var focusedId = document.getElementById('focused-object-id');
		lastFocusBtn.addEventListener('click', function() {
			focusedId.innerHTML = spacetime.cycleFocus(-1);
		});
		nextFocusBtn.addEventListener('click', function() {
			focusedId.innerHTML = spacetime.cycleFocus(1);
		});

        var presetTitles = document.getElementById('presetTitles');
        for(var i=0; i<presetSystems.length; i++) {
            if(presetSystems[i].default) {
                presetTitles.innerHTML += '<div class="presetButton" data-system="' + i + '" data-selected="true">' + presetSystems[i].name + '</div>';
                currentSystem = JSON.parse( JSON.stringify(presetSystems[i].spaceObjects) );
                code.innerHTML = this.prettyfyCode(presetSystems[i].name, currentSystem);
                lastSelectedIndex = i;
            } else {
                presetTitles.innerHTML += '<div class="presetButton" data-system="' + i + '" data-selected="false">' + presetSystems[i].name + '</div>';
            }
        }

        var buttons = document.getElementsByClassName("presetButton");
        for(var i=0; i<buttons.length; i++) {
            if(buttons[i].dataset.selected === "true") {
                selectedButton = buttons[i];
            }

            buttons[i].addEventListener("click",
                function(evt) {
                    var currentButton = evt.currentTarget;
                    var index = parseInt(evt.currentTarget.dataset.system, 10);

                    lastSelectedIndex = index;
                    currentSystem = JSON.parse( JSON.stringify(presetSystems[index].spaceObjects) );

                    if(selectedButton) {
                        selectedButton.dataset.selected = "false";
                    }
                    currentButton.dataset.selected = "true";
                    selectedButton = currentButton;
                    code.innerHTML = guiApi.prettyfyCode(presetSystems[index].name, currentSystem);
                    guiApi.initializeCodeFields();
                    guiApi.changeFocus();
                }
            );
        }

        this.initializeCodeFields();
        this.changeFocus();

		canvas.onmousedown = function(e) {
            switch(e.which) {
                case 1:
                    massBuilder(e);
                break;
                case 2:

                break;
                default:

            }
		};

		canvas.onmousemove = function(e){
			mouseMove(e);
		}
	}

	return guiApi;

});
