/**
 * View classes that are used in Garapi 2
 * Author: Hieu Le Trung (letrunghieu.cse09@gmail.com)
 * Date created: June 15th, 2012
 */

/*---------------------------------------------------------------------------*
 * Main view
/*---------------------------------------------------------------------------*/
Garapi.MainView = Ember.View.extend({
	templateName: 'main-view',
	controller: Garapi.AppController.create()
})

Garapi.GraphView = Ember.View.extend({
	templateName: "graph-view",
	eventManager: Ember.Object.create({
		mouseDown: function(event, view){
			view._parentView.controller.isMouseDown = true;
			view._parentView.controller.mousePosition = {
				x: event.pageX,
				y: event.pageY
			};
			// console.log("Mouse down: " + event.pageX + " - y: " + event.pageY);
		},
		mouseUp: function(event, view){
			view._parentView.controller.isMouseDown = false;
			view._parentView.controller.mousePosition = {
				x: event.pageX,
				y: event.pageY
			};
			// console.log("Mouse up: " + event.pageX + " - y: " + event.pageY);
		},
		mouseMove: function(event, view){
			if (view._parentView.controller.isMouseDown)
				view._parentView.controller.drag(event.pageX, event.pageY);
			// console.log("Mouse move: " + event.pageX + " - y: " + event.pageY);
		}
	}),
	didInsertElement: function(){
		this._super();
		var v = this._parentView;
		$('#canvas-area').mousewheel(function(event, delta, deltaX, deltaY){
			// console.log(delta);
			v.controller.zoom(delta < 0, event.pageX, event.pageY)
		})
		v.controller.bgCanvas.set('offset', {
			top: v.controller.bgCanvas.canvasObject().offsetTop,
			left: v.controller.bgCanvas.canvasObject().offsetLeft,
		});
		v.controller.setting.set('maxX', 10);
		v.controller.setting.set('minX', -10);
		v.controller.setting.set('maxY', 10);
		v.controller.setting.set('minY', -10);
		
		v.controller.drawBackground();
	}
})