import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  RefreshCw,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Code,
} from 'lucide-react';
import { Crew } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CrewCardProps {
  crew: Crew;
  onExecute: (crewId: string, body?: Record<string, unknown>) => void;
  onSync: (crewId: string) => void;
  onDelete: (crewId: string) => void;
  isLoading?: boolean;
}

/* ---------------- SAFE STATUS CONFIG ---------------- */

const statusConfig = {
  idle: {
    icon: Clock,
    label: 'Idle',
    className: 'status-pending',
  },
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
} as const;

/* ---------------- COMPONENT ---------------- */

export function CrewCard({
  crew,
  onExecute,
  onSync,
  onDelete,
  isLoading,
}: CrewCardProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  /* -------- STATUS (DEFENSIVE) -------- */

  const statusKey =
    (crew.status as keyof typeof statusConfig) ?? 'idle';

  const status = statusConfig[statusKey];
  const StatusIcon = status.icon;

  /* -------- HANDLERS -------- */

  const handleExecuteWithJson = () => {
    if (jsonInput.trim()) {
      try {
        const parsed = JSON.parse(jsonInput);
        setJsonError(null);
        onExecute(crew.crew_id, parsed);
        setDialogOpen(false);
        setJsonInput('');
      } catch {
        setJsonError('Invalid JSON format');
        return;
      }
    } else {
      onExecute(crew.crew_id);
      setDialogOpen(false);
    }
  };

  const handleQuickExecute = () => {
    onExecute(crew.crew_id);
  };

  /* -------- DATE HANDLING -------- */

  const createdAt = crew.created_at
    ? new Date(crew.created_at)
    : null;

  const updatedAt = crew.updated_at
    ? new Date(crew.updated_at)
    : null;

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
            {crew.crew_name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {crew.description}
          </p>
        </div>

        {/* Status Badge */}
        <div
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ml-4',
            'bg-muted/50 border border-border/50',
            status.className
          )}
        >
          <StatusIcon
            className={cn(
              'w-3.5 h-3.5',
              statusKey === 'running' && 'animate-spin'
            )}
          />
          {status.label}
        </div>
      </div>

      {/* Tasks (API RETURNS string[]) */}
      <div className="flex flex-wrap gap-2 mb-4">
        {crew.task_names?.map((taskName) => (
          <span
            key={taskName}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 text-xs text-muted-foreground"
          >
            <Code className="w-3 h-3" />
            {taskName}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border/30">
        <div className="text-xs text-muted-foreground">
          {updatedAt ? (
            <span>
              Last run{' '}
              {formatDistanceToNow(updatedAt, { addSuffix: true })}
            </span>
          ) : createdAt ? (
            <span>
              Created{' '}
              {formatDistanceToNow(createdAt, { addSuffix: true })}
            </span>
          ) : null}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="icon"
            size="icon"
            onClick={() => onSync(crew.crew_id)}
            disabled={isLoading}
            className="h-8 w-8"
          >
            <RefreshCw
              className={cn('w-4 h-4', isLoading && 'animate-spin')}
            />
          </Button>

          <Button
            variant="icon"
            size="icon"
            onClick={() => onDelete(crew.crew_id)}
            className="h-8 w-8 hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="icon"
                size="icon"
                disabled={statusKey === 'running' || isLoading}
                className="h-8 w-8"
                title="Execute with JSON input"
              >
                <Code className="w-4 h-4" />
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Execute with JSON Input</DialogTitle>
                <DialogDescription>
                  Provide optional JSON data as the request body.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="json-input">JSON Input (optional)</Label>
                  <Textarea
                    id="json-input"
                    value={jsonInput}
                    onChange={(e) => {
                      setJsonInput(e.target.value);
                      setJsonError(null);
                    }}
                    placeholder='{"key": "value"}'
                    className="font-mono text-sm min-h-[150px]"
                  />
                  {jsonError && (
                    <p className="text-sm text-destructive">{jsonError}</p>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleExecuteWithJson}>
                  <Play className="w-4 h-4" />
                  Execute
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant={statusKey === 'running' ? 'outline' : 'default'}
            size="sm"
            onClick={handleQuickExecute}
            disabled={statusKey === 'running' || isLoading}
            className="ml-2"
          >
            {statusKey === 'running' ? (
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
