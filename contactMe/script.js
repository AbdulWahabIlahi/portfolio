let particles = []

const particleCount = 300
const particleSize = 10
const spacing = particleSize * 10
let gravity
let deltaTime = 1 /60
let mousePrevX = 0
let mousePrevY = 0

class Particle{
    constructor(x, y){
        this.pos = createVector(x, y)
        this.vel = createVector(random(-20,20), random(-20,20))
        this.acc = createVector(0, 0)
        this.color = color(255,255,255)
        this.lastPos = createVector(x,y)
        this.densityFactor = 0
        this.rotation = random(TWO_PI)
        this.rotationVel = random(-0.1,0.1)
        this.shapeType = random(["circle", "star"])
    }

    update(){
        this.lastPos.x = this.pos.x
        this.lastPos.y = this.pos.y

        this.rotation += this.rotationVel * deltaTime

        let gravityScale = map(this.densityFactor, 0, 5, 1, 0.7)
        this.acc.add(p5.Vector.mult(gravity, gravityScale))

        if(mouseIsPressed) {
            let d = dist(this.pos.x, this.pos.y, mouseX, mouseY)
            let maxDist = 250
            if(d < maxDist) {
                let mouseVel = createVector(mouseX - mousePrevX, mouseY - mousePrevY)
                let densityScale = map(this.densityFactor, 0, 5, 1, 0.85)
                let force = mouseVel.copy().mult(10 * densityScale)
                let strength = pow(map(d, 0,maxDist, 1,0), 1.75)
                force.mult(strength)
                this.acc.add(force)
                this.rotationVel = mouseVel.mag() * 0.01 * random(-1, 1)
            }
        }

        let dampingFactor = map(this.densityFactor, 0, 5, 1, 1)
        this.vel.add(p5.Vector.mult(this.acc, deltaTime * 15 * dampingFactor))

        if (this.pos.y > height - particleSize * 2) {
            this.vel.mult(0.92)
            this.vel.x *= 0.94
            this.rotationVel *= 0.95
        } else {
            this.vel.mult(0.985)
            this.rotationVel *= 0.99
        }

        this.pos.add(p5.Vector.mult(this.vel, deltaTime * 11.5))

        let bounce = 0.45
        let buffer = particleSize

        if (this.pos.x < buffer){
            this.pos.x = buffer
            this.vel.x = abs(this.vel.x) * bounce
        }
        if (this.pos.x > width - buffer){
            this.pos.x = width - buffer
            this.vel.x = -abs(this.vel.x) * bounce
        }

        if (this.pos.y < buffer){
            this.pos.y = buffer
            this.vel.y = abs(this.vel.y) * bounce
        }
        if (this.pos.y > height - buffer){
            this.pos.y = height - buffer
            this.vel.y = -abs(this.vel.y) * bounce
        }

        this.acc.mult(0)
        this.densityFactor = 0
    }

    draw(){
        noStroke();
        fill(this.color)

        let renderX = lerp(this.lastPos.x, this.pos.x, 0.5)
        let renderY = lerp(this.lastPos.y, this.pos.y, 0.5)

        push()
        translate(renderX, renderY)
        rotate(this.rotation)

        let size = particleSize * 1

        switch(this.shapeType){
            case "circle":
                circle(0,0,size)
                break
            case "star":
                drawStar(0, 0, size/2, size/1.5, 5)
                break
        }

        pop()
    }

    interact(other){
        let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y)

        if(d < spacing){
            let densityIncrease = map(d,0, spacing,1.2,0.1)
            this.densityFactor += densityIncrease
            other.densityFactor += densityIncrease

            let force = p5.Vector.sub(this.pos, other.pos)
            force.normalize()

            let strength = map(d, 0, spacing, 0.8,0)
            strength = pow(strength, 1.1)
            force.mult(strength)

            let overlap = spacing - d
            if (overlap > 0){
                let correctionStrength = map(overlap, 0, spacing, 0.15, 0.25)
                let correction = force.copy().mult(overlap * correctionStrength)

                let boundaryFactor = 1
                if (
                    this.pos.y > height - particleSize * 4 ||
                    this.pos.y < particleSize * 4
                ) {
                    boundaryFactor = 0.7
                }

                correction.mult(boundaryFactor)

                let densityScale = map(
                    this.densityFactor + other.densityFactor,
                    0,
                    10,
                    1,
                    0.9
                )

                let correctionWeight = 0.15 * densityScale
                this.pos.add(p5.Vector.mult(correction, correctionWeight))
                other.pos.sub(p5.Vector.mult(correction, correctionWeight))

                let avgVel = p5.Vector.add(this.vel, other.vel).mult(0.5)
                let velocityBlend = map(d, 0, spacing, 0.15, 0.2)
                velocityBlend *= map(
                    this.densityFactor + other.densityFactor,
                    0,
                    10,
                    1.2,
                    0.95
                )

                if (d < spacing * 0.5){
                    velocityBlend *= 1.5
                }

                this.vel.lerp(avgVel, velocityBlend)
                other.vel.lerp(avgVel, velocityBlend)
            }

            let accForce = force.copy().mult(0.4)
            this.acc.add(accForce)
            other.acc.sub(accForce)
        }
    }
}


function setup(){
    createCanvas(windowWidth, windowHeight)
    frameRate(60)
    gravity = createVector(0, 2.2)
    background("#000000")

    let availableWidth = width * 0.95
    let cols = floor(availableWidth / spacing)
    let requiredRows = ceil(particleCount / cols)
    let startX = (width - cols * spacing) / 0.5
    let startY = height * 0.05

    let count = 0
    let row = 0

    while (count < particleCount) {
        for (let col = 0; col < cols && count < particleCount; col++) {
            let x = startX + col * spacing + random(-5, 5)
            let y = startY + row * spacing + random(-5, 5)
            particles.push(new Particle(x, y))
            count++
        }
        row++
    }
}

function draw(){
    background("#000000")
    deltaTime = 1 / frameRate()

    let gridSize = spacing

    let grid = {}

    for (let i = 0; i < particles.length; i++) {
        let p = particles[i]
        p.update()

        let gridX = floor(p.pos.x / gridSize)
        let gridY = floor(p.pos.y / gridSize)
        let key = gridX + "," + gridY

        if (!grid[key]) {
            grid[key] = []
        }
        grid[key].push(i)
    }

    for (let key in grid) {
        let cell = grid[key]
        let [gx,gy] = key.split(",").map(Number)

        for(let dx = -1; dx <= 1; dx++){
            for (let dy = -1; dy <= 1; dy++){
                let neighborKey = (gx + dx) + "," + (gy + dy)
                if (grid[neighborKey]) {
                    for (let i of cell){
                        for (let j of grid[neighborKey]){
                            if (i !== j){
                                particles[i].interact(particles[j])
                            }
                        }
                    }
                }
            }
        }
    }

    for (let p of particles){
        p.draw()
    }

    mousePrevX = mouseX
    mousePrevY = mouseY
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight)
}

function drawStar(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
        let sx = x + cos(a) * radius2;
        let sy = y + sin(a) * radius2;
        vertex(sx, sy);
        sx = x + cos(a + halfAngle) * radius1;
        sy = y + sin(a + halfAngle) * radius1;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}
