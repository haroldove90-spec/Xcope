import React, { useState } from 'react';
import { Client, ClientType, Product, Quote, ReceivablePayment } from '../../types';
import {
  Users,
  Search,
  Plus,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  CreditCard,
  History,
  FileText,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Calendar,
  X,
  Stethoscope,
  Building2,
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
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'receivables' | 'quotes'>('directory');
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [paymentModalData, setPaymentModalData] = useState<{ id: string; clientName: string; balance: number } | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  // New Client Form state
  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: '',
    contactPerson: '',
    type: 'cirujano_particular',
    specialty: 'Cirugía General y Laparoscópica',
    phone: '',
    whatsapp: '',
    email: '',
    deliveryAddress: '',
    creditLimit: 50000,
    creditDays: 30,
    balanceDue: 0,
    frequentProducts: [],
  });

  const getClientTypeLabel = (type: ClientType) => {
    switch (type) {
      case 'cirujano_particular':
        return 'Cirujano Particular';
      case 'hospital_clinica':
        return 'Hospital / Clínica';
      case 'clinica_corta_estancia':
        return 'Clínica Corta Estancia';
      case 'subdistribuidor':
        return 'Subdistribuidor Mayorista';
      default:
        return 'Cliente';
    }
  };

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.specialty && c.specialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.preferredHospital && c.preferredHospital.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === 'all' || c.type === selectedType;
    return matchesSearch && matchesType;
  });

  const totalReceivables = receivables.reduce((sum, r) => sum + r.balance, 0);
  const overdueReceivables = receivables
    .filter((r) => r.status === 'vencido' || new Date(r.dueDate) < new Date())
    .reduce((sum, r) => sum + r.balance, 0);

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name) return;

    const created: Client = {
      id: 'cli-' + Date.now(),
      name: newClient.name,
      contactPerson: newClient.contactPerson || newClient.name,
      type: (newClient.type as ClientType) || 'cirujano_particular',
      specialty: newClient.specialty || 'Cirugía General',
      phone: newClient.phone || '',
      whatsapp: (newClient.whatsapp || newClient.phone || '').replace(/[^0-9]/g, ''),
      email: newClient.email || '',
      deliveryAddress: newClient.deliveryAddress || 'Área de Quirófano / Almacén',
      preferredHospital: newClient.preferredHospital || 'Hospital CDMX',
      creditLimit: Number(newClient.creditLimit) || 50000,
      creditDays: Number(newClient.creditDays) || 30,
      balanceDue: 0,
      frequentProducts: ['LMX-GRASP-533'],
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
    <div className="space-y-6 pb-20 lg:pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0A2957] bg-blue-50 px-2 py-0.5 rounded-md">
              Gestión Comercial y Médica
            </span>
            <span className="text-xs text-slate-500 font-mono">Scope QX CRM</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0B1320] mt-1">
            Directorio Quirúrgico, Cotizaciones y Cartera
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Registro clínico-comercial de cirujanos, clínicas, créditos autorizados y presupuestos con membrete.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenNewQuote()}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#FFCC01] text-[#0A2957] hover:bg-[#ebd500] text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            <FileText className="w-4 h-4 text-[#0A2957]" />
            <span>+ Nueva Cotización</span>
          </button>

          <button
            onClick={() => setShowAddClientModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0A2957] hover:bg-[#071c3c] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-[#FFCC01]" />
            <span>Nuevo Médico / Clínica</span>
          </button>
        </div>
      </div>

      {/* Metrics Mini-strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block">Total Clientes Médicos</span>
          <div className="text-2xl font-bold font-mono text-black mt-1">{clients.length}</div>
          <span className="text-[11px] text-slate-500">Cirujanos y Hospitales activos</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block">Cuentas por Cobrar (Saldos)</span>
          <div className="text-2xl font-bold font-mono text-[#0A2957] mt-1 tabular-nums">
            ${totalReceivables.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-500">Créditos a médicos y hospitales</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block">Cartera Vencida</span>
          <div className="text-2xl font-bold font-mono text-red-600 mt-1 tabular-nums">
            ${overdueReceivables.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-red-600 font-semibold">Requiere seguimiento inmediato</span>
        </div>
      </div>

      {/* Segmented SubTabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSubTab('directory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'directory'
              ? 'bg-[#0A2957] text-[#FFCC01] shadow-2xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Directorio Médico ({clients.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('quotes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'quotes'
              ? 'bg-[#0A2957] text-[#FFCC01] shadow-2xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Cotizaciones Emitidas ({quotes.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('receivables')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'receivables'
              ? 'bg-[#0A2957] text-[#FFCC01] shadow-2xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Cuentas por Cobrar ({receivables.length})</span>
        </button>
      </div>

      {/* Subtab 1: Medical Directory */}
      {activeSubTab === 'directory' && (
        <div className="space-y-4">
          {/* Search bar & Type filter */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por médico, hospital, especialidad o contacto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden text-[#0B1320]"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'cirujano_particular', label: 'Cirujanos' },
                { id: 'hospital_clinica', label: 'Hospitales' },
                { id: 'subdistribuidor', label: 'Distribuidores' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                    selectedType === t.id
                      ? 'bg-[#0A2957] text-[#FFCC01]'
                      : 'bg-slate-100 text-slate-600 hover:text-black'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Client Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClients.map((client) => {
              const clientQuotes = quotes.filter((q) => q.clientId === client.id);
              const cleanWhatsApp = client.whatsapp.replace(/[^0-9]/g, '');

              return (
                <div
                  key={client.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-[#0A2957]">
                          {getClientTypeLabel(client.type)}
                        </span>
                        <h3 className="text-base font-bold text-[#0B1320] mt-1.5">
                          {client.name}
                        </h3>
                        {client.specialty && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5">
                            <Stethoscope className="w-3.5 h-3.5 text-[#0A2957]" />
                            <span>{client.specialty}</span>
                          </div>
                        )}
                      </div>

                      {client.balanceDue > 0 ? (
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block">Saldo por Cobrar:</span>
                          <span className="text-sm font-bold font-mono text-red-600 tabular-nums">
                            ${client.balanceDue.toLocaleString('es-MX')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          Al corriente
                        </span>
                      )}
                    </div>

                    {/* Delivery & Contact info */}
                    <div className="mt-3 space-y-2 text-xs text-slate-600">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{client.deliveryAddress}</span>
                      </div>

                      <div className="flex items-center gap-4 text-slate-700 pt-1">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          <span>{client.phone}</span>
                        </span>
                        {client.email && (
                          <span className="flex items-center gap-1 truncate">
                            <Mail className="w-3.5 h-3.5 text-slate-500" />
                            <span className="truncate">{client.email}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Historial clínico-comercial */}
                    {client.frequentProducts && client.frequentProducts.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <span className="text-[11px] font-bold text-slate-500 block mb-1">
                          Insumos frecuentes adquiridos:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {client.frequentProducts.map((sku, i) => (
                            <span key={i} className="text-[10px] font-mono font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                              {sku}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {/* Direct WhatsApp Button */}
                    <a
                      href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                        `Hola ${client.name}, le saluda el equipo quirúrgico de Xcope (Scope QX / Laparoscopic MX). ¿En qué podemos apoyarle con su instrumental y consumibles médicos?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>WhatsApp Directo</span>
                    </a>

                    {/* Quick Quote to this Client */}
                    <button
                      onClick={() => onOpenNewQuote(client)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0A2957] hover:bg-[#071c3c] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#FFCC01]" />
                      <span>Cotizar</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtab 2: Quotes List */}
      {activeSubTab === 'quotes' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Cotizaciones Formales Scope QX</span>
            <button
              onClick={() => onOpenNewQuote()}
              className="text-xs font-bold text-[#0A2957] hover:underline"
            >
              + Nueva Cotización
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {quotes.map((q) => (
              <div key={q.id} className="p-4 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#0A2957] bg-slate-100 px-2 py-0.5 rounded">
                      {q.folio}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="font-semibold text-black">{q.clientName}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 font-mono">Emitida: {q.createdAt}</span>
                  </div>
                  <p className="text-slate-600 mt-1 line-clamp-1">{q.clientAddress}</p>
                  <div className="flex items-center gap-2 mt-1 text-slate-500">
                    <span>{q.items.length} partidas quirúrgicas</span>
                    <span>·</span>
                    <span>Vigente hasta: {q.validUntil}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-bold font-mono text-black tabular-nums">
                      ${q.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                    </div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700">
                      {q.status}
                    </span>
                  </div>

                  <button
                    onClick={() => onViewQuote(q)}
                    className="px-3 py-1.5 bg-[#0A2957] text-[#FFCC01] hover:bg-[#071c3c] font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Ver / Enviar PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 3: Cuentas por Cobrar (Créditos a médicos/hospitales) */}
      {activeSubTab === 'receivables' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Libro de Cobranza y Créditos Quirúrgicos</span>
            <span className="text-xs text-slate-500">Términos de 15, 30 y 45 días</span>
          </div>

          <div className="divide-y divide-slate-100">
            {receivables.map((rec) => {
              const isOverdue = rec.status === 'vencido' || new Date(rec.dueDate) < new Date();

              return (
                <div key={rec.id} className="p-4 hover:bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-black text-sm">{rec.clientName}</span>
                      {isOverdue && (
                        <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                          Vencido
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 mt-0.5 font-medium">{rec.concept}</p>
                    <div className="flex items-center gap-3 text-slate-500 mt-1">
                      <span>Vencimiento: <strong className="font-mono text-black">{rec.dueDate}</strong></span>
                      {rec.notes && <span>· {rec.notes}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">Saldo Pendiente:</span>
                      <div className="text-sm sm:text-base font-bold font-mono text-red-600 tabular-nums">
                        ${rec.balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </div>
                      <span className="text-[10px] text-slate-500">
                        Total Facturado: ${rec.totalAmount.toLocaleString('es-MX')}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setPaymentModalData({ id: rec.id, clientName: rec.clientName, balance: rec.balance });
                        setPaymentAmount(rec.balance);
                      }}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Registrar Abono
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Registrar Abono / Pago */}
      {paymentModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-[#0B1320]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#0A2957]">Registrar Cobro / Abono</h3>
              <button
                onClick={() => setPaymentModalData(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-black hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmPayment} className="mt-4 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block">Cliente:</span>
                <span className="font-bold text-black block">{paymentModalData.clientName}</span>
                <span className="text-slate-600 block mt-1">
                  Saldo pendiente actual: <strong className="font-mono text-red-600">${paymentModalData.balance.toLocaleString('es-MX')} MXN</strong>
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Monto del Abono / Pago ($ MXN)</label>
                <input
                  type="number"
                  step="0.01"
                  max={paymentModalData.balance}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-base font-bold"
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
                  Confirmar Cobro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Agregar Nuevo Cliente Médico */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-[#0B1320] my-8 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#0A2957]">Registrar Médico / Clínica</h3>
              <button
                onClick={() => setShowAddClientModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-black hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre Completo del Doctor / Institución</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Dr. Juan Manuel Cárdenas / Clínica Santa Mónica"
                  value={newClient.name || ''}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Cliente</label>
                  <select
                    value={newClient.type || 'cirujano_particular'}
                    onChange={(e) => setNewClient({ ...newClient, type: e.target.value as ClientType })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="cirujano_particular">Cirujano Particular</option>
                    <option value="hospital_clinica">Hospital / Clínica</option>
                    <option value="clinica_corta_estancia">Clínica de Corta Estancia</option>
                    <option value="subdistribuidor">Subdistribuidor</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Especialidad Médica</label>
                  <input
                    type="text"
                    placeholder="ej. Cirugía Bariátrica, Ginecología..."
                    value={newClient.specialty || ''}
                    onChange={(e) => setNewClient({ ...newClient, specialty: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teléfono Móvil / WhatsApp</label>
                  <input
                    type="text"
                    required
                    placeholder="+52 55 1234 5678"
                    value={newClient.phone || ''}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value, whatsapp: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    placeholder="doctor@hospital.com"
                    value={newClient.email || ''}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dirección de Entrega / Quirófano CEyE</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Hospital Ángeles, Quirófano 4, Torre Quirúrgica piso 2..."
                  value={newClient.deliveryAddress || ''}
                  onChange={(e) => setNewClient({ ...newClient, deliveryAddress: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Límite de Crédito ($ MXN)</label>
                  <input
                    type="number"
                    value={newClient.creditLimit || 50000}
                    onChange={(e) => setNewClient({ ...newClient, creditLimit: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Días de Crédito Autorizados</label>
                  <select
                    value={newClient.creditDays || 30}
                    onChange={(e) => setNewClient({ ...newClient, creditDays: parseInt(e.target.value) || 30 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value={15}>15 días</option>
                    <option value={30}>30 días</option>
                    <option value={45}>45 días</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
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
                  Guardar Médico
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
