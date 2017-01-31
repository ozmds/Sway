document.addEventListener('DOMContentLoaded', init, false); 

function init() {
	c = document.getElementById('myCanvas'); 
	ctx = c.getContext('2d');

	time_counter = 0;
	
	c.height = window.innerHeight - 30; 
	c.width = window.innerWidth - 30; 
 
	small_x = c.width / 2; 
	small_y = (c.height / 2) - Math.round(c.height / 10); 
	
	x = c.width / 2; 
	y = c.height - 40; 
	
	startAngle = 0.0 * Math.PI; 
	endAngle = 2.0 * Math.PI; 
	
	orb_list = [];
	coin = new Audio('data/coin.wav'); 
	
	createLine(small_x, small_y, x, y, 7, 'black', ctx);
	
	createCircle(small_x, small_y, 15, startAngle, endAngle, 'white', 
				 5, 'black', ctx); 
	
	createCircle(x, y, 30, startAngle, endAngle, 'white', 10, 'black',
	             ctx);
				 
	deg = 270; 
	line_height = y - small_y; 
	score = 0; 
	
	going_left = 1; 
	ctx.font = '20px Georgia'; 
	
	c.addEventListener('click', function(event) {
		if (going_left == 1) {
			going_left = 0;
		} else {
			going_left = 1; 
		}
	}); 
} 

function toRadians (angle) {
	return angle * (Math.PI / 180);
}

function createCircle (x, y, radius, startAngle, endAngle, fill, 
					   lineWidth, outline, ctx) {
	ctx.fillStyle = fill; 
	ctx.lineWidth = lineWidth; 
	ctx.strokeStyle = outline; 
	
	ctx.beginPath();
	ctx.arc(x, y, radius, startAngle, endAngle); 
	ctx.fill(); 
	ctx.stroke(); 
}

function createDiamond (x, y, colour, ctx) {
	ctx.fillStyle = colour;
	
	ctx.beginPath(); 
	ctx.moveTo(x, y - 10); 		
	ctx.lineTo(x - 10, y); 
	ctx.lineTo(x, y + 10); 
	ctx.lineTo(x + 10, y); 
	ctx.lineTo(x, y - 10); 
	ctx.fill();  
}

function createLine (startX, startY, endX, endY, width, colour, ctx) {
	ctx.lineWidth = width; 	
	ctx.strokeStyle = colour; 
	ctx.beginPath(); 
	ctx.moveTo(startX, startY); 
	ctx.lineTo(endX, endY); 
	ctx.stroke();
}

function placeDiamond () {
	var diamondX = Math.round(Math.random() * (c.width - 40)) + 20;
	createDiamond(diamondX, 20, "red", ctx); 
	orb_list.push(["red", diamondX, 20]); 
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
	if (x < 40) {
		going_left = 0; 
	} else if (x > (c.width - 40)) {
		going_left = 1; 
	}
	
	if (y < 40) {
		if (x > c.width / 2) {
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
	r = toRadians(deg); 
	x = Math.round(c.width / 2 + Math.cos(r) * line_height);
	y = Math.round(((c.height / 2) - Math.round(c.height / 10)) - 
				  (line_height * Math.sin(r)));
				  
	createLine(small_x, small_y, x, y, 7, 'black', ctx); 
	
	createCircle(small_x, small_y, 15, startAngle, endAngle, 'white', 
				 5, 'black', ctx); 
				 
	time_counter = time_counter + 20; 
	
	if (time_counter == 3000) {
		time_counter = 0;
		placeDiamond(); 
	}
	
	for (i = 0; i < orb_list.length; i++) {
		orb_list[i][2] = orb_list[i][2] + 2;
		
		if (checkHitbox(x, y, orb_list[i][1], orb_list[i][2])) {
			orb_list.splice(i, 1); 
			coin.play();  
			score = score + 1;  
		} else {
			createDiamond(orb_list[i][1], orb_list[i][2], orb_list[i][0], ctx);
		}
 		
	}
	ctx.fillStyle = 'black';
	ctx.fillText(score, c.width - 40, 25);
	ctx.fillText(c.width, c.width - 60, 50); 
	ctx.fillText(c.height, c.width - 60, 75); 
	createCircle(x, y, 30, startAngle, endAngle, 'white', 10, 'black',
	             ctx);
	
	}, 20); 