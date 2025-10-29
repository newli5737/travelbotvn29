'use client';

import React, { useEffect, useState } from 'react';
import { RestaurantCard } from '@/components/cards/RestaurantCard';
import { Restaurant, ApiResponse } from '@/types';
import axiosClient from '@/lib/axiosClient';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axiosClient.get<ApiResponse<Restaurant[]>>(
        '/restaurants'
      );
      if (response.data.data) {
        setRestaurants(response.data.data);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load restaurants'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-ocean-blue to-ocean-light text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Restaurants 🍽️
          </h1>
          <p className="text-lg opacity-90">
            Experience amazing cuisine at recommended restaurants
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg mb-8 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-lg" />
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No restaurants found. Please try again later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
