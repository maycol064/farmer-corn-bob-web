import { LoginForm } from '../components/LoginForm';

export default function SignIn() {
  return (
    <section className="mx-auto grid max-w-3xl gap-6">
      <div className="card">
        <h2 className="text-xl font-semibold">Login</h2>
        <div className="mt-4">
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
