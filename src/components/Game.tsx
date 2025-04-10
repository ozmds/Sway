import { useTick } from '@pixi/react';
import { useState } from 'react';
import Circle from './graphics/Circle';
import type { Globals } from './Stage';
import useCoins from './hooks/useCoins';
import usePendulum from './hooks/usePendulum';

const Game = ({
    width,
    height,
    direction,
    switchDirection,
    secondDirection,
    setSecondDirection,
    globals,
    score,
    setScore,
    status,
    setStatus
}: {
    width: number;
    height: number;
    direction: 'left' | 'right';
    switchDirection: () => void;
    secondDirection: 'left' | 'right' | null;
    setSecondDirection: (
        updateFunction: (
            prevState: 'left' | 'right' | null
        ) => 'left' | 'right' | null
    ) => void;
    globals: Globals;
    score: number;
    setScore: (updateFunction: (prevState: number) => number) => void;
    status: 'pause' | 'running' | 'gameover' | 'start' | 'help';
    setStatus: (
        status: 'pause' | 'running' | 'gameover' | 'start' | 'help'
    ) => void;
}) => {
    const [powerUp, setPowerUp] = useState<
        'big' | 'double' | 'short' | 'regular'
    >('regular');
    const [powerUpTimer, setPowerUpTimer] = useState<number>(0);
    const {
        pen,
        links,
        center,
        penSize,
        centerSize,
        linkSize,
        rangeSpeed,
        secondPen
    } = usePendulum({
        width,
        height,
        direction,
        switchDirection,
        secondDirection,
        setSecondDirection,
        status,
        globals,
        penType: powerUp
    });

    const { coins, coinSize } = useCoins({
        width,
        height,
        pen,
        penSize,
        rangeSpeed,
        status,
        setStatus,
        score,
        setScore,
        globals,
        secondPen,
        powerUp,
        setPowerUp
    });

    useTick((delta) => {
        if (status !== 'running') return;

        if (powerUp !== 'regular') {
            setPowerUpTimer((prev) => prev + delta * 16.66);
            if (powerUpTimer + delta * 16.66 > 20000) {
                setPowerUp('regular');
                setPowerUpTimer(0);
            }
        }
    });

    return (
        <>
            <Circle
                x={center.x}
                y={center.y}
                radius={centerSize / 2}
                innerRadius={width * 0.04}
                globals={globals}
                showBackground
                showForeground
            />
            {secondPen &&
                secondPen.links.map((link) => (
                    <Circle
                        x={link.x}
                        y={link.y}
                        radius={linkSize / 2}
                        innerRadius={width * 0.015}
                        globals={globals}
                        showBackground
                        showForeground
                    />
                ))}
            {links.map((link) => (
                <Circle
                    x={link.x}
                    y={link.y}
                    radius={linkSize / 2}
                    innerRadius={width * 0.015}
                    globals={globals}
                    showBackground
                    showForeground
                />
            ))}
            {secondPen && (
                <Circle
                    x={secondPen.x}
                    y={secondPen.y}
                    radius={penSize / 2}
                    innerRadius={penSize / 4}
                    globals={globals}
                    showBackground
                />
            )}
            <Circle
                x={pen.x}
                y={pen.y}
                radius={penSize / 2}
                innerRadius={penSize / 4}
                globals={globals}
                showBackground
            />
            {coins.map((coin) => (
                <Circle
                    x={coin.x}
                    y={coin.y}
                    radius={coinSize / 2}
                    innerRadius={width * 0.04}
                    globals={globals}
                    isCoin
                    showBackground
                    coinType={coin.type}
                />
            ))}
            {secondPen && (
                <Circle
                    x={secondPen.x}
                    y={secondPen.y}
                    radius={penSize / 2}
                    innerRadius={penSize / 4}
                    globals={globals}
                    showForeground
                />
            )}
            <Circle
                x={pen.x}
                y={pen.y}
                radius={penSize / 2}
                innerRadius={penSize / 4}
                globals={globals}
                showForeground
            />
            {coins.map((coin) => (
                <Circle
                    x={coin.x}
                    y={coin.y}
                    radius={coinSize / 2}
                    innerRadius={width * 0.04}
                    globals={globals}
                    isCoin
                    showForeground
                    coinType={coin.type}
                />
            ))}
        </>
    );
};

export default Game;
