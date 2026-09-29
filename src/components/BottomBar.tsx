import React from 'react';
import { Package, Users, Calendar, Truck, BarChart3 } from 'lucide-react';

export type ActiveTab = 'inventory' | 'clients' | 'surgeries' | 'purchases' | 'metrics';

interface BottomBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  alertsCount?: {
    inventory: number;
    surgeries: number;
    clients: number;
  };
}

export const BottomBar: React.FC<BottomBarProps> = ({
  activeTab,
  onTabChange,
  alertsCount = { inventory: 0, surgeries: 0, clients: 0 },
}) => {
  const navItems = [
    {
      id: 'inventory' as ActiveTab,
      label: 'Catálogo',
      icon: Package,
      badge: alertsCount.inventory,
    },
    {
      id: 'clients' as ActiveTab,
      label: 'Clientes',
      icon: Users,
      badge: alertsCount.clients,
    },
    {
      id: 'surgeries' as ActiveTab,
      label: 'Cirugías',
      icon: Calendar,
      badge: alertsCount.surgeries,
    },
    {
      id: 'purchases' as ActiveTab,
      label: 'Compras',
      icon: Truck,
      badge: 0,
    },
    {
      id: 'metrics' as ActiveTab,
      label: 'Métricas',
      icon: BarChart3,
      badge: 0,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg safe-bottom no-print">
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative flex flex-col items-center justify-center gap-1 transition-colors select-none cursor-pointer py-1 ${
                isActive
                  ? 'text-[#0A2957]'
                  : 'text-slate-600 hover:text-[#0A2957]'
              }`}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#0A2957] rounded-b-md" />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-[#0A2957]' : 'text-slate-500'
                  }`}
                  strokeWidth={isActive ? 2.3 : 1.8}
                />
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 px-1 min-w-[14px] h-3.5 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] font-semibold tracking-tight truncate max-w-full px-1 ${
                  isActive ? 'text-[#0A2957] font-bold' : 'text-slate-600'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
