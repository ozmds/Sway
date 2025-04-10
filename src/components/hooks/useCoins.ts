import { useTick } from '@pixi/react';
import { useMemo, useRef, useState } from 'react';
import type { Globals } from '../Stage';

const coinOdds = {
    powerup: 0.05,
    bomb: 0.1,
    diamond: 0.85
};

const calculateDistance = (
    a: { x: number; y: number },
    b: { x: number; y: number }
) => {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

const useCoins = ({
    width,
    height,
    pen,
    penSize,
    rangeSpeed,
    score,
    setScore,
    status,
    setStatus,
    globals,
    secondPen,
    powerUp,
    setPowerUp
}: {
    width: number;
    height: number;
    pen: { x: number; y: number };
    penSize: number;
    rangeSpeed: number;
    score: number;
    setScore: (updateFunction: (prevState: number) => number) => void;
    status: 'pause' | 'running' | 'gameover' | 'start' | 'help';
    setStatus: (
        status: 'pause' | 'running' | 'gameover' | 'start' | 'help'
    ) => void;
    globals: Globals;
    secondPen: { x: number; y: number } | null;
    powerUp: 'big' | 'double' | 'short' | 'regular';
    setPowerUp: (value: 'big' | 'double' | 'short' | 'regular') => void;
}) => {
    const coinSize = useMemo(() => width * 0.16, [width]);
    const [coins, setCoins] = useState<
        {
            x: number;
            y: number;
            hitSlope?: number;
            hitDirection?: 'above' | 'below';
            type: 'big' | 'double' | 'short' | 'bomb' | 'diamond';
        }[]
    >([]);
    const timeSinceLastCoinRef = useRef(0);

    useTick((delta) => {
        if (status !== 'running') return;

        const coinSpeed =
            (height / rangeSpeed) *
            delta *
            16.66 *
            (score <= 25 ? 0.25 : Math.min(Math.floor(score / 10), 10) * 0.1);
        const newCoins = [...coins];

        timeSinceLastCoinRef.current += delta * 16.66;

        if (timeSinceLastCoinRef.current >= rangeSpeed) {
            const odds = Math.random();
            let newCoinType: 'big' | 'double' | 'short' | 'bomb' | 'diamond';
            if (odds < coinOdds.powerup) {
                if (odds < coinOdds.powerup * 0.33) newCoinType = 'double';
                else if (odds < coinOdds.powerup * 0.66) newCoinType = 'short';
                else newCoinType = 'big';
            } else if (odds < coinOdds.powerup + coinOdds.bomb) {
                newCoinType = 'bomb';
            } else {
                newCoinType = 'diamond';
            }
            if (['big', 'double', 'short'].includes(powerUp)) {
                newCoinType = 'diamond';
            }
            const newCoin = {
                x:
                    Math.random() *
                        (width -
                            coinSize -
                            2 * globals.padding -
                            globals.offset) +
                    coinSize / 2 +
                    globals.padding,
                y: -1 * (coinSize / 2),
                type: newCoinType
            };
            newCoins.push(newCoin);
            timeSinceLastCoinRef.current -= rangeSpeed;
        }
        newCoins.forEach((coin, index) => {
            if (coin.hitSlope) {
                const angle = Math.atan(coin.hitSlope);
                const direction = coin.hitDirection === 'above' ? -1 : 1;
                coin.x += direction * coinSpeed * Math.sin(angle) * 2;
                coin.y += direction * coinSpeed * Math.cos(angle) * 2;
            } else {
                coin.y += coinSpeed;
            }
            const coinHit =
                (calculateDistance(coin, pen) < penSize / 2 + coinSize / 2 &&
                    !coin.hitSlope) ||
                (secondPen &&
                    calculateDistance(coin, secondPen) <
                        penSize / 2 + coinSize / 2 &&
                    !coin.hitSlope);
            if (coinHit) {
                coin.hitSlope = (coin.y - pen.y) / (coin.x - pen.x);
                coin.hitDirection = coin.y > pen.y ? 'below' : 'above';
                if (coin.type === 'bomb') {
                    setStatus('gameover');
                } else if (coin.type === 'diamond') {
                    setScore((prev) => prev + 1);
                } else {
                    setPowerUp(coin.type);
                    newCoins.forEach((c) => {
                        c.type = 'diamond';
                    });
                }
            }
            if (
                coin.y > height - coinSize / 2 &&
                coin.type === 'diamond' &&
                !coin.hitSlope
            ) {
                setStatus('gameover');
            }
            if (
                coin.y > height + coinSize / 2 ||
                coin.x < -coinSize / 2 ||
                coin.x > width + coinSize / 2 ||
                coin.y < -coinSize / 2
            ) {
                newCoins.splice(index, 1);
            }
        });
        setCoins(newCoins);
    });

    return { coins, coinSize };
};

export default useCoins;
