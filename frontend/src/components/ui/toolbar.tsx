import React from 'react';
import { cn } from '@/lib/utils';

interface ToolbarProps {
  children: React.ReactNode;
  className?: string;
}

interface ToolbarSectionProps {
  children: React.ReactNode;
  className?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({ children, className }) => {
  return (
    <div className={cn("gani-toolbar", className)}>
      {children}
    </div>
  );
};

export const ToolbarSection: React.FC<ToolbarSectionProps> = ({ children, className }) => {
  return (
    <div className={cn("gani-toolbar-section", className)}>
      {children}
    </div>
  );
};