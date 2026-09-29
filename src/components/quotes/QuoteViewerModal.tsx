import React from 'react';
import { Quote } from '../../types';
import { Printer, MessageCircle, X, Check, Copy } from 'lucide-react';

interface QuoteViewerModalProps {
  quote: Quote | null;
  onClose: () => void;
}

export const QuoteViewerModal: React.FC<QuoteViewerModalProps> = ({ quote, onClose }) => {
  if (!quote) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppSend = () => {
    const cleanPhone = quote.clientPhone.replace(/[^0-9]/g, '');
    
    // Construct formal WhatsApp quotation text
    const message = `*COTIZACIÓN FORMAL DE INSTRUMENTAL QUIRÚRGICO*\n` +
      `*Folio:* ${quote.folio}\n` +
      `*Fecha:* ${quote.createdAt} (Vigencia hasta: ${quote.validUntil})\n` +
      `*Cliente:* ${quote.clientName}\n` +
      `*Hospital/Destino:* ${quote.clientAddress}\n\n` +
      `*DETALLE DE PARTIDAS:*\n` +
      quote.items
        .map(
          (it, i) =>
            `${i + 1}. *[${it.sku}]* ${it.productName}\n` +
            `   - Cantidad: ${it.quantity} piezas | Precio Unitario: $${it.unitPrice.toLocaleString('es-MX')} MXN\n` +
            `   - Total: $${it.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`
        )
        .join('\n\n') +
      `\n\n----------------------------\n` +
      `*Subtotal:* $${quote.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN\n` +
      (quote.discountTotal > 0 ? `*Descuento:* -$${quote.discountTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN\n` : '') +
      `*IVA (16%):* $${quote.taxIva.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN\n` +
      `*TOTAL NETO:* $${quote.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN\n\n` +
      `*Condiciones Quirúrgicas:* ${quote.surgicalNotes}\n` +
      `*Garantía y Entrega:* ${quote.deliveryTerms}\n\n` +
      `_Emitido por Xcope (Scope QX / Laparoscopic MX)_`;

    const encoded = encodeURIComponent(message);
    const targetUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyText = () => {
    const text = `Cotización ${quote.folio} - Total: $${quote.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN para ${quote.clientName}`;
    navigator.clipboard.writeText(text);
    alert('Resumen de cotización copiado al portapapeles.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-slate-200 text-[#0B1320] my-4 sm:my-8 animate-in fade-in duration-150 flex flex-col max-h-[92vh]">
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print p-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#0A2957] bg-white border border-slate-200 px-2 py-1 rounded-md">
              {quote.folio}
            </span>
            <span className="text-xs text-slate-600 hidden sm:inline">Vista Previa Formal</span>
          </div>

          <div className="flex items-center gap-2">
            {/* WhatsApp Send Button */}
            <button
              onClick={handleWhatsAppSend}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>Enviar por WhatsApp</span>
            </button>

            {/* Print / Save PDF Button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-[#0A2957] hover:bg-[#071c3c] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#FFCC01]" />
              <span className="hidden xs:inline">Imprimir / Guardar PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-black hover:bg-slate-200/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Formal Printable Document Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 print-container font-sans bg-white">
          {/* Header Membrete */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b-2 border-[#0A2957]">
            {/* Logo de tamaño completo sin encapsular */}
            <div>
              <img
                src="https://appdesignproyectos.com/xcopelogo.png"
                alt="Xcope"
                className="h-12 sm:h-16 w-auto object-contain block select-none"
                referrerPolicy="no-referrer"
              />
              <p className="text-[11px] font-bold text-[#0A2957] tracking-wider uppercase mt-1">
                Scope QX · Laparoscopic MX
              </p>
              <p className="text-[10px] text-slate-500 max-w-xs">
                Suministro de Equipo Quirúrgico, Instrumental Laparoscópico y Consumibles Médicos de Alta Especialidad.
              </p>
            </div>

            {/* Folio & Metadata Box */}
            <div className="text-left sm:text-right bg-slate-50 p-4 rounded-xl border border-slate-200 min-w-[220px]">
              <span className="text-[11px] font-bold text-[#0A2957] uppercase tracking-wider block">
                Cotización Formal
              </span>
              <span className="text-xl font-mono font-extrabold text-black block mt-0.5">
                {quote.folio}
              </span>
              <div className="text-xs text-slate-600 mt-2 space-y-0.5">
                <div>Fecha: <strong className="text-black font-mono">{quote.createdAt}</strong></div>
                <div>Vigencia: <strong className="text-black font-mono">{quote.validUntil}</strong></div>
                <div>Régimen: <span className="font-semibold text-[#0A2957] uppercase">{quote.priceType}</span></div>
              </div>
            </div>
          </div>

          {/* Client Details & Surgical Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 text-xs border-b border-slate-200">
            <div>
              <span className="font-bold text-[#0A2957] uppercase tracking-wider block mb-1">
                Datos del Cliente / Médico Solicitante
              </span>
              <div className="text-sm font-bold text-black">{quote.clientName}</div>
              {quote.clientSpecialty && (
                <div className="text-slate-600 font-medium">{quote.clientSpecialty}</div>
              )}
              <div className="text-slate-600 mt-1">Tel: {quote.clientPhone}</div>
              <div className="text-slate-600">Email: {quote.clientEmail}</div>
            </div>

            <div>
              <span className="font-bold text-[#0A2957] uppercase tracking-wider block mb-1">
                Lugar de Entrega / Quirófano CEyE
              </span>
              <div className="text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {quote.clientAddress}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="py-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0A2957] text-white">
                  <th className="py-2.5 px-3 font-bold rounded-l-lg">Partida / SKU</th>
                  <th className="py-2.5 px-3 font-bold">Descripción del Insumo / Especificaciones</th>
                  <th className="py-2.5 px-3 font-bold text-center">Cant</th>
                  <th className="py-2.5 px-3 font-bold text-right">P. Unitario</th>
                  <th className="py-2.5 px-3 font-bold text-right rounded-r-lg">Total (MXN)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quote.items.map((it, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-[#0A2957] align-top whitespace-nowrap">
                      {it.sku}
                    </td>
                    <td className="py-3 px-3 align-top">
                      <div className="font-bold text-black">{it.productName}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        Marca: {it.brand} {it.specifications ? `· ${it.specifications}` : ''}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-center font-bold text-black align-top">
                      {it.quantity}
                    </td>
                    <td className="py-3 px-3 font-mono text-right text-slate-700 align-top">
                      ${it.unitPrice.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      {it.discountPercent > 0 && (
                        <div className="text-[10px] text-emerald-700">-{it.discountPercent}% desc</div>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-right text-black align-top tabular-nums">
                      ${it.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Financial Summary */}
            <div className="flex flex-col sm:flex-row justify-between items-start pt-6 border-t border-slate-200 mt-4 gap-4">
              <div className="text-xs text-slate-600 max-w-md space-y-2">
                <div>
                  <strong className="text-[#0A2957] block mb-0.5">Términos de Recepción Quirúrgica:</strong>
                  <p className="text-[11px]">{quote.surgicalNotes}</p>
                </div>
                <div>
                  <strong className="text-[#0A2957] block mb-0.5">Garantía y Condiciones Comerciales:</strong>
                  <p className="text-[11px]">{quote.deliveryTerms}</p>
                </div>
              </div>

              <div className="w-full sm:w-72 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5 self-end">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold">${quote.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                </div>
                {quote.discountTotal > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Descuento Especial:</span>
                    <span className="font-mono font-bold">-${quote.discountTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>I.V.A. Trasladado (16%):</span>
                  <span className="font-mono font-bold">${quote.taxIva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#0A2957] pt-2 border-t border-slate-300">
                  <span>TOTAL:</span>
                  <span className="font-mono text-black tabular-nums">
                    ${quote.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Signatures & Institutional footer */}
          <div className="mt-12 pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <div className="h-12 border-b border-slate-400 mx-8"></div>
              <p className="font-bold text-[#0A2957] mt-2">Dpto. Quirúrgico Xcope</p>
              <p className="text-[10px] text-slate-500">Scope QX / Laparoscopic MX</p>
            </div>
            <div>
              <div className="h-12 border-b border-slate-400 mx-8"></div>
              <p className="font-bold text-black mt-2">Aceptación de Presupuesto</p>
              <p className="text-[10px] text-slate-500">Firma o Sello de Compras / Quirófano</p>
            </div>
          </div>
        </div>

        {/* Footer actions in screen mode */}
        <div className="no-print p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between rounded-b-2xl">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-black cursor-pointer"
          >
            <Copy className="w-4 h-4" />
            <span>Copiar Resumen</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl cursor-pointer"
          >
            Cerrar Vista Previa
          </button>
        </div>
      </div>
    </div>
  );
};
