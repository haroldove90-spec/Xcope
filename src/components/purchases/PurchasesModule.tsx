import React, { useState } from 'react';
import { PayableAccount, Product, Provider, PurchaseOrder, PurchaseOrderItem } from '../../types';
import {
  Truck,
  Plus,
  PackageCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertTriangle,
  Globe,
  Building,
  ArrowDownLeft,
  X,
  FileCheck,
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
  const [activeTab, setActiveTab] = useState<'orders' | 'providers' | 'payables'>('orders');
  const [showNewPOModal, setShowNewPOModal] = useState(false);
  const [showNewProviderModal, setShowNewProviderModal] = useState(false);

  // New PO State
  const [selectedProviderId, setSelectedProviderId] = useState<string>(providers[0]?.id || '');
  const [poCurrency, setPoCurrency] = useState<'MXN' | 'USD'>('MXN');
  const [exchangeRate, setExchangeRate] = useState<number>(18.5);
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
      folio: `OC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      providerId: currentProvider.id,
      providerName: currentProvider.name,
      orderDate: today,
      expectedDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      currency: poCurrency,
      exchangeRate: poCurrency === 'USD' ? exchangeRate : 1,
      items: poItems,
      subtotal,
      shippingCost,
      total,
      status: 'en_transito',
      trackingNumber: `TRK-${Math.floor(1000000 + Math.random() * 9000000)}`,
      carrier: poCurrency === 'USD' ? 'DHL Express Import' : 'Estafeta Terrestre',
    };

    onAddPurchaseOrder(newPO);
    setShowNewPOModal(false);
  };

  const getStatusBadge = (status: PurchaseOrder['status']) => {
    switch (status) {
      case 'en_preparacion':
        return <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">En preparación</span>;
      case 'en_transito':
        return <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">En tránsito</span>;
      case 'en_aduana':
        return <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">En Aduana AICM</span>;
      case 'recibido':
        return <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">Recibido en Bodega</span>;
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-12">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0A2957] bg-blue-50 px-2 py-0.5 rounded-md">
              Cadena de Suministro Quirúrgica
            </span>
            <span className="text-xs text-slate-500 font-mono">Scope QX Compras</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0B1320] mt-1">
            Proveedores, Órdenes de Compra y Cuentas por Pagar
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Abastecimiento con fabricantes de Alemania, EUA y México. Trazabilidad de aduana e incremento de inventario.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowNewPOModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0A2957] hover:bg-[#071c3c] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-[#FFCC01]" />
            <span>+ Nueva Orden de Compra</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-[#0A2957] text-[#FFCC01] shadow-2xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Órdenes de Compra ({purchaseOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('providers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'providers'
              ? 'bg-[#0A2957] text-[#FFCC01] shadow-2xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Padrón de Fabricantes ({providers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payables')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'payables'
              ? 'bg-[#0A2957] text-[#FFCC01] shadow-2xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Cuentas por Pagar ({payables.length})</span>
        </button>
      </div>

      {/* Subtab 1: Órdenes de Compra */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Órdenes de Insumos Quirúrgicos</span>
            <span className="text-xs text-slate-500">Carga automática al inventario al confirmar recepción</span>
          </div>

          <div className="divide-y divide-slate-100">
            {purchaseOrders.map((po) => (
              <div key={po.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#0A2957] bg-blue-50 px-2 py-0.5 rounded">
                      {po.folio}
                    </span>
                    <span className="font-bold text-black">{po.providerName}</span>
                    {getStatusBadge(po.status)}
                  </div>

                  {/* Detalle de partidas */}
                  <div className="mt-2 space-y-1">
                    {po.items.map((it, idx) => (
                      <div key={idx} className="text-slate-600 flex items-center gap-2">
                        <span className="font-mono font-semibold text-black">{it.quantity}x</span>
                        <span>{it.productName} ({it.sku})</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-slate-500 mt-2">
                    <span>Transportista: <strong className="text-slate-700">{po.carrier}</strong></span>
                    {po.trackingNumber && (
                      <span>· Guía: <strong className="font-mono text-[#0A2957]">{po.trackingNumber}</strong></span>
                    )}
                    <span>· Entrega estimada: <strong className="font-mono text-black">{po.expectedDate}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Total Compra:</span>
                    <div className="text-base font-bold font-mono text-black tabular-nums">
                      {po.currency === 'USD' ? `USD $${po.total.toLocaleString()}` : `MXN $${po.total.toLocaleString()}`}
                    </div>
                    {po.currency === 'USD' && po.exchangeRate && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        ≈ ${(po.total * po.exchangeRate).toLocaleString()} MXN (T.C. {po.exchangeRate})
                      </span>
                    )}
                  </div>

                  {po.status !== 'recibido' ? (
                    <button
                      onClick={() => onReceivePurchaseOrder(po.id)}
                      title="Confirmar recepción física en bodega e ingresar piezas al catálogo"
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <PackageCheck className="w-4 h-4" />
                      <span>Confirmar Recepción</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Ingresado a Stock</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 2: Proveedores y Fabricantes */}
      {activeTab === 'providers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {providers.map((p) => (
            <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A2957] bg-slate-100 px-2 py-0.5 rounded">
                    {p.origin === 'importado' ? `Importación (${p.country})` : 'Fabricante Nacional'}
                  </span>
                  <h3 className="text-base font-bold text-black mt-1.5">{p.name}</h3>
                  <span className="text-xs text-slate-500 font-semibold">Marca: {p.brandRepresented}</span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <p>Contacto: <strong className="text-black">{p.contactName}</strong></p>
                <p>Teléfono: <span className="font-mono text-slate-800">{p.phone}</span></p>
                <p>Moneda: <strong className="font-mono text-[#0A2957]">{p.currency}</strong> · {p.paymentTerms}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subtab 3: Cuentas por Pagar */}
      {activeTab === 'payables' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Vencimiento de Facturas a Fabricantes</span>
            <span className="text-xs text-slate-500">Control cambiario USD/MXN</span>
          </div>

          <div className="divide-y divide-slate-100">
            {payables.map((pay) => (
              <div key={pay.id} className="p-4 hover:bg-slate-50 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-black text-sm">{pay.providerName}</span>
                    <span className="font-mono text-slate-500">({pay.invoiceFolio})</span>
                  </div>
                  <div className="text-slate-500 mt-1">
                    Fecha límite de pago: <strong className="font-mono text-black">{pay.dueDate}</strong>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-bold font-mono text-slate-900 tabular-nums">
                    {pay.currency === 'USD' ? `USD $${pay.amount.toLocaleString()}` : `MXN $${pay.amount.toLocaleString()}`}
                  </div>
                  {pay.currency === 'USD' && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      ≈ ${(pay.amount * pay.exchangeRate).toLocaleString()} MXN
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Nueva Orden de Compra */}
      {showNewPOModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-[#0B1320] my-8 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#0A2957]">Generar Orden de Compra (OC)</h3>
              <button
                onClick={() => setShowNewPOModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-black hover:bg-slate-100"
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
                    const prov = providers.find((p) => p.id === e.target.value);
                    if (prov) setPoCurrency(prov.currency);
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.brandRepresented} - {p.currency})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Moneda de la Operación</label>
                  <select
                    value={poCurrency}
                    onChange={(e) => setPoCurrency(e.target.value as 'MXN' | 'USD')}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="MXN">Pesos Mexicanos (MXN)</option>
                    <option value="USD">Dólares Americanos (USD)</option>
                  </select>
                </div>
                {poCurrency === 'USD' && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tipo de Cambio (T.C.)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={exchangeRate}
                      onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 18.5)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Producto a Pedir</label>
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
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
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
                  <label className="block font-bold text-slate-700 mb-1">Cantidad de Piezas</label>
                  <input
                    type="number"
                    min="1"
                    value={poItems[0]?.quantity || 10}
                    onChange={(e) => {
                      const qty = parseInt(e.target.value) || 1;
                      const it = poItems[0];
                      if (it) {
                        setPoItems([{ ...it, quantity: qty, total: qty * it.unitCost }]);
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

              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Insumos:</span>
                  <span className="font-mono font-bold">{poCurrency} ${(poItems[0]?.total || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-[#0A2957] pt-1 border-t border-slate-200">
                  <span>Total Orden:</span>
                  <span className="font-mono">{poCurrency} ${((poItems[0]?.total || 0) + (poCurrency === 'USD' ? 250 : 850)).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
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
                  Generar Orden
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
