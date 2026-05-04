'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { modules } from '@/data/modules'
import {
  LayoutDashboard,
  DollarSign,
  TrendingUp,
  Settings,
  BarChart2,
  Package,
  ChevronLeft,
  ChevronRight,
  Lock,
  LogOut,
  X,
} from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  DollarSign,
  TrendingUp,
  Settings,
  BarChart2,
  Package,
}

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

  const activeModules = modules.filter((m) => m.isActive)
  const lockedModules = modules.filter((m) => !m.isActive)

  const isActive = (moduleId: string) =>
    pathname === `/dashboard/${moduleId}` || pathname.startsWith(`/dashboard/${moduleId}/`)

  const isDashboardHome = pathname === '/dashboard'

  return (
    <nav
      className="h-full flex flex-col"
      role="navigation"
      aria-label="Navegação principal"
    >
      {/* Header */}
      <div
        className={`flex items-center h-16 px-4 border-b border-slate-700/50 ${
          collapsed ? 'justify-center' : 'justify-between'
        }`}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-blue-400" />
            </div>
            <span className="font-semibold text-white text-sm">Meu Painel</span>
          </div>
        )}

        {/* Mobile close button */}
        {mobileOpen ? (
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors lg:hidden"
            aria-label="Fechar menu"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors hidden lg:flex"
            aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Nav links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Home link */}
        <div>
          <Link
            href="/dashboard"
            onClick={mobileOpen ? onCloseMobile : undefined}
            className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
              collapsed ? 'justify-center' : ''
            } ${
              isDashboardHome
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
            title={collapsed ? 'Início' : undefined}
          >
            <LayoutDashboard
              className={`w-5 h-5 flex-shrink-0 ${!collapsed ? 'mr-3' : ''} ${
                isDashboardHome ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
              }`}
            />
            {!collapsed && <span className="truncate">Início</span>}
          </Link>
        </div>

        {/* Active modules */}
        <div>
          {!collapsed && (
            <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Módulos
            </p>
          )}
          <div className="space-y-1">
            {activeModules.map((module) => {
              const Icon = iconMap[module.icon] ?? LayoutDashboard
              const active = isActive(module.id)
              return (
                <Link
                  key={module.id}
                  href={`/dashboard/${module.id}`}
                  onClick={mobileOpen ? onCloseMobile : undefined}
                  className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    collapsed ? 'justify-center' : ''
                  } ${
                    active
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                  aria-current={active ? 'page' : undefined}
                  title={collapsed ? module.title : undefined}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${!collapsed ? 'mr-3' : ''} ${
                      active ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  />
                  {!collapsed && <span className="truncate">{module.title}</span>}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Locked modules */}
        {lockedModules.length > 0 && (
          <div>
            {!collapsed && (
              <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
                Em breve
              </p>
            )}
            <div className="space-y-1">
              {lockedModules.map((module) => (
                <div
                  key={module.id}
                  className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium opacity-40 cursor-not-allowed ${
                    collapsed ? 'justify-center' : ''
                  }`}
                  title={collapsed ? `${module.title} (bloqueado)` : undefined}
                  aria-disabled="true"
                >
                  <Lock
                    className={`w-5 h-5 flex-shrink-0 text-slate-600 ${
                      !collapsed ? 'mr-3' : ''
                    }`}
                  />
                  {!collapsed && <span className="truncate text-slate-500">{module.title}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer / Logout */}
      <div className="px-3 pb-4 border-t border-slate-700/50 pt-3">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group ${
            collapsed ? 'justify-center' : ''
          }`}
          aria-label="Sair"
          title={collapsed ? 'Sair' : undefined}
        >
          <LogOut
            className={`w-5 h-5 flex-shrink-0 text-slate-500 group-hover:text-red-400 ${
              !collapsed ? 'mr-3' : ''
            }`}
          />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </nav>
  )
}
