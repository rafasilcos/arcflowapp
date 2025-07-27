import { useState, useCallback } from 'react';

export type DisclosureLevel = 'glance' | 'focus' | 'detail';

export const useProgressiveDisclosure = (defaultLevel: DisclosureLevel = 'focus') => {
  const [currentLevel, setCurrentLevel] = useState<DisclosureLevel>(defaultLevel);

  const goToGlance = useCallback(() => setCurrentLevel('glance'), []);
  const goToFocus = useCallback(() => setCurrentLevel('focus'), []);  
  const goToDetail = useCallback(() => setCurrentLevel('detail'), []);

  const isGlance = currentLevel === 'glance';
  const isFocus = currentLevel === 'focus';
  const isDetail = currentLevel === 'detail';

  const shouldShow = useCallback((level: DisclosureLevel): boolean => {
    const levels = { glance: 0, focus: 1, detail: 2 };
    return levels[level] <= levels[currentLevel];
  }, [currentLevel]);

  return {
    currentLevel,
    isGlance,
    isFocus, 
    isDetail,
    goToGlance,
    goToFocus,
    goToDetail,
    shouldShow
  };
}; 