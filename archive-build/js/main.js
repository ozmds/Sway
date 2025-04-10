document.addEventListener('DOMContentLoaded', startGame, false);

function startGame() {
    var game = new Game('myCanvas');

    game.background();

    game.initVariable();

    setInterval(function() {
        game.background();

        if (game.getOldHeight() != CANVAS.height) {
            game.initVariable();
            game.setOldHeight(CANVAS.height);
        }

        game.getOrbList().move();
        game.getOrbList().draw();

        game.getPen().drawBack();
        game.getPen().draw();

    }, TIME_INTERVAL);
}
