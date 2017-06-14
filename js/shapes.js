const LEFT = 'left';
const RIGHT = 'right';

const REGULAR = 'regular';
const BALLOON = 'balloon';
const SLOW_DOWN = 'slow_down';
const POISON = 'poison';
const SPIKE = 'spike';

var arrow = new Image();
var knife = new Image();
var bomb = new Image();
var crystal = new Image();
var balloon = new Image();

knife.src = 'data/knife.png';
arrow.src = 'data/arrow.png';
bomb.src = 'data/bomb.png';
crystal.src = 'data/diamond.png';
balloon.src = 'data/balloon.png';

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
		this.oldR = r;
	}
	
	setCol(x) {
		this.col = x;
	}
	
	getOldR() {
		return this.oldR;
	}
	
	setR(x) {
		this.r = x;
	}
	
	setY(x) {
		this.y = x;
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
	
	getDeg() {
		return this.deg;
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
	
	drawSpikes(a) {
		var i;
		var j;
		
		var x;
		var y;
		
		this.ctx.strokeStyle = this.ocol;
		this.ctx.lineWidth = this.owid * 0.8;
		this.ctx.fillStyle = this.col;
		
		for (i = 0; i < 6; i++) {
			this.ctx.beginPath();
			for (j = 0; j < 3; j++) {
				x = this.r * Math.cos((i + j / 2) * Math.PI / 3 + (this.sp * Math.PI));
				y = this.r * Math.sin((i + j / 2) * Math.PI / 3 + (this.sp * Math.PI));
				
				if (j == 1) {
					x = a * x;
					y = a * y;
				}
				
				x = x + this.x;
				y = y + this.y;
				
				if (j == 0) {
					this.ctx.moveTo(x, y);
				} else {
					this.ctx.lineTo(x, y);
				}
			}
			
			this.ctx.stroke();
			this.ctx.fill();
			this.ctx.closePath();
		}
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
		this.oldLen = endY - stY; 
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
	
	getOldLen() {
		return this.oldLen;
	}
	
	getLen() {
		return this.len;
	}
	
	setLen(x) {
		this.len = x;
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
		this.aspectRatio = 0;
		this.img = null;
		
		var typeInt = Math.random() * 100;

		if (typeInt < 20) {
			this.type = REGULAR;
		} else if (typeInt < 40) {
			this.type = BALLOON;
		} else if (typeInt < 60){
			this.type = SLOW_DOWN;
		} else if (typeInt < 80) {
			this.type = POISON;
		} else {
			this.type = SPIKE;
		}
		
		this.setImage();
	}
	
	setImage() {
		if (this.type == REGULAR) {
			this.img = crystal;
		} else if (this.type == BALLOON) {
			this.img = balloon;
		} else if (this.type == SLOW_DOWN) {
			this.img = arrow;
		} else if (this.type == POISON) {
			this.img = bomb;
		} else if (this.type == SPIKE) {
			this.img = knife;
		}
		
		this.aspectRatio = this.img.height / this.img.width;
	}
	
	getType() {
		return this.type;
	}
	
	setType(x) {
		this.type = x;
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
		
		if (Math.pow(r + this.r * 2, 2) > (dist_x + dist_y)) {
			return true;
		}
		
		return false;
		
	}
	
	hitOrb() {
		if (this.hitTimer > 0) {
			this.r = this.r * 0.98;
		}
	}
	
	draw() {
		this.hitOrb();
		this.ctx.drawImage(this.img, this.x - this.r, this.y - this.r * this.aspectRatio, 2 * this.r, 2 * this.r * this.aspectRatio);
		this.ctx.lineWidth = this.r * 0.30;
		this.ctx.strokeStyle = this.col;
		
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.r * 2, 0.0 * Math.PI, 2.0 * Math.PI);
		this.ctx.stroke();
		this.ctx.closePath();
	}
	
	place(armLength, rad) {
		var range = 2 * (armLength + rad);
		
		if (this.cnv.width < range) {
			this.x = Math.round(Math.random() * (this.cnv.width - 8 * this.r)) + 4 * this.r;
		} else {
			this.x = Math.round(Math.random() *	 range) + (0.5 * (this.cnv.width - range));
		}
		
		this.draw();
	}
	
	move(speed) {
		this.y += speed;
	}
}

class Pendulum {
	constructor(cen, pen, arm) {
		this.cen = cen;
		this.pen = pen;
		this.arm = arm;
		this.smallLen = 0;
		this.timer = 0;
		this.startRange = null;
		this.endRange = null;
		this.spikeHeight = 1;
		this.sArm = null;
		this.sPen = null;
	}
	
	setCol(x) {
		this.pen.setCol(x);
		this.cen.setCol(x);
		this.sPen.setCol(x);
	}
	
	setSArm(x) {
		this.sArm = x;
	}
	
	setSPen(x) {
		this.sPen = x;
	}
	
	getSPen() {
		return this.sPen;
	}
	
	getSpikeHeight() {
		return this.spikeHeight;
	}
	
	setRange(width, padding) {
		var span = Math.asin((width - (this.pen.getR() + padding)) / this.arm.getOldLen());
		this.startRange = Math.PI * 1.5 - span;
		this.endRange = Math.PI * 1.5 + span;
	}
	
	setSmallLen(cnv) {
		this.smallLen = (cnv.width / 2) - this.pen.getR() - PADDING;	
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
		this.pen.spin();
		this.arm.draw();
		this.sArm.draw();
		this.cen.draw();
		this.sPen.draw();
		this.pen.drawSpikes(this.spikeHeight);
		this.pen.draw();
		this.pen.drawInnerCircle();
	}
	
	move(status) {
		this.pen.move(SPEED, this.arm.getLen(), this.cen, PADDING);
		
		if (status == BALLOON) {
			this.sPen.move(-SPEED, this.sArm.getLen(), this.cen, PADDING);
		} else {
			this.sPen.move(SPEED, this.sArm.getLen(), this.cen, PADDING);
		}
		
		this.arm.setEndX(this.pen.getX());
		this.arm.setEndY(this.pen.getY());
		this.sArm.setEndX(this.sPen.getX());
		this.sArm.setEndY(this.sPen.getY());
	}
	
	startShrink() {
		var deg = null; 
		if (this.pen.getDeg() > 0) {
			deg = this.pen.getDeg() % (2 * Math.PI);
		} else {
			deg = (2 * Math.PI) - Math.abs(this.pen.getDeg() % (2 * Math.PI));
		}
		 
		if (this.timer < 15000) {
			DEST_COLOUR = RED;
			if (this.arm.getLen() > this.smallLen) {
				this.arm.setLen(this.arm.getLen() * 0.99);
				this.sArm.setLen(this.sArm.getLen() * 0.99);
			}
		} else {
			DEST_COLOUR = BLUE;
			if (this.arm.getOldLen() > this.arm.getLen()) {
				if ((deg > this.startRange) && (deg < this.endRange)) {
					this.arm.setLen(this.arm.getLen() * 1.01);
					this.sArm.setLen(this.sArm.getLen() * 1.01);
				}
			} else {
				this.timer = 0;
				return false;
			}
		}
		
		this.timer += TIME_INTERVAL;
		
		return true;
	}
	
	startBalloon() {
		if (this.timer > 15000) {
			DEST_COLOUR = BLUE;
			if (this.pen.getX() == this.sPen.getX()) {
				this.timer = 0;
				return false;
			}
		} else {
			DEST_COLOUR = GREEN;
		}
		
		this.timer += TIME_INTERVAL;
		
		return true;
	}
	
	startSpike() {
		if (this.timer < 15000) {
			DEST_COLOUR = PURPLE;
			if (this.pen.getR() < 1.5 * this.pen.getOldR()) {
				this.arm.setLen(this.arm.getLen() - (this.pen.getR() * 0.01));
				this.sArm.setLen(this.sArm.getLen() - (this.sPen.getR() * 0.01));
				this.pen.setR(this.pen.getR() * 1.01);
				this.sPen.setR(this.sPen.getR() * 1.01);
			}
			
			if (this.spikeHeight < 2) {
				this.spikeHeight = this.spikeHeight * 1.01;
			}
		} else {
			DEST_COLOUR = BLUE;
			if (this.pen.getR() > this.pen.getOldR()) {
				this.arm.setLen(this.arm.getLen() + (this.pen.getR() * 0.01));
				this.sArm.setLen(this.sArm.getLen() + (this.sPen.getR() * 0.01));
				this.pen.setR(this.pen.getR() * 0.99);
				this.sPen.setR(this.sPen.getR() * 0.99);
			} else if (this.spikeHeight > 1) {
				this.spikeHeight = this.spikeHeight * 0.99;
			} else {
				this.timer = 0;
				return false;
			}
		}
		
		this.timer += TIME_INTERVAL;
		
		return true;
	}	
}