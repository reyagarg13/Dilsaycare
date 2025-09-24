import React from 'react';

export const TestGradients: React.FC = () => {
  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold mb-4">CSS Test Components</h2>
      
      {/* Test gradient backgrounds */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-lg text-white">
        Gradient Background Test
      </div>
      
      {/* Test gradient text */}
      <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Gradient Text Test
      </h3>
      
      {/* Test shadows and blur */}
      <div className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl p-4 rounded-2xl">
        Glass morphism test
      </div>
      
      {/* Test hover effects */}
      <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 active:scale-95">
        Hover Effect Button
      </button>
      
      {/* Test custom classes */}
      <div className="glass-card p-4 rounded-2xl">
        Custom glass card class
      </div>
      
      {/* Inline styles as fallback */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '16px',
          borderRadius: '12px',
          color: 'white'
        }}
      >
        Inline gradient (fallback test)
      </div>
    </div>
  );
};