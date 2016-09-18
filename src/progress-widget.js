playtotv.define('ProgressWidget', [
	'playtotv.widget.Widget'
], function(
	Widget
) {

	'use strict';

	var ptv = playtotv;

	return class ProgressWidget extends Widget {

		constructor(node, options) {
			var { from, to } = ptv.params(options, {
				app: null,
				from: Date.now(),
				to: ptv.REQUIRED,
				interval: 40
			});

			super(node);

			var progress = node.querySelector('progress');
			var label = node.querySelector('.progress-label');

			ptv.extend(this, options, {
				progress: progress,
				label: label
			});

			progress.max = to - from;

			this.labelText = label.innerText;

			this.update();
		}

		update() {
			if (!this.node) {
				return; // disposed
			}

			var { from, to, progress, label, labelText } = this;

			progress.value = Math.min(Date.now() - from, progress.max);

			var left = to - Date.now();
			label.innerText = left > 0 ? Math.round(left / 1000) + 's' : labelText;

			var { classList } = progress;
			if (left < 0) {
				classList.remove('progress-striped', 'progress-animated', 'progress-warning');
				classList.add('progress-success');
				return;
			} else if (left < 10000) {
				classList.add('progress-warning');
			}

			setTimeout(() => this.update(), this.interval);
		}
	};
});
