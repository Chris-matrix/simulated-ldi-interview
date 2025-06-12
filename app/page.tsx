'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, MessageSquare, PlayCircle, HelpCircle } from "lucide-react";
import { ReactElement } from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactElement;
  href: string;
  buttonText: string;
  variant: 'default' | 'outline' | 'ghost' | 'link' | 'secondary' | 'destructive' | null | undefined;
}

const FeatureCard = ({
  title,
  description,
  icon,
  href,
  buttonText,
  variant
}: FeatureCardProps) => (
  <Card className="group bg-card/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border border-border hover:border-primary/20 overflow-hidden">
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-foreground">
          {title}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-center py-4">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Link href={href} className="w-full">
          <Button 
            variant={variant} 
            className="w-full group-hover:shadow-md transition-all duration-300"
          >
            {buttonText}
            {variant === 'default' && (
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            )}
          </Button>
        </Link>
      </CardFooter>
    </div>
  </Card>
);

export default function Home() {
  const features = [
    {
      title: "Start New Interview",
      description: "Choose a profession to interview",
      icon: <MessageSquare className="h-12 w-12 text-primary" />,
      href: "/select-profession",
      buttonText: "Get Started",
      variant: "default" as const,
    },
    {
      title: "Resume Interview",
      description: "Continue your previous interview",
      icon: <PlayCircle className="h-12 w-12 text-primary" />,
      href: "/interview",
      buttonText: "Resume Interview",
      variant: "outline" as const,
    },
    {
      title: "How It Works",
      description: "Learn how to use this tool",
      icon: <HelpCircle className="h-12 w-12 text-primary" />,
      href: "/how-it-works",
      buttonText: "Learn More",
      variant: "outline" as const,
    },
  ]

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12 bg-gradient-to-b from-background to-muted/30">
      <div className="w-full max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Life Design Interview Simulator
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Practice interviewing professionals in careers you're interested in exploring
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              href={feature.href}
              buttonText={feature.buttonText}
              variant={feature.variant}
            />
          ))}
        </div>

        <div className="bg-card/90 p-8 rounded-xl border border-border shadow-sm">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-2xl font-bold text-foreground">
              About Life Design Interviews
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Life Design Interviews (LDIs) are intentional conversations where students ask questions about a
              professional&apos;s career path, decision-making, and lessons learned. These interviews help clarify your own
              goals and imagine possible futures.
            </p>
            <div className="pt-4">
              <Link href="/select-profession">
                <Button size="lg" className="group">
                  Start Your Interview Journey
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
