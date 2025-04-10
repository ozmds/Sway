import { useTick } from '@pixi/react';
import { useMemo, useState } from 'react';
import type { Globals } from '../Stage';

const calculateDistance = (
    a: { x: number; y: number },
    b: { x: number; y: number }
) => {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

const getRangeSpeed = (bpm: number) => (60 / (bpm / 2)) * 1000;

const getPenRange = (
    penCenter: { x: number; y: number },
    centerHeight: number,
    penStartSize: number,
    padding: number,
    offset: number
) => {
    const penLength = penCenter.y - centerHeight; // hypotenuse
    const horizontalDistance =
        penCenter.x - penStartSize / 2 - padding - offset / 2; // opposite
    if (horizontalDistance > penLength) {
        return Math.PI;
    }
    return Math.asin(horizontalDistance / penLength) * 2;
};

const getLinkLengths = (
    penLength: number,
    linkSize: number,
    centerSize: number,
    penSize: number
) => {
    const minGap = linkSize * 0.2;
    const visiblePenLength = penLength - penSize / 2 - centerSize / 2;
    const numberOfLinks = Math.floor(
        (visiblePenLength - minGap) / (linkSize + minGap)
    );
    const gap =
        (visiblePenLength - numberOfLinks * linkSize) / (numberOfLinks + 1);
    return Array.from({ length: numberOfLinks }, (_, i) => {
        return i * (linkSize + gap) + gap + centerSize / 2 + linkSize / 2;
    });
};

const getCoordinates = (
    center: { x: number; y: number },
    length: number,
    angle: number
) => {
    const newX = center.x + length * Math.sin(angle);
    const newY = center.y + length * Math.cos(angle);
    return { x: newX, y: newY };
};

const getLinkCoordinates = (
    center: { x: number; y: number },
    lengths: number[],
    angle: number
) => {
    return lengths.map((length) => {
        return getCoordinates(center, length, angle);
    });
};

const updatePenSize = (
    delta: number,
    penSize: number,
    penStartSize: number,
    penDoubleSize: number,
    transitionTime: number,
    penType: 'regular' | 'big' | 'short' | 'double'
) => {
    if (penType === 'big') {
        if (penSize < penDoubleSize) {
            return (
                penSize +
                (penDoubleSize - penStartSize) *
                    ((delta * 16.66) / transitionTime)
            );
        }
        return penSize;
    }
    if (penSize > penStartSize) {
        return (
            penSize -
            (penDoubleSize - penStartSize) * ((delta * 16.66) / transitionTime)
        );
    }
    return penSize;
};

const updateSpeedMultiplier = (
    delta: number,
    transitionTime: number,
    speedMultiplier: number,
    standardSpeed: number,
    bigSpeed: number,
    penType: 'regular' | 'big' | 'short' | 'double'
) => {
    if (penType === 'big') {
        if (speedMultiplier > bigSpeed) {
            return (
                speedMultiplier +
                (bigSpeed - standardSpeed) * ((delta * 16.66) / transitionTime)
            );
        }
        return speedMultiplier;
    }
    if (speedMultiplier < standardSpeed) {
        return (
            speedMultiplier -
            (bigSpeed - standardSpeed) * ((delta * 16.66) / transitionTime)
        );
    }
    return speedMultiplier;
};

const updatePenLength = (
    delta: number,
    penLength: number,
    penStartLength: number,
    penShortLength: number,
    centerY: number,
    penY: number,
    transitionTime: number,
    penType: 'regular' | 'big' | 'short' | 'double'
) => {
    if (penType === 'short') {
        if (penLength > penShortLength) {
            return (
                penLength +
                (penShortLength - penStartLength) *
                    ((delta * 16.66) / transitionTime)
            );
        }
        return penLength;
    }
    if (penLength < penStartLength && penY > centerY) {
        return (
            penLength -
            (penShortLength - penStartLength) *
                ((delta * 16.66) / transitionTime)
        );
    }
    return penLength;
};

const addAngle = (
    angle: number,
    angleSlice: number,
    direction: 'left' | 'right'
) => {
    if (direction === 'right') {
        return angle + angleSlice;
    }
    return angle - angleSlice;
};

const updatePosition = (
    angle: number,
    angleSlice: number,
    direction: 'left' | 'right',
    center: { x: number; y: number },
    penLength: number,
    linkLengths: number[],
    penSize: number,
    width: number,
    globals: Globals,
    switchDirection?: () => void,
    setSecondDirection?: (
        updateFunction: (
            prevState: 'left' | 'right' | null
        ) => 'left' | 'right' | null
    ) => void
) => {
    let newAngle = 0;

    newAngle = addAngle(angle, angleSlice, direction);

    let coordinates = getCoordinates(center, penLength, newAngle);
    let newLinks = getLinkCoordinates(center, linkLengths, newAngle);

    if (
        coordinates.x >=
            width - globals.padding - penSize / 2 - globals.offset ||
        coordinates.x <= globals.padding + penSize / 2
    ) {
        newAngle = addAngle(
            angle,
            angleSlice,
            direction === 'right' ? 'left' : 'right'
        );
        if (switchDirection) switchDirection();
        if (setSecondDirection) {
            setSecondDirection((prev) =>
                !prev ? direction : prev === 'right' ? 'left' : 'right'
            );
        }
        coordinates = getCoordinates(center, penLength, newAngle);
        newLinks = getLinkCoordinates(center, linkLengths, newAngle);
    }

    return { coordinates, newLinks, newAngle };
};

const usePendulum = ({
    width,
    height,
    direction,
    switchDirection,
    secondDirection,
    setSecondDirection,
    penType,
    status,
    globals
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
    penType: 'regular' | 'big' | 'short' | 'double';
    status: 'pause' | 'running' | 'gameover' | 'start' | 'help';
    globals: Globals;
}) => {
    const rangeSpeed = useMemo(() => getRangeSpeed(globals.bpm), [globals.bpm]);
    const center = useMemo(
        () => ({ x: width / 2, y: height * 0.6 }),
        [width, height]
    );
    const centerSize = useMemo(() => width * 0.2, [width]);

    const penStartSize = useMemo(() => width * 0.28, [width]);
    const penDoubleSize = useMemo(() => width * 0.56, [width]);
    const penStartY = useMemo(
        () => height - penStartSize / 2 - globals.padding,
        [height, penStartSize, globals.padding]
    );
    const penRange = useMemo(
        () =>
            getPenRange(
                { x: width / 2, y: penStartY },
                center.y,
                penStartSize,
                globals.padding,
                globals.offset
            ),
        [width, center, penStartSize, penStartY]
    );
    const linkSize = useMemo(() => width * 0.11, [width]);

    const [x, setX] = useState(width / 2);
    const [y, setY] = useState(penStartY);
    const [angle, setAngle] = useState(0);

    const [penSize, setPenSize] = useState(penStartSize);
    const [speedMultiplier, setSpeedMultiplier] = useState(1);

    const penStartLength = useMemo(
        () => penStartY - center.y,
        [center.y, penStartY]
    );
    const penShortLength = useMemo(
        () =>
            width -
            penStartSize / 2 -
            globals.padding -
            globals.offset -
            center.x,
        [width, penStartSize, globals.padding, globals.offset, center.x]
    );
    const [penLength, setPenLength] = useState(penStartLength);
    const linkLengths = useMemo(
        () => getLinkLengths(penLength, linkSize, centerSize, penSize),
        [penLength, penSize, linkSize]
    );

    const [links, setLinks] = useState<{ x: number; y: number }[]>(
        getLinkCoordinates(center, linkLengths, angle)
    );

    const [secondPen, setSecondPen] = useState<{
        x: number;
        y: number;
        angle: number;
        links: { x: number; y: number }[];
        distance: number;
    } | null>(null);

    useTick((delta) => {
        if (!['running', 'start'].includes(status)) return;
        const newPenSize = updatePenSize(
            delta,
            penSize,
            penStartSize,
            penDoubleSize,
            globals.transitionTime,
            penType
        );
        const newSpeedMultiplier = updateSpeedMultiplier(
            delta,
            globals.transitionTime,
            speedMultiplier,
            1,
            0.5,
            penType
        );
        const newPenLength = updatePenLength(
            delta,
            penLength,
            penStartLength,
            penShortLength,
            center.y,
            y,
            globals.transitionTime,
            penType
        );
        const timeSlice = (delta * 16.66) / rangeSpeed;
        const angleSlice = timeSlice * penRange * newSpeedMultiplier;
        const { coordinates, newLinks, newAngle } = updatePosition(
            angle,
            angleSlice,
            direction,
            center,
            newPenLength,
            linkLengths,
            newPenSize,
            width,
            globals,
            switchDirection
        );
        if (penType === 'double' || secondPen) {
            const secondPenPosition = updatePosition(
                secondPen ? secondPen.angle : angle,
                angleSlice,
                secondDirection || (direction === 'right' ? 'left' : 'right'),
                center,
                newPenLength,
                linkLengths,
                newPenSize,
                width,
                globals,
                undefined,
                setSecondDirection
            );
            const distance = calculateDistance(
                { x: coordinates.x, y: coordinates.y },
                {
                    x: secondPenPosition.coordinates.x,
                    y: secondPenPosition.coordinates.y
                }
            );
            if (
                penType !== 'double' &&
                distance > (secondPen?.distance || 0) &&
                distance < penSize
            ) {
                setSecondPen(null);
                setSecondDirection(() => null);
            } else {
                setSecondPen({
                    x: secondPenPosition.coordinates.x,
                    y: secondPenPosition.coordinates.y,
                    angle: secondPenPosition.newAngle,
                    links: secondPenPosition.newLinks,
                    distance
                });
            }
        }
        setPenSize(newPenSize);
        setSpeedMultiplier(newSpeedMultiplier);
        setPenLength(newPenLength);
        setX(coordinates.x);
        setY(coordinates.y);
        setLinks(newLinks);
        setAngle(newAngle);
    });

    return {
        pen: { x, y },
        links,
        center,
        penSize,
        centerSize,
        linkSize,
        rangeSpeed,
        secondPen
    };
};

export default usePendulum;
