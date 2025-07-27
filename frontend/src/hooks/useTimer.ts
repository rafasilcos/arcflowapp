import { useState, useEffect, useRef, useCallback } from 'react';

interface TimerState {
  elapsed: number;
  isRunning: boolean;
  lastUpdate: number;
}

export const useTimer = () => {
  const [state, setState] = useState<TimerState>({
    elapsed: 0,
    isRunning: false,
    lastUpdate: Date.now()
  });

  const workerRef = useRef<Worker | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Inicializar Web Worker
  useEffect(() => {
    const initWorker = () => {
      try {
        // Criar Web Worker inline para compatibilidade
        const workerCode = `
          let intervalId = null;
          let startTime = 0;
          let pausedTime = 0;
          let isRunning = false;

          self.onmessage = function(e) {
            const { action } = e.data;

            switch (action) {
              case 'START':
                if (!isRunning) {
                  startTime = Date.now() - pausedTime;
                  isRunning = true;
                  
                  intervalId = setInterval(() => {
                    const elapsed = Math.floor((Date.now() - startTime) / 1000);
                    self.postMessage({ 
                      type: 'TICK', 
                      elapsed,
                      timestamp: Date.now()
                    });
                  }, 1000);
                }
                break;

              case 'PAUSE':
                if (isRunning && intervalId) {
                  clearInterval(intervalId);
                  pausedTime = Date.now() - startTime;
                  isRunning = false;
                  
                  self.postMessage({ 
                    type: 'PAUSED', 
                    elapsed: Math.floor(pausedTime / 1000),
                    timestamp: Date.now()
                  });
                }
                break;

              case 'RESET':
                if (intervalId) {
                  clearInterval(intervalId);
                }
                startTime = 0;
                pausedTime = 0;
                isRunning = false;
                
                self.postMessage({ 
                  type: 'RESET', 
                  elapsed: 0,
                  timestamp: Date.now()
                });
                break;
            }
          };
        `;

        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const worker = new Worker(URL.createObjectURL(blob));

        worker.onmessage = (e) => {
          const { type, elapsed, timestamp } = e.data;
          
          setState(prev => ({
            ...prev,
            elapsed,
            isRunning: type === 'TICK',
            lastUpdate: timestamp
          }));
        };

        worker.onerror = (error) => {
          console.warn('Timer Worker error:', error);
          // Fallback para timer normal se Web Worker falhar
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          reconnectTimeoutRef.current = setTimeout(initWorker, 1000);
        };

        workerRef.current = worker;
      } catch (error) {
        console.warn('Web Worker not supported, using fallback timer');
        // Fallback será implementado se necessário
      }
    };

    initWorker();

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  const start = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({ action: 'START' });
    }
  }, []);

  const pause = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({ action: 'PAUSE' });
    }
  }, []);

  const reset = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({ action: 'RESET' });
    }
  }, []);

  return {
    elapsed: state.elapsed,
    isRunning: state.isRunning,
    start,
    pause,
    reset,
    lastUpdate: state.lastUpdate
  };
}; 