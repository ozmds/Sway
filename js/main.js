/* Cleaned up on Sept 22 */

document.addEventListener('DOMContentLoaded', startGame, false);

function initIcons(sway) {
    /*
    CONTEXT.fillStyle = PRIMARY_COLOUR;
    CONTEXT.lineWidth = LINE_WIDTH * 0.60;
    CONTEXT.strokeStyle = SECONDARY_COLOUR;

    CONTEXT.shadowBlur = 40;
    CONTEXT.shadowColor = SECONDARY_COLOUR;

    CONTEXT.beginPath();
    CONTEXT.arc(100, 100, 50, 0.0 * Math.PI, 2.0 * Math.PI);
    CONTEXT.fill();
    CONTEXT.stroke();
    CONTEXT.closePath();
    */

    var tempCanvas = document.createElement('canvas');
    var tempContext = tempCanvas.getContext('2d');

    tempCanvas.width = 200;
    tempCanvas.height = 200;

    tempContext.fillStyle = SECONDARY_COLOUR;
    tempContext.lineWidth = LINE_WIDTH * 0.60;
    tempContext.strokeStyle = SECONDARY_COLOUR;

    tempContext.shadowBlur = 40;
    tempContext.shadowColor = SECONDARY_COLOUR;

    tempContext.beginPath();
    tempContext.arc(100, 100, 50, 0.0 * Math.PI, 2.0 * Math.PI);
    tempContext.stroke();
    tempContext.closePath();

    tempContext.beginPath();
    tempContext.arc(100, 100, 25, 0.0 * Math.PI, 2.0 * Math.PI);
    tempContext.fill();
    tempContext.closePath();

    var imageData = tempContext.getImageData(0, 0, 200, 200);

    var img = new Image();
    img.src = tempCanvas.toDataURL();
    CONTEXT.drawImage(img, 100, 100);
}

function startGame() {
    CANVAS = document.getElementById('myCanvas');
    CONTEXT = CANVAS.getContext('2d');

    var swayGame = new Game();

    swayGame.background();
    swayGame.initVariable();

    CANVAS.addEventListener('click', function(event) {swayGame.handleClick(
        event.x * window.devicePixelRatio, event.y * window.devicePixelRatio);});

    setInterval(function() {
        swayGame.changeColours(PRIMARY_COLOUR, DEST_COLOUR);

        swayGame.background();

        if (swayGame.getOldHeight() != CANVAS.height) {
            swayGame.initVariable();
            swayGame.setOldHeight(CANVAS.height);
        }

        initIcons(swayGame);

        if (STATE == LOGO) {
            swayGame.logoScreen();
        } else {
            if (STATE == GAME && (!swayGame.getInTransition())) {
                swayGame.move();
            }

            if (STATE == TRANSITION) {
                if (!swayGame.screenWipe()) {
                    if (swayGame.getStatus() == BOMB) {
                        STATE = PAUSE;
                    } else {
                        STATE = GAME;
                    }
                }
            }

            swayGame.draw();

            initIcons(swayGame);
        }
    }, TIME_INTERVAL);
}
