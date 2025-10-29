'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Compass, MapPin, Users, Utensils } from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: 'Explore Destinations',
    description: 'Discover amazing travel destinations around the world',
    href: '/destinations',
  },
  {
    icon: Compass,
    title: 'Find Tours',
    description: 'Browse curated tour packages for unforgettable experiences',
    href: '/tours',
  },
  {
    icon: Users,
    title: 'Book Hotels',
    description: 'Find the perfect place to stay with our hotel listings',
    href: '/hotels',
  },
  {
    icon: Utensils,
    title: 'Discover Restaurants',
    description: 'Experience local cuisine at recommended restaurants',
    href: '/restaurants',
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-ocean-blue to-ocean-light text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Your AI Travel Companion 🌍
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Discover, plan, and book your perfect vacation with Travelbot
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/destinations">
              <Button
                size="lg"
                className="bg-sand-yellow text-dark-gray hover:bg-sand-light"
              >
                Start Exploring
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Explore with Travelbot
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.href} href={feature.href}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-ocean-blue">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-ocean-light/10 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-ocean-blue" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-ocean-blue/5 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Plan Your Trip?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Use our AI chatbot to get personalized travel recommendations, 
            book hotels and tours, and plan the perfect itinerary.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            💬 Start chatting with our AI assistant in the bottom right corner
          </p>
        </div>
      </section>
    </div>
  );
}
