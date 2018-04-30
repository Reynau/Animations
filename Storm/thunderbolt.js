
var thunderbolt_vars = {
	// General
	background_color: "#000307",

	// Lightning
	automatic_lightning: true,
	light_probability: 1,
	light_max_frames: 5,
	light_min_frames: 3,
	light_frames: 5,
	light_color: "#575769",

	// Thunderbolt
	thunderbolt_color: "#ffffff",
	divide_prob: 20,
	max_width: 6,
	max_depth: 100,
	min_length: 2,
	max_length: 25,
}

function Thunderbolt () {
	var lightning = false;
	var lightning_frames = 0;

	var nodes = [];

	loadControls();

	function update () {
		if (thunderbolt_vars.automatic_lightning) {
			update_lightning();
		}
	}

	function draw () {
		drawBackground();
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
			if (random(0,100) <= thunderbolt_vars.light_probability) {
				lightning = true;
				thunderbolt_vars.light_frames = random_round(thunderbolt_vars.light_min_frames, thunderbolt_vars.light_max_frames);	
				generate_thunderbolt();
			}
		}
	}

	function drawBackground () {
		var color;

		if (lightning) {
			ctx.fillStyle = thunderbolt_vars.light_color;
			ctx.fillRect(0, 0, canv.width, canv.height);
			thunderbolt_draw();
		}
		else {
			ctx.fillStyle = thunderbolt_vars.background_color;;
			ctx.fillRect(0, 0, canv.width, canv.height);
		}

		
	}

	function create_node(x, y, depth, level, dir) {
		return {
			x: x,
			y: y,
			depth: depth,
			level: level,
			dir: dir,
			childs: [],
		}
	}

	function generate_random_child(ox, oy, depth, level) {
		var angle = Math.PI / random(3, 5);
		var dir = random_round(0,1) ? -1 : 1;
		var length = random(thunderbolt_vars.min_length, thunderbolt_vars.max_length);

		var x = ox + Math.cos(angle) * length * dir;
		var y = oy + Math.sin(angle) * length;

		return create_node(x, y, depth, level, dir);
	}

	function generate_child(ox, oy, depth, level, dir) {
		var angle = Math.PI / random(1, 8);
		var length = random(thunderbolt_vars.min_length, thunderbolt_vars.max_length);

		var x = ox + Math.cos(angle) * length * dir;
		var y = oy + Math.sin(angle) * length;

		return create_node(x, y, depth, level, dir);
	}

	function generate_thunderbolt () {
		nodes = [];

		var num_thunderbolts = random_round(1,3);
		var thundebolt_zone = canv.width / num_thunderbolts;

		var start_node;
		var child_node;
		for (var i = 0; i < num_thunderbolts; ++i) {
			var zone_init = i * thundebolt_zone;
			var zone_end = zone_init + thundebolt_zone;

			start_node = create_node(random(zone_init,zone_end), 0, 0, 0, 0);

			child_node = generate_random_child(start_node.x, start_node.y, start_node.depth, start_node.level);
			child_node.childs = recursive_generation(child_node);

			start_node.childs.push(child_node);
			nodes.push(start_node);
		}
	}

	function recursive_generation (parent) {
		if (parent.depth == thunderbolt_vars.max_depth) return [];

		var childs = [];
		var intern_child;
		if (parent.level === 0) {
			intern_child = generate_random_child(parent.x, parent.y, parent.depth+1, parent.level);
			intern_child.childs = recursive_generation(intern_child);
			childs.push(intern_child);
			if (random_round(0,100) <= thunderbolt_vars.divide_prob) {
				intern_child = generate_child(parent.x, parent.y, parent.depth+1, parent.level+1, -parent.dir);
				intern_child.childs = recursive_generation(intern_child);
				childs.push(intern_child);
			}
		}
		else {
			if (random_round(0,100) <= 100 - parent.level * 15) {
				intern_child = generate_child(parent.x, parent.y, parent.depth+1, parent.level, parent.dir);
				intern_child.childs = recursive_generation(intern_child);
				childs.push(intern_child);

				if (random_round(0,100) <= thunderbolt_vars.divide_prob) {
					intern_child = generate_child(parent.x, parent.y, parent.depth+1, parent.level+1, -parent.dir);
					intern_child.childs = recursive_generation(intern_child);
					childs.push(intern_child);
				}
			}
		}

		return childs;
	}

	function recursive_draw (parent) {
		var childs = parent.childs;
		for (var i = 0; i < childs.length; ++i) {
			var w = thunderbolt_vars.max_width - childs[i].level * 3;
			if (w < 1) w = 1;
			draw_line(parent.x, parent.y, childs[i].x, childs[i].y, w);

			recursive_draw(childs[i]);
		}
	}

	function thunderbolt_draw () {
		for (var i = 0; i < nodes.length; ++i) {
			recursive_draw(nodes[i]);
		}
	}

	function draw_line (ox, oy, dx, dy, w) {
		ctx.beginPath();
		ctx.moveTo(ox, oy);
		ctx.lineTo(dx, dy);
		ctx.lineWidth = w;
		ctx.strokeStyle = thunderbolt_vars.thunderbolt_color;
		ctx.stroke();
	}

	function loadControls () {
		general_controls.addColor(thunderbolt_vars, 'background_color');

		var lightning_controls = gui.addFolder("Lightning");
		lightning_controls.addColor(thunderbolt_vars, 'thunderbolt_color');
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