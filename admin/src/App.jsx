import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import SignIn from './pages/SignIn';
import Category from './pages/Category';
import AddCategory from './pages/add-new/category';
import EditCategory from './pages/add-new/editcategory';
import Admin from './pages/Admin';
import AddAdmin from './pages/add-new/admin';
import EditAdmin from './pages/add-new/editadmin';
import People from './pages/People';
import AddPeople from './pages/add-new/people';
import EditPeople from './pages/add-new/editpeople';
import Event from './pages/Event';
import AddEvent from './pages/add-new/event';
import EditEvent from './pages/add-new/editevent';
import EventDetails from './pages/add-new/event-details';

function SessionRedirector() {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const hasToken = localStorage.getItem('token');
    if (hasToken && location.pathname === '/') {
      navigate('/dashboard', { replace: true });
    } else if (!hasToken && location.pathname !== '/') {
      navigate('/', { replace: true });
    }
  }, [location, navigate]);
  return null;
}

function App() {
  return (
    <Router>
      <SessionRedirector />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/category" element={<Category />} />
          <Route path="/add-new/category" element={<AddCategory />} />
          <Route path="/add-new/editcategory" element={<EditCategory />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/add-new/admin" element={<AddAdmin />} />
          <Route path="/add-new/editadmin" element={<EditAdmin />} />
          <Route path="/people" element={<People />} />
          <Route path="/add-new/people" element={<AddPeople />} />
          <Route path="/add-new/editpeople" element={<EditPeople />} />
          <Route path="/event" element={<Event />} />
          <Route path="/add-new/event" element={<AddEvent />} />
          <Route path="/add-new/editevent" element={<EditEvent />} />
          <Route path="/add-new/event-details" element={<EventDetails />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
