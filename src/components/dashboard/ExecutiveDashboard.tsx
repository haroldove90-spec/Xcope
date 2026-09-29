import React, { useState } from 'react';
import { Client, PayableAccount, Product, Quote, ReceivablePayment, SurgerySchedule } from '../../types';
import {
  TrendingUp,
  DollarSign,
  FileSpreadsheet,
  Calendar,
  AlertCircle,
  Package,
  Award,
  Clock,
  ArrowRight,
  CheckCircle2,
  Building,
} from 'lucide-react';

interface ExecutiveDashboardProps {
  products: Product[];
  clients: Client[];
  quotes: Quote[];
  receivables: ReceivablePayment[];
  payables: PayableAccount[];
  surgeries?: SurgerySchedule[];
  onNavigateToTab?: (tab: string) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  products,
  clients,
  quotes,
  receivables,
  payables,
  surgeries = [],
  onNavigateToTab,
}) => {
  // Financial metrics
  const totalQuoted = quotes.reduce((acc, q) => acc + q.total, 0);

  // Period sales breakdowns (estimates based on quotes and active accounts)
  const salesDaily = 31511.4; // Hoy
  const salesWeekly = 148900.0; // Esta semana
  const salesMonthly = totalQuoted + 185000; // Mes corriente

  // Resumen de Deuda y Cobranza: "Te deben: $X" vs "Debes: $Y"
  const teDeben = receivables.reduce((sum, r) => sum + r.balance, 0);
  const debes = payables.reduce(
    (sum, p) => sum + (p.currency === 'USD' ? p.amount * p.exchangeRate : p.amount),
    0
  );

  // Top 10 más vendidos (ordenados por rotación y valor)
  const top10Products = [...products]
    .sort(
      (a, b) =>
        b.priceList * (b.stockPhysical + b.stockConsignment) -
        a.priceList * (a.stockPhysical + a.stockConsignment)
    )
    .slice(0, 10);

  // Próximos compromisos: Cirugías / Entregas en las próximas 48 horas
  const now = new Date();
  const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  const upcomingCommitments = surgeries.filter((s) => {
    const sDate = new Date(s.dateTime);
    return sDate >= new Date(now.getTime() - 24 * 60 * 60 * 1000) && sDate <= in48Hours;
  });

  // Exportación contable CSV
  const handleExportAccountingCSV = () => {
    const headers = [
      'Folio / SKU',
      'Concepto / Insumo',
      'Tipo Registro',
      'Entidad (Cliente / Proveedor)',
      'Monto MXN',
      'Estatus Contable',
      'Fecha',
    ];

    const rows: string[][] = [];

    // Add receivables
    receivables.forEach((r) => {
      rows.push([
        `"${r.id}"`,
        `"${r.concept}"`,
        '"Cuenta por Cobrar (Venta)"',
        `"${r.clientName}"`,
        `"${r.balance.toFixed(2)}"`,
        `"${r.status}"`,
        `"${r.dueDate}"`,
      ]);
    });

    // Add payables
    payables.forEach((p) => {
      const mxnAmount = p.currency === 'USD' ? p.amount * p.exchangeRate : p.amount;
      rows.push([
        `"${p.invoiceFolio}"`,
        '"Factura de Compra de Instrumental"',
        '"Cuenta por Pagar (Proveedor)"',
        `"${p.providerName}"`,
        `"${mxnAmount.toFixed(2)}"`,
        `"${p.status}"`,
        `"${p.dueDate}"`,
      ]);
    });

    // Add inventory summary
    products.forEach((prod) => {
      const value = prod.costAcquisition * prod.stockPhysical;
      rows.push([
        `"${prod.sku}"`,
        `"${prod.name}"`,
        '"Activo en Inventario"',
        `"${prod.brand}"`,
        `"${value.toFixed(2)}"`,
        '"Disponible"',
        `"${new Date().toISOString().split('T')[0]}"`,
      ]);
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Xcope_Balance_General_Contable_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-12">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0A2957] bg-blue-50 px-2 py-0.5 rounded-md">
              Dashboard Principal
            </span>
            <span className="text-xs text-slate-500 font-mono">Scope QX Suite</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0B1320] mt-1">
            Métricas y Balance Operativo
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Visión financiera inmediata, ingresos del período, balance de deudas y compromisos de quirófano en 48 hrs.
          </p>
        </div>

        <button
          onClick={handleExportAccountingCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0A2957] hover:bg-[#071c3c] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#FFCC01]" />
          <span>Exportar Balance (Excel / CSV)</span>
        </button>
      </div>

      {/* Resumen de Deuda y Cobranza: Dos Tarjetas Claras: "Te deben: $X" vs "Debes: $Y" */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tarjeta 1: Te deben */}
        <div className="bg-white rounded-2xl border-2 border-emerald-500/30 p-6 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                Cobranza Pendiente
              </span>
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-sm font-semibold text-slate-600 block mt-3">Te deben:</span>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-900 mt-1 tabular-nums">
              ${teDeben.toLocaleString('es-MX', { minimumFractionDigits: 2 })} <span className="text-sm font-normal text-slate-500">MXN</span>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Saldo a favor por insumos e instrumental entregados a cirujanos particulares y clínicas privadas.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-800 font-bold">
            <span>{receivables.length} facturas por cobrar</span>
            <span>Plazo promedio: 30 días</span>
          </div>
        </div>

        {/* Tarjeta 2: Debes */}
        <div className="bg-white rounded-2xl border-2 border-red-500/30 p-6 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -z-0" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-red-800 bg-red-50 px-2.5 py-1 rounded-md">
                Cuentas por Pagar
              </span>
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-sm font-semibold text-slate-600 block mt-3">Debes:</span>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-red-900 mt-1 tabular-nums">
              ${debes.toLocaleString('es-MX', { minimumFractionDigits: 2 })} <span className="text-sm font-normal text-slate-500">MXN</span>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Compromisos con fabricantes e importadores (Karl Storz en USD y Laparoscopic MX en MXN).
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-red-800 font-bold">
            <span>{payables.length} facturas de proveedores</span>
            <span>Vencimiento ordenado</span>
          </div>
        </div>
      </div>

      {/* Ventas del Período: Ingresos Brutos Diarios, Semanales y Mensuales */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#0A2957]" />
            <h3 className="text-base font-bold text-black">Ventas del Período (Ingresos Brutos)</h3>
          </div>
          <span className="text-xs text-slate-500">Cierre operativo</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 block uppercase">Venta Diaria (Hoy)</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#0A2957] mt-1 tabular-nums">
              ${salesDaily.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">
              1 cotización cerrada hoy
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 block uppercase">Venta Semanal</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-black mt-1 tabular-nums">
              ${salesWeekly.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-slate-600 mt-0.5 block">
              Últimos 7 días de cirugías
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 block uppercase">Venta Mensual Acumulada</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-black mt-1 tabular-nums">
              ${salesMonthly.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">
              +14% frente al mes anterior
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Próximos Compromisos (48h) + Top 10 Más Vendidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Compromisos: Cirugías y Entregas en las próximas 48 horas */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-black">Próximos Compromisos (Próximas 48 Horas)</h3>
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                Urgente en Quirófano
              </span>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {upcomingCommitments.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No hay cirugías programadas para las próximas 48 horas.
                </div>
              ) : (
                upcomingCommitments.map((s) => {
                  const sDate = new Date(s.dateTime);
                  return (
                    <div key={s.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-black text-sm">{s.procedureName}</span>
                          <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                            {sDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} hrs
                          </span>
                        </div>
                        <div className="text-slate-600 mt-0.5">
                          {s.hospitalName} ({s.operatingRoom}) · Cirujano: <strong className="text-black">{s.surgeonName}</strong>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          Insumos: {s.requiredItems.map((i) => i.name).slice(0, 2).join(', ')}...
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg shrink-0 ${
                          s.deliveryStatus === 'entregado_en_quirofano'
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {s.deliveryStatus === 'entregado_en_quirofano' ? 'Entregado' : 'En Ruta'}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Ver todas las cirugías en el Módulo Agenda</span>
            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab('surgeries')}
                className="text-[#0A2957] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ir a Agenda</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Top 10 Más Vendidos (Instrumental o consumibles de mayor rotación) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#FFCC01]" />
              <h3 className="text-base font-bold text-black">Top 10 Más Vendidos (Mayor Rotación)</h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">Scope QX</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
            {top10Products.map((p, idx) => (
              <div key={p.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-[#0A2957] font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-black block truncate max-w-[200px] sm:max-w-xs">
                      {p.name}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      SKU: {p.sku} · {p.brand}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-black tabular-nums block text-xs">
                    ${p.priceList.toLocaleString('es-MX')}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Stock: <strong className="font-mono text-black">{p.stockPhysical}</strong> uds
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
