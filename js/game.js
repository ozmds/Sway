var m1; 
var m2; 
var sectX; 
var sectY; 

function lineIntersect(x1, y1, x2, y2, x3, y3, x4, y4, c, ctx) {
	y1 = c.height - y1; 
	y2 = c.height - y2; 
	y3 = c.height - y3; 
	y4 = c.height - y4; 
	m1 = (y2 - y1) / (x2 - x1); 
	m2 = (y4 - y3) / (x4 - x3); 
	
	sectX = ((-1 * m2 * x3) + y3 - ((-1 * m1 * x1) + y1)) / (m1 - m2);
	sectY = (m1 * sectX) + ((-1 * m1 *x1) + y1);  
	
	/*
	ctx.beginPath(); 
	ctx.moveTo(x1, c.height - y1); 
	ctx.lineTo(sectX, c.height - sectY); 
	ctx.stroke();
	ctx.closePath();
	*/

	if (sectX >= Math.min(x3, x4)) {
		if (sectX <= Math.max(x3, x4)) {
			if (sectX >= Math.min(x1, x2)) {
				if (sectX <= Math.max(x1, x2)) {
					/*
					window.alert("cen.x: " + x1.toString() + "\n" + 
							 "cen.y: " + y1.toString() + "\n" + 
							 "pen.x: " + x2.toString() + "\n" + 
							 "pen.y: " + y2.toString() + "\n" + 
							 "x3: " + x3.toString() + "\n" + 
							 "y3: " + y3.toString() + "\n" + 
							 "x4: " + x4.toString() + "\n" + 
							 "y4: " + y4.toString() + "\n" +
							 "m1: " + m1.toString() + "\n" + 
							 "m2: " + m2.toString() + "\n" + 
							 "sectX: " + sectX.toString() + "\n" + 
							 "sectY: " + sectY.toString() + "\n");
					*/
					return true;
				}
			}
		}
	}
	
	return false;
}

function lineHitBox(arm, d, c, ctx) {
	if (lineIntersect(arm.startX, arm.startY, arm.endX, arm.endY, d.x, d.y - d.r, d.x + d.r, d.y, c, ctx)) {
		return true; 
	}
	if (lineIntersect(arm.startX, arm.startY, arm.endX, arm.endY, d.x, d.y - d.r, d.x - d.r, d.y, c, ctx)) {
		return true; 
	}
	if (lineIntersect(arm.startX, arm.startY, arm.endX, arm.endY, d.x, d.y + d.r, d.x + d.r, d.y, c, ctx)) {
		return true; 
	}
	if (lineIntersect(arm.startX, arm.startY, arm.endX, arm.endY, d.x, d.y + d.r, d.x - d.r, d.y, c, ctx)) {
		return true; 
	}
	return false; 
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