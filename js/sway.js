document.addEventListener('DOMContentLoaded', setUpGame, false); 

class Circle {
	constructor(x, y, r, colour, outlineWidth, outlineColour, context) {
		this.x = x; 
		this.y = y; 
		this.r = r; 
		this.colour = colour; 
		this.outWidth = outlineWidth; 
		this.outColour = outlineColour; 
		this.context = context; 
	}
	
	draw() {
		var ctx = this.context; 
		ctx.fillStyle = this.colour; 
		ctx.lineWidth = this.outWidth; 
		ctx.strokeStyle = this.outColour; 
		
		ctx.beginPath(); 
		ctx.arc(this.x, this.y, this.r, 0.0 * Math.PI, 2.0 * Math.PI);
		ctx.fill(); 
		ctx.stroke(); 
	}
}

class Diamond {
	constructor(r, colour, context) {
		this.x = null; 
		this.y = -2 * r; 
		this.r = r; 
		this.colour = colour; 
		this.context = context; 
	}
	
	draw() {
		var ctx = this.context; 
		var x = this.x; 
		var y = this.y; 
		var r = this.r; 
		ctx.fillStyle = colour; 
		
		ctx.beginPath(); 
		ctx.moveTo(x, y - r); 
		ctx.lineTo(x - r, y); 
		ctx.lineTo(x, y + r); 
		ctx.lineTo(x + r, y); 
		ctx.lineTo(x, y - r); 
		ctx.fill(); 
	}
	
	place() {
		var x; 
		var range = 2 * (line_height + 30); 
		
		if (c.width < range) {
			x = Math.round(Math.random() * (c.width - 40)) + 20;
		} else {
			x = Math.round(Math.random() * range) + (0.5 * (c.width - range));
		}
	}
}

function init() { 
	c = document.getElementById('myCanvas'); 
	ctx = c.getContext('2d');

	c.height = (window.innerHeight - 30) * window.devicePixelRatio; 
	c.width = (window.innerWidth - 30) * window.devicePixelRatio; 
	
	c.style.width = (c.width / window.devicePixelRatio).toString() + "px"; 
	c.style.height = (c.height / window.devicePixelRatio).toString() + "px";

	c.style.top = (15).toString() + "px"; 
	c.style.left = (15).toString() + "px"; 
	c.style.border = (5).toString() + "px solid #000000";	

	ctx.font = '20px Georgia'; 

	if (window.localStorage.getItem("highscore") == null) {
		window.localStorage.setItem("highscore", score); 
	}
}

function setUpGame() {
	window.alert("batman"); 
	init(); 	

	setting_flag = 0;
	time_counter = 0;
	going_left = 1;
	score = 0; 
	deg = 270; 
	orb_list = [];

	var center_x = c.width / 2; 
	var center_y = (c.height / 2) - Math.round(c.height / 10); 
	
	var outer_x = c.width / 2; 
	var outer_y = c.height - 40; 

	line_height = outer_y - center_y; 

	createLine(center_x, center_y, outer_x, outer_y, 7, 'black', ctx);

	cen = new Circle(center_x, center_y, 15, 'white', 5, 'black', ctx);
	cen.draw(); 

	pen = new Circle(outer_x, outer_y, 30, 'white', 10, 'black'ctx); 
	pen.draw(); 
	
	coin = new Audio('data/coin.wav'); 

	updateScore(); 
	
	c.addEventListener('click', function(event) {handleClick(event.x, event.y);}); 
} 

function handleClick(x, y) {
	if (going_left == 1) {
		going_left = 0; 
	} else {
		going_left = 1; 
	}
}

function updateScore() {
	ctx.fillStyle = 'black';

	if (score > window.localStorage.getItem("highscore")) {
		window.localStorage.setItem("highscore", score); 
	}
	
	ctx.fillText(score, c.width - 40, 25);
	ctx.fillText(window.localStorage.getItem("highscore"), c.width - 40, 50); 
}

function toRadians (angle) {
	return angle * (Math.PI / 180);
}

function createLine (startX, startY, endX, endY, width, colour, ctx) {
	ctx.lineWidth = width; 	
	ctx.strokeStyle = colour; 
	ctx.beginPath(); 
	ctx.moveTo(startX, startY); 
	ctx.lineTo(endX, endY); 
	ctx.stroke();
}

function checkHitbox (circleX, circleY, diamondX, diamondY) {
	x_value = Math.pow(circleX - diamondX, 2); 
	y_value = Math.pow(circleY - diamondY, 2); 
	if (x_value + y_value < 900) {
		return true; 
	}
}
 
setInterval(function(){
	
	/* Clear the Rectangle */
	ctx.clearRect(0, 0, c.width, c.height); 
	
	/* Check if we hit a wall */
	if (pen.x < 40) {
		going_left = 0; 
	} else if (pen.x > (c.width - 40)) {
		going_left = 1; 
	}
	
	if (pen.y < 40) {
		if (pen.x > c.width / 2) {
			going_left = 1; 	
		} else {
			going_left = 0; 
		}
	}
	
	/* Direction to be currently going */
	if (going_left == 1) {
		deg = deg - 1; 
	} else {
		deg = deg + 1; 
	}
	
	/* Calculate new position */
	pen.r = toRadians(deg); 
	pen.x = c.width / 2 + Math.cos(r) * line_height;
	pen.y = ((c.height / 2) - Math.round(c.height / 10)) - 
				  (line_height * Math.sin(r));
				  
	createLine(cen.x, cen.y, pen.x, pen.y, 7, 'black', ctx); 
	
	cen.draw(); 
				 
	time_counter = time_counter + 20; 
	
	if (time_counter == 3000) {
		time_counter = 0;
		var d = new Diamond(10, 'red', ctx); 
		d.place(); 
		orb_list.push(d);
	}
	
	for (i = 0; i < orb_list.length; i++) {
		orb_list[i].y = orb_list[i].y + 2;
		
		if (checkHitbox(pen.x, pen.y, orb_list[i].x, orb_list[i].y)) {
			orb_list.splice(i, 1); 
			coin.play();  
			score = score + 1;  
		} else {
			orb_list[i].draw(); 
		}
	}
	
	pen.draw(); 
	
	}, 30); 
