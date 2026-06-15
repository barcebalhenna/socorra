import { useState, useEffect } from 'react';
import type { ClassData } from '../types/class.types';
import { MOCK_CLASSES } from '../mocks/classes.mock';

export function useClasses(selectedSection: string) {
  // Initialize synchronously so there's no initial loading flash
  const [data, setData] = useState<ClassData | null>(() => {
    return MOCK_CLASSES.find(c => c.gradeSection === selectedSection) || MOCK_CLASSES[0];
  });
  const [isLoading] = useState(false); // Kept for future API compatibility

  useEffect(() => {
    const foundClass = MOCK_CLASSES.find(c => c.gradeSection === selectedSection) || MOCK_CLASSES[0];
    setData(foundClass);
  }, [selectedSection]);

  return { data, isLoading };
}
