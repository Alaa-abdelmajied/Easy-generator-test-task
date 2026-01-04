import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!name) {
      newErrors.name = 'Name is required';
    } else if (name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[a-zA-Z]/.test(password)) {
      newErrors.password = 'Password must contain at least one letter';
    } else if (!/\d/.test(password)) {
      newErrors.password = 'Password must contain at least one number';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newErrors.password = 'Password must contain at least one special character';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      await signUp({ name, email, password });
      navigate('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message;
      setErrors({ general: Array.isArray(message) ? message[0] : message || 'Registration failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check password requirements for visual feedback
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>

        {errors.general && <p className="error-message" style={{ textAlign: 'center', marginBottom: 20 }}>{errors.general}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? 'error' : ''}
              placeholder="John Doe"
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'error' : ''}
              placeholder="you@example.com"
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? 'error' : ''}
              placeholder="••••••••"
            />
            {errors.password && <p className="error-message">{errors.password}</p>}

            <div className="password-requirements">
              <p>Password must contain:</p>
              <ul>
                <li className={hasMinLength ? 'valid' : ''}>At least 8 characters</li>
                <li className={hasLetter ? 'valid' : ''}>At least one letter</li>
                <li className={hasNumber ? 'valid' : ''}>At least one number</li>
                <li className={hasSpecial ? 'valid' : ''}>At least one special character</li>
              </ul>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
