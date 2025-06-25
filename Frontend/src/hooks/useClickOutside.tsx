
import { useEffect, RefObject } from 'react';


function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void,
  mouseEvent: 'mousedown' | 'mouseup' = 'mousedown',
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current;
      
      
      if (!el || el.contains(event.target as Node)) {
        return;
      }
      
      handler(event);
    };
    
    document.addEventListener(mouseEvent, listener);
    document.addEventListener('touchend', listener);
    
    return () => {
      document.removeEventListener(mouseEvent, listener);
      document.removeEventListener('touchend', listener);
    };
  }, [ref, handler, mouseEvent]);
}

export default useClickOutside;
