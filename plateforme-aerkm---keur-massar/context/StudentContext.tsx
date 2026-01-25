
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Etudiant, Evenement, User, Notification, ActivityLog } from '../types';

interface SystemSettings {
  academicYear: string;
  registrationOpen: boolean;
  maintenanceMode: boolean;
  emailNotifications: boolean;
  smsAlerts: boolean;
  dataRetention: string;
}

interface StudentContextType {
  students: Etudiant[];
  events: Evenement[];
  admins: User[];
  notifications: Notification[];
  logs: ActivityLog[];
  settings: SystemSettings | null;
  addEvent: (event: Omit<Evenement, 'id' | 'dateCreation'>) => Promise<void>;
  updateEvent: (event: Evenement) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  updateStudent: (student: Etudiant) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  addAdmin: (admin: any) => Promise<boolean>;
  updateAdmin: (admin: any) => Promise<void>;
  deleteAdmin: (id: string) => Promise<void>;
  markNotifAsRead: (id: string) => Promise<void>;
  clearNotifications: () => Promise<void>;
  updateSettings: (newSettings: SystemSettings) => Promise<void>;
  fetchData: () => Promise<void>;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);
const API_BASE_URL = 'https://aerkm.onrender.com/api';

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Etudiant[]>([]);
  const [events, setEvents] = useState<Evenement[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('aerkm_token')}`
  });

  const fetchData = async () => {
    try {
      // Paramètres publics
      const resSettings = await fetch(`${API_BASE_URL}/settings`);
      if (resSettings.ok) setSettings(await resSettings.json());

      // Événements publics
      const resEvents = await fetch(`${API_BASE_URL}/events`);
      if (resEvents.ok) setEvents(await resEvents.json());

      const user = JSON.parse(localStorage.getItem('aerkm_user') || '{}');
      if (user.role === 'ADMIN') {
        const h = getHeaders();
        const [resS, resA, resN, resL] = await Promise.all([
          fetch(`${API_BASE_URL}/students`, { headers: h }),
          fetch(`${API_BASE_URL}/auth/admins`, { headers: h }),
          fetch(`${API_BASE_URL}/notifications`, { headers: h }),
          fetch(`${API_BASE_URL}/logs`, { headers: h })
        ]);

        // Fix: corrected line 71 to properly await the JSON response and removed redundant conditional check
        if (resS.ok) setStudents(await resS.json());
        if (resA.ok) setAdmins(await resA.json());
        if (resN.ok) setNotifications(await resN.json());
        if (resL.ok) setLogs(await resL.json());
      }
    } catch (err) {
      console.error('Fetch data error:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateSettings = async (newSettings: SystemSettings) => {
    const res = await fetch(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(newSettings)
    });
    if (res.ok) setSettings(await res.json());
  };

  // ... (Autres méthodes addEvent, updateEvent, etc. inchangées)

  const addEvent = async (event: any) => {
    const res = await fetch(`${API_BASE_URL}/events`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(event) });
    if (res.ok) fetchData();
  };

  const updateEvent = async (event: Evenement) => {
    const res = await fetch(`${API_BASE_URL}/events/${event._id || event.id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(event) });
    if (res.ok) fetchData();
  };

  const deleteEvent = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/events/${id}`, { method: 'DELETE', headers: getHeaders() });
    if (res.ok) fetchData();
  };

  const updateStudent = async (student: Etudiant) => {
    const res = await fetch(`${API_BASE_URL}/students/${student._id || student.id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(student) });
    if (res.ok) fetchData();
  };

  const deleteStudent = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/students/${id}`, { method: 'DELETE', headers: getHeaders() });
    if (res.ok) fetchData();
  };

  const addAdmin = async (admin: any) => {
    const res = await fetch(`${API_BASE_URL}/auth/admins`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(admin) });
    if (res.ok) { fetchData(); return true; }
    return false;
  };

  const updateAdmin = async (admin: any) => {
    const res = await fetch(`${API_BASE_URL}/auth/admins/${admin._id || admin.id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(admin) });
    if (res.ok) fetchData();
  };

  const deleteAdmin = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/admins/${id}`, { method: 'DELETE', headers: getHeaders() });
    if (res.ok) fetchData();
  };

  const markNotifAsRead = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/notifications/${id}`, { method: 'PUT', headers: getHeaders() });
    if (res.ok) fetchData();
  };

  const clearNotifications = async () => {
    const res = await fetch(`${API_BASE_URL}/notifications`, { method: 'DELETE', headers: getHeaders() });
    if (res.ok) fetchData();
  };

  return (
    <StudentContext.Provider value={{ 
      students, events, admins, notifications, logs, settings,
      addEvent, updateEvent, deleteEvent, 
      updateStudent, deleteStudent,
      addAdmin, updateAdmin, deleteAdmin,
      markNotifAsRead, clearNotifications,
      updateSettings, fetchData
    }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(StudentContext);
  if (!context) throw new Error('useData must be used within StudentProvider');
  return context;
};