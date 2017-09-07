document.addEventListener('DOMContentLoaded', startGame, false);

function startGame() {
    var swayGame = new Game('myCanvas');

    swayGame.background();
    swayGame.initVariable();

    swayGame.getCnv().addEventListener('click', function(event) {swayGame.handleClick(
        event.x * window.devicePixelRatio, event.y * window.devicePixelRatio);});

    setInterval(function() {
        swayGame.changeColours(PRIMARY_COLOUR, DEST_COLOUR);

        swayGame.background();

        swayGame.getPen().setCol(PRIMARY_COLOUR);

        if (swayGame.getOldHeight() != swayGame.getCnv().height) {
            swayGame.initVariable();
            swayGame.setOldHeight(swayGame.getCnv().height);
        }

        if (STATE == GAME) {
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

    }, TIME_INTERVAL);
}
