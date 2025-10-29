'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Zap, Users, Globe } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'AI-Powered',
    description: 'Our intelligent chatbot provides personalized travel recommendations 24/7',
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description: 'Explore destinations from around the world with comprehensive travel data',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Benefit from real reviews and recommendations from fellow travelers',
  },
  {
    icon: CheckCircle,
    title: 'Easy Booking',
    description: 'Seamlessly book hotels, tours, and discover restaurants in one place',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-ocean-blue to-ocean-light text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">About Travelbot</h1>
          <p className="text-xl opacity-90">
            Your AI-powered travel companion for unforgettable journeys
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              At Travelbot, we believe that travel should be accessible, personalized, and
              unforgettable. Our mission is to empower travelers with intelligent tools and
              comprehensive information to plan and book their perfect trips.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              We leverage cutting-edge AI technology to provide personalized recommendations,
              real-time booking options, and expert travel insights tailored to your unique
              preferences and needs.
            </p>
          </div>
          <div className="bg-gradient-to-br from-ocean-light to-accent rounded-lg p-12 text-white">
            <div className="text-center">
              <Globe className="w-24 h-24 mx-auto mb-4 opacity-80" />
              <h3 className="text-2xl font-bold">Explore the World</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-dark-gray/50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Travelbot?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-none shadow-sm">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-ocean-blue/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-ocean-blue" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold mb-12 text-center">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-blue-50 dark:bg-blue-950/20 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold mb-3 text-ocean-blue">Innovation</h3>
            <p className="text-gray-700 dark:text-gray-300">
              We continuously innovate to bring you the latest AI technology and travel solutions.
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold mb-3 text-sand-yellow">Reliability</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Trust is at the core of everything we do. We ensure accurate, up-to-date travel information.
            </p>
          </div>

          <div className="bg-cyan-50 dark:bg-cyan-950/20 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold mb-3 text-accent">Community</h3>
            <p className="text-gray-700 dark:text-gray-300">
              We celebrate the global travel community and leverage shared experiences to help others.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-ocean-blue text-white py-12 px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg opacity-90 mb-4">
            Use our AI chatbot to get personalized recommendations and start planning your next adventure.
          </p>
          <p className="text-sm opacity-75">
            💬 Open the chat widget in the bottom right to get started!
          </p>
        </div>
      </section>
    </div>
  );
}
