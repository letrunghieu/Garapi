/******************************************************************************/
/*                GARAPI - THE VISUAL HTML GRAPH EDITOR                       */
/*                   Author:         Hieu Le Trung                            */
/*          License: GNU Affero General Public License version 3              */
/******************************************************************************/

/**
 * Canvas maipulation
 */
function draw_text ( context, string, x, y, font, fillStyle, fill, align, baseline ) {
	if ( align == null) {
		align = "left";
	}
	if ( baseline == null ) {
		baseline = "top"
	}
	context.textAlign = align;
	context.fillStyle = fillStyle;
	context.font = font;
	context.textBaseline = baseline;
	if ( fill ) {
		context.fillText( string, x, y )
	} else {
		context.strokeText( string, x, y );
	}
}
	
	
function Element( type, obj, layer ){
	this.visible = true;
	this.type = type;
	this.obj = obj;
	this.layer = layer;
	this.draw = function( cvs, view, setting ){
		var ctx;
		switch ( this.type ){
			//------------------------------------------------------------------
			case 0: // this is a plot
				ctx = cvs.getLayer( this.layer ).getContext( "2d" );
				var plot = this.obj
				var plot_x = MyMath.round( view.get_real_x_coord( plot.point.x ) );
				var plot_y = MyMath.round( view.get_real_y_coord( plot.point.y ) );
				ctx.fillStyle = plot.color;
				ctx.beginPath();
				ctx.arc( plot_x, plot_y , setting.plot_radius , 0, Math.PI * 2, true );
				ctx.fill();
				var label = ""
				if ( plot.show_label == true ) {
					label += plot.label;
				}
				if ( plot.show_coord == true ) {
					label += "(" + plot.point.x + "," + plot.point.y + ")";
				}
				draw_text( ctx, label, plot_x, plot_y, "14px Inconsolata", plot.color, true,
					( plot_x < cvs.width - label.length * 15 ? "left" : "right"), 
					(plot_y < cvs.height - 20 ? "top" : "bottom"));
				break;
			//------------------------------------------------------------------
			case 1: // this is a function
				ctx = cvs.getLayer( this.layer ).getContext( "2d" );
				var func = this.obj;
				ctx.strokeStyle = func.func_color;
				ctx.beginPath();
				ctx.moveTo( 0, 0 );
				var prev_result = Infinity;
				for ( var point = 0; point <= cvs.width; point++) {
					var x = view.get_caster_x_coord( point );
					var func_y = eval ( func.func_str );
					var y = view.get_real_y_coord( func_y );
			
					if ( prev_result == Infinity || (prev_result * func_y < 0 && Math.abs( func_y - prev_result ) > cvs.width/view.space_y ) ) 
						ctx.moveTo(point, y);
					else 
						ctx.lineTo(point, y);
					prev_result = func_y;
				}
				ctx.stroke();
				break;
			default:
				break;
		}
	}
	
	this.clear = function( cvs ) {
		var ctx = cvs.getLayer( this.layer ).getContext( "2d" );
		ctx.clearRect( 0, 0, cvs.width, cvs.height );
	}
}

