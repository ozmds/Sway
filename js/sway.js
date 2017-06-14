document.addEventListener('DOMContentLoaded', startGame, false);

const PURPLE = '#9935B5';
const GREEN = '#338A28';
const RED = '#7F0000';
const BLUE = '#000015';

var PRIMARY_COLOUR = BLUE;

var DEST_COLOUR = PRIMARY_COLOUR;

const SECONDARY_COLOUR = '#FFFFFF';
const MARGIN = 5;
const PADDING = 10;

const TIME_INTERVAL = 15;
const PEN_START_TIME = 1500;
const PEN_DECREMENT_TIME = 0.05 * PEN_START_TIME;

var time_counter = 0;

var orb_time = 6000;
var pen_time = PEN_START_TIME;

function Sway(cnv) {
	this.cnv = document.getElementById(cnv);
	this.ctx = this.cnv.getContext('2d');
	this.old_height = 0;
	this.pen = null;
	this.orbList = [];
	this.hitList = [];
	this.score = 0;
	this.speed = 0;
	this.status = REGULAR;
	
	this.cnv.style.top = (MARGIN).toString() + 'px';
	this.cnv.style.left = (MARGIN).toString() + 'px';
	
	this.getStatus = function() {
		/* Return status */
		return this.status;
	}
	
	this.setStatus = function(x) {
		/* Set Status */
		this.status = x;
	}
	
	this.calculateSpeed = function() {
		/* Calculate Speed based on orb_time */
		this.speed = Math.round(this.cnv.height / (orb_time / TIME_INTERVAL));
	}
	
	this.getScore = function() {
		/* Return Score */
		return this.score;
	}
	
	this.incrementScore = function() {
		/* Increment Score */
		this.score += 1;
	}
	
	this.getOldHeight = function() {
		/* Return the old height */
		return this.old_height;
	};
	
	this.getCtx = function() {
		/* Return the context */
		return this.ctx;
	}
	
	this.setOldHeight = function(x) {
		/* Set the old height */
		this.old_height = x;
	}
	
	this.getCnv = function() {
		/* Return the canvas */
		return this.cnv;
	}
	
	this.getPen = function() {
		/* Return the pendulum */
		return this.pen;
	}
	
	this.initVariable = function() {
		/* Initialize all the main variables */
		var cen_height = 0.60;
		var pen_rad = this.cnv.width * 0.1;
		
		var cen_x = this.cnv.width / 2;
		var cen_y = this.cnv.height * cen_height;
		
		var pen_x = this.cnv.width / 2;
		var pen_y = this.cnv.height - (pen_rad + PADDING);
		
		var arm = new Line(cen_x, cen_y, pen_x, pen_y, this.cnv.width * 0.015, SECONDARY_COLOUR, this.ctx, this.cnv); 
		var cen = new Circle(cen_x, cen_y, pen_rad / 2, PRIMARY_COLOUR, this.cnv.width * 0.0175, SECONDARY_COLOUR, this.ctx, this.cnv);
		var pen = new Circle(pen_x, pen_y, pen_rad, PRIMARY_COLOUR, this.cnv.width * 0.02, SECONDARY_COLOUR, this.ctx, this.cnv);
		
		var sArm = new Line(cen_x, cen_y, pen_x, pen_y, this.cnv.width * 0.015, SECONDARY_COLOUR, this.ctx, this.cnv);
		var sPen = new Circle(pen_x, pen_y, pen_rad, PRIMARY_COLOUR, this.cnv.width * 0.02, SECONDARY_COLOUR, this.ctx, this.cnv);
		
		this.pen = new Pendulum(cen, pen, arm);
		
		this.pen.setSArm(sArm);
		this.pen.setSPen(sPen);
		
		this.pen.setSmallLen(this.cnv);
		this.pen.setRange(this.cnv.width / 2, PADDING); 
		
		this.calculateSpeed();
		this.pen.calcPenSpeed(pen_time);
	};	 
	
	this.move = function() {
		/* Move the pendulum as a whole */
		this.pen.move(this.status);
		this.pen.draw();
	}
	
	this.manageOrbs = function() {
		/* Manage the all of the orbs currently on the screen */
		
		var i;
		if (time_counter >= 1500) {
			time_counter = 0;
			
			var d = new Diamond(this.cnv.width * 0.035, this.ctx, this.cnv, null);
			d.place(this.pen.getArm().getOldLen(), this.pen.getPen().getR()); 
			this.orbList.push(d);
		}
		
		for (i = 0; i < this.orbList.length; i++) {
			
			if (this.status != REGULAR) {
				if (this.status != SLOW_DOWN) {
					this.orbList[i].setType(REGULAR);
					this.orbList[i].setImage();
				} else {
					if (this.orbList[i].getType() != POISON) {
						this.orbList[i].setType(REGULAR);
						this.orbList[i].setImage();
					}
				}
			}
			
			this.orbList[i].move(this.speed);
			
			if (this.orbList[i].getY() > (this.cnv.height + this.orbList[i].getR() * 2)) {
				if (this.orbList[i].getType() == REGULAR) {
					this.orbList.splice(i, 1);
					this.score = 0;
				}
			} else if ((this.orbList[i].checkHitPen(this.pen.getPen().getX(), 
													this.pen.getPen().getY(), 
													this.pen.getPen().getR() * this.pen.getSpikeHeight())) ||
						(this.orbList[i].checkHitPen(this.pen.getSPen().getX(), 
													this.pen.getSPen().getY(), 
													this.pen.getSPen().getR()))) {
				this.hitList.push(this.orbList[i]);
				
				if (this.orbList[i].getType() == POISON) {
					this.score = 0; 
				} else if (this.orbList[i].getType() == SLOW_DOWN) {
					this.setStatus(SLOW_DOWN);					
				} else if (this.orbList[i].getType() == BALLOON) {
					this.setStatus(BALLOON);
				} else if (this.orbList[i].getType() == SPIKE) {
					this.setStatus(SPIKE);
				}
				
				if (this.orbList[i].getType() == REGULAR) {
					this.incrementScore();
					if ((this.score % 10 == 0) && (this.score <= 200)) {
						pen_time = PEN_START_TIME - (this.score / 10) * PEN_DECREMENT_TIME;
						this.pen.calcPenSpeed(pen_time);
					}
				}
				
				this.orbList.splice(i, 1);
				
			} else {
				this.orbList[i].draw();
			}
		}
		
		for (i = 0; i < this.hitList.length; i++) {
			this.hitList[i].updateHitTimer(TIME_INTERVAL);
			
			if (this.hitList[i].getHitTimer() > 2000) {
				this.hitList.splice(i, 1);
			} else {
				this.hitList[i].move(this.speed * -0.5);
				this.hitList[i].draw();
			}
		}
		
		time_counter = time_counter + TIME_INTERVAL;
	}
}

