/**
 * Garapi 2 core classes. These classes must be loaded before the others and
 * after jQuery as well as Ember.js and MathQuill is loaded.
 * Author: Hieu Le Trung (letrunghieu.cse09@gmail.com)
 * Date created: June 15th, 2012
 */

/* The Garapi 2 namespace */
window.Garapi = Ember.Application.create()

/*---------------------------------------------------------------------------*
 * The application info
/*---------------------------------------------------------------------------*/
Garapi.info = Ember.Object.create({
	name: 'Garapi 2',
	version: '2.0.1',
	description: 'The open source online graph editor with HTML and Javascript',
	updated: '2012/06/12'	// The reslease day Y/m/d
})


/*---------------------------------------------------------------------------*
 * The language class 
/*---------------------------------------------------------------------------*/
Garapi.Language = Ember.Object.extend({
	code: ''
	//TODO add more placeholders
})


/*---------------------------------------------------------------------------*
 * The Canvas class: reference to each canvas
/*---------------------------------------------------------------------------*/
Garapi.Canvas = Ember.Object.extend({
	id: 0, // the id of the canvas
	isVisible: true,
	width: 0,
	height: 0,
	htmlId: function(){
		return 'canvas_' + this.get('id');
	}.property('id'),
	zIndex: function(){
		return 90 + 3 * this.get('id');
	}.property()
})


/*---------------------------------------------------------------------------*
 * The setting class 
/*---------------------------------------------------------------------------*/
Garapi.Setting = Ember.Object.extend({
	showGrid: true,
	showAxes: true,
	showLabel: true,
	piModeX: false,
	piModeY: false,
	equalXYScale: true,
	minX: -5,
	maxX: 5,
	minY: -5,
	maxY: 5,
	fontsizeLable: 14,
	lineThick: 2,
	labelGapX: function(){
		var min = this.get('minX');
		var max = this.get('maxX');
		return (min + max) / 10;
	}.property('minX', 'maxX'),
	labelGapY: function(){
		var min = this.get('minY');
		var max = this.get('maxY');
		return (min + max) / 10;
	}.property('minY', 'maxY')
})


/*---------------------------------------------------------------------------*
 * The equation class                                                       
/*---------------------------------------------------------------------------*/
Garapi.Equation = Ember.Object.extend({
	id: 0,
	canvas: null,
	type: 1, // see below 'static' Equation.type object 
	isVisible: true,
	color: '#FF0000',
	funcString1: '',  // default storage for this equation or x-coord
	funcString2: '',  // only used for parametric equation or y-coord
	lowerBound: -Infinity,  // for unequations and parametric equations only
	upperBound: Infinity,   // for unequations and parametric euqations only
	draw: function(canvas, setting){
		// TODO draw here
	}
})

// Auto increment id number
Garapi.Equation.nItem = 0;

// equation types
Garapi.Equation.types = {
	PONT: 0, // a point A[x,y]
	Y_FX: 1, // y = f(x)
	X_FY: 2, // x = f(y)
	F_XY: 3, // f(x,y) = a
	XTYT: 4, // x = x(t), y = y(t)
	UNEY: 5, // f(x) <= y <= g(x)
	UNEX: 6  // f(y) <= x <= g(y)
}

// parse the Tex string to give the function string which can be evaluate in 
// JavaScript
Garapi.Equation.parseFromTex = function(texString){
	result = '';
	
	return result;
}


/*---------------------------------------------------------------------------*
 * The Workspace class: hold the information of all equation as well as the
 * curent settings 
/*---------------------------------------------------------------------------*/
Garapi.Workspace = Ember.Object.extend({
	setting: Garapi.Setting.create(),
	equations: [],
	originCoord: {
		x: 0, y: 0 
	},
	bgCanvas: Garapi.Canvas.create({
		id: '0',
		isVisible: true,
		width: window.innerWidth,
		height: window.innerHeight - 72
	})
})

/* End of garapi2.base.js */