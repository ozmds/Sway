class Game {
    constructor(cnv) {
        this.cnv = document.getElementById(cnv);
        this.ctx = this.cnv.getContext('2d');
        this.old_height = 0;
        this.pen = null;
        this.score = 0;
        this.speed = 0;
        this.status = REGULAR;

        this.cnv.style.top = (MARGIN).toString() + 'px';
        this.cnv.style.left = (MARGIN).toString() + 'px';
    }

    background() {
        this.cnv.height = (window.innerHeight - 10) * window.devicePixelRatio;
    	this.cnv.width = (window.innerWidth - 10) * window.devicePixelRatio;

    	this.cnv.style.width = (this.cnv.width / window.devicePixelRatio).toString() + 'px';
    	this.cnv.style.height = (this.cnv.height / window.devicePixelRatio).toString() + 'px';

    	document.body.style.backgroundColor = PRIMARY_COLOUR;
    	this.cnv.style.backgroundColor = PRIMARY_COLOUR;
    }

    initVariable() {
        var cen_height = 0.60;
		var pen_rad = this.cnv.width * 0.1;

		var cen_x = this.cnv.width / 2;
		var cen_y = this.cnv.height * cen_height;

		var pen_x = this.cnv.width / 2;
		var pen_y = this.cnv.height - (pen_rad + PADDING);

		var arm = new Line(cen_x, cen_y, pen_x, pen_y, this.cnv.width * 0.015, SECONDARY_COLOUR, this.ctx, this.cnv);
		var cen = new Circle(cen_x, cen_y, pen_rad / 2, PRIMARY_COLOUR, this.cnv.width * 0.0175, SECONDARY_COLOUR, this.ctx, this.cnv);
		var pen = new Circle(pen_x, pen_y, pen_rad, PRIMARY_COLOUR, this.cnv.width * 0.02, SECONDARY_COLOUR, this.ctx, this.cnv);

		var sArm = new Line(cen_x, cen_y, pen_x, pen_y, this.cnv.width * 0.015, SECONDARY_COLOUR, this.ctx, this.cnv);
		var sPen = new Circle(pen_x, pen_y, pen_rad, PRIMARY_COLOUR, this.cnv.width * 0.02, SECONDARY_COLOUR, this.ctx, this.cnv);

		this.pen = new Pendulum(cen, pen, arm);

		this.pen.setSArm(sArm);
		this.pen.setSPen(sPen);

		/* Create Boundaries for Pendulum */
		this.pen.setSmallLen(this.cnv);
		this.pen.setRange(this.cnv.width / 2, PADDING);

		/* Calculate Speed for Pendulum and Orb */
		this.pen.calcPenSpeed(pen_time);

		if (window.localStorage.getItem('highscore') == null) {
			window.localStorage.setItem('highscore', this.score);
		}

        this.pen.draw();
    }
}
