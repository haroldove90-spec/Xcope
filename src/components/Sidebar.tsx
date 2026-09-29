import React from 'react';
import { ActiveTab } from './BottomBar';
import {
  BarChart3,
  Package,
  Users,
  Truck,
  Calendar,
  FileText,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  alerts: {
    lowStockCount: number;
    expiringLotsCount: number;
    pendingSurgeriesCount: number;
    pendingQuotesCount: number;
  };
  onOpenQuickQuote: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
  alerts,
  onOpenQuickQuote,
}) => {
  const menuItems = [
    {
      id: 'metrics' as ActiveTab,
      label: 'Métricas y Balance',
      sublabel: 'Ingresos, Deudas y Top 10',
      icon: BarChart3,
      alertCount: 0,
    },
    {
      id: 'inventory' as ActiveTab,
      label: 'Productos e Inventario',
      sublabel: 'Catálogo, Lotes y Existencias',
      icon: Package,
      alertCount: alerts.lowStockCount + alerts.expiringLotsCount,
    },
    {
      id: 'clients' as ActiveTab,
      label: 'Clientes y Cotizaciones',
      sublabel: 'Contactos, PDF y Cobranza',
      icon: Users,
      alertCount: alerts.pendingQuotesCount,
    },
    {
      id: 'purchases' as ActiveTab,
      label: 'Proveedores y Compras',
      sublabel: 'Facturas, Gastos y Costos',
      icon: Truck,
      alertCount: 0,
    },
    {
      id: 'surgeries' as ActiveTab,
      label: 'Agenda y Envíos',
      sublabel: 'Cirugías, Guías y Despacho',
      icon: Calendar,
      alertCount: alerts.pendingSurgeriesCount,
    },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 select-none ${
        isCollapsed ? 'w-20' : 'w-72'
      } shrink-0 sticky top-16 sm:top-20 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] z-30 no-print`}
    >
      {/* Quick Action Button: Generador de Cotizaciones Rápidas */}
      <div className="p-4 border-b border-slate-100">
        {!isCollapsed ? (
          <button
            onClick={onOpenQuickQuote}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0A2957] hover:bg-[#071c3c] text-white font-bold text-sm shadow-sm transition-all cursor-pointer group"
          >
            <FileText className="w-4 h-4 text-[#FFCC01] group-hover:scale-110 transition-transform" />
            <span>+ Nueva Cotización PDF</span>
          </button>
        ) : (
          <button
            onClick={onOpenQuickQuote}
            title="Nueva Cotización"
            className="w-full flex items-center justify-center p-3 rounded-xl bg-[#0A2957] hover:bg-[#071c3c] text-[#FFCC01] transition-all cursor-pointer"
          >
            <FileText className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Navigation List - 5 Monorol Modules */}
      <div className="flex-1 py-4 px-3 space-y-2 overflow-y-auto">
        <div className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {!isCollapsed && 'Módulos Operativos'}
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-xl transition-all cursor-pointer text-left relative group ${
                isActive
                  ? 'bg-[#0A2957] text-white font-bold shadow-xs'
                  : 'text-slate-700 hover:text-black hover:bg-slate-100 font-medium'
              }`}
            >
              <div
                className={`p-2 rounded-lg shrink-0 transition-colors ${
                  isActive
                    ? 'bg-white/15 text-[#FFCC01]'
                    : 'bg-slate-100 text-[#0A2957] group-hover:bg-[#0A2957]/10'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm truncate block">{item.label}</span>
                    {item.alertCount > 0 && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-[#FFCC01] text-[#0A2957]'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {item.alertCount}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[11px] block truncate ${
                      isActive ? 'text-slate-200' : 'text-slate-600'
                    }`}
                  >
                    {item.sublabel}
                  </span>
                </div>
              )}

              {/* Tooltip dot for collapsed mode */}
              {isCollapsed && item.alertCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Collapse button */}
      <div className="p-3 border-t border-slate-100 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <ShieldCheck className="w-4 h-4 text-[#0A2957]" />
            <span>Xcope Admin Suite</span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expandir panel' : 'Colapsar panel'}
          className="p-2 rounded-xl text-slate-500 hover:text-black hover:bg-slate-100 transition-colors cursor-pointer ml-auto"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
};
