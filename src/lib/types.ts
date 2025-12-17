export interface Task {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Crew {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  status: CrewStatus;
  createdAt: Date;
  lastRun?: Date;
}

export type CrewStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface CreateCrewPayload {
  crew_name: string;
  description: string;
  task_names: string[];
}