Sway.prototype.background = function() {
	this.cnv.height = (window.innerHeight - 10) * window.devicePixelRatio;
	this.cnv.width = (window.innerWidth - 10) * window.devicePixelRatio;
		
	this.cnv.style.width = (this.cnv.width / window.devicePixelRatio).toString() + 'px';
	this.cnv.style.height = (this.cnv.height / window.devicePixelRatio).toString() + 'px';
		
	document.body.style.backgroundColor = PRIMARY_COLOUR;
	this.cnv.style.backgroundColor = PRIMARY_COLOUR;
};

function changeColours(colour1, colour2) {
	var c1 = [];
	var c2 = [];
	
	var newcol = []
	
	c1.push(parseInt(colour1.slice(1, 3), 16));
	c1.push(parseInt(colour1.slice(3, 5), 16));
	c1.push(parseInt(colour1.slice(5, 7), 16));
	
	c2.push(parseInt(colour2.slice(1, 3), 16));
	c2.push(parseInt(colour2.slice(3, 5), 16));
	c2.push(parseInt(colour2.slice(5, 7), 16));
	
	if (c1[0] > c2[0]) {
		newcol.push(c1[0] - 1);
	} else if (c1[0] == c2[0]) { 
		newcol.push(c1[0]);
	} else {
		newcol.push(c1[0] + 1);
	}
	
	if (c1[1] > c2[1]) {
		newcol.push(c1[1] - 1);
	} else if (c1[1] == c2[1]) { 
		newcol.push(c1[1]);
	} else {
		newcol.push(c1[1] + 1);
	}
	
	if (c1[2] > c2[2]) {
		newcol.push(c1[2] - 1);
	} else if (c1[2] == c2[2]) { 
		newcol.push(c1[2]);
	} else {
		newcol.push(c1[2] + 1);
	}
	
	if (newcol[0] == 0) {
		newcol[0] = '00';
	} else if (newcol[0] < 16) {
		newcol[0] = '0' + newcol[0].toString(16);	
	}
	
	if (newcol[1] == 0) {
		newcol[1] = '00';
	} else if (newcol[1] < 16) {
		newcol[1] = '0' + newcol[1].toString(16);	
	}
	
	if (newcol[2] == 0) {
		newcol[2] = '00';
	} else if (newcol[2] < 16) {
		newcol[2] = '0' + newcol[2].toString(16);	
	}
	
	PRIMARY_COLOUR = '#' + newcol[0].toString(16) + newcol[1].toString(16) + newcol[2].toString(16);
	return true;
}

