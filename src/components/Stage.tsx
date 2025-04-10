import { Graphics, Stage as PixiStage, Text } from '@pixi/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { TextStyle } from 'pixi.js';

import type { Graphics as GraphicsType } from 'pixi.js';

import Game from './Game';
import Circle from './graphics/Circle';

export type Globals = {
    colours: {
        background: string;
        circle: string;
        stroke: string;
    };
    strokeWidth: number;
    offset: number;
    padding: number;
    bpm: number;
    transitionTime: number;
};

const Pause = ({
    width,
    padding,
    pause
}: {
    width: number;
    padding: number;
    pause: () => void;
}) => {
    const draw = useCallback(
        (g: GraphicsType) => {
            g.clear();
            g.beginFill('#000000');
            g.drawRect(width - padding * 4, padding * 2.35, 15, 40);
            g.drawRect(width - padding * 4 - 20, padding * 2.35, 15, 40);
            g.endFill();
        },
        [width]
    );
    return <Graphics draw={draw} interactive={true} onclick={pause} />;
};

const Help = ({
    width,
    padding,
    onClick
}: {
    width: number;
    padding: number;
    onClick: () => void;
}) => {
    const draw = useCallback(
        (g: GraphicsType) => {
            g.clear();
            g.beginFill('#000000');
            g.drawCircle(width - padding * 7, padding * 7, padding * 5);
            g.beginFill('#BFAFAE');
            g.drawCircle(width - padding * 7, padding * 7, padding * 4);
            g.endFill();
            g.endFill();
        },
        [width, padding]
    );
    const textStyle = new TextStyle({
        align: 'center',
        fontFamily: '"Pacifico", cursive',
        fontSize: 40,
        fontWeight: '700',
        fill: ['#000000']
    });

    return (
        <>
            <Graphics draw={draw} interactive={true} onclick={onClick} />
            <Text
                text={'?'}
                anchor={{ x: 0.5, y: 0.5 }}
                x={width - padding * 7}
                y={padding * 7}
                style={textStyle}
            />
        </>
    );
};

const PauseScreen = ({ width }: { width: number }) => {
    const globals = useMemo(() => {
        return {
            colours: {
                background: '#BFAFAE',
                circle: '#969696',
                stroke: '#000000'
            },
            strokeWidth: width * 0.013,
            offset: width * 0.035,
            padding: width * 0.015,
            bpm: 120,
            transitionTime: 2000
        };
    }, [width]);
    const textStyle = new TextStyle({
        align: 'center',
        fontFamily: '"Pacifico", cursive',
        fontSize: 26,
        fontWeight: '400',
        fill: [globals.colours.stroke]
    });
    const coinSize = width * 0.16;
    const coins = [
        { x: width * 0.12, y: width * 0.11, type: 'diamond', text: 'Collect' },
        { x: width * 0.31, y: width * 0.11, type: 'big', text: 'Big' },
        { x: width * 0.5, y: width * 0.11, type: 'double', text: 'Double' },
        { x: width * 0.69, y: width * 0.11, type: 'short', text: 'Short' },
        { x: width * 0.88, y: width * 0.11, type: 'bomb', text: 'Dodge' }
    ];

    return (
        <PixiStage
            options={{
                background: globals.colours.background,
                antialias: true,
                resolution: window.devicePixelRatio || 1
            }}
            width={width}
            height={width * 0.3}
            style={{ display: 'flex' }}
        >
            {coins.map((coin) => (
                <>
                    <Circle
                        x={coin.x}
                        y={coin.y}
                        radius={coinSize / 2}
                        innerRadius={width * 0.04}
                        globals={globals}
                        isCoin
                        showBackground
                        showForeground
                        coinType={
                            coin.type as
                                | 'big'
                                | 'double'
                                | 'short'
                                | 'bomb'
                                | 'diamond'
                        }
                    />
                    <Text
                        text={coin.text}
                        anchor={{ x: 0.5, y: 0.5 }}
                        x={coin.x}
                        y={coin.y + (coinSize / 2) * 1.6}
                        style={textStyle}
                    />
                </>
            ))}
        </PixiStage>
    );
};

