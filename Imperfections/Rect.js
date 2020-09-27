class Rect {
  constructor (position, width, height, color0, color1) {
    this.basePosition = position
    this.width = width
    this.height = height
    this.sidePoints = []
    this.color0 = color0
    this.color1 = color1
  }

  generateLineColor () {
    return this.color1
  }

  generateFillColor () {
    return this.color0
  }

  generatePointList () {
    const numIterations = 8
    let pointList = {}
    let lastPoint = {x:1, y:1}
    let minY = 1
    let maxY = 1
    let point
    let nextPoint
    let dx, newX, newY

    pointList.first = {x:0, y:1}
    pointList.first.next = lastPoint
    for (let i=0; i < numIterations; ++i) {
      point = pointList.first
      while(point.next != null) {
        nextPoint = point.next

        dx = nextPoint.x - point.x

        newX = (point.x+nextPoint.x)*0.5
        newY = (point.y+nextPoint.y)*0.5

        newY += dx*(Math.random()*2 - 1)

        let newPoint = {x:newX, y:newY}

        if (newY < minY) minY = newY
        if (newY > maxY) maxY = newY

        newPoint.next = nextPoint
        point.next = newPoint

        point = nextPoint
      }
    }

    //normalize points
    if (maxY != minY) {
      const normalizeRate = 1/(maxY-minY)
      point = pointList.first
      while (point != null) {
        point.y = normalizeRate*(point.y - minY)
        point = point.next
      }
    }
    else {
      point = pointList.first
      while (point != null) {
        point.y = 1
        point = point.next
      }
    }

    return pointList
  }

  update () {
    for (let i=0; i<4; ++i) {
      this.sidePoints[i] = this.generatePointList()
    }
  }

  render () {
    let cornerDrift = 3
    let drawDriftX = 3
    let drawDriftY = 3
    let corner = []
    let driftVector = []
    let pointList
    let nextCorner
    let functionPoint
    let endpointY
    let nextX, nextY

    for (let i=0; i<4; ++i) {
      corner[i] = {}
    }

    let x = this.basePosition.x
    let y = this.basePosition.y
    let w = this.width
    let h = this.height
    
    x += cornerDrift*(2*Math.random()-1)
		y += cornerDrift*(2*Math.random()-1)

    corner[0].x = x + cornerDrift*(Math.random()*2 - 1)
    corner[0].y = y + cornerDrift*(Math.random()*2 - 1)
    corner[1].x = x + w + cornerDrift*(Math.random()*2 - 1)
    corner[1].y = y + cornerDrift*(Math.random()*2 - 1)
    corner[2].x = x + w + cornerDrift*(Math.random()*2 - 1)
    corner[2].y = y + h + cornerDrift*(Math.random()*2 - 1)
    corner[3].x = x + cornerDrift*(Math.random()*2 - 1)
    corner[3].y = y + h + cornerDrift*(Math.random()*2 - 1)

    driftVector[0] = {x:0, y:drawDriftY}
    driftVector[1] = {x:drawDriftX, y:0}
    driftVector[2] = {x:0, y:drawDriftY}
    driftVector[3] = {x:drawDriftX, y:0}

    ctx.strokeStyle = this.generateLineColor()
    ctx.fillStyle = this.generateFillColor()
    ctx.lineWidth = 1.01
    ctx.beginPath()
    ctx.moveTo(corner[0].x, corner[0].y)
    for (let i=0; i<4; ++i) {
      nextCorner = corner[(i+1) % 4]
      pointList = this.sidePoints[i]
      functionPoint = pointList.first
      endpointY = functionPoint.y
      while (functionPoint != null) {
        nextX = corner[i].x + functionPoint.x*(nextCorner.x-corner[i].x)
        nextY = corner[i].y + functionPoint.x*(nextCorner.y-corner[i].y)
        nextX += driftVector[i].x*(functionPoint.y - endpointY)
        nextY += driftVector[i].y*(functionPoint.y - endpointY)
        console.log(nextX, nextY)
        ctx.lineTo(nextX, nextY)
        functionPoint = functionPoint.next
      }
    }
    ctx.stroke()
    ctx.fill()
  }
}