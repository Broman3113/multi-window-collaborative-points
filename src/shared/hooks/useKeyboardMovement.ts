import { useEffect, useRef, useState } from 'react';

interface KeyState {
  [key: string]: boolean;
}

interface UseKeyboardMovementOptions {
  speed?: number;
  enabled?: boolean;
}

export const useKeyboardMovement = (options?: UseKeyboardMovementOptions) => {
  const { speed = 300, enabled = true } = options ?? {};
  const keysPressed = useRef<KeyState>({});
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const requestAnimationFrameRef = useRef<number | null>(null);

  const speedRef = useRef(speed);
  const enabledRef = useRef(enabled);

  const lastTimeRef = useRef<number>(0);

  speedRef.current = speed;
  enabledRef.current = enabled;

  useEffect(() => {
    if (!enabled) return;

    const shouldContinue = { value: true };

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
    };

    const updateVelocity = (currentTime: number) => {
      if (!shouldContinue.value) return;

      if(lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime;
        requestAnimationFrameRef.current = requestAnimationFrame(updateVelocity);
        return;
      }

      const deltaMs = currentTime - lastTimeRef.current;
      const deltaTime = deltaMs / 1000;

      lastTimeRef.current = currentTime;


      let x = 0, y = 0;

      if (keysPressed.current['ArrowUp'] || keysPressed.current['w']) y -= speedRef.current * deltaTime;
      if (keysPressed.current['ArrowDown']  || keysPressed.current['s']) y += speedRef.current * deltaTime;
      if (keysPressed.current['ArrowLeft']  || keysPressed.current['a']) x -= speedRef.current * deltaTime;
      if (keysPressed.current['ArrowRight']  || keysPressed.current['d']) x += speedRef.current * deltaTime;

      setVelocity(prev => {
        if (prev.x === x && prev.y === y) return prev;
        return { x, y };
      });

      requestAnimationFrameRef.current = requestAnimationFrame(updateVelocity);
    };

    requestAnimationFrameRef.current = requestAnimationFrame(updateVelocity);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      shouldContinue.value = false;

      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);

      if (requestAnimationFrameRef.current) {
        cancelAnimationFrame(requestAnimationFrameRef.current);
      }
    };
  }, [enabled]);

  return velocity;
};
