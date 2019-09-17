class Boid {
    constructor (id) {
        this.id = id;
        
        //this.fillColor = 'rgba(' + random_round(90, 255) + ',' + random_round(90, 255) + ',' + random_round(90, 255) + ', ' + 0.5 + ')'
        this.fillColor = '#000'

        this.radius = 5;

        this.position = {
            x: random_round(0, canv.width),
            y: random_round(0, canv.height)
        };

        this.speed = 5;
        
        let r = Math.random();
        this.direction = {
            x: r ,
            y: (1-r)
        }
    }

    getPosition () {
        return { x: this.position.x, y: this.position.y };
    }

    getDirection () {
        return { x: this.direction.x, y: this.direction.y };
    }

    setDirection (newDirection) {
        newDirection = normalize(newDirection);
        this.direction = { x: newDirection.x, y: newDirection.y };
    }

    update () {
        this.position = sumVectors(this.position, multVectorByScalar(this.direction, this.speed));

        if (this.position.x < 0) this.position.x = canv.width;
        if (this.position.x > canv.width) this.position.x = 0;
        if (this.position.y < 0) this.position.y = canv.height;
        if (this.position.y > canv.height) this.position.y = 0;
/*
        if (this.position.x < 0 || this.position.x > canv.width) this.direction.x *= -1;
        if (this.position.y < 0 || this.position.y > canv.height) this.direction.y *= -1;*/
    }

    render () {
        let headlen = 7;

        let fromx = this.position.x;
        let fromy = this.position.y;
        let tox = this.position.x + this.direction.x * headlen;
        let toy = this.position.y + this.direction.y * headlen;

        let dx = this.direction.x
        let dy = this.direction.y

        let angle = Math.atan2(dy, dx);

        ctx.beginPath();
        ctx.moveTo(fromx, fromy);
        ctx.lineTo(tox, toy);
        ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(tox, toy);
        ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
    }
}
