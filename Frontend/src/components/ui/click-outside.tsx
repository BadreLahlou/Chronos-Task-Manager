
import React, { useRef, ReactNode, useEffect } from 'react';

interface ClickOutsideProps {
  onClickOutside: () => void;
  children: ReactNode;
  className?: string;
}

const ClickOutside = ({
  onClickOutside,
  children,
  className = '',
}: ClickOutsideProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        onClickOutside();
      }
    }
    
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClickOutside]);
  
  return (
    <div ref={wrapperRef} className={className}>
      {children}
    </div>
  );
};

export default ClickOutside;
