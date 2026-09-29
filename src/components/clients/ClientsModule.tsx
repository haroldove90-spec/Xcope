import React, { useState } from 'react';
import { Client, Product, Quote, ReceivablePayment } from '../../types';
import {
  Users,
  Search,
  Plus,
  Phone,
  MessageCircle,
  MapPin,
  CreditCard,
  History,
  FileText,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  Building,
  X,
  ExternalLink,
} from 'lucide-react';

interface ClientsModuleProps {
  clients: Client[];
  quotes: Quote[];
  products: Product[];
  receivables: ReceivablePayment[];
  onAddClient: (client: Client) => void;
  onUpdateClient: (client: Client) => void;
  onOpenNewQuote: (client?: Client) => void;
  onViewQuote: (quote: Quote) => void;
  onRecordPayment: (receivableId: string, amount: number) => void;
}

export const ClientsModule: React.FC<ClientsModuleProps> = ({
  clients,
  quotes,
  products,
  receivables,
  onAddClient,
  onUpdateClient,
  onOpenNewQuote,
  onViewQuote,
  onRecordPayment,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [clientHistoryTarget, setClientHistoryTarget] = useState<Client | null>(null);

  // Quick Payment Modal
  const [paymentModalData, setPaymentModalData] = useState<{ id: string; clientName: string; balance: number } | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  // New Client Form
  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: '',
    specialty: 'Cirugía Laparoscópica',
    preferredHospital: 'Hospital Ángeles Pedregal',
    phone: '',
    deliveryAddress: '',
    creditLimit: 50000,
    creditDays: 30,
  });

  const filteredClients = clients.filter((c) => {
    return (
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.specialty && c.specialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.preferredHospital && c.preferredHospital.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.phone.includes(searchTerm)
    );
  });

  const totalOwedByClients = receivables.reduce((sum, r) => sum + r.balance, 0);

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name) return;

    const created: Client = {
      id: 'cli-' + Date.now(),
      name: newClient.name,
      contactPerson: newClient.name,
      type: 'cirujano_particular',
      specialty: newClient.specialty || 'Cirugía General',
      phone: newClient.phone || '',
      whatsapp: (newClient.phone || '').replace(/[^0-9]/g, ''),
      email: '',
      deliveryAddress: newClient.deliveryAddress || 'Recepción en Quirófano',
      preferredHospital: newClient.preferredHospital || 'Hospital Ángeles Pedregal',
      creditLimit: Number(newClient.creditLimit) || 50000,
      creditDays: Number(newClient.creditDays) || 30,
      balanceDue: 0,
      frequentProducts: ['LMX-GRASP-533', 'ETH-BLT-1005'],
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddClient(created);
    setShowAddClientModal(false);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalData || paymentAmount <= 0) return;
    onRecordPayment(paymentModalData.id, paymentAmount);
    setPaymentModalData(null);
    setPaymentAmount(0);
  };

  return (
    <div className="space-y-5 pb-20 lg:pb-12">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0A2957] bg-blue-50 px-2 py-0.5 rounded-md">
              Módulo 2
            </span>
            <span className="text-xs text-slate-500 font-mono">Scope QX Ventas</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0B1320] mt-1">
            Clientes y Cotizaciones Rápidas
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Libreta de contactos médicos, WhatsApp directo, generador de cotizaciones PDF y cobranza.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenNewQuote()}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#FFCC01] text-[#0A2957] hover:bg-[#ebd500] text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            <FileText className="w-4 h-4 text-[#0A2957]" />
            <span>+ Cotizar en PDF</span>
          </button>

          <button
            onClick={() => setShowAddClientModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0A2957] hover:bg-[#071c3c] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-[#FFCC01]" />
            <span>+ Nuevo Cirujano</span>
          </button>
        </div>
      </div>

      {/* Debt Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block">Total en Cobranza Pendiente</span>
            <div className="text-2xl font-bold font-mono text-red-600 mt-1 tabular-nums">
              ${totalOwedByClients.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
            </div>
          </div>
          <div className="p-3 bg-red-50 text-red-700 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block">Cotizaciones Emitidas</span>
            <div className="text-2xl font-bold font-mono text-[#0A2957] mt-1">
              {quotes.length} documentos
            </div>
          </div>
          <div className="p-3 bg-blue-50 text-[#0A2957] rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar cirujano, especialidad, hospital de entrega o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden text-[#0B1320]"
          />
        </div>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClients.map((client) => {
          const cleanPhone = client.phone.replace(/[^0-9]/g, '');
          const clientReceivable = receivables.find((r) => r.clientId === client.id && r.balance > 0);
          const clientQuotes = quotes.filter((q) => q.clientId === client.id);

          return (
            <div
              key={client.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-black">{client.name}</h3>
                    {client.specialty && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5">
                        <Stethoscope className="w-3.5 h-3.5 text-[#0A2957]" />
                        <span>{client.specialty}</span>
                      </div>
                    )}
                    {client.preferredHospital && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{client.preferredHospital}</span>
                      </div>
                    )}
                  </div>

                  {client.balanceDue > 0 ? (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Saldo Pendiente:</span>
                      <span className="text-sm font-bold font-mono text-red-600 tabular-nums">
                        ${client.balanceDue.toLocaleString('es-MX')}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Sin deuda
                    </span>
                  )}
                </div>

                {/* Delivery and Phone */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{client.deliveryAddress}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-slate-800 pt-0.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{client.phone}</span>
                  </div>
                </div>

                {/* Historial rápido de compras */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    {clientQuotes.length} cotizaciones generadas
                  </span>
                  <button
                    onClick={() => setClientHistoryTarget(client)}
                    className="text-[#0A2957] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>Ver Historial de Compras</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons: WhatsApp Directo + Generador de Cotizaciones PDF */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Estimado(a) ${client.name}, le saluda el equipo quirúrgico de Xcope (Scope QX / Laparoscopic MX). ¿En qué podemos apoyarle hoy con su instrumental o cirugía programada?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Directo</span>
                </a>

                <div className="flex items-center gap-2">
                  {clientReceivable && (
                    <button
                      onClick={() => {
                        setPaymentModalData({
                          id: clientReceivable.id,
                          clientName: client.name,
                          balance: clientReceivable.balance,
                        });
                        setPaymentAmount(clientReceivable.balance);
                      }}
                      className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Abono
                    </button>
                  )}

                  <button
                    onClick={() => onOpenNewQuote(client)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0A2957] hover:bg-[#071c3c] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-[#FFCC01]" />
                    <span>Cotizar PDF</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Historial de Compras Modal */}
      {clientHistoryTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-[#0B1320] max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-[#0A2957]">Historial de Compras y Cotizaciones</h3>
                <p className="text-xs text-slate-600 font-semibold">{clientHistoryTarget.name}</p>
              </div>
              <button
                onClick={() => setClientHistoryTarget(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mt-4 space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-700 block mb-1">Insumos Comprados Habitualmente:</span>
                <div className="flex flex-wrap gap-1.5">
                  {clientHistoryTarget.frequentProducts.map((sku, i) => {
                    const prod = products.find((p) => p.sku === sku);
                    return (
                      <span key={i} className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-800 font-mono font-bold">
                        {sku} {prod ? `· ${prod.name}` : ''}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <span className="font-bold text-slate-700 block mb-1">Presupuestos Emitidos a este Médico:</span>
                {quotes.filter((q) => q.clientId === clientHistoryTarget.id).length === 0 ? (
                  <p className="text-slate-400 italic">No hay cotizaciones registradas para este doctor.</p>
                ) : (
                  <div className="space-y-2">
                    {quotes
                      .filter((q) => q.clientId === clientHistoryTarget.id)
                      .map((q) => (
                        <div key={q.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                          <div>
                            <span className="font-mono font-bold text-[#0A2957]">{q.folio}</span>
                            <span className="text-slate-500 ml-2">({q.createdAt})</span>
                            <div className="text-[11px] text-slate-600 mt-0.5">{q.items.length} partidas</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-black">${q.total.toLocaleString('es-MX')}</span>
                            <button
                              onClick={() => {
                                onViewQuote(q);
                                setClientHistoryTarget(null);
                              }}
                              className="px-2 py-1 bg-[#0A2957] text-[#FFCC01] font-bold rounded-lg text-[10px]"
                            >
                              Ver PDF
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setClientHistoryTarget(null)}
              className="mt-4 w-full py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200"
            >
              Cerrar Historial
            </button>
          </div>
        </div>
      )}

      {/* Modal Registrar Abono */}
      {paymentModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-[#0B1320]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#0A2957]">Registrar Cobro / Abono</h3>
              <button
                onClick={() => setPaymentModalData(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmPayment} className="mt-4 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block">Médico / Hospital:</span>
                <span className="font-bold text-black block">{paymentModalData.clientName}</span>
                <span className="text-slate-600 block mt-1">
                  Saldo pendiente: <strong className="font-mono text-red-600">${paymentModalData.balance.toLocaleString('es-MX')} MXN</strong>
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Monto del Pago Recibido ($ MXN)</label>
                <input
                  type="number"
                  step="0.01"
                  max={paymentModalData.balance}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-base font-bold text-center"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalData(null)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
                >
                  Registrar Cobro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Registrar Nuevo Médico */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-[#0B1320] my-8 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#0A2957]">Alta de Médico o Clínica</h3>
              <button
                onClick={() => setShowAddClientModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre Completo del Cirujano</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Dr. Eduardo Salcedo"
                  value={newClient.name || ''}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Especialidad</label>
                  <input
                    type="text"
                    placeholder="Cirugía Bariátrica / Ginecolaparoscopía"
                    value={newClient.specialty || ''}
                    onChange={(e) => setNewClient({ ...newClient, specialty: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hospital / Clínica Habitual</label>
                  <input
                    type="text"
                    placeholder="Hospital Ángeles Pedregal"
                    value={newClient.preferredHospital || ''}
                    onChange={(e) => setNewClient({ ...newClient, preferredHospital: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Teléfono Móvil / WhatsApp (sin guiones)</label>
                <input
                  type="text"
                  required
                  placeholder="+52 55 1234 5678"
                  value={newClient.phone || ''}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dirección de Entrega / Quirófano CEyE</label>
                <textarea
                  rows={2}
                  placeholder="Hospital Ángeles Pedregal, Quirófano 4, Torre de Especialidades..."
                  value={newClient.deliveryAddress || ''}
                  onChange={(e) => setNewClient({ ...newClient, deliveryAddress: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddClientModal(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#0A2957] hover:bg-[#071c3c] rounded-xl shadow-xs"
                >
                  Guardar Contacto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
