class Orb {
	constructor(r, ctx, cnv, score, speed) {
		this.x = null;
		this.y = -2 * r;
		this.r = r;
		this.col = SECONDARY_COLOUR;
		this.ctx = ctx;
		this.cnv = cnv;
		this.type = null;
		this.hitTimer = 0;
		this.aspectRatio = 0;
		this.img = null;
		this.speed = speed;

		var typeInt = Math.random() * 100;

		var level_two_ratio = LEVEL_TWO_SPEED_RATIO;
		var level_three_ratio = LEVEL_THREE_SPEED_RATIO;

		if (score % 20 == 0 && score >= 20) {
			if (score <= 60) {
				level_two_ratio = LEVEL_TWO_SPEED_RATIO + 5 * (score / 20);
				level_three_ratio = LEVEL_THREE_SPEED_RATIO + 5 * (score / 20);
			}
		}

		if (typeInt < level_three_ratio) {
			this.speed = this.speed * 3;
		} else if (typeInt < level_three_ratio + level_two_ratio) {
			this.speed = this.speed * 2;
		}

		typeInt = Math.random() * 100;

		if (typeInt < 85) {
			this.type = REGULAR;
		} else if (typeInt < 86.5) {
			this.type = DOUBLE;
		} else if (typeInt < 89) {
			this.type = SHORT;
		} else if (typeInt < 99) {
			this.type = BOMB;
		} else {
			this.type = SPIKE;
		}

		this.setImage();
	}

	setImage() {
		if (this.type == REGULAR) {
			this.img = crystal;
		} else if (this.type == DOUBLE) {
			this.img = balloon;
		} else if (this.type == SHORT) {
			this.img = arrow;
		} else if (this.type == BOMB) {
			this.img = bomb;
		} else if (this.type == SPIKE) {
			this.img = knife;
		}

		this.aspectRatio = this.img.height / this.img.width;
	}

	getY() {
		return this.y;
	}

	getR() {
		return this.r;
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

	move(x) {
		this.y += this.speed * x;
	}

	hitOrb() {
		if (this.hitTimer > 0) {
			this.r = this.r;
		}
	}

	checkHitPen(x, y, r) {

		var dist_x = Math.pow(this.x - x, 2);
		var dist_y = Math.pow(this.y - y, 2);

		if (Math.pow(r + this.r * 2, 2) > (dist_x + dist_y)) {
			return true;
		}

		return false;
	}

	drawShadow() {
		this.hitOrb();

		this.ctx.lineWidth = this.r * 0.30;
		this.ctx.strokeStyle = this.col;
		this.ctx.fillStyle = this.col;

		this.ctx.beginPath();
		this.ctx.arc(this.x + SHADOW_DIST, this.y, this.r * 2, 0.0 * Math.PI, 2.0 * Math.PI);
		this.ctx.fill();
		this.ctx.stroke();
		this.ctx.closePath();
	}

	draw() {
		this.ctx.lineWidth = this.r * 0.30;
		this.ctx.strokeStyle = '#FFFFFF';
		this.ctx.fillStyle = PRIMARY_COLOUR;

		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.r * 2, 0.0 * Math.PI, 2.0 * Math.PI);
		this.ctx.fill();
		this.ctx.stroke();
		this.ctx.closePath();

		this.ctx.drawImage(this.img, this.x - this.r, this.y - this.r * this.aspectRatio,
			2 * this.r, 2 * this.r * this.aspectRatio);
	}

	place(armLength, rad) {
		var range = 2 * (armLength + rad);

		if (this.cnv.width < range) {
			this.x = Math.round(Math.random() * (this.cnv.width - 8 * this.r)) + 4 * this.r;
		} else {
			this.x = Math.round(Math.random() *	 range) + (0.5 * (this.cnv.width - range));
		}
	}
}
