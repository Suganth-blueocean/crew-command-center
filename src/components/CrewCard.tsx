import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  RefreshCw,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Code,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Crew, Execution, CrewStatus } from '@/lib/types';
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
  executions: Execution[];
  onExecute: (crewId: string, body?: Record<string, unknown>) => void;
  onSync: (crewId: string) => void;
  onDelete: (crewId: string) => void;
  isLoading?: boolean;
}

const statusConfig: Record<CrewStatus | 'idle', {
  icon: typeof Clock;
  label: string;
  className: string;
}> = {
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
};

function ExecutionItem({ execution }: { execution: Execution }) {
  const statusKey = execution.status || 'pending';
  const status = statusConfig[statusKey];
  const StatusIcon = status.icon;

  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/30 border border-border/30">
      <div className="flex items-center gap-3">
        <StatusIcon
          className={cn(
            'w-4 h-4',
            statusKey === 'running' && 'animate-spin',
            status.className
          )}
        />
        <span className="text-xs text-muted-foreground font-mono truncate max-w-[180px]">
          {execution.execution_id}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className={cn('text-xs font-medium', status.className)}>
          {status.label}
        </span>
        {execution.created_at && (
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(execution.created_at), { addSuffix: true })}
          </span>
        )}
      </div>
    </div>
  );
}

export function CrewCard({
  crew,
  executions,
  onExecute,
  onSync,
  onDelete,
  isLoading,
}: CrewCardProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const hasRunningExecution = executions.some((e) => e.status === 'running');

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
      </div>

      {/* Tasks */}
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

      {/* Executions List */}
      {executions.length > 0 && (
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {expanded ? 'Hide' : 'Show'} executions
          </button>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {executions.map((execution) => (
                  <ExecutionItem key={execution.execution_id} execution={execution} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-end pt-4 border-t border-border/30">
        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="icon"
            size="icon"
            onClick={() => onSync(crew.crew_id)}
            disabled={isLoading}
            className="h-8 w-8"
            title="Sync executions"
          >
            <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
          </Button>

          <Button
            type="button"
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
                disabled={hasRunningExecution || isLoading}
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
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
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
            variant={hasRunningExecution ? 'outline' : 'default'}
            size="sm"
            onClick={handleQuickExecute}
            disabled={hasRunningExecution || isLoading}
            className="ml-2"
          >
            {hasRunningExecution ? (
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
