
class Trunk {

    constructor(position, angle, length) {
        this.position = position;
        this.angle = angle;
        this.length = length;

        this.points = [];
        this.branches = [];
    }

    generatePoints (bonsaiType) {
        this.generateTrunk(bonsaiType.curveFunction);
        this.generateBranches(bonsaiType);
    }

    generateTrunk (curveFunction) {
        let { x, y } = this.position;
        for (let i = 0; i < this.length; ++i) {
            let displacement = curveFunction(i, toRadians(this.angle));
            let point = {
                x: x + displacement.x,
                y: y + displacement.y,
            }
            this.points.push(point);
        }
    }

    branchify(bonsaiType, startBranchingPoint, angleNewBranch, lengthNewBranch) {
        angleNewBranch *= 0.5;
        if (angleNewBranch < 0) angleNewBranch = 360 - angleNewBranch;
        if (angleNewBranch > 360) angleNewBranch = angleNewBranch - 360;

        let leftBranch = new Trunk(startBranchingPoint, this.angle + angleNewBranch, this.length * lengthNewBranch);
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

        for (branchingPosition; branchingPosition < this.length; branchingPosition += random_round(20, 30)) {
            branchingPoint = this.points[branchingPosition];
            this.branchify(bonsaiType, branchingPoint, random_round(angleNewBranch-10, angleNewBranch+10), lengthNewBranch);
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