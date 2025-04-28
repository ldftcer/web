import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  change?: {
    value: string;
    trend: 'up' | 'down';
  };
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  iconColor, 
  iconBgColor,
  change 
}: StatsCardProps) {
  return (
    <div className="bg-card rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-muted-foreground text-sm">{title}</div>
          <div className="text-3xl font-bold mt-1">{value}</div>
          
          {change && (
            <div className={cn(
              "text-sm mt-2 flex items-center",
              change.trend === 'up' ? "text-green-500" : "text-red-500"
            )}>
              <svg 
                className={cn(
                  "h-4 w-4 mr-1",
                  change.trend === 'down' && "transform rotate-180"
                )}
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              {change.value} from last month
            </div>
          )}
        </div>
        
        <div className={cn(
          "p-3 rounded-lg",
          iconBgColor
        )}>
          <Icon className={cn(
            "h-6 w-6",
            iconColor
          )} />
        </div>
      </div>
    </div>
  );
}
