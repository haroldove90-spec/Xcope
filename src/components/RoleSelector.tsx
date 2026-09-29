import React, { useState } from 'react';
import { Role } from '../types';
import { ShieldCheck, Stethoscope, Building2, Truck, AlertCircle, ArrowRight } from 'lucide-react';

interface RoleSelectorProps {
  onSelectRole: (role: Role) => void;
  activeRole: Role | null;
}

interface RoleOption {
  id: Role;
  name: string;
  icon: React.ElementType;
  available: boolean;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole, activeRole }) => {
  const [notification, setNotification] = useState<string | null>(null);

  const roles: RoleOption[] = [
    {
      id: 'admin',
      name: 'Administrador',
      icon: ShieldCheck,
      available: true,
    },
    {
      id: 'surgeon',
      name: 'Médico Cirujano',
      icon: Stethoscope,
      available: false,
    },
    {
      id: 'hospital',
      name: 'Hospital / Clínica',
      icon: Building2,
      available: false,
    },
    {
      id: 'distributor',
      name: 'Distribuidor',
      icon: Truck,
      available: false,
    },
  ];

  const handleRoleClick = (role: RoleOption) => {
    if (role.available) {
      onSelectRole(role.id);
    } else {
      setNotification(`En esta primera fase el sistema opera de forma centralizada bajo el rol Administrador. Selecciona 'Administrador' para acceder al catálogo, cotizaciones y operaciones.`);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-8 sm:px-6">
      {/* Brand presentation with unboxed full-size logo */}
      <div className="mb-10 flex flex-col items-center text-center max-w-md w-full">
        <img
          src="https://appdesignproyectos.com/xcopelogo.png"
          alt="Xcope Logo"
          className="h-16 sm:h-20 w-auto object-contain mb-4 select-none"
          referrerPolicy="no-referrer"
        />
        <div className="flex items-center gap-2 text-xs font-semibold text-[#0A2957]">
          <span>Scope QX</span>
          <span className="text-[#FFCC01] font-bold">/</span>
          <span>Laparoscopic MX</span>
        </div>
      </div>

      {notification && (
        <div className="mb-6 max-w-lg w-full bg-amber-50 border-l-4 border-[#FFCC01] p-4 text-[#0B1320] text-sm flex items-start gap-3 rounded-r-lg shadow-sm animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-[#0A2957] shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-[#0A2957]">Aviso de Acceso (Fase 1)</p>
            <p className="text-xs text-slate-700 mt-0.5">{notification}</p>
          </div>
          <button
            onClick={() => onSelectRole('admin')}
            className="text-xs font-bold text-[#0A2957] underline hover:text-black shrink-0 flex items-center gap-1"
          >
            Entrar como Admin <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Grid: 2 columns on mobile, 4 columns on desktop */}
      <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {roles.map((role) => {
          const Icon = role.icon;
          const isActive = activeRole === role.id;

          return (
            <button
              key={role.id}
              onClick={() => handleRoleClick(role)}
              className={`group relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl transition-all duration-200 text-center border cursor-pointer select-none min-h-[170px] sm:min-h-[190px] ${
                role.id === 'admin'
                  ? 'bg-white border-[#0A2957]/20 hover:border-[#0A2957] hover:shadow-lg shadow-sm ring-1 ring-[#0A2957]/10'
                  : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white hover:shadow-md'
              }`}
            >
              {/* Highlight badge for Admin */}
              {role.id === 'admin' && (
                <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#FFCC01] text-[#0A2957] rounded-md shadow-xs">
                  Activo
                </span>
              )}

              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-105 ${
                  role.id === 'admin'
                    ? 'bg-[#0A2957] text-[#FFCC01]'
                    : 'bg-slate-100 text-slate-600 group-hover:bg-[#0A2957]/10 group-hover:text-[#0A2957]'
                }`}
              >
                <Icon className="w-7 h-7" strokeWidth={1.8} />
              </div>

              {/* Clean role name: "solo nombre del rol" */}
              <span
                className={`text-base sm:text-lg font-bold transition-colors ${
                  role.id === 'admin'
                    ? 'text-[#0A2957] group-hover:text-black'
                    : 'text-[#0B1320]'
                }`}
              >
                {role.name}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-12 text-center text-xs text-slate-500">
        <span>Xcope Suite Operativa v2.4</span>
        <span className="mx-2">·</span>
        <span>Instrumental y Cirugía de Alta Especialidad</span>
      </div>
    </div>
  );
};
