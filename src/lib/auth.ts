// Sistema de autenticacion para el Portal Rhinoberto - SLA Asociados
// Autenticacion local con session storage. En produccion se recomienda JWT o OAuth2.

export type UserRole = "admin" | "manager" | "viewer";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarInitials: string;
}

const STORAGE_KEY = "rinoberto_session_v1";

export const DEMO_USERS: Record<string, { password: string; user: SessionUser }> = {
  "admin@sla.com": {
    password: "rinoberto",
    user: {
      id: "u_admin_1",
      email: "admin@sla.com",
      name: "Carlos Ortega",
      role: "admin",
      avatarInitials: "CO",
    },
  },
  "manager@sla.com": {
    password: "rinoberto",
    user: {
      id: "u_mgr_1",
      email: "manager@sla.com",
      name: "Lucía Rojas",
      role: "manager",
      avatarInitials: "LR",
    },
  },
  "viewer@sla.com": {
    password: "rinoberto",
    user: {
      id: "u_view_1",
      email: "viewer@sla.com",
      name: "Miguel Ángel",
      role: "viewer",
      avatarInitials: "MA",
    },
  },
};

export function getSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function signIn(email: string, password: string): SessionUser | null {
  const record = DEMO_USERS[email.trim().toLowerCase()];
  if (!record || record.password !== password) return null;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record.user));
    window.dispatchEvent(new Event("rinoberto:auth"));
  }
  return record.user;
}

export function signOut() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("rinoberto:auth"));
}

export const ROLE_LABEL: Record<UserRole, string> = {
  admin: "Administrador",
  manager: "Gerente",
  viewer: "Observador",
};

export const PERMISSIONS = {
  canManageUsers: (r: UserRole) => r === "admin",
  canEditAutomations: (r: UserRole) => r === "admin" || r === "manager",
  canExportReports: (r: UserRole) => r === "admin" || r === "manager",
} as const;
