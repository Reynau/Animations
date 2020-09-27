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
    var point;
		var x0 = 10;
		var y0 = 10;
		var x1 = 900;
		var y1 = 400;
		
		var pointList = this.pointList
		
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 1.01;
		ctx.beginPath();
		point = pointList.first;
		ctx.moveTo(x0+(x1 - x0)*point.x, y0+(y1 - y0)*point.y);
		while (point.next != null) {
			point = point.next;
			ctx.lineTo(x0+(x1 - x0)*point.x, y0+(y1 - y0)*point.y);
		}
		ctx.stroke();
  }
}