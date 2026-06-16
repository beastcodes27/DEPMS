import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'cyan';
}

export function StatCard({
  title,
  value,
  description,
  trend = 'neutral',
  trendValue,
  icon,
  color = 'blue',
}: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400',
    green: 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400',
    red: 'bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 dark:text-rose-400',
    purple: 'bg-violet-500/10 text-violet-500 dark:bg-violet-500/20 dark:text-violet-400',
    cyan: 'bg-cyan-500/10 text-cyan-500 dark:bg-cyan-500/20 dark:text-cyan-400',
  };

  const trendIcons = {
    up: <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />,
    down: <TrendingDown className="h-3.5 w-3.5 text-rose-500" />,
    neutral: <Minus className="h-3.5 w-3.5 text-muted-foreground" />,
  };

  const trendColors = {
    up: 'text-emerald-500',
    down: 'text-rose-500',
    neutral: 'text-muted-foreground',
  };

  return (
    <Card className="relative overflow-hidden rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
            
            {(trendValue || description) && (
              <div className="flex items-center gap-2 mt-2">
                {trendValue && (
                  <div className={cn('flex items-center gap-1 text-xs font-medium', trendColors[trend])}>
                    {trendIcons[trend]}
                    {trendValue}
                  </div>
                )}
                {description && (
                  <span className="text-xs text-muted-foreground">{description}</span>
                )}
              </div>
            )}
          </div>
          
          <div className={cn(
            'p-3 rounded-xl transition-transform duration-300 group-hover:scale-110',
            colorClasses[color]
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
