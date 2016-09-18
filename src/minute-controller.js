playtotv.define('MinuteController', [
	'playtotv.mvc.Controller'
], function(
	Controller
) {

	'use strict';

	var ptv = playtotv;
	var util = ptv.util;

	return class MinuteController extends Controller {
		constructor(context) {
			context.store = {
				id: 1,
				list: [],
				suggestions: []
			};

			super(context);
		}

		getDate() {
			return parseFloat(this.app.router.params.date);
		}

		add(name) {
			var date = this.getDate();
			var { list } = this;

			if (!name || list.find(m => m.date === date && m.name === name)) {
				return; // no name specified or name was already added in this minute
			}

			var minute = {
				id: this.id++,
				date: date,
				name: name
			};

			list.push(minute);

			this.publish('add', minute);

			var input = document.querySelector('form input');
			input.value = '';
			input.focus();
			this.suggest('');
		}

		change(id, name) {
			var minute = this.list.find(m => m.id === id);
			minute.name = name;
			this.publish('change', minute);
		}

		getCounts(key) {
			return this.list.reduce((counts, minute) => {
				var value = minute[key];
				var count = counts.find(c => c[key] === value);
				if (count) {
					count.nr++;
				} else {
					count = { nr: 1 };
					count[key] = value;
					counts.push(count);
				}
				return counts;
			}, []);
		}

		get dateCounts() {
			return this.getCounts('date');
		}

		get nameCounts() {
			return this.getCounts('name');
		}

		hasTimeLeft(start) {
			// Add a 5s margin to be nice
			return Date.now() - start < 65000;
		}

		suggest(needle) {
			var date = this.getDate();
			var { list } = this;

			var usedNames = list.filter(m => m.date === date).map(m => m.name);

			var regex = new RegExp('^' + util.escapeRegEx(needle), 'i');
			var suggestions = list.reduce((names, minute) => {
				var { name } = minute;
				if (
					names.indexOf(name) < 0 &&
					usedNames.indexOf(name) < 0 &&
					regex.test(name)
				) {
					names.push(name);
				}
				return names;
			}, []);

			// Pick 3 suggestions at random from all matches
			suggestions = ptv.shuffle(suggestions);
			suggestions.length = Math.min(3, suggestions.length);

			this.set('suggestions', suggestions);
		}
	};
});
