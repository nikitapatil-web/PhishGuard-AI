import { useState } from 'react';
import type { FormEvent } from 'react';
import { Shield } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '').trim();
    const password = String(form.get('password') ?? '');
    if (!email || password.length < 4) {
      setError('Enter an email and a password with at least 4 characters.');
      return;
    }
    localStorage.setItem('phishguard-authenticated', 'true');
    onLogin();
  };

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center p-6 dot-grid">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-bg-card border border-border rounded-xl p-8 shadow-xl">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-success flex items-center justify-center mb-6">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Sign in to PhishGuard AI</h1>
        <p className="text-text-muted text-sm mb-6">Protect your workspace with explainable threat intelligence.</p>
        <label className="block text-sm mb-4">
          Email
          <input name="email" type="email" required className="mt-2 w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-text focus:outline-none focus:border-primary" />
        </label>
        <label className="block text-sm mb-5">
          Password
          <input name="password" type="password" required minLength={4} className="mt-2 w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-text focus:outline-none focus:border-primary" />
        </label>
        {error && <p className="text-danger text-sm mb-4">{error}</p>}
        <button type="submit" className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-white hover:bg-primary-light transition-colors">Continue</button>
      </form>
    </main>
  );
}