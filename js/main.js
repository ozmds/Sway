document.addEventListener('DOMContentLoaded', startGame, false);

function startGame() {
    var swayGame = new Game('myCanvas');

    swayGame.background();
    swayGame.initVariable();

    swayGame.getCnv().addEventListener('click', function(event) {handleClick(
        event.x * window.devicePixelRatio, event.y * window.devicePixelRatio, swayGame);});

        drawPauseButton(swayGame.getCnv().width * 0.04, swayGame.getCnv().width * 0.04, swayGame.getCnv().width * 0.10,
                        SECONDARY_COLOUR, swayGame.getCtx());

        updateScore(swayGame.getCnv(), swayGame.getCtx(), swayGame.getScore(), window.localStorage.getItem('highscore'), SECONDARY_COLOUR);
}
