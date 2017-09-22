document.addEventListener('DOMContentLoaded', startGame, false);

function startGame() {
    CANVAS = document.getElementById('myCanvas');
    CONTEXT = CANVAS.getContext('2d');

    var swayGame = new Game('myCanvas');

    swayGame.background();
    swayGame.initVariable();

    swayGame.getCnv().addEventListener('click', function(event) {swayGame.handleClick(
        event.x * window.devicePixelRatio, event.y * window.devicePixelRatio);});

    setInterval(function() {
        swayGame.changeColours(PRIMARY_COLOUR, DEST_COLOUR);

        swayGame.background();

        if (swayGame.getOldHeight() != swayGame.getCnv().height) {
            swayGame.initVariable();
            swayGame.setOldHeight(swayGame.getCnv().height);
        }

        if (STATE == LOGO) {
          swayGame.logoScreen();
        } else {
          if (STATE == HOME) {
            swayGame.getPen().move();
            swayGame.getPen().draw();
            swayGame.homeScreen();
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

            if (STATE == PAUSE) {
                swayGame.drawScreen();
            }
          }
        }

    }, TIME_INTERVAL);
}
