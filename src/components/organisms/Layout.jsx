import React, { useState, useContext } from "react";
import { useSelector } from 'react-redux';
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import { AuthContext } from "../../App";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { isAuthenticated } = useSelector((state) => state.user);
  const { isInitialized } = useContext(AuthContext);

  // Don't render layout if not authenticated or not initialized
  if (!isInitialized || !isAuthenticated) {
    return null;
  }
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-60">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />
        
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;