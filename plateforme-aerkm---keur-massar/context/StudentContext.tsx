
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Etudiant, Evenement, User, Notification, ActivityLog, BureauMember } from '../types';

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
  bureauMembers: BureauMember[];
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
  addBureauMember: (member: Omit<BureauMember, 'id' | '_id'>) => Promise<boolean>;
  updateBureauMember: (member: BureauMember) => Promise<void>;
  deleteBureauMember: (id: string) => Promise<void>;
  markNotifAsRead: (id: string) => Promise<void>;
  clearNotifications: () => Promise<void>;
  updateSettings: (newSettings: SystemSettings) => Promise<void>;
  updateBureauStatus: (userId: string, isBureau: boolean, position: string) => Promise<void>;
  fetchData: () => Promise<void>;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

const API_BASE_URL = 'https://aerkm.onrender.com/api';

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Etudiant[]>([]);
  const [events, setEvents] = useState<Evenement[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [bureauMembers, setBureauMembers] = useState<BureauMember[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('aerkm_token')}`
  });

  const fetchData = async () => {
    console.log("🔄 Actualisation globale des données...");
    try {
      // 1. Fetch public data
      const resSettings = await fetch(`${API_BASE_URL}/settings`);
      if (resSettings.ok) {
        const settingsData = await resSettings.json();
        setSettings(settingsData);
      }

      const resEvents = await fetch(`${API_BASE_URL}/events`);
      if (resEvents.ok) {
        const eventsData = await resEvents.json();
        setEvents(eventsData);
      }

      // 2. Fetch protected data if logged in as ADMIN
      const savedUser = localStorage.getItem('aerkm_user');
      if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
        const user = JSON.parse(savedUser);
        if (user && user.role === 'ADMIN') {
          const h = getHeaders();
          
          const [resS, resA, resN, resL, resB] = await Promise.all([
            fetch(`${API_BASE_URL}/students`, { headers: h }),
            fetch(`${API_BASE_URL}/auth/admins`, { headers: h }),
            fetch(`${API_BASE_URL}/notifications`, { headers: h }),
            fetch(`${API_BASE_URL}/logs`, { headers: h }),
            fetch(`${API_BASE_URL}/auth/bureau`, { headers: h })
          ]);

          if (resS.ok) {
            const data = await resS.json();
            setStudents(Array.isArray(data) ? data : []);
          }
          
          if (resA.ok) {
            const data = await resA.json();
            setAdmins(Array.isArray(data) ? data : []);
          }
          
          if (resN.ok) {
            const data = await resN.json();
            setNotifications(Array.isArray(data) ? data : []);
          }
          
          if (resL.ok) {
            const data = await resL.json();
            setLogs(Array.isArray(data) ? data : []);
          }
          
          if (resB.ok) {
            const data = await resB.json();
            setBureauMembers(Array.isArray(data) ? data : []);
          }
        }
      }
      console.log("✅ Données actualisées avec succès");
    } catch (err) { 
      console.error("❌ Erreur lors du rafraîchissement:", err); 
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

  const updateBureauStatus = async (userId: string, isBureau: boolean, position: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/admins/${userId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ isBureau, bureauPosition: position })
    });
    if (res.ok) await fetchData();
  };

  const addEvent = async (event: any) => {
    const res = await fetch(`${API_BASE_URL}/events`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(event) });
    if (res.ok) await fetchData();
  };

  const updateEvent = async (event: Evenement) => {
    const res = await fetch(`${API_BASE_URL}/events/${event._id || event.id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(event) });
    if (res.ok) await fetchData();
  };

  const deleteEvent = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/events/${id}`, { method: 'DELETE', headers: getHeaders() });
    if (res.ok) await fetchData();
  };

  const updateStudent = async (student: Etudiant) => {
    const res = await fetch(`${API_BASE_URL}/students/${student._id || student.id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(student) });
    if (res.ok) await fetchData();
  };

  const deleteStudent = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/students/${id}`, { method: 'DELETE', headers: getHeaders() });
    if (res.ok) await fetchData();
  };

  const addAdmin = async (admin: any) => {
    const res = await fetch(`${API_BASE_URL}/auth/admins`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(admin) });
    if (res.ok) { await fetchData(); return true; }
    return false;
  };

  const updateAdmin = async (admin: any) => {
    const res = await fetch(`${API_BASE_URL}/auth/admins/${admin._id || admin.id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(admin) });
    if (res.ok) await fetchData();
  };

  const deleteAdmin = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/admins/${id}`, { method: 'DELETE', headers: getHeaders() });
    if (res.ok) await fetchData();
  };

  const addBureauMember = async (member: Omit<BureauMember, 'id' | '_id'>) => {
    const res = await fetch(`${API_BASE_URL}/auth/bureau`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(member) });
    if (res.ok) { await fetchData(); return true; }
    return false;
  };

  const updateBureauMember = async (member: BureauMember) => {
    const res = await fetch(`${API_BASE_URL}/auth/bureau/${member._id || member.id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(member) });
    if (res.ok) await fetchData();
  };

  const deleteBureauMember = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/bureau/${id}`, { method: 'DELETE', headers: getHeaders() });
    if (res.ok) await fetchData();
  };

  const markNotifAsRead = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/notifications/${id}`, { method: 'PUT', headers: getHeaders() });
    if (res.ok) await fetchData();
  };

  const clearNotifications = async () => {
    const res = await fetch(`${API_BASE_URL}/notifications`, { method: 'DELETE', headers: getHeaders() });
    if (res.ok) await fetchData();
  };

  const updateSettings = async (newSettings: SystemSettings) => {
    const res = await fetch(`${API_BASE_URL}/settings`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(newSettings) });
    if (res.ok) {
      const updatedData = await res.json();
      setSettings(updatedData);
    }
  };

  return (
    <StudentContext.Provider value={{ 
      students, events, admins, bureauMembers, notifications, logs, settings,
      addEvent, updateEvent, deleteEvent, 
      updateStudent, deleteStudent,
      addAdmin, updateAdmin, deleteAdmin,
      addBureauMember, updateBureauMember, deleteBureauMember,
      markNotifAsRead, clearNotifications,
      updateSettings, updateBureauStatus, fetchData
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
