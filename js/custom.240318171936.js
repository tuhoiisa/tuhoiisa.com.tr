/* JS for preset "Countdown" */
$(function() {
	var isIE11 = !!window.MSInputMethodContext && !!document.documentMode,
		isSafari =
		navigator.userAgent.toLowerCase().indexOf('safari') > -1 &&
		navigator.userAgent.toLowerCase().indexOf('chrome') === -1;

	var slice = Array.prototype.slice;

	var valid = true;

	var ready = function(callback) {
		var fn = function() {
			if (document.body.classList.contains('edit')) {
				return;
			}
			callback();
		};

		if (window.readyState !== 'loading') {
			fn();
			return;
		}

		document.addEventListener('DOMContentLoaded', fn);
	}

	var countdown = function(date, tick) {
		var now = new Date().getTime(),
			running = false,
			days = 0,
			hours = 0,
			minutes = 0,
			seconds,
			interval;

		var updateCounter = function() {
			if (!running) return;

			now = new Date().getTime();
			seconds = Math.round((date - now) / 1000);

			if (seconds > 86400) {
				days = Math.floor(seconds / 86400);
				seconds %= 86400;
			}

			if (seconds > 3600) {
				hours = Math.floor(seconds / 3600);
				seconds %= 3600;
			}

			if (seconds > 60) {
				minutes = Math.floor(seconds / 60);
				seconds %= 60;
			}

			tick(days, hours, minutes, seconds);
		};

		if (isIE11 || isSafari) {
			date = date.replace(/\s/, 'T');
		}

		date = new Date(date).getTime();
		if (now >= date) {
			valid = false;
			console.log('Date cannot be in the past.');
			return;
		}

		if (now >= date) {
			valid = false;
			console.log('Date cannot be in the past.');
		}

		tick = tick || (function() {});

		return {
			start: function() {
				interval = window.setInterval(updateCounter, 1000);
				running = true;
				updateCounter();
			},
			stop: function() {
				if (interval) window.clearInterval(interval);
				interval = undefined;
				running = false;
			}
		}
	};

	var writeCountdown = function(element, days, hours, minutes, seconds) {
		var daysElm = element.querySelector(".countdown-days"),
			hoursElm = element.querySelector('.countdown-hours'),
			minutesElm = element.querySelector('.countdown-minutes'),
			secondsElm = element.querySelector('.countdown-seconds');

		if (daysElm) daysElm.innerHTML = days;
		if (hoursElm) hoursElm.innerHTML = hours;
		if (minutesElm) minutesElm.innerHTML = minutes;
		if (secondsElm) secondsElm.innerHTML = seconds;
	}

	var buildCountdown = function(e) {
		var instances = slice.call(document.querySelectorAll('.countdown-instance')),
			len = instances.length,
			i = 0,
			element;

		for (; i < len; i++) {
			element = instances[i];

			var date = element.querySelector('.countdown-data p').innerHTML;

			element.countdown = countdown(date, function(days, hours, minutes, seconds) {
				writeCountdown(
					element, parseInt(days),
					("0" + parseInt(hours)).slice(-2),
					("0" + parseInt(minutes)).slice(-2),
					("0" + parseInt(seconds)).slice(-2)
				);
			});
			if (valid) {
				element.countdown.start();
			}
		}
	};

	var destroyCountdown = function(e) {
		var instances = slice.call(document.querySelectorAll('.countdown-instance')),
			len = instances.length,
			i = 0,
			element;
		for (; i < len; i++) {
			element = instances[i];
			writeCountdown(element, "0", "0", "0", "0");
			element.countdown.stop();
		}
	}

	var preview = false;
	var listener = function() {
		if (valid) {
			if (!preview && document.body.classList.contains('preview')) {
				console.log("entering preview")
				buildCountdown();
				preview = true;
			} else if (preview && !document.body.classList.contains('preview')) {
				console.log("edit again");
				destroyCountdown();
				preview = false;
			}
		}

		requestAnimationFrame(listener);
	};

	requestAnimationFrame(listener);
	ready(function() {
		buildCountdown();
	});
});
/* End JS for preset "Countdown" */