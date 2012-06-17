/**
 * The last executed script file of Garapi 2. It defines all actions executed
 * on window load as well as bind the event handllers
 * Author: Hieu Le Trung (letrunghieu.cse09@gmail.com)
 * Date created: June 15th, 2012
 */

$(document).ready(function(){
	Garapi.language = Garapi.Language.create();
	Garapi.mainView = Garapi.MainView.create().appendTo("#container");
	
	// get the controller the use later
	appCtrl = Garapi.mainView.get('controller');
	appCtrl.bgCanvas.set('width', window.innerWidth - Garapi.info.sidebar.width) ;
	appCtrl.bgCanvas.set('height', window.innerHeight - Garapi.info.dimension.canvasDeltaY);
	appCtrl.originCoord = {
		x: Garapi.round(appCtrl.bgCanvas.width / 2),
		y: Garapi.round(appCtrl.bgCanvas.height / 2)
	}
	appCtrl.addEquation = function(){
		var newId = ++Garapi.Equation.nItem;
		var eq = Garapi.Equation.create({
			id: newId,
			canvas: Garapi.Canvas.create({
				id: newId,
				widthBinding: 'Garapi.mainView.controller.bgCanvas.width',
				heightBinding: 'Garapi.mainView.controller.bgCanvas.height',
				offsetBinding: 'Garapi.mainView.controller.bgCanvas.offset'
			})
		})
		appCtrl.equaCtrl.pushObject(eq);
	}
	
	
})

$(window).resize(function(){
	appCtrl.resize();
	// appCtrl.redrawBackground();
})
/* End of garapi2.exec.js */