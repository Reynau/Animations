class Circle {
  constructor (center, minRadius, maxRadius, color0, color1) {
    this.center = center
    this.pointList = {}
    this.phase = Math.random()*Math.PI*2
    this.minRadius = minRadius
    this.maxRadius = maxRadius
    this.color0 = color0
    this.color1 = color1
  }

  generateLineColor () {
    return this.color1
  }

  generateFillColor () {
    const gradient = ctx.createRadialGradient(
      this.center.x, 
      this.center.y, 
      0.67 * this.maxRadius, 
      this.center.x, 
      this.center.y, 
      this.maxRadius)

    gradient.addColorStop(0, this.color0)
    gradient.addColorStop(1, this.color1)

    return gradient
  }

  update () {
    const numIterations = 9
    this.pointList.first = {x:0, y:1}
    let lastPoint = {x:1, y:1}
    let minY = 1
    let maxY = 1
    let point
    let nextPoint
    let dx, newX, newY

    this.pointList.first.next = lastPoint
    for (let i=0; i < numIterations; ++i) {
      point = this.pointList.first
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
      point = this.pointList.first
      while (point != null) {
        point.y = normalizeRate*(point.y - minY)
        point = point.next
      }
    }
    else {
      point = this.pointList.first
      while (point != null) {
        point.y = 1
        point = point.next
      }
    }
  }

  render () {
    ctx.strokeStyle = this.generateLineColor()
    ctx.lineWidth = 1.01
    ctx.fillStyle = this.generateFillColor()
    ctx.beginPath()
    
    let point = this.pointList.first
    let theta = this.phase
    let radius = this.minRadius + point.y*(this.maxRadius - this.minRadius)
    let x = this.center.x + radius*Math.cos(theta)
    let y = this.center.y + radius*Math.sin(theta)
    ctx.lineTo(x, y)
    while(point.next != null) {
      point = point.next
      theta = 2*Math.PI*point.x + this.phase
      radius = this.minRadius + point.y*(this.maxRadius - this.minRadius)
      x = this.center.x + radius*Math.cos(theta)
      y = this.center.y + radius*Math.sin(theta)
      ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.fill()
  }
}