const Stage = () => {
    const [width, setWidth] = useState(
        window.innerWidth > window.innerHeight
            ? window.innerHeight * 0.5625
            : window.innerWidth
    );
    const [height, setHeight] = useState(window.innerHeight);
    const [direction, setDirection] = useState<'left' | 'right'>('right');
    const [secondDirection, setSecondDirection] = useState<
        'left' | 'right' | null
    >('left');
    const [score, setScore] = useState(0);
    const [status, setStatus] = useState<
        'pause' | 'running' | 'gameover' | 'start' | 'help'
    >('start');

    const switchDirection = () => {
        setDirection((prev) => (prev === 'right' ? 'left' : 'right'));
    };

    const switchSecondDirection = () => {
        if (secondDirection === null) return;
        setSecondDirection((prev) => (prev === 'right' ? 'left' : 'right'));
    };

    const globals = useMemo(() => {
        return {
            colours: {
                background: '#BFAFAE',
                circle: '#969696',
                stroke: '#000000'
            },
            strokeWidth: width * 0.013,
            offset: width * 0.035,
            padding: width * 0.015,
            bpm: 120,
            transitionTime: 2000
        };
    }, [width]);

    const textStyle = new TextStyle({
        align: 'center',
        fontFamily: '"Pacifico", cursive',
        fontSize: 50,
        fontWeight: '700',
        fill: [globals.colours.stroke]
    });

    useEffect(() => {
        const handleResize = () => {
            setHeight(window.innerHeight);
            setWidth(
                window.innerWidth > window.innerHeight
                    ? window.innerHeight * 0.5625
                    : window.innerWidth
            );
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                switchDirection();
                switchSecondDirection();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const screenTitles: { [key in typeof status]: string } = {
        pause: 'Pause',
        gameover: 'Game Over',
        help: 'Help',
        running: 'Running',
        start: 'Start'
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            {['pause', 'gameover', 'help'].includes(status) && (
                <div
                    style={{
                        width,
                        height,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: globals.colours.background
                    }}
                >
                    <div
                        style={{
                            width,
                            height,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            backgroundColor: globals.colours.background,
                            fontFamily: '"Pacifico", cursive',
                            fontSize: 50,
                            gap: '1rem'
                        }}
                    >
                        <p style={{ marginBottom: '2rem' }}>
                            {screenTitles[status]}
                        </p>
                        <PauseScreen width={width} />
                        {status !== 'help' && (
                            <button
                                style={{ all: 'unset' }}
                                onClick={() => {
                                    setStatus('running');
                                    setScore(0);
                                }}
                            >
                                {'Restart'}
                            </button>
                        )}
                        <button
                            style={{ all: 'unset' }}
                            onClick={() => {
                                setStatus('start');
                                setScore(0);
                            }}
                        >
                            {'Home'}
                        </button>
                    </div>
                </div>
            )}
            {['start', 'running'].includes(status) && (
                <PixiStage
                    options={{
                        background: globals.colours.background,
                        antialias: true,
                        resolution: window.devicePixelRatio || 1
                    }}
                    width={width}
                    height={height}
                    style={{ display: 'flex' }}
                    onClick={() => {
                        if (status === 'start') setStatus('running');
                        else {
                            switchDirection();
                            switchSecondDirection();
                        }
                    }}
                >
                    {status === 'start' && (
                        <>
                            <Help
                                width={width}
                                padding={globals.padding}
                                onClick={() => {
                                    setStatus('help');
                                }}
                            />
                            <Text
                                text={'Sway'}
                                anchor={{ x: 0.5, y: 0.5 }}
                                x={width * 0.5}
                                y={height * 0.2}
                                style={textStyle}
                            />
                        </>
                    )}

                    {status === 'running' && (
                        <>
                            <Text
                                text={score.toString()}
                                anchor={{ x: 1, y: 0 }}
                                x={width - globals.padding * 4 - 35}
                                y={0 + globals.padding - 15}
                                style={textStyle}
                            />
                            <Pause
                                width={width}
                                padding={globals.padding}
                                pause={() => {
                                    setStatus((prev) =>
                                        prev === 'pause' ? 'running' : 'pause'
                                    );
                                }}
                            />
                        </>
                    )}

                    <Game
                        width={width}
                        height={height}
                        direction={direction}
                        switchDirection={switchDirection}
                        secondDirection={secondDirection}
                        setSecondDirection={setSecondDirection}
                        globals={globals}
                        setScore={setScore}
                        status={status}
                        setStatus={setStatus}
                        score={score}
                    />
                </PixiStage>
            )}
        </div>
    );
};

export default Stage;
