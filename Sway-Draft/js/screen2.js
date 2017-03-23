

class Button {
	constructor(x, y, width, height, colour, outWidth, outColour, context, font, title, name) {
		this.x = x; 
		this.y = y; 
		this.width = width; 
		this.height = height; 
		this.colour = colour; 
		this.outWidth = outWidth;
		this.outColour = outColour;
		this.font = font;
		this.title = title; 
		this.context = context; 
		this.name = name;
	}
	
	draw() {
		var ctx = this.context; 
		
		ctx.fillStyle = this.colour; 
		ctx.lineWidth = this.outWidth; 
		ctx.strokeStyle = this.outColour; 
		
		ctx.beginPath(); 
		ctx.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
		ctx.fill(); 
		ctx.stroke(); 
		ctx.closePath();
		
		ctx.textAlign = 'center'; 
		ctx.textBaseline = 'middle';
		ctx.font = this.font; 
		ctx.fillStyle = this.outColour;
		
		ctx.fillText(this.title, this.x, this.y - this.height * 0.20);  
	}
	
	isClicked(eventX, eventY, padding) {
		if (eventX > this.x - this.width / 2 + padding) {
			if (eventX < this.x + this.width / 2 + padding) {
				if (eventY > this.y - this.height / 2 + padding) {
					if (eventY < this.y + this.height / 2 + padding) {
						return true; 
					}
				}
			}
		}
		
		return false; 
	}
	
	drawCross() {
		this.context.strokeStyle = this.outColour; 
		this.context.lineWidth = this.outWidth;
		
		this.context.beginPath(); 
		this.context.moveTo(this.x - this.width / 2, this.y - this.height / 2); 
		this.context.lineTo(this.x + this.width / 2, this.y + this.height / 2); 
		this.context.stroke(); 
		this.context.closePath();
		
		this.context.beginPath();
		this.context.moveTo(this.x + this.width / 2, this.y - this.height / 2); 
		this.context.lineTo(this.x - this.width / 2, this.y + this.height / 2); 
		this.context.stroke(); 
		this.context.closePath(); 
	}
}

function createButtonList(c, ctx, PRIMARY_COLOUR, SECONDARY_COLOUR) {
	var button_list = {}; 
	
	var font_size = ((c.height * 0.10) * 0.90).toString(); 
	var font = font_size + "px basicWoodlands";
	
	var musicButton           = new Button(c.width * 0.675, c.width * 0.125, 
										   c.width * 0.15, c.width * 0.15, 
										   PRIMARY_COLOUR, 5, SECONDARY_COLOUR, 
										   ctx, font, "M", "musicButton"); 
	var sfxButton             = new Button(c.width * 0.875, c.width * 0.125, 
										   c.width * 0.15, c.width * 0.15, 
										   PRIMARY_COLOUR, 5, SECONDARY_COLOUR, 
										   ctx, font, "Fx", "sfxButton"); 
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
	
	button_list["musicButton"] = musicButton; 
	button_list["sfxButton"] = sfxButton; 
	button_list["startButton"] = startButton; 
	button_list["settingButton"] = settingButton; 
	button_list["clearButton"] = clearButton; 
	button_list["okButton"] = okButton; 
	button_list["pauseResumeButton"] = pauseResumeButton; 
	button_list["pauseRestartButton"] = pauseRestartButton; 
	button_list["gameOverRestartButton"] = gameOverRestartButton;
	
	return button_list; 
}

function writeText(str, x, y, font_size, font, colour, context) {
	var f_size = font_size.toString(); 
	var f = f_size + "px " + font; 
	
	context.textAlign = 'center'; 
	context.textBaseline = 'middle'; 
	context.font = f; 
	context.fillStyle = colour; 
	
	context.fillText(str, x, y); 
}

function controlMusic(sfx, mus, button_list) {
	if (!sfx) {
		button_list["sfxButton"].drawCross(); 
	}
	if (!mus) {
		button_list["musicButton"].drawCross(); 
	}
}

function startScreen(c, ctx, button_list, sfx, mus) { 
	writeText('Sway', c.width * 0.50, c.height * 0.25, c.height * 0.15, 'basicWoodlands', SECONDARY_COLOUR, ctx); 
	
	button_list["sfxButton"].draw(); 
	button_list["musicButton"].draw(); 
	button_list["startButton"].draw(); 
	button_list["settingButton"].draw(); 
	
	controlMusic(sfx, mus, button_list); 
}

function settingScreen(c, ctx, button_list, sfx, mus) {
	writeText('Setting', c.width * 0.50, c.height * 0.25, c.height * 0.15, 'basicWoodlands', SECONDARY_COLOUR, ctx); 
	
	button_list["sfxButton"].draw(); 
	button_list["musicButton"].draw();
	button_list["clearButton"].draw(); 
	button_list["okButton"].draw(); 
	
	controlMusic(sfx, mus, button_list);
}

function pauseScreen(c, ctx, button_list, score, sfx, mus) {
	writeText(score, c.width * 0.50, c.height * 0.25, c.height * 0.15, 'basicWoodlands', SECONDARY_COLOUR, ctx); 
	
	button_list["sfxButton"].draw(); 
	button_list["musicButton"].draw(); 
	button_list["pauseResumeButton"].draw(); 
	button_list["pauseRestartButton"].draw(); 
	
	controlMusic(sfx, mus, button_list);
}

function gameOverScreen(c, ctx, button_list, score) {
	writeText(score, c.width * 0.50, c.height * 0.25, c.height * 0.15, 'basicWoodlands', SECONDARY_COLOUR, ctx); 
	 
	button_list["gameOverRestartButton"].draw(); 
}

function logoScreen(c, ctx) {
	var img = new Image();
	img.src = "data/logo.jpg";
	
	var w = c.width * 0.70; 
	var left = c.width * 0.15; 
	var t = (c.height - w) / 2;
	
	ctx.drawImage(img, left, t, w, w); 
}