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