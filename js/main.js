/* Cleaned up on Sept 22 */

document.addEventListener('DOMContentLoaded', startGame, false);

function startGame() {
    CANVAS = document.getElementById('myCanvas');
    CONTEXT = CANVAS.getContext('2d');

    var swayGame = new Game();

    swayGame.background();
    swayGame.initVariable();

    IMAGESET = new ImageSet();

    CANVAS.addEventListener('click', function(event) {swayGame.handleClick(
        event.x * window.devicePixelRatio, event.y * window.devicePixelRatio);});

    setInterval(function() {
        swayGame.changeColours(PRIMARY_COLOUR, DEST_COLOUR);

        swayGame.background();

        if (swayGame.getOldHeight() != CANVAS.height) {
            swayGame.initVariable();
            swayGame.setOldHeight(CANVAS.height);
        }

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
        }
    }, TIME_INTERVAL);
}
