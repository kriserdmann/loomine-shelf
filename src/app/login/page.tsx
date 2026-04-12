import { loginWithPassword, loginWithGoogle } from "./actions";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-[var(--radius-cohere)] border border-[var(--color-border-light)] bg-white p-8">
        <h1 className="mb-2 text-3xl font-display text-[var(--color-cohere-black)] text-center">Loomine Shelf</h1>
        <p className="mb-8 text-center text-sm text-[var(--color-muted-slate)]">
          Sign in to your administrative dashboard
        </p>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-[var(--color-near-black)]">Email Address</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="you@email.com"
              required 
              className="rounded-md border border-[var(--color-border-cool)] p-3 text-sm focus:border-[var(--color-focus-purple)] focus:outline-none focus:ring-2 focus:ring-[var(--color-interaction-blue)] focus:ring-opacity-50"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-[var(--color-near-black)]">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              placeholder="••••••••"
              required 
              className="rounded-md border border-[var(--color-border-cool)] p-3 text-sm focus:border-[var(--color-focus-purple)] focus:outline-none focus:ring-2 focus:ring-[var(--color-interaction-blue)] focus:ring-opacity-50"
            />
          </div>
          
          <button 
            formAction={loginWithPassword} 
            className="rounded-full bg-[var(--color-cohere-black)] p-3 text-sm font-medium text-white transition hover:bg-[var(--color-deep-dark)] mt-2"
          >
            Sign In
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-[var(--color-border-light)]"></div>
          <span className="mx-4 text-xs tracking-wider text-[var(--color-muted-slate)] uppercase">Or</span>
          <div className="flex-1 border-t border-[var(--color-border-light)]"></div>
        </div>

        <form>
          <button 
            formAction={loginWithGoogle}
            className="w-full rounded-full border border-[var(--color-border-cool)] bg-transparent p-3 text-sm font-medium text-[var(--color-cohere-black)] transition hover:text-[var(--color-interaction-blue)] hover:border-[var(--color-interaction-blue)]"
          >
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
}
