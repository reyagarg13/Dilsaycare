import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WeekView } from './components/schedule';
import APITester from './components/APITester';

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

function App() {
  const [showTester, setShowTester] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        {/* Debug Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setShowTester(!showTester)}
            className="px-3 py-2 bg-blue-600 text-white rounded text-sm shadow-lg hover:bg-blue-700"
          >
            {showTester ? 'Show App' : 'Show API Tester'}
          </button>
        </div>
        
        {showTester ? (
          <APITester />
        ) : (
          <WeekView />
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;
