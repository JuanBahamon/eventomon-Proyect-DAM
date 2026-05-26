import { useState, useEffect } from 'react';
import { Motion } from '@capacitor/motion';

interface AccelData {
    x: number;
    y: number;
    z: number;
}

export const useAccelerometer = (onShake?: () => void) => {
    const [accel, setAccel] = useState<AccelData>({ x: 0, y: 0, z: 0 });
    const [isShaking, setIsShaking] = useState<boolean>(false);

    useEffect(() => {
        let lastX = 0, lastY = 0, lastZ = 0;
        const SHAKE_THRESHOLD = 15;

        const handler = Motion.addListener('accel', (event) => {
            const { x, y, z } = event.acceleration;

            setAccel({ x, y, z });

            const deltaX = Math.abs(x - lastX);
            const deltaY = Math.abs(y - lastY);
            const deltaZ = Math.abs(z - lastZ);

            if (deltaX + deltaY + deltaZ > SHAKE_THRESHOLD) {
                setIsShaking(true);
                onShake?.();
                setTimeout(() => setIsShaking(false), 1000);
            }

            lastX = x;
            lastY = y;
            lastZ = z;
        });

        return () => {
            handler.then((h) => h.remove());
        };
    }, [onShake]);

    return { accel, isShaking };
};