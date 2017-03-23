document.addEventListener('DOMContentLoaded', init, false);

const MARGIN = 5;
const PADDING = 10;

const PRIMARY_COLOUR = '#123444';
const SECONDARY_COLOUR = '#FFFFFF';

const LOGO = 'logo';
const SETTING = 'setting';
const PAUSE = 'pause';
const PLAY = 'play';
const GAME_OVER = 'gameOver';
const START = 'start';

const TIME_INTERVAL = 20;

var state = LOGO;

var c;
var ctx;

var score;

var bgmusic;
var soundfx;

var screen_list;

var img;

var old_height;

var time_counter = 0;

class Sound {
	constructor(source, loopflag) {
		this.src = new Howl({
						src: [source],
						autoplay: false, 
						loop: loopflag
					});
		this.pFlag = true;
	}
	
	play() {
		if (this.pFlag) {
			this.src.play();
		}
	}

	flip() {
		this.pFlag = !this.pFlag;
	}
}

function init(bgmusic, soundfx, c, ctx, score) {
	bgmusic = new Sound('data/piano.wav', true);
	soundfx = new Sound('data/snare.wav', false);
	
	bgmusic.play();
	
	c = document.getElementById('myCanvas');
	ctx = c.getContext('2d');
	
	c.style.top = (MARGIN).toString() + 'px';
	c.style.left = (MARGIN).toString() + 'px';
	
	initBackground(c, state);
	
	if (window.localStorage.getItem('highscore') == null) {
		window.localStorage.setItem('highscore', score);
	}
	
	c.addEventListener('click', function(event) {handleClick(event.x * 
		window.devicePixelRatio, event.y * window.devicePixelRatio, 
		bgmusic, soundfx);});
	
	setUpGame(c, ctx); 
	
	run(c, ctx, old_height, state, time_counter, screen_list);
}

function run(c, ctx, old_height, state, time_counter, screen_list) {
	
	ctx.clearRect(0, 0, c.width, c.height);
	
	initBackground(c, state);
	
	if (old_height != c.height) {
		setUpGame(c, ctx);
		old_height = c.height;
	}
	
	if (state == LOGO) {
		time_counter += TIME_INTERVAL;
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
			screen_list[0].draw();
			break;
		case SETTING:
			screen_list[1].draw();
			break;
		case PAUSE:
			screen_list[2].draw();
			break;
		case GAME_OVER:
			screen_list[3].draw();
			break;
		case PLAY:
			break;
	}
}

function initBackground(c, state) {
	c.height = (window.innerHeight - 10) * window.devicePixelRatio;
	c.width = (window.innerWidth - 10) * window.devicePixelRatio;
	
	c.style.width = (c.width / window.devicePixelRatio).toString() + 'px';
	c.style.height = (c.height / window.devicePixelRatio).toString() + 'px';
	
	document.body.style.backgroundColor = PRIMARY_COLOUR;
	c.style.backgroundColor = PRIMARY_COLOUR;
	
	if (state != LOGO) {
		c.style.border = (1.5).toString() + 'px solid ' + SECONDARY_COLOUR;
	}
}

function setUpGame(c, ctx) {
	old_height = c.height;
	
	var cen_height = 0.60;
	var pen_rad = c.width * 0.075;
	
	var cen_x = c.width / 2;
	var cen_y = c.height * cen_height;
	
	var pen_x = c.width / 2;
	var pen_y = c.height - (pen_rad + PADDING);
	
	/*
	var arm = new Line(cen_x, cen_y, pen_x, pen_y, 7, SECONDARY_COLOUR, ctx);
	var cen = new Circle();
	var pen = new Circle();
	*/
	
	screen_list = createAllButtons(c, ctx, score);
	
}

