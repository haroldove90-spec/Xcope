import React, { useState } from 'react';
import { SurgerySchedule } from '../../types';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Truck,
  MessageCircle,
  Building,
  CheckCircle2,
  Stethoscope,
  X,
  CheckSquare,
  Square,
  Package,
} from 'lucide-react';

interface SurgeriesModuleProps {
  surgeries: SurgerySchedule[];
  onAddSurgery: (surgery: SurgerySchedule) => void;
  onUpdateSurgery: (surgery: SurgerySchedule) => void;
}

export const SurgeriesModule: React.FC<SurgeriesModuleProps> = ({
  surgeries,
  onAddSurgery,
  onUpdateSurgery,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [calendarView, setCalendarView] = useState<'lista' | 'semanal' | 'mensual'>('lista');

  // New Surgery Form State
  const [newSurgery, setNewSurgery] = useState<Partial<SurgerySchedule>>({
    procedureName: 'Colecistectomía Laparoscópica',
    hospitalName: 'Hospital Ángeles Pedregal',
    operatingRoom: 'Quirófano 4',
    surgeonName: 'Dr. Alejandro Morales Cisneros',
    surgeonPhone: '+52 55 4123 8920',
    dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    deliveryStatus: 'pendiente',
    notes: 'Entregar instrumental estéril directamente a instrumentista 1 hora antes.',
  });

  const [requiredItemsText, setRequiredItemsText] = useState(
    'Pinza Maryland 5mm x 33cm\nTrocares Bladeless 5mm (3 piezas)\nTrocar Óptico 10mm\nMalla Marlex 15x15cm'
  );

  const [carrierType, setCarrierType] = useState('Mensajería Express Xcope');
  const [trackingGuia, setTrackingGuia] = useState('');

  const handleCreateSurgery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSurgery.procedureName || !newSurgery.hospitalName) return;

    const parsedItems = requiredItemsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => ({
        name: line,
        quantity: 1,
        delivered: false,
      }));

    const created: SurgerySchedule = {
      id: 'surg-' + Date.now(),
      procedureName: newSurgery.procedureName || 'Procedimiento Laparoscópico',
      hospitalName: newSurgery.hospitalName || 'Hospital General',
      operatingRoom: newSurgery.operatingRoom || 'Quirófano Principal',
      surgeonName: newSurgery.surgeonName || 'Cirujano a cargo',
      surgeonPhone: newSurgery.surgeonPhone || '',
      dateTime: newSurgery.dateTime || new Date().toISOString(),
      requiredItems: parsedItems.length > 0 ? parsedItems : [{ name: 'Kit Laparoscopía Integral', quantity: 1, delivered: false }],
      deliveryStatus: 'pendiente',
      courierInfo: {
        carrier: carrierType,
        trackingNumber: trackingGuia || `XCP-RTE-${Math.floor(100 + Math.random() * 900)}`,
        driverName: 'Móvil Quirúrgico Directo',
      },
      whatsappReminderSent: false,
      notes: newSurgery.notes || '',
    };

    onAddSurgery(created);
    setShowAddModal(false);
  };

  // Toggle item in Checklist de despacho
  const handleToggleChecklistItem = (surg: SurgerySchedule, itemIdx: number) => {
    const updatedItems = [...surg.requiredItems];
    updatedItems[itemIdx] = {
      ...updatedItems[itemIdx],
      delivered: !updatedItems[itemIdx].delivered,
    };

    const allPacked = updatedItems.every((it) => it.delivered);
    const updatedSurgery = {
      ...surg,
      requiredItems: updatedItems,
      deliveryStatus: allPacked ? ('en_ruta' as const) : surg.deliveryStatus,
    };

    onUpdateSurgery(updatedSurgery);
  };

  const handleSendWhatsAppReminder = (surg: SurgerySchedule) => {
    const cleanPhone = surg.surgeonPhone.replace(/[^0-9]/g, '');
    const dateFormatted = new Date(surg.dateTime).toLocaleString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });

    const itemsSummary = surg.requiredItems.map((it) => `• ${it.name} ${it.delivered ? '(Empacado ✅)' : ''}`).join('\n');

    const message = `*RECORDATORIO DE MATERIAL QUIRÚRGICO - XCOPE*\n\n` +
      `Estimado(a) *${surg.surgeonName}*:\n` +
      `Le confirmamos la entrega programada para su procedimiento:\n\n` +
      `🏥 *Hospital:* ${surg.hospitalName} (${surg.operatingRoom})\n` +
      `🩺 *Cirugía:* ${surg.procedureName}\n` +
      `⏰ *Fecha y Hora:* ${dateFormatted}\n\n` +
      `*Checklist de Instrumental Asignado:*\n${itemsSummary}\n\n` +
      `📦 *Paquetería/Ruta:* ${surg.courierInfo?.carrier || 'Mensajería Xcope'} (Guía: ${surg.courierInfo?.trackingNumber || 'En ruta'})\n` +
      `*Estatus:* ${surg.deliveryStatus === 'entregado_en_quirofano' ? '✅ Ya entregado en CEyE' : '🚚 En camino'}\n\n` +
      `_Xcope · Soporte Técnico Quirúrgico Scope QX_`;

    const encoded = encodeURIComponent(message);
    const targetUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;

    onUpdateSurgery({ ...surg, whatsappReminderSent: true });
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-12">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A2957] bg-blue-50 px-2 py-0.5 rounded-md">
              Módulo 4
            </span>
            <span className="text-xs text-slate-500 font-mono">Scope QX Logística</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-[#0B1320] mt-1">
            Agenda y Envíos Quirúrgicos
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Calendario de cirugías, vinculación con médicos, rastreo de paquetería y checklist de despacho.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-[#0A2957] hover:bg-[#071c3c] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 text-[#FFCC01]" />
          <span>Agendar Cirugía / Entrega</span>
        </button>
      </div>

      {/* Calendar View Selector */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <span className="text-xs font-bold text-slate-700">Vista del Calendario Operativo:</span>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
          <button
            onClick={() => setCalendarView('lista')}
            className={`flex-1 sm:flex-none text-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              calendarView === 'lista'
                ? 'bg-[#0A2957] text-[#FFCC01] shadow-2xs'
                : 'text-slate-600 hover:text-black'
            }`}
          >
            Lista de Compromisos
          </button>
          <button
            onClick={() => setCalendarView('semanal')}
            className={`flex-1 sm:flex-none text-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              calendarView === 'semanal'
                ? 'bg-[#0A2957] text-[#FFCC01] shadow-2xs'
                : 'text-slate-600 hover:text-black'
            }`}
          >
            Semanal
          </button>
          <button
            onClick={() => setCalendarView('mensual')}
            className={`flex-1 sm:flex-none text-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              calendarView === 'mensual'
                ? 'bg-[#0A2957] text-[#FFCC01] shadow-2xs'
                : 'text-slate-600 hover:text-black'
            }`}
          >
            Mensual
          </button>
        </div>
      </div>

      {/* Calendar List / Schedule */}
      <div className="space-y-4">
        {surgeries.map((surg) => {
          const surgDate = new Date(surg.dateTime);
          const isToday = new Date().toDateString() === surgDate.toDateString();
          const packedCount = surg.requiredItems.filter((i) => i.delivered).length;
          const totalItems = surg.requiredItems.length;

          return (
            <div
              key={surg.id}
              className={`bg-white rounded-2xl border p-5 shadow-2xs space-y-4 transition-all ${
                isToday ? 'border-amber-400 ring-2 ring-amber-100' : 'border-slate-200'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-blue-50 text-[#0A2957] rounded-xl text-center min-w-[65px] shrink-0">
                    <span className="text-[11px] font-bold uppercase block text-[#0A2957]">
                      {surgDate.toLocaleString('es-MX', { month: 'short' })}
                    </span>
                    <span className="text-xl font-bold font-mono text-black leading-none block mt-0.5">
                      {surgDate.getDate()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-black">{surg.procedureName}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                      <span className="flex items-center gap-1 font-semibold text-[#0A2957]">
                        <Building className="w-3.5 h-3.5" />
                        <span>{surg.hospitalName} ({surg.operatingRoom})</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{surgDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} hrs</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-800">{surg.surgeonName}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${
                      surg.deliveryStatus === 'entregado_en_quirofano'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : surg.deliveryStatus === 'en_ruta'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {surg.deliveryStatus === 'entregado_en_quirofano'
                      ? 'Entregado en CEyE'
                      : surg.deliveryStatus === 'en_ruta'
                      ? 'En Ruta / Paquetería'
                      : 'Pendiente de Salida'}
                  </span>
                </div>
              </div>

              {/* Grid: Checklist de Despacho + Paquetería y Rastreo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Checklist de Despacho (Verificación de material empacado) */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0A2957] uppercase tracking-wider flex items-center gap-1.5">
                      <Package className="w-4 h-4" /> Checklist de Despacho Quirúrgico
                    </span>
                    <span className="font-mono text-[11px] font-bold text-slate-700">
                      {packedCount}/{totalItems} empacados
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Marca cada insumo cuando esté verificado y empacado en la caja térmica o de instrumental:
                  </p>

                  <div className="space-y-1.5 pt-1">
                    {surg.requiredItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleToggleChecklistItem(surg, idx)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer border ${
                          item.delivered
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {item.delivered ? (
                            <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span>{item.name}</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-slate-500">
                          {item.delivered ? 'Empacado' : 'Pendiente'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rastreo de Envíos y Recordatorio WhatsApp */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <span className="font-bold text-[#0A2957] uppercase tracking-wider block flex items-center gap-1.5">
                      <Truck className="w-4 h-4" /> Rastreo de Envíos y Paquetería
                    </span>
                    <div className="space-y-1 text-slate-700">
                      <p>Paquetería asignada: <strong className="text-black">{surg.courierInfo?.carrier || 'DHL Express'}</strong></p>
                      <p>
                        Número de Guía: <strong className="font-mono text-[#0A2957] bg-white px-2 py-0.5 rounded border border-slate-200">{surg.courierInfo?.trackingNumber}</strong>
                      </p>
                      {surg.notes && <p className="italic text-slate-500 pt-1">Indicaciones: {surg.notes}</p>}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      {surg.whatsappReminderSent ? '✅ Notificación enviada' : 'Aviso pendiente'}
                    </span>
                    <button
                      onClick={() => handleSendWhatsAppReminder(surg)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Notificar por WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Agendar Cirugía */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-[#0B1320] my-8 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#0A2957]">Agendar Cirugía o Envío Quirúrgico</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSurgery} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Procedimiento Quirúrgico</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Colecistectomía Laparoscópica"
                  value={newSurgery.procedureName || ''}
                  onChange={(e) => setNewSurgery({ ...newSurgery, procedureName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hospital / Clínica</label>
                  <input
                    type="text"
                    required
                    placeholder="Hospital Ángeles Pedregal"
                    value={newSurgery.hospitalName || ''}
                    onChange={(e) => setNewSurgery({ ...newSurgery, hospitalName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quirófano</label>
                  <input
                    type="text"
                    placeholder="Quirófano 4"
                    value={newSurgery.operatingRoom || ''}
                    onChange={(e) => setNewSurgery({ ...newSurgery, operatingRoom: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Médico Cirujano</label>
                  <input
                    type="text"
                    required
                    placeholder="Dr. Alejandro Morales"
                    value={newSurgery.surgeonName || ''}
                    onChange={(e) => setNewSurgery({ ...newSurgery, surgeonName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp del Médico</label>
                  <input
                    type="text"
                    placeholder="+52 55 4123 8920"
                    value={newSurgery.surgeonPhone || ''}
                    onChange={(e) => setNewSurgery({ ...newSurgery, surgeonPhone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Fecha y Hora de la Cirugía</label>
                <input
                  type="datetime-local"
                  required
                  value={newSurgery.dateTime || ''}
                  onChange={(e) => setNewSurgery({ ...newSurgery, dateTime: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Paquetería o Logística</label>
                  <select
                    value={carrierType}
                    onChange={(e) => setCarrierType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="Mensajería Express Xcope">Mensajería Express Xcope</option>
                    <option value="DHL Express">DHL Express</option>
                    <option value="FedEx México">FedEx México</option>
                    <option value="Estafeta Quirúrgica">Estafeta</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Número de Guía</label>
                  <input
                    type="text"
                    placeholder="ej. DHL-890123"
                    value={trackingGuia}
                    onChange={(e) => setTrackingGuia(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Insumos a Despachar (un insumo por línea para el checklist)
                </label>
                <textarea
                  rows={3}
                  required
                  value={requiredItemsText}
                  onChange={(e) => setRequiredItemsText(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#0A2957] hover:bg-[#071c3c] rounded-xl shadow-xs"
                >
                  Confirmar Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
