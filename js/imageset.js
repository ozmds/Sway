class ImageSet {
    constructor() {
        this.tempCanvas = document.createElement('canvas');
        this.tempContext = this.tempCanvas.getContext('2d');

        this.tempi = null;
        this.tempj = null;
        this.tempx = null;
        this.tempy = null;

        this.bomb = new Image();
        this.spike = new Image();
        this.double = new Image();
        this.short = new Image();
        this.diamond = new Image();
        this.pause = new Image();

        this.tempCanvas.width = CANVAS.width * 0.28;
        this.tempCanvas.height = CANVAS.width * 0.28;

        this.initBomb(CANVAS.width * 0.07);
        this.initSpike(CANVAS.width * 0.07);
        this.initDouble(CANVAS.width * 0.07);
        this.initShort(CANVAS.width * 0.07);
        this.initDiamond(CANVAS.width * 0.07);
        this.initPause(CANVAS.width * 0.12);
    }

    convertToImage(dest) {
        dest.src = this.tempCanvas.toDataURL();
        this.tempContext.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.width);

        return dest;
    }

    drawBomb(x, y) {
        CONTEXT.drawImage(this.bomb, x - CANVAS.width * 0.14, y - CANVAS.width * 0.14);
    }

    drawSpike(x, y) {
        CONTEXT.drawImage(this.spike, x - CANVAS.width * 0.14, y - CANVAS.width * 0.14);
    }

    drawDouble(x, y) {
        CONTEXT.drawImage(this.double, x - CANVAS.width * 0.14, y - CANVAS.width * 0.14);
    }

    drawShort(x, y) {
        CONTEXT.drawImage(this.short, x - CANVAS.width * 0.14, y - CANVAS.width * 0.14);
    }

    drawDiamond(x, y) {
        CONTEXT.drawImage(this.diamond, x - CANVAS.width * 0.14, y - CANVAS.width * 0.14);
    }

    drawPause(x, y) {
        CONTEXT.drawImage(this.pause, x - CANVAS.width * 0.14, y - CANVAS.width * 0.14);
    }

    initPause(d) {
        this.tempContext.fillStyle = SECONDARY_COLOUR;

        this.tempContext.beginPath();
    	this.tempContext.rect(CANVAS.width * 0.14 - d / 2, CANVAS.width * 0.14 - d / 2, d / 3, d);
        this.tempContext.fill();
        this.tempContext.closePath();

        this.tempContext.beginPath();
    	this.tempContext.rect(CANVAS.width * 0.14 + d / 6, CANVAS.width * 0.14 - d / 2, d / 3, d);
        this.tempContext.fill();
        this.tempContext.closePath();

        this.pause = this.convertToImage(this.pause);
    }

    initBomb(r) {
        this.initRing(r);

		this.tempContext.fillStyle = SECONDARY_COLOUR;

		this.tempContext.beginPath();
		this.tempContext.arc(2.0 * r, 2.0 * r, 0.5 * r, ZEROPI, TWOPI);
		this.tempContext.fill();
		this.tempContext.closePath();

        this.bomb = this.convertToImage(this.bomb);
	}

    initSpike(r) {
        this.initRing(r);

		this.tempContext.fillStyle = SECONDARY_COLOUR;

		this.tempContext.beginPath();
		this.tempContext.moveTo((2 - 0.6 * Math.sin(Math.PI / 3)) * r, 2.3 * r);
		this.tempContext.lineTo((2 + 0.6 * Math.sin(Math.PI / 3)) * r, 2.3 * r);
		this.tempContext.lineTo(2 * r, 1.4 * r);
		this.tempContext.lineTo((2 - 0.6 * Math.sin(Math.PI / 3)) * r, 2.3 * r);
		this.tempContext.fill();
		this.tempContext.closePath();

        this.spike = this.convertToImage(this.spike);
	}

    initDouble(r) {
        this.initRing(r);

		this.tempContext.strokeStyle = SECONDARY_COLOUR;
		this.tempContext.lineWidth = LINE_WIDTH * 0.40;

		this.tempContext.beginPath();
		this.tempContext.arc(1.8 * r, 1.8 * r, 0.4 * r, ZEROPI, TWOPI);
		this.tempContext.stroke();
		this.tempContext.closePath();

		this.tempContext.beginPath();
		this.tempContext.arc(2.2 * r, 2.2 * r, 0.4 * r, ZEROPI, TWOPI);
		this.tempContext.stroke();
		this.tempContext.closePath();

        this.double = this.convertToImage(this.double);
	}

    initShort(r) {
        this.initRing(r);

		this.tempContext.fillStyle = SECONDARY_COLOUR;

		this.tempContext.beginPath();
		this.tempContext.rect(1.75 * r, 1.55 * r, 0.50 * r, 0.60 * r);
		this.tempContext.fill();
		this.tempContext.closePath();

		this.tempContext.beginPath();
		this.tempContext.moveTo((2 - 0.6 * Math.sin(Math.PI / 3)) * r, 1.95 * r);
		this.tempContext.lineTo((2 + 0.6 * Math.sin(Math.PI / 3)) * r, 1.95 * r);
		this.tempContext.lineTo(2.00 * r, 2.55 * r);
		this.tempContext.lineTo((2 - 0.6 * Math.sin(Math.PI / 3)) * r, 1.95 * r);
		this.tempContext.fill();
		this.tempContext.closePath();

        this.short = this.convertToImage(this.short);
	}

    initDiamond(r) {
        this.initRing(r);

		this.tempContext.strokeStyle = SECONDARY_COLOUR;
		this.tempContext.lineWidth = LINE_WIDTH * 0.40;

		this.tempContext.beginPath();
		this.tempContext.moveTo(2.00 * r, 1.60 * r);
		this.tempContext.lineTo(1.65 * r, 1.60 * r);
		this.tempContext.lineTo(1.50 * r, 1.80 * r);
		this.tempContext.lineTo(2.00 * r, 2.40 * r);
		this.tempContext.lineTo(2.50 * r, 1.80 * r);
		this.tempContext.lineTo(2.35 * r, 1.60 * r);
		this.tempContext.lineTo(2.00 * r, 1.60 * r);
		this.tempContext.stroke();
		this.tempContext.closePath();

        this.diamond = this.convertToImage(this.diamond);
	}

    initRing(r) {
		this.tempContext.lineWidth = LINE_WIDTH * 0.60;
		this.tempContext.strokeStyle = SECONDARY_COLOUR;

		this.tempContext.beginPath();
		this.tempContext.arc(2 * r, 2 * r, r, ZEROPI, TWOPI);
		this.tempContext.stroke();
		this.tempContext.closePath();
	}

    drawRing(x, y, r) {
        CONTEXT.fillStyle = PRIMARY_COLOUR;
        CONTEXT.lineWidth = LINE_WIDTH * 0.60;
        CONTEXT.strokeStyle = SECONDARY_COLOUR;

        CONTEXT.beginPath();
        CONTEXT.arc(x, y, r, ZEROPI, TWOPI);
        CONTEXT.fill();
        CONTEXT.stroke();
        CONTEXT.closePath();
    }

    drawCircle(x, y, r) {
		CONTEXT.fillStyle = PRIMARY_COLOUR;
		CONTEXT.lineWidth = LINE_WIDTH;
		CONTEXT.strokeStyle = SECONDARY_COLOUR;

		CONTEXT.beginPath();
		CONTEXT.arc(x, y, r, ZEROPI, TWOPI);
		CONTEXT.fill();
		CONTEXT.stroke();
		CONTEXT.closePath();
	}

    drawInnerCircle(x, y, r, sp) {
		CONTEXT.lineWidth = LINE_WIDTH * 0.80;
		CONTEXT.strokeStyle = SECONDARY_COLOUR;

		CONTEXT.beginPath();
		CONTEXT.arc(x, y, r * 0.65, ZEROPI + (sp * TWOPI), TWOPI * 0.85 + (sp * TWOPI));
		CONTEXT.stroke();
		CONTEXT.closePath();
	}

    drawSpikes(x, y, r, sp, sheight) {
		CONTEXT.fillStyle = PRIMARY_COLOUR;
		CONTEXT.strokeStyle = SECONDARY_COLOUR;
		CONTEXT.lineWidth = LINE_WIDTH * 1.4;

		for (this.tempi = 0; this.tempi < 6; this.tempi++) {
			CONTEXT.beginPath();
			for (this.tempj = 0; this.tempj < 3; this.tempj++) {
				this.tempx = r * Math.cos((this.tempi + this.tempj / 2) * Math.PI / 3 + (sp * Math.PI));
				this.tempy = r * Math.sin((this.tempi + this.tempj / 2) * Math.PI / 3 + (sp * Math.PI));

				if (this.tempj == 1) {
					this.tempx = sheight * this.tempx;
					this.tempy = sheight * this.tempy;
				}

				this.tempx = this.tempx + x;
				this.tempy = this.tempy + y;

				if (this.tempj == 0) {
					CONTEXT.moveTo(this.tempx, this.tempy);
				} else {
					CONTEXT.lineTo(this.tempx, this.tempy);
				}
			}

			CONTEXT.stroke();
			CONTEXT.fill();
			CONTEXT.closePath();
		}
	}

    drawLine(sx, sy, ex, ey) {
		CONTEXT.lineWidth = LINE_WIDTH;
		CONTEXT.strokeStyle = SECONDARY_COLOUR;

		CONTEXT.beginPath();
		CONTEXT.moveTo(sx, sy);
		CONTEXT.lineTo(ex, ey);
		CONTEXT.stroke();
		CONTEXT.closePath();
	}
}
