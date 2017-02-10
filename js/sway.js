const PRIMARY_COLOUR = '#123444';
const SECONDARY_COLOUR = '#FFFFFF';  

const SETTING = 'setting'; 
const PAUSE = 'pause'; 
const PLAY = 'play'; 
const GAME_OVER = 'gameOver'; 
const START = 'start'; 

var state = START; 

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

	document.body.style.backgroundColor = PRIMARY_COLOUR;
	
	c.style.width = (c.width / window.devicePixelRatio).toString() + "px"; 
	c.style.height = (c.height / window.devicePixelRatio).toString() + "px";

	c.style.top = (15).toString() + "px"; 
	c.style.left = (15).toString() + "px"; 
	c.style.border = (5).toString() + "px solid " + SECONDARY_COLOUR;	
	c.style.backgroundColor = PRIMARY_COLOUR; 

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
	
	arm = new Line(cen_x, cen_y, out_x, out_y, 7, SECONDARY_COLOUR, ctx); 
	
	cen = new Circle(cen_x, cen_y, 15, PRIMARY_COLOUR, 5, SECONDARY_COLOUR, ctx);
	
	pen = new Circle(out_x, out_y, pen_rad, PRIMARY_COLOUR, 10, SECONDARY_COLOUR, ctx);

	startScreen(ctx); 	
	
	c.addEventListener('click', function(event) {handleClick(event.x, event.y);});
}

function startScreen(ctx) {
	var box_list = []; 

	box_list.push([c.width * 0.70, c.width * 0.05, c.width * 0.10, c.width * 0.10]);
 
	box_list.push([c.width * 0.85, c.width * 0.05, c.width * 0.10, c.width * 0.10]); 

	box_list.push([c.width * 0.30, c.height * 0.50, c.width * 0.40, c.height * 0.10]);
	box_list.push([c.width * 0.30, c.height * 0.70, c.width * 0.40, c.height * 0.10]); 
	
	drawScreen(box_list, 5, SECONDARY_COLOUR, ctx);  
	
	ctx.textAlign = 'center'; 
	ctx.textBaseline = 'middle'; 

	ctx.font = (c.width * 0.07).toString() + 'px basicWoodlands'; 
	ctx.fillStyle = SECONDARY_COLOUR; 

	ctx.fillText('S', c.width * 0.75, c.width * 0.107);
	ctx.fillText('M', c.width * 0.90, c.width * 0.107); 

	ctx.font = (c.width * 0.15).toString() + 'px basicWoodlands';
	ctx.fillText('Sway', c.width * 0.50, c.height * 0.350);

	ctx.font = (c.width * 0.07).toString() + 'px basicWoodlands'; 
	ctx.fillText('Start', c.width * 0.50, c.height * 0.55);
	ctx.fillText('Setting', c.width * 0.50, c.height * 0.750);
}

function settingScreen(ctx) {
}

function pauseScreen(ctx) {
}

function gameOverScreen(ctx) {
}

document.addEventListener('DOMContentLoaded', init, false); 

setInterval(function() {
	
	ctx.clearRect(0, 0, c.width, c.height); 
	
	c.height = (window.innerHeight - 30) * window.devicePixelRatio; 
	c.width = (window.innerWidth - 30) * window.devicePixelRatio; 
	
	c.style.width = (c.width / window.devicePixelRatio).toString() + "px"; 
	c.style.height = (c.height / window.devicePixelRatio).toString() + "px";

	switch (state) {
		case START: 
			startScreen(ctx); 
			break; 
		case SETTING:
			settingScreen(ctx); 
			break;
		case PAUSE:
			pauseScreen(ctx); 
			break; 
		case GAME_OVER:
			gameOverScreen(ctx); 
			break;
		case PLAY:
			updateGame(); 
			break;
	}
}, time_interval); 	