function Canvas2D( jsCvsLayer, view, setting ) {
	this.view = view;
	this.setting = setting;
	this.canvas = jsCvsLayer;
	this.functions = [];
	this.plots = [];
	
	/**
	 * Add a function to the context. The function must be created first by the
	 * Function() constructor.
	 * 
	 * @param	func	a Function instance
	 * @return	the id of new function element
	 */
	this.add_function = function( func ) {
		var f = new Element( 1, func, this.canvas.createNewLayer() );
		return this.functions.push( f ) - 1;
	}
	
	this.remove_function = function( index ) {
		var f = this.functions[index];
		this.canvas.removeLayer( f.layer );
		return this.functions.splice( index, 1 );
	}
	
	this.remove_all_functions = function() {
		var i = 0;
		for ( i = 0 ; i < this.functions.length; i++ ) {
			this.canvas.removeLayer( this.functions[i].layer );
		}
		this.functions = [];
	}
	
	/**
	 * Add a plot to the context. The plot must be creted first by the Plot()
	 * contructor.
	 * 
	 * @param	plot	a Plot instance
	 * @return	the id of new plot element
	 */
	this.add_plot = function( plot ) {
		var p = new Element( 0, plot, this.canvas.createNewLayer() );
		return this.plots.push( p ) - 1;
	}
	
	this.remove_plot = function( index ) {
		var p = this.plots[index];
		this.canvas.removeLayer( p.layer );
		return this.plots.splice( index, 1 );
	}
	
	this.remove_all_plots = function() {
		var i = 0;
		for ( i = 0 ; i < this.plots.length; i++ ) {
			this.canvas.removeLayer( this.plots[i].layer );
		}
		this.plots = [];
	}
	
	this.update_setting = function( setting ) {
		this.setting = setting;
	}
	
	
	this.clear_all = function() {
		this.canvas.clearAll();
	}
	
	this.reset = function() {
		this.functions = [];
		this.plots = [];
		this.canvas.emptyStack();
		this.redraw();
	}
	
	this.draw_grid = function() {
		if ( ! (this.view instanceof View) || this.canvas == null ) {
			return false;
		}
		var ctx = this.canvas.getBgCanvas().getContext( "2d" );
	
		ctx.lineWidth = 1;
		ctx.strokeStyle = this.setting.grid_major_color;
		ctx.beginPath();
	
		var min_x = Math.ceil( this.view.get_caster_x_coord(0) / this.view.grid_space_x ) * this.view.grid_space_x;
		var max_x = Math.floor( this.view.get_caster_x_coord(this.canvas.width) / this.view.grid_space_x ) * this.view.grid_space_x;
		var max_y = Math.ceil( this.view.get_caster_y_coord(0) / this.view.grid_space_y ) * this.view.grid_space_y;
		var min_y = Math.floor( this.view.get_caster_y_coord(this.canvas.height) / this.view.grid_space_y ) * this.view.grid_space_y;
		var i = 0;
		var origin_x = false;
		var origin_y = false;
		// vertical lines
		for ( i = min_x; i <= max_x; i = i+this.view.grid_space_x ) {
			if ( i == 0 ) {
				origin_y = true;
				continue;
			}
			ctx.moveTo( Math.ceil( this.view.get_real_x_coord( i ) ), 0 );
			ctx.lineTo( Math.ceil( this.view.get_real_x_coord( i ) ), this.canvas.height );
		}
	
		// horizontal lines
		for ( i = min_y; i <= max_y; i = i+this.view.grid_space_y ) {
			if ( i == 0 ) {
				origin_x = true;
				continue;
			}
			ctx.moveTo( 0, Math.ceil( this.view.get_real_y_coord( i ) ) );
			ctx.lineTo( this.canvas.width, Math.ceil( this.view.get_real_y_coord( i ) ) );
		}
	
		ctx.closePath();
		// TODO set the line style
		ctx.stroke();
	
		// draw the x axis if needed
		if ( origin_x ) {
			ctx.strokeStyle = this.setting.axis_color;
			var tmp_y = Math.ceil( this.view.get_real_y_coord( 0 ) );
			ctx.beginPath();
			ctx.moveTo(0, tmp_y )
			ctx.lineTo(this.canvas.width, tmp_y );
			ctx.moveTo(this.canvas.width - 6, tmp_y - 6 )
			ctx.lineTo(this.canvas.width, tmp_y );
			ctx.lineTo(this.canvas.width - 6, tmp_y + 6 )
			ctx.stroke();
		}
	
		// draw the y axis if needed
		if ( origin_y ) {
			ctx.strokeStyle = this.setting.axis_color;
			var tmp_x = Math.ceil( this.view.get_real_x_coord( 0 ) );
			ctx.beginPath();
			ctx.moveTo(tmp_x, 0 )
			ctx.lineTo(tmp_x, this.canvas.height );
			ctx.moveTo(tmp_x - 6, 6 )
			ctx.lineTo(tmp_x, 0 );
			ctx.lineTo(tmp_x + 6, 6 );
			ctx.stroke();
		}
	
		// write the Origin if needed
		if ( origin_x && origin_y ) {
		//draw_text(ctx, "O", tmp_x + 4, tmp_y + 4, "14px Consolas", g_axis_color, true)
		}
		return true;
	}
	
	this.draw_milestones = function() {
		if ( ! (this.view instanceof View) || this.canvas == null ) {
			return false;
		}
		var ctx = this.canvas.getBgCanvas().getContext("2d");
	
		var min_x = Math.ceil( this.view.get_caster_x_coord(0) / this.view.miles_space_x ) * this.view.miles_space_x;
		var max_x = Math.floor( this.view.get_caster_x_coord(this.canvas.width) / this.view.miles_space_x ) * this.view.miles_space_x;
		var max_y = Math.ceil( this.view.get_caster_y_coord(0) / this.view.miles_space_y ) * this.view.miles_space_y;
		var min_y = Math.floor( this.view.get_caster_y_coord(this.canvas.height) / this.view.miles_space_y ) * this.view.miles_space_y;
		var origin_x = false;
		var origin_y = false;
	
		var i = 0;
		var milestone_y = this.view.get_real_y_coord(0); 
		var milestone_x = this.view.get_real_x_coord(0);
		if ( min_x >= 0 || max_x <= 0 ) {
			milestone_x = this.canvas.width;
		} 
		if ( min_y >= 0 || max_y <= 0 ) {
			milestone_y = 0;
		}
		for( i = min_x; i <= max_x; i = i + this.view.miles_space_x ) {
			if ( i == 0 ) {
				origin_x = true;
			}
			draw_text(ctx, i, this.view.get_real_x_coord(i) + 2, milestone_y + 2, "14px Inconsolata", g_axis_color, true);
		}
		for (i = min_y; i <= max_y; i = i + this.view.miles_space_y ) {
			if ( i == 0 && origin_x ) {
				continue;
			}
			draw_text(ctx, i, milestone_x - 2, this.view.get_real_y_coord(i) + 2, "14px Inconsolata", g_axis_color, true, "right");
		}
	
		return true;
	}
	
	this.draw = function() {
		var i = 0;
		for ( i = 0; i < this.functions.length; i++ ) {
			this.functions[i].draw( this.canvas, this.view, this.setting );
		}
		for ( i = 0; i < this.plots.length; i++) {
			this.plots[i].draw( this.canvas, this.view, this.setting );
		}
	}
	
	this.redraw = function() {
		this.clear_all();
		this.draw_grid();
		this.draw_milestones();
		this.draw();
	}
	
	this.remeasure = function( width, height ) {
		this.canvas.updateDimension( width, height );
	}
	
	this.zoom_in = function() {
		this.view.zoom_in();
		this.redraw();
	}
	
	this.zoom_out = function() {
		this.view.zoom_out();
		this.redraw();
	}
	
	this.zoom_reset = function() {
		this.view.zoom_reset();
		this.redraw();
	}
	
	this.span = function( direction ) {
		this.view.span( direction );
		this.redraw();
	}
	
	this.span_reset = function() {
		this.view.origin_coord =  new Point( MyMath.round(this.canvas.width / 2), MyMath.round(this.canvas.height / 2))
		this.redraw();
	}
	
	/**
	 * Show the layer contains the graph of function_id
	 */
	this.show_function = function( id ){
		this.canvas.showLayer( this.functions[id].layer );
		this.functions[id].visible = true;
	}
	
	this.hide_function = function( id ){
		this.canvas.hideLayer( this.functions[id].layer );
		this.functions[id].visible = false;
	}
	
	this.show_plot = function( id ){
		this.canvas.showLayer( this.plots[id].layer );
		this.plots[id].visible = true;
	}
	
	this.hide_plot = function( id ){
		this.canvas.hideLayer( this.plots[id].layer );
		this.plots[id].visible = false;
	}
	
	// redraw the layer
	this.redraw_function = function( f_id ) {
		var func = this.functions[f_id];
		if (func == undefined ) {
			return false;
		}
		func.clear( this.canvas );
		func.draw( this.canvas, this.view, this.setting );
		return true;
	}
	
	this.redraw_plot = function( p_id ) {
		var plot = this.plots[p_id];
		if (plot == undefined ) {
			return false;
		}
		plot.clear( this.canvas );
		plot.draw( this.canvas, this.view, this.setting );
		return true;
	}
	
	this.center = function (x, y) {
		this.view.center(x, y);
		this.redraw();
	}
}
