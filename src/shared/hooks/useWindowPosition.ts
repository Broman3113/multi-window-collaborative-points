import {useEffect, useState} from "react";

export interface WindowPosition {
  screenX: number,
  screenY: number,
  innerWidth: number,
  innerHeight: number
}

interface UseWindowPositionProps {
  /* refresh rate in ms */
  refreshRate?: number;
}

export const useWindowPosition = ({
                                    refreshRate = 100
}: UseWindowPositionProps = {}) => {
  const [position, setPosition] = useState<WindowPosition>({
    screenX: window.screenX,
    screenY: window.screenY,
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight
  });

  useEffect(() => {
    const handleUpdate = () => {
      setPosition({
        screenX: window.screenX,
        screenY: window.screenY,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight
      })
    }

    window.addEventListener('resize', handleUpdate);
    const interval = setInterval(handleUpdate, refreshRate);

    return () => {
      window.removeEventListener('resize', handleUpdate);
      clearInterval(interval);
    }
  }, [])

  return position;
}
