const Hokidachi = {
    curveFunction: function (i, angle) {
        let p = 5;
        let dx = random_round(-p,p)
        let dy = random_round(-p,p)
        return {
            x: dx + i * Math.cos(angle),
            y: dy + i * Math.sin(angle),
        }
    },
    branchingMethod: {
        startBranching: 2/3,
        minimumLengthForBranch: 160,
        lengthNewBranch: 1/2,
        angleNewBranch: 45,
    }
}