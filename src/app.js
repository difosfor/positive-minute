playtotv.define('app', [
	'playtotv.mvc.App',
	'playtotv.widget.CountdownWidget',
	'MinuteController'
], function(
	App,
	CountdownWidget,
	MinuteController
) {

	'use strict';

	var { id } = this;

	// Extra logging, e.g: if you want to see View changes in detail
	playtotv.Logger.get(id).level = 'SPAM';

	var app = new App({ id: id });

	app.setWidgets([
		[ 'countdown', CountdownWidget ]
	]);

	app.addControllers([
		[ 'minute', MinuteController ]
	]).then(() => app.startView());

	return app;
});
