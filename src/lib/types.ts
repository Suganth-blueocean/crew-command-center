export interface Task {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Crew {
    //   crew_id: str
    // crew_name: str
    // description: str
    // task_names: List[str]
    // operator_id: str 
    // created_at: str
    // updated_at: str  
  crew_id: string;
  crew_name: string;
  description: string;
  task_names: string[];
  operator_id: string;
  created_at: string;
  updated_at: string;
  status: CrewStatus;
}

export type CrewStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface Execution {
  execution_id: string;
  crew_id: string;
  status: CrewStatus;
  created_at: string;
  updated_at?: string;
}

export interface CreateCrewPayload {
  crew_name: string;
  description: string;
  task_names: string[];
}
