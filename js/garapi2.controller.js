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
	gapMiror: {
		x: Garapi.info.grid.sXGapMiror,
		y: Garapi.info.grid.sYGapMiror
	},
	setting: Garapi.Setting.create(),
	isMouseLDown: false,
	mousePosition: {
		x: 0,
		y: 0
	},
	drawBackground: function(){
		var st = this.get('setting');
		// var ctx = this.bgCanvas.canvasObject().getContext("2d");
		var ctx = this.bgCanvas.getContext();
		var stepX = this.gapMiror.x;
		var stepY = this.gapMiror.y;
		var maxStep = 0;
		var v = 0;
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = Garapi.info.color.mirorGrid;
		if (st.isShowGrid){
			// draw Vertical lines
			if (this.originCoord.x <= this.bgCanvas.width){
				maxStep = (this.bgCanvas.width - this.originCoord.x) / stepX;
				for (i = 1; i <= maxStep; i++){
					if (i % 4 != 0){
						v = this.originCoord.x + i * stepX + 0.5;
						drawVLine(ctx, v, this.bgCanvas.height);
					}
				}
			}
			if (this.originCoord.x >= 0){
				maxStep = this.originCoord.x / stepX;
				for (i = 1; i <= maxStep; i++){
					if (i % 4 != 0){
						v = this.originCoord.x - i * stepX + 0.5;
						drawVLine(ctx, v, this.bgCanvas.height);
					}
				}
			}
			// draw horizontal lines
			if (this.originCoord.y <= this.bgCanvas.height){
				maxStep = (this.bgCanvas.height- this.originCoord.y) / stepY;
				for (i = 1; i <= maxStep; i++){
					if (i % 4 != 0){
						v = this.originCoord.y + i * stepY + 0.5;
						drawHLine(ctx, v, this.bgCanvas.width);
					}
				}
			}
			if (this.originCoord.y >= 0){
				maxStep = this.originCoord.y / stepY;
				for (i = 1; i <= maxStep; i++){
					if (i % 4 != 0){
						v = this.originCoord.y - i * stepY + 0.5;
						drawHLine(ctx, v, this.bgCanvas.width);
					}
				}
			}
		}
		ctx.stroke();
		
		// major grid
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = Garapi.info.color.majorGrid;
		if (st.isShowGrid){
			// draw Vertical lines
			if (this.originCoord.x <= this.bgCanvas.width){
				maxStep = (this.bgCanvas.width - this.originCoord.x) / stepX;
				for (i = 4; i <= maxStep; i += 4){
					v = this.originCoord.x + i * stepX + 0.5;
					drawVLine(ctx, v, this.bgCanvas.height);
				}
			}
			if (this.originCoord.x >= 0){
				maxStep = this.originCoord.x / stepX;
				for (i = 4; i <= maxStep; i += 4){
					v = this.originCoord.x - i * stepX + 0.5;
					drawVLine(ctx, v, this.bgCanvas.height);
				}
			}
			// draw horizontal lines
			if (this.originCoord.y <= this.bgCanvas.height){
				maxStep = (this.bgCanvas.height- this.originCoord.y) / stepY;
				for (i = 4; i <= maxStep; i += 4){
					v = this.originCoord.y + i * stepY + 0.5;
					drawHLine(ctx, v, this.bgCanvas.width);
				}
			}
			if (this.originCoord.y >= 0){
				maxStep = this.originCoord.y / stepY;
				for (i = 4; i <= maxStep; i += 4 ){
					v = this.originCoord.y - i * stepY + 0.5;
					drawHLine(ctx, v, this.bgCanvas.width);
				}
			}
		}
		ctx.stroke();
		
		// axes
		var delta = 0; // use to draw "better" lines with an odd line width
		if (st.isShowAxes){
			ctx.lineWidth = 1;
			delta = 0.5;
			ctx.strokeStyle = Garapi.info.color.axes;
		}
		else
		{
			ctx.lineWidth = 1;
			delta = 0.5;
			ctx.strokeStyle = Garapi.info.color.majorGrid;
		}
		ctx.beginPath();
		drawVLine(ctx, this.originCoord.x + delta, this.bgCanvas.height);
		drawHLine(ctx, this.originCoord.y + delta, this.bgCanvas.width);
		ctx.stroke();
		
		// label
		if (st.isShowLabel){
			// this.drawText( ctx, "0", this.originCoord.x - Garapi.info.labelSpace.x, this.originCoord.y + Garapi.info.labelSpace.y, "14px Verdana", Garapi.info.color.axes, true, "right");
			
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillStyle = Garapi.info.color.axes;
			ctx.font = st.fontsizeLabel + "px Consolas";
			
			bsLineX = this.originCoord.y + st.fontsizeLabel;
			overX = (this.originCoord.y < 0) || (this.originCoord.y > this.bgCanvas.height - 2 * st.fontsizeLabel);
			if (overX)
				bsLineX = this.bgCanvas.height - st.fontsizeLabel;
			
			bsLineY = this.originCoord.x - st.fontsizeLabel;
			overY = (this.originCoord.x < 0) || (this.originCoord.x > this.bgCanvas.width - 2 * st.fontsizeLabel);
			if (overY)
				bsLineY = st.fontsizeLabel;
			majorUnit = {
				x: Garapi.info.grid.nMiror * st.mirorUnit.x,
				y: Garapi.info.grid.nMiror * st.mirorUnit.y
			}
			majorGap = {
				x: Garapi.info.grid.nMiror * this.gapMiror.x,
				y: Garapi.info.grid.nMiror * this.gapMiror.y,
			}
			var max = {
				x: (this.bgCanvas.width - this.originCoord.x) / majorGap.x,
				y: this.originCoord.y / majorGap.y
			}
			for ( i = Garapi.ceil(-this.originCoord.x / majorGap.x); i < max.x; i++ ){
				if (i != 0)
					ctx.fillText(i * majorUnit.x,i * majorGap.x + this.originCoord.x,  bsLineX );
			}
			for ( i = Garapi.ceil( (this.originCoord.y - this.bgCanvas.height) / majorGap.y); i < max.y; i++ ){
				if (i != 0)
					ctx.fillText(i * majorUnit.y, bsLineY, -i * majorGap.y + this.originCoord.y + 1);
			}
			ctx.fillText(0, bsLineY, bsLineX);
		}
		
		function drawVLine(ctx, x, height){
			ctx.moveTo(x, 0);
			ctx.lineTo(x, height);
		}
		
		function drawHLine(ctx, y, width){
			ctx.moveTo(0, y);
			ctx.lineTo(width, y);
		}
	},
	redrawBackground: function(){
		this.bgCanvas.clear();
		this.drawBackground();
	},
	draw: function(){
		
	},
	drag: function(x, y){
		var deltaX = x - this.mousePosition.x;
		var deltaY = y - this.mousePosition.y;
		this.originCoord.x += deltaX;
		this.originCoord.y += deltaY;
		this.redrawBackground();
		this.mousePosition = {
			x: x,
			y: y
		}
	},
	zoom: function(isOut, mouseX, mouseY){
		var z = 1.0; // larger when zoomed in, 
		if (isOut){
			this.zoomFactor *= Garapi.info.zoomFactor;
			z /= Garapi.info.zoomFactor;
		}
		else{
			this.zoomFactor /= Garapi.info.zoomFactor;
			z *= Garapi.info.zoomFactor;
		}
		this.originCoord.x = (mouseX - this.bgCanvas.offset.left ) + Garapi.round((this.originCoord.x - mouseX + this.bgCanvas.offset.left) * z);
		this.originCoord.y = (mouseY - this.bgCanvas.offset.top ) + Garapi.round((this.originCoord.y - mouseY + this.bgCanvas.offset.top) * z);
		
		var gap = this.gapMiror.x * z;
		if ((gap > Garapi.info.grid.maxXGapMiror) || (gap < Garapi.info.grid.minXGapMiror))
			gap = Garapi.info.grid.sXGapMiror;
		this.gapMiror.x = Garapi.round(gap);
		
		gap = this.gapMiror.y * z;
		if ((gap > Garapi.info.grid.maxYGapMiror) || (gap < Garapi.info.grid.minYGapMiror))
			gap = Garapi.info.grid.sYGapMiror;
		this.gapMiror.y = Garapi.round(gap);
		
		this.redrawBackground();
	},
	reset: function(){
		this.zoomFactor = 1.0;
		this.gapMiror = {
			x: Garapi.info.grid.sXGapMiror,
			y: Garapi.info.grid.sYGapMiror
		};
		this.originCoord = {
			x: this.bgCanvas.centerCoord.x,
			y: this.bgCanvas.centerCoord.y
		}
		this.redrawBackground();
	},
	resize: function(isShowSidebar){
		this.bgCanvas.set('width', window.innerWidth - 10);
		this.bgCanvas.set('height', window.innerHeight - 10);
		this.bgCanvas.refreshContext();
		
		Ember.run.later(this, "redrawBackground", 300);
	},
	drawText: function( context, string, x, y, font, fillStyle, fill, align, baseline ) {
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
})
