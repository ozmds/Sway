from PIL import Image, ImageDraw, ImageChops
import math

'''
Colours
'''
TRANSPARENT = (0, 0, 0, 0)
BLACK = (000, 000, 000, 255)
GREY = (150, 150, 150, 255)
BLUE = '#5DBCD2';

def drawCircle(x, y, r, col, img):
    draw = ImageDraw.Draw(img)
    draw.ellipse([(x - r, y - r), (x + r, y + r)], fill = col)

    del draw

    return img

def drawRect(x, y, xr, yr, col, img):
    draw = ImageDraw.Draw(img)
    draw.rectangle([(x - xr, y - yr), (x + xr, y + yr)], fill = col)

    del draw

    return img

def drawDiamond(x, y, r, col, linecol, linewidth, img):
    draw = ImageDraw.Draw(img)

    p1 = (x,             y - 0.2 * r)
    p2 = (x - 0.175 * r, y - 0.2 * r)
    p3 = (x - 0.250 * r, y - 0.1 * r)
    p4 = (x,             y + 0.2 * r)
    p5 = (x + 0.250 * r, y - 0.1 * r)
    p6 = (x + 0.175 * r, y - 0.2 * r)
    p7 = (x,             y - 0.2 * r)

    p = [p1, p2, p3, p4, p5, p6, p7]

    draw.polygon(p, fill = linecol)

    p1 = (x,                           y - 0.2 * (r - linewidth * 0.7))
    p2 = (x - 0.175 * (r - linewidth), y - 0.2 * (r - linewidth * 0.7))
    p3 = (x - 0.250 * (r - linewidth), y - 0.1 * (r))
    p4 = (x,                           y + 0.2 * (r - linewidth * 1.5))
    p5 = (x + 0.250 * (r - linewidth), y - 0.1 * (r))
    p6 = (x + 0.175 * (r - linewidth), y - 0.2 * (r - linewidth * 0.7))
    p7 = (x,                           y - 0.2 * (r - linewidth * 0.7))

    p = [p1, p2, p3, p4, p5, p6, p7]

    draw.polygon(p, fill = col)

    del draw

    return img

def drawOutlinedCircle(x, y, r, col, linecol, linewidth, img):
    img = drawCircle(x, y, r, linecol, img)
    img = drawCircle(x, y, r - linewidth, col, img)

    return img

def drawDepthRect(x, y, xr, yr, col, linecol, linewidth, img):
    img = drawRect(x, y, xr, yr, linecol, img)
    img = drawRect(x, y, xr, yr - linewidth, col, img)

    return img

def draw3dCircle(x, y, r, col, linecol, linewidth, depth, cutdepth, img, background):
    if background:
        img = drawOutlinedCircle(x + depth, y, r, col, linecol, linewidth, img)
        img = drawDepthRect(x + depth / 2, y, depth / 2, r, col, linecol, linewidth, img)

    img = drawOutlinedCircle(x, y, r, col, linecol, linewidth, img)
    img = drawCircle(x, y, r - cutdepth + linewidth, linecol, img)

    cutimg = Image.new("RGBA", IMAGE_SIZE, TRANSPARENT)
    cutimg = drawCircle(x, y, r - cutdepth, linecol, cutimg)
    img = ImageChops.difference(img, cutimg)

    return img

def drawIcon(x, y, r, col, linecol, linewidth, depth, cutdepth, img):
    img = drawOutlinedCircle(x + depth, y, r, col, linecol, linewidth, img)
    img = drawDepthRect(x + depth / 2, y, depth / 2, r, col, linecol, linewidth, img)

    img = drawOutlinedCircle(x, y, r, col, linecol, linewidth, img)
    img = drawCircle(x, y, r - cutdepth + linewidth, linecol, img)
    img = drawCircle(x, y, r - cutdepth, BLUE, img)

    return img

def circleToTriangleCoordinates(x, y, r):
    '''Return the coordiantes of the equaliateral triangle encompassed by given circle.
    Input -> (x, y, r)
    Output -> [(x1, y1), (x2, y2), (x3, y3)]
    '''

    p1 = (x - r * math.sin(math.pi / 3), y + r / 2)
    p2 = (x + r * math.sin(math.pi / 3), y + r / 2)
    p3 = (x, y - r)
    p = [p1, p2, p3]

    return p

def drawOutlinedTriangle(x, y, r, col, linecol, linewidth, img):
    draw = ImageDraw.Draw(img)
    p = circleToTriangleCoordinates(x, y, r)
    draw.polygon(p, fill = linecol)
    p = circleToTriangleCoordinates(x, y, r - linewidth)
    draw.polygon(p, fill = col)

    del draw

    return img

