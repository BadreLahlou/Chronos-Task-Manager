import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

interface TimerButtonProps {
  isRunning?: boolean;
  timeLogged: number;
  className?: string;
  onTimeUpdate?: (newTime: number) => void;
  onStart?: () => void;
  onPause?: () => void;
  taskId?: string | number;
}

export const TimerButton = ({
  isRunning: initialIsRunning = false,
  timeLogged: initialTimeLogged = 0,
  className = '',
  onTimeUpdate,
  onStart,
  onPause,
  taskId = 'global',
}: TimerButtonProps) => {
  const timerKey = `timer-state-${taskId}`;

 
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [accumulatedTime, setAccumulatedTime] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [displayTime, setDisplayTime] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  
  useEffect(() => {
    const saved = localStorage.getItem(timerKey);
    if (saved) {
      try {
        const { isRunning: savedRunning, startTime: savedStart, accumulatedTime: savedAccum } = JSON.parse(saved);
        
        if (savedRunning && savedStart) {
         
          const elapsedSinceStart = Math.floor((Date.now() - savedStart) / 1000);
          const totalElapsed = (savedAccum || 0) + elapsedSinceStart;
          
          
          setIsRunning(true);
          setStartTime(savedStart); 
          setAccumulatedTime(savedAccum || 0);
          setDisplayTime(totalElapsed);
          
         
          if (onTimeUpdate) onTimeUpdate(totalElapsed);
          
         
          if (onStart) onStart();
        } else {
          // Timer was paused
          setIsRunning(false);
          setStartTime(null);
          setAccumulatedTime(savedAccum || 0);
          setDisplayTime(savedAccum || 0);
        }
      } catch (e) {
        console.error('Failed to parse timer state:', e);
        
        setIsRunning(initialIsRunning);
        setAccumulatedTime(initialTimeLogged);
        setDisplayTime(initialTimeLogged);
        if (initialIsRunning) {
          setStartTime(Date.now());
          if (onStart) onStart();
        }
      }
    } else {
      
      setIsRunning(initialIsRunning);
      setAccumulatedTime(initialTimeLogged);
      setDisplayTime(initialTimeLogged);
      if (initialIsRunning) {
        setStartTime(Date.now());
        if (onStart) onStart();
      }
    }
    setIsInitialized(true);
    
  }, [timerKey]);

  
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(timerKey, JSON.stringify({ 
        isRunning, 
        startTime, 
        accumulatedTime 
      }));
    }
  }, [isRunning, startTime, accumulatedTime, timerKey, isInitialized]);

  
  useEffect(() => {
    if (isRunning && startTime && isInitialized) {
      const updateTimer = () => {
        const elapsedSinceStart = Math.floor((Date.now() - startTime) / 1000);
        const totalElapsed = accumulatedTime + elapsedSinceStart;
        setDisplayTime(totalElapsed);
        if (onTimeUpdate) onTimeUpdate(totalElapsed);
      };
      
     
      updateTimer();
      
     
      intervalRef.current = setInterval(updateTimer, 1000);
    } else {
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (isInitialized) {
        setDisplayTime(accumulatedTime);
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, startTime, accumulatedTime, onTimeUpdate, isInitialized]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    if (isRunning) {
      
      if (startTime) {
        const elapsedSinceStart = Math.floor((Date.now() - startTime) / 1000);
        const newAccumulatedTime = accumulatedTime + elapsedSinceStart;
        setAccumulatedTime(newAccumulatedTime);
        setDisplayTime(newAccumulatedTime);
        if (onTimeUpdate) onTimeUpdate(newAccumulatedTime);
      }
      setIsRunning(false);
      setStartTime(null);
      if (onPause) onPause();
    } else {
     
      setIsRunning(true);
      setStartTime(Date.now());
      if (onStart) onStart();
    }
  };

  
  if (!isInitialized) {
    return (
      <Button
        variant="outline"
        className={`gap-2 ${className}`}
        disabled
      >
        <Play className="h-3.5 w-3.5" />
        <span>Loading...</span>
      </Button>
    );
  }

  return (
    <Button
      variant={isRunning ? 'default' : 'outline'}
      className={`gap-2 ${isRunning ? 'animate-pulse-subtle' : ''} ${className}`}
      onClick={toggleTimer}
    >
      {isRunning ? (
        <>
          <Pause className="h-3.5 w-3.5" />
          <span>{formatTime(displayTime)}</span>
        </>
      ) : (
        <>
          <Play className="h-3.5 w-3.5" />
          <span>{displayTime > 0 ? formatTime(displayTime) : 'Start Timer'}</span>
        </>
      )}
    </Button>
  );
};

