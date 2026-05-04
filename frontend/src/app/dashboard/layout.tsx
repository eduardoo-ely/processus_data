'use client'

import { useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import { Search, Bell, ChevronDown } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#0b0e14] text-white overflow-hidden font-sans">
      {/* Overlay para mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-[#0b0e14]/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 lg:static
          ${collapsed ? 'w-20' : 'w-64'} 
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <Sidebar 
          collapsed={collapsed} 
          mobileOpen={mobileOpen}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          onCloseMobile={() => setMobileOpen(false)}
        />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-[88px] flex-shrink-0 px-8 flex items-center justify-between border-b border-[#1f2937]/30">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(true)} className="p-2 -ml-2 rounded-lg text-gray-400 hover:text-white lg:hidden">
              ☰
            </button>
            <div className="flex items-baseline gap-2">
              <h1 className="text-xl font-bold text-white tracking-wide">Dashboard</h1>
              <span className="text-[#6b7280] text-sm font-medium">| Overview</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Search Bar */}
            <div className="hidden md:flex relative group">
              <Search className="w-4 h-4 text-[#6b7280] absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#00f2fe] transition-colors" />
              <input 
                type="text" 
                placeholder="Search" 
                className="w-64 bg-[#181b21] border border-[#1f2937] rounded-full py-2 pl-9 pr-4 text-sm text-white placeholder-[#6b7280] focus:outline-none focus:border-[#00f2fe]/50 focus:ring-1 focus:ring-[#00f2fe]/50 transition-all"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-[#6b7280] hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0b0e14]"></span>
              </button>

              <button className="flex items-center gap-2 hover:bg-[#181b21] py-1.5 px-3 rounded-xl transition-colors border border-transparent hover:border-[#1f2937]">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#00f2fe] to-[#38ef7d] p-0.5">
                  <img src="https://i.pravatar.cc/100?img=11" alt="Profile" className="w-full h-full rounded-full border border-[#0b0e14] object-cover" />
                </div>
                <span className="text-sm font-medium text-white hidden sm:block">Profile</span>
                <ChevronDown className="w-4 h-4 text-[#6b7280]" />
              </button>
            </div>
          </div>
        </header>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  )
}
