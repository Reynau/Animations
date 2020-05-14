const Hokidachi = {
    curveFunction: function (i, angle) {
        let dx = random_round(-5,5)
        let dy = random_round(-5,5)
        return {
            x: dx + i * Math.cos(angle),
            y: dy + i * Math.sin(angle),
        }
    },
    branchingMethod: {
        startBranching: 2/3,
        minimumLengthForBranch: 20,
        lengthNewBranch: 1/2,
        angleNewBranch: 45,
    }
}