"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface DashboardStats {
  streak: number;
  studyHoursToday: number;
}

interface DashboardStatsContextType {
  stats: DashboardStats;
  loading: boolean;
  refreshStats: () => Promise<void>;
}

const DashboardStatsContext = createContext<DashboardStatsContextType | undefined>(undefined);

export function DashboardStatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<DashboardStats>({
    streak: 0,
    studyHoursToday: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      if (res.ok) {
        const data = await res.json();
        setStats({
          streak: data.streak || 0,
          studyHoursToday: data.studyHoursToday || 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const refreshStats = async () => {
    await fetchStats();
  };

  return (
    <DashboardStatsContext.Provider value={{ stats, loading, refreshStats }}>
      {children}
    </DashboardStatsContext.Provider>
  );
}

export function useDashboardStats() {
  const context = useContext(DashboardStatsContext);
  if (context === undefined) {
    throw new Error("useDashboardStats must be used within DashboardStatsProvider");
  }
  return context;
}
