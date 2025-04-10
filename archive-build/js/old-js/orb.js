class Orb {
	constructor(r, ctx, cnv, score, speed) {
		this.x = null;
		this.y = -2 * r;
		this.r = r;
		this.col = SECONDARY_COLOUR;
		this.ctx = ctx;
		this.cnv = cnv;
		this.type = null;
		this.aspectRatio = 0;
		this.img = null;
		this.speed = speed;
		this.ring = r;
		this.transparency = 1;

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

		if (typeInt < 20) {
			this.type = REGULAR;
		} else if (typeInt < 40) {
			this.type = DOUBLE;
		} else if (typeInt < 60) {
			this.type = SHORT;
		} else if (typeInt < 80) {
			this.type = BOMB;
		} else {
			this.type = SPIKE;
		}

		this.setImage();
	}

	getTransparency() {
		return this.transparency;
	}

	incrementTransparency() {
		this.transparency = this.transparency - 0.05;
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

	getRing() {
		return this.ring;
	}

	getY() {
		return this.y;
	}

	getR() {
		return this.r;
	}

	setR(x) {
		this.r = x;
	}

	getType() {
		return this.type;
	}

	setType(x) {
		this.type = x;
	}

	move(x) {
		this.y += this.speed * x;
	}

	checkHitPen(x, y, r) {

		var dist_x = Math.pow(this.x - x, 2);
		var dist_y = Math.pow(this.y - y, 2);

		if (Math.pow(r + this.r * 2, 2) > (dist_x + dist_y)) {
			return true;
		}

		return false;
	}

	furthestCorner() {
		return Math.max(Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)),
			Math.sqrt(Math.pow(this.cnv.height - this.y, 2) + Math.pow(this.x, 2)),
			Math.sqrt(Math.pow(this.cnv.height - this.y, 2) + Math.pow(this.cnv.width - this.x, 2)),
			Math.sqrt(Math.pow(this.cnv.width - this.x, 2) + Math.pow(this.y, 2)));
	}

	incrementRing() {
		this.ring = this.ring + this.cnv.width * 0.005;
	}

	drawRing() {
		var gradient;

        gradient = this.ctx.createLinearGradient(0, 0, this.cnv.width, this.cnv.height);
        gradient.addColorStop(1, '#000000');
        gradient.addColorStop(0, PRIMARY_COLOUR);

        this.ctx.fillStyle = gradient;

		this.ctx.lineWidth = this.r * 0.30;
		this.ctx.strokeStyle = '#FFFFFF';

		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.ring * 2, 0.0 * Math.PI, 2.0 * Math.PI);
		this.ctx.fill();
		this.ctx.stroke();
		this.ctx.closePath();
	}

	drawShadow() {

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
		var gradient;

        gradient = this.ctx.createLinearGradient(0, 0, this.cnv.width, this.cnv.height);
        gradient.addColorStop(1, '#000000');
        gradient.addColorStop(0, PRIMARY_COLOUR);

        this.ctx.fillStyle = gradient;

		this.ctx.lineWidth = this.r * 0.30;
		this.ctx.strokeStyle = '#FFFFFF';

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
