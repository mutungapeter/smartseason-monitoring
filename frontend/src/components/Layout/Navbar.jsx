import React, { useState, useEffect, useMemo } from 'react';
import { Menu, ChevronDown, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/slices/authSlice';

const getGreeting = (date = new Date()) => {
  const h = date.getHours();
  if (h >= 5 && h < 12) return 'Good morning';
  if (h >= 12 && h < 17) return 'Good afternoon';
  if (h >= 17 && h < 22) return 'Good evening';
  return 'Good night';
};

export default function Navbar({ sidebarOpen, setSidebarOpen, isMobile }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const greeting = useMemo(() => getGreeting(now), [now]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const initials = `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`.toUpperCase();

  return (
    <div
      className={`fixed top-0 right-0 h-14 bg-white border-b border-slate-100 flex items-center justify-between px-4 z-40 transition-all duration-300
        ${isMobile ? 'left-0' : sidebarOpen ? 'left-[220px]' : 'left-[64px]'}
      `}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} className="text-gray-500" />
        </button>
        <span className="text-sm text-gray-500 hidden sm:block">
          {greeting},{' '}
          <span className="font-medium text-gray-800">{user?.first_name ?? 'there'}</span>
        </span>
      </div>

      <div className="relative">
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-semibold">
            {initials || <User size={14} />}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium text-gray-800 leading-tight">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-gray-400 leading-tight capitalize">
              {user?.role?.toLowerCase()}
            </p>
          </div>
          <ChevronDown
            size={14}
            className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {dropdownOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
            <div className="absolute right-0 top-full mt-1 w-44
             bg-white border border-slate-100 rounded-xl min-h-14 shadow-md z-20 overflow-hidden">
              {/* <button
                onClick={() => { setDropdownOpen(false); navigate('/dashboard/profile'); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <User size={14} />
                Profile
              </button> */}
              <div className="border-t border-slate-100" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}