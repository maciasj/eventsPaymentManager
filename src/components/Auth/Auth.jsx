import { useState, useEffect } from 'react';
import { verifyUser, createUser, testConnection } from '../../services/supabase';
import './Auth.css';

export const Auth = ({ onLogin }) => {
    const [mode, setMode] = useState('login'); // 'login' or 'register'
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isConnected, setIsConnected] = useState(null); // null = checking, true/false

    // Check connection status on load
    useEffect(() => {
        const checkConn = async () => {
            const ok = await testConnection();
            setIsConnected(ok);
        };
        checkConn();
    }, [mode]);

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
                    localStorage.setItem('eventManagerUser', user);
                    onLogin(user);
                } else if (isValid === false) {
                    setError('Contraseña incorrecta.');
                } else if (isValid === null) {
                    setError(`El usuario "${user}" no existe en la nube. ¿Te has registrado ya?`);
                }
            } else {
                // Register mode
                const conn = await testConnection();
                if (!conn) {
                    setError('ERROR: No hay conexión real con Supabase. Revisa las variables en Netlify.');
                    setLoading(false);
                    return;
                }

                // Always try cloud registration first to avoid ghost users
                const success = await createUser(user, pass);
                if (success) {
                    setSuccessMsg('¡Usuario creado en la nube! Entrando...');
                    setTimeout(() => {
                        localStorage.setItem('eventManagerUser', user);
                        onLogin(user);
                    }, 1500);
                } else {
                    setError('No se pudo crear el usuario en la nube. Revisa el SQL de Supabase.');
                }
            }
        } catch (err) {
            console.error(err);
            setError('Error crítico: ' + (err.message || 'Desconocido'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container fade-in">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Event Manager</h1>
                    <div className={`auth-status-badge ${isConnected ? 'online' : 'offline'}`}>
                        {isConnected === null ? '⏳' : (isConnected ? '☁️ Sincronizado' : '☁️ Solo Local')}
                    </div>
                </div>

                <p className="auth-subtitle">
                    {mode === 'login' ? 'Tus eventos en cualquier lugar' : 'Crea tu cuenta compartida'}
                </p>

                {error && <div className="auth-alert error" style={{ whiteSpace: 'pre-wrap' }}>{error}</div>}
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

            <div className="auth-debug-panel" style={{ marginTop: '20px', fontSize: '10px', opacity: 0.5 }}>
                ID: {import.meta.env.VITE_SUPABASE_URL ? import.meta.env.VITE_SUPABASE_URL.substring(0, 15) : 'MISSING'}...
            </div>
        </div>
    );
};
