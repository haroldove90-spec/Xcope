import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { PWAInstallButton } from './pwa/PWAInstallButton';

interface HomeScreenProps {
  onEnterAdmin: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onEnterAdmin }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-8 sm:px-6 select-none">
      {/* Contenedor central sin header */}
      <div className="flex flex-col items-center max-w-sm sm:max-w-md w-full text-center">
        {/* Logotipo del sistema a tamaño completo sin encapsular */}
        <div className="mb-8 sm:mb-10 w-full flex justify-center">
          <img
            src="https://appdesignproyectos.com/xcopelogo.png"
            alt="Xcope"
            className="h-16 sm:h-22 w-auto max-w-[260px] sm:max-w-[320px] object-contain block select-none"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Tarjeta / Botón de acceso exclusivo al rol: Admin */}
        <button
          onClick={onEnterAdmin}
          className="group w-full max-w-xs sm:max-w-sm p-6 sm:p-8 bg-white border border-slate-200 hover:border-[#0A2957] rounded-3xl shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col items-center justify-center cursor-pointer active:scale-98"
        >
          {/* Icono del rol Admin */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#0A2957] text-[#FFCC01] flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-105 shadow-sm">
            <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-[#FFCC01]" strokeWidth={1.8} />
          </div>

          {/* Nombre del rol: Admin */}
          <span className="text-xl sm:text-2xl font-extrabold text-[#0A2957] group-hover:text-black tracking-tight">
            Admin
          </span>

          <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-slate-500 group-hover:text-[#0A2957] transition-colors">
            <span>Acceder al sistema</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Instalador PWA discreto en el home */}
        <div className="mt-8 flex justify-center">
          <PWAInstallButton />
        </div>

        <div className="mt-8 text-[11px] text-slate-400 font-medium">
          Scope QX · Laparoscopic MX
        </div>
      </div>
    </div>
  );
};
