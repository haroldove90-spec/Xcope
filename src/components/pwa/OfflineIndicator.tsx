import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-18 lg:bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500 text-[#0B1320] px-3.5 py-2 text-xs font-bold shadow-xl border border-amber-600 animate-in fade-in duration-200 no-print">
      <WifiOff className="w-4 h-4 text-black shrink-0" />
      <span>Modo Sin Conexión — Datos almacenados localmente en Xcope.</span>
    </div>
  );
};
