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

function updateScore(c, ctx, score, highscore, colour) {
	ctx.textBaseline = 'middle'; 
	ctx.textAlign = 'end'; 
	ctx.fillStyle = colour; 
	
	var font_size = c.width * 0.10; 
	var font = font_size.toString() + "px basicWoodlands";

	ctx.font = font; 
	
	ctx.fillText(score, c.width * 0.95, c.width * 0.05);
	ctx.fillText(highscore, c.width * 0.95, c.width * 0.13); 
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