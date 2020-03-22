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
            x: r,
            y: (1-r)
        }

        this.velocity = multVectorByScalar(this.direction, this.speed);
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

    getSpeed () {
        return this.speed;
    }

    setSpeed (newSpeed) {
        this.speed = newSpeed;
    }

    getVelocity () {
        this.velocity = multVectorByScalar(this.direction, this.speed);
        return { x: this.velocity.x, y: this.velocity.y };
    }

    collisionAvoidance (boids, config) {
        let vectorSum = {x:0, y:0};
        boids.forEach(boid => {
            if (this.id === boid.id) return;

            let distance = distanceBetween(boid.getPosition(), this.getPosition());
            if (distance > config.separationWeight) return;

            let pushVector = getVector(boid.getPosition(), this.getPosition());
            vectorSum = sumVectors(vectorSum, pushVector);
        })
        vectorSum = normalize(vectorSum);
        vectorSum = divideVectorByScalar(vectorSum, config.separationWeightFraction);
        
        this.setDirection(sumVectors(this.direction, vectorSum));
    }

    velocityMatching (boids, config) {
        let numBoids = 0;
        let velocitySum = {x:0, y:0};

        boids.forEach(boid => {
            if (this.id === boid.id) return;

            let distance = distanceBetween(boid.getPosition(), this.getPosition());
            if (distance > config.separationWeight) return;

            velocitySum = sumVectors(velocitySum, boid.getVelocity());
            ++numBoids;
        })
        velocitySum = divideVectorByScalar(velocitySum, numBoids);

        let velocityDiff = substractVectors(velocitySum, this.getVelocity())
        velocityDiff = divideVectorByScalar(velocityDiff, config.alignmentWeightFraction);

        let velocitySpeed = vectorMagnitude(velocityDiff);
        let velocityDir = normalize(velocityDiff);

        this.setSpeed(this.getSpeed() + velocitySpeed);
        this.setDirection(sumVectors(this.getDirection(), velocityDir));
    }

    flockCentering (boids, config) {
        const numBoids = boids.length;
        let flockCenter = {x:0,y:0};

        boids.forEach(b => {
            if (this.id === b.id) return;

            let pos = b.getPosition();
            flockCenter = sumVectors(flockCenter, pos);
        })

        flockCenter = divideVectorByScalar(flockCenter, numBoids-1);

        let pushVector = normalize(getVector(this.getPosition(), flockCenter));
        pushVector = divideVectorByScalar(pushVector, config.cohesionWeightFraction);

        this.setDirection(sumVectors(this.direction, pushVector));
    }

    updatePosition () {
        this.position = sumVectors(this.position, multVectorByScalar(this.direction, this.speed));

        if (this.position.x < 0) this.position.x = canv.width;
        if (this.position.x > canv.width) this.position.x = 0;
        if (this.position.y < 0) this.position.y = canv.height;
        if (this.position.y > canv.height) this.position.y = 0;
    }

    update (boids, config) {
        this.collisionAvoidance(boids, config);
        this.flockCentering(boids, config);
        //this.velocityMatching(boids, config);

        this.updatePosition();
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
