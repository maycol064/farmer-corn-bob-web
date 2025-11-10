import { RegisterForm } from '../components/RegisterForm';

export default function SignUp() {
  return (
    <section className="mx-auto grid max-w-3xl gap-6">
      <div className="card">
        <h2 className="text-xl font-semibold">SignUp</h2>
        <div className="mt-4">
          <RegisterForm />
        </div>
      </div>
    </section>
  );
}
