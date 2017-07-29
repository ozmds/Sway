document.addEventListener('DOMContentLoaded', startGame, false);

function startGame() {
    var swayGame = new Game('myCanvas');

    swayGame.background();
    swayGame.initVariable();
}
