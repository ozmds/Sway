class Game {
    constructor(cnv) {
        this.cnv = document.getElementById(cnv);
        this.ctx = this.cnv.getContext('2d');
        this.old_height = 0;
        this.pen = null;
        this.score = 0;
        this.status = REGULAR;
        this.orbList = null;

        this.cnv.style.top = (MARGIN).toString() + 'px';
        this.cnv.style.left = (MARGIN).toString() + 'px';
    }

    getStatus() {
		/* Return Status */
		return this.status;
	}

	setStatus(x) {
		/* Set Status to x */
		this.status = x;
	}

	getScore() {
		/* Return Score */
		return this.score;
	}

	setScore(x) {
		/* Set Score to x */
		this.score = x;
	}

	incrementScore() {
		/* Increase Score By 1 */
		this.score += 1;

		if (this.score > window.localStorage.getItem('highscore')) {
			window.localStorage.setItem('highscore', this.score);
		}
	}

	getOldHeight() {
		/* Return Old Height */
		return this.old_height;
	};

	setOldHeight(x) {
		/* Set Old Height to x */
		this.old_height = x;
	}

	getCtx() {
		/* Return Context */
		return this.ctx;
	}

	getCnv() {
		/* Return Canvas */
		return this.cnv;
	}

	getPen() {
		/* Return Pendulum */
		return this.pen;
	}

    background() {
        this.cnv.height = (window.innerHeight - 10) * window.devicePixelRatio;
    	this.cnv.width = (window.innerWidth - 10) * window.devicePixelRatio;

    	this.cnv.style.width = (this.cnv.width / window.devicePixelRatio).toString() + 'px';
    	this.cnv.style.height = (this.cnv.height / window.devicePixelRatio).toString() + 'px';

    	document.body.style.backgroundColor = PRIMARY_COLOUR;
    	this.cnv.style.backgroundColor = PRIMARY_COLOUR;
    }

    initVariable() {
        var cen_height = 0.60;
		var pen_rad = this.cnv.width * 0.1;

		var cen_x = this.cnv.width / 2;
		var cen_y = this.cnv.height * cen_height;

		var pen_x = this.cnv.width / 2;
		var pen_y = this.cnv.height - (pen_rad + PADDING);

		var arm = new Line(cen_x, cen_y, pen_x, pen_y, this.cnv.width * 0.015, this.ctx, this.cnv);
		var cen = new Circle(cen_x, cen_y, pen_rad / 2, 0.35, this.ctx, this.cnv);
		var pen = new Circle(pen_x, pen_y, pen_rad, 0.2, this.ctx, this.cnv);

		var sArm = new Line(cen_x, cen_y, pen_x, pen_y, this.cnv.width * 0.015, this.ctx, this.cnv);
		var sPen = new Circle(pen_x, pen_y, pen_rad, 0.2, this.ctx, this.cnv);

		this.pen = new Pendulum(cen, pen, arm);

		this.pen.setSArm(sArm);
		this.pen.setSPen(sPen);

		/* Create Boundaries for Pendulum */
		this.pen.setMinLen(this.cnv);
		this.pen.setRange(this.cnv.width / 2);

		/* Calculate Speed for Pendulum and Orb */
		this.pen.calcPenSpeed(pen_time);

        this.orbList = new OrbList();
        this.orbList.calculateSpeed(this.cnv);

		if (window.localStorage.getItem('highscore') == null) {
			window.localStorage.setItem('highscore', this.score);
		}
    }

    move() {
		/* Move the Pendulum as a Whole */
		this.pen.move(this.status);
        this.setScore(this.orbList.manageOrbs(this.score, this.pen, this.cnv, this.ctx) + this.score);
    }

    draw() {
        this.pen.draw();
        this.drawPauseButton(this.cnv.width * 0.04, this.cnv.width * 0.04, this.cnv.width * 0.10);
        this.updateScore();
        this.orbList.drawOrbs();
    }

	incrementPenSpeed(score) {
		/* Increase Speed of Pendulum */
		if ((score % 10 == 0) && (score <= 100)) {
			pen_time = PEN_START_TIME - (score / 10) * PEN_DECREMENT_TIME;
			this.pen.calcPenSpeed(pen_time);
		}
	}

    changeColours(colour1, colour2) {
        /* Slowly return fading colours from colour1 to colour2 */
    	var i;

    	var c1 = [];
    	var c2 = [];

    	var newcol = []

    	for (i = 0; i < 3; i++) {
    		c1.push(parseInt(colour1.slice(2 * i + 1, 2 * i + 3), 16));
    		c2.push(parseInt(colour2.slice(2 * i + 1, 2 * i + 3), 16));

    		if (c1[i] > c2[i]) {
    			newcol.push(c1[i] - 1);
    		} else if (c1[i] == c2[i]) {
    			newcol.push(c1[i]);
    		} else {
    			newcol.push(c1[i] + 1);
    		}

    		if (newcol[i] == 0) {
    			newcol[i] = '00';
    		} else if (newcol[i] < 16) {
    			newcol[i] = '0' + newcol[i].toString(16);
    		}
    	}

    	PRIMARY_COLOUR = '#' + newcol[0].toString(16) + newcol[1].toString(16) + newcol[2].toString(16);

    	return true;
    }

    handleClick(event_x, event_y) {
        /* React to a click */
        if (STATE == PAUSE) {
            STATE = GAME;
        } else if (event_x > pausex && pausex + pauseside > event_x) {
            if (event_y > pausey && pausey + pauseside > event_y) {
                STATE = PAUSE;
            }
        } else {
            this.getPen().getPen().flip();

        	if (this.getStatus() != DOUBLE) {
        		this.getPen().getSPen().flip();
        	}
        }
    }

    drawPauseButton(x, y, side_len) {
        /* Draw a Pause Button */
        pausex = x;
        pausey = y;
        pauseside = side_len;

    	var bar_width = side_len / 3;

        this.ctx.strokeStyle = SECONDARY_COLOUR;
        this.ctx.lineWidth = this.cnv.width * 0.008;

        this.ctx.beginPath();
    	this.ctx.rect(x, y, bar_width, side_len);
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.beginPath();
    	this.ctx.rect(x + 2 * bar_width, y, bar_width, side_len);
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.lineWidth = this.cnv.width * 0.01;

        this.ctx.beginPath();
    	this.ctx.moveTo(x + this.cnv.width * 0.005 + bar_width, y - this.cnv.width * 0.004);
        this.ctx.lineTo(x + this.cnv.width * 0.005 + bar_width, y + side_len + this.cnv.width * 0.004);
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.beginPath();
    	this.ctx.moveTo(x + 3 * bar_width + this.cnv.width * 0.005, y - this.cnv.width * 0.004);
        this.ctx.lineTo(x + 3 * bar_width + this.cnv.width * 0.005, y + side_len + this.cnv.width * 0.004);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    updateScore() {
        /* Write the score on the canvas */
    	this.ctx.textBaseline = 'middle';
    	this.ctx.textAlign = 'end';
    	this.ctx.fillStyle = SECONDARY_COLOUR;

    	var font_size = this.cnv.width * 0.13;
    	var font = font_size.toString() + "px basicWoodlands";

    	this.ctx.font = font;

    	this.ctx.fillText(this.score, this.cnv.width * 0.95, this.cnv.width * 0.05);
    	this.ctx.fillText(window.localStorage.getItem('highscore'), this.cnv.width * 0.95, this.cnv.width * 0.16);
    }
}
