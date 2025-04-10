import { Graphics } from '@pixi/react';
import { useCallback } from 'react';
import type { Graphics as GraphicsType } from 'pixi.js';
import type { Globals } from '../Stage';

type CircleGraphic = {
    x: number;
    y: number;
    radius: number;
    innerRadius: number;
    globals: Globals;
    isCoin?: boolean;
    coinType?: 'big' | 'double' | 'short' | 'bomb' | 'diamond';
    showBackground?: boolean;
    showForeground?: boolean;
};

const drawHole = (g: GraphicsType, x: number, y: number, radius: number) => {
    g.beginHole();
    g.drawCircle(x, y, radius);
    g.endHole();
};

const Circle = ({
    x,
    y,
    radius,
    innerRadius,
    globals,
    isCoin = false,
    coinType,
    showBackground = false,
    showForeground = false
}: CircleGraphic) => {
    const draw = useCallback(
        (g: GraphicsType) => {
            const offset = isCoin ? globals.offset * 0.8 : globals.offset;
            const strokeWidth = isCoin
                ? globals.strokeWidth * 0.8
                : globals.strokeWidth;
            g.clear();

            if (showBackground) {
                g.beginFill(globals.colours.stroke);
                g.drawRect(x, y - radius, offset, radius - innerRadius);
                g.drawRect(x, y + innerRadius, offset, radius - innerRadius);
                g.endFill();

                g.beginFill(globals.colours.stroke);
                g.drawCircle(x + offset, y, radius);
                drawHole(g, x, y, innerRadius);
                g.endFill();

                g.beginFill(globals.colours.circle);
                g.drawCircle(x + offset, y, radius - strokeWidth);
                drawHole(g, x, y, innerRadius);
                g.endFill();
            }

            if (showForeground) {
                g.beginFill(globals.colours.stroke);
                g.drawCircle(x, y, radius);
                drawHole(g, x, y, innerRadius);
                g.endFill();

                g.beginFill(globals.colours.circle);
                g.drawCircle(x, y, radius - strokeWidth);
                drawHole(g, x, y, innerRadius);
                g.endFill();

                g.beginFill(globals.colours.stroke);
                g.drawCircle(x, y, innerRadius + strokeWidth);
                drawHole(g, x, y, innerRadius);
                g.beginFill(globals.colours.background);
                g.drawCircle(x, y, innerRadius);
                g.endFill();
                g.endFill();

                if (isCoin && coinType) {
                    switch (coinType) {
                        case 'big':
                            g.beginFill(globals.colours.stroke);
                            g.drawCircle(x, y, innerRadius * 0.7);
                            g.endFill();
                            g.beginFill(globals.colours.circle);
                            g.drawCircle(x, y, innerRadius * 0.5);
                            g.endFill();
                            break;
                        case 'double':
                            g.beginFill(globals.colours.stroke);
                            g.drawCircle(
                                x + innerRadius * 0.25,
                                y,
                                innerRadius * 0.6
                            );
                            g.endFill();
                            g.beginFill(globals.colours.circle);
                            g.drawCircle(
                                x + innerRadius * 0.25,
                                y,
                                innerRadius * 0.4
                            );
                            g.endFill();
                            g.beginFill(globals.colours.stroke);
                            g.drawCircle(
                                x - innerRadius * 0.25,
                                y,
                                innerRadius * 0.6
                            );
                            g.endFill();
                            g.beginFill(globals.colours.circle);
                            g.drawCircle(
                                x - innerRadius * 0.25,
                                y,
                                innerRadius * 0.4
                            );
                            g.endFill();
                            break;
                        case 'short':
                            g.beginFill(globals.colours.stroke);
                            g.drawRect(
                                x - innerRadius * 0.35,
                                y - innerRadius * 0.35,
                                innerRadius * 0.7,
                                innerRadius * 0.7
                            );
                            g.endFill();
                            g.beginFill(globals.colours.circle);
                            g.drawRect(
                                x - innerRadius * 0.2,
                                y - innerRadius * 0.2,
                                innerRadius * 0.4,
                                innerRadius * 0.4
                            );
                            g.endFill();
                            break;
                        case 'bomb':
                            g.lineStyle(
                                innerRadius * 0.4,
                                globals.colours.stroke
                            );
                            g.moveTo(
                                x - innerRadius * 0.5,
                                y - innerRadius * 0.5
                            );
                            g.lineTo(
                                x + innerRadius * 0.5,
                                y + innerRadius * 0.5
                            );
                            g.moveTo(
                                x + innerRadius * 0.5,
                                y - innerRadius * 0.5
                            );
                            g.lineTo(
                                x - innerRadius * 0.5,
                                y + innerRadius * 0.5
                            );
                            g.lineStyle(
                                innerRadius * 0.1,
                                globals.colours.circle
                            );
                            g.moveTo(
                                x - innerRadius * 0.4,
                                y - innerRadius * 0.4
                            );
                            g.lineTo(
                                x + innerRadius * 0.4,
                                y + innerRadius * 0.4
                            );
                            g.moveTo(
                                x + innerRadius * 0.4,
                                y - innerRadius * 0.4
                            );
                            g.lineTo(
                                x - innerRadius * 0.4,
                                y + innerRadius * 0.4
                            );
                            break;
                        default:
                            g.beginFill(globals.colours.stroke);
                            g.moveTo(x, y + innerRadius * 0.7);
                            g.lineTo(x - innerRadius * 0.7, y);
                            g.lineTo(x, y - innerRadius * 0.7);
                            g.lineTo(x + innerRadius * 0.7, y);
                            g.lineTo(x, y + innerRadius * 0.7);
                            g.endFill();
                            g.beginFill(globals.colours.circle);
                            g.moveTo(x, y + innerRadius * 0.5);
                            g.lineTo(x - innerRadius * 0.4, y);
                            g.lineTo(x, y - innerRadius * 0.5);
                            g.lineTo(x + innerRadius * 0.4, y);
                            g.lineTo(x, y + innerRadius * 0.5);
                            g.endFill();
                            break;
                    }
                }
            }
        },
        [
            x,
            y,
            radius,
            innerRadius,
            globals,
            isCoin,
            showBackground,
            showForeground
        ]
    );
    return <Graphics draw={draw} />;
};

export default Circle;
