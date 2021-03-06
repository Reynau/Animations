
var toRadian = Math.PI / 180;

var leafs = 0;

class Sakura {
    constructor (x, y, angle, length, depth, width) {
        this.root = new Branch(x, y, angle, length, depth, width);
        this.root.isRoot = true
    }

    update (step) {
        var increment = 1.2 * Math.cos(step);
        this.root.update(increment);
    }

    draw () {
        this.root.draw();
    }
}

class Branch {

    constructor (x, y, angle, length, depth, max_width) {
        this.seed = random(0.2, 0.4);
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.mod_angle = angle;
        this.length = length;
        this.width = random_round(max_width/5*3, max_width/5*2.5);
        this.depth = depth;

        this.nx = this.x + this.length * Math.cos(this.angle * toRadian);
        this.ny = this.y - this.length * Math.sin(this.angle * toRadian);

        this.childs = [];
        if (this.depth > 1) {
            var max_len = this.length / 3 * 2;
            var min_len = max_len/5 * 4

            this.childs.push(new Branch(this.nx - this.width/3, this.ny, this.angle + 30, random(min_len, max_len), this.depth-1, this.width));
            this.childs.push(new Branch(this.nx - this.width/3, this.ny * random(0.2, 0.8), this.angle + random_round(10, 20), random(min_len/3, max_len), this.depth-1, this.width));

            this.childs.push(new Branch(this.nx + this.width/3, this.ny, this.angle - 30, random(min_len, max_len), this.depth-1, this.width));
            this.childs.push(new Branch(this.nx + this.width/3, this.ny * random(0.2, 0.8), this.angle - random_round(10, 20), random(min_len/3, max_len), this.depth-1, this.width));
        }
        else if (this.depth > 0) {
            var max_len = this.length / 3 * 2;
            var min_len = max_len/5 * 4

            this.childs.push(new Branch(this.nx - this.width/3, this.ny, this.angle + 60, random(min_len, max_len), this.depth-1, this.width));
            this.childs.push(new Branch(this.nx - this.width/3, this.ny * random(0.2, 0.8), this.angle + random_round(50, 80), random(min_len/3, max_len), this.depth-1, this.width));

            this.childs.push(new Branch(this.nx + this.width/3, this.ny, this.angle - 60, random(min_len, max_len), this.depth-1, this.width));
            this.childs.push(new Branch(this.nx + this.width/3, this.ny * random(0.2, 0.8), this.angle - random_round(50, 80), random(min_len/3, max_len), this.depth-1, this.width));
        }
        else {
            this.childs.push(new Leaf(this.nx, this.ny));
        }
    }

    init_pos(x, y) {
        this.x = x;
        this.y = y;
    }

    update (step) {
        if (!this.isRoot) {
            this.mod_angle = this.angle + step;
            if (this.mod_angle > 180) this.mod_angle = 180;
            this.nx = this.x + this.length * Math.cos(this.mod_angle * toRadian);
            this.ny = this.y - this.length * Math.sin(this.mod_angle * toRadian);
        }
        

        if (this.childs.length >= 2) {
            for (let i = 0; i < this.childs.length; ++i) {
                this.childs[i].init_pos(this.nx, this.ny);

                if (i < this.childs.length/2) {
                    if (this.depth > 0) this.childs[i].update(step*this.seed);
                    else this.childs[i].update(step);
                }
                else {
                    if (this.depth > 0) this.childs[i].update(-step*this.seed);
                    else this.childs[i].update(-step);
                }
            }
        }
        else if (this.childs.length === 1) {
            this.childs[0].update(this.nx, this.ny);
        }
    }

    draw () {
        ctx.beginPath();
        ctx.lineWidth = this.width > 0 ? this.width : 1;
        ctx.strokeStyle = "#8D89A6";
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.nx, this.ny);
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = this.width > 0 ? this.width/3*2 : 1;
        ctx.strokeStyle = "#BFABCB";
        ctx.moveTo(this.x + this.width/2, this.y);
        ctx.lineTo(this.nx + this.width/2, this.ny);
        ctx.lineCap = 'round';
        ctx.stroke();

        for (let i = 0; i < this.childs.length; ++i) {
            this.childs[i].draw();
        }
        /*
        let y_dist = this.y - this.ny;
        
        let x_incr = (this.nx - this.x) / y_dist;
        let ax = this.x;
        let ay = this.y;

        for (let i = this.y; i <= this.ny; ++i) {
            ctx.beginPath();
            ctx.lineWidth = this.width > 0 ? this.width : 1;
            ctx.strokeStyle = "#8D89A6";
            ctx.moveTo(ax, ay);
            ctx.lineTo(ax + x_incr, ay + 1);
            ctx.lineCap = 'round';
            ctx.stroke();
    
            ctx.beginPath();
            ctx.lineWidth = this.width > 0 ? this.width/3*2 : 1;
            ctx.strokeStyle = "#BFABCB";
            ctx.moveTo(ax + this.width/2, ay);
            ctx.lineTo(ax + this.width/2 + x_incr, ay + 1);
            ctx.lineCap = 'round';
            ctx.stroke();

            ax += x_incr;
            ay += 1;
        }

        for (let i = 0; i < this.childs.length; ++i) {
            this.childs[i].draw();
        }
        */
    }
}

class Leaf {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = random_round(10,15);
        this.sr = this.r/3*2;
        this.ox = this.sr/random(2,3) * (random_round(0,1) ? -1 : 1);
        this.oy = -this.sr/random(2,3);

        leafs += 1;
    }

    update (x, y) {
        this.x = x;
        this.y = y;
    }

    draw () {
        ctx.fillStyle = "#ffc1e5";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = "#ffe8f4";
        ctx.beginPath();
        ctx.arc(this.x + this.ox, this.y + this.oy, this.sr, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function random (min, max) {
    return Math.random() * (max - min + 1) + min;
}

function random_round (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}