/*Definitions of Geometric Shapes Present in Game: Circle, Line and Diamond */

class Circle {
	constructor(x, y, r, colour, outlineWidth, outlineColour, context) {
		this.x = x; 
		this.y = y; 
		this.r = r; 
		this.colour = colour; 
		this.outWidth = outlineWidth; 
		this.outColour = outlineColour; 
		this.context = context; 
		this.deg = 1.5 * Math.PI; 
		this.going_left = true; 
	}
	
	draw() {
		var ctx = this.context; 
		ctx.fillStyle = this.colour; 
		ctx.lineWidth = this.outWidth; 
		ctx.strokeStyle = this.outColour; 
		
		ctx.beginPath(); 
		ctx.arc(this.x, this.y, this.r, 0.0 * Math.PI, 2.0 * Math.PI);
		ctx.fill(); 
		ctx.stroke(); 
		ctx.closePath(); 
	}
	
	move(speed, armLength, cen, c, pad) {
		var rad; 
		
		if (this.going_left) {
			this.deg -= speed; 
		} else {
			this.deg += speed;
		}
		
		rad = this.deg; 
		
		this.x = cen.x + Math.cos(rad) * armLength; 
		this.y = cen.y - Math.sin(rad) * armLength; 
		
		if (this.hitWall(c.height, c.width, pad)) {
			this.going_left = !this.going_left; 
			if (this.going_left) {
				this.deg -= 2 * speed; 
			} else {
				this.deg += 2 * speed;
			}
			
			rad = this.deg; 
			
			this.x = cen.x + Math.cos(rad) * armLength; 
			this.y = cen.y - Math.sin(rad) * armLength;
		}
		
	}
	
	hitWall(cHeight, cWidth, pad) {
		if (this.x < this.r + pad) {
			return true; 
		} else if (this.x > (cWidth - (this.r + pad))) {
			return true; 
		} 
	}
}

class Diamond {
	constructor(r, colour, context) {
		this.x = null; 
		this.y = -2 * r; 
		this.r = r; 
		this.colour = colour; 
		this.context = context; 
	}
	
	draw() {
		var ctx = this.context; 
		var x = this.x; 
		var y = this.y; 
		var r = this.r; 
		ctx.strokeStyle = this.colour;
		ctx.lineWidth = r * 0.30; 
		
		ctx.save(); 
		
		ctx.translate(x, y); 
		ctx.rotate(Math.PI / 4); 
		
		ctx.beginPath(); 
		ctx.rect(-r, -r, 2 * r, 2 * r);
		ctx.stroke(); 
		ctx.closePath();
		
		ctx.restore(); 
	}
	
	fill() {
		var ctx = this.context; 
		var x = this.x; 
		var y = this.y; 
		var r = this.r;
		ctx.fillStyle = "red";
		
		ctx.beginPath(); 
		ctx.moveTo(x, y - r * 0.4); 
		ctx.lineTo(x - r * 0.4, y); 
		ctx.lineTo(x, y + r * 0.4); 
		ctx.lineTo(x + r * 0.4, y); 
		ctx.lineTo(x, y - r * 0.4); 
		ctx.fill(); 
		ctx.closePath(); 
	}
	
	place(line_height, width, radius) {
		var x; 
		var range = 2 * (line_height + radius); 
		
		if (width < range) {
			x = Math.round(Math.random() * (width - 4 * this.r)) + 2 * this.r;
		} else {
			x = Math.round(Math.random() * range) + (0.5 * (width - range));
		}

		this.x = x; 

		this.draw(); 
	}
	
	move(speed, floor, state, pen) {
		this.y += speed; 
		
		if (this.y >= floor) {
			return "over"; 
		} else if (this.checkHitBox(pen.x, pen.y, pen.r)){
			return "score"; 
		}
	}
	
	checkHitBox(x, y, r) {
		var xDelta = Math.pow(this.x - x, 2); 
		var yDelta = Math.pow(this.y - y, 2); 
		
		if (xDelta + yDelta < Math.pow(r, 2)) {
			return true; 
		}
		
		return false; 
	}
}

class Line {
	constructor(startX, startY, endX, endY, width, colour, context) {
		this.startX = startX; 
		this.startY = startY; 
		this.endX = endX; 
		this.endY = endY; 
		this.width = width; 
		this.colour = colour; 
		this.context = context; 
		this.length = endY - startY; 
	}
	
	draw() {
		var ctx = this.context; 
		
		ctx.lineWidth = this.width; 	
		ctx.strokeStyle = this.colour; 
		
		ctx.beginPath(); 
		ctx.moveTo(this.startX, this.startY); 
		ctx.lineTo(this.endX, this.endY); 
		ctx.stroke();
		ctx.closePath(); 
	}
}