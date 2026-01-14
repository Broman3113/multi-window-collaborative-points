import {useState, useEffect, useRef} from "react";
import * as React from "react";
import classes from './Canvas.module.scss';
import { cn } from "@/shared/utils";
import { useWindowPosition, useKeyboardMovement } from "@/shared/hooks";
import type {Point} from "@/shared/types";



export const Canvas = () => {
  const [activePointId, setActivePointId] = useState<string | null>(null);
  const windowPosition = useWindowPosition({ refreshRate: 50 });
  const velocity = useKeyboardMovement({
    // speed: 300,
    enabled: activePointId !== null  // Только если точка выбрана
  });
  const velocityRef = useRef(velocity);


  const [isDebugShown, setIsDebugShown] = useState(false);

  const [points, setPoints] = useState<Point[]>([
    {
      id: '1',
      screenX: windowPosition.screenX + 300,
      screenY: windowPosition.screenY + 300,
      color: 'red'
    },
    {
      id: '2',
      screenX: windowPosition.screenX + 600,
      screenY: windowPosition.screenY + 600,
      color: 'blue'
    }
  ]);

  // Обновляем ref при изменении velocity
  velocityRef.current = velocity;

  useEffect(() => {
    if (!activePointId) return;

    const animate = () => {
      const vel = velocityRef.current;

      if (vel.x !== 0 || vel.y !== 0) {
        setPoints(prev => prev.map(p =>
          p.id === activePointId
            ? {
              ...p,
              screenX: p.screenX + vel.x,
              screenY: p.screenY + vel.y
            }
            : p
        ));
      }

      rafId.current = requestAnimationFrame(animate);
    };

    const rafId = { current: 0 };
    rafId.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId.current);
  }, [activePointId]);

  const getViewportCoords = (point: Point) => ({
    x: point.screenX - windowPosition.screenX,
    y: point.screenY - windowPosition.screenY,
  });

  const handleCanvasClicked = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();

    const newPoint: Point = {
      id: crypto.randomUUID(),
      screenX: windowPosition.screenX + e.clientX,
      screenY: windowPosition.screenY + e.clientY,
      color: "#000000".replace(/0/g, () => (~~(Math.random() * 16)).toString(16))
    };

    setPoints(prev => [...prev, newPoint]);
    setActivePointId(newPoint.id);
  };

  const handlePointClick = (
    pointId: string,
    e: React.MouseEvent<SVGCircleElement>
  ) => {
    e.stopPropagation();
    setActivePointId(pointId);
  };

  const isPointVisible = (point: Point) => {
    const viewport = getViewportCoords(point);
    return (
      viewport.x >= 0 &&
      viewport.x <= windowPosition.innerWidth &&
      viewport.y >= 0 &&
      viewport.y <= windowPosition.innerHeight
    );
  };

  return (
    <div className='h-screen w-screen relative'>
      {/* Debug info */}
      <div className="absolute top-4 left-4 bg-white p-4 rounded shadow-lg text-xs font-mono space-y-1 z-10">
        <button
          onClick={() => setIsDebugShown(!isDebugShown)}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          Toggle debug
        </button>

        {isDebugShown && (
          <div>
            <div>Window: ({windowPosition.screenX}, {windowPosition.screenY})</div>
            <div>Size: {windowPosition.innerWidth}x{windowPosition.innerHeight}</div>
            <div>Velocity: ({velocity.x}, {velocity.y})</div>
            <div>Active: {activePointId}</div>
            <div className="border-t pt-1 mt-1">
              {points.map(point => {
                const viewport = getViewportCoords(point);
                const visible = isPointVisible(point);
                return (
                  <div key={point.id} className={visible ? 'text-green-600' : 'text-red-600'}>
                    {point.id.slice(0, 8)}: screen({point.screenX}, {point.screenY})
                    → vp({Math.round(viewport.x)}, {Math.round(viewport.y)})
                    {!visible && ' 🔴'}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded shadow-lg text-sm">
        <p>💡 Кликните на точку для выбора</p>
        <p>⌨️ Удерживайте стрелки для движения (можно комбинировать)</p>
        <p>🖱️ Кликните на Canvas для создания новой точки</p>
      </div>

      <svg
        width="100%"
        height="100%"
        className="outline-none"
        onClick={handleCanvasClicked}
      >
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="gray" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect id="grid-bg" width="100%" height="100%" fill="url(#grid)" />

        {points.map(point => {
          const viewport = getViewportCoords(point);
          const visible = isPointVisible(point);

          if (!visible) return null;

          return (
            <g key={point.id}>
              {/* Selection ring */}
              {point.id === activePointId && (
                <circle
                  cx={viewport.x}
                  cy={viewport.y}
                  r="15"
                  fill="none"
                  stroke={point.color}
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  pathLength="100"
                  className={cn("", classes.Outline)}
                />
              )}

              {/* Point */}
              <circle
                cx={viewport.x}
                cy={viewport.y}
                r="10"
                fill={point.color}
                stroke="white"
                strokeWidth={2}
                onClick={(e) => handlePointClick(point.id, e)}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
