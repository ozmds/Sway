const PRIMARY_COLOUR = '#123444';
const SECONDARY_COLOUR = '#FFFFFF';  
const MARGIN = 5;
const PADDING = 10;  

const SETTING = 'setting'; 
const PAUSE = 'pause'; 
const PLAY = 'play'; 
const GAME_OVER = 'gameOver'; 
const START = 'start';
const LOGO = 'logo'; 

var c; 
var ctx; 
var state = LOGO; 
var time_interval = 20;
var score = 0; 
var bpm = 120; 

var buttonList; 

var playMusicFlag = false; 
var playSFXFlag = true; 

var pen_rad; 
var cen_height; 

var arm; 
var cen; 
var pen; 
var arm_length; 

var d;
var diamond_list = [];

var speed;

var time_counter = 0;  
var diamond_speed; 

var cHeight;

var snare; 
var piano;

function init() {
	piano = new Howl({ 
				src: ['data/piano.wav'], 
				autoplay: false,
				loop: true
			});
	
	snare = new Howl({
				src: ['data/snare.wav'], 
				autoplay: false,
				loop: false
			});
	
	if (playMusicFlag) {
		piano.play();
	}
	
	c = document.getElementById('myCanvas'); 
	ctx = c.getContext('2d');  
	
	c.style.top = (MARGIN).toString() + "px"
	c.style.left = (MARGIN).toString() + "px"; 

	initBackground(c); 
	
	if (window.localStorage.getItem("highscore") == null) {
		window.localStorage.setItem("highscore", score); 
	}
	
	setUpGame(c); 
	
	c.addEventListener('click', function(event) {handleClick(event.x * window.devicePixelRatio, event.y * window.devicePixelRatio, piano);});
	
	logoScreen(c, ctx); 
}	

function initBackground(c) {
	c.height = (window.innerHeight - 10) * window.devicePixelRatio; 
	c.width = (window.innerWidth - 10) * window.devicePixelRatio; 
	
	c.style.width = (c.width / window.devicePixelRatio).toString() + "px"; 
	c.style.height = (c.height / window.devicePixelRatio).toString() + "px";
	
	document.body.style.backgroundColor = PRIMARY_COLOUR;
	c.style.backgroundColor = PRIMARY_COLOUR;
	
	if (state != LOGO) {
		c.style.border = (1.5).toString() + "px solid " + SECONDARY_COLOUR;
	}
}

function setUpGame(c) { 
	cHeight = c.height;

	cen_height = 0.60; 
	pen_rad = c.width * 0.075;

	var cen_x = c.width / 2;
	var cen_y = c.height * cen_height; 
	
	var pen_x = c.width / 2; 
	var pen_y = c.height - (pen_rad + PADDING); 
	
	arm = new Line(cen_x, cen_y, pen_x, pen_y, 7, SECONDARY_COLOUR, ctx); 
	cen = new Circle(cen_x, cen_y, pen_rad / 2, PRIMARY_COLOUR, 5, SECONDARY_COLOUR, ctx); 
	pen = new Circle(pen_x, pen_y, pen_rad, PRIMARY_COLOUR, 10, SECONDARY_COLOUR, ctx); 
	
	speed = calculateSpeed(c.width / 2, arm.length, PADDING + pen_rad, time_interval, bpm);
	diamond_speed = calculateDiamondSpeed(c.height, bpm, time_interval);

	buttonList = createButtonList(c, ctx, PRIMARY_COLOUR, SECONDARY_COLOUR); 
}

function flipMusic(musFlag, music) {
	if (musFlag) {
		music.pause(); 
	} else {
		music.play(); 
	}
}

