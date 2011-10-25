/******************************************************************************/
/*                GARAPI - THE VISUAL HTML GRAPH EDITOR                       */
/*                   Author:         Hieu Le Trung                            */
/*          License: GNU Affero General Public License version 3              */
/******************************************************************************/

/**
 * The mathematical problems
 */

/* Point class */
function Point(x, y) {
	this.x = x;
	this.y = y;
}

function Plot(x, y, label, color, show_label, show_coord ) {
	if ( show_label == null ) {
		show_label = true;
	}
	if ( show_coord == null ) {
		show_coord = true;
	}
	if ( color == null ) {
		color = g_plot_default_color;
	}
	this.point = new Point( x, y );
	this.label = label;
	this.show_label = true;
	this.show_coord = true;
	this.color = color;
}

function Function(func_str, func_color) {
	this.func_str = func_str;
	if (func_color == null) {
		this.func_color = g_function_default_color;
	} else {
		this.func_color = func_color;
	}
} 

function View( setting, x, y ) {
	this.origin_coord = new Point( x, y );
	this.origin = new Point(x, y)
	
	this.space_x = setting.space_x;
	this.space_y = setting.space_y;
	this.original_space_x = setting.space_x;
	this.original_space_y = setting.space_y;
	this.grid_space_x = setting.grid_space_x;
	this.grid_space_y = setting.grid_space_y;
	this.miles_space_x = setting.miles_space_x * this.grid_space_x;
	this.miles_space_y = setting.miles_space_y * this.grid_space_y;

	this.zoom_base = setting.zoom_base;
	this.span_base = setting.span_base;
	
	this.zoom_level = 0;
	
	this.update_setting= function( setting ){
		this.space_x = setting.space_x;
		this.space_y = setting.space_y;
		this.original_space_x = setting.space_x;
		this.original_space_y = setting.space_y;
		this.grid_space_x = setting.grid_space_x;
		this.grid_space_y = setting.grid_space_y;
		this.miles_space_x = setting.miles_space_x * this.grid_space_x;
		this.miles_space_y = setting.miles_space_y * this.grid_space_y;

		this.zoom_base = setting.zoom_base;
		this.span_base = setting.span_base;
	}
	
	/**
	 * Change the coordinate of a point from the Catersian Coordinate System to
	 * the real Canvas Pixel Coordinate System.
	 * 
	 * XA = xA * space_x + XO
	 * YA = - ( yA * space_y - YO)
	 * 
	 * + XA, YA : the coordinate of A in the Canvas CS
	 * + xA, yA : the coordinate of A in the Catersian CS
	 * + XO, YO : the coordinate of the origin of the Catersian CS in the Canvas
	 * CS
	 */ 
	this.toRealCoord = function( point ) {
		var x = point.x * this.space_x + this.origin_coord.x;
		var y = - (point.y * this.space_y - this.origin_coord.y);
		return new Point(x, y);
	}
	
	this.toCaterCoord = function ( point ) {
		var x = ( point.x - this.origin_coord.x ) / this.space_x;
		var y = (this.origin_coord.y - point.y) / this.space_y;
		return new Point(x, y);
	}
	
	this.get_real_x_coord = function ( x ) {
		return x * this.space_x + this.origin_coord.x;
	}
	
	this.get_real_y_coord = function ( y ) {
		return - (y * this.space_y - this.origin_coord.y);
	}
	
	this.get_caster_x_coord = function ( x ) {
		return (x - this.origin_coord.x) / this.space_x;
	}
	
	this.get_caster_y_coord = function ( y ) {
		return ( this.origin_coord.y - y ) / this.space_y;
	}
	
	this.zoom = function(new_zoom) {
		var zigma_old = Math.pow( this.zoom_base, this.zoom_level );
		var zigma_new = Math.pow( this.zoom_base, new_zoom );
		this.space_x = MyMath.round( this.original_space_x * zigma_new );
		this.space_y = MyMath.round( this.original_space_y * zigma_new );
		this.zoom_level = new_zoom;
		var delta_x = MyMath.round( zigma_new/ zigma_old * ( this.origin_coord.x - this.origin.x ) );
		var delta_y = MyMath.round( zigma_new / zigma_old * ( this.origin_coord.y - this.origin.y ) );
		this.origin_coord = new Point( this.origin.x + delta_x, this.origin.y + delta_y );
	}
	
	this.zoom_out = function ( level ) {
		if ( level == null ) {
			level = 1;
		}
		var new_zoom = this.zoom_level - level;
		if ( new_zoom < -8 ) {
			new_zoom = -8;
		}
		this.zoom(new_zoom);
	}
	
	this.zoom_in = function ( level ) {
		if ( level == null ) {
			level = 1;
		}
		var new_zoom = this.zoom_level + level;
		if ( new_zoom > 8 ) {
			new_zoom = 8;
		}
		this.zoom(new_zoom);
	}
	
	this.zoom_reset = function () {
		this.zoom(0);
	}
	
	this.span = function( direction ) {
		var deltaX = 0;
		var deltaY = 0;
		switch ( direction ) {
			case "up":
				deltaY = -this.span_base;
				break;
			case "down":
				deltaY = this.span_base;
				break;
			case "left":
				deltaX = -this.span_base;
				break;
			case "right":
				deltaX = this.span_base;
				break;
			default:
				break;
		}

		this.origin_coord = new Point( this.origin_coord.x + deltaX, this.origin_coord.y + deltaY )
	}
	
	/**
	 * Centering the canvas at the given point of the Catersian Coord
	 */
	this.center = function( x, y, ori_x, ori_y ){
		this.origin_coord.x = ori_x - x * this.space_x;
		this.origin_coord.y = ori_y + y * this.space_y;
	}
}

