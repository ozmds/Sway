/* Cleaned up on Sept 22 */

class Game {
    constructor() {
        this.old_height = 0;
        this.pen = null;
        this.score = 0;
        this.status = REGULAR;
        this.orbList = null;
        this.hit_orb = null;
        this.oldState = null;
        this.oldStatus = null;
        this.counter = 0;
        this.screen = new Screen();

        CANVAS.style.top = (MARGIN).toString() + 'px';
        CANVAS.style.left = (MARGIN).toString() + 'px';
    }

    initVariable() {
        this.pen = new Pendulum(new Circle(CANVAS.width * 0.5, CANVAS.height * 0.60, CANVAS.width * 0.05), new Circle(CANVAS.width * 0.5, CANVAS.height - (CANVAS.width * 0.1 + PADDING), CANVAS.width * 0.1), new Line(CANVAS.width * 0.5, CANVAS.height * 0.60, CANVAS.width * 0.5, CANVAS.height - (CANVAS.width * 0.1 + PADDING)));

        this.pen.setSArm(new Line(CANVAS.width * 0.5, CANVAS.height * 0.60, CANVAS.width * 0.5, CANVAS.height - (CANVAS.width * 0.1 + PADDING)));
        this.pen.setSPen(new Circle(CANVAS.width * 0.5, CANVAS.height - (CANVAS.width * 0.1 + PADDING), CANVAS.width * 0.1));

        this.pen.setMinLen();
        this.pen.setRange();

        this.pen.calcPenSpeed(PEN_TIME);

        this.orbList = new OrbList();
        this.orbList.calculateSpeed();

        if (window.localStorage.getItem('highscore') == null) {
            window.localStorage.setItem('highscore', this.score);
        }
    }

    getStatus() {
		return this.status;
	}

	getScore() {
		return this.score;
	}

	setScore(x) {
		this.score = x;

        if (this.score > window.localStorage.getItem('highscore')) {
			window.localStorage.setItem('highscore', this.score);
		}
	}

	incrementScore() {
		this.score += 1;

		if (this.score > window.localStorage.getItem('highscore')) {
			window.localStorage.setItem('highscore', this.score);
		}
	}

	getOldHeight() {
		return this.old_height;
	};

	setOldHeight(x) {
		this.old_height = x;
	}

	getPen() {
		return this.pen;
	}

    background() {
        this.screen.background();
    }

    changeColours(colour1, colour2) {
        return this.screen.changeColours(colour1, colour2);
    }

    move() {
        this.pen.move(this.status);
        this.hit_orb = this.orbList.manageOrbs(this.score, this.pen, this.status);
        this.setScore(this.orbList.getScore() + this.score);

        this.setStatusByOrb();
    }

    setStatusByOrb() {
        this.setStatus(this.orbList.getStatus());

        if (this.status == DOUBLE) {
            if (!this.pen.startBalloon()) {
                this.status = REGULAR;
            }
        } else if (this.status == SHORT) {
            if (!this.pen.startShrink()) {
                this.status = REGULAR;
            }
        } else if (this.status == SPIKE) {
            if (!this.pen.startSpike()) {
                this.status = REGULAR;
            }
        }
    }

    setStatus(x) {
        if (x) {
            if (this.status != x) {
                if (x != REGULAR) {
                    this.status = x;
                }
            }
        }
	}

    screenWipe() {
        if (this.hit_orb) {
            if (this.hit_orb.getType() != REGULAR) {
                if (this.hit_orb.getY() > CANVAS.height * 0.4) {
                    this.hit_orb.move(-8);
                } else if (this.hit_orb.getRing() > this.hit_orb.furthestCorner()) {
                    this.orbList.clearOrbs();
                    return false;
                } else {
                    this.hit_orb.incrementRing();
                }
            } else {
                if (this.hit_orb.getRing() > this.hit_orb.furthestCorner()) {
                    this.orbList.clearOrbs();
                    return false;
                } else {
                    this.hit_orb.incrementRing();
                }
            }
        }

        return true;
    }

    handleClick(event_x, event_y) {
        if (STATE == HOME) {
            if (!this.pen.getStatus()) {
                STATE = GAME;
                this.status = REGULAR;
                this.oldStatus = null;
            }
        } else if (STATE == PAUSE) {
            if (event_x > CANVAS.width * 0.50 && event_x < CANVAS.width * 0.85) {
                if (event_y > (CANVAS.height * 0.35 - CANVAS.width * 0.25)) {
                    if (event_y < (CANVAS.height * 0.35 + CANVAS.width * 0.25)) {
                        STATE = HOME;
                        this.oldStatus = this.status;
                        this.status = BOMB;
                        this.hit_orb = null;
                        this.score = 0;
                        this.orbList.clearOrbs();
                    }
                }
            }
             else {
                STATE = this.oldState;
                this.oldState = null;
            }
        } else if (STATE == GAME_OVER) {
            STATE = HOME;
            this.score = 0;
            this.hit_orb = null;
            this.orbList.clearOrbs();
        } else if (STATE == TRANSITION) {
            /* DO NOTHING */
        } else if (this.screen.pauseClicked(event_x, event_y)) {
            if (this.status == BOMB) {
                STATE = GAME_OVER;
            } else {
                this.oldState = STATE;
                STATE = PAUSE;
            }
        } else {
            this.getPen().getPen().flip();

        	if (this.getStatus() != DOUBLE) {
        		this.getPen().getSPen().flip();
        	}
        }
    }

