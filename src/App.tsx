import React, { useState, useEffect } from 'react';
import { Client, PayableAccount, Product, Provider, PurchaseOrder, Quote, ReceivablePayment, SurgerySchedule } from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CLIENTS,
  INITIAL_QUOTES,
  INITIAL_PROVIDERS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_PAYABLES,
  INITIAL_RECEIVABLES,
  INITIAL_SURGERIES,
  getStoredData,
  setStoredData,
} from './data/mockData';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomBar, ActiveTab } from './components/BottomBar';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { InventoryModule } from './components/inventory/InventoryModule';
import { ClientsModule } from './components/clients/ClientsModule';
import { PurchasesModule } from './components/purchases/PurchasesModule';
import { SurgeriesModule } from './components/surgeries/SurgeriesModule';
import { QuoteGeneratorModal } from './components/quotes/QuoteGeneratorModal';
import { QuoteViewerModal } from './components/quotes/QuoteViewerModal';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { ShieldAlert, X, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Monorol: Exclusively Admin role directly loaded on boot
  // Default module: 'metrics' (Métricas y Balance as the main dashboard on open)
  const [activeTab, setActiveTab] = useState<ActiveTab>('metrics');

  // Sidebar collapse toggle
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Core Data States (persisted in localStorage)
  const [products, setProducts] = useState<Product[]>(() =>
    getStoredData('products', INITIAL_PRODUCTS)
  );
  const [clients, setClients] = useState<Client[]>(() =>
    getStoredData('clients', INITIAL_CLIENTS)
  );
  const [quotes, setQuotes] = useState<Quote[]>(() =>
    getStoredData('quotes', INITIAL_QUOTES)
  );
  const [providers, setProviders] = useState<Provider[]>(() =>
    getStoredData('providers', INITIAL_PROVIDERS)
  );
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() =>
    getStoredData('purchase_orders', INITIAL_PURCHASE_ORDERS)
  );
  const [payables, setPayables] = useState<PayableAccount[]>(() =>
    getStoredData('payables', INITIAL_PAYABLES)
  );
  const [receivables, setReceivables] = useState<ReceivablePayment[]>(() =>
    getStoredData('receivables', INITIAL_RECEIVABLES)
  );
  const [surgeries, setSurgeries] = useState<SurgerySchedule[]>(() =>
    getStoredData('surgeries', INITIAL_SURGERIES)
  );

  // Modals state
  const [isQuoteGeneratorOpen, setIsQuoteGeneratorOpen] = useState(false);
  const [preselectedClientForQuote, setPreselectedClientForQuote] = useState<Client | null>(null);
  const [viewingQuote, setViewingQuote] = useState<Quote | null>(null);
  const [showAlertsModal, setShowAlertsModal] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    setStoredData('products', products);
  }, [products]);

  useEffect(() => {
    setStoredData('clients', clients);
  }, [clients]);

  useEffect(() => {
    setStoredData('quotes', quotes);
  }, [quotes]);

  useEffect(() => {
    setStoredData('providers', providers);
  }, [providers]);

  useEffect(() => {
    setStoredData('purchase_orders', purchaseOrders);
  }, [purchaseOrders]);

  useEffect(() => {
    setStoredData('payables', payables);
  }, [payables]);

  useEffect(() => {
    setStoredData('receivables', receivables);
  }, [receivables]);

  useEffect(() => {
    setStoredData('surgeries', surgeries);
  }, [surgeries]);

  // Compute Alerts
  const lowStockProducts = products.filter((p) => p.stockPhysical <= p.minStockAlert);
  const expiringLots = products.flatMap((p) =>
    (p.lots || [])
      .filter((l) => {
        const diff = Math.ceil((new Date(l.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return diff <= 90;
      })
      .map((l) => ({ ...l, productName: p.name, sku: p.sku }))
  );
  const todaySurgeries = surgeries.filter(
    (s) => new Date(s.dateTime).toDateString() === new Date().toDateString()
  );

  const totalAlertsCount = lowStockProducts.length + expiringLots.length + todaySurgeries.length;

  // Handlers for Inventory
  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Handlers for Clients & Receivables
  const handleAddClient = (newClient: Client) => {
    setClients((prev) => [newClient, ...prev]);
  };

  const handleUpdateClient = (updatedClient: Client) => {
    setClients((prev) => prev.map((c) => (c.id === updatedClient.id ? updatedClient : c)));
  };

  const handleRecordReceivablePayment = (receivableId: string, amount: number) => {
    setReceivables((prev) =>
      prev.map((r) => {
        if (r.id === receivableId) {
          const newBalance = Math.max(0, r.balance - amount);
          return {
            ...r,
            paidAmount: r.paidAmount + amount,
            balance: newBalance,
            status: newBalance === 0 ? 'pagado' : 'parcial',
          };
        }
        return r;
      })
    );

    const rec = receivables.find((r) => r.id === receivableId);
    if (rec) {
      setClients((prev) =>
        prev.map((c) => {
          if (c.id === rec.clientId) {
            return {
              ...c,
              balanceDue: Math.max(0, c.balanceDue - amount),
            };
          }
          return c;
        })
      );
    }
  };

  // Handlers for Quotes
  const handleSaveQuote = (newQuote: Quote) => {
    setQuotes((prev) => [newQuote, ...prev]);
    setViewingQuote(newQuote);
  };

  const handleOpenNewQuote = (client?: Client) => {
    setPreselectedClientForQuote(client || null);
    setIsQuoteGeneratorOpen(true);
  };

  // Handlers for Purchases & Automatic Inventory Increment
  const handleAddPurchaseOrder = (newPO: PurchaseOrder) => {
    setPurchaseOrders((prev) => [newPO, ...prev]);

    const newPayable: PayableAccount = {
      id: 'pay-' + Date.now(),
      providerId: newPO.providerId,
      providerName: newPO.providerName,
      invoiceFolio: `FAC-${newPO.folio}`,
      amount: newPO.total,
      currency: newPO.currency,
      exchangeRate: newPO.exchangeRate || 1,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pendiente',
    };
    setPayables((prev) => [newPayable, ...prev]);
  };

  const handleReceivePurchaseOrder = (poId: string) => {
    const po = purchaseOrders.find((p) => p.id === poId);
    if (!po || po.status === 'recibido') return;

    setPurchaseOrders((prev) =>
      prev.map((p) =>
        p.id === poId
          ? { ...p, status: 'recibido', receivedAt: new Date().toISOString().split('T')[0] }
          : p
      )
    );

    // Automatically load items into catalog stock
    setProducts((prev) =>
      prev.map((prod) => {
        const itemReceived = po.items.find((it) => it.productId === prod.id || it.sku === prod.sku);
        if (itemReceived) {
          return {
            ...prod,
            stockPhysical: prod.stockPhysical + itemReceived.quantity,
          };
        }
        return prod;
      })
    );

    alert(`¡Orden ${po.folio} recibida! Se cargaron automáticamente los insumos al inventario.`);
  };

  const handleAddProvider = (provider: Provider) => {
    setProviders((prev) => [provider, ...prev]);
  };

  // Handlers for Surgeries & Logistics
  const handleAddSurgery = (surgery: SurgerySchedule) => {
    setSurgeries((prev) => [surgery, ...prev]);
  };

  const handleUpdateSurgery = (updated: SurgerySchedule) => {
    setSurgeries((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-[#0B1320]">
      {/* Offline Mode Indicator */}
      <OfflineIndicator />

      {/* Cabecera Institucional Unificada */}
      <Header
        unreadAlertsCount={totalAlertsCount}
        onOpenAlerts={() => setShowAlertsModal(true)}
      />

      {/* Main Workspace Canvas: Sidebar in desktop fullscreen + Main Viewport */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar (fullscreen access to all 5 modules) */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          alerts={{
            lowStockCount: lowStockProducts.length,
            expiringLotsCount: expiringLots.length,
            pendingSurgeriesCount: todaySurgeries.length,
            pendingQuotesCount: quotes.filter((q) => q.status === 'enviada').length,
          }}
          onOpenQuickQuote={() => handleOpenNewQuote()}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 min-w-0">
          {/* Módulo 5: Métricas y Balance (Dashboard Principal) */}
          {activeTab === 'metrics' && (
            <ExecutiveDashboard
              products={products}
              clients={clients}
              quotes={quotes}
              receivables={receivables}
              payables={payables}
              surgeries={surgeries}
              onNavigateToTab={(tab) => setActiveTab(tab as ActiveTab)}
            />
          )}

          {/* Módulo 1: Productos e Inventario */}
          {activeTab === 'inventory' && (
            <InventoryModule
              products={products}
              onUpdateProduct={handleUpdateProduct}
              onAddProduct={handleAddProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {/* Módulo 2: Clientes y Cotizaciones Rápidas */}
          {activeTab === 'clients' && (
            <ClientsModule
              clients={clients}
              quotes={quotes}
              products={products}
              receivables={receivables}
              onAddClient={handleAddClient}
              onUpdateClient={handleUpdateClient}
              onOpenNewQuote={handleOpenNewQuote}
              onViewQuote={(q) => setViewingQuote(q)}
              onRecordPayment={handleRecordReceivablePayment}
            />
          )}

          {/* Módulo 3: Proveedores y Compras */}
          {activeTab === 'purchases' && (
            <PurchasesModule
              providers={providers}
              purchaseOrders={purchaseOrders}
              payables={payables}
              products={products}
              onAddPurchaseOrder={handleAddPurchaseOrder}
              onReceivePurchaseOrder={handleReceivePurchaseOrder}
              onAddProvider={handleAddProvider}
            />
          )}

          {/* Módulo 4: Agenda y Envíos */}
          {activeTab === 'surgeries' && (
            <SurgeriesModule
              surgeries={surgeries}
              onAddSurgery={handleAddSurgery}
              onUpdateSurgery={handleUpdateSurgery}
            />
          )}
        </main>
      </div>

      {/* Navegación Móvil y Tablet (Bottom Bar con acceso directo a los 5 módulos) */}
      <BottomBar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        alertsCount={{
          inventory: lowStockProducts.length + expiringLots.length,
          surgeries: todaySurgeries.length,
          clients: 0,
        }}
      />

      {/* Modal Generador Rápido de Cotizaciones */}
      <QuoteGeneratorModal
        isOpen={isQuoteGeneratorOpen}
        onClose={() => {
          setIsQuoteGeneratorOpen(false);
          setPreselectedClientForQuote(null);
        }}
        clients={clients}
        products={products}
        preselectedClient={preselectedClientForQuote}
        onSaveQuote={handleSaveQuote}
      />

      {/* Modal Visualizador Formal de Cotización (Impresión PDF y WhatsApp) */}
      <QuoteViewerModal
        quote={viewingQuote}
        onClose={() => setViewingQuote(null)}
      />

      {/* Modal Alertas Operativas */}
      {showAlertsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-[#0B1320] max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                <h3 className="text-base font-bold text-[#0A2957]">Alertas Activas del Sistema</h3>
              </div>
              <button
                onClick={() => setShowAlertsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-black hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mt-4 space-y-4 text-xs">
              {todaySurgeries.length > 0 && (
                <div>
                  <span className="font-bold text-amber-800 uppercase tracking-wider block mb-1.5">
                    Cirugías Programadas para Hoy ({todaySurgeries.length})
                  </span>
                  <div className="space-y-1.5">
                    {todaySurgeries.map((s) => (
                      <div key={s.id} className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                        <div className="font-bold text-black">{s.procedureName}</div>
                        <div className="text-slate-600 mt-0.5">
                          {s.hospitalName} ({s.operatingRoom}) · {s.surgeonName}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {lowStockProducts.length > 0 && (
                <div>
                  <span className="font-bold text-red-700 uppercase tracking-wider block mb-1.5">
                    Resurtido Urgente / Stock Mínimo ({lowStockProducts.length})
                  </span>
                  <div className="space-y-1.5">
                    {lowStockProducts.map((p) => (
                      <div key={p.id} className="p-2.5 bg-red-50 rounded-xl border border-red-200 flex justify-between items-center">
                        <div>
                          <span className="font-mono font-bold text-[#0A2957]">{p.sku}</span>
                          <span className="font-bold text-black ml-2">{p.name}</span>
                        </div>
                        <div className="font-mono text-red-700 font-bold">
                          {p.stockPhysical} de {p.minStockAlert} mín
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {expiringLots.length > 0 && (
                <div>
                  <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Lotes Estériles por Vencer &lt; 90 Días ({expiringLots.length})
                  </span>
                  <div className="space-y-1.5">
                    {expiringLots.map((l, i) => (
                      <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                        <div>
                          <span className="font-mono font-bold text-black">{l.lotNumber}</span>
                          <span className="text-slate-500 ml-2">({l.productName})</span>
                        </div>
                        <span className="font-mono text-amber-700 font-bold">
                          Caduca: {l.expirationDate}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {totalAlertsCount === 0 && (
                <div className="p-8 text-center text-slate-500">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="font-bold text-slate-700">No hay alertas pendientes</p>
                  <p className="text-slate-500 mt-0.5">El inventario y las cirugías se encuentran al corriente.</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowAlertsModal(false)}
              className="mt-4 w-full py-2 bg-[#0A2957] text-white font-bold rounded-xl text-xs hover:bg-[#071c3c]"
            >
              Cerrar Alertas
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
