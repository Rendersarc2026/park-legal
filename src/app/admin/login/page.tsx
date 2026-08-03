'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .trim(),
  password: yup
    .string()
    .required('Password is required'),
});

type LoginFormData = yup.InferType<typeof schema>;

export default function AdminLogin() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const resData = await res.json();
        setError(resData.error || 'Login failed');
        setLoading(false);
      }
    } catch {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="admin-dark min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary">
            {loading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <Lock className="w-8 h-8" />
            )}
          </div>
        </div>
        <h2 className="text-3xl font-light text-center text-[#333333] mb-8">Admin Panel</h2>
        
        {error && (
          <div className="mb-4 p-4 text-sm text-red-600 bg-red-50 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              {...register('username')}
              disabled={loading}
              type="text"
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed ${
                errors.username ? 'border-red-400' : 'border-gray-200'
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              {...register('password')}
              disabled={loading}
              type="password"
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed ${
                errors.password ? 'border-red-400' : 'border-gray-200'
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || error.toLowerCase().includes('too many failed attempts')}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-medium hover:bg-black transition-all shadow-lg shadow-gray-200 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>Signing in...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
