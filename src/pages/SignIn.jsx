import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../services/api";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      navigate("/products");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

return (
    <main className="signin-page">
      <section className="signin-card" aria-labelledby="signin-title">
        <header className="page-header">
          <p className="eyebrow">Product Manager</p>
          <h1 id="signin-title">Welcome back</h1>
          <p className="page-intro">Sign in to manage your products.</p>
        </header>
        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>
          {error && (
            <p className="form-message form-message--error" role="alert">
              {error}
            </p>
          )}
          <button className="button button--primary" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default SignIn;
