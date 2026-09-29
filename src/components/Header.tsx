import React from 'react';
import { PWAInstallButton } from './pwa/PWAInstallButton';
import { ShieldCheck, Bell } from 'lucide-react';

interface HeaderProps {
  unreadAlertsCount?: number;
  onOpenAlerts?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  unreadAlertsCount = 0,
  onOpenAlerts,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs w-full">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 h-14 sm:h-18 flex items-center justify-between gap-2">
        {/* Left: System Logo unencapsulated full-size */}
        <div className="flex items-center gap-2 shrink min-w-0">
          <img
            src="https://appdesignproyectos.com/xcopelogo.png"
            alt="Xcope"
            className="h-7 sm:h-10 md:h-11 w-auto max-w-[125px] xs:max-w-[150px] sm:max-w-[220px] object-contain block select-none"
            referrerPolicy="no-referrer"
          />
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50/80 border border-blue-100 text-[10px] font-bold text-[#0A2957]">
            <span>Scope QX</span>
            <span className="text-[#FFCC01]">/</span>
            <span>Laparoscopic MX</span>
          </div>
        </div>

        {/* Right actions: Rol Admin, Alertas, Botón Instala Xcope */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Alertas Operativas */}
          {unreadAlertsCount > 0 && (
            <button
              onClick={onOpenAlerts}
              title={`${unreadAlertsCount} alertas de inventario y cirugías`}
              className="relative p-1.5 sm:p-2 rounded-xl text-slate-700 hover:text-[#0A2957] hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute top-1 right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-red-600 text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadAlertsCount}
              </span>
            </button>
          )}

          {/* Monorol: Administrador Activo */}
          <div className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-[#0A2957] text-[11px] sm:text-xs font-bold shadow-2xs shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0A2957] shrink-0" />
            <span className="hidden xs:inline text-black">Admin</span>
          </div>

          {/* Botón de instalación rápida de la aplicación */}
          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
};
