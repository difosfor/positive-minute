playtotv.define('app', [
	'playtotv.analytics.GoogleAnalytics',
	'playtotv.mvc.App',
	'MinuteController',
	'ProgressWidget'
], function(
	GoogleAnalytics,
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

	var analytics = new GoogleAnalytics({
		id: 'UA-926370-3',
		skipView: true
	});

	var { router } = app;
	analytics.sendView(router.pattern);
	router.subscribe('*', (params, pattern) => analytics.sendView(pattern));

	return app;
});
