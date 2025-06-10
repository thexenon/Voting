import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const DashboardLayout = () => {
  const { pathname } = useLocation();
  const [userName, setUserName] = useState('');
  const userrole = localStorage.getItem('userrole');

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userrole');
    window.location.href = '/';
  }

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setUserName(user?.name || user?.username || '');
    } catch {
      setUserName('');
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 text-xl font-bold border-b">My Dashboard</div>
        <div className="p-4 border-b flex flex-col gap-2">
          {userName && (
            <span className="text-gray-700 font-semibold text-lg">
              {userName}
            </span>
          )}
        </div>
        <nav className="p-4">
          {userrole !== 'user' && (
            <ul className="space-y-4">
              <li>
                <Link
                  className={pathname === '/dashboard' ? 'font-semibold' : ''}
                  to="/dashboard"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  className={pathname === '/event' ? 'font-semibold' : ''}
                  to="/event"
                >
                  Event
                </Link>
              </li>
              <li>
                <Link
                  className={pathname === '/category' ? 'font-semibold' : ''}
                  to="/category"
                >
                  Category
                </Link>
              </li>
              <li>
                <Link
                  className={pathname === '/people' ? 'font-semibold' : ''}
                  to="/people"
                >
                  Nominee
                </Link>
              </li>
              <li>
                <Link
                  className={pathname === '/settings' ? 'font-semibold' : ''}
                  to="/settings"
                >
                  Settings
                </Link>
              </li>

              {userrole === 'superadmin' && (
                <li>
                  <Link
                    className={pathname === '/admin' ? 'font-semibold' : ''}
                    to="/admin"
                  >
                    Admins
                  </Link>
                </li>
              )}
            </ul>
          )}
        </nav>
        <div className="p-4 border-b flex flex-col gap-2">
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded shadow text-sm w-full text-center"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 relative">
        <header className="sticky top-0 left-0 right-0 z-30 bg-white shadow-md py-4 px-8 mb-8">
          <h1 className="text-3xl font-bold text-blue-700">
            Voting System Dashboard
          </h1>
        </header>
        <div className="mt-16">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
