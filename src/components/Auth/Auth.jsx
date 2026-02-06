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
                } else {
                    setError('Usuario no encontrado. ¿Has pulsado en "Regístrate" en el otro móvil?');
                }
            } else {
                // Register mode
                // 1. Check if we have connection for registration
                const conn = await testConnection();
                if (!conn) {
                    setError('No hay conexión con la base de datos. Los datos no se guardarán entre dispositivos. Revisa Netlify.');
                    setLoading(false);
                    return;
                }

                // 2. Check existence
                const exists = await verifyUser(user, pass);
                if (exists !== null) {
                    setError('Ese usuario ya existe. Intenta Iniciar Sesión.');
                } else {
                    await createUser(user, pass);
                    setSuccessMsg('¡Cuenta creada y sincronizada! Entrando...');
                    setTimeout(() => {
                        localStorage.setItem('eventManagerUser', user);
                        onLogin(user);
                    }, 1500);
                }
            }
        } catch (err) {
            console.error(err);
            setError('Error: revisa si has creado las tablas en Supabase.');
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
                        {isConnected === null ? '⏳' : (isConnected ? '☁️ Conectado' : '☁️ Solo Offline')}
                    </div>
                </div>

                <p className="auth-subtitle">
                    {mode === 'login' ? 'Tus eventos en cualquier lugar' : 'Crea tu cuenta compartida'}
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
                        {loading ? 'Procesando...' : (mode === 'login' ? 'Entrar' : 'Registrar')}
                    </button>
                </form>

                <div className="auth-toggle">
                    {mode === 'login' ? (
                        <p>¿Es tu primera vez? <button onClick={() => setMode('register')}>Regístrate</button></p>
                    ) : (
                        <p>¿Ya tienes cuenta? <button onClick={() => setMode('login')}>Inicia Sesión</button></p>
                    )}
                </div>
            </div>

            {!isConnected && isConnected !== null && (
                <div className="auth-help-box">
                    ⚠️ <strong>App en modo local:</strong> Los datos NO se guardarán entre móviles.
                    Asegúrate de poner las llaves de Supabase en el panel de Netlify.
                </div>
            )}
        </div>
    );
};
