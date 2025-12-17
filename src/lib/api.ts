import { Crew, CreateCrewPayload, CrewStatus } from './types';

const BASE = 'http://0.0.0.0:8000';

async function checkResponse(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res;
}

export const api = {
  // GET /crews - list crews (assumes backend has this route)
  async getCrews(): Promise<Crew[]> {
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
  async executeCrew(crewId: string): Promise<Crew> {
    const res = await fetch(`${BASE}/crews/${encodeURIComponent(crewId)}/execute`, {
      method: 'POST',
    });
    await checkResponse(res);
    return res.json();
  },

  // GET execution status. The user provided: /crews/{exec_id}execute/status
  // We'll call /crews/{execId}/execute/status which is the most likely intended path.
  async getCrewStatus(execId: string): Promise<Crew> {
    const res = await fetch(`${BASE}/crews/${encodeURIComponent(execId)}/execute/status`);
    await checkResponse(res);
    return res.json();
  },

  // DELETE /crews/{crew_id}
  async deleteCrew(crewId: string): Promise<void> {
    const res = await fetch(`${BASE}/crews/${encodeURIComponent(crewId)}`, { method: 'DELETE' });
    await checkResponse(res);
  },
};
