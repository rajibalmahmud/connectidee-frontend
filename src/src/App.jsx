import React, { useState, useEffect, createContext, useContext } from 'react';

// ================== Auth Context ==================
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('connectidee_user');
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const login = (email, password) => {
    if (email && password) {
      const mockUser = {
        id: "usr_101",
        name: "Agency Owner",
        email,
        role: "agency_owner"
      };
      setUser(mockUser);
      localStorage.setItem('connectidee_user', JSON.stringify(mockUser));
      return { success: true };
    }
    return { success: false, error: "Invalid credentials" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('connectidee_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ================== Login Page ==================
const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = login(email, password);
    if (!result.success) setError(result.error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-2">Connectidee CRM</h2>
        <p className="text-center text-gray-600 mb-6">Education Consultancy Platform</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@agency.com"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p><strong>Demo Login:</strong></p>
          <p>Email: <code className="bg-gray-100 px-1 rounded">owner@connectidee.com</code></p>
          <p>Password: <code className="bg-gray-100 px-1 rounded">password</code></p>
        </div>
      </div>
    </div>
  );
};

// ================== Dashboard ==================
const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome to Connectidee</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-800">Your CRM is working!</h2>
        <p className="text-gray-600 mt-2">You're logged in as Agency Owner.</p>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
          Next: Add students, applications, and connect the backend.
        </div>
      </div>
    </div>
  );
};

// ================== Main App ==================
const App = () => {
  return (
    <AuthProvider>
      <AuthContext.Consumer>
        {({ user, isAuthenticated, loading }) => {
          if (loading) {
            return (
              <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            );
          }

          return isAuthenticated ? <Dashboard /> : <Login />;
        }}
      </AuthContext.Consumer>
    </AuthProvider>
  );
};

export default App;
