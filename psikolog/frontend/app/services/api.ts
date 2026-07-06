const API_BASE_URL = 'http://localhost:8006/api';

async function fetchJson(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    let errorDetail = 'Terjadi kesalahan pada server';
    try {
      const errData = await response.json();
      errorDetail = errData.detail || errorDetail;
    } catch {
      // Ignored
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

export const apiService = {
  // Auth
  async login(data: any) {
    return fetchJson('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async register(data: any) {
    return fetchJson('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Students
  async getStudents() {
    return fetchJson('/students');
  },

  async getStudentDetail(studentId: string) {
    return fetchJson(`/students/${studentId}`);
  },

  async getStudentSessions(studentId: string) {
    return fetchJson(`/students/${studentId}/sessions`);
  },

  // Recommendations
  async getRecommendations(studentId: string) {
    return fetchJson(`/students/${studentId}/recommendations`);
  },

  async saveRecommendation(studentId: string, data: { clinicalObservation: string; therapyPlan: string }, psychologistId: string) {
    return fetchJson(`/students/${studentId}/recommendations?psychologist_id=${psychologistId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
