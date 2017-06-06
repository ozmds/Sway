document.addEventListener('DOMContentLoaded', startGame, false);

const PRIMARY_COLOUR = '#000015';
const SECONDARY_COLOUR = '#FFFFFF';
const MARGIN = 5;
const PADDING = 10;
const SPEED = 0.02;

const TIME_INTERVAL = 20;

var time_counter = 0;

var orb_time = 6000;

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
		
		this.pen = new Pendulum(cen, pen, arm);
		this.pen.setSmallLen(this.cnv);
		this.pen.setRange(this.cnv.width / 2, PADDING); 
		
		this.calculateSpeed();
	};	 
	
	this.move = function() {
		/* Move the pendulum as a whole */
		this.pen.move();
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
			this.orbList[i].move(this.speed);
			
			if (this.orbList[i].getY() > (this.cnv.height + this.orbList[i].getR() * 2)) {
				this.orbList.splice(i, 1);
				this.score = 0;
			} else if (this.orbList[i].checkHitPen(this.pen.getPen().getX(), this.pen.getPen().getY(), this.pen.getPen().getR())) {
				this.hitList.push(this.orbList[i]);
				
				if (this.orbList[i].getType() == POISON) {
					this.score = 0; 
				} else if (this.orbList[i].getType() == REGULAR) {
					this.setStatus(SLOW_DOWN);
					this.incrementScore();					
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

function handleClick(event_x, event_y, sway) {
	sway.getPen().getPen().flip();
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
		swayGame.background();
		
		if (swayGame.getOldHeight() != swayGame.getCnv().height) {
			swayGame.initVariable();
			swayGame.setOldHeight(swayGame.getCnv().height);
		}  
		
		drawPauseButton(swayGame.getCnv().width * 0.04, swayGame.getCnv().width * 0.04, swayGame.getCnv().width * 0.10, 
						SECONDARY_COLOUR, swayGame.getCtx());
		
		updateScore(swayGame.getCnv(), swayGame.getCtx(), swayGame.getScore(), 0, SECONDARY_COLOUR);
		
		swayGame.manageOrbs();
		
		if (swayGame.getStatus() == SLOW_DOWN) {
			swayGame.getPen().startShrink();
		}
		
		swayGame.move();
	}, TIME_INTERVAL);
}