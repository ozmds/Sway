/* Cleaned up on Sept 20 */

class Line {
	constructor(stX, stY, endX, endY) {
		this.stX = stX;
		this.stY = stY;
		this.endX = endX;
		this.endY = endY;
		this.len = endY - stY;
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

	draw() {
		IMAGESET.drawLine(this.stX, this.stY, this.endX, this.endY);
	}
}
