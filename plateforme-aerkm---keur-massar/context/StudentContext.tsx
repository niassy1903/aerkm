
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Etudiant, Evenement, User, Notification, ActivityLog } from '../types';

interface StudentContextType {
  students: Etudiant[];
  events: Evenement[];
  admins: User[];
  notifications: Notification[];
  logs: ActivityLog[];
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
  fetchData: () => Promise<void>;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);
const API_BASE_URL = 'http://localhost:5000/api';

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Etudiant[]>([]);
  const [events, setEvents] = useState<Evenement[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('aerkm_token')}`
  });

  const fetchData = async () => {
    try {
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
    const interval = setInterval(fetchData, 30000); // Polling léger
    return () => clearInterval(interval);
  }, []);

  // Events
  const addEvent = async (event: any) => {
    const res = await fetch(`${API_BASE_URL}/events`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(event) });
    if (res.ok) {
      await fetch(`${API_BASE_URL}/logs`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ action: 'EVENT_ADD', details: `Evénement créé: ${event.titre}`, adminId: 'ADMIN' }) });
      fetchData();
    }
  };

  const updateEvent = async (event: Evenement) => {
    const res = await fetch(`${API_BASE_URL}/events/${event._id || event.id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(event) });
    if (res.ok) fetchData();
  };

  const deleteEvent = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/events/${id}`, { method: 'DELETE', headers: getHeaders() });
    if (res.ok) fetchData();
  };

  // Students
  const updateStudent = async (student: Etudiant) => {
    const res = await fetch(`${API_BASE_URL}/students/${student._id || student.id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(student) });
    if (res.ok) fetchData();
  };

  const deleteStudent = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/students/${id}`, { method: 'DELETE', headers: getHeaders() });
    if (res.ok) fetchData();
  };

  // Admins
  const addAdmin = async (admin: any) => {
    const res = await fetch(`${API_BASE_URL}/auth/admins`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(admin) });
    if (res.ok) {
      fetchData();
      return true;
    }
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

  // Notifs
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
      students, events, admins, notifications, logs,
      addEvent, updateEvent, deleteEvent, 
      updateStudent, deleteStudent,
      addAdmin, updateAdmin, deleteAdmin,
      markNotifAsRead, clearNotifications,
      fetchData
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
