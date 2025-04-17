"use client"

import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { activityService } from "@/lib/services/activityService"
import { useEffect, useState } from "react"
import { DashboardStats } from "@/components/dashboard/DashboardStats"

interface Activity {
  id: string;
  type: "create" | "update" | "delete" | "complete" | "start";
  taskName: string;
  timestamp: string;
}

export default function DashboardPage() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const recentActivities = await activityService.getRecentActivities();
        setActivities(recentActivities);
      } catch (error) {
        console.error("Erreur lors du chargement des activités:", error);
      }
    };

    loadActivities();
  }, []);

  return (
    <div className="container py-8">
      <div className="relative mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-600 bg-clip-text text-transparent">
          Tableau de bord
        </h1>
        <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full" />
        <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full blur-sm" />
      </div>

      <DashboardStats />

      <div className="mt-8">
        <RecentActivity activities={activities} />
      </div>
    </div>
  )
} 