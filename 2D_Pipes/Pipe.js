
class Pipe {
    constructor () {
        console.log(this)
        this.fillColor = 'rgba(' + random_round(90, 255) + ',' + random_round(90, 255) + ',' + random_round(90, 255) + ', ' + 0.5 + ')'

        this.radius = random_round(2, 10);

        this.position = {
            x: random_round(0, canv.width),
            y: random_round(0, canv.height)
        };

        this.speed = {
            x: random_round(5, 10) * random_select(-1, 1),
            y: random_round(5, 10) * random_select(-1, 1)
        };
    }

    update () {
        let newX = this.position.x + this.speed.x;
        let newY = this.position.y + this.speed.y;

        if (newX < 0 || newX > canv.width) this.speed.x *= -1;
        if (newY < 0 || newY > canv.height) this.speed.y *= -1;

        this.position.x = newX < 0 ? 0 : (newX > canv.width ? canv.width : newX);
        this.position.y = newY < 0 ? 0 : (newY > canv.height ? canv.height : newY);
    }

    render () {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.fillColor;
        ctx.fill();
    }
}

function random_round (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function random (min, max) {
    return Math.random() * (max - min + 1) + min;
}

function random_select (opt1, opt2) {
    let r = random_round(0, 1);
    return r ? opt1 : opt2;
}