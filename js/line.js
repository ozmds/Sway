class Line {
	constructor(stX, stY, endX, endY, wid, ctx, cnv) {
		this.stX = stX;
		this.stY = stY;
		this.endX = endX;
		this.endY = endY;
		this.wid = wid;
		this.col = '#FFFFFF';
		this.ctx = ctx;
		this.cnv = cnv;
		this.len = endY - stY;
		this.maxLen = endY - stY;
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

	getMaxLen() {
		return this.maxLen;
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

	drawShadow() {
		this.ctx.lineWidth = this.wid;
		this.ctx.strokeStyle = SECONDARY_COLOUR;

		this.ctx.beginPath();
		this.ctx.moveTo(this.stX + SHADOW_DIST, this.stY);
		this.ctx.lineTo(this.endX + SHADOW_DIST, this.endY);
		this.ctx.stroke();
		this.ctx.closePath();
	}
}
