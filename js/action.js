/******************************************************************************/
/*                GARAPI - THE VISUAL HTML GRAPH EDITOR                       */
/*                   Author:         Hieu Le Trung                            */
/*          License: GNU Affero General Public License version 3              */
/******************************************************************************/

/**
 * Actions
 */

$(document).ready(function(){
	$('#title h1').html('Garapi '+ g_version_name + ' | Open HTML visual graph (v' + g_version + ')');
	document.title = 'Garapi '+ g_version_name + '(' + g_version + ')';
	setting =  new Setting();
	view = new View( setting, MyMath.round(g_canvas_width / 2), MyMath.round(g_canvas_height / 2) );
	cvs = new JsCanvasLayer( 'graph', null, g_canvas_width, g_canvas_height );
	canvas2d = new Canvas2D( cvs, view, setting );
//	// init
//	canvas2d.add_function( new Function( "(x*x)/2-3", "#B31227"));
//	canvas2d.add_function( new Function( "(x*x)/2-x", "#B31227"));
//	canvas2d.add_function( new Function( "sin(x)-x", "#2676B3"));
//	canvas2d.add_function( new Function( "(x+x+x+x+x+x+x+x+x+x+x+x+x+x+x)/10", "#2676B3"));
//	canvas2d.add_function( new Function( "sin(x)*x/2-1", "#32B366"));
//	load_functions();
//	// end init
	canvas2d.add_plot( new Plot(1, 5, "A", "#f0f000", true, true));
	load_plots();
	canvas2d.redraw();
	$('#dialog-func-info').css('width','500px');
	$('#dialog-func-info').css('left', (window.innerWidth - 500) / 2);
	$('#dialog-plot-info').css('width','400px');
	$('#dialog-plot-info').css('right', '270px');
	$('#dialog-plot-info').css('top', '150px');
	$('.panel-content').each( function(intIndex){
		$(this).css('max-height', (window.innerHeight -160) + "px");
	} );
})
$(window).resize( function() {
	canvas2d.remeasure( window.innerWidth , window.innerHeight - 72 );
	canvas2d.redraw();
})

$('#action').click( function(){
	redraw( view );
	clicker();
} )

// toolbar binding
$('#tb_options').click( function(){
	clicker("settings");
	if( $(this).html() == "Options" ){
		$(this).html( "&nbsp;Graph&nbsp;" );
		$(this).css( "font-weight", "bold" );
	} else {
		$(this).html( "Options" );
		$(this).css( "font-weight", "normal" )
	}
} )

$('#tb_clear').click( function() {
	canvas2d.reset();
})

$('#tb_zoom_in').click( function(){
	canvas2d.zoom_in();
} )
$('#tb_zoom_out').click( function(){
	canvas2d.zoom_out();
} )
$('#tb_zoom_reset').click( function(){
	canvas2d.zoom_reset();
} )

$('#tb_nav_up').click( function(){
	canvas2d.span( "up" );
} )
$('#tb_nav_down').click( function(){
	canvas2d.span( "down" );
} )
$('#tb_nav_left').click( function(){
	canvas2d.span( "left" );
} )
$('#tb_nav_right').click( function(){
	canvas2d.span( "right" );
} )
$('#tb_nav_reset').click( function(){
	canvas2d.span_reset();
	canvas2d.redraw();
} )

$('#tb_nav_center').click( function(){
	canvas2d.center( $('#tb_center_x').val() * 1, $('#tb_center_y').val() * 1);
})

$('#tb_view_funcs').click( function(){
	clicker('panel-functions');
	var title = $(this).attr('title');
	if ( title == 'Show function panel' ){
		$(this).attr('title', 'Hide function panel');
	} else {
		$(this).attr('title', 'Show function panel');
	}
} )

$('#tb_view_plots').click( function(){
	clicker('panel-plots');
	var title = $(this).attr('title');
	if ( title == 'Show plot panel' ){
		$(this).attr('title', 'Hide plot panel');
	} else {
		$(this).attr('title', 'Show plot panel');
	}
} )

// end toolbar binding

// panel bindgin
$('#panel-functions .close-button').click( function(){
	$('#panel-functions').css('display','none');
} )
$('#panel-plots .close-button').click( function(){
	$('#panel-plots').css('display','none');
} )

$('#pb-funcs-add').click( function(){
	$('#dialog-func-info').css('display', '');
	$('#dialog-func-info .dialog-title h3').html("Create new function");
	$('#pb-funcs-btn-ok').html("Add new");
	g_dialog_func_info = "add";
} )

