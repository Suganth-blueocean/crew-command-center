import { Crew, CreateCrewPayload, Execution, Executions } from './types';

const BASE = 'http://0.0.0.0:8000';

async function checkResponse(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res;
}

export const api = {
  // GET /crews - list crews
  async getCrews(): Promise<{crews: Crew[]}> {
    const res = await fetch(`${BASE}/crews`);
    await checkResponse(res);
    return res.json();
  },

  // POST /crew - create a crew
  async createCrew(payload: CreateCrewPayload): Promise<Crew> {
    const res = await fetch(`${BASE}/crew`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    await checkResponse(res);
    return res.json();
  },

  // POST /crews/{crew_id}/execute - execute a crew
  async executeCrew(crewId: string, body?: Record<string, unknown>): Promise<Crew> {
    const res = await fetch(`${BASE}/crews/${encodeURIComponent(crewId)}/execute`, {
      method: 'POST',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    await checkResponse(res);
    return res.json();
  },

  // GET /executions?crew_id= - get executions for a crew
  async getCrewExecutions(crewId: string): Promise<Executions> {
    const res = await fetch(`${BASE}/executions?crew_id=${encodeURIComponent(crewId)}`);
    await checkResponse(res);
    return res.json();
  },

  // DELETE /crews/{crew_id}
  async deleteCrew(crewId: string): Promise<void> {
    const res = await fetch(`${BASE}/crews/${encodeURIComponent(crewId)}`, { method: 'DELETE' });
    await checkResponse(res);
  },
};
