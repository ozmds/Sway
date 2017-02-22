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

var playMusicFlag = false; 
var playSFXFlag = true;

var musicButton; 
var sfxButton; 
var startButton; 
var settingButton; 
var clearButton; 
var okButton; 
var pauseResumeButton; 
var pauseRestartButton; 
var gameOverRestartButton; 

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
var kick; 
var piano;

var drum_flag = true; 
var bgm_restart = false; 

var music_counter = -1; 

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
	
	kick = new Howl({
				src: ['data/kick.wav'],
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
	
	logoScreen(); 
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

function logoScreen() {
	var img = new Image();
	img.src = "data/logo.jpg";
	
	var w = c.width * 0.70; 
	var left = c.width * 0.15; 
	var t = (c.height - w) / 2;
	
	ctx.drawImage(img, left, t, w, w); 
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
	
	var font_size = ((c.height * 0.10) * 0.90).toString(); 
	var font = font_size + "px basicWoodlands";
	
	speed = calculateSpeed(c.width / 2, arm.length, PADDING + pen_rad, time_interval, bpm);
	diamond_speed = calculateDiamondSpeed(c.height, bpm, time_interval);

	musicButton = new Button(c.width * 0.675, c.width * 0.125, c.width * 0.15, c.width * 0.15, 
							 PRIMARY_COLOUR, 5, SECONDARY_COLOUR, ctx, font, "M"); 
	sfxButton = new Button(c.width * 0.875, c.width * 0.125, c.width * 0.15, c.width * 0.15, 
							 PRIMARY_COLOUR, 5, SECONDARY_COLOUR, ctx, font, "Fx"); 
	startButton = new Button(c.width / 2, c.height * 0.50, c.width * 0.70, c.height * 0.10, 
							 PRIMARY_COLOUR, 5, SECONDARY_COLOUR, ctx, font, "Start"); 
	settingButton = new Button(c.width / 2, c.height * 0.65, c.width * 0.70, c.height * 0.10, 
							 PRIMARY_COLOUR, 5, SECONDARY_COLOUR, ctx, font, "Setting");
	clearButton = new Button(c.width / 2, c.height * 0.50, c.width * 0.70, c.height * 0.10, 
								 PRIMARY_COLOUR, 5, SECONDARY_COLOUR, ctx, font, "Clear Score");
	okButton = new Button(c.width / 2, c.height * 0.65, c.width * 0.70, c.height * 0.10, 
						PRIMARY_COLOUR, 5, SECONDARY_COLOUR, ctx, font, "OK");
	pauseResumeButton = new Button(c.width / 2, c.height * 0.50, c.width * 0.70, c.height * 0.10, 
								 PRIMARY_COLOUR, 5, SECONDARY_COLOUR, ctx, font, "Resume");
	pauseRestartButton = new Button(c.width / 2, c.height * 0.65, c.width * 0.70, c.height * 0.10, 
						PRIMARY_COLOUR, 5, SECONDARY_COLOUR, ctx, font, "Restart");
	gameOverRestartButton = new Button(c.width / 2, c.height * 0.50, c.width * 0.70, c.height * 0.10, 
								 PRIMARY_COLOUR, 5, SECONDARY_COLOUR, ctx, font, "Restart");							 
}

function handleClick(x, y, piano) { 
	
	switch (state) {
		case START:  
			if (startButton.isClicked(x, y, MARGIN)) {
				state = PLAY; 
				if (playMusicFlag) {
					piano.fade(1.0, 0.0, 60); 
					piano.pause();
					piano.seek(0); 
					bgm_restart = true;
					music_counter = -1; 
				}
			} else if (settingButton.isClicked(x, y, MARGIN)) {
				state = SETTING; 
			} else if (musicButton.isClicked(x, y, MARGIN)) {
				if (playMusicFlag) { 
					piano.pause(); 
				} else {
					piano.play();
				}
				playMusicFlag = !playMusicFlag; 
			} else if (sfxButton.isClicked(x, y, MARGIN)) {
				playSFXFlag = !playSFXFlag;
			}
			break; 
		case SETTING: 
			if (clearButton.isClicked(x, y, MARGIN)) {
				window.localStorage.setItem("highscore", 0);
			} else if (okButton.isClicked(x, y, MARGIN)) {
				state = START; 
			} else if (musicButton.isClicked(x, y, MARGIN)) {
				if (playMusicFlag) {
					piano.pause(); 
				} else {
					piano.play();
				}
				playMusicFlag = !playMusicFlag; 
			} else if (sfxButton.isClicked(x, y, MARGIN)) {
				playSFXFlag = !playSFXFlag;
			}
			break;
		case PAUSE:
			if (pauseResumeButton.isClicked(x, y, MARGIN)) {
				state = PLAY; 
			} else if (pauseRestartButton.isClicked(x, y, MARGIN)) {
				state = START; 
				time_counter = 0; 
				pen.deg = 1.5 * Math.PI; 
				score = 0; 
				diamond_list = [];
			} else if (musicButton.isClicked(x, y, MARGIN)) {
				if (playMusicFlag) {
					piano.pause(); 
				} else {
					piano.play();
				}
				playMusicFlag = !playMusicFlag; 
			} else if (sfxButton.isClicked(x, y, MARGIN)) {
				playSFXFlag = !playSFXFlag;
			}
			break; 
		case GAME_OVER: 
			if (gameOverRestartButton.isClicked(x, y, MARGIN)) {
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

function calculateSpeed(width, arm_length, margin, time_interval, bpm) {
	var time_cycle = (2 * 60000) / bpm;
	
	var span = 2 * Math.asin((width - margin) / arm_length); 

	var num_sections = time_cycle / time_interval;
	
	var deg = span / num_sections; 
	
	return deg;
}

function calculateDiamondSpeed(height, bpm, time_interval) {
	var time_cycle = (4 * 60000) / bpm; 
	
	var num_sections = time_cycle / time_interval; 
	
	var speed = height / num_sections; 
	
	return speed;
}

function updateGame(c, ctx) {
	if (playMusicFlag) {
		if (bgm_restart) {
			piano.play();
			bgm_restart = false;
		}
	} 
	
	drawPauseButton(c.width * 0.05, c.width * 0.05, c.width * 0.10, SECONDARY_COLOUR, ctx);	 
	
	pen.move(speed, arm.length, cen, c, PADDING);

	arm.endX = pen.x; 
	arm.endY = pen.y;
	
	if (playMusicFlag) {
		if (time_counter % 1000 == 0) {
			if (music_counter == 31) {
				music_counter = -1; 
			}
			music_counter += 1; 
			piano.seek(music_counter); 
		}
	}
	
	if (time_counter == 2000) {
		time_counter = 0; 
		d = new Diamond(c.width * 0.04, SECONDARY_COLOUR, ctx);
		/* d.place(arm.length, c.width, pen_rad); */ 
		d.y = -1 * (pen_rad + PADDING); 
		d.x = c.width / 2; 
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
				if (drum_flag) {
					kick.play(); 
				} else {
					snare.play(); 
				}
			drum_flag = !drum_flag;
			}
		} else {
			diamond_list[i].draw(); 
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
			logoScreen(); 
			break;
		case START: 
			startScreen(c, ctx, musicButton, sfxButton, startButton, settingButton, playSFXFlag, playMusicFlag); 
			break; 
		case SETTING:
			settingScreen(c, ctx, musicButton, sfxButton, clearButton, okButton, playSFXFlag, playMusicFlag); 
			break;
		case PAUSE:
			pauseScreen(c, ctx, musicButton, sfxButton, pauseResumeButton, pauseRestartButton, score, playSFXFlag, playMusicFlag); 
			break; 
		case GAME_OVER:
			gameOverScreen(c, ctx, gameOverRestartButton, score); 
			break;
		case PLAY:
			updateGame(c, ctx); 
	}
	
}, time_interval); 
