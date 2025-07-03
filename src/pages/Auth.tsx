
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthForm from '../components/AuthForm';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuth();

  const handleSubmit = async (data: { email: string; password: string; username?: string }) => {
    try {
      if (isLogin) {
        await login({ email: data.email, password: data.password });
      } else {
        if (!data.username) {
          throw new Error('Username is required for registration');
        }
        await register({ 
          username: data.username, 
          email: data.email, 
          password: data.password 
        });
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <AuthForm
      isLogin={isLogin}
      onSubmit={handleSubmit}
      onToggleMode={() => setIsLogin(!isLogin)}
    />
  );
};

export default Auth;
