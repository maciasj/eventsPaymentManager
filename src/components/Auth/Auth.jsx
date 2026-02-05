import { useState } from 'react';
import { verifyUser, createUser } from '../../services/supabase';
import './Auth.css';

export const Auth = ({ onLogin }) => {
    const [mode, setMode] = useState('login'); // 'login' or 'register'
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) return;

        setLoading(true);
        setError(null);
        setSuccessMsg(null);

        const user = username.trim();
        const pass = password.trim();

        try {
            if (mode === 'login') {
                const isValid = await verifyUser(user, pass);
                if (isValid === true) {
                    // Success
                    localStorage.setItem('eventManagerUser', user);
                    onLogin(user);
                } else if (isValid === false) {
                    setError('Contraseña incorrecta.');
                } else {
                    setError('Usuario no encontrado. Regístrate primero.');
                }
            } else {
                // Register mode
                const exists = await verifyUser(user, pass); // Check existence
                if (exists !== null) {
                    setError('El usuario ya existe. Intenta iniciar sesión.');
                } else {
                    await createUser(user, pass);
                    setSuccessMsg('¡Cuenta creada! Iniciando sesión...');
                    setTimeout(() => {
                        localStorage.setItem('eventManagerUser', user);
                        onLogin(user);
                    }, 1000);
                }
            }
        } catch (err) {
            console.error(err);
            setError('Error de conexión. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container fade-in">
            <div className="auth-card">
                <h1 className="auth-title">Event Manager</h1>
                <p className="auth-subtitle">
                    {mode === 'login' ? 'Inicia sesión para ver tus eventos' : 'Crea tu cuenta personal'}
                </p>

                {error && <div className="auth-alert error">{error}</div>}
                {successMsg && <div className="auth-alert success">{successMsg}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-input-group">
                        <label htmlFor="username">Usuario</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Ej: Joel"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoFocus
                            className="username-input"
                        />
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="******"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Procesando...' : (mode === 'login' ? 'Entrar' : 'Crear Cuenta')}
                    </button>
                </form>

                <div className="auth-toggle">
                    {mode === 'login' ? (
                        <p>¿No tienes cuenta? <button onClick={() => setMode('register')}>Regístrate</button></p>
                    ) : (
                        <p>¿Ya tienes cuenta? <button onClick={() => setMode('login')}>Inicia Sesión</button></p>
                    )}
                </div>
            </div>
        </div>
    );
};
