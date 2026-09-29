import React from 'react';
import { Role } from '../types';
import { PWAInstallButton } from './pwa/PWAInstallButton';
import { ShieldCheck, LogOut, Menu, X, Bell } from 'lucide-react';

interface HeaderProps {
  activeRole: Role;
  onLogout: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  unreadAlertsCount?: number;
  onOpenAlerts?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeRole,
  onLogout,
  onToggleSidebar,
  isSidebarOpen,
  unreadAlertsCount = 0,
  onOpenAlerts,
}) => {
  const getRoleDisplayName = (role: Role) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'surgeon':
        return 'Médico Cirujano';
      case 'hospital':
        return 'Hospital / Clínica';
      case 'distributor':
        return 'Distribuidor';
      default:
        return 'Usuario';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
        {/* Left: Sidebar trigger (on desktop or tablet) + System Logo unencapsulated full-size */}
        <div className="flex items-center gap-2 sm:gap-4">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-black hover:bg-slate-100 transition-colors cursor-pointer"
              title="Menú"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          {/* Logo del sistema - No encapsulado, tamaño completo */}
          <div className="flex items-center">
            <img
              src="https://appdesignproyectos.com/xcopelogo.png"
              alt="Xcope"
              className="h-9 sm:h-12 w-auto object-contain block max-w-[170px] sm:max-w-[240px] select-none"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Right actions: Identificación del rol activo, Botón Instala Xcope, Botón Cierre de Sesión */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Alertas de Stock / Vencimientos */}
          {unreadAlertsCount > 0 && (
            <button
              onClick={onOpenAlerts}
              title={`${unreadAlertsCount} alertas de inventario y cirugías`}
              className="relative p-2 rounded-xl text-slate-700 hover:text-[#0A2957] hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadAlertsCount}
              </span>
            </button>
          )}

          {/* Identificación del Rol Activo */}
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-[#0A2957] text-xs sm:text-sm font-bold shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#0A2957] shrink-0" />
            <span className="hidden xs:inline">Rol:</span>
            <span className="text-black">{getRoleDisplayName(activeRole)}</span>
          </div>

          {/* Botón de instalación rápida de la aplicación */}
          <PWAInstallButton />

          {/* Botón de cierre de sesión */}
          <button
            onClick={onLogout}
            title="Cerrar sesión y cambiar de rol"
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-red-700 hover:bg-red-50 rounded-xl border border-slate-200 transition-all cursor-pointer whitespace-nowrap"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
};
