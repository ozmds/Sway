class Line {
	constructor(stX, stY, endX, endY, ctx, cnv) {
		this.stX = stX;
		this.stY = stY;
		this.endX = endX;
		this.endY = endY;
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
		this.ctx.lineWidth = LINE_WIDTH;
		this.ctx.strokeStyle = SECONDARY_COLOUR;

		this.ctx.beginPath();
		this.ctx.moveTo(this.stX, this.stY);
		this.ctx.lineTo(this.endX, this.endY);
		this.ctx.stroke();
		this.ctx.closePath();
	}
}
