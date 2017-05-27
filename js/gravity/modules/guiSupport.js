/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define([], function () {
    var guiSupport = {};
    
    var initDomInterface = function() {
        guiSupport.domInterface.startPanel = document.getElementById('startPanel');
        guiSupport.domInterface.menu = document.getElementById('menu');
        guiSupport.domInterface.submitBtn = document.getElementById('submit');
        guiSupport.domInterface.menuToggleGrid = document.getElementById('menu-toggle-grid');
        guiSupport.domInterface.massMultiplierInput = document.getElementById('menu-mass-multiplier');
        guiSupport.domInterface.zoomInput = document.getElementById('menu-zoom');
        guiSupport.domInterface.speedInput = document.getElementById('menu-speed');
        guiSupport.domInterface.mainMenuBtn = document.getElementById('menu-main-menu');
        guiSupport.domInterface.restartSpaceBtn = document.getElementById('menu-restart-spacetime');
        guiSupport.domInterface.clearSpaceBtn = document.getElementById('menu-clear-spacetime');
        guiSupport.domInterface.toggleFocusContainer = document.getElementById('menu-toggle-focus-container');
        guiSupport.domInterface.focusContainer = document.getElementById('menu-focus-object-container');
        guiSupport.domInterface.lastFocusBtn = document.getElementById('menu-focus-last');
        guiSupport.domInterface.nextFocusBtn = document.getElementById('menu-focus-next');
        guiSupport.domInterface.focusedId = document.getElementById('focused-object-id');
        guiSupport.domInterface.presetTitles = document.getElementById('presetTitles');
        guiSupport.domInterface.widthCaluculator = document.getElementById("widthCaluculator");
        guiSupport.domInterface.addNewSpaceObject = document.getElementById('add');
        guiSupport.domInterface.codeDiv = document.getElementById('code');
    };
    
    var setupListeners = function() {
        
    };
    
    guiSupport.gui = null;
    guiSupport.domInterface = {};
    
    guiSupport.initialize = function(p_gui) {
        this.gui = p_gui;
        initDomInterface();
        setupListeners();
    };
    
    guiSupport.resizeField = function (element) {
        var text = element.value;
        var id = element.dataset.celestial;
        var property = element.dataset.property;
        var currentSystem = this.gui.getGravitySystem();

        if(element.type === "text") {
            if (text === "") {
                text = element.placeholder;
            }

            this.domInterface.widthCaluculator.dataset.visible = "true";
            this.domInterface.widthCaluculator.innerHTML = text;
            element.style.width = this.domInterface.widthCaluculator.offsetWidth + "px";
            this.domInterface.widthCaluculator.dataset.visible = "false";

            if ("" + currentSystem[id][property] !== text) {
                document.getElementById("systemTitle").innerHTML = "Custom";
                currentSystem[id][property] = parseFloat(text);

                if (selectedButton) {
                    selectedButton.dataset.selected = "false";
                }

                currentButton = null;
                selectedButton = null;
            }
        }
    };

    guiSupport.changeCollapsedStatus = function (evt) {
        console.log(this);
        var element = evt.srcElement;
        var entry = element.id.split("_")[0];
        var status = parseInt(element.dataset.status, 10) === 0 ? 1:0;
        var symbols = element.dataset.symbols.split("|");
        var fieldset = document.getElementById(entry + "_entry");

        element.dataset.status = "" + status;
        element.innerHTML = symbols[status];
        fieldset.dataset.collapsed = "" + (status === 0);
    };
  
    guiSupport.createSpaceObjectsFields = function(title) {
        var refClass = this;
        var spaceObjects = this.gui.getGravitySystem();
        var h2 = document.createElement("H2");
        var noFocus = document.createElement("div");
        var noFocusLabel = document.createElement("label");
        var noFocusField = document.createElement("input");
        var container = this.domInterface.codeDiv;
        
        // Need to avoid the scope change --------------------------------------
        // but I want only one function for any addEventListener
        
        function changeFocus(evt) {
            refClass.gui.changeFocus();
        }
        function resizeField(evt) {
            refClass.resizeField(evt.srcElement);
        }
        // ---------------------------------------------------------------------
        h2.innerHTML = title;
        
        noFocus.id = "noFocusCam";
        
        noFocusLabel.innerHTML = "No Focus: ";
        
        noFocusField.id = "noFocus";
        noFocusField.type = "radio";
        noFocusField.name = "cameraFocus";
        noFocusField.addEventListener("click", changeFocus);
        
        container.innerHTML = "";

        container.appendChild(h2);
        container.appendChild(noFocus);
        noFocus.appendChild(noFocusLabel);
        noFocusLabel.appendChild(noFocusField);

        for (var key in spaceObjects) {
            var currentObject = spaceObjects[key];
            var closeButton = document.createElement("span");
            var collapseButton = document.createElement("span");
            var fieldsContainer = document.createElement("fieldset");
            var fieldsContainerTitle = document.createElement("legend");
            
            fieldsContainer.id= key + "_entry";
            collapseButton.dataset.collapsed = "true";
            
            fieldsContainerTitle.innerHTML = key;
            
            closeButton.id = key + "_remove";
            closeButton.innerHTML = "&#11197;";
            closeButton.addEventListener("click", this.gui.deleteSpaceObject);
            
            collapseButton.id = key + "_visualState";
            collapseButton.dataset.status = "1";
            collapseButton.dataset.symbols = "&#11208;|&#11206;";
            collapseButton.innerHTML = collapseButton.dataset.symbols.split("|")[1];
            collapseButton.addEventListener("click", this.changeCollapsedStatus);

            fieldsContainerTitle.prepend(collapseButton);
            fieldsContainerTitle.prepend(closeButton);
            
            fieldsContainer.appendChild(fieldsContainerTitle);
            container.appendChild(fieldsContainer);

            for (var label in currentObject) {
                if (label !== "path" && label !== "id") {
                    var fieldContainer = document.createElement("div");
                    var fieldLabel = document.createElement("label");
                    var field = null;
                    
                    fieldLabel.innerHTML = label + ": ";
                    
                    if (label === "color") {
                        field = document.createElement("div");
                        field.className = "colorBox";
                        field.style= "background-color: " + currentObject[label];
                    } else {
                        field = document.createElement("input");

                        if (label === "cameraFocus") {
                            field.type = "radio"; 
                            field.name = "cameraFocus";
                            field.checked = currentObject[label] ? true:false;
                            field.addEventListener("click", this.gui.changeFocus);
                        } else {
                            field.type = "text";
                            field.className = "spaceObjectProperty field";
                            field.placeholder= currentObject[label];
                            field.addEventListener("input", resizeField);
                            
                    }
                        }

                    field.id = key + "_" + label;
                    field.dataset.celestial = key;
                    field.dataset.property = label;

                    fieldContainer.appendChild(fieldLabel);
                    fieldContainer.appendChild(field);
                    fieldsContainer.appendChild(fieldContainer);
                    
                    this.resizeField(field);
                }
            }
        }
    };

    return guiSupport;
});
