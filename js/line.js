/* Cleaned up on Sept 20 */

class Line {
	constructor(stX, stY, endX, endY) {
		this.stX = stX;
		this.stY = stY;
		this.endX = endX;
		this.endY = endY;
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
		CONTEXT.lineWidth = LINE_WIDTH;
		CONTEXT.strokeStyle = SECONDARY_COLOUR;

		CONTEXT.beginPath();
		CONTEXT.moveTo(this.stX, this.stY);
		CONTEXT.lineTo(this.endX, this.endY);
		CONTEXT.stroke();
		CONTEXT.closePath();
	}
}
