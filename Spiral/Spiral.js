
class Spiral {
    constructor () {
        this.defaultColor = '#000';

        this.numPoints = 1500;
        this.pointSize = 3;
        this.distancePow = 2;

        this.turnFraction = 0.05;
        this.turnFractionIncrement = 0.00001;
        this.turnFractionAutoIncrement = true;

        this.highlight = 4;
        this.highlightOffset = 0;
        this.highlightColor = '#aa0044';

        this.firstFibonnacci = 55;
        this.secondFibonnacci = 144;
    }

    update () {
        if (this.turnFractionAutoIncrement) {
            this.turnFraction += this.turnFractionIncrement;
        }
    }

    render () {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canv.width, canv.height);
        
        for (let i = 0; i < this.numPoints; ++i) {
            let dst = Math.pow((i / (this.numPoints - 1)), this.distancePow) * 100;
            let angle = 2 * Math.PI * this.turnFraction * i;

            let x = dst * Math.cos(angle);
            let y = dst * Math.sin(angle);

            let color = this.defaultColor;
            
            
            if ((i + this.highlightOffset) % this.highlight === 0) {
                color = this.highlightColor;
            }

            ctx.fillStyle = color;
            ctx.fillRect(canv.width/2 + x, canv.height/2 + y, this.pointSize, this.pointSize);
        }
    }
}