const PSYCHOLOGIST_KEY = 'dyleks_psychologist_user';
const TOKEN_KEY = 'dyleks_psychologist_token';

export function getPsychologistUser() {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(PSYCHOLOGIST_KEY);
  return user ? JSON.parse(user) : null;
}

export function savePsychologistUser(user: any) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PSYCHOLOGIST_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, user.id); // Store ID as simple session token
}

export function clearPsychologistUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PSYCHOLOGIST_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(TOKEN_KEY);
}
