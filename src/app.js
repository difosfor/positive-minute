playtotv.define('app', [
	'playtotv.mvc.App',
	'MinuteController',
	'ProgressWidget'
], function(
	App,
	MinuteController,
	ProgressWidget
) {

	'use strict';

	var { id } = this;

	// Extra logging, e.g: if you want to see View changes in detail
	playtotv.Logger.get(id).level = 'SPAM';

	var app = new App({ id: id });

	app.setWidgets([
		[ 'progress', ProgressWidget ]
	]);

	app.addControllers([
		[ 'minute', MinuteController ]
	]).then(() => app.startView());

	return app;
});
