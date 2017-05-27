var presetSystems = [
    {
        "id": 1,
        "name": "Solar System",
        "default": true,
        "spaceObjects": {
            "Sun": {
        		"x": 200,
        		"y": 200,
        		"velX": 0,
        		"velY": 0,
        		"deltaVelX": 0,
        		"deltaVelY": 0,
        		"mass": 500,
        		"density": 0.3,
                "cameraFocus": true,
                "color": "#FFFF00"
        	},
            "Mercury": {
            	"x": 230,
            	"y": 200,
            	"velX": 0,
            	"velY": Math.sqrt(500/30),
            	"deltaVelX": 0,
            	"deltaVelY": 0,
            	"mass": 0.5,
            	"density": 1,
                "cameraFocus": false,
                "color": "#B86200"
            },
            "Venus": {
            	"x": 0,
            	"y": 200,
            	"velX": 0,
            	"velY": -Math.sqrt(500/200),
            	"deltaVelX": 0,
            	"deltaVelY": 0,
            	"mass": 3,
            	"density": 1,
                "cameraFocus": false,
                "color": "#FFCE0A"
            },
            "Earth": {
            	"x": 550,
            	"y": 200,
            	"velX": 0,
            	"velY": Math.sqrt(500/350),
            	"deltaVelX": 0,
            	"deltaVelY": 0,
            	"mass": 6,
            	"density": 0.6,
                "cameraFocus": false,
                "color": "#879FFF"
            },
            "Moon": {
            	"x": 570,
            	"y": 200,
            	"velX": 0,
            	"velY": Math.sqrt(500/350) + Math.sqrt(6/20),
            	"deltaVelX": 0,
            	"deltaVelY": 0,
            	"mass": 0.1,
            	"density": 1,
                "cameraFocus": false,
                "color": "#B0B0B0"
            }
        }
    },
    {
        "id": 2,
        "name": "Binary Stars",
        "spaceObjects": {
            "Star1": {
        		"x": 200,
        		"y": 200,
        		"velX": 0,
        		"velY": -1,
        		"deltaVelX": 0,
        		"deltaVelY": 0,
        		"mass": 500,
        		"density": 0.1,
                "cameraFocus": false,
                "color": "#FFFF00"
        	},
            "Star2": {
        		"x": 400,
        		"y": 200,
        		"velX": 0,
        		"velY": 1,
        		"deltaVelX": 0,
        		"deltaVelY": 0,
        		"mass": 500,
        		"density": 0.1,
                "cameraFocus": false,
                "color": "#FFFF00"
        	},
        }
    }
];