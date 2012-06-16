/**
 * Controller classes that are used in Garapi 2
 * Author: Hieu Le Trung (letrunghieu.cse09@gmail.com)
 * Date created: June 15th, 2012
 */


/*---------------------------------------------------------------------------*
 * Equation Controller: use to bind the list of equations to the view
/*---------------------------------------------------------------------------*/
Garapi.EquationController = Ember.ArrayController.extend({
	content: []
})

/*---------------------------------------------------------------------------*
 * Main Controller: binded to the Main View
/*---------------------------------------------------------------------------*/
Garapi.AppController = Ember.Object.extend({
	equaCtrl: Garapi.EquationController.create(),	// equation controller
	bgCanvas: Garapi.Canvas.create(),	// the background canvas
	originCoord: {
		x: 0,
		y: 0
	}, // the origin coordinate
	zoomFactor: 1,  // the zoom factor use in zooming
	setting: Garapi.Setting.create(),
	drawBackground: function(){
		
	},
	draw: function(){
		
	}
})
