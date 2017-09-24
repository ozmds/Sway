/* Cleaned up on Sept 22 */

class Screen {
    constructor() {
        this.pausex = CANVAS.width * 0.04 * window.devicePixelRatio;
        this.pausey = CANVAS.width * 0.04 * window.devicePixelRatio;
        this.pauseside = CANVAS.width * 0.09 * window.devicePixelRatio;
        this.pausebar = CANVAS.width * 0.03 * window.devicePixelRatio;
        this.fontsize = CANVAS.width * 0.08 * window.devicePixelRatio;
        this.font = this.fontsize.toString() + "px basicWoodlands";

        this.i = null;
        this.c1 = [];
        this.c2 = [];

        this.newcol = [];
    }

    background() {
        CANVAS.height = (window.innerHeight - 2 * MARGIN) * window.devicePixelRatio;
    	CANVAS.width = (window.innerWidth - 2 * MARGIN) * window.devicePixelRatio;

    	CANVAS.style.width = (CANVAS.width / window.devicePixelRatio).toString() + 'px';
    	CANVAS.style.height = (CANVAS.height / window.devicePixelRatio).toString() + 'px';

        document.body.style.backgroundColor = PRIMARY_COLOUR;
    	CANVAS.style.backgroundColor = PRIMARY_COLOUR;

        PADDING = CANVAS.width * 0.03;
        LINE_WIDTH = CANVAS.width * 0.02;
    }

    changeColours(colour1, colour2) {
    	for (this.i = 0; this.i < 3; this.i++) {
    		this.c1.push(parseInt(colour1.slice(2 * this.i + 1, 2 * this.i + 3), 16));
    		this.c2.push(parseInt(colour2.slice(2 * this.i + 1, 2 * this.i + 3), 16));

    		if (this.c1[this.i] > this.c2[this.i]) {
    			this.newcol.push(this.c1[this.i] - 1);
    		} else if (this.c1[this.i] == this.c2[this.i]) {
    			this.newcol.push(this.c1[this.i]);
    		} else {
    			this.newcol.push(this.c1[this.i] + 1);
    		}

    		if (this.newcol[this.i] == 0) {
    			this.newcol[this.i] = '00';
    		} else if (this.newcol[this.i] < 16) {
    			this.newcol[this.i] = '0' + this.newcol[this.i].toString(16);
    		}
    	}

    	PRIMARY_COLOUR = '#' + this.newcol[0].toString(16) + this.newcol[1].toString(16) + this.newcol[2].toString(16);

    	return true;
    }

    drawPause() {
        CONTEXT.fillStyle = SECONDARY_COLOUR;

        CONTEXT.beginPath();
    	CONTEXT.rect(this.pausex, this.pausey, this.pausebar, this.pauseside);
        CONTEXT.fill();
        CONTEXT.closePath();

        CONTEXT.beginPath();
    	CONTEXT.rect(this.pausex + 2 * this.pausebar, this.pausey, this.pausebar, this.pauseside);
        CONTEXT.fill();
        CONTEXT.closePath();
    }

    updateScore(score) {
    	CONTEXT.textBaseline = 'middle';
    	CONTEXT.textAlign = 'end';
    	CONTEXT.fillStyle = SECONDARY_COLOUR;
    	CONTEXT.font = this.font;

    	CONTEXT.fillText(score, CANVAS.width * 0.95, CANVAS.width * 0.08);
    	CONTEXT.fillText(window.localStorage.getItem('highscore'), CANVAS.width * 0.95, CANVAS.width * 0.18);
    }

    isClicked(ex, ey, x, y, lx, ly) {
        if (ex > x && x + lx > ex) {
            if (ey > y && y + ly > ey) {
                return true;
            }
        }
    }

    pauseClicked(ex, ey) {
        return this.isClicked(ex, ey, this.pausex, this.pausex, this.pauseside, this.pauseside);
    }
}
