/******************************************************************************/
/*                GARAPI - THE VISUAL HTML GRAPH EDITOR                       */
/*                   Author:         Hieu Le Trung                            */
/*          License: GNU Affero General Public License version 3              */
/******************************************************************************/	

/**
 * The JsCanvasLayer library
 * 
 * Create and manage your canvas as a multi-layer drawing board.
 */

/**
 * The constructor of jsCanvasLayer class
 * @param	holderID	the ID of the parrent canvas
 * @param	bgColor		the color of the background layer
 */
function JsCanvasLayer( holderID, bgColor, width, height ) {
	if ( bgColor == null ) {
		bgColor = "transparent";
	}
	this.width = width;
	this.height = height;
	this.layers = [];	// the array of layers
	this.nLayers = 0;	// the number of current layer (without the bg one)
	
	this.holderID = holderID;
	this.holderNode = document.getElementById( this.holderID );
	
	this.holderNode.style.position = "relative";
	
	this.bgCanvas = document.createElement( 'canvas' );
	this.bgCanvasID = this.holderID + "_bgLayer";
	this.bgCanvas.setAttribute( "id", this.bgCanvasID );
	this.bgCanvas.style.top = "0px";
	this.bgCanvas.style.left = "0px";
	this.bgCanvas.style.backgroundColor = bgColor;
	this.bgCanvas.width = width;
	this.bgCanvas.height = height;
	this.holderNode.appendChild( this.bgCanvas );
	
	/***************************************************************************
	 *  method definitions
	 */
	
	this.getBgCanvasID = function() {
		return this.bgCanvasID;
	}
	
	this.getBgCanvas = function() {
		return this.bgCanvas;
	}
	
	this.createNewLayer = function() {
		var newCanvasID = this.holderID + "_layer_" + this.nLayers;
		var newCanvas = createCanvas( newCanvasID, this.bgCanvas );
		this.layers.push(true);
		this.nLayers++;
		this.holderNode.appendChild( newCanvas );
		return this.nLayers - 1;
	}
	
	this.getLayer = function( layerNumber ){
		if ( this.layers[layerNumber] != true ) {
			return null;
		} else {
			return document.getElementById( this.holderID + "_layer_" + layerNumber );
		}
	}
	
	this.removeLayer = function( layerNumber ){
		if ( this.layers[layerNumber] != true ) {
			return false;
		} else {
			var node = document.getElementById( this.holderID + "_layer_" + layerNumber);
			this.holderNode.removeChild( node );
			this.layers[layerNumber] = false;
			return true;
		}
	}
	
	this.hideLayer = function( layerNumber ){
		if ( this.layers[layerNumber] != true ) {
			return false;
		} else {
			var node = document.getElementById( this.holderID + "_layer_" + layerNumber);
			node.style.display = "none";
			return true;
		}
	}
	
	this.showLayer = function( layerNumber ){
		if ( this.layers[layerNumber] != true ) {
			return false;
		} else {
			var node = document.getElementById( this.holderID + "_layer_" + layerNumber);
			node.style.display = "";
			return true;
		}
	}
	
	this.hideBackground = function() {
		this.bgCanvas.style.display = "none";
	}
	
	this.showBackground = function() {
		this.bgCanvas.style.display = "";
	}
	
	this.updateDimension = function( width, height ) {
		this.width = width;
		this.height = height;
		this.bgCanvas.width = width;
		this.bgCanvas.height = height;
		var i = 0;
		for ( i = 0; i < this.nLayers; i++ ){
			if ( this.layers[i] ) {
				var node = document.getElementById( this.holderID + "_layer_" + i );
				node.width = width;
				node.height = height;
			}
		}
	}
	
	this.emptyStack = function(){
		var i = 0;
		for ( i = 0; i < this.nLayers; i++ ) {
			if ( !this.layers[i] ){
				continue;
			}
			var node = document.getElementById( this.holderID + "_layer_" + i);
			this.holderNode.removeChild( node );
		}
		this.nLayers = 0;
		this.layers = [];
	}
	
	this.clearAll = function(){
		var ctx = this.bgCanvas.getContext( "2d" );
		ctx.clearRect(0, 0, this.width, this.height );
		for ( i = 0; i < this.nLayers; i++ ) {
			if ( !this.layers[i] ){
				continue;
			}
			ctx = document.getElementById( this.holderID + "_layer_" + i).getContext( "2d" );
			ctx.clearRect(0, 0, this.width, this.height );
		}
	}
	
	function createCanvas( canvasID, holder ) {
		var newCanvas = document.createElement( 'canvas' );
		
		newCanvas.setAttribute( 'id', canvasID );
		newCanvas.width = holder.width;
		newCanvas.height = holder.height;
		newCanvas.style.backgroundColor = "transparent";
		newCanvas.style.position = "absolute";
		newCanvas.style.top = "0px";
		newCanvas.style.left = "0px";
		
		return newCanvas;
	}
	
}