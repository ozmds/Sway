var f;

class Button {
	constructor(x, y, width, height, colour, outWidth, outColour, context, font, title, name) {
		this.x = x; 
		this.y = y; 
		this.width = width; 
		this.height = height; 
		this.colour = colour; 
		this.outWidth = outWidth;
		this.outColour = outColour;
		this.font = font;
		this.title = title; 
		this.context = context; 
		this.name = name; 
	}
	
	draw() {
		this.ctx.fillStyle = this.col;
		this.ctx.lineWidth = this.owid;
		this.ctx.strokeStyle = this.ocol;
		
		this.ctx.beginPath();
		this.ctx.rect(this.x - this.wid / 2, this.y - this.hgt / 2, this.wid, this.hgt);
		this.ctx.fill();
		this.ctx.stroke();
		this.ctx.closePath();
		
		this.ctx.textAlign = 'center';
		this.ctx.textBaseline = 'middle';
		this.ctx.font = this.font;
		this.ctx.fillStyle = this.ocol;
		
		this.ctx.fillText(this.text, this.x, this.y - this.hgt * 0.20);
	}
	
	isClicked(eventX, eventY, padding) {
		if (eventX > this.x - this.wid / 2 + padding) {
			if (eventX < this.x + this.wid / 2 + padding) {
				if (eventY > this.y - this.hgt / 2 + padding) {
					if (eventY < this.y + this.hgt / 2 + padding) {
						return true;
					}
				}
			}
		}
	}
	
	drawCross() {
		this.ctx.strokeStyle = this.ocol;
		this.ctx.lineWidth = this.owid;
		
		this.ctx.beginPath();
		this.ctx.moveTo(this.x - this.wid / 2, this.y - this.hgt / 2);
		this.ctx.lineTo(this.x + this.wid / 2, this.y + this.hgt / 2);
		this.ctx.stroke();
		this.ctx.closePath();
		
		this.ctx.beginPath();
		this.ctx.moveTo(this.x + this.wid / 2, this.y - this.hgt / 2);
		this.ctx.lineTo(this.x - this.wid / 2, this.y + this.hgt / 2);
		this.ctx.stroke();
		this.ctx.closePath();
	}
}

Class Screen {
	constructor(id, text, button_list, ctx, cnv) {
		this.id = id;
		this.text = text;
		this.list = button_list;
		this.ctx = ctx;
		this.cnv = cnv;
	}
	
	writeText() {
		f = (this.cnv.height * 0.15).toString() + 'px basicWoodlands';
		
		this.ctx.textAlign = 'center';
		this.ctx.textBaseline = 'middle';
		this.ctx.font = f;
		
		this.ctx.fillStyle = PRIMARY_COLOUR;
		this.ctx.fillText(this.text, this.cnv.width * 0.50, this.cnv.height * 0.25);
	}
	
	draw() {
		this.writeText();
		
		for (i = 0; i < this.button_list; i++) {
			this.button_list[i].draw();
		}
	}
	
	handleClick(x, y, pad) {
		for (i = 0; i < this.button_list; i++) {
			if (this.button_list[i].isClicked(x, y, pad)) {
				return this.button_list[i].id;
			}
		}
	}
}