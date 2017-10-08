/* Cleaned up on Sept 22 */

class Game {
    constructor() {
        this.old_height = 0;
        this.pen = null;
        this.score = 0;
        this.status = REGULAR;
        this.orbList = null;
        this.hit_orb = null;
        this.inTransition = false;
        this.oldState = null;
        this.counter = 0;
        this.screen = new Screen();

        CANVAS.style.top = (MARGIN).toString() + 'px';
        CANVAS.style.left = (MARGIN).toString() + 'px';
    }

    initVariable() {
        this.pen = new Pendulum(new Circle(CANVAS.width * 0.5, CANVAS.height * 0.60, CANVAS.width * 0.05),
                                new Circle(CANVAS.width * 0.5, CANVAS.height - (CANVAS.width * 0.1 + PADDING), CANVAS.width * 0.1),
                                new Line(CANVAS.width * 0.5, CANVAS.height * 0.60, CANVAS.width * 0.5, CANVAS.height - (CANVAS.width * 0.1 + PADDING)));

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

    getInTransition() {
        return this.inTransition;
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
                if (x == BOMB && (this.orbList.getOldStatus() != REGULAR && this.orbList.getOldStatus() != null)) {
                  this.inTransition = true;
                }
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
        if (STATE == PAUSE) {
            if (this.status == BOMB && !this.inTransition) {
                  STATE = GAME;
                  this.score = 0;
                  this.status = REGULAR;
            } else {
                STATE = this.oldState;
                this.oldState = null;
            }
        } else if (this.screen.pauseClicked(event_x, event_y)) {
            this.oldState = STATE;
            STATE = PAUSE;
        } else {
            this.getPen().getPen().flip();

        	if (this.getStatus() != DOUBLE) {
        		this.getPen().getSPen().flip();
        	}
        }
    }

    logoScreen() {
        if (this.counter > 5000) {
            STATE = GAME;
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
            this.pen.move(this.status);
            if (this.orbList.getOldStatus() != REGULAR) {
                if (this.orbList.getOldStatus() == SPIKE) {
                    if (!this.pen.endSpike()) {
                        this.inTransition = false;
                    }
                } else if (this.orbList.getOldStatus() == DOUBLE) {
                    if (!this.pen.endBalloon()) {
                        this.inTransition = false;
                    }
                } else if (this.orbList.getOldStatus() == SHORT) {
                    if (!this.pen.endShrink()) {
                        this.inTransition = false;
                    }
                }
            }
        }
    }

    draw() {
        CONTEXT.shadowColor = '#00FFFF';
        CONTEXT.shadowBlur = 120;

        this.resetPen();

        this.orbList.drawOrbs();
        this.screen.drawPause();
        this.screen.updateScore(this.score);

        if (this.hit_orb && STATE == TRANSITION) {
            this.hit_orb.drawRing();
            this.hit_orb.draw();
        }

        this.pen.draw();
    }
}
