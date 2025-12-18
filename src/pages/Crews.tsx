import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FolderOpen } from 'lucide-react';
import { CrewCard } from '@/components/CrewCard';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Crew } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const Crews = () => {
  const [crews, setCrews] = useState<Crew[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCrews = async () => {
    try {
      const response = await api.getCrews();
      setCrews(response.crews);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load crews.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCrews();
  }, []);

  const handleExecute = async (crewId: string, body?: Record<string, unknown>) => {
    try {
      const updatedCrew = await api.executeCrew(crewId, body);
      setCrews((prev) =>
        prev.map((c) => (c.crew_id === crewId ? updatedCrew : c))
      );
      toast({
        title: "Execution Started",
        description: "The crew is now running.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to execute crew.",
        variant: "destructive",
      });
    }
  };

  const handleSync = async (crewId: string) => {
    setSyncingId(crewId);
    try {
      const updatedCrew = await api.getCrewStatus(crewId);
      setCrews((prev) =>
        prev.map((c) => (c.crew_id === crewId ? updatedCrew : c))
      );
      toast({
        title: "Status Updated",
        // description: `Crew status: ${updatedCrew.status}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sync crew status.",
        variant: "destructive",
      });
    } finally {
      setSyncingId(null);
    }
  };

  const handleDelete = async (crewId: string) => {
    try {
      await api.deleteCrew(crewId);
      setCrews((prev) => prev.filter((c) => c.crew_id !== crewId));
      toast({
        title: "Crew Deleted",
        description: "The crew has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete crew.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 cyber-grid">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Crews</h1>
            <p className="text-muted-foreground">
              Manage and execute your AI agent crews
            </p>
          </div>
          <Button asChild variant="default">
            <Link to="/">
              <Plus className="w-4 h-4" />
              New Crew
            </Link>
          </Button>
        </motion.div>

        {/* Crews List */}
        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 rounded-lg bg-muted/20 animate-pulse"
              />
            ))}
          </div>
        ) : crews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="p-4 rounded-full bg-muted/50 mb-4">
              <FolderOpen className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No crews yet</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Create your first AI crew by selecting tasks and giving it a name.
            </p>
            <Button asChild variant="cyber">
              <Link to="/">
                <Plus className="w-4 h-4" />
                Create Your First Crew
              </Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {crews.map((crew, index) => (
                <motion.div
                  key={crew.crew_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CrewCard
                    crew={crew}
                    onExecute={handleExecute}
                    onSync={handleSync}
                    onDelete={handleDelete}
                    isLoading={syncingId === crew.crew_id}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Crews;
