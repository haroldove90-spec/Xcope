import React, { useState } from 'react';
import { PayableAccount, Product, Provider, PurchaseOrder, PurchaseOrderItem } from '../../types';
import {
  Truck,
  Plus,
  PackageCheck,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  Building,
  TrendingUp,
  X,
  CreditCard,
  Clock,
  Calendar,
} from 'lucide-react';

interface PurchasesModuleProps {
  providers: Provider[];
  purchaseOrders: PurchaseOrder[];
  payables: PayableAccount[];
  products: Product[];
  onAddPurchaseOrder: (po: PurchaseOrder) => void;
  onReceivePurchaseOrder: (poId: string) => void;
  onAddProvider: (provider: Provider) => void;
}

export const PurchasesModule: React.FC<PurchasesModuleProps> = ({
  providers,
  purchaseOrders,
  payables,
  products,
  onAddPurchaseOrder,
  onReceivePurchaseOrder,
  onAddProvider,
}) => {
  const [showNewPOModal, setShowNewPOModal] = useState(false);
  const [showNewProviderModal, setShowNewProviderModal] = useState(false);

  // New PO State
  const [selectedProviderId, setSelectedProviderId] = useState<string>(providers[0]?.id || '');
  const [poCurrency, setPoCurrency] = useState<'MXN' | 'USD'>('MXN');
  const [exchangeRate, setExchangeRate] = useState<number>(18.5);
  const [invoiceFolio, setInvoiceFolio] = useState<string>('');
  const [poItems, setPoItems] = useState<PurchaseOrderItem[]>([
    {
      productId: products[0]?.id || '',
      productName: products[0]?.name || '',
      sku: products[0]?.sku || '',
      quantity: 10,
      unitCost: products[0]?.costAcquisition || 1000,
      total: (products[0]?.costAcquisition || 1000) * 10,
    },
  ]);

  // New Provider State
  const [newProv, setNewProv] = useState<Partial<Provider>>({
    name: '',
    brandRepresented: '',
    contactName: '',
    email: '',
    phone: '',
    taxId: '',
    bankAccount: '',
    estimatedDeliveryDays: 7,
    origin: 'nacional',
    country: 'México',
    currency: 'MXN',
    paymentTerms: '30 días crédito',
  });

  const currentProvider = providers.find((p) => p.id === selectedProviderId) || providers[0];

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProvider || poItems.length === 0) return;

    const subtotal = poItems.reduce((acc, it) => acc + it.total, 0);
    const shippingCost = poCurrency === 'USD' ? 250 : 850;
    const total = subtotal + shippingCost;
    const today = new Date().toISOString().split('T')[0];

    const newPO: PurchaseOrder = {
      id: 'po-' + Date.now(),
      folio: invoiceFolio ? `FAC-${invoiceFolio}` : `OC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      providerId: currentProvider.id,
      providerName: currentProvider.name,
      orderDate: today,
      expectedDate: new Date(Date.now() + (currentProvider.estimatedDeliveryDays || 7) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      currency: poCurrency,
      exchangeRate: poCurrency === 'USD' ? exchangeRate : 1,
      items: poItems,
      subtotal,
      shippingCost,
      total,
      status: 'en_transito',
      trackingNumber: `GUIA-${Math.floor(1000000 + Math.random() * 9000000)}`,
      carrier: poCurrency === 'USD' ? 'DHL Express Import' : 'Estafeta Terrestre',
    };

    onAddPurchaseOrder(newPO);
    setShowNewPOModal(false);
  };

  const handleCreateProvider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProv.name) return;

    const created: Provider = {
      id: 'prov-' + Date.now(),
      name: newProv.name,
      brandRepresented: newProv.brandRepresented || 'Instrumental General',
      contactName: newProv.contactName || 'Ventas',
      email: newProv.email || '',
      phone: newProv.phone || '',
      taxId: newProv.taxId || 'RFC Generico',
      bankAccount: newProv.bankAccount || '',
      estimatedDeliveryDays: Number(newProv.estimatedDeliveryDays) || 7,
      origin: newProv.origin as any || 'nacional',
      country: newProv.country || 'México',
      currency: (newProv.currency as any) || 'MXN',
      paymentTerms: newProv.paymentTerms || '30 días',
      rating: 4.8,
    };

    onAddProvider(created);
    setShowNewProviderModal(false);
  };

  // Cost comparison tracking
  const costComparisons = [
    {
      sku: 'LMX-GRASP-533',
      name: 'Pinza Laparoscópica Grasper Maryland 5mm',
      provider: 'Laparoscopic MX',
      previousCost: 3100,
      currentCost: 3400,
      variationPercent: +9.6,
      date: '2026-09-15',
    },
    {
      sku: 'ETH-BLT-1005',
      name: 'Trocar Óptico Bladeless Endopath 5mm',
      provider: 'Ethicon / J&J',
      previousCost: 1100,
      currentCost: 1150,
      variationPercent: +4.5,
      date: '2026-08-20',
    },
    {
      sku: 'ASP-CDX-OPA38',
      name: 'Cidex OPA 3.8 Litros',
      provider: 'ASP Johnson & Johnson',
      previousCost: 1100,
      currentCost: 1100,
      variationPercent: 0,
      date: '2026-09-01',
    },
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-12">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A2957] bg-blue-50 px-2 py-0.5 rounded-md">
              Módulo 3
            </span>
            <span className="text-xs text-slate-500 font-mono">Scope QX Abastecimiento</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-[#0B1320] mt-1">
            Proveedores y Compras Quirúrgicas
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Registro de compras directas al inventario, facturas por pagar y comparativo de variación de costos.
          </p>
        </div>

        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            onClick={() => setShowNewPOModal(true)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-[#0A2957] hover:bg-[#071c3c] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-[#FFCC01]" />
            <span>Cargar Compra / Factura</span>
          </button>

          <button
            onClick={() => setShowNewProviderModal(true)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap"
          >
            <Building className="w-4 h-4 text-[#0A2957]" />
            <span>Nuevo Proveedor</span>
          </button>
        </div>
      </div>

      {/* Grid: Calendario de Cuentas por Pagar + Historial de Costos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendario de Facturas Pendientes (Cuentas por pagar) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#0A2957]" />
              <h3 className="text-base font-bold text-black">Calendario de Facturas por Pagar</h3>
            </div>
            <span className="text-xs text-slate-500 font-mono font-bold">
              {payables.length} compromisos
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {payables.map((pay) => (
              <div key={pay.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-black block">{pay.providerName}</span>
                  <span className="text-slate-500 font-mono">
                    {pay.invoiceFolio} · Límite: <strong className="text-black">{pay.dueDate}</strong>
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-bold font-mono text-black tabular-nums block text-sm">
                    {pay.currency === 'USD' ? `USD $${pay.amount.toLocaleString()}` : `MXN $${pay.amount.toLocaleString()}`}
                  </span>
                  {pay.currency === 'USD' && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      ≈ ${(pay.amount * pay.exchangeRate).toLocaleString()} MXN (T.C. {pay.exchangeRate})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Historial de Costos e Incrementos de Precios */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-black">Monitoreo de Incremento de Costos</h3>
            </div>
            <span className="text-xs text-slate-500">Últimas compras</span>
          </div>

          <div className="divide-y divide-slate-100">
            {costComparisons.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-black block">{item.name}</span>
                  <span className="text-slate-500">
                    Proveedor: {item.provider} · <strong className="font-mono text-[#0A2957]">{item.sku}</strong>
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-center justify-end gap-1.5 font-mono">
                    <span className="text-slate-400 line-through">${item.previousCost}</span>
                    <span className="font-bold text-black">${item.currentCost}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold ${
                      item.variationPercent > 0 ? 'text-red-600' : 'text-emerald-700'
                    }`}
                  >
                    {item.variationPercent > 0 ? `+${item.variationPercent}% subió costo` : 'Sin variación'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Registro de Compras Activas (Alimenta stock automáticamente) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="font-bold text-[#0A2957] uppercase tracking-wider">
            Compras y Notas de Recepción de Mercancía
          </span>
          <span className="text-slate-500">Al pulsar "Confirmar Recepción", ingresa piezas al stock del inventario</span>
        </div>

        <div className="divide-y divide-slate-100">
          {purchaseOrders.map((po) => (
            <div key={po.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#0A2957] bg-blue-50 px-2 py-0.5 rounded">
                    {po.folio}
                  </span>
                  <span className="font-bold text-black text-sm">{po.providerName}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {po.status === 'recibido' ? 'Recibido en Almacén' : po.status}
                  </span>
                </div>

                {/* Items */}
                <div className="mt-2 space-y-1">
                  {po.items.map((it, idx) => (
                    <div key={idx} className="text-slate-600 flex items-center gap-2">
                      <span className="font-mono font-bold text-black">{it.quantity}x piezas</span>
                      <span>{it.productName} ({it.sku})</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-slate-500 mt-2">
                  <span>Transporte: <strong className="text-black">{po.carrier}</strong></span>
                  {po.trackingNumber && (
                    <span>· Guía: <strong className="font-mono text-[#0A2957]">{po.trackingNumber}</strong></span>
                  )}
                  <span>· Fecha esperada: <strong className="font-mono text-black">{po.expectedDate}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Total Compra:</span>
                  <span className="text-base font-bold font-mono text-black tabular-nums block">
                    {po.currency === 'USD' ? `USD $${po.total.toLocaleString()}` : `MXN $${po.total.toLocaleString()}`}
                  </span>
                </div>

                {po.status !== 'recibido' ? (
                  <button
                    onClick={() => onReceivePurchaseOrder(po.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <PackageCheck className="w-4 h-4" />
                    <span>Confirmar Recepción</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Cargado a Inventario</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Directorio de Proveedores: Datos fiscales, CLABE, contacto, tiempo de entrega */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-[#0A2957]" />
            <h3 className="text-base font-bold text-black">Directorio de Fabricantes y Distribuidores Mayoristas</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">{providers.length} laboratorios</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {providers.map((p) => (
            <div key={p.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-black text-sm">{p.name}</h4>
                <span className="text-[10px] font-mono font-bold text-[#0A2957] bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  {p.currency}
                </span>
              </div>
              <p className="text-slate-600 font-semibold">Marca: {p.brandRepresented}</p>

              <div className="space-y-1 text-slate-700 pt-2 border-t border-slate-200/80">
                <p>Contacto de Ventas: <strong className="text-black">{p.contactName}</strong></p>
                <p>Teléfono: <span className="font-mono text-slate-900">{p.phone}</span></p>
                {p.taxId && <p>Datos Fiscales / RFC: <span className="font-mono font-bold text-[#0A2957]">{p.taxId}</span></p>}
                {p.bankAccount && <p>Cuenta / CLABE: <span className="font-mono text-slate-800">{p.bankAccount}</span></p>}
                <p className="text-[#0A2957] font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Entrega estimada: {p.estimatedDeliveryDays || 7} días hábiles</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Carga Rápida de Compra / Factura */}
      {showNewPOModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-[#0B1320] my-8 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#0A2957]">Carga Rápida de Compra o Factura</h3>
              <button
                onClick={() => setShowNewPOModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Fabricante / Proveedor</label>
                <select
                  value={selectedProviderId}
                  onChange={(e) => {
                    setSelectedProviderId(e.target.value);
                    const p = providers.find((pr) => pr.id === e.target.value);
                    if (p) setPoCurrency(p.currency);
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.currency})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Folio Factura o Nota</label>
                  <input
                    type="text"
                    placeholder="FAC-90123"
                    value={invoiceFolio}
                    onChange={(e) => setInvoiceFolio(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Moneda</label>
                  <select
                    value={poCurrency}
                    onChange={(e) => setPoCurrency(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="MXN">Pesos (MXN)</option>
                    <option value="USD">Dólares (USD)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Insumo Quirúrgico Comprado</label>
                <select
                  value={poItems[0]?.productId}
                  onChange={(e) => {
                    const prod = products.find((p) => p.id === e.target.value);
                    if (prod) {
                      setPoItems([
                        {
                          productId: prod.id,
                          productName: prod.name,
                          sku: prod.sku,
                          quantity: poItems[0]?.quantity || 10,
                          unitCost: poCurrency === 'USD' ? Math.round(prod.costAcquisition / 18.5) : prod.costAcquisition,
                          total: (poCurrency === 'USD' ? Math.round(prod.costAcquisition / 18.5) : prod.costAcquisition) * (poItems[0]?.quantity || 10),
                        },
                      ]);
                    }
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.sku}] {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cantidad Comprada</label>
                  <input
                    type="number"
                    min="1"
                    value={poItems[0]?.quantity || 10}
                    onChange={(e) => {
                      const q = parseInt(e.target.value) || 1;
                      const it = poItems[0];
                      if (it) {
                        setPoItems([{ ...it, quantity: q, total: q * it.unitCost }]);
                      }
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Costo Unitario ({poCurrency})</label>
                  <input
                    type="number"
                    step="0.01"
                    value={poItems[0]?.unitCost || 0}
                    onChange={(e) => {
                      const cost = parseFloat(e.target.value) || 0;
                      const it = poItems[0];
                      if (it) {
                        setPoItems([{ ...it, unitCost: cost, total: it.quantity * cost }]);
                      }
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-right font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewPOModal(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#0A2957] hover:bg-[#071c3c] rounded-xl shadow-xs"
                >
                  Registrar Compra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Alta de Proveedor */}
      {showNewProviderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-[#0B1320] my-8 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#0A2957]">Alta de Fabricante o Distribuidor</h3>
              <button
                onClick={() => setShowNewProviderModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProvider} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Razón Social del Proveedor</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Karl Storz Endoscopia México"
                  value={newProv.name || ''}
                  onChange={(e) => setNewProv({ ...newProv, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Marca Representada</label>
                  <input
                    type="text"
                    placeholder="Karl Storz, Ethicon, Medtronic..."
                    value={newProv.brandRepresented || ''}
                    onChange={(e) => setNewProv({ ...newProv, brandRepresented: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contacto de Ventas</label>
                  <input
                    type="text"
                    placeholder="Lic. Roberto Valdés"
                    value={newProv.contactName || ''}
                    onChange={(e) => setNewProv({ ...newProv, contactName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">RFC / Datos Fiscales</label>
                  <input
                    type="text"
                    placeholder="KSE980112XX4"
                    value={newProv.taxId || ''}
                    onChange={(e) => setNewProv({ ...newProv, taxId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cuenta Bancaria / CLABE</label>
                  <input
                    type="text"
                    placeholder="012180001234567890"
                    value={newProv.bankAccount || ''}
                    onChange={(e) => setNewProv({ ...newProv, bankAccount: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tiempo Estimado de Entrega (Días)</label>
                  <input
                    type="number"
                    value={newProv.estimatedDeliveryDays || 7}
                    onChange={(e) => setNewProv({ ...newProv, estimatedDeliveryDays: parseInt(e.target.value) || 7 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    placeholder="+52 55 5280 4400"
                    value={newProv.phone || ''}
                    onChange={(e) => setNewProv({ ...newProv, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewProviderModal(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#0A2957] hover:bg-[#071c3c] rounded-xl shadow-xs"
                >
                  Guardar Proveedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
