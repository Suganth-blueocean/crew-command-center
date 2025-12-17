import { motion } from 'framer-motion';
import { Play, RefreshCw, Trash2, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Crew } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface CrewCardProps {
  crew: Crew;
  onExecute: (crewId: string) => void;
  onSync: (crewId: string) => void;
  onDelete: (crewId: string) => void;
  isLoading?: boolean;
}

const statusConfig = {
  pending: {
    icon: Clock,
    label: 'Pending',
    className: 'status-pending',
  },
  running: {
    icon: Loader2,
    label: 'Running',
    className: 'status-running',
  },
  completed: {
    icon: CheckCircle2,
    label: 'Completed',
    className: 'status-completed',
  },
  failed: {
    icon: XCircle,
    label: 'Failed',
    className: 'status-failed',
  },
};

export function CrewCard({ crew, onExecute, onSync, onDelete, isLoading }: CrewCardProps) {
  const status = statusConfig[crew.status];
  const StatusIcon = status.icon;

  return (
    <motion.div
      className="glass-card rounded-lg p-6 border border-border/50 hover:border-primary/30 transition-all duration-300 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors truncate">
            {crew.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {crew.description}
          </p>
        </div>
        
        {/* Status Badge */}
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ml-4",
          "bg-muted/50 border border-border/50",
          status.className
        )}>
          <StatusIcon className={cn(
            "w-3.5 h-3.5",
            crew.status === 'running' && "animate-spin"
          )} />
          {status.label}
        </div>
      </div>

      {/* Tasks */}
      <div className="flex flex-wrap gap-2 mb-4">
        {crew.tasks.map((task) => (
          <span
            key={task.id}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 text-xs text-muted-foreground"
          >
            <span>{task.icon}</span>
            {task.name}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border/30">
        <div className="text-xs text-muted-foreground">
          {crew.lastRun ? (
            <span>Last run {formatDistanceToNow(crew.lastRun, { addSuffix: true })}</span>
          ) : (
            <span>Created {formatDistanceToNow(crew.createdAt, { addSuffix: true })}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="icon"
            size="icon"
            onClick={() => onSync(crew.id)}
            disabled={isLoading}
            className="h-8 w-8"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </Button>
          
          <Button
            variant="icon"
            size="icon"
            onClick={() => onDelete(crew.id)}
            className="h-8 w-8 hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          
          <Button
            variant={crew.status === 'running' ? 'outline' : 'default'}
            size="sm"
            onClick={() => onExecute(crew.id)}
            disabled={crew.status === 'running' || isLoading}
            className="ml-2"
          >
            {crew.status === 'running' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Running
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Execute
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
