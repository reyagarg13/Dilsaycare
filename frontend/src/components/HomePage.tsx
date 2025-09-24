import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import anime from 'animejs';
import { Button } from './ui';
import { Calendar, Clock, Users, Sparkles, ArrowRight, Star, Shield, Zap } from 'lucide-react';

interface HomePageProps {
  onGetStarted: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!hasAnimated.current) {
      hasAnimated.current = true;
      
      // Hero animations
      anime({
        targets: '.hero-title',
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutQuart',
      });
      
      anime({
        targets: '.hero-subtitle',
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 800,
        delay: 300,
        easing: 'easeOutQuart',
      });
      
      anime({
        targets: '.hero-buttons',
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 600,
        delay: 600,
        easing: 'easeOutQuart',
      });
      
      // Feature cards stagger animation
      anime({
        targets: '.feature-card',
        translateY: [40, 0],
        opacity: [0, 1],
        duration: 600,
        delay: anime.stagger(200, {start: 1000}),
        easing: 'easeOutQuart',
      });
      
      // Stats animation
      anime({
        targets: '.stat-number',
        innerHTML: [0, (el: any) => el.getAttribute('data-count')],
        duration: 2000,
        delay: 1500,
        easing: 'easeOutQuart',
        round: 1,
      });
    }
  }, []);

  const features = [
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "AI-powered scheduling that adapts to your needs and preferences automatically.",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Instant synchronization across all devices with real-time notifications.",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamlessly collaborate with your team and manage group schedules.",
      gradient: "from-pink-500 to-red-600"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Enterprise-grade security to keep your data safe and confidential.",
      gradient: "from-green-500 to-teal-600"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance for quick loading and smooth interactions.",
      gradient: "from-yellow-500 to-orange-600"
    },
    {
      icon: Star,
      title: "Premium Experience",
      description: "Beautiful, intuitive design with attention to every detail.",
      gradient: "from-indigo-500 to-blue-600"
    }
  ];

  const stats = [
    { number: 10000, label: "Active Users", suffix: "+" },
    { number: 50000, label: "Appointments Scheduled", suffix: "+" },
    { number: 99, label: "Uptime Guarantee", suffix: "%" },
    { number: 24, label: "Support Available", suffix: "/7" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DilsayCare
            </span>
          </motion.div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
            <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
            <Button variant="gradient" onClick={onGetStarted}>
              Get Started
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center" ref={heroRef}>
          <motion.div className="floating-element mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          
          <h1 className="hero-title text-6xl md:text-8xl font-black mb-8 opacity-0">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
              Schedule
            </span>
            <br />
            <span className="text-gray-900">Smarter</span>
          </h1>
          
          <p className="hero-subtitle text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 opacity-0">
            The most beautiful and intelligent scheduling platform designed for healthcare professionals. 
            Streamline your appointments with AI-powered automation.
          </p>
          
          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center opacity-0">
            <Button 
              variant="gradient" 
              size="lg" 
              onClick={onGetStarted}
              className="text-lg px-8 py-4"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Start Scheduling
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="secondary" 
              size="lg"
              className="text-lg px-8 py-4"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + index * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  <span className="stat-number" data-count={stat.number}>0</span>
                  {stat.suffix}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6" ref={featuresRef}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your schedule efficiently and beautifully.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="feature-card opacity-0 group cursor-pointer"
                  whileHover={{ y: -10, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold mb-6">
              Ready to Transform Your Scheduling?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of healthcare professionals who trust DilsayCare for their scheduling needs.
            </p>
            <Button 
              variant="secondary"
              size="lg"
              onClick={onGetStarted}
              className="bg-white text-gray-900 hover:bg-gray-50 text-lg px-8 py-4"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Get Started Free
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">DilsayCare</span>
          </div>
          <p className="text-gray-400 mb-4">
            Intelligent scheduling for the modern healthcare professional.
          </p>
          <p className="text-gray-500 text-sm">
            © 2024 DilsayCare. Built with ❤️ for healthcare heroes.
          </p>
        </div>
      </footer>
    </div>
  );
};