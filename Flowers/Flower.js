
class Flower {
    constructor () {
        this.defaultColor = '#a30a0a';

        this.numPetals = 30;
        this.petalSize = 2;
        this.distancePow = 1;

        this.flowerSeed = 0.618033;
    }

    render () {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canv.width, canv.height);


        
        let points = [];
        for (let i = 0; i < this.numPetals; ++i) {
            let dst = Math.pow((i / (this.numPetals - 1)), this.distancePow) * 100;
            let angle = 2 * Math.PI * this.flowerSeed * i;

            let x = dst * Math.cos(angle);
            let y = dst * Math.sin(angle);
            points.push({x:x, y:y})
        }

        for (let i = points.length; i >= 0; --i) {
            let dst = Math.pow((i / (this.numPetals - 1)), this.distancePow) * 100;
            let angle = 2 * Math.PI * this.flowerSeed * i;

            let x = dst * Math.cos(angle);
            let y = dst * Math.sin(angle);

            let color = this.defaultColor;
            let centerX = canv.width/2 + x;
            let centerY = canv.height/2 + y;
            let width = i * this.petalSize;
            let height = i * this.petalSize * 1.5;
            let petalAngle = Math.atan2(centerY - canv.height/2, centerX - canv.width/2) + Math.PI / 2;

            this.drawPetal(centerX, centerY, width, height, petalAngle, color)
        }
    }

    drawPetal(centerX, centerY, width, height, petalAngle, color) {
    
        ctx.fillStyle = color;
        ctx.strokeStyle = "#4d0606";

        ctx.beginPath();
        ctx.ellipse(centerX, centerY, width, height, petalAngle, 0, 2 * Math.PI);
    
        ctx.fill();
        ctx.stroke();
      }
}