'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminLayout } from '@/components/admin/AdminLayout';
import axiosClient from '@/lib/axiosClient';
import { ApiResponse } from '@/types';
import { BarChart3, Users, MapPin, Hotel, Compass } from 'lucide-react';

interface DashboardStats {
  destinations_count: number;
  hotels_count: number;
  tours_count: number;
  restaurants_count: number;
  activities_count: number;
  reviews_count: number;
}

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}> = ({ icon, label, value, color }) => (
  <Card className="border-none shadow-sm">
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await axiosClient.get<ApiResponse<DashboardStats>>(
        '/admin/dashboard/stats'
      );
      if (response.data.data) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's an overview of your travel data.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              icon={<MapPin className="w-6 h-6 text-white" />}
              label="Destinations"
              value={stats.destinations_count}
              color="bg-ocean-blue"
            />
            <StatCard
              icon={<Hotel className="w-6 h-6 text-white" />}
              label="Hotels"
              value={stats.hotels_count}
              color="bg-sand-yellow text-dark-gray"
            />
            <StatCard
              icon={<Compass className="w-6 h-6 text-white" />}
              label="Tours"
              value={stats.tours_count}
              color="bg-accent"
            />
            <StatCard
              icon={<Users className="w-6 h-6 text-white" />}
              label="Restaurants"
              value={stats.restaurants_count}
              color="bg-green-500"
            />
            <StatCard
              icon={<BarChart3 className="w-6 h-6 text-white" />}
              label="Activities"
              value={stats.activities_count}
              color="bg-purple-500"
            />
            <StatCard
              icon={<Users className="w-6 h-6 text-white" />}
              label="Reviews"
              value={stats.reviews_count}
              color="bg-indigo-500"
            />
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                Failed to load statistics. Please try again later.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage your travel data quickly and efficiently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/admin/destinations"
                className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow text-center"
              >
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  Manage Destinations
                </p>
              </a>
              <a
                href="/admin/hotels"
                className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800 hover:shadow-md transition-shadow text-center"
              >
                <p className="font-semibold text-amber-900 dark:text-amber-100">
                  Manage Hotels
                </p>
              </a>
              <a
                href="/admin/tours"
                className="p-4 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg border border-cyan-200 dark:border-cyan-800 hover:shadow-md transition-shadow text-center"
              >
                <p className="font-semibold text-cyan-900 dark:text-cyan-100">
                  Manage Tours
                </p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
