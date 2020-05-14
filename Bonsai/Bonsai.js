
class Trunk {

    constructor(position, angle, length) {
        this.position = position;
        this.angle = angle;
        this.length = length;

        this.points = [];
        this.branches = [];
    }

    generatePoints (bonsaiType) {
        this.generateTrunk();
        this.generateBranches(bonsaiType);
    }

    generateTrunk () {
        let { x, y } = this.position;
        let angle = toRadians(this.angle);
        for (let i = 0; i < this.length; ++i) {
            let px = 1;
            let py = 2;
            let dx = random_round(-px,px)
            let dy = random_round(-py,py)
            let displacement = {
                x: dx * Math.sin(angle) + 1 * Math.cos(angle),
                y: dy * Math.cos(angle) + 1 * Math.sin(angle),
            }
            let point = {
                x: x + displacement.x,
                y: y + displacement.y,
            }
            this.points.push(point);

            x = point.x;
            y = point.y;
        }
    }
    
    branchify(bonsaiType, startBranchingPoint, angleNewBranch, lengthNewBranch) {
        let leftBranch = new Trunk(startBranchingPoint, this.angle + random_round(angleNewBranch/3, angleNewBranch), this.length * lengthNewBranch);
        let rightBranch = new Trunk(startBranchingPoint, this.angle - angleNewBranch, this.length * lengthNewBranch);
        leftBranch.generatePoints(bonsaiType);
        rightBranch.generatePoints(bonsaiType);

        this.branches.push(leftBranch);
        this.branches.push(rightBranch);
    }

    generateBranches(bonsaiType) {
        const {
            startBranching,
            minimumLengthForBranch,
            lengthNewBranch,
            angleNewBranch
        } = bonsaiType.branchingMethod;

        if (minimumLengthForBranch > this.length) return;

        let branchingPosition = Math.round(startBranching * this.points.length) - 1;
        let branchingPoint = this.points[branchingPosition];

        for (branchingPosition; branchingPosition < this.length; branchingPosition += random_round(10, 30)) {
            branchingPoint = this.points[branchingPosition];
            this.branchify(bonsaiType, branchingPoint, random_round(angleNewBranch-20, angleNewBranch+20), lengthNewBranch);
        }
    }

    draw () {
        let {x, y} = this.position;
        ctx.beginPath();
        ctx.moveTo(x, y);
        this.points.forEach(point => ctx.lineTo(point.x, point.y));
        ctx.stroke();
        
        this.branches.forEach(branch => branch.draw());
    }
}

class Bonsai {

    constructor (position, angle, length) {
        this.position = position;
        this.angle = angle;
        this.length = length;
    }

    generate (bonsaiType) {
        this.trunk = new Trunk(this.position, this.angle, this.length);
        this.trunk.generatePoints(bonsaiType);
    }

    draw () {
        this.trunk.draw();
    }
}