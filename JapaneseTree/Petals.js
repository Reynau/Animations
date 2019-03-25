class Petal {

    constructor (x, y) {
        this.x = x;
        this.y = y;

        this.rx = x;

        this.speed = random(0.05,0.1);

        this.offset = random(0, 1);
        this.multiplier = random(5, 10);
    }

    update (step) {
        this.rx = this.x + this.multiplier * Math.cos(this.offset + step);
        this.y += this.speed;

        if (this.y > 800) this.y = 0;
    }

    draw () {
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(this.rx, this.y, 1, 0, 2 * Math.PI);
        ctx.fill();
    }
}