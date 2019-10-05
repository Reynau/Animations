class Boids {

    constructor (numBoids) {
        this.numBoids = numBoids;
        this.boids = [];

        this.stopped = false;

        this.separationWeight = 30;
        this.separationWeightFraction = 50;

        this.alignmentWeightFraction = 10;

        this.cohesionWeightFraction = 50;

        for (let i = 0; i < numBoids; ++i) {
            this.boids.push(new Boid(i));
        }
    }

    update () {
        if (this.stopped) return;

        this.boids.forEach(boid => {
            this.collisionAvoidance(boid);
            this.velocityMatching(boid);
            this.flockCentering(boid);

            boid.update();
        })
    }

    render () {
        this.boids.forEach(boid => boid.render())
    }

    collisionAvoidance (boid) {
        let vectorSum = {x:0, y:0};
        this.boids.forEach(b => {
            if (boid.id === b.id) return;

            let distance = distanceBetween(b.getPosition(), boid.getPosition());
            if (distance > this.separationWeight) return;

            let pushVector = getVector(b.getPosition(), boid.getPosition());
            vectorSum = sumVectors(vectorSum, pushVector);
        })
        vectorSum = normalize(vectorSum);

        return divideVectorByScalar(vectorSum, this.separationWeightFraction);
    }

    velocityMatching (boid) {
        let velocitySum = {x:0, y:0};

        this.boids.forEach(b => {
            if (boid.id === b.id) return;

            let vel = b.getVelocity();
            velocitySum = sumVectors(velocitySum, vel);
        })
        velocitySum = divideVectorByScalar(velocitySum, this.numBoids-1);

        let velocityDiff = substractVectors(velocitySum, boid.getVelocity())
        velocityDiff = divideVectorByScalar(velocityDiff, this.alignmentWeightFraction);

        let velocitySpeed = vectorMagnitude(velocityDiff);
        let velocityDir = normalize(velocityDiff);

        boid.setSpeed(boid.getSpeed() + velocitySpeed);
        boid.setDirection(boid.getDirection() + velocityDir);
    }

    flockCentering (boid) {
        let flockCenter = {x:0,y:0};

        this.boids.forEach(b => {
            if (boid.id === b.id) return;

            let pos = b.getPosition();
            flockCenter = sumVectors(flockCenter, pos);
        })

        flockCenter = divideVectorByScalar(flockCenter, this.numBoids-1);

        let pushVector = normalize(getVector(boid.getPosition(), flockCenter));

        return divideVectorByScalar(pushVector, this.cohesionWeightFraction);
    }
}