$('#pb-funcs-empty').click( function(){
	canvas2d.remove_all_functions();
	load_functions();
} )
$('#pb-funcs-hide').click( function(){
	var i = 0;
	for ( i = 0; i < canvas2d.functions.length; i++) {
		canvas2d.hide_function(i);
	}
	load_functions();
} )
$('#pb-funcs-show').click( function(){
	var i = 0;
	for ( i = 0; i < canvas2d.functions.length; i++) {
		canvas2d.show_function(i);
	}
	load_functions();
} )

$('#pb-plots-add').click( function(){
	show_plot_info( true );
} )

$('#pb-plots-empty').click( function(){
	canvas2d.remove_all_plots();
	load_plots();
} )
$('#pb-plots-hide').click( function(){
	var i = 0;
	for ( i = 0; i < canvas2d.plots.length; i++) {
		canvas2d.hide_plot(i);
	}
	load_plots();
} )
$('#pb-plots-show').click( function(){
	var i = 0;
	for ( i = 0; i < canvas2d.plots.length; i++) {
		canvas2d.show_plot(i);
	}
	load_plots();
} )

$('#dialog-func-info .close-button').click( function(){
	$('#dialog-func-info').css('display', 'none');
} )
$('#pb-funcs-btn-cancel').click( function(){
	$('#dialog-func-info').css('display', 'none');
} )

$('#pb-funcs-btn-ok').click( function(){
	$('#dialog-func-info').css('display', 'none');
	var id = g_dialog_func_info;
	if (g_dialog_func_info == "add") {
		id = canvas2d.add_function( new Function( $('#pb-funcs-txt-func').val(), "#"+$('#pb-funcs-txt-color').val()));
	}
	else{
		canvas2d.functions[g_dialog_func_info].obj.func_str = $('#pb-funcs-txt-func').val();
		canvas2d.functions[g_dialog_func_info].obj.func_color = "#"+$('#pb-funcs-txt-color').val();
	}
	canvas2d.redraw_function( id );
	load_functions();
} )

// plot info
$('#dialog-plot-info .close-button').click( function(){
	$('#dialog-plot-info').css('display', 'none');
} )
$('#pb-plots-btn-cancel').click( function(){
	$('#dialog-plot-info').css('display', 'none');
} )

$('#pb-plots-btn-ok').click( function(){
	$('#dialog-plot-info').css('display', 'none');
	var x = $('#pb-plots-txt-x').val() * 1;
	var y = $('#pb-plots-txt-y').val() * 1;
	var label = $('#pb-plots-txt-label').val();
	var color = "#" + $('#pb-plots-txt-color').val();
	var show_label = $('#pb-plots-chk-showlbl')[0].checked;
	var show_coord = $('#pb-plots-chk-showcoord')[0].checked;
	var id = g_dialog_plot_info;
	if (g_dialog_plot_info == "add") {
		id = canvas2d.add_plot( new Plot(x, y, label, color, show_label, show_coord) );
	} else {
		var plot = canvas2d.plots[g_dialog_plot_info];
		plot.obj.label = label;
		plot.obj.point.x = x;
		plot.obj.point.y = y;
		plot.obj.show_label = show_label;
		plot.obj.show_coord = show_coord;
		plot.obj.color = color;
	}
	canvas2d.redraw_plot( id );
	load_plots();
} )

$('#pb-plots-combo-f').change( function(){
	if ($('#pb-plot-combo-f').val() == -1) {
		return false;
	}
	var x = $('#pb-plots-txt-x').val();
	$('#pb-plots-txt-y').val( eval(canvas2d.functions[$('#pb-plots-combo-f').val()].obj.func_str) );
	return true;
} )

$('#pb-plots-txt-x').change( function(){
	if ($('#pb-plots-combo-f').val() == -1) {
		return false;
	}
	var x = $('#pb-plots-txt-x').val();
	$('#pb-plots-txt-y').val( eval(canvas2d.functions[$('#pb-plots-combo-f').val()].obj.func_str) );
	return true;
} )
// end panel binding

