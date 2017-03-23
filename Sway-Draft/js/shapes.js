const LEFT = 'LEFT';
const RIGHT = 'RIGHT';

var xDelta;
var yDelta;

var m1;
var m2;

var sectX;

function lineIntersect(x1, y1, x2, y2, x3, y3, x4, y4, height) {
	y1 = height - y1; 
	y2 = height - y2; 
	y3 = height - y3; 
	y4 = height - y4; 
	m1 = (y2 - y1) / (x2 - x1); 
	m2 = (y4 - y3) / (x4 - x3); 
	
	sectX = ((-1 * m2 * x3) + y3 - ((-1 * m1 * x1) + y1)) / (m1 - m2); 

	if (sectX >= Math.min(x3, x4)) {
		if (sectX <= Math.max(x3, x4)) {
			if (sectX >= Math.min(x1, x2)) {
				if (sectX <= Math.max(x1, x2)) {
					return true;
				}
			}
		}
	}
	
	return false;
}

class Circle {
	constructor(x, y, r, col, owid, ocol, ctx, cnv) {
		this.x = x; 
		this.y = y; 
		this.r = r; 
		this.col = col; 
		this.owid = owid; 
		this.ocol = ocol; 
		this.ctx = ctx;
		this.cnv = cnv;
		this.deg = 1.5 * Math.PI; 
		this.dir = LEFT;
	}
	
	draw() {
		this.ctx.fillStyle = this.col; 
		this.ctx.lineWidth = this.owid;
		this.ctx.strokeStyle = this.ocol;
		
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.r, 0.0, 2.0 * Math.PI);
		this.ctx.fill();
		this.ctx.stroke();
		this.ctx.closePath();
	}
	
	hitWall(pad) {
		if (this.x < this.r + pad) {
			return true;
		} else if (this.x > (this.cnv.height - (this.r + pad))) {
			return true;
		} else {
			return false;
		}
	}
	
	switchDirection() {
		if (this.dir == LEFT) {
			this.dir = RIGHT;
		} else {
			this.dir = LEFT;
		}
	}
	
	freeMove(speed) {
		if (this.dir == LEFT) {
			this.deg -= speed;
		} else {
			this.deg += speed;
		}
	}
	
	move(speed, armlength, cen, pad) {
		this.freeMove(speed); 
		
		this.x = cen.x + Math.cos(this.deg) * armlength;
		this.y = cen.y - Math.sin(this.deg) * armlength;
		
		if (this.hitWall(pad)) {
			this.switchDirection();
			this.freeMove(2 * speed);
			
			this.x = cen.x + Math.cos(this.deg) * armlength;
			this.y = cen.y - Math.sin(this.deg) * armlength;
		}
	}
	
	paint(colour, percent) {
		this.ctx.lineWidth = this.owid;
		this.ctx.strokeStyle = this.ocol;
		
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.r, 0.0, percent * 2.0 * Math.PI / 100);
		this.ctx.stroke();
		this.ctx.closePath();
	}
}

class Diamond {
	constructor(id, type, r, col, ocol, ctx, cnv) {
		this.id = id;
		this.type = type;
		this.x = null; 
		this.y = -2 * r;
		this.r = r;
		this.col = col;
		this.ocol = ocol;
		this.ctx = ctx;
		this.cnv = cnv;
	}
	
	fill() {
		this.ctx.fillStyle = this.col;
		
		this.ctx.beginPath(); 
		this.ctx.moveTo(this.x, this.y - this.r * 0.7); 
		this.ctx.lineTo(this.x - this.r * 0.7, this.y); 
		this.ctx.lineTo(this.x, this.y + this.r * 0.7); 
		this.ctx.lineTo(this.x + this.r * 0.7, this.y); 
		this.ctx.lineTo(this.x, this.y - this.r * 0.7); 
		this.ctx.fill();
		this.ctx.closePath();
	}
	
	draw() {
		this.ctx.strokeStyle = this.ocol;
		this.ctx.lineWidth = this.r * 0.3;
		
		this.ctx.save();
		this.ctx.translate(this.x, this.y);
		this.ctx.rotate(Math.PI / 4); 
		
		this.ctx.beginPath();
		this.ctx.rect(-this.r, -this.r, 2 * this.r, 2 * this.r);
		this.ctx.stroke();
		this.ctx.closePath();
		
		this.ctx.restore();
		
		this.fill();
	}
	
	place(range) {
		if (this.cnv.width < range) {
			this.x = Math.random() * (this.cnv.width - 4 * this.r) + 
					 2 * this.r;
		} else {
			this.x = Math.random() * range + 0.5 * (this.cnv.width - 
													range);
		}
	}
	
	freeMove(speed) {
		this.y += speed;
	}
	
	hitFloor() {
		if (this.y >= this.cnv.height) {
			return true;
		} else {
			return false;
		}
	}
	
	checkHitBox(x, y, r) {
		xDelta = Math.pow(this.x - x, 2);
		yDelta = Math.pow(this.y - y, 2);
		
		if (xDelta + yDelta < Math.pow(r, 2)) {
			return true;
		} else {
			return false;
		}
	}
}

class Line {
	constructor(stX, stY, endX, endY, wid, col, ctx, cnv) {
		this.stX = stX;
		this.stY = stY;
		this.endX = endX;
		this.endY = endY;
		this.wid = wid;
		this.col = col;
		this.ctx = ctx;
		this.cnv = cnv;
		this.length = endY - stY;
	}
	
	draw() {
		this.ctx.lineWidth = this.wid;
		this.ctx.strokeStyle = this.col;
		
		this.ctx.beginPath();
		this.ctx.moveTo(this.stX, this.stY);
		this.ctx.lineTo(this.endX, this.endY);
		this.ctx.stroke();
		this.ctx.closePath();
	}
	
	checkHitBox(d) {
		if (lineIntersect(this.stX, this.stY, this.endX, this.endY,
					d.x, d.y - d.r, d.x + d.r, d.y, this.cnv.height)) {
			return true;				
		}
		if (lineIntersect(this.stX, this.stY, this.endX, this.endY,
					d.x, d.y - d.r, d.x - d.r, d.y, this.cnv.height)) {
			return true;				
		}
		if (lineIntersect(this.stX, this.stY, this.endX, this.endY,
					d.x, d.y + d.r, d.x + d.r, d.y, this.cnv.height)) {
			return true;				
		}
		if (lineIntersect(this.stX, this.stY, this.endX, this.endY,
					d.x, d.y + d.r, d.x - d.r, d.y, this.cnv.height)) {
			return true;				
		}
		return false;
	}
	
	paint(colour, percent) {
		this.ctx.lineWidth = this.wid;
		this.ctx.strokeStyle = this.col;
		
		this.ctx.beginPath();
		this.ctx.moveTo(this.endX - ((this.endX - this.stX) / 100 * percent),
						this.endY - ((this.endY - this.stY) / 100 * percent));
						
		this.ctx.stroke();
		this.ctx.closePath();
	}
}