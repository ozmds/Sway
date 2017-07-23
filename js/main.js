document.addEventListener('DOMContentLoaded', startGame, false);

function changeColours(colour1, colour2) {
	/* Slowly return fading colours from colour1 to colour2 */
	var i;

	var c1 = [];
	var c2 = [];

	var newcol = []

	for (i = 0; i < 3; i++) {
		c1.push(parseInt(colour1.slice(2 * i + 1, 2 * i + 3), 16));
		c2.push(parseInt(colour2.slice(2 * i + 1, 2 * i + 3), 16));

		if (c1[i] > c2[i]) {
			newcol.push(c1[i] - 1);
		} else if (c1[i] == c2[i]) {
			newcol.push(c1[i]);
		} else {
			newcol.push(c1[i] + 1);
		}

		if (newcol[i] == 0) {
			newcol[i] = '00';
		} else if (newcol[i] < 16) {
			newcol[i] = '0' + newcol[i].toString(16);
		}
	}

	PRIMARY_COLOUR = '#' + newcol[0].toString(16) + newcol[1].toString(16) + newcol[2].toString(16);

	return true;
}

function handleClick(event_x, event_y, sway) {
	/* React to a click */
	sway.getPen().getPen().flip();

	if (sway.getStatus() != BALLOON) {
		sway.getPen().getSPen().flip();
	}
}

function drawPauseButton(x, y, side_len, colour, context) {
	/* Draw a Pause Button */
	var bar_width = side_len / 3;
	context.fillStyle = colour;

	context.fillRect(x, y, bar_width, side_len);
	context.fillRect(x + 2 * bar_width, y, bar_width, side_len);
}

function updateScore(c, ctx, score, highscore, colour) {
	/* Write the score on the canvas */
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'end';
	ctx.fillStyle = colour;

	var font_size = c.width * 0.13;
	var font = font_size.toString() + "px basicWoodlands";

	ctx.font = font;

	ctx.fillText(score, c.width * 0.95, c.width * 0.05);
	ctx.fillText(highscore, c.width * 0.95, c.width * 0.16);
}

function startGame() {
	var swayGame = new Sway('myCanvas');

	swayGame.background();
	swayGame.initVariable();

	swayGame.getCnv().addEventListener('click', function(event) {handleClick(event.x * window.devicePixelRatio, event.y * window.devicePixelRatio, swayGame);});

	setInterval(function() {
		changeColours(PRIMARY_COLOUR, DEST_COLOUR);

		swayGame.background();

		swayGame.getPen().setCol(PRIMARY_COLOUR);

		if (swayGame.getOldHeight() != swayGame.getCnv().height) {
			swayGame.initVariable();
			swayGame.setOldHeight(swayGame.getCnv().height);
		}

		drawPauseButton(swayGame.getCnv().width * 0.04, swayGame.getCnv().width * 0.04, swayGame.getCnv().width * 0.10,
						SECONDARY_COLOUR, swayGame.getCtx());

		updateScore(swayGame.getCnv(), swayGame.getCtx(), swayGame.getScore(), window.localStorage.getItem('highscore'), SECONDARY_COLOUR);

		swayGame.manageOrbs();

		if (swayGame.getStatus() == SLOW_DOWN) {
			if (!swayGame.getPen().startShrink()) {
				swayGame.setStatus(REGULAR);
			}
		} else if (swayGame.getStatus() == BALLOON) {
			if (!swayGame.getPen().startBalloon()) {
				swayGame.setStatus(REGULAR);
			}
		} else if (swayGame.getStatus() == SPIKE) {
			if (!swayGame.getPen().startSpike()) {
				swayGame.setStatus(REGULAR);
			}
		} else if (swayGame.getStatus() == POISON) {
			swayGame.setScore(0);
			swayGame.setStatus(REGULAR);
		}

		swayGame.move();
	}, TIME_INTERVAL);
}
