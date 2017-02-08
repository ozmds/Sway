document.addEventListener('DOMContentLoaded', init, false); 

var over_flag = false;
var pause_flag = false; 
var going_left = true; 
var start_flag = true;  

var time_counter = 0; 
var score = 0; 
var deg = 270;

var pen_rad = 60; 
var pad = 10; 
var cen_height = 0.40; 
var speed = 1; 

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
	c.style.backgroundColor = '#000000'; 

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
	
	arm = new Line(cen_x, cen_y, out_x, out_y, 7, 'white', ctx); 
	
	cen = new Circle(cen_x, cen_y, 15, 'black', 5, 'white', ctx);
	
	pen = new Circle(out_x, out_y, pen_rad, 'black', 10, 'white', ctx);

	startScreen(ctx); 	
	
	c.addEventListener('click', function(event) {handleClick(event.x, event.y);});
}

function handleClick(x, y) {
	if (pause_flag) {
		pause_flag = !pause_flag; 
	} else if (start_flag) {
		start_flag = !start_flag; 
	} else if (over_flag) {
		over_flag = !over_flag; 
	} else if (x > 35 && x < 85 && y > 35 && y < 85) {
		pause_flag = !pause_flag; 
	} else {
		going_left = !going_left;
	}
}

function overScreen(ctx) {
	
	var box_list = []; 
	
	box_list.push([c.width - 55, 55, 50, 50]); 
	box_list.push([c.width - 145, 55, 50, 50]); 
	
	box_list.push([c.width / 2, c.height * 0.35, 200, 50]); 
	box_list.push([c.width / 2, c.height * 0.50, 200, 50]); 
	
	drawPauseScreen(box_list, 5, 'white', ctx); 
	
	ctx.textAlign = 'center'; 
	ctx.textBaseline = 'middle'; 
	
	ctx.font = '40px Palatino'; 
	ctx.fillStyle = 'white'; 
	
	ctx.fillText('S', c.width - 55, 55); 
	ctx.fillText('M', c.width - 145, 55);
	ctx.fillText(score, c.width / 2, c.height * 0.35); 
	ctx.fillText('Restart', c.width / 2, c.height * 0.50);  
}

function startScreen(ctx) {
	
	var box_list = []; 
	
	box_list.push([c.width - 55, 55, 50, 50]); 
	box_list.push([c.width - 145, 55, 50, 50]); 
	
	box_list.push([c.width / 2, c.height * 0.35, 200, 50]); 
	box_list.push([c.width / 2, c.height * 0.50, 200, 50]); 
	box_list.push([c.width / 2, c.height * 0.65, 200, 50]); 
	
	drawPauseScreen(box_list, 5, 'white', ctx); 
	
	ctx.textAlign = 'center'; 
	ctx.textBaseline = 'middle'; 
	
	ctx.font = '40px Palatino'; 
	ctx.fillStyle = 'white'; 
	
	ctx.fillText('S', c.width - 55, 55); 
	ctx.fillText('M', c.width - 145, 55);
	ctx.fillText('Sway', c.width / 2, c.height * 0.35); 
	ctx.fillText('Start', c.width / 2, c.height * 0.50); 
	ctx.fillText('Clear Score', c.width / 2, c.height * 0.65); 
	
	drawCross(c.width - 80, 80, c.width - 30, 30, 5, 'white', ctx); 
	drawCross(c.width - 170, 80, c.width - 120, 30, 5, 'white', ctx); 
}

function pauseScreen(ctx) {
	
	var box_list = []; 
	
	box_list.push([c.width - 55, 55, 50, 50]); 
	box_list.push([c.width - 145, 55, 50, 50]); 
	
	box_list.push([c.width / 2, c.height * 0.35, 200, 50]); 
	box_list.push([c.width / 2, c.height * 0.50, 200, 50]); 
	box_list.push([c.width / 2, c.height * 0.65, 200, 50]); 
	
	drawPauseScreen(box_list, 5, 'white', ctx); 
	
	ctx.textAlign = 'center'; 
	ctx.textBaseline = 'middle'; 
	
	ctx.font = '40px Palatino'; 
	ctx.fillStyle = 'white'; 
	
	ctx.fillText('S', c.width - 55, 55); 
	ctx.fillText('M', c.width - 145, 55);
	ctx.fillText(score, c.width / 2, c.height * 0.35); 
	ctx.fillText('Resume', c.width / 2, c.height * 0.50); 
	ctx.fillText('Restart', c.width / 2, c.height * 0.65); 
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
	
	if (time_counter == 800) {
		time_counter = 0; 
		d = new Diamond(10, 'red', ctx);		
		d.place(arm_length, c.width);
		orb_list.push(d); 
	}
	
	s = moveDiamonds(orb_list, score, pen.x, pen.y, pen_rad, c.height);  
	
	if (s == null) {
		over_flag = !over_flag; 
	} else {
		score = s;
	}
	
	pen.draw(); 
	
	updateScore(score, c.width - 20, 20, c.width - 20, 50, '20px Palatino', 'white', ctx);
	drawPauseButton(20, 20, 50, 'white', ctx);
}

setInterval(function() {
	
	ctx.clearRect(0, 0, c.width, c.height); 
	
	if (start_flag) {
		startScreen(ctx); 
	} else if (over_flag) {
		overScreen(ctx);
	} else if (pause_flag) {
		pauseScreen(ctx); 
	} else {
		updateGame(); 
	}
}, time_interval); 	