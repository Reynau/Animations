
var rain_vars = {
	// General
	max_gravity: 10,
	min_gravity: 1,
	gravity: 5,

	// Drops
	n_drops: 800,
	max_n_drops: 5000,
	drop_color: "#132b50",
	drop_length: 9,
	drop_length_diff: 2,
	drop_min_weight: 6,
	drop_max_weight: 14,
}

function Rain () {
	var drops = [];

	var margin = 600;

	loadControls();

	for (var i = 0; i < rain_vars.max_n_drops; ++i) {
		drops[i] = createDrop(canv.width, canv.height);
	}

	function createDrop (w, h) {
		return {
			x: random(-margin, w + margin),
			y: Math.random() * h,
			weight: random_round(rain_vars.drop_min_weight, rain_vars.drop_max_weight),
			px: this.x,
			py: this.y,
			length: random_round(rain_vars.drop_length, rain_vars.drop_length_diff),
			update: function () {
				this.px = this.x;
				this.py = this.y;

				this.drop_speed = this.weight * rain_vars.gravity * 0.1;

				this.x += wind_vars.wind_force;
				this.y += this.drop_speed
				
				if (this.y > h + this.length || this.x > w + margin || this.x < -margin) {
					this.reset();
				}
			},
			draw: function () {
				var dist = distance(this.px, this.py, this.x, this.y);
				var x = this.x - this.px;
				var y = this.y - this.py;

				var ux = x / module(x,y);
				var uy = y / module(x,y);

				// Draw drops
				ctx.beginPath();
				ctx.moveTo(this.x, this.y);
				ctx.lineTo(this.x + ux * this.length * 1.1, this.y + uy * this.length * 1.1);
				ctx.lineWidth = 2;
				ctx.strokeStyle = rain_vars.drop_color;
				ctx.stroke();
			},
			reset: function () {
				this.weight = random_round(rain_vars.drop_min_weight, rain_vars.drop_max_weight);
				this.drop_speed = this.weight * rain_vars.gravity * 0.1;
				this.x = random_round(-margin, w + margin);
				this.y = random_round(-this.drop_speed, 0) - this.drop_speed;
				this.px = this.x;
				this.py = this.y;
			}
		}
	}

	function update () {
		for (var i = 0; i < rain_vars.n_drops; ++i) {
			drops[i].update();
		}
	}

	function draw () {
		for (var i = 0; i < rain_vars.n_drops; ++i) {
			drops[i].draw();
		}
	}


	function loadControls () {
		general_controls.add(rain_vars, 'gravity', rain_vars.min_gravity, rain_vars.max_gravity);

		var drop_controls = gui.addFolder("Rain");
		drop_controls.addColor(rain_vars, 'drop_color');
		drop_controls.add(rain_vars, 'n_drops', 0, rain_vars.max_n_drops);
		drop_controls.add(rain_vars, 'drop_min_weight', 0, 20);
		drop_controls.add(rain_vars, 'drop_max_weight', 0, 20);
		//drop_controls.add(rain_vars, 'drop_length', 0, 20);
		//drop_controls.add(rain_vars, 'drop_length_diff', 0, 10);

		drop_controls.open();
	}

	return {
		update: update,
		draw: draw,
	}
}