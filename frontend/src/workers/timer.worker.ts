// Web Worker para cronômetro - Performance para 150k usuários
let intervalId: NodeJS.Timeout | null = null;
let startTime: number = 0;
let pausedTime: number = 0;
let isRunning: boolean = false;

self.onmessage = function(e) {
  const { action, data } = e.data;

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

    case 'GET_TIME':
      const currentElapsed = isRunning 
        ? Math.floor((Date.now() - startTime) / 1000)
        : Math.floor(pausedTime / 1000);
      
      self.postMessage({ 
        type: 'TIME_UPDATE', 
        elapsed: currentElapsed,
        isRunning,
        timestamp: Date.now()
      });
      break;
  }
};

// Cleanup ao terminar
self.onclose = function() {
  if (intervalId) {
    clearInterval(intervalId);
  }
}; 