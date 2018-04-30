
var tree_vars = {
	max_depth: 10,
	tree_color: '#000000',
	initial_length: 100,
}

function Tree (x, y, size) {
	var tree;

	var parent_nodes = [];

	tree = create_node(x, y, Math.PI/2, size, 0);
	var child = create_node(tree.x, tree.y - tree.length, tree.angle, tree.length, 0);
	child.childs = recursive_generation(child);
	tree.childs.push(child);

	function create_node (x, y, angle, length, depth) {
		return {
			x: x,
			y: y,
			angle: angle,
			depth: depth,
			length: length,
			childs: [],
		}
	}

	function create_child_nodes (parent_node) {
		var d = parent_node.depth + 1;
		// Right child
		var ra = parent_node.angle + Math.PI / random(3,10);
		var rl = parent_node.length * 0.8;
		var rx = parent_node.x + Math.cos(ra) * rl;
		var ry = parent_node.y - Math.sin(ra) * rl;
		// Left child
		var la = parent_node.angle - Math.PI / random(3,10);
		var ll = parent_node.length * 0.8;
		var lx = parent_node.x + Math.cos(la) * ll;
		var ly = parent_node.y - Math.sin(la) * ll;

		return [create_node(rx,ry,ra,rl,d), create_node(lx,ly,la,ll,d)];
	} 

	function recursive_generation (parent) {
		if (parent.depth >= tree_vars.max_depth) return [];

		var childs = create_child_nodes(parent);
		for (var i = 0; i < childs.length; ++i) {
			childs[i].childs = recursive_generation(childs[i]);
		}

		return childs;
	}

	function recursive_draw (parent) {
		var childs = parent.childs;
		for (var i = 0; i < childs.length; ++i) {
			draw_line(parent.x, parent.y, childs[i].x, childs[i].y, tree_vars.max_depth - parent.depth);
			recursive_draw(childs[i]);
		}
	}

	function draw () {
		recursive_draw(tree);
	}

	function draw_line (ox, oy, dx, dy, w) {
		ctx.beginPath();
		ctx.moveTo(ox, oy);
		ctx.lineTo(dx, dy);
		ctx.lineWidth = w;
		ctx.strokeStyle = tree_vars.tree_color;
		ctx.stroke();
	}

	return {
		draw: draw,
	}
}