function createAllButtons(c, ctx, score) {
	var button_list = [];
	
	var font_size = ((c.height * 0.10) * 0.90).toString();
	var font = font_size + 'px basicWoodlands';
	
	var musicButton	= new Button(c.width * 0.675, c.width * 0.125, 
										   c.width * 0.15, c.width * 0.15, 
										   PRIMARY_COLOUR, 5, SECONDARY_COLOUR, 
										   ctx, font, "M", "musicButton"); 
	window.alert('batman');
	var sfxButton             = new Button(c.width * 0.875, c.width * 0.125, 
										   c.width * 0.15, c.width * 0.15, 
										   PRIMARY_COLOUR, 5, SECONDARY_COLOUR, 
										   ctx, font, "Fx", "sfxButton"); 
	window.alert('batman');
	var startButton           = new Button(c.width / 2, c.height * 0.50, 
										   c.width * 0.70, c.height * 0.10, 
										   PRIMARY_COLOUR, 5, SECONDARY_COLOUR, 
										   ctx, font, "Start", "startButton"); 
	var settingButton         = new Button(c.width / 2, c.height * 0.65, 
										   c.width * 0.70, c.height * 0.10, 
										   PRIMARY_COLOUR, 5, SECONDARY_COLOUR, 
										   ctx, font, "Setting", "settingButton");
	var clearButton           = new Button(c.width / 2, c.height * 0.50, 
										   c.width * 0.70, c.height * 0.10, 
										   PRIMARY_COLOUR, 5, SECONDARY_COLOUR, 
										   ctx, font, "Clear Score", "clearButton");
	var okButton              = new Button(c.width / 2, c.height * 0.65, 
										   c.width * 0.70, c.height * 0.10, 
										   PRIMARY_COLOUR, 5, SECONDARY_COLOUR, 
										   ctx, font, "OK", "okButton");
	var pauseResumeButton     = new Button(c.width / 2, c.height * 0.50, 
										   c.width * 0.70, c.height * 0.10, 
										   PRIMARY_COLOUR, 5, SECONDARY_COLOUR, 
										   ctx, font, "Resume", "pauseResumeButton");
	var pauseRestartButton    = new Button(c.width / 2, c.height * 0.65, 
										   c.width * 0.70, c.height * 0.10, 
										   PRIMARY_COLOUR, 5, SECONDARY_COLOUR, 
										   ctx, font, "Restart", "pauseRestartButton");
	var gameOverRestartButton = new Button(c.width / 2, c.height * 0.50, 
										   c.width * 0.70, c.height * 0.10, 
										   PRIMARY_COLOUR, 5, SECONDARY_COLOUR, 
										   ctx, font, "Restart", "gameOverRestartButton");
	
	button_list = [];
	button_list.push(musicButton);
	button_list.push(sfxButton);
	button_list.push(startButton);
	button_list.push(settingButton);
	
	var startScreen = new Screen('start', 'Sway', button_list, ctx, c);
	
	button_list = [];
	button_list.push(musicButton);
	button_list.push(sfxButton);
	button_list.push(clearButton);
	button_list.push(okButton);
	
	var settingScreen = new Screen('setting', 'Setting', button_list, ctx, c);
	
	button_list = [];
	button_list.push(musicButton);
	button_list.push(sfxButton);
	button_list.push(pauseResumeButton);
	button_list.push(pauseRestartButton);
	
	var pauseScreen = new Screen('pause', score, button_list, ctx, c);
	
	button_list = [];
	button_list.push(gameOverRestartButton);
	
	var restartScreen = new Screen('restart', score, button_list, ctx, c);
	
	var screen_list = [];
	screen_list.push(startScreen);
	screen_list.push(settingScreen);
	screen_list.push(pauseScreen);
	screen_list.push(restartScreen);
	
	return screen_list;
}

function startHandle(x, y, music, sfx) {
	switch (startScreen.handleClick(x, y, PADDING)) {
		case 'startButton':
			state = PLAY;
			break;
		case 'settingButton':
			state = SETTING;
			break;
		case 'musicButton':
			music.flip();
			music.play();
			break;
		case 'sfxButton':
			sfx.flip();
			sfx.play();
	}
}

function settingHandle(x, y, music, sfx) {
	switch(settingScreen.handleClick(x, y, PADDING)) {
		case 'clearButton':
			window.localStorage.setItem('highscore', 0);
			break;
		case 'okButton':
			state = START;
			break;
		case 'musicButton':
			music.flip();
			music.play();
			break;
		case 'sfxButton':
			sfx.flip();
			sfx.play();
	}
}

function pauseHandle(x, y, music, sfx) {
	switch(pauseScreen.handleClick(x, y, PADDING)) {
		case 'pauseResumeButton':
			state = PLAY;
			break;
		case 'pauseRestartButton':
			state = START;
			break;
		case 'musicButton':
			music.flip();
			music.play();
			break;
		case 'sfxButton':
			sfx.flip();
			sfx.play();
			break;
	}
}

function overHandle(x, y) {
	switch(restartScreen.handleClick(x, y, PADDING)) {
		case 'gameOverRestartButton':
			state = START;
			break;
	}
}

function handleClick(x, y, music, sfx) {
	switch (state) {
		case START:
			startHandle(x, y, music, sfx);
			break;
		case SETTING:
			settingHandle(x, y, music, sfx);
			break;
		case PAUSE:
			pauseHandle(x, y, music, sfx);
			break;
		case GAME_OVER:
			overHandle(x, y);
			break;
		case PLAY:
			break;
	}
}

function logoScreen(c, ctx) {
	img = new Image();
	img.src = 'data/logo.jpg';
	
	ctx.drawImage(img, c.width * 0.15, (c.height - c.width * 0.70) / 2,
					c.width * 0.70, c.width * 0.70);
}