function handleClick(x, y, piano) { 
	
	switch (state) {
		case START:  
			if (buttonList["startButton"].isClicked(x, y, MARGIN)) {
				state = PLAY; 
			} else if (buttonList["settingButton"].isClicked(x, y, MARGIN)) {
				state = SETTING; 
			} else if (buttonList["musicButton"].isClicked(x, y, MARGIN)) {
				flipMusic(playMusicFlag, piano); 
				playMusicFlag = !playMusicFlag; 
			} else if (buttonList["sfxButton"].isClicked(x, y, MARGIN)) {
				playSFXFlag = !playSFXFlag;
			}
			break; 
		case SETTING: 
			if (buttonList["clearButton"].isClicked(x, y, MARGIN)) {
				window.localStorage.setItem("highscore", 0);
			} else if (buttonList["okButton"].isClicked(x, y, MARGIN)) {
				state = START; 
			} else if (buttonList["musicButton"].isClicked(x, y, MARGIN)) {
				flipMusic(playMusicFlag, piano);
				playMusicFlag = !playMusicFlag; 
			} else if (buttonList["sfxButton"].isClicked(x, y, MARGIN)) {
				playSFXFlag = !playSFXFlag;
			}
			break;
		case PAUSE:
			if (buttonList["pauseResumeButton"].isClicked(x, y, MARGIN)) {
				state = PLAY; 
			} else if (buttonList["pauseRestartButton"].isClicked(x, y, MARGIN)) {
				state = START; 
				time_counter = 0; 
				pen.deg = 1.5 * Math.PI; 
				score = 0; 
				diamond_list = [];
			} else if (buttonList["musicButton"].isClicked(x, y, MARGIN)) {
				flipMusic(playMusicFlag, piano);
				playMusicFlag = !playMusicFlag; 
			} else if (buttonList["sfxButton"].isClicked(x, y, MARGIN)) {
				playSFXFlag = !playSFXFlag;
			}
			break; 
		case GAME_OVER: 
			if (buttonList["gameOverRestartButton"].isClicked(x, y, MARGIN)) {
				state = START; 
				time_counter = 0; 
				pen.deg = 1.5 * Math.PI; 
				score = 0; 
				diamond_list = []; 
			}
			break;
		case PLAY:	
			if (pauseClicked(x, y, c.width * 0.05, c.width * 0.05, c.width * 0.15, c.width * 0.15, MARGIN)) {
				state = PAUSE; 
			} else {
				pen.going_left = !pen.going_left; 
			}
	}
}

function updateGame(c, ctx) {
	
	drawPauseButton(c.width * 0.05, c.width * 0.05, c.width * 0.10, SECONDARY_COLOUR, ctx);
	
	pen.move(speed, arm.length, cen, c, PADDING);

	arm.endX = pen.x; 
	arm.endY = pen.y;
	
	if (time_counter == 2000) {
		time_counter = 0; 
		d = new Diamond(c.width * 0.04, SECONDARY_COLOUR, ctx);
		d.place(arm.length, c.width, pen_rad); 
		diamond_list.push(d); 
	}
	
	time_counter += time_interval;
	
	for (i = 0; i < diamond_list.length; i++) {
		var res = diamond_list[i].move(diamond_speed, c.height, state, pen); 
		
		if (res == 'over') {
			state = GAME_OVER; 
			break;
		} else if (res == 'score') {
			score += 1; 
			diamond_list.splice(i, 1); 
			if (playSFXFlag) {
				snare.play(); 
			}
		} else {
			diamond_list[i].draw();
			diamond_list[i].fill(); 
		}
	}
	
	arm.draw(); 
	cen.draw();
	pen.draw(); 
	
	if (window.localStorage.getItem("highscore") < score) {
		window.localStorage.setItem("highscore", score); 
	}
	updateScore(c, ctx, score, window.localStorage.getItem("highscore"), SECONDARY_COLOUR);
}

document.addEventListener('DOMContentLoaded', init, false); 

setInterval(function() {
	
	ctx.clearRect(0, 0, c.width, c.height);
	
	initBackground(c);

	if (cHeight != c.height) {
		setUpGame(c); 
		cHeight = c.height;
	}
	
	if (state == LOGO) {
		time_counter += time_interval; 
		if (time_counter == 5000) {
			time_counter = 0; 
			state = START; 
		}
	}
	
	switch (state) {
		case LOGO:
			logoScreen(c, ctx); 
			break;
		case START: 
			startScreen(c, ctx, buttonList, playSFXFlag, playMusicFlag); 
			break; 
		case SETTING:
			settingScreen(c, ctx, buttonList, playSFXFlag, playMusicFlag); 
			break;
		case PAUSE:
			pauseScreen(c, ctx, buttonList, score, playSFXFlag, playMusicFlag); 
			break; 
		case GAME_OVER:
			gameOverScreen(c, ctx, buttonList, score); 
			break;
		case PLAY:
			updateGame(c, ctx); 
	}
	
}, time_interval); 