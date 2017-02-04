/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

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
    
    guiSupport.gui = null;
    guiSupport.domInterface = {};
    
    guiSupport.initialize = function(p_gui) {
        this.gui = p_gui;
        initDomInterface();
    };
