import { useState, type FormEvent } from 'react';
import { Button } from '../ui/Button';
import styles from './LoginScreen.module.css';

interface LoginScreenProps {
  /** Intenta autenticar; devuelve false si las credenciales no son válidas. */
  onLogin: (email: string, password: string) => boolean;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('admin@davrant.com');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!onLogin(email, password)) {
      setError('Credenciales inválidas. Usa las del demo.');
    }
  }

  return (
    <div className={styles.screen}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <img src="/img/logo.png" alt="Davrant" className={styles.logo} />
        <h1>Bienvenido</h1>
        <p className={styles.sub}>Panel de análisis de facturas</p>

        <label className={styles.field}>
          <span>Correo</span>
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className={styles.field}>
          <span>Contraseña</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <Button type="submit">Entrar</Button>
        <p className={styles.error}>{error}</p>
        <p className={styles.hint}>
          Demo · <b>admin@davrant.com</b> / <b>demo123</b>
        </p>
      </form>
    </div>
  );
}
