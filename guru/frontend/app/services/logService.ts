import { ActivityLog } from '../types';
import { isClient, LOGS_KEY } from './storage';

export const getLogs = (teacherId: string): ActivityLog[] => {
  if (!isClient()) return [];
  const data = localStorage.getItem(LOGS_KEY);
  const allLogs: ActivityLog[] = data ? JSON.parse(data) : [];
  return allLogs.filter(l => l.teacherId === teacherId);
};

export const saveLogs = (logs: ActivityLog[]) => {
  if (!isClient()) return;
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
};

export const addActivityLog = (teacherId: string, studentName: string, action: string) => {
  if (!isClient()) return;
  
  const data = localStorage.getItem(LOGS_KEY);
  const allLogs: ActivityLog[] = data ? JSON.parse(data) : [];
  
  const newLog: ActivityLog = {
    id: Math.random().toString(36).substr(2, 9),
    teacherId,
    studentName,
    action,
    timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' - Hari ini'
  };
  
  allLogs.unshift(newLog); // Put new logs at the beginning
  saveLogs(allLogs);
};
