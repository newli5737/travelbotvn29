'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tour } from '@/types';
import { MapPin, Calendar, DollarSign } from 'lucide-react';

interface TourCardProps {
  tour: Tour;
}

export const TourCard: React.FC<TourCardProps> = ({ tour }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
      {tour.image_url && (
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
          <Image
            src={tour.image_url}
            alt={tour.name}
            fill
            className="object-cover hover:scale-105 transition-transform"
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{tour.name}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {tour.destinations?.join(', ')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {tour.description}
        </p>
        <div className="space-y-2 pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-ocean-blue" />
              <span>{tour.duration_days} days</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Price per person:
            </span>
            <span className="flex items-center gap-1 font-semibold text-sand-yellow text-lg">
              <DollarSign className="w-4 h-4" />
              {tour.price}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
