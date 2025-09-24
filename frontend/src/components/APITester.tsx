import React, { useState } from 'react';

const APITester: React.FC = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = 'http://localhost:3001/api';

  const runTest = async (endpoint: string, name: string) => {
    setLoading(true);
    try {
      console.log(`Testing ${name}: ${API_BASE}${endpoint}`);
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      setTestResults(prev => [...prev, {
        name,
        endpoint,
        status: response.status,
        success: response.ok,
        data,
        timestamp: new Date().toISOString()
      }]);

      console.log(`✅ ${name} Success:`, data);
    } catch (error: any) {
      console.error(`❌ ${name} Failed:`, error);
      
      setTestResults(prev => [...prev, {
        name,
        endpoint,
        status: 'ERROR',
        success: false,
        data: { error: error.message },
        timestamp: new Date().toISOString()
      }]);
    }
    setLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Backend API Tester</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={() => runTest('/test', 'Simple Test Route')}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Simple Route (No DB)
        </button>
        
        <button
          onClick={() => runTest('/health', 'Health Check')}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test Health Check
        </button>
        
        <button
          onClick={() => runTest('/test-db', 'Database Test')}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Test Database Connection
        </button>
        
        <button
          onClick={() => runTest('/slots/week/2025-09-22', 'Week Slots (Real API)')}
          disabled={loading}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
        >
          Test Week Slots API
        </button>
        
        <button
          onClick={clearResults}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Clear Results
        </button>
      </div>

      {loading && (
        <div className="text-blue-600 mb-4">Testing API endpoint...</div>
      )}

      <div className="space-y-4">
        {testResults.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded border ${
              result.success ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">{result.name}</h3>
              <span className={`px-2 py-1 rounded text-sm ${
                result.success ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
              }`}>
                {result.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Endpoint: <code>{result.endpoint}</code>
            </p>
            <p className="text-xs text-gray-500 mb-2">{result.timestamp}</p>
            <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        ))}
      </div>

      {testResults.length === 0 && (
        <div className="text-gray-500 text-center py-8">
          No test results yet. Click a button above to test an API endpoint.
        </div>
      )}
    </div>
  );
};

export default APITester;