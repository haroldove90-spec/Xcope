import React from 'react';
import { PWAInstallButton } from './pwa/PWAInstallButton';
import { ShieldCheck, Bell, Sparkles } from 'lucide-react';

interface HeaderProps {
  unreadAlertsCount?: number;
  onOpenAlerts?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  unreadAlertsCount = 0,
  onOpenAlerts,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
        {/* Left: System Logo unencapsulated full-size */}
        <div className="flex items-center gap-3 sm:gap-4">
          <img
            src="https://appdesignproyectos.com/xcopelogo.png"
            alt="Xcope"
            className="h-9 sm:h-12 w-auto object-contain block max-w-[180px] sm:max-w-[260px] select-none"
            referrerPolicy="no-referrer"
          />
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50/80 border border-blue-100 text-[11px] font-bold text-[#0A2957]">
            <span>Scope QX</span>
            <span className="text-[#FFCC01]">/</span>
            <span>Laparoscopic MX</span>
          </div>
        </div>

        {/* Right actions: Rol Admin, Alertas, Botón Instala Xcope */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Alertas Operativas */}
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

          {/* Monorol: Administrador Activo */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-[#0A2957] text-xs sm:text-sm font-bold shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#0A2957] shrink-0" />
            <span className="text-black">Administrador</span>
          </div>

          {/* Botón de instalación rápida de la aplicación */}
          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
};
