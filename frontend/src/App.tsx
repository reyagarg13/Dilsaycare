import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { WeekView } from './components/schedule';
import { Button } from './components/ui';
import APITester from './components/APITester';
import { HomePage } from './components/HomePage';
import { Settings, Home, Calendar } from 'lucide-react';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

type AppView = 'home' | 'scheduler' | 'api-tester';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');

  const handleGetStarted = () => {
    setCurrentView('scheduler');
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <motion.div
            key="home"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <HomePage onGetStarted={handleGetStarted} />
          </motion.div>
        );
      case 'scheduler':
        return (
          <motion.div
            key="scheduler"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <WeekView />
          </motion.div>
        );
      case 'api-tester':
        return (
          <motion.div
            key="api-tester"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.4 }}
          >
            <APITester />
          </motion.div>
        );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        {/* Navigation Controls */}
        {currentView !== 'home' && (
          <motion.div 
            className="fixed top-6 right-6 z-50 flex gap-2"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={() => setCurrentView('home')}
              variant="secondary"
              size="sm"
              className="shadow-lg backdrop-blur-sm bg-white/90 border-white/50"
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Button
              onClick={() => setCurrentView('scheduler')}
              variant={currentView === 'scheduler' ? 'primary' : 'secondary'}
              size="sm"
              className="shadow-lg backdrop-blur-sm bg-white/90 border-white/50"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Scheduler
            </Button>
            <Button
              onClick={() => setCurrentView('api-tester')}
              variant={currentView === 'api-tester' ? 'primary' : 'secondary'}
              size="sm"
              className="shadow-lg backdrop-blur-sm bg-white/90 border-white/50"
            >
              <Settings className="mr-2 h-4 w-4" />
              API Tester
            </Button>
          </motion.div>
        )}
        
        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>
      </div>
    </QueryClientProvider>
  );
}

export default App;
