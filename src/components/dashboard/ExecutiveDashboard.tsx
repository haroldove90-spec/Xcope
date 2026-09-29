import React from 'react';
import { Client, PayableAccount, Product, Quote, ReceivablePayment } from '../../types';
import {
  TrendingUp,
  DollarSign,
  Download,
  Users,
  Package,
  AlertTriangle,
  Award,
  ArrowUpRight,
  FileSpreadsheet,
  Building,
} from 'lucide-react';

interface ExecutiveDashboardProps {
  products: Product[];
  clients: Client[];
  quotes: Quote[];
  receivables: ReceivablePayment[];
  payables: PayableAccount[];
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  products,
  clients,
  quotes,
  receivables,
  payables,
}) => {
  // Financial Calculations
  const totalQuoted = quotes.reduce((acc, q) => acc + q.total, 0);
  const totalReceivableBalance = receivables.reduce((acc, r) => acc + r.balance, 0);
  const totalPayableBalance = payables.reduce((acc, p) => acc + (p.currency === 'USD' ? p.amount * p.exchangeRate : p.amount), 0);
  
  // Approximate sales margin across catalog
  const avgMargin = Math.round(
    products.reduce((acc, p) => {
      const margin = p.priceList > 0 ? ((p.priceList - p.costAcquisition) / p.priceList) * 100 : 0;
      return acc + margin;
    }, 0) / (products.length || 1)
  );

  // Top products (most valuable stock and volume)
  const topProducts = [...products]
    .sort((a, b) => (b.priceList * (b.stockPhysical + b.stockConsignment)) - (a.priceList * (a.stockPhysical + a.stockConsignment)))
    .slice(0, 5);

  // Top clients by balance/transaction volume
  const topClients = [...clients]
    .sort((a, b) => b.creditLimit - a.creditLimit)
    .slice(0, 5);

  // Overdue receivables
  const overdueReceivables = receivables.filter((r) => r.status === 'vencido' || new Date(r.dueDate) < new Date());

  // Export to CSV for accountant
  const handleExportCSV = () => {
    const headers = ['SKU', 'Nombre', 'Marca', 'Stock Bodega', 'Stock Consignación', 'Costo Adquisición (MXN)', 'Precio Lista (MXN)', 'Margen %'];
    const rows = products.map((p) => {
      const margin = p.priceList > 0 ? Math.round(((p.priceList - p.costAcquisition) / p.priceList) * 100) : 0;
      return [
        `"${p.sku}"`,
        `"${p.name}"`,
        `"${p.brand}"`,
        p.stockPhysical,
        p.stockConsignment,
        p.costAcquisition,
        p.priceList,
        `"${margin}%"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Xcope_Reporte_Inventario_Contable_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-12">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0A2957] bg-blue-50 px-2 py-0.5 rounded-md">
              Dashboard Ejecutivo
            </span>
            <span className="text-xs text-slate-500 font-mono">Scope QX Métricas</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0B1320] mt-1">
            Indicadores Clave, Cartera y Análisis Contable
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Volumen de cotizaciones, top insumos que generan flujo, antigüedad de saldos y exportación en Excel.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0A2957] hover:bg-[#071c3c] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#FFCC01]" />
            <span>Exportar Contable (Excel / CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Cotizado Este Periodo</span>
            <div className="p-2 rounded-xl bg-blue-50 text-[#0A2957]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-black mt-2 tabular-nums">
            ${totalQuoted.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            {quotes.length} presupuestos emitidos
          </span>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Margen Bruto Estimado</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-black mt-2 tabular-nums">
            +{avgMargin}%
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Promedio sobre costo de adquisición
          </span>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Cuentas por Cobrar</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-800">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#0A2957] mt-2 tabular-nums">
            ${totalReceivableBalance.toLocaleString('es-MX', { minimumFractionDigits: 0 })}
          </div>
          <span className="text-[11px] text-red-600 font-semibold mt-1 block">
            {overdueReceivables.length} créditos vencidos
          </span>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Cuentas por Pagar Proveedor</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-800">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-black mt-2 tabular-nums">
            ${totalPayableBalance.toLocaleString('es-MX', { minimumFractionDigits: 0 })}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Karl Storz (USD) y Laparoscopic MX
          </span>
        </div>
      </div>

      {/* Grid: Top Products (80/20) + Top Hospitals/Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#FFCC01]" />
              <h3 className="text-base font-bold text-black">Top Productos Quirúrgicos (Flujo de Caja)</h3>
            </div>
            <span className="text-xs text-slate-500">Regla 80/20</span>
          </div>

          <div className="divide-y divide-slate-100">
            {topProducts.map((p, i) => {
              const totalVal = p.priceList * (p.stockPhysical + p.stockConsignment);
              const margin = p.priceList > 0 ? Math.round(((p.priceList - p.costAcquisition) / p.priceList) * 100) : 0;

              return (
                <div key={p.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-[#0A2957] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <div>
                      <span className="font-bold text-black block">{p.name}</span>
                      <span className="text-slate-500">
                        {p.brand} · SKU: <strong className="font-mono text-[#0A2957]">{p.sku}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-bold font-mono text-black tabular-nums block">
                      ${p.priceList.toLocaleString('es-MX')}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      +{margin}% margen
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Hospitals & Doctors */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-[#0A2957]" />
              <h3 className="text-base font-bold text-black">Rendimiento por Cliente y Hospital</h3>
            </div>
            <span className="text-xs text-slate-500">Líneas autorizadas</span>
          </div>

          <div className="divide-y divide-slate-100">
            {topClients.map((c, i) => (
              <div key={c.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-black block">{c.name}</span>
                  <span className="text-slate-500">
                    {c.specialty || c.type} · {c.preferredHospital || 'CDMX'}
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block">Límite Crédito:</span>
                  <span className="font-bold font-mono text-[#0A2957] tabular-nums block">
                    ${c.creditLimit.toLocaleString('es-MX')}
                  </span>
                  <span className="text-[10px] text-slate-600">
                    {c.creditDays} días plazo
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Antigüedad de Saldos y Alertas Contables */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-black">Antigüedad de Saldos y Auditoría de Cobranza</h3>
            <p className="text-xs text-slate-500">Semáforo de cuentas por cobrar para el cierre mensual</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="font-bold text-emerald-900 block">Corriente (&lt; 30 días)</span>
            <div className="text-lg font-bold font-mono text-emerald-800 mt-1">$145,000 MXN</div>
            <span className="text-[11px] text-emerald-700">Hospital Ángeles y Doctores con pago puntual</span>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <span className="font-bold text-amber-900 block">Por Vencer (31 - 60 días)</span>
            <div className="text-lg font-bold font-mono text-amber-800 mt-1">$89,400 MXN</div>
            <span className="text-[11px] text-amber-700">En proceso de revisión en compras hospitalarias</span>
          </div>

          <div className="p-4 bg-red-50 rounded-xl border border-red-200">
            <span className="font-bold text-red-900 block">Vencido (&gt; 60 días)</span>
            <div className="text-lg font-bold font-mono text-red-700 mt-1">$62,000 MXN</div>
            <span className="text-[11px] text-red-600">Requiere llamada o suspensión de pedidos</span>
          </div>
        </div>
      </div>
    </div>
  );
};
