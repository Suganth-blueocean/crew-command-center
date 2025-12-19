import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { TaskBlock } from '@/components/TaskBlock';
import { CreateCrewModal } from '@/components/CreateCrewModal';
import { Button } from '@/components/ui/button';
import { availableTasks } from '@/lib/mockData';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleTaskToggle = (taskId: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const selectedTasks = availableTasks.filter((t) => selectedTaskIds.includes(t.id));

  const handleCreateCrew = async (crew_name: string, description: string) => {
    try {
      await api.createCrew({
        crew_name,
        description,
        task_names: selectedTaskIds,
      });

      toast({
        title: "Crew Created",
        description: `"${crew_name}" is ready to execute.`,
      });

      setSelectedTaskIds([]);
      navigate('/crews');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create crew. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 cyber-grid">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Task Automation
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Build Your <span className="text-primary neon-text">Crew</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the tasks you need and orchestrate powerful AI workflows.
            Combine multiple capabilities into a single automated crew.
          </p>
        </motion.div>

        {/* Task Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {availableTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <TaskBlock
                task={task}
                isSelected={selectedTaskIds.includes(task.id)}
                onToggle={handleTaskToggle}
              />
            </motion.div>
          ))}
        </div>

        {/* Selection Summary & Create Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-xl glass-card border border-border/50"
        >
          <div>
            <span className="text-muted-foreground">
              {selectedTaskIds.length === 0 ? (
                "Select tasks to build your crew"
              ) : (
                <>
                  <span className="text-primary font-semibold">{selectedTaskIds.length}</span>
                  {" task"}{selectedTaskIds.length !== 1 && "s"} selected
                </>
              )}
            </span>
          </div>

          <Button
            variant="cyber"
            size="lg"
            disabled={selectedTaskIds.length === 0}
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto"
          >
            Create Crew
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>

      {/* Create Modal */}
      <CreateCrewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCrew}
        selectedTasks={selectedTasks}
      />
    </div>
  );
};

export default Index;
