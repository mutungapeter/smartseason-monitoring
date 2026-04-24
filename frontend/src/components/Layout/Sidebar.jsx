import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsAdmin } from '@/store/slices/authSlice';
import { SIDEBAR_ITEMS } from './sidebr.items';
import { LogOut } from 'lucide-react';

function SmartSeasonLogo({ expanded }) {
  return (
    <div className="flex items-center gap-2 overflow-hidden">
      {/* Icon mark — Sun (absolute) behind Sprout */}
      <div className="relative shrink-0" style={{ width: 36, height: 36 }}>
        <svg
          viewBox="0 0 36 36"
          width="36"
          height="36"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="SmartSeason logo mark"
        >
          {/* Background circle */}
          <circle cx="18" cy="18" r="18" fill="#E1F5EE" />

          {/* Sun rays */}
          <g stroke="#EF9F27" strokeWidth="1.5" strokeLinecap="round">
            <line x1="18" y1="4" x2="18" y2="8" />
            <line x1="28.5" y1="7.5" x2="25.8" y2="10.2" />
            <line x1="32" y1="18" x2="28" y2="18" />
            <line x1="28.5" y1="28.5" x2="25.8" y2="25.8" />
            <line x1="18" y1="32" x2="18" y2="28" />
            <line x1="7.5" y1="28.5" x2="10.2" y2="25.8" />
            <line x1="4" y1="18" x2="8" y2="18" />
            <line x1="7.5" y1="7.5" x2="10.2" y2="10.2" />
          </g>

          {/* Sun circle */}
          <circle cx="18" cy="18" r="5" fill="none" stroke="#EF9F27" strokeWidth="1.5" />

          {/* Sprout stem */}
          <line x1="18" y1="26" x2="18" y2="16" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" />

          {/* Left leaf */}
          <path d="M18 21 Q12 17 13 11 Q17 12 18 19" fill="#1D9E75" opacity="0.85" />

          {/* Right leaf */}
          <path d="M18 19 Q24 15 23 9 Q19 10 18 18" fill="#1D9E75" />

          {/* Top bud */}
          <path d="M18 16 Q15 12 16 9 Q19 10 18 15" fill="#5DCAA5" />
        </svg>
      </div>

      {/* Wordmark — only when sidebar is open */}
      {expanded && (
        <div className="flex flex-col leading-none">
          <span className="text-sm font-medium whitespace-nowrap" style={{ color: '#0F6E56' }}>
            Smart<span className="text-gray-800">Season</span>
          </span>
          <span className="text-gray-400 whitespace-nowrap" style={{ fontSize: 8, letterSpacing: '0.12em' }}>
            GROW SMARTER
          </span>
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAdmin = useSelector(selectIsAdmin);

  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const activePage = pathParts[pathParts.length - 1] || 'dashboard';

  const filteredItems = SIDEBAR_ITEMS.filter(
    (item) => !item.adminOnly || isAdmin
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleItemClick = (item) => {
    if (!sidebarOpen) {
      setSidebarOpen(true);
      return;
    }
    navigate(item.path);
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity ${
          sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <div
        className={`fixed top-0 left-0 h-full bg-white border-r border-slate-100 shrink-0 transition-all duration-300 z-50 flex flex-col
          ${sidebarOpen ? 'w-[220px]' : 'w-[64px]'}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-slate-100 px-3">
          <SmartSeasonLogo expanded={sidebarOpen} />
        </div>

        {/* Nav items */}
        <nav className="flex-1 flex flex-col gap-1 px-2 py-3 overflow-y-auto">
          {filteredItems.map((item) => {
            const isActive =
              activePage === item.id ||
              (item.id === 'dashboard' && activePage === 'dashboard');
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer transition-all duration-150
                  ${isActive
                    ? 'bg-teal-500 text-white'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  }
                `}
              >
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  <Icon size={18} />
                </div>
                {sidebarOpen && (
                  <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-4 border-t border-slate-100 cursor-pointer hover:bg-gray-50 transition-colors"
        >
           <LogOut className='text-primary' size={14} />
          {sidebarOpen && (
            <span className="text-sm font-medium text-teal-500">Logout</span>
          )}
        </div>
      </div>
    </>
  );
}