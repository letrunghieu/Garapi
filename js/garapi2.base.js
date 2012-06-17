/**
 * Garapi 2 core classes. These classes must be loaded before the others and
 * after jQuery as well as Ember.js and MathQuill is loaded.
 * Author: Hieu Le Trung (letrunghieu.cse09@gmail.com)
 * Date created: June 15th, 2012
 */

/* The Garapi 2 namespace */
window.Garapi = Ember.Application.create()

Garapi.round = function(val){
	return ~~(val + (val > 0 ? .5 : -.5));
}

Garapi.ceil = function(val){
	return (val | 0) + (val > 0? 1: 0);
}

/* trace the change of the miror unit */ 
Garapi.MirorUnit = Ember.Object.extend({
	base: 0.1,
	scaleIndex: 1,	// zero-based of Garapi.MirorUnit.scale array
	value: function(){
		return this.base * Garapi.MirorUnit.scale[this.scaleIndex];
	}.property('base', 'scaleIndex'), //may be imprecision when multiple to 3, e.g. 0.15000000000000002
	multiple: function(n) {
		return n * Garapi.MirorUnit.scale[this.scaleIndex] * this.base;
	}, // the hack to avoid the imprecision
	next: function(){
		if (this.scaleIndex == Garapi.MirorUnit.scale.length - 1){
			this.set('base', this.base * 10);
			this.set('scaleIndex', 0);
		}
		else {
			this.set('scaleIndex', this.scaleIndex + 1);
		}
		return this;
	},
	previous: function(){
		if (this.scaleIndex == 0){
			this.set('base', this.base / 10);
			this.set('scaleIndex', Garapi.MirorUnit.scale.length - 1);
		}
		else {
			this.set('scaleIndex', this.scaleIndex - 1);
		}
		return this;
	}
})
Garapi.MirorUnit.scale = [1, 2, 4];

/*---------------------------------------------------------------------------*
 * The application info
/*---------------------------------------------------------------------------*/
Garapi.info = Ember.Object.create({
	name: 'Garapi 2',
	version: '2.0.1',
	description: 'The open source online graph editor with HTML and Javascript',
	updated: '2012/06/12',	// The reslease day Y/m/d
	zoomFactor: 1.1,
	grid: {
		nMiror: 5,
		maxXGapMiror: 50,
		maxYGapMiror: 50,
		sXGapMiror: 30,
		sYGapMiror: 30,
		minXGapMiror: 20,
		minYGapMiror: 20
	},
	color: {
		mirorGrid: "#E7EEF5",
		majorGrid: "#DDE0E2",
		axes: "#788898"
	},
	labelSpace:{
		x: 7.5,
		y: 7.5
	},
	sidebar: {
		width: 300
	},
	dimension: {
		canvasDeltaY: 10,
		canvasDeltaX: 10
	}
})


/*---------------------------------------------------------------------------*
 * The language class 
/*---------------------------------------------------------------------------*/
Garapi.Language = Ember.Object.extend({
	code: 'Vi',
	NEW_FUNC: 'Thêm hàm số',
	SETTING: 'Cấu hình',
	HIDE_SIDEBAR: 'Ẩn',
	SHOW_SIDEBAR: 'Hiện',
	ZOOM_IN: 'Phóng to',
	ZOOM_OUT: 'Thu nhỏ',
	ZOOM_RESET: 'Zoom mặc định',
	
	TITLE_SHOW_SIDEBAR: 'Hiển thị sidebar',
	TITLE_HIDE_SIDEBAR: 'Ẩn sidebar',
	TITLE_LANG_CHOOSE: 'Chọn ngôn ngữ / Choose language',
	TITLE_NEW_FUNC: 'Thêm hàm số mới',
	TITLE_SETTING: 'Cấu hình cho chương trình'
})


/*---------------------------------------------------------------------------*
 * The Canvas class: reference to each canvas
/*---------------------------------------------------------------------------*/
Garapi.Canvas = Ember.Object.extend({
	id: 0, // the id of the canvas
	isVisible: true,
	width: 0,
	height: 0,
	centerCoord: {
		x: 0,
		y: 0
	}, // the center of the canvas, updated only when the canvas change its dimension
	offset: {
		top: 0,
		left: 0
	},
	htmlId: function(){
		return 'canvas_' + this.get('id');
	}.property('id'),
	zIndex: function(){
		return 90 + 3 * this.get('id');
	}.property(),
	canvasObject: function(){
		return $("#" + this.get('htmlId'))[0];
	},
	canvas2DContext: null,
	getContext: function(){
		if (this.canvas2DContext == null)
			this.set('canvas2DContext', this.canvasObject().getContext("2d"));
		return this.canvas2DContext;
	},
	refreshContext: function(){
		this.set('canvas2DContext', this.canvasObject().getContext("2d"));
	},
	clear: function(){
		if(this.canvas2DContext != null)
			this.canvas2DContext.clearRect(0, 0, this.width, this.height);
	},
	widthChanged: function(){
		this.set('centerCoord', {
			x: Garapi.round(this.width / 2),
			y: this.centerCoord.y
		});
	}.observes('width'),
	heightChanged: function(){
		this.set('centerCoord', {
			x: this.centerCoord.x ,
			y: Garapi.round(this.height / 2)
		});
	}.observes('height')
})


/*---------------------------------------------------------------------------*
 * The setting class 
/*---------------------------------------------------------------------------*/
Garapi.Setting = Ember.Object.extend({
	isShowGrid: true,
	isShowAxes: true,
	isShowLabel: true,
	isPiModeX: false,
	isPiModeY: false,
	equalXYScale: true,
	minX: -5,
	maxX: 5,
	minY: -5,
	maxY: 5,
	fontsizeLabel: 14,
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
	}.property('minY', 'maxY'),
	mirorUnit: {
		x: Garapi.MirorUnit.create(),
		y: Garapi.MirorUnit.create()
	}
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