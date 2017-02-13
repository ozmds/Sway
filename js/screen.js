function writeText(str, x, y, font_size, font, colour, context) {
	var f_size = font_size.toString(); 
	var f = f_size + "px " + font; 
	
	context.textAlign = 'center'; 
	context.textBaseline = 'middle'; 
	context.font = f; 
	context.fillStyle = colour; 
	
	context.fillText(str, x, y); 
}

function drawPauseButton(x, y, side_len, colour, context) {
	var bar_width = side_len / 3; 
	context.fillStyle = colour; 
	
	context.fillRect(x, y, bar_width, side_len); 
	context.fillRect(x + 2 * bar_width, y, bar_width, side_len); 
}

function pauseClicked(x, y, x1, y1, x2, y2, mar) {
	if (x > x1 + mar) {
		if (x < x2 + mar) {
			if (y > y1 + mar) {
				if (y < y2 + mar) {
					return true; 
				}
			}
		}
	}
	
	return false; 
}

function updateScore(c, ctx, score, highscore, ex, ey, colour) {
	ctx.textBaseline = 'middle'; 
	ctx.textAlign = 'end'; 
	ctx.fillStyle = colour; 
	
	var font_size = c.width * 0.10; 
	var font = font_size.toString() + "px basicWoodlands";

	ctx.font = font; 
	
	ctx.fillText(score, c.width * 0.95, c.width * 0.05);
	ctx.fillText(highscore, c.width * 0.95, c.width * 0.13);

	ctx.fillText(ex, c.width * 0.95, c.width * 0.21); 
	ctx.fillText(ey, c.width * 0.95, c.width * 0.29); 
}

function startScreen(c, ctx, b1, b2, b3, b4, sfx, mus) { 
	writeText('Sway', c.width * 0.50, c.height * 0.25, c.height * 0.15, 'basicWoodlands', SECONDARY_COLOUR, ctx); 
	
	b1.draw(); 
	b2.draw(); 
	b3.draw(); 
	b4.draw(); 
	
	if (!sfx) {
		b2.drawCross(); 
	}
	if (!mus) {
		b1.drawCross(); 
	}
}

function settingScreen(c, ctx, b1, b2, b3, b4, sfx, mus) {
	writeText('Setting', c.width * 0.50, c.height * 0.25, c.height * 0.15, 'basicWoodlands', SECONDARY_COLOUR, ctx); 
	
	b1.draw();
	b2.draw(); 
	b3.draw(); 
	b4.draw(); 
	
	if (!sfx) {
		b2.drawCross(); 
	}
	if (!mus) {
		b1.drawCross(); 
	}
}

function pauseScreen(c, ctx, b1, b2, b3, b4, score, sfx, mus) {
	writeText(score, c.width * 0.50, c.height * 0.25, c.height * 0.15, 'basicWoodlands', SECONDARY_COLOUR, ctx); 
	
	b1.draw(); 
	b2.draw(); 
	b3.draw(); 
	b4.draw(); 
	
	if (!sfx) {
		b2.drawCross(); 
	}
	if (!mus) {
		b1.drawCross(); 
	}
}

function gameOverScreen(c, ctx, b1, score) {
	writeText(score, c.width * 0.50, c.height * 0.25, c.height * 0.15, 'basicWoodlands', SECONDARY_COLOUR, ctx); 
	 
	b1.draw(); 
}