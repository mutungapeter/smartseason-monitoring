import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout() {
  const { user, isLoading } = useSelector((state) => state.auth);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading ....
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen bg-[#F2F2F2]">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div
        className={`flex flex-col flex-1 min-w-0 transition-all duration-300
          ${!isMobile && sidebarOpen ? 'ml-[220px]' : ''}
          ${!isMobile && !sidebarOpen ? 'ml-[64px]' : ''}
        `}
      >
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isMobile={isMobile}
        />

        <main className="flex-1 px-4 pt-6 pb-10 mt-14 bg-[#F2F2F2]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}