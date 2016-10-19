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
	/*global Handlebars*/

	'use strict';

	var { id } = this;

	// Extra logging, e.g: if you want to see View changes in detail
	playtotv.Logger.get(id).level = 'SPAM';

	// TODO: Add runtime l10n support to lib (instead of build time)
	// e.g: app.l10n('foo') and {{l10n "foo"}}
	// Will require difficult support by nbob l10n update processor..
	var allTemplates = Handlebars.templates;
	var allPartials = Handlebars.partials;

	function selectLang(templates, lang) {
		var selected = {};
		var prefix = lang + '/';
		playtotv.each(templates, (tmpl, name) => {
			if (name.startsWith(prefix)) {
				selected[name.substr(prefix.length)] = tmpl;
			}
		});
		return selected;
	}

	function setLang(lang) {
		Handlebars.templates = selectLang(allTemplates, lang);
		Handlebars.partials = selectLang(allPartials, lang);
	}

	var defLang = 'en-us';
	setLang(defLang);

	var app = new App({
		id: id,
		store: {
			lang: defLang
		}
	});

	app.ready.then(() => app.publish('lang', app.lang));

	app.subscribe('lang', (lang) => {
		setLang(lang);
		app.templates = Handlebars.templates;
		// app.view.update();
	});

	app.setWidgets([
		[ 'progress', ProgressWidget ]
	]);

	app.addControllers([
		[ 'minute', MinuteController ]
	]).then(() => app.startView());

	var analytics = new GoogleAnalytics({
		id: 'UA-926370-3',
		requires: [ 'displayfeatures' ],
		skipView: true
	});

	var { router } = app;
	analytics.sendView(router.pattern);
	router.subscribe('*', (params, pattern) => analytics.sendView(pattern));

	return app;
});
