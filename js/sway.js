const PRIMARY_COLOUR = '#123444';
const SECONDARY_COLOUR = '#FFFFFF';  

const SETTING = 'setting'; 
const PAUSE = 'pause'; 
const PLAY = 'play'; 
const GAME_OVER = 'gameOver'; 
const START = 'start'; 

var state = START;

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

	c.style.top = (5).toString() + "px"; 
	c.style.left = (5).toString() + "px"; 
	c.style.border = (1.5).toString() + "px solid " + SECONDARY_COLOUR;	
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
	
	var font_size = ((c.height * 0.10) * 0.90).toString(); 
	var font = font_size + "px basicWoodlands"; 
	
	var start = new Button(c.width / 2, c.height * 0.50, c.width * 0.70, c.height * 0.10, PRIMARY_COLOUR, 5, SECONDARY_COLOUR, ctx, font, "Start"); 
	var setting = new Button(c.width / 2, c.height * 0.65, c.width * 0.70, c.height * 0.10, PRIMARY_COLOUR, 5, SECONDARY_COLOUR, ctx, font, "Setting");

	var sfx = new Button(c.width * 0.875, c.width * 0.125, c.width * 0.15, c.width * 0.15, PRIMARY_COLOUR, 5, SECONDARY_COLOUR, ctx, font, "Fx");
	var music = new Button(c.width * 0.675, c.width * 0.125, c.width * 0.15, c.width * 0.15, PRIMARY_COLOUR, 5, SECONDARY_COLOUR, ctx, font, "M");
	
	font_size = (c.height * 0.15).toString();
	font = font_size + "px basicWoodlands";
	
	ctx.textAlign = 'center'; 
	ctx.textBaseline = 'middle';
	ctx.font = font; 
	ctx.fillStyle = 'white';
	
	ctx.fillText('Sway', c.width * 0.50, c.height * 0.25);
	
	start.draw(); 
	setting.draw(); 
	sfx.draw(); 
	music.draw();
}

function settingScreen(ctx) {
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

	ctx.fillText('S', c.width * 0.75, c.width * 0.10);
	ctx.fillText('M', c.width * 0.90, c.width * 0.10); 

	ctx.font = (c.width * 0.15).toString() + 'px basicWoodlands';
	ctx.fillText('Settings', c.width * 0.50, c.height * 0.350);

	ctx.font = (c.width * 0.07).toString() + 'px basicWoodlands'; 
	ctx.fillText('Clear Score', c.width * 0.50, c.height * 0.55);
	ctx.fillText('OK', c.width * 0.50, c.height * 0.750);
}

function pauseScreen(ctx) {
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

	ctx.fillText('S', c.width * 0.75, c.width * 0.10);
	ctx.fillText('M', c.width * 0.90, c.width * 0.10); 

	ctx.font = (c.width * 0.15).toString() + 'px basicWoodlands';
	ctx.fillText(0, c.width * 0.50, c.height * 0.350);

	ctx.font = (c.width * 0.07).toString() + 'px basicWoodlands'; 
	ctx.fillText('Resume', c.width * 0.50, c.height * 0.55);
	ctx.fillText('Restart', c.width * 0.50, c.height * 0.750);
}

function gameOverScreen(ctx) {
}

document.addEventListener('DOMContentLoaded', init, false); 

setInterval(function() {
	
	ctx.clearRect(0, 0, c.width, c.height); 
	
	c.height = (window.innerHeight - 10) * window.devicePixelRatio; 
	c.width = (window.innerWidth - 10) * window.devicePixelRatio; 
	
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
	}
}, time_interval); 	