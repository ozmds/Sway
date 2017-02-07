function toRadians (angle) {
	return angle * (Math.PI / 180); 
}

function checkHitbox (x1, y1, x2, y2, r) {
	var x = Math.pow(x1 - x2, 2); 
	var y = Math.pow(y1 - y2, 2);

	if (x + y < Math.pow(r, 2)) {
		return true; 
	}
	
	return false; 
}

function centeredRect (x, y, width, height, outWidth, outColour, context) {
	context.strokeStyle = outColour; 
	context.lineWidth = outWidth;
	
	context.beginPath(); 
	context.rect(x - width / 2, y - height / 2, width, height); 
	context.stroke(); 
}

function checkHitWall (x, y, maxX, maxY, r, pad) {
	if (x < (r + pad)) {
		return true;
	} else if (x > (maxX - (pad + r))) {
		return true; 
	} else if (y < (r + pad)) {
		return true; 
	} else {
		return false; 
	}
}

function updateScore (score, x1, y1, x2, y2, font, colour, context) {
	var highScore = window.localStorage.getItem('highscore');
	
	context.textAlign = 'center'; 
	context.textBaseline = 'middle'; 
	
	context.font = font; 
	context.fillStyle = colour; 
	
	if (score > highScore) {
		window.localStorage.setItem('highscore', score); 
	}
	context.fillText(score, x1, y1); 
	context.fillText(highScore, x2, y2); 
}

function moveDiamonds (die_list, score, x, y, r, floor) {
	for (i = 0; i < die_list.length; i++) {
		die_list[i].y += 2; 
		
		if (die_list[i].y == floor) {
			return null; 
		} else if (checkHitbox(x, y, die_list[i].x, die_list[i].y, r)) {
			die_list.splice(i, 1); 
			score = score + 1; 
		} else {
			die_list[i].draw(); 
		}
	}
	
	return score; 
}

function startMusic (songFile) {
	song = new Audio(songFile); 
	song.play(); 
	song.addEventListener('ended', function() {
		this.currentTime = 0; 
		this.play(); 
	}, false);

	return song; 
}

function drawPauseButton (x, y, side_len, colour, context) {
	/* x and y are top left co-ordinates */
	var bar_width = side_len / 3; 
	context.fillStyle = colour; 
	
	context.fillRect(x, y, bar_width, side_len); 
	context.fillRect(x + 2 * bar_width, y, bar_width, side_len); 
}    

function drawPauseScreen (rect_list, outWidth, outColour, context) {
	var r = rect_list; 
	
	for (i = 0; i < rect_list.length; i++) {
		centeredRect(r[i][0], r[i][1], r[i][2], r[i][3], outWidth, outColour, context);  
	}
}