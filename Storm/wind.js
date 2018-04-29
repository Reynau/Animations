
var wind_vars = {
	// Wind
	automatic_wind: true,
	wind_probability: 5,
	wind_total_frames: 15,
	wind_force: 0,
	wind_max_speed: 20,
	wind_min_speed: 4,
	wind_speed: 10,
}

function Wind () {
	var wind = false;
	var wind_frames = 0;
	var wind_sin = 0;
	var wind_dir = 0;

	loadControls();

	function update () {
		if (wind_vars.automatic_wind) update_wind();
	}

	function update_wind () {
		if (wind_vars.wind_probability > 0 && wind) {
			wind_sin += (Math.PI / wind_vars.wind_total_frames);
			if (wind_dir === 0) wind_vars.wind_force = -(Math.sin(wind_sin) * wind_vars.wind_speed);
			if (wind_dir === 1) wind_vars.wind_force = Math.sin(wind_sin) * wind_vars.wind_speed;
			++wind_frames;
			if (wind_frames >= wind_vars.wind_total_frames) {
				wind_sin = 0;
				wind_vars.wind_force = 0;
				wind_frames = 0;
				wind = false;
			}
		}
		else if (wind_vars.wind_probability > 0) {
			var wind_rand = random(0, 100);
			if (wind_rand <= wind_vars.wind_probability) {
				wind = true;
				wind_dir = random_round(0,1);
				wind_vars.wind_speed = random_round(wind_vars.wind_min_speed, wind_vars.wind_max_speed);
				wind_vars.wind_total_frames = wind_vars.wind_speed * 5;
			}
		}
	}

	function loadControls () {
		var wind_controls = gui.addFolder("Wind");
		wind_controls.add(wind_vars, 'automatic_wind');
		wind_controls.add(wind_vars, 'wind_probability', 0, 100);
		wind_controls.add(wind_vars, 'wind_min_speed', 0, 50);
		wind_controls.add(wind_vars, 'wind_max_speed', 0, 50);
		wind_controls.add(wind_vars, 'wind_speed', 0, 50).listen();
		wind_controls.add(wind_vars, 'wind_force', -50, 50).listen();;

		wind_controls.open();
	}

	return {
		update: update,
	}
}