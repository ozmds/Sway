/* Cleaned up on Sept 22 */

document.addEventListener('DOMContentLoaded', startGame, false);

function startGame() {
    CANVAS = document.getElementById('myCanvas');
    CONTEXT = CANVAS.getContext('2d');

    var swayGame = new Game();

    swayGame.background();
    swayGame.initVariable();

    IMAGESET = new ImageSet();

    CANVAS.addEventListener('click', function(event) {swayGame.handleClick(event.x * window.devicePixelRatio, event.y * window.devicePixelRatio);});

    setInterval(function() {
        swayGame.changeColours(PRIMARY_COLOUR, DEST_COLOUR);

        swayGame.background();

        if (swayGame.getOldHeight() != CANVAS.height) {
            swayGame.initVariable();
            swayGame.setOldHeight(CANVAS.height);
        }

        if (STATE == LOGO) {
            swayGame.logoScreen();
        } else if (STATE == HOME) {
            swayGame.homeScreen();
        } else {
            if (STATE == GAME && (swayGame.getStatus() != BOMB)) {
                swayGame.move();
            }

            if (STATE == TRANSITION) {
                if (!swayGame.screenWipe()) {
                    if (swayGame.getStatus() == BOMB) {
                        STATE = GAME_OVER;
                    } else {
                        STATE = GAME;
                    }
                }
            }

            swayGame.draw();

            if (STATE == PAUSE) {
                IMAGESET.drawPauseScreen(CANVAS.width * 0.50, CANVAS.height * 0.35);
            } else if (STATE == GAME_OVER) {
                IMAGESET.drawGameOverScreen(CANVAS.width * 0.50, CANVAS.height * 0.35);
            }
        }
    }, TIME_INTERVAL);
}
