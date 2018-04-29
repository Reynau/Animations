
var thunderbolt_vars = {
	// General
	background_color: "#002040",

	// Lightning
	automatic_lightning: true,
	light_probability: 1,
	light_max_frames: 5,
	light_min_frames: 3,
	light_frames: 5,
	light_color: "#ffffd2",
}

function Thunderbolt () {
	var lightning = false;
	var lightning_frames = 0;

	loadControls();

	function update () {
		if (thunderbolt_vars.automatic_lightning) update_lightning();
	}

	function update_lightning () {
		if (thunderbolt_vars.light_probability > 0 && lightning) {
			++lightning_frames;

			if (lightning_frames >= thunderbolt_vars.light_max_frames) {
				lightning_frames = 0;
				lightning = false;
			}
		}
		else if (thunderbolt_vars.light_probability > 0) {
			var lightning_rand = random(0, 100);
			if (lightning_rand <= thunderbolt_vars.light_probability) {
				lightning = true;
				thunderbolt_vars.light_frames = random_round(thunderbolt_vars.light_min_frames, thunderbolt_vars.light_max_frames);
			}
		}
	}

	function draw () {
		drawBackground();
	}

	function drawBackground () {
		var color;

		if (lightning) color = thunderbolt_vars.light_color;
		else color = thunderbolt_vars.background_color;

		ctx.fillStyle = color;
		ctx.fillRect(0, 0, canv.width, canv.height);
	}

	function loadControls () {
		general_controls.addColor(thunderbolt_vars, 'background_color');

		var lightning_controls = gui.addFolder("Lightning");
		lightning_controls.add(thunderbolt_vars, 'automatic_lightning');
		lightning_controls.add(thunderbolt_vars, 'light_probability', 0, 100);
		lightning_controls.addColor(thunderbolt_vars, 'light_color');
		lightning_controls.add(thunderbolt_vars, 'light_min_frames', 0, 50);
		lightning_controls.add(thunderbolt_vars, 'light_max_frames', 0, 50);
		lightning_controls.add(thunderbolt_vars, 'light_frames', 0, 100).listen();

		lightning_controls.open();
	}

	return {
		update: update,
		draw: draw,
	}
}