class Petal {

    constructor (x, y) {
        this.x = x;
        this.y = y;
    }

    draw () {
        let a = random(0, Math.PI)
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(this.rx, this.y, 1.2, a, a+Math.PI);
        ctx.fill();
    }
}