// write functions
function load_functions(){
	$('#panel-functions .panel-content tbody').html('');
	var i = 0;
	for( i = 0; i < canvas2d.functions.length; i++ ) {
		var f = canvas2d.functions[i];
		var item_tr = document.createElement( 'tr' );
		item_tr.innerHTML = '<tr>\n'+
		'<td>'+i+'</td>\n'+
		'<td style="text-align: left">\n'+
		'<p><a onclick="edit_function('+i+')">'+f.obj.func_str+'</a></p>\n'+
		'<p><span class="fcolor" style="background: '+f.obj.func_color+'"></span>\n'+
		'<span class="fdel"><a onclick="canvas2d.remove_function('+i+'); load_functions();">delete</a></span></p>\n'+
		'<p class="clear"></p>\n'+
		'</td>\n'+
		'<td><input type="checkbox" '+(f.visible?'checked="checked"':'')+'onclick="toggle_function_show('+i+', this.checked)"/></td>\n'+
		'</tr>\n';
		$('#panel-functions .panel-content tbody').append(item_tr);
	}	
}

function toggle_function_show( id, show ){
	if (show ){
		canvas2d.show_function( id );
	} else {
		canvas2d.hide_function( id );
	}
}

function edit_function( id ){
	var f = canvas2d.functions[id].obj;
	g_dialog_func_info = id;
	$('#dialog-func-info').css( 'display', '' );
	$('#pb-funcs-txt-func').val( f.func_str );
	$('#pb-funcs-txt-color').val( f.func_color.substr( 1, 6 ) );
	$('#dialog-func-info .dialog-title h3').html("Edit the current function");
	$('#pb-funcs-btn-ok').html("Update");
	
}

function load_func_list(){
	var str = '<option value="-1" selected="selected">Free plot (not belong to any function)</option>\n';
	var i = 0;
	for ( i = 0; i < canvas2d.functions.length; i++) {
		str += '<option value="'+ i + '">f' + i + ': ' + canvas2d.functions[i].obj.func_str + '</option>\n';
	}
	return str;
}

/**
 * Show the plot info dialog for adding or midifying
 * 
 * @param	add		true: adding mode | false: editing mode
 * @param	id		(only required in editing mode) the id of plot
 */
function show_plot_info( add, id ) {
	$('#dialog-plot-info').css('display', '');
	if ( add == true ) {
		g_dialog_plot_info = "add";
		$('#dialog-plot-info .dialog-title h3').html("Create new plot");
		$('#pb-plots-btn-ok').html("Add new");
		$('#pb-plots-chk-showlbl').attr('checked', true);
		$('#pb-plots-chk-showcoord').attr('checked', true);
		$('#pb-plots-combo-f').html( load_func_list() );
	} else {
		g_dialog_plot_info = id
		var plot = canvas2d.plots[id];
		if (plot == undefined) {
			return;
		}
		$('#dialog-plot-info .dialog-title h3').html("Edit this plot");
		$('#pb-plots-btn-ok').html("Update");
		$('#pb-plots-txt-label').html( plot.obj.label );
		$('#pb-plots-txt-x').html( plot.obj.point.x );
		$('#pb-plots-txt-y').html( plot.obj.point.y );
		$('#pb-plots-txt-color').html( plot.obj.color.substr( 1, 6 ) );
		$('#pb-plots-chk-showlbl').attr('checked', plot.obj.show_label);
		$('#pb-plots-chk-showcoord').attr('checked', plot.obj.show_coord);
		$('#pb-plots-combo-f').html( load_func_list() );
	}
}

function load_plots() {
	$('#panel-plots .panel-content tbody').html('');
	var i = 0;
	for( i = 0; i < canvas2d.plots.length; i++ ) {
		var f = canvas2d.plots[i];
		var item_tr = document.createElement( 'tr' );
		item_tr.innerHTML = '<tr>\n'+
		'<td>'+f.obj.label+'</td>\n'+
		'<td style="text-align: left">\n'+
		'<p><a onclick="show_plot_info( false, '+i+')">x:'+f.obj.point.x.toPrecision(6)+ ' | y:' + f.obj.point.y.toPrecision(6) +'</a></p>\n'+
		'<p><span class="fcolor" style="background: '+f.obj.color+'"></span><span class="fcenter"><a onclick="canvas2d.center( '+ f.obj.point.x +', '+ f.obj.point.y +' )">center</a></span>\n'+
		'<span class="fdel"><a onclick="canvas2d.remove_plot('+i+'); load_plots();">delete</a></span></p>\n'+
		'<p class="clear"></p>\n'+
		'</td>\n'+
		'<td><input type="checkbox" '+(f.visible?'checked="checked"':'')+'onclick="toggle_plot_show('+i+', this.checked)"/></td>\n'+
		'</tr>\n';
		$('#panel-plots .panel-content tbody').append(item_tr);
	}	
}

function toggle_plot_show( id, show ){
	if (show ){
		canvas2d.show_plot( id );
	} else {
		canvas2d.hide_plot( id );
	}
}
// end write functions