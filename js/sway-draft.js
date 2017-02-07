document.addEventListener('DOMContentLoaded', setUpGame, false); 

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
}

function setUpGame() { 
	init(); 	
	setting_flag = false;
	time_counter = 0;
	going_left = 1;
	score = 0; 
	deg = 270; 
	rad = 0; 
	orb_list = [];
	
	var center_x = c.width / 2; 
	var center_y = (c.height / 2) - Math.round(c.height / 10); 
	
	var outer_x = c.width / 2; 
	var outer_y = c.height - 40; 

	line_height = outer_y - center_y; 
	
	arm = new Line(center_x, center_y, outer_x, outer_y, 7, 'black', ctx); 
	arm.draw();  
	
	cen = new Circle(center_x, center_y, 15, 'white', 5, 'black', ctx);
	cen.draw(); 

	pen = new Circle(outer_x, outer_y, 30, 'white', 10, 'black', ctx); 
	pen.draw();  

	updateScore(); 

	c.addEventListener('click', function(event) {handleClick(event.x, event.y);}); 

} 

function handleClick(x, y) {
	if (setting_flag) {
		setting_flag = !setting_flag; 
	} else if ((x > 35) && (x < 85)) {
		if ((y > 35) && (y < 85)) {
			setting_flag = !setting_flag;
		}
	} else if (going_left == 1) {
		going_left = 0; 
	} else {
		going_left = 1; 
	} 
}

function pauseScreen () {
	ctx.fillRect(20, 20, 17, 50);
	ctx.fillRect(53, 20, 17, 50);

	centeredRect(c.width - 55, 55, 50, 50, 5); 
	centeredRect(c.width - 145, 55, 50, 50, 5); 
	
	centeredRect(c.width / 2, c.height * 0.35, 200, 50, 5);
	centeredRect(c.width / 2, c.height * 0.50, 200, 50, 5);
	centeredRect(c.width / 2, c.height * 0.65, 200, 50, 5);
	
	/*
	ctx.font = "50px Palatino"; 
	ctx.textAlign = "start"; 
	ctx.textBaseline = "top";
	*/
}

function updateGame() {

	if (going_left == 1) {
		deg = deg - 1; 
	} else {
		deg = deg + 1; 
	}
	
	rad = toRadians(deg); 
	pen.x = c.width / 2 + Math.cos(rad) * line_height;
	pen.y = ((c.height / 2) - Math.round(c.height / 10)) - 
				  (line_height * Math.sin(rad));
				  
	arm.startX = cen.x; 
	arm.startY = cen.y; 
	arm.endX = pen.x; 
	arm.endY = pen.y; 
				  
	arm.draw(); 			  
	
	cen.draw(); 
				 
	time_counter = time_counter + 20; 
	
	if (time_counter == 3000) {
		time_counter = 0;
		var d = new Diamond(10, 'red', ctx);
		d.place(); 
		orb_list.push(d);  
	}
	
	if (!setting_flag) {
		pen.draw();
		updateScore(); 
	}
}

setInterval(function(){

	ctx.clearRect(0, 0, c.width, c.height);  
	
	if (setting_flag) {
		pauseScreen(); 
	} else {
		updateGame(); 
	}
	}, 20); 