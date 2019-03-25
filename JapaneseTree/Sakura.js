
var toRadian = Math.PI / 180;

class Sakura {
    constructor (x, y, angle, length, depth, width) {
        this.root = new Branch(x, y, angle, length, depth, width);
    }

    update (step) {
        var increment = 3 * Math.cos(step) - 2;
        this.root.update(increment);
    }

    draw () {
        this.root.draw();
    }
}

class Branch {

    constructor (x, y, angle, length, depth, max_width) {
        this.seed = random(0.2, 0.6);
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.mod_angle = angle;
        this.length = length;
        this.width = random_round(max_width, max_width/5*3);
        this.depth = depth;

        this.nx = this.x + this.length * Math.cos(this.angle * toRadian);
        this.ny = this.y - this.length * Math.sin(this.angle * toRadian);
        

        this.childs = [];
        if (this.depth > 0) {
            var max_len = this.length / 3 * 2;
            var min_len = max_len/5 * 4
            this.childs.push(new Branch(this.nx - this.width/3, this.ny, this.angle + 30, random(min_len, max_len), this.depth-1, this.width));
            this.childs.push(new Branch(this.nx * random(0.2, 0.8)  - this.width/3, this.ny, this.angle + random_round(10, 20), random(min_len/2, max_len), this.depth-1, this.width));

            this.childs.push(new Branch(this.nx + this.width/3, this.ny, this.angle - 30, random(min_len, max_len), this.depth-1, this.width));
            this.childs.push(new Branch(this.nx * random(0.2, 0.8)  + this.width/3, this.ny, this.angle - random_round(10, 20), random(min_len/3, max_len), this.depth-1, this.width));
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
        this.mod_angle = this.angle + step;
        this.nx = this.x + this.length * Math.cos(this.mod_angle * toRadian);
        this.ny = this.y - this.length * Math.sin(this.mod_angle * toRadian);

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
        ctx.strokeStyle = "#7f6e9b";
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.nx, this.ny);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = this.width > 0 ? this.width/3*2 : 1;
        ctx.strokeStyle = "#b7abcc";
        ctx.moveTo(this.x + this.width/2, this.y);
        ctx.lineTo(this.nx + this.width/2, this.ny);
        ctx.stroke();

        for (let i = 0; i < this.childs.length; ++i) {
            this.childs[i].draw();
        }
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
    }

    update (x, y) {
        this.x = x;
        this.y = y;
    }

    draw () {
        ctx.fillStyle = "#ffdbfd";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = "#ffedfc";
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