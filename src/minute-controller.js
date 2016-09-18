playtotv.define('MinuteController', [
	'playtotv.mvc.Controller'
], function(
	Controller
) {

	'use strict';

	var ptv = playtotv;
	var REQUIRED = ptv.REQUIRED;

	return class MinuteController extends Controller {
		constructor(context) {
			context.store = {
				id: 1,
				list: []
			};

			super(context);
		}

		add(minute) {
			var { date, name } = ptv.params(minute, {
				date: REQUIRED,
				name: REQUIRED
			});

			var { list } = this;

			if (!name || list.find(m => m.date === date && m.name === name)) {
				return; // no name specified or name was already added in this minute
			}

			minute.id = this.id++;

			list.push(minute);

			this.publish('add', minute);
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
	};
});
