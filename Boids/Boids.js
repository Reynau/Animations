class Boids {

    constructor (numBoids) {
        this.numBoids = numBoids;
        this.boids = [];

        this.stopped = false;

        this.separationWeight = 500;

        this.separationWeightFraction = 33;
        this.alignmentWeightFraction = 33;
        this.cohesionWeightFraction = 20;

        for (let i = 0; i < numBoids; ++i) {
            this.boids.push(new Boid(i));
        }
    }

    update () {
        if (this.stopped) return;

        this.boids.forEach(boid => boid.update(this.boids, {
            separationWeight: this.separationWeight,
            separationWeightFraction: this.separationWeightFraction,
            alignmentWeightFraction: this.alignmentWeightFraction,
            cohesionWeightFraction: this.cohesionWeightFraction,
        }))
    }

    render () {
        this.boids.forEach(boid => boid.render())
    }
}
