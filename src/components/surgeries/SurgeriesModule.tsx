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
  AlertCircle,
  Stethoscope,
  X,
  ExternalLink,
  MapPin,
  Check,
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
  const [filterHospital, setFilterHospital] = useState('all');

  // New Surgery state
  const [newSurgery, setNewSurgery] = useState<Partial<SurgerySchedule>>({
    procedureName: 'Colecistectomía Laparoscópica',
    hospitalName: 'Hospital Ángeles Pedregal',
    operatingRoom: 'Quirófano 4',
    surgeonName: 'Dr. Alejandro Morales Cisneros',
    surgeonPhone: '+52 55 4123 8920',
    dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    deliveryStatus: 'pendiente',
    notes: 'Entregar instrumental estéril directamente a instrumentista 1 hora antes de la cirugía.',
  });

  const [requiredItemsText, setRequiredItemsText] = useState('Pinza Maryland 5mm x 33cm (1)\nTrocares Bladeless 5mm (3)\nTrocar 10mm (1)');

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
        carrier: 'Mensajería Express Xcope',
        trackingNumber: `XCP-RTE-${Math.floor(100 + Math.random() * 900)}`,
        driverName: 'Móvil de Reparto Quirúrgico',
      },
      whatsappReminderSent: false,
      notes: newSurgery.notes || '',
    };

    onAddSurgery(created);
    setShowAddModal(false);
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

    const itemsSummary = surg.requiredItems.map((it) => `• ${it.name}`).join('\n');

    const message = `*RECORDATORIO DE ENTREGA QUIRÚRGICA - XCOPE*\n\n` +
      `Estimado(a) *${surg.surgeonName}*:\n` +
      `Le confirmamos la programación y suministro de material para su cirugía:\n\n` +
      `🏥 *Hospital:* ${surg.hospitalName} (${surg.operatingRoom})\n` +
      `🩺 *Procedimiento:* ${surg.procedureName}\n` +
      `⏰ *Fecha y Hora:* ${dateFormatted}\n\n` +
      `*Kit e Instrumental Programado:*\n${itemsSummary}\n\n` +
      `📦 *Logística:* ${surg.courierInfo?.carrier || 'Mensajería Xcope'} (Guía: ${surg.courierInfo?.trackingNumber || 'En ruta'})\n` +
      `*Estatus:* ${surg.deliveryStatus === 'entregado_en_quirofano' ? '✅ Ya entregado en CEyE' : '🚚 En camino a quirófano'}\n\n` +
      `_Xcope · Soporte Técnico Quirúrgico Scope QX_`;

    const encoded = encodeURIComponent(message);
    const targetUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;

    // Mark reminder as sent
    const updated = { ...surg, whatsappReminderSent: true };
    onUpdateSurgery(updated);

    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleToggleDelivered = (surg: SurgerySchedule) => {
    const nextStatus =
      surg.deliveryStatus === 'pendiente'
        ? 'en_ruta'
        : surg.deliveryStatus === 'en_ruta'
        ? 'entregado_en_quirofano'
        : 'pendiente';

    onUpdateSurgery({
      ...surg,
      deliveryStatus: nextStatus,
    });
  };

  const filteredSurgeries = surgeries.filter((s) => {
    return filterHospital === 'all' || s.hospitalName.toLowerCase().includes(filterHospital.toLowerCase());
  });

  return (
    <div className="space-y-6 pb-20 lg:pb-12">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0A2957] bg-blue-50 px-2 py-0.5 rounded-md">
              Logística y Operaciones Hospitalarias
            </span>
            <span className="text-xs text-slate-500 font-mono">Scope QX Agenda</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0B1320] mt-1">
            Agenda Quirúrgica y Entregas en Quirófano
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Programación de cirugías, renta/suministro de instrumental, paquetería y recordatorios automáticos por WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0A2957] hover:bg-[#071c3c] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-[#FFCC01]" />
            <span>+ Agendar Cirugía / Demo</span>
          </button>
        </div>
      </div>

      {/* Surgeries Timeline / List */}
      <div className="space-y-4">
        {filteredSurgeries.map((surg) => {
          const surgDate = new Date(surg.dateTime);
          const isToday = new Date().toDateString() === surgDate.toDateString();
          const cleanPhone = surg.surgeonPhone.replace(/[^0-9]/g, '');

          return (
            <div
              key={surg.id}
              className={`bg-white rounded-2xl border p-5 shadow-2xs transition-all ${
                isToday
                  ? 'border-amber-400 ring-2 ring-amber-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-blue-50 text-[#0A2957] rounded-xl shrink-0 text-center min-w-[60px]">
                    <span className="text-xs font-bold uppercase block text-[#0A2957]">
                      {surgDate.toLocaleString('es-MX', { month: 'short' })}
                    </span>
                    <span className="text-xl font-bold font-mono text-black leading-none block mt-0.5">
                      {surgDate.getDate()}
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-black">{surg.procedureName}</span>
                      {isToday && (
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                          Hoy en Quirófano
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                      <span className="flex items-center gap-1 font-semibold text-[#0A2957]">
                        <Building className="w-3.5 h-3.5 text-[#0A2957]" />
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
                        <span className="font-medium text-slate-900">{surg.surgeonName}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Toggle Button */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleDelivered(surg)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      surg.deliveryStatus === 'entregado_en_quirofano'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : surg.deliveryStatus === 'en_ruta'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="capitalize">
                      {surg.deliveryStatus === 'entregado_en_quirofano'
                        ? 'Entregado en Quirófano'
                        : surg.deliveryStatus === 'en_ruta'
                        ? 'En Ruta / En Mensajería'
                        : 'Pendiente de Salida'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Items and Logistics row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs">
                {/* Material a entregar */}
                <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="font-bold text-[#0A2957] block">Material e Instrumental a Suministrar:</span>
                  <ul className="space-y-1">
                    {surg.requiredItems.map((it, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0A2957]" />
                        <span>{it.name}</span>
                      </li>
                    ))}
                  </ul>
                  {surg.notes && (
                    <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200 mt-2">
                      Nota: {surg.notes}
                    </p>
                  )}
                </div>

                {/* Paquetería y WhatsApp Reminder */}
                <div className="flex flex-col justify-between space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="font-bold text-[#0A2957] block">Seguimiento Logístico / Paquetería:</span>
                    <div className="flex items-center gap-2 mt-1 text-slate-700">
                      <Truck className="w-4 h-4 text-slate-500" />
                      <span>{surg.courierInfo?.carrier || 'Mensajería Express Xcope'}</span>
                      {surg.courierInfo?.trackingNumber && (
                        <span className="font-mono font-bold text-[#0A2957] bg-white px-2 py-0.5 rounded border border-slate-200">
                          {surg.courierInfo.trackingNumber}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                    <span className="text-[11px] text-slate-500">
                      {surg.whatsappReminderSent ? '✅ Recordatorio enviado' : '⚠️ Sin recordar al doctor'}
                    </span>

                    {/* Botón WhatsApp directo con plantilla prellenada */}
                    <button
                      onClick={() => handleSendWhatsAppReminder(surg)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Recordar por WhatsApp</span>
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
              <h3 className="text-base font-bold text-[#0A2957]">Agendar Cirugía o Demostración</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-black hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSurgery} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Procedimiento Quirúrgico o Tipo de Demo</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Colecistectomía Laparoscópica / Demostración Torre 4K"
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
                  <label className="block font-bold text-slate-700 mb-1">Quirófano / Sala</label>
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
                  <label className="block font-bold text-slate-700 mb-1">Cirujano Responsable</label>
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
                <label className="block font-bold text-slate-700 mb-1">Fecha y Hora Programada</label>
                <input
                  type="datetime-local"
                  required
                  value={newSurgery.dateTime || ''}
                  onChange={(e) => setNewSurgery({ ...newSurgery, dateTime: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Instrumental y Consumibles Requeridos (uno por línea)
                </label>
                <textarea
                  rows={3}
                  required
                  value={requiredItemsText}
                  onChange={(e) => setRequiredItemsText(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  placeholder="Pinza Maryland 5mm x 33cm&#10;Trocares Bladeless 5mm&#10;Malla Marlex 15x15cm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Instrucciones Especiales / CEyE</label>
                <textarea
                  rows={2}
                  value={newSurgery.notes || ''}
                  onChange={(e) => setNewSurgery({ ...newSurgery, notes: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="Entregar a instrumentista 1 hora antes..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
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
                  Programar Cirugía
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
