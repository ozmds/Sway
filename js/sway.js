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

const NORMAL = "#FFFFCC";
const POISON = "#9900CC"; 
const BALLOON = "#FF6666";
const RAIN = "#3399FF"; 
const METAL = "#999966"; 
const WALL = "#FFFF66"; 

const MAX_PEN_BPM = 200; 
const MAX_DIAMOND_BPM = 200;  
const MIN_PEN_BPM = 100; 
const MIN_DIAMOND_BPM = 60; 

const BALLOON_TIME = 15; 
const RAIN_TIME = 15; 
const METAL_TIME = 15;

var c; 
var ctx; 

var state = LOGO;

var score = 0; 
var time_interval = 20;
var time_counter = 0;  

var pen_bpm = MIN_PEN_BPM; 
var diamond_bpm = MIN_DIAMOND_BPM; 
var speed;
var diamond_speed;

var buttonList; 

var playMusicFlag = false; 
var playSFXFlag = true; 
var increment_speed_flag = false; 

var balloon_flag = false;
var balloon_timer = 0;

var rain_flag = false; 
var rain_timer = 0;   

var metal_flag = false;
var metal_timer = 0; 
var metal_cen_flag = false; 

var pen_rad; 
var cen_height; 

var arm; 
var cen;
var pen;  

var d;
var diamond_list = []; 

var snare; 
var piano;

var typeInt;
var diamondType; 

var cHeight;

var circle_paint_counter = 0; 
var reverse_flag = false; 

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
				speed = 100; 
				diamond_speed = 60; 
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
				speed = 100; 
				diamond_speed = 60;
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
	
	if (increment_speed_flag) {
		if (pen_bpm < MAX_PEN_BPM) {
			pen_bpm += 10; 
		}
		if (diamond_bpm < MAX_DIAMOND_BPM) {
			diamond_bpm += 10;
		}
		increment_speed_flag = false; 
	}

	if (balloon_flag) {
		if (balloon_timer > BALLOON_TIME * 1000) {
			if (pen.r > c.width * 0.075) {
				pen.r -= pen.r * 0.01; 
				arm.length += pen.r * 0.01; 
			} else {
				balloon_flag = false; 
				balloon_timer = 0; 
			}
		} else if (pen.r < c.width * 0.15) {
			pen.r += pen.r * 0.01; 
			arm.length -= pen.r * 0.01;
		} else {
			balloon_timer += time_interval; 
		}
	}
	
	if (rain_flag) {
		if (rain_timer > RAIN_TIME * 1000) {
			diamond_speed = diamond_speed * 2; 
			rain_timer = 0; 
			rain_flag = false; 
		} else if (rain_timer == 0) {
			diamond_speed = diamond_speed / 2; 
			rain_timer += time_interval; 
		} else {
			rain_timer += time_interval;
		}
	}

	speed = calculateSpeed(c.width / 2, arm.length, PADDING + pen_rad, time_interval, pen_bpm);
	if (!rain_flag) {
		diamond_speed = calculateDiamondSpeed(c.height, diamond_bpm, time_interval);
	}
	
	pen.move(speed, arm.length, cen, c, PADDING);

	arm.endX = pen.x; 
	arm.endY = pen.y;
	
	if (time_counter == 2000) {
		time_counter = 0;
		typeInt = Math.random() * 100; 
		if (typeInt < 70) {
			diamondType = NORMAL; 
		} else if (typeInt < 80) {
			diamondType = POISON;
		} else if (typeInt < 88) {
			diamondType = BALLOON; 
		} else if (typeInt < 94) {
			diamondType = RAIN; 
		} else if (typeInt < 98) {
			diamondType = METAL; 
		} else {
			diamondType = WALL;
		}
		
		d = new Diamond(diamondType, c.width * 0.03, SECONDARY_COLOUR, ctx);
		d.place(arm.length, c.width, pen_rad); 
		diamond_list.push(d); 
	}
	
	time_counter += time_interval;
	
	for (i = 0; i < diamond_list.length; i++) {
		var res = diamond_list[i].move(diamond_speed, c.height, state, pen); 
		
		if (metal_flag) {
			if (lineHitBox(arm, diamond_list[i], c, ctx)) {
				metal_cen_flag = true; 
			} else {
				metal_cen_flag = diamond_list[i].checkHitBox(cen.x, cen.y, cen.r);
			}
		} else {
			metal_cen_flag = false; 
		}
		
		if (res == 'over') {
			if (diamond_list[i].fillColour != POISON) {
				state = GAME_OVER; 
				break;
			} else {
				diamond_list.splice(i, 1);
			}
		} else if (res == 'score' || metal_cen_flag) {
			score += 1; 
			if (score % 10 == 0) {
				increment_speed_flag = true; 
			} 
			if (diamond_list[i].fillColour == POISON) {
				state = GAME_OVER; 
			} else if (diamond_list[i].fillColour == BALLOON) {
				balloon_flag = true; 
			} else if (diamond_list[i].fillColour == RAIN) {
				rain_flag = true; 
			} else if (diamond_list[i].fillColour == METAL) {
				metal_flag = true; 
			}
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
	
	if (metal_flag) {
		ctx.strokeStyle = METAL; 
		ctx.fillStyle = PRIMARY_COLOUR;
	
		if (circle_paint_counter > 100) {
			if (circle_paint_counter > 200) {
				ctx.lineWidth = arm.width;
				
				ctx.beginPath(); 
				ctx.moveTo(arm.endX - ((arm.endX - arm.startX) / 100 * (circle_paint_counter - 200)),
						   arm.endY - ((arm.endY - arm.startY) / 100 * (circle_paint_counter - 200))); 
				ctx.lineTo(arm.endX, arm.endY);
				ctx.stroke();
				ctx.closePath(); 
			}
			
			ctx.lineWidth = cen.outWidth; 
			
			ctx.beginPath(); 
			ctx.arc(cen.x, cen.y, cen.r, 0.0 * Math.PI, (circle_paint_counter - 100) * (2.0 * Math.PI / 100));
			ctx.fill(); 
			ctx.stroke(); 
			ctx.closePath();
		} 
		ctx.lineWidth = pen.outWidth;
		
		ctx.beginPath(); 
		ctx.arc(pen.x, pen.y, pen.r, 0.0 * Math.PI, circle_paint_counter * (2.0 * Math.PI / 100));
		ctx.fill(); 
		ctx.stroke(); 
		ctx.closePath();
		
		if (circle_paint_counter == 300) {
			metal_timer += time_interval; 
		}
		
		if (metal_timer > METAL_TIME * 1000) {
			reverse_flag = true; 
		}
		
		if (reverse_flag) {
			if (circle_paint_counter != 0) {
				circle_paint_counter -= 1; 
			} else {
				reverse_flag = false; 
				metal_flag = false; 
				metal_timer = 0; 
			}
		} else {
			if (circle_paint_counter < 300) {
				circle_paint_counter += 1;
			}
		}
	}
	
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