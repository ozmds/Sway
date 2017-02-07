document.addEventListener('DOMContentLoaded', init, false); 

var setting_flag = false;
var going_left = true;  

var time_counter = 0; 
var score = 0; 
var deg = 270;

var pen_rad = 60; 
var pad = 10; 
var cen_height = 0.40; 
var speed = 2; 

var time_interval = 20; 

var bgm; 
var arm_length;
var rad;  

var arm; 
var cen; 
var pen; 
var d; 
var s; 

var orb_list = []; 

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

	if (window.localStorage.getItem("highscore") == null) {
		window.localStorage.setItem("highscore", score); 
	}
	
	setUpGame(); 
}	

function setUpGame() {
	var cen_x = c.width / 2; 
	var cen_y = c.height * cen_height;

	var out_x = c.width / 2;
	var out_y = c.height - (pen_rad + pad); 
	
	arm_length = out_y - cen_y; 
	
	arm = new Line(cen_x, cen_y, out_x, out_y, 7, 'black', ctx); 
	arm.draw(); 
	
	cen = new Circle(cen_x, cen_y, 15, 'white', 5, 'black', ctx);
	cen.draw(); 
	
	pen = new Circle(out_x, out_y, pen_rad, 'white', 10, 'black', ctx); 
	pen.draw(); 
	
	updateScore(score, c.width - 20, 20, c.width - 20, 50, '20px Palatino', 'black', ctx);
	
	drawPauseButton(20, 20, 50, 'black', ctx);
	
	c.addEventListener('click', function(event) {handleClick(event.x, event.y);});
}

function handleClick(x, y) {
	going_left = !going_left; 
}

function pauseScreen() {
	/* To be coded */
}

function updateGame() {
	
	if (going_left) {
		deg -= speed; 
	} else {
		deg += speed; 
	}
	
	rad = toRadians(deg); 
	
	pen.x = cen.x + Math.cos(rad) * arm_length; 
	pen.y = cen.y - Math.sin(rad) * arm_length;

	if (checkHitWall(pen.x, pen.y, c.width, c.height, pen_rad, pad)) {
		going_left = !going_left;
		if (going_left) {
			deg -= 2 * speed; 
		} else {
			deg += 2 * speed; 
		}
	}
	
	rad = toRadians(deg); 
	
	pen.x = cen.x + Math.cos(rad) * arm_length; 
	pen.y = cen.y - Math.sin(rad) * arm_length;
	
	arm.endX = pen.x; 
	arm.endY = pen.y; 
	
	arm.draw(); 
	
	cen.draw(); 
	
	time_counter += time_interval; 
	
	if (time_counter == 3000) {
		time_counter = 0; 
		d = new Diamond(10, 'red', ctx);		
		d.place(arm_length, c.width);
		orb_list.push(d); 
	}
	
	s = moveDiamonds(orb_list, score, pen.x, pen.y, pen_rad, c.height);  
	
	if (s == null) {
		setting_flag = !setting_flag; 
	} else {
		score = s; 
	}

	pen.draw(); 
	
	updateScore(score, c.width - 20, 20, c.width - 20, 50, '20px Palatino', 'black', ctx);
	drawPauseButton(20, 20, 50, 'black', ctx);
}

setInterval(function() {
	ctx.clearRect(0, 0, c.width, c.height); 
	
	if (setting_flag) {
		pauseScreen(); 
	} else {
		updateGame(); 
	}
}, time_interval); 	