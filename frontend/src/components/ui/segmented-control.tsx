import React from 'react';
import { cn } from '@/lib/utils';

interface SegmentedControlOption {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  className
}) => {
  return (
    <div className={cn("gani-segmented-container", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "gani-segmented-button",
            value === option.value 
              ? "gani-segmented-active" 
              : "gani-segmented-inactive"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};