class Game {
    constructor(cnv) {
        CANVAS = document.getElementById(cnv);
        CONTEXT = CANVAS.getContext('2d');
        this.old_height = 0;

        CANVAS.style.top = (MARGIN).toString() + 'px';
        CANVAS.style.left = (MARGIN).toString() + 'px';

        this.pen = null;
    }

    getPen() {
        return this.pen;
    }

    getOldHeight() {
		return this.old_height;
	}

	setOldHeight(x) {
		this.old_height = x;
	}

    background() {
        CANVAS.height = (window.innerHeight - 2 * MARGIN) * window.devicePixelRatio;
    	CANVAS.width = (window.innerWidth - 2 * MARGIN) * window.devicePixelRatio;

    	CANVAS.style.width = (CANVAS.width / window.devicePixelRatio).toString() + 'px';
    	CANVAS.style.height = (CANVAS.height / window.devicePixelRatio).toString() + 'px';

        document.body.style.backgroundColor = PRIMARY_COLOUR;
    	CANVAS.style.backgroundColor = PRIMARY_COLOUR;

        PADDING = CANVAS.width * 0.02;
    }

    initVariable() {
        this.pen = new Pendulum();
    }
}
