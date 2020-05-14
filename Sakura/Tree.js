
class Tree {

    constructor (x, y, initialWidth, angle, iterations) {
        this.x = x;
        this.y = y;

        this.initialWidth = initialWidth;
        this.angle = angle;

        this.growthByIteration = 1;
        this.iterationsToReduceWidth = 20;

        this.devianceFactor = 1;

        this.iterations = iterations;

        this.petals = [];

        this.branchingNumber = 4;
    }

    draw () {
        let width = null;
        for (let i = 0; i < this.iterations; ++i) {
            width = this.initialWidth - i/this.iterationsToReduceWidth

            let x = this.x;
            let y = this.y;

            let xDeviance = Math.cos(random_round(0, 360) * toRadians) * this.devianceFactor;
            let yDeviance = this.growthByIteration;
            if (this.angle < 30 || this.angle > 150) {
                yDeviance += Math.sin(random_round(0, 360) * toRadians) * this.devianceFactor;
            }

            let newX = xDeviance + Math.cos(this.angle * toRadians) + this.x;
            let newY = -yDeviance * Math.sin(this.angle * toRadians) + this.y;

            this.drawBox(x, y, newX, newY, width);

            this.x = newX;
            this.y = newY;
        }

        for (let i = 0; i < this.branchingNumber; ++i) {
            let minAngle = i * 180 / this.branchingNumber;
            let maxAngle = minAngle + 180 / this.branchingNumber;
            let angle = random_round(minAngle, maxAngle);
            let iterations = this.iterations/2

            if (iterations < 50) return;

            let tree = new Tree(this.x, this.y, width, angle, iterations);
            tree.draw();
        }
    }

    drawBox (x, y, newX, newY, width) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = "#8D89A6";
        ctx.moveTo(x, y);
        ctx.lineTo(newX, newY);
        ctx.lineCap = 'round';
        ctx.stroke();
    
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = "#BFABCB";
        ctx.moveTo(x + width/2, y);
        ctx.lineTo(newX + width/2, newY);
        ctx.lineCap = 'round';
        ctx.stroke();
    }
}