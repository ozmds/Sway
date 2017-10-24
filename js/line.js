/* Cleaned up on Sept 20 */

class Line {
	constructor(stX, stY, endX, endY) {
		/* Initialize this line object */
		this.stX = stX;
		this.stY = stY;
		this.endX = endX;
		this.endY = endY;
		this.len = endY - stY;
	}

	getLen() {
		/* Return length */
		return this.len;
	}

	setLen(x) {
		/* Set length */
		this.len = x;
	}

	setEndX(x) {
		/* Set end x coordinate */
		this.endX = x;
	}

	setEndY(y) {
		/* Set end y coordinate */
		this.endY = y;
	}

	draw() {
		/* Draw this line */
		IMAGESET.drawLine(this.stX, this.stY, this.endX, this.endY);
	}
}
