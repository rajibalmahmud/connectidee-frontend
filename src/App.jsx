import React, { useState, useEffect, createContext, useContext } from 'react';

// ================== Contexts ==================
const AuthContext = createContext();
const DataContext = createContext();

// ================== Mock Data ==================
const useMockData = () => {
  const [data] = useState({
    students: [
      {
        id: "stu_001",
        personal: { name: "Md. Rahim", email: "rahim@example.com", phone: "+8801712345678" },
        status: "active",
        application: "MSc Data Science, UK"
      },
      {
        id: "stu_002",
        personal: { name: "Ayesha Akter", email: "ayesha@example.com", phone: "+8801723456789" },
        status: "applied",
        application: "MBBS, Australia"
      },
      {
        id: "stu_003",
        personal: { name: "James Wilson", email: "james@usa.com", phone: "+14167890123" },
        status: "offer",
        application: "MBA, Canada"
      }
    ],
    applications: [
      { id: "app_001", studentId: "stu_001", university: "University of Example, UK", stage: "offer", intake: "Jan 2026" },
      { id: "app_002", studentId: "stu_002", university: "University of Sydney", stage: "applied", intake: "Mar 2026" }
    ],
    tasks: [
      { id: "task_001", title: "Collect bank statement", student: "Md. Rahim", due: "2025-04-20", priority: "high" }
    ]
  });
  return data;
};

// ================== Auth Provider ==================
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

// ================== Components ==================
const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="font-bold text-xl text-blue-600">Connectidee</h1>
            </div>
            <nav className="ml-6 flex space-x-8">
              <a href="#" className="border-b-2 border-blue-500 text-gray-900 px-1 pt-1 text-sm font-medium">Dashboard</a>
              <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 px-1 pt-1 text-sm font-medium">Students</a>
              <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 px-1 pt-1 text-sm font-medium">Applications</a>
            </nav>
          </div>
          <div className="flex items-center">
            <div className="ml-4 relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                  {user?.name?.charAt(0)}
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const Dashboard = () => {
  const { data } = useContext(DataContext);
  const totalStudents = data.students.length;
  const applied = data.students.filter(s => s.status === 'applied').length;
  const offer = data.students.filter(s => s.status === 'offer').length;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border text-center">
          <h2 className="text-sm font-medium text-gray-600">Total Students</h2>
          <p className="text-3xl font-bold text-blue-600">{totalStudents}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border text-center">
          <h2 className="text-sm font-medium text-gray-600">Applied</h2>
          <p className="text-3xl font-bold text-orange-600">{applied}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border text-center">
          <h2 className="text-sm font-medium text-gray-600">Offer Received</h2>
          <p className="text-3xl font-bold text-green-600">{offer}</p>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <h2 className="text-lg font-semibold p-4 border-b">Students</h2>
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-gray-600">Name</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">Email</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">Phone</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.students.map((student) => (
              <tr key={student.id} className="border-t hover:bg-gray-50">
                <td className="p-4">{student.personal.name}</td>
                <td className="p-4">{student.personal.email}</td>
                <td className="p-4">{student.personal.phone}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${student.status === 'active' ? 'bg-blue-100 text-blue-800' :
                      student.status === 'applied' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'}`}
                  >
                    {student.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
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

// ================== Main App ==================
const App = () => {
  const data = useMockData();

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

          return isAuthenticated ? (
            <DataContext.Provider value={data}>
              <Header />
              <Dashboard />
            </DataContext.Provider>
          ) : (
            <Login />
          );
        }}
      </AuthContext.Consumer>
    </AuthProvider>
  );
};

export default App;
