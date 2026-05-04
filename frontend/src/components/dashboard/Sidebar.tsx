'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  LineChart,
  FolderKanban,
  Users,
  FileText,
  Settings,
  HelpCircle,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  X
} from 'lucide-react'

const MAIN_NAV = [
  { title: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { title: 'Analytics', icon: LineChart, href: '/dashboard/analytics' },
  { title: 'Projects', icon: FolderKanban, href: '/dashboard/projects' },
  { title: 'Clients', icon: Users, href: '/dashboard/clients' },
  { title: 'Reports', icon: FileText, href: '/dashboard/reports' },
]

const BOTTOM_NAV = [
  { title: 'Settings', icon: Settings, href: '/dashboard/settings' },
  { title: 'Support', icon: HelpCircle, href: '/dashboard/support' },
]

interface SidebarProps {
  collapsed: boolean
  mobileOpen: boolean
  onToggleCollapse: () => void
  onCloseMobile: () => void
}

export default function Sidebar({
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname()

  return (
    <nav className="h-full flex flex-col bg-[#111318] text-[#9ca3af] font-sans border-r border-[#1f2937]/50 relative" role="navigation">
      
      {/* ── HEADER / LOGO ─────────────────────────────────────────────────── */}
      <div className={`flex items-center h-[88px] px-6 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex flex-col gap-0.5 justify-center">
              {/* Logo icon representation */}
              <div className="w-4 h-4 bg-[#00f2fe] rounded-sm rounded-tr-xl"></div>
              <div className="w-4 h-4 bg-[#38ef7d] rounded-sm rounded-bl-xl ml-3 -mt-1"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-lg tracking-tight leading-tight">PROCESSUS</span>
              <span className="font-semibold text-[#38ef7d] text-[11px] tracking-[0.2em] uppercase leading-none">DATA</span>
            </div>
          </div>
        )}
        
        {mobileOpen ? (
          <button onClick={onCloseMobile} className="p-1.5 rounded-lg text-gray-400 hover:text-white lg:hidden">
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button onClick={onToggleCollapse} className="hidden lg:flex p-1.5 rounded-lg text-gray-500 hover:text-white transition-colors absolute -right-3 top-10 bg-[#111318] border border-[#1f2937] z-10">
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* ── MAIN NAV ──────────────────────────────────────────────────────── */}
      <div className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
        {MAIN_NAV.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={mobileOpen ? onCloseMobile : undefined}
              className={`flex items-center px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-300 group relative ${collapsed ? 'justify-center' : ''} ${
                isActive 
                  ? 'text-white' 
                  : 'text-[#9ca3af] hover:text-white hover:bg-[#1f2937]/30'
              }`}
            >
              {/* Glow effect background for active item */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#00f2fe]/20 to-transparent border border-[#00f2fe]/30 rounded-xl shadow-[0_0_15px_rgba(0,242,254,0.15)]"></div>
              )}
              
              <Icon className={`w-5 h-5 flex-shrink-0 relative z-10 ${!collapsed ? 'mr-3.5' : ''} ${
                isActive ? 'text-[#00f2fe]' : 'text-[#6b7280] group-hover:text-[#9ca3af]'
              }`} />
              {!collapsed && <span className="relative z-10">{item.title}</span>}
            </Link>
          )
        })}
      </div>

      {/* ── BOTTOM NAV & PROFILE ───────────────────────────────────────────── */}
      <div className="px-4 pb-6 space-y-1.5">
        {BOTTOM_NAV.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-xl text-[14px] font-medium transition-colors group ${collapsed ? 'justify-center' : ''} text-[#9ca3af] hover:text-white hover:bg-[#1f2937]/30`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 text-[#6b7280] group-hover:text-[#9ca3af] ${!collapsed ? 'mr-3.5' : ''}`} />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          )
        })}

        {/* Profile Card */}
        <div className={`mt-6 flex items-center bg-[#181b21] border border-[#1f2937]/50 rounded-2xl p-2.5 transition-all ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3">
            <img 
              src="https://i.pravatar.cc/100?img=11" 
              alt="Alex T." 
              className="w-9 h-9 rounded-full object-cover border border-[#1f2937]"
            />
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-white text-sm font-semibold">Alex T.</span>
                <span className="text-[#6b7280] text-xs">Senior Consultant</span>
              </div>
            )}
          </div>
          {!collapsed && (
            <button className="text-[#6b7280] hover:text-white p-1">
              <MoreVertical className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

    </nav>
  )
}
