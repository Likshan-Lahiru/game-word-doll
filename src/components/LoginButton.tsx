import React from 'react';
import { useNavigate } from 'react-router-dom';
export function LoginButton() {
  const navigate = useNavigate();
  return <div className="w-full flex justify-center py-6">
      <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-xl py-3 px-16 rounded-full mx-auto transition-colors" onClick={() => navigate('/login')}>
        Log in
      </button>
    </div>;
}