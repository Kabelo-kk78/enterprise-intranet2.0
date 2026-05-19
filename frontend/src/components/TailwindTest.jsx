// frontend/src/components/TailwindTest.jsx
import React from 'react';

export default function TailwindTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Tailwind CSS is Working! 🎉
        </h1>
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm">Primary Color Example</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800 text-sm">Success Color Example</p>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="btn-primary flex-1">Primary Button</button>
            <button className="btn-secondary flex-1">Secondary Button</button>
          </div>
        </div>
      </div>
    </div>
  );
}