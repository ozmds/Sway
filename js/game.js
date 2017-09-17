class Game {
    constructor(cnv) {
        this.cnv = document.getElementById(cnv);
        this.ctx = this.cnv.getContext('2d');
        this.old_height = 0;
        this.pen = null;
        this.score = 0;
        this.status = REGULAR;
        this.orbList = null;
        this.hit_orb = null;
        this.col = null;
        this.sH = -0.70;
        this.inTransition = false;
        this.oldState = null;
        this.counter = 0;

        this.cnv.style.top = (MARGIN).toString() + 'px';
        this.cnv.style.left = (MARGIN).toString() + 'px';
    }

    getInTransition() {
      return this.inTransition;
    }

    getStatus() {
		/* Return Status */
		return this.status;
	}

	getScore() {
		/* Return Score */
		return this.score;
	}

	setScore(x) {
		/* Set Score to x */
		this.score = x;

        if (this.score > window.localStorage.getItem('highscore')) {
			window.localStorage.setItem('highscore', this.score);
		}
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

    backgroundDesign(prim, layer_count, col_plus) {
        var i, j;
        var new_col = [];
        var newcol = prim;

        document.body.style.backgroundColor = prim;
    	this.cnv.style.backgroundColor = prim;

        this.col = this.ctx.createLinearGradient(0, 0, this.cnv.width, this.cnv.height);
        this.col.addColorStop(1, '#000000');
        this.col.addColorStop(0, PRIMARY_COLOUR);

        this.ctx.fillStyle = this.col;
        this.ctx.fillRect(0, 0, this.cnv.width, this.cnv.height);

        /*

        new_col.push(parseInt(prim.slice(1, 3), 16));
        new_col.push(parseInt(prim.slice(3, 5), 16));
        new_col.push(parseInt(prim.slice(5, 7), 16));

        for (i = 0; i < layer_count; i++) {
            this.ctx.fillStyle = newcol;

            this.ctx.beginPath();
        	this.ctx.rect(i * this.cnv.width / (2 * layer_count),
                i * this.cnv.width / (2 * layer_count),
                this.cnv.width - (i * this.cnv.width / layer_count),
                this.cnv.height - (i * this.cnv.width / layer_count));
            this.ctx.fill();
            this.ctx.closePath();

            newcol = '#';

            for (j = 0; j < 3; j++) {
                new_col[j] = new_col[j] + col_plus;
                if (new_col[j] > 255) {
                    new_col[j] = 255;
                }
                newcol = newcol + new_col[j].toString(16);
            }
        }
        */
    }

    background() {
        this.cnv.height = (window.innerHeight - 2 * MARGIN) * window.devicePixelRatio;
    	this.cnv.width = (window.innerWidth - 2 * MARGIN) * window.devicePixelRatio;

    	this.cnv.style.width = (this.cnv.width / window.devicePixelRatio).toString() + 'px';
    	this.cnv.style.height = (this.cnv.height / window.devicePixelRatio).toString() + 'px';

        this.backgroundDesign(PRIMARY_COLOUR, 8, 32);

        PADDING = this.cnv.width * 0.03;
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

        SHADOW_DIST = this.cnv.width * 0.05;
    }

    setStatus(x) {
		/* Set Status to x */
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
                if (this.hit_orb.getY() > this.cnv.height * 0.4) {
                    this.hit_orb.move(-4);
                } else if (this.hit_orb.getRing() > this.hit_orb.furthestCorner() * 0.5) {
                    this.orbList.clearOrbs();
                    return false;
                } else {
                    this.hit_orb.incrementRing();
                }
            } else {
                if (this.hit_orb.getRing() > this.hit_orb.furthestCorner() * 0.5) {
                    this.orbList.clearOrbs();
                    return false;
                } else {
                    this.hit_orb.incrementRing();
                }
            }
        }

        return true;
    }

    move() {
		/* Move the Pendulum as a Whole */
		this.pen.move(this.status);
        this.hit_orb = this.orbList.manageOrbs(this.score, this.pen, this.cnv, this.ctx, this.status);
        this.setStatus(this.orbList.getStatus());
        this.setScore(this.orbList.getScore() + this.score);

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

    draw() {
      this.ctx.shadowColor = '#FFFFFF';
      this.ctx.shadowBlur = 10;

      var trans_state;

      if (this.status == BOMB) {
        trans_state = this.orbList.getOldStatus();
      } else {
        trans_state = this.status;
      }

        if (this.inTransition) {
            if (trans_state == SPIKE) {
                this.pen.move(this.status);
                if (!this.pen.endSpike()) {
                    this.inTransition = false;
                }
            } else if (trans_state == DOUBLE) {
                this.pen.move(this.status);
                if (!this.pen.endBalloon()) {
                    this.inTransition = false;
                }
            } else if (trans_state == SHORT) {
                this.pen.move(this.status);
                if (!this.pen.endShrink()) {
                    this.inTransition = false;
                }
            }

            if(!this.inTransition) {
              this.status = REGULAR;
            }
        }

        if (this.status == BOMB && (!this.inTransition)) {
          this.pen.move(this.status);
        }
        /*
        this.pen.drawShadow();

        this.orbList.drawShadowOrbs(this.ctx);
        */
        this.orbList.drawOrbs(this.ctx);

        this.drawPauseButton(this.cnv.width * 0.04, this.cnv.width * 0.04, this.cnv.width * 0.10);
        this.updateScore();

        this.pen.draw();
        /*
        if (STATE == TRANSITION) {
        */

        if (this.hit_orb) {
          this.hit_orb.drawRing();
        }

        if (STATE != GAME) {
          /*
          this.pen.drawShadow();
          */
          this.pen.draw();
        }
        if (STATE == TRANSITION) {
            this.hit_orb.draw();
        }

        /*
        }
        */
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
        if (STATE == HOME) {
          STATE = GAME;
        } else if (STATE == PAUSE) {
            if (this.inSquare(event_x, event_y, this.cnv.width * 0.15, this.cnv.height * 0.35,
                this.cnv.width * 0.35, this.cnv.height * 0.30)) {
                  STATE = GAME;
                  this.sH = -0.70;
                  this.score = 0;
                if (this.status != BOMB) {
                  this.inTransition = true;
                  this.orbList.clearOrbs();
                } else {
                    this.status = REGULAR;
                }

            } else if (this.status != BOMB) {
		            STATE = this.oldState;
                this.oldState = null;
	    }
        } else if (event_x > pausex && pausex + pauseside > event_x) {
            if (event_y > pausey && pausey + pauseside > event_y) {
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

    inSquare(event_x, event_y, x, y, lx, ly) {
        if (event_x > x && x + lx > event_x) {
            if (event_y > y && y + ly > event_y) {
                return true;
            }
        }

        return false;
    }

    drawPauseButton(x, y, side_len) {
        /* Draw a Pause Button */
        pausex = x;
        pausey = y;
        pauseside = side_len;

    	var bar_width = side_len / 3;

        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = this.cnv.width * 0.008;
        this.ctx.fillStyle = '#FFFFFF';

        this.ctx.beginPath();
    	this.ctx.rect(x, y, bar_width, side_len);
        this.ctx.fill();

        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.beginPath();
    	this.ctx.rect(x + 2 * bar_width, y, bar_width, side_len);
        this.ctx.fill();

        this.ctx.stroke();

        this.ctx.closePath();
    }

    updateScore() {
        /* Write the score on the canvas */
    	this.ctx.textBaseline = 'middle';
    	this.ctx.textAlign = 'end';
    	this.ctx.fillStyle = '#FFFFFF';

    	var font_size = this.cnv.width * 0.13;
    	var font = font_size.toString() + "px basicWoodlands";

    	this.ctx.font = font;

    	this.ctx.fillText(this.score, this.cnv.width * 0.95, this.cnv.width * 0.05);
    	this.ctx.fillText(window.localStorage.getItem('highscore'), this.cnv.width * 0.95, this.cnv.width * 0.16);
    }

    logoScreen() {
        if (this.counter > 5000) {
          STATE = HOME;
        } else {
          this.ctx.textBaseline = 'middle';
        	this.ctx.textAlign = 'center';
        	this.ctx.fillStyle = '#FFFFFF';
          this.ctx.shadowColor = '#FFFFFF';
          this.ctx.shadowBlur = 20;

        	var font_size = this.cnv.width * 0.18;
        	var font = font_size.toString() + "px basicWoodlands";

        	this.ctx.font = font;

        	this.ctx.fillText('Life In Computers', this.cnv.width * 0.50, this.cnv.height * 0.35);

          this.counter = this.counter + TIME_INTERVAL;
        }
    }

    homeScreen() {
      this.ctx.textBaseline = 'middle';
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.shadowColor = '#FFFFFF';
      this.ctx.shadowBlur = 10;

      var font_size = this.cnv.width * 0.22;
      var font = font_size.toString() + "px basicWoodlands";

      this.ctx.font = font;

      this.ctx.fillText('Sway', this.cnv.width * 0.50, this.cnv.height * 0.15);

      this.ctx.fillStyle = PRIMARY_COLOUR;
      this.ctx.strokeStyle = '#FFFFFF';
      this.ctx.lineWidth = this.cnv.width * 0.01;

      this.drawCircle(this.cnv.width * 0.15, this.cnv.height * 0.35, this.cnv.width * 0.1);
      this.drawCircle(this.cnv.width * 0.15, this.cnv.height * 0.65, this.cnv.width * 0.1);
      this.drawCircle(this.cnv.width * 0.85, this.cnv.height * 0.35, this.cnv.width * 0.1);
      this.drawCircle(this.cnv.width * 0.85, this.cnv.height * 0.65, this.cnv.width * 0.1);

      this.drawCircle(this.cnv.width * 0.50, this.cnv.height * 0.40, this.cnv.width * 0.15);

      this.drawDiamond(this.cnv.width * 0.15, this.cnv.height * 0.35, this.cnv.width * 0.1);
      this.drawDiamond(this.cnv.width * 0.15, this.cnv.height * 0.65, this.cnv.width * 0.1);
      this.drawDiamond(this.cnv.width * 0.85, this.cnv.height * 0.35, this.cnv.width * 0.1);
      this.drawDiamond(this.cnv.width * 0.85, this.cnv.height * 0.65, this.cnv.width * 0.1);

      this.drawDiamond(this.cnv.width * 0.50, this.cnv.height * 0.40, this.cnv.width * 0.15);
    }

    drawDiamond(x, y, r) {
      this.ctx.beginPath();
      this.ctx.rect(x - r * 0.5, y - r * 0.5, r, r);
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.closePath();
    }

    drawRect(x, y, lx, ly) {
        this.ctx.beginPath();
        this.ctx.rect(x, y, lx, ly);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawCircle(x, y, r) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0.0 * Math.PI, 2.0 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawImg(x, y, r, img) {
        var aspectRatio = img.height / img.width;

        this.drawCircle(x, y, 2 * r);

        this.ctx.drawImage(img, x - r, y - r * aspectRatio,
			2 * r, 2 * r * aspectRatio);
    }

    drawScreen() {

        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.fillStyle = this.col;
        this.ctx.lineWidth = this.cnv.width * 0.02;

        this.ctx.textBaseline = 'middle';
      	this.ctx.textAlign = 'center';

      	var font_size = this.cnv.width * 0.19;
      	var font = font_size.toString() + "px freestyleScript";

      	this.ctx.font = font;

        this.ctx.lineWidth = this.cnv.width * 0.015;

          this.drawRect(this.cnv.width * 0.15, this.cnv.height * (0.35 + this.sH), this.cnv.width * 0.35, this.cnv.height * 0.30);

          this.drawImg(this.cnv.width * 0.325, this.cnv.height * (0.5 + this.sH), this.cnv.width * 0.0525, restarticon);

          this.drawRect(this.cnv.width * 0.50, this.cnv.height * (0.35 + this.sH), this.cnv.width * 0.35, this.cnv.height * 0.30);

          if (this.status != BOMB) {
              this.drawImg(this.cnv.width * 0.675, this.cnv.height * (0.575 + this.sH), this.cnv.height * 0.0225, homeicon);

              this.drawRect(this.cnv.width * 0.50, this.cnv.height * (0.35 + this.sH), this.cnv.width * 0.35, this.cnv.height * 0.15);

              this.drawImg(this.cnv.width * 0.675, this.cnv.height * (0.425 + this.sH), this.cnv.height * 0.0225, soundicon);
          } else {
              this.drawImg(this.cnv.width * 0.675, this.cnv.height * (0.5 + this.sH), this.cnv.width * 0.0525, homeicon);
          }

          this.ctx.fillStyle = '#FFFFFF';

          if (this.status == BOMB) {
              this.ctx.fillText('Game Over', this.cnv.width * 0.50, this.cnv.height * (0.30 + this.sH));
          } else {
              this.ctx.fillText('Pause', this.cnv.width * 0.50, this.cnv.height * (0.30 + this.sH));
          }

          if (this.sH < 0) {
              this.sH = this.sH + 0.05;
          }
    }
}
