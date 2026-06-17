import React from 'react';
import { cn } from '@/lib/utils';

interface ActionCardProps {
  title: string;
  description: string;
  action: React.ReactNode;
  backgroundIcon?: React.ReactNode;
  className?: string;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  action,
  backgroundIcon,
  className
}) => {
  return (
    <div className={cn("gani-action-card", className)}>
      {backgroundIcon && (
        <div className="gani-action-card-bg">
          {backgroundIcon}
        </div>
      )}
      <h3 className="gani-heading-section mb-2">{title}</h3>
      <p className="gani-text-body mb-6 max-w-xl">
        {description}
      </p>
      {action}
    </div>
  );
};