if __name__ == "__main__":
    LINE_WIDTH = 80
    image_list = ['pendulum', 'center', 'link', 'bomb', 'bombrain', 'diamond', 'small', 'double', 'spike']

    IMAGE_SIZE = (2300, 2300)
    WIDTH = 300

    img = Image.new("RGBA", IMAGE_SIZE, TRANSPARENT)
    img = drawIcon(1000, 1150, 1000, GREY, BLACK, LINE_WIDTH, WIDTH, WIDTH, img)

    img.save('../data/images/icon.png', 'PNG')

    '''
    Pendulum Base   = 100 percent of WIDTH
    Pendulum Center =  60 percent of WIDTH 3/5 = 5/3
    Pendulum Link   =  40 percent of WIDTH 2/5 = 5/2
    Orb             =  60 percent of WIDTH 3/5 = 5/3
    Depth           =  15 percent of WIDTH
    Line Width      =   2 percent of WIDTH
    '''

    INIT_WIDTH = 300
    INIT_LINE_WIDTH = 80
    WIDTH = 300
    LINE_WIDTH = 80

    for i in image_list:
        if i == 'pendulum':
            WIDTH = INIT_WIDTH
            LINE_WIDTH = INIT_LINE_WIDTH
        elif i == 'center':
            WIDTH = INIT_WIDTH * 5/3
            LINE_WIDTH = INIT_LINE_WIDTH * 5/3
        elif i == 'link':
            WIDTH = INIT_WIDTH * 5/2
            LINE_WIDTH = INIT_LINE_WIDTH * 5/2
        else:
            WIDTH = int(INIT_WIDTH * 5/3 * 0.75)
            LINE_WIDTH = INIT_LINE_WIDTH * 5/3

        IMAGE_SIZE = (2000 + WIDTH, 2000)

        for j in ["", "-background"]:
            img = Image.new("RGBA", IMAGE_SIZE, TRANSPARENT)
            r = IMAGE_SIZE[1] * 0.5
            if j == "-background":
                background = True
            else:
                background = False
            img = draw3dCircle(r, r, r, GREY, BLACK, LINE_WIDTH, WIDTH, WIDTH, img, background)

            if i == 'bomb':
                img = drawOutlinedCircle(r, r, r * 0.5, GREY, BLACK, LINE_WIDTH, img)
            elif i == 'bombrain':
                p = circleToTriangleCoordinates(r, r, r * 0.15)
                img = drawOutlinedCircle(p[0][0], p[0][1], r * 0.35, GREY, BLACK, LINE_WIDTH, img)
                img = drawOutlinedCircle(p[1][0], p[1][1], r * 0.35, GREY, BLACK, LINE_WIDTH, img)
                img = drawOutlinedCircle(p[2][0], p[2][1], r * 0.35, GREY, BLACK, LINE_WIDTH, img)
            elif i == 'diamond':
                img = drawDiamond(r, r + 10 * 2.5, r + 340 * 2.5, GREY, BLACK, LINE_WIDTH * 5.5, img)
            elif i == 'spike':
                img = drawOutlinedTriangle(r, r + 10 * 2.5, r * 0.55, GREY, BLACK, LINE_WIDTH * 2, img)
            elif i == 'double':
                img = drawOutlinedCircle(r - 40 * 2.5, r - 40 * 2.5, r * 0.4, GREY, BLACK, LINE_WIDTH, img)
                img = drawOutlinedCircle(r + 40 * 2.5, r + 40 * 2.5, r * 0.4, GREY, BLACK, LINE_WIDTH, img)
            elif i == 'small':
                img = drawOutlinedCircle(r, r, r * 0.3, GREY, BLACK, LINE_WIDTH, img)


            img.save("../data/images/" + i + j + ".png", "PNG")

    '''
    for i in image_list:
        if i == 'pendulum':
            IMAGE_SIZE = (2300, 2000)
        elif i == 'center':
            IMAGE_SIZE = (1300, 1000)
        elif i == 'link':
            IMAGE_SIZE = (1100, 800)
        else:
            IMAGE_SIZE = (1550, 1400)

        if IMAGE_SIZE[1] != 1400:
            WIDTH = 300
        else:
            WIDTH = 150

        for j in ["", "-background"]:
            img = Image.new("RGBA", IMAGE_SIZE, TRANSPARENT)
            r = IMAGE_SIZE[1] * 0.5
            if j == "-background":
                background = True
            else:
                background = False
            img = draw3dCircle(r, r, r, GREY, BLACK, LINE_WIDTH, WIDTH, WIDTH, img, background)

            if i == 'bomb':
                img = drawOutlinedCircle(r, r, r * 0.5, GREY, BLACK, LINE_WIDTH, img)
            elif i == 'bombrain':
                p = circleToTriangleCoordinates(r, r, r * 0.15)
                img = drawOutlinedCircle(p[0][0], p[0][1], r * 0.35, GREY, BLACK, LINE_WIDTH, img)
                img = drawOutlinedCircle(p[1][0], p[1][1], r * 0.35, GREY, BLACK, LINE_WIDTH, img)
                img = drawOutlinedCircle(p[2][0], p[2][1], r * 0.35, GREY, BLACK, LINE_WIDTH, img)
            elif i == 'diamond':
                img = drawDiamond(r, r + 10, r + 340, GREY, BLACK, LINE_WIDTH * 5.5, img)
            elif i == 'spike':
                img = drawOutlinedTriangle(r, r + 10, r * 0.55, GREY, BLACK, LINE_WIDTH * 2, img)
            elif i == 'double':
                img = drawOutlinedCircle(r - 40, r - 40, r * 0.4, GREY, BLACK, LINE_WIDTH, img)
                img = drawOutlinedCircle(r + 40, r + 40, r * 0.4, GREY, BLACK, LINE_WIDTH, img)
            elif i == 'small':
                img = drawOutlinedCircle(r, r, r * 0.3, GREY, BLACK, LINE_WIDTH, img)


            img.save("../data/images/" + i + j + ".png", "PNG")
    '''