function handleClick(event_x, event_y, sway) {
	sway.getPen().getPen().flip();
	
	if (sway.getStatus() != BALLOON) {	
		sway.getPen().getSPen().flip();
	}
}

function drawPauseButton(x, y, side_len, colour, context) {
	var bar_width = side_len / 3; 
	context.fillStyle = colour; 
	
	context.fillRect(x, y, bar_width, side_len); 
	context.fillRect(x + 2 * bar_width, y, bar_width, side_len); 
}

function updateScore(c, ctx, score, highscore, colour) {
	ctx.textBaseline = 'middle'; 
	ctx.textAlign = 'end'; 
	ctx.fillStyle = colour; 
	
	var font_size = c.width * 0.13; 
	var font = font_size.toString() + "px basicWoodlands";

	ctx.font = font; 
	
	ctx.fillText(score, c.width * 0.95, c.width * 0.05);
	ctx.fillText(highscore, c.width * 0.95, c.width * 0.16); 
}

function startGame() {
	var swayGame = new Sway('myCanvas');
	
	swayGame.background();
	swayGame.initVariable();
	
	swayGame.getCnv().addEventListener('click', function(event) {handleClick(event.x * window.devicePixelRatio, event.y * window.devicePixelRatio, swayGame);});
	
	setInterval(function() {
		changeColours(PRIMARY_COLOUR, DEST_COLOUR);
		
		swayGame.background();
		
		swayGame.getPen().setCol(PRIMARY_COLOUR);
		
		if (swayGame.getOldHeight() != swayGame.getCnv().height) {
			swayGame.initVariable();
			swayGame.setOldHeight(swayGame.getCnv().height);
		}  
		
		drawPauseButton(swayGame.getCnv().width * 0.04, swayGame.getCnv().width * 0.04, swayGame.getCnv().width * 0.10, 
						SECONDARY_COLOUR, swayGame.getCtx());
		
		updateScore(swayGame.getCnv(), swayGame.getCtx(), swayGame.getScore(), 0, SECONDARY_COLOUR);
		
		swayGame.manageOrbs();
		
		if (swayGame.getStatus() == SLOW_DOWN) {
			if (!swayGame.getPen().startShrink()) {
				swayGame.setStatus(REGULAR);
			}
		} else if (swayGame.getStatus() == BALLOON) {
			if (!swayGame.getPen().startBalloon()) {
				swayGame.setStatus(REGULAR);
			}
		} else if (swayGame.getStatus() == SPIKE) {
			if (!swayGame.getPen().startSpike()) {
				swayGame.setStatus(REGULAR);
			}
		}
		
		swayGame.move();
	}, TIME_INTERVAL);
}