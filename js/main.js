document.addEventListener('DOMContentLoaded', startGame, false);

function startGame() {
    var swayGame = new Game('myCanvas');

    swayGame.background();
    swayGame.initVariable();

    swayGame.getCnv().addEventListener('click', function(event) {swayGame.handleClick(
        event.x * window.devicePixelRatio, event.y * window.devicePixelRatio);});

    setInterval(function() {
        swayGame.background();

        swayGame.getPen().draw();
        if (STATE == GAME) {
            swayGame.move();
        }
        swayGame.draw();

    }, TIME_INTERVAL);
}
