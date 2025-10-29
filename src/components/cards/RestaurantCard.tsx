'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Restaurant } from '@/types';
import { Star, DollarSign, Utensils } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
      {restaurant.image_url && (
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <img
            src={restaurant.image_url}
            alt={restaurant.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{restaurant.name}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Utensils className="w-4 h-4" />
          {restaurant.cuisine_type}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Rating:
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-sand-yellow fill-sand-yellow" />
              <span className="font-semibold">{restaurant.rating}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Price Range:
            </span>
            <span className="flex items-center gap-1 font-semibold text-ocean-blue">
              <DollarSign className="w-4 h-4" />
              {restaurant.price_range}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
