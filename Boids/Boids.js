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
            let collisionAvoidanceVector = this.collisionAvoidance(boid);
            let velocityMatchingVector = this.velocityMatching(boid);
            let flockCenteringVector = this.flockCentering(boid);

            let dir = boid.getDirection();
            let newDir = sumVectors(dir, collisionAvoidanceVector, velocityMatchingVector, flockCenteringVector);
            boid.setDirection(newDir);
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

            let dir = b.getDirection();
            velocitySum = sumVectors(velocitySum, dir);
        })
        velocitySum = divideVectorByScalar(velocitySum, this.numBoids-1);
        velocitySum = normalize(velocitySum);

        let velocityDiff = substractVectors(velocitySum, boid.getDirection())

        return divideVectorByScalar(velocityDiff, this.alignmentWeightFraction);
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
