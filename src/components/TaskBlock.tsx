import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Task } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TaskBlockProps {
  task: Task;
  isSelected: boolean;
  onToggle: (taskId: string) => void;
}

export function TaskBlock({ task, isSelected, onToggle }: TaskBlockProps) {
  return (
    <motion.button
      onClick={() => onToggle(task.id)}
      className={cn(
        "relative p-6 rounded-lg border text-left transition-all duration-300 group",
        "glass-card overflow-hidden",
        isSelected
          ? "border-primary shadow-glow-md bg-primary/5"
          : "border-border/50 hover:border-primary/50 hover:shadow-glow-sm"
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Selection indicator */}
      <div
        className={cn(
          "absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
          isSelected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/30 group-hover:border-primary/50"
        )}
      >
        {isSelected && <Check className="w-4 h-4" />}
      </div>

      {/* Icon */}
      <div className="text-4xl mb-4">{task.icon}</div>

      {/* Content */}
      <h3 className={cn(
        "font-semibold text-lg mb-2 transition-colors duration-300",
        isSelected ? "text-primary neon-text" : "text-foreground group-hover:text-primary"
      )}>
        {task.name}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {task.description}
      </p>

      {/* Glow effect on hover */}
      <div className={cn(
        "absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none rounded-lg",
        "bg-gradient-to-br from-primary/10 to-accent/5",
        isSelected ? "opacity-100" : "group-hover:opacity-50"
      )} />
    </motion.button>
  );
}
