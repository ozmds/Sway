class Circle {
	constructor(x, y, r, colour, outlineWidth, outlineColour, context) {
		this.x = x; 
		this.y = y; 
		this.r = r; 
		this.colour = colour; 
		this.outWidth = outlineWidth; 
		this.outColour = outlineColour; 
		this.context = context; 
		this.deg = 270; 
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
		ctx.fillStyle = this.colour; 
		
		ctx.beginPath(); 
		ctx.moveTo(x, y - r); 
		ctx.lineTo(x - r, y); 
		ctx.lineTo(x, y + r); 
		ctx.lineTo(x + r, y); 
		ctx.lineTo(x, y - r); 
		ctx.fill(); 
		ctx.closePath(); 
	}
	
	place(line_height, width) {
		var x; 
		var range = 2 * (line_height + 30); 
		
		if (width < range) {
			x = Math.round(Math.random() * (width - 40)) + 20;
		} else {
			x = Math.round(Math.random() * range) + (0.5 * (width - range));
		}

		this.x = x; 

		this.draw(); 
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

class Button {
	constructor(x, y, width, height, colour, outWidth, outColour, context, font, title) {
		this.x = x; 
		this.y = y; 
		this.width = width; 
		this.height = height; 
		this.colour = colour; 
		this.outWidth = outWidth;
		this.outColour = outColour;
		this.font = font;
		this.title = title; 
		this.context = context; 
	}
	
	draw() {
		var ctx = this.context; 
		
		ctx.fillStyle = this.colour; 
		ctx.lineWidth = this.outWidth; 
		ctx.strokeStyle = this.outColour; 
		
		ctx.beginPath(); 
		ctx.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
		ctx.fill(); 
		ctx.stroke(); 
		ctx.closePath();
		
		ctx.textAlign = 'center'; 
		ctx.textBaseline = 'middle';
		ctx.font = this.font; 
		ctx.fillStyle = this.outColour; 
		
		ctx.fillText(this.title, this.x, this.y - this.height * 0.20);  
	}
	
	isClicked(eventX, eventY) {
		if (eventX > this.x - this.width / 2) {
			if (eventX < this.x + this.width / 2) {
				if (eventY > this.y - this.height / 2) {
					if (eventY < this.y + this.height / 2) {
						return true; 
					}
				}
			}
		}
		
		return false; 
	}
}