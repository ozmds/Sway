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