    homeScreen() {
        this.resetPen();
        this.pen.move();
        this.pen.draw();

        CONTEXT.textBaseline = 'middle';
        CONTEXT.textAlign = 'center';
        CONTEXT.fillStyle = '#FFFFFF';
        CONTEXT.shadowColor = '#FFFFFF';
        CONTEXT.shadowBlur = 40;

        var font_size = CANVAS.width * 0.14;
        var font = font_size.toString() + "px basicWoodlands";

        CONTEXT.font = font;

        CONTEXT.fillText('Sway', CANVAS.width * 0.50, CANVAS.height * 0.15);

        CONTEXT.strokeStyle = SECONDARY_COLOUR;
        CONTEXT.fillStyle = SECONDARY_COLOUR;
        CONTEXT.lineWidth = LINE_WIDTH;
        CONTEXT.shadowBlur = 40;

        CONTEXT.beginPath();
        CONTEXT.arc(CANVAS.width * 0.5, CANVAS.height * 0.36, CANVAS.width * 0.2, ZEROPI, TWOPI);
        CONTEXT.stroke();
        CONTEXT.closePath();

        CONTEXT.beginPath();
		CONTEXT.moveTo(CANVAS.width * 0.62, CANVAS.height * 0.36);
		CONTEXT.lineTo(CANVAS.width * 0.44, CANVAS.height * 0.36 - (CANVAS.width * 0.12 * Math.sqrt(3) * 0.5));
		CONTEXT.lineTo(CANVAS.width * 0.44, CANVAS.height * 0.36 + (CANVAS.width * 0.12 * Math.sqrt(3) * 0.5));
		CONTEXT.lineTo(CANVAS.width * 0.62, CANVAS.height * 0.36);
		CONTEXT.fill();
		CONTEXT.closePath();
    }

    logoScreen() {
        if (this.counter > 5000) {
            STATE = HOME;
        } else {
            CONTEXT.textBaseline = 'middle';
        	CONTEXT.textAlign = 'center';
        	CONTEXT.fillStyle = '#FFFFFF';
            CONTEXT.shadowColor = '#FFFFFF';
            CONTEXT.shadowBlur = 40;

        	var font_size = CANVAS.width * 0.14;
        	var font = font_size.toString() + "px basicWoodlands";

        	CONTEXT.font = font;

        	CONTEXT.fillText('Melancholy Dream', CANVAS.width * 0.50, CANVAS.height * 0.30);

            CONTEXT.strokeStyle = SECONDARY_COLOUR;
            CONTEXT.fillStyle = SECONDARY_COLOUR;
    		CONTEXT.lineWidth = LINE_WIDTH;
            CONTEXT.shadowBlur = 150;

            CONTEXT.beginPath();
            CONTEXT.arc(CANVAS.width * 0.5, CANVAS.height * 0.5, CANVAS.width * 0.20, ZEROPI, TWOPI);
            CONTEXT.stroke();
            CONTEXT.closePath();

            CONTEXT.beginPath();
            CONTEXT.arc(CANVAS.width * 0.55, CANVAS.height * 0.5, CANVAS.width * 0.14, ZEROPI, TWOPI);
            CONTEXT.fill();
            CONTEXT.stroke();
    		CONTEXT.closePath();

            this.counter = this.counter + TIME_INTERVAL;
        }
    }

    resetPen() {
        if (this.status == BOMB) {
            if (this.oldStatus == null) {
                this.oldStatus = this.orbList.getOldStatus();
            }
            this.pen.move(this.status);
            if (this.oldStatus != REGULAR) {
                if (this.oldStatus == SPIKE) {
                    if (!this.pen.endSpike()) {
                        this.status = REGULAR;
                        this.oldStatus = null;
                    }
                } else if (this.oldStatus == DOUBLE) {
                    if (!this.pen.endBalloon()) {
                        this.status = REGULAR;
                        this.oldStatus = null;
                    }
                } else if (this.oldStatus == SHORT) {
                    if (!this.pen.endShrink()) {
                        this.status = REGULAR;
                        this.oldStatus = null;
                    }
                }
            }
        }
    }

    draw() {
        CONTEXT.shadowColor = '#00FFFF';
        CONTEXT.shadowBlur = 120;

        if (STATE != TRANSITION) {
            this.resetPen();
        }

        this.orbList.drawOrbs();
        this.screen.drawPause();
        this.screen.updateScore(this.score);

        if (this.hit_orb && (STATE == TRANSITION || this.oldState == TRANSITION)) {
            this.hit_orb.drawRing();
            this.hit_orb.draw();
        }

        this.pen.draw();
    }
}
