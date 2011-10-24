/******************************************************************************/
/*                GARAPI - THE VISUAL HTML GRAPH EDITOR                       */
/*                   Author:         Hieu Le Trung                            */
/*          License: GNU Affero General Public License version 3              */
/******************************************************************************/

/**
 * Common global settings
 *   - version information
 */

var g_version = '1.2';		// The version of Garapi
var g_version_name = 'Chaos'	// The code name verion of Garapi
var canvas2d = null;			// The main canvas of the application
var g_canvas_width = window.innerWidth;		// The canvas width (in pixel)
var g_canvas_height = window.innerHeight - 72;		// The canvas height (in pixel)

var g_grid_major_color = "#CCCCCC";
var g_axis_color = "#1068BA";
var g_function_default_color = "#000000";
var g_plot_default_color = "#D64D4D";
var g_zoom_base = 1.25;
var g_span_base = 50;
var g_plot_radius = 3;

var g_space_x = 50;			// the number of pixel equals to one graph x unit
var g_space_y = 50;			// the number of pixel equals to one graph y unit
var g_grid_space_x = 1;		// the space (by graph unit) between to vert. grid
var g_grid_space_y = 1;		// the space (by graph unit) between to horz. grid
var g_miles_space_x = 1;	// the number of vert. grid for each milestone
var g_miles_space_y = 1;	// the number of horz. grid for each milestone

// dialog toggle variable
var g_dialog_func_info = "add" // "add": add new | id: edit the current id
var g_dialog_plot_info = "add" // "add": add new | id: edit the current id

/**
 * The Setting class
 */
function Setting() {
	this.grid_major_color = g_grid_major_color;
	this.axis_color = g_axis_color;
	this.function_default_color = g_function_default_color;
	this.plot_default_color = g_plot_default_color;
	this.zoom_base = g_zoom_base;
	this.span_base = g_span_base;
	this.plot_radius = g_plot_radius;
	this.space_x = g_space_x;
	this.space_y = g_space_y;
	this.grid_space_x = g_grid_space_x;
	this.grid_space_y = g_grid_space_y;
	this.miles_space_x = g_miles_space_x;
	this.miles_space_y = g_miles_space_y;
}

/**
 * The mathematical functions
 * The alias of Math.funtion
 */
function sin( x ) {
	return Math.sin( x );
}

function cos( x ) {
	return Math.cos( x );
}

function tan( x ) {
	return Math.tan( x );
}

function acos ( x ) {
	return Math.acos( x );
}

function asin ( x ) {
	return Math.asin( x );
}

function atan( x ) {
	return Math.atan( x );
}

function abs( x ) {
	return Math.abs( x );
}

function sqrt( x ) {
	return Math.sqrt( x );
}

function ln ( x ) {
	return Math.log( x );
}

function log ( x ) {
	return Math.log( x ) / Math.log( 10 );
}

function exp ( x ) {
	return Math.exp( x );
}

function pow ( x, y ) {
	return Math.pow( x, y );
}

var PI = Math.PI;
var E = Math.E;

/** Utility functions
 * 
 */

function clicker(id){
	var thediv=document.getElementById(id);
	if(thediv.style.display == "none"){
		thediv.style.display = "";
	}else{
		thediv.style.display = "none";
	}
	return false;
}

var MyMath = {
	round: function( number ) {
		return ~~(number + (number > 0 ? .5 : -.5));
	}
}