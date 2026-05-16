import { useEffect, useState, useCallback } from "react";

const USER_KEY = "rose_glow_user";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export type DemoUser = {
  id?: string;
  email: string;
  name: string;
};

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "حدث خطأ في الاتصال بالسيرفر");
  }
  return data as T;
}

export function useAuth() {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
    setLoading(false);

    const onStorage = (e: StorageEvent) => {
      if (e.key === USER_KEY) {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const data = await apiRequest<{ user: DemoUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const data = await apiRequest<{ user: DemoUser }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  return { user, loading, signIn, signUp, signOut };
}

export type Booking = {
  id: string;
  userEmail: string;
  service: string;
  specialist: string;
  date: string;
  time: string;
  payment: string;
  reminderStatus?: string;
  createdAt: string;
};

export async function getBookings(userEmail: string): Promise<Booking[]> {
  const data = await apiRequest<{ bookings: Booking[] }>(`/bookings?userEmail=${encodeURIComponent(userEmail)}`);
  return data.bookings;
}

export async function addBooking(booking: Omit<Booking, "id" | "createdAt" | "specialist">): Promise<Booking> {
  const data = await apiRequest<{ booking: Booking }>("/bookings", {
    method: "POST",
    body: JSON.stringify(booking),
  });
  return data.booking;
}

export async function deleteBooking(id: string): Promise<void> {
  await apiRequest(`/bookings/${id}`, { method: "DELETE" });
}
