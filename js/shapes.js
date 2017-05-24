const LEFT = 'left';
const RIGHT = 'right';

const REGULAR = 'regular';
const BALLOON = 'balloon';
const SLOW_DOWN = 'slow_down';

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
		this.sp = 0;
	}
	
	getX() {
		return this.x;
	}
	
	getY() {
		return this.y;
	}
	
	getR() {
		return this.r;
	}	
	
	flip() {
		if (this.dir == LEFT) {
			this.dir = RIGHT;
		} else {
			this.dir = LEFT;
		}
	}
	
	drawInnerCircle() {
		this.ctx.lineWidth = this.owid * 0.80;
		this.ctx.strokeStyle = this.ocol;
		
		this.ctx.beginPath(); 
		this.ctx.arc(this.x, this.y, this.r * 0.65, 0.0 * Math.PI + (this.sp * 2.0 * Math.PI),
													2.0 * Math.PI * 0.85 + (this.sp * 2.0 * Math.PI));
		this.ctx.stroke();
		this.ctx.closePath();
	}
	
	spin() {
		this.sp = this.sp + 0.008;
	}
	
	draw() {
		this.ctx.fillStyle = this.col;
		this.ctx.lineWidth = this.owid;
		this.ctx.strokeStyle = this.ocol;
		
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.r, 0.0 * Math.PI, 2.0 * Math.PI);
		this.ctx.fill();
		this.ctx.stroke();
		this.ctx.closePath();
	}
	
	hitWall(pad) {
		if (this.x < this.r + pad) {
			return true;
		} else if (this.x > (this.cnv.width - (this.r + pad))) {
			return true;
		}
	}
	
	move(speed, armLength, cen, pad) {
		if (this.dir == LEFT) {
			this.deg -= speed;
		} else {
			this.deg += speed;
		}
		
		this.x = cen.getX() + Math.cos(this.deg) * armLength;
		this.y = cen.getY() - Math.sin(this.deg) * armLength;
		
		if (this.hitWall(pad)) {
			this.flip();
			if (this.dir == LEFT) { 
				this.deg -= 2 * speed;
			} else {
				this.deg += 2 * speed;
			}
			
			this.x = cen.getX() + Math.cos(this.deg) * armLength;
			this.y = cen.getY() - Math.sin(this.deg) * armLength;
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
		this.len = endY - stY;
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
	
	getLen() {
		return this.len;
	}
	
	setEndX(x) {
		this.endX = x;
	}
	
	setEndY(y) {
		this.endY = y;
	}
}

class Diamond {
	constructor(r, ctx, cnv, type) {
		this.x = null;
		this.y = -2 * r;
		this.r = r;
		this.col = SECONDARY_COLOUR;
		this.ctx = ctx;
		this.cnv = cnv;
		this.type = type;
		this.hitTimer = 0;
		
		var typeInt = Math.random() * 100;

		if (typeInt < 50) {
			this.type = REGULAR;
		} else if (typeInt < 75) {
			this.type = BALLOON;
		} else {
			this.type = SLOW_DOWN;
		}
	}
	
	getHitTimer() {
		return this.hitTimer;
	}	
	
	updateHitTimer(interval) {
		this.hitTimer = this.hitTimer + interval;
	}
	
	getY() {
		return this.y;
	}
	
	getR() {
		return this.r;
	}
	
	checkHitPen(x, y, r) {
		var dist_x = Math.pow(this.x - x, 2);
		var dist_y = Math.pow(this.y - y, 2);
		
		var dist_c = Math.sqrt(Math.pow(this.r, 2) / 2);
		
		if (Math.pow(r + dist_c, 2) > (dist_x + dist_y)) {
			return true;
		}
		
		return false;
		
	}
	
	hitOrb() {
		if (this.hitTimer > 0) {
			this.r = this.r * 0.98;
		}
	}
	
	fill() {
		this.hitOrb();
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
		
		if (this.type == REGULAR) {
			this.drawRegular();
		} else if (this.type == BALLOON) {
			this.drawBalloon(); 
		} else if (this.type == SLOW_DOWN) {
			this.drawSlowDown();
		}
	}
	
	drawSlowDown() {
		this.hitOrb();
		this.ctx.strokeStyle = this.col;
		this.ctx.lineWidth = this.r * 0.30;
		this.ctx.fillStyle = this.col;
		
		this.ctx.beginPath();
		this.ctx.moveTo(this.x - this.r * 1.5, this.y - this.r * 1.5);
		this.ctx.lineTo(this.x + this.r * 1.5, this.y - this.r * 1.5);
		this.ctx.lineTo(this.x, this.y + this.r * 1.5);
		this.ctx.lineTo(this.x - this.r * 1.5, this.y - this.r * 1.5);
		this.ctx.stroke();
		this.ctx.closePath();
		
		this.ctx.beginPath();
		this.ctx.moveTo(this.x - this.r * 0.6, this.y - this.r * 0.9);
		this.ctx.lineTo(this.x + this.r * 0.6, this.y - this.r * 0.9);
		this.ctx.lineTo(this.x, this.y + this.r * 0.6);
		this.ctx.lineTo(this.x - this.r * 0.9, this.y - this.r * 0.9);
		this.ctx.fill();
		this.ctx.closePath();
	}
	
	drawBalloon() {
		this.hitOrb();
		this.ctx.strokeStyle = this.col;
		this.ctx.lineWidth = this.r * 0.30;
		this.ctx.fillStyle = PRIMARY_COLOUR;
		
		this.ctx.beginPath();
		this.ctx.rect(this.x - this.r * 0.6, this.y, this.r * 1.2, 2 * this.r);
		this.ctx.stroke();
		this.ctx.closePath();
		
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.r * 1.4, 0.0 * Math.PI, 2.0 * Math.PI);
		this.ctx.fill();
		this.ctx.stroke();
		this.ctx.closePath();
		
		this.ctx.fillStyle = SECONDARY_COLOUR;
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.r * 0.8, 0.0 * Math.PI, 2.0 * Math.PI);
		this.ctx.fill();
		this.ctx.closePath();
	}
	
	drawRegular() {
		this.hitOrb();
		this.ctx.strokeStyle = this.col;
		this.ctx.lineWidth = this.r * 0.30;
		
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
	
	place(armLength, rad) {
		var range = 2 * (armLength + rad);
		
		if (this.cnv.width < range) {
			this.x = Math.round(Math.random() * (this.cnv.width - 4 * this.r)) + 2 * this.r;
		} else {
			this.x = Math.round(Math.random() *	 range) + (0.5 * (this.cnv.width - range));
		}
		
		this.draw();
	}
	
	move(speed) {
		this.y += speed;
	}
	
	checkHitBox(pen) {
		var x = Math.pow(this.x - pen.getX(), 2);
		var y = Math.pow(this.y - pen.getY(), 2);
		
		if (x + y < Math.pow(pen.getR(), 2)) {
			return true;
		}
		
		return false;
	}
}

class Pendulum {
	constructor(cen, pen, arm) {
		this.cen = cen;
		this.pen = pen;
		this.arm = arm;
	}
	
	getPen() {
		return this.pen;
	}
	
	getCen() {
		return this.cen;
	}
	
	getArm() {
		return this.arm;
	}
	
	draw() {
		this.arm.draw();
		this.pen.draw();
		this.cen.draw();
		this.pen.spin();
		this.pen.drawInnerCircle();
	}
	
	move() {
		this.pen.move(SPEED, this.arm.getLen(), this.cen, PADDING);
		this.arm.setEndX(this.pen.getX());
		this.arm.setEndY(this.pen.getY());
	}
}