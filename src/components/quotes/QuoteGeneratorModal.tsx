import React, { useState } from 'react';
import { Client, Product, Quote, QuoteItem } from '../../types';
import { FileText, Plus, Trash2, X, Calculator, Send, Check } from 'lucide-react';

interface QuoteGeneratorModalProps {
  clients: Client[];
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onSaveQuote: (quote: Quote) => void;
  preselectedClient?: Client | null;
}

export const QuoteGeneratorModal: React.FC<QuoteGeneratorModalProps> = ({
  clients,
  products,
  isOpen,
  onClose,
  onSaveQuote,
  preselectedClient,
}) => {
  if (!isOpen) return null;

  const [selectedClientId, setSelectedClientId] = useState<string>(
    preselectedClient?.id || clients[0]?.id || ''
  );
  const [priceType, setPriceType] = useState<'lista' | 'distribuidor'>('lista');
  const [validityDays, setValidityDays] = useState<number>(15);
  const [surgicalNotes, setSurgicalNotes] = useState(
    'Entrega programada en quirófano/almacén CEyE. Instrumental estéril y verificado para procedimiento.'
  );
  const [deliveryTerms, setDeliveryTerms] = useState(
    'Flete local sin costo en hospitales CDMX/Área Metropolitana. Garantía de 1 año en instrumental Laparoscopic MX.'
  );

  // Selected items in the quote
  const [items, setItems] = useState<QuoteItem[]>([
    {
      productId: products[0]?.id || 'prod-001',
      productName: products[0]?.name || '',
      sku: products[0]?.sku || '',
      brand: products[0]?.brand || '',
      specifications: `${products[0]?.specifications?.diameter || ''} ${products[0]?.specifications?.length || ''}`.trim(),
      quantity: 1,
      unitPrice: products[0]?.priceList || 0,
      discountPercent: 0,
      total: products[0]?.priceList || 0,
    },
  ]);

  const currentClient = clients.find((c) => c.id === selectedClientId) || clients[0];

  // Helper to calculate totals
  const subtotal = items.reduce((acc, it) => acc + it.quantity * it.unitPrice, 0);
  const discountTotal = items.reduce((acc, it) => acc + (it.quantity * it.unitPrice * (it.discountPercent / 100)), 0);
  const taxableAmount = subtotal - discountTotal;
  const taxIva = taxableAmount * 0.16;
  const grandTotal = taxableAmount + taxIva;

  // Add line item
  const handleAddItem = () => {
    const firstProd = products[0];
    if (!firstProd) return;

    const basePrice = priceType === 'distribuidor' ? firstProd.priceDistributor : firstProd.priceList;

    setItems([
      ...items,
      {
        productId: firstProd.id,
        productName: firstProd.name,
        sku: firstProd.sku,
        brand: firstProd.brand,
        specifications: `${firstProd.specifications?.diameter || ''} ${firstProd.specifications?.length || ''}`.trim(),
        quantity: 1,
        unitPrice: basePrice,
        discountPercent: 0,
        total: basePrice,
      },
    ]);
  };

  // Remove line item
  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  // Update item field
  const handleItemChange = (index: number, field: keyof QuoteItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index] };

    if (field === 'productId') {
      const prod = products.find((p) => p.id === value);
      if (prod) {
        item.productId = prod.id;
        item.productName = prod.name;
        item.sku = prod.sku;
        item.brand = prod.brand;
        item.specifications = `${prod.specifications?.diameter || ''} ${prod.specifications?.length || ''}`.trim();
        item.unitPrice = priceType === 'distribuidor' ? prod.priceDistributor : prod.priceList;
      }
    } else if (field === 'quantity') {
      item.quantity = Math.max(1, parseInt(value) || 1);
    } else if (field === 'unitPrice') {
      item.unitPrice = parseFloat(value) || 0;
    } else if (field === 'discountPercent') {
      item.discountPercent = Math.max(0, Math.min(100, parseFloat(value) || 0));
    }

    // Recalculate line total
    const itemBase = item.quantity * item.unitPrice;
    item.total = itemBase - (itemBase * (item.discountPercent / 100));
    updated[index] = item;
    setItems(updated);
  };

  // When price type toggles, recalculate unit prices
  const handlePriceTypeChange = (type: 'lista' | 'distribuidor') => {
    setPriceType(type);
    const updated = items.map((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (!prod) return item;
      const newUnitPrice = type === 'distribuidor' ? prod.priceDistributor : prod.priceList;
      const itemBase = item.quantity * newUnitPrice;
      return {
        ...item,
        unitPrice: newUnitPrice,
        total: itemBase - (itemBase * (item.discountPercent / 100)),
      };
    });
    setItems(updated);
  };

  // Generate formal quote
  const handleGenerateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClient || items.length === 0) return;

    const today = new Date();
    const expiry = new Date(today);
    expiry.setDate(expiry.getDate() + validityDays);

    const quoteFolio = `COT-${today.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newQuote: Quote = {
      id: 'quote-' + Date.now(),
      folio: quoteFolio,
      clientId: currentClient.id,
      clientName: currentClient.name,
      clientSpecialty: currentClient.specialty,
      clientAddress: currentClient.deliveryAddress,
      clientPhone: currentClient.phone,
      clientEmail: currentClient.email,
      createdAt: today.toISOString().split('T')[0],
      validUntil: expiry.toISOString().split('T')[0],
      status: 'enviada',
      priceType,
      items,
      subtotal,
      discountTotal,
      taxIva,
      total: grandTotal,
      surgicalNotes,
      deliveryTerms,
    };

    onSaveQuote(newQuote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-4xl rounded-2xl bg-white p-5 sm:p-7 shadow-2xl border border-slate-200 text-[#0B1320] my-8 animate-in fade-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#0A2957] text-[#FFCC01]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#0A2957]">
                Generador Rápido de Cotizaciones Quirúrgicas
              </h2>
              <p className="text-xs text-slate-500">
                Membrete Scope QX / Laparoscopic MX · Emisión de presupuesto formal y despacho WhatsApp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-black hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleGenerateQuote} className="mt-5 space-y-5 text-xs sm:text-sm">
          {/* Row 1: Client selection and price type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Médico Cirujano u Hospital Destinatario
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-[#0A2957]/30 text-[#0B1320]"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.specialty || c.type} ({c.preferredHospital || 'Entrega CDMX'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Lista de Precios</label>
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => handlePriceTypeChange('lista')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                    priceType === 'lista'
                      ? 'bg-[#0A2957] text-[#FFCC01] shadow-2xs'
                      : 'text-slate-600 hover:text-black'
                  }`}
                >
                  Precio Lista
                </button>
                <button
                  type="button"
                  onClick={() => handlePriceTypeChange('distribuidor')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                    priceType === 'distribuidor'
                      ? 'bg-[#0A2957] text-[#FFCC01] shadow-2xs'
                      : 'text-slate-600 hover:text-black'
                  }`}
                >
                  Distribuidor
                </button>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-[#0A2957] uppercase tracking-wider">
                Partidas Quirúrgicas / Insumos
              </span>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 text-[#0A2957] border border-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#0A2957]" /> Agregar Partida
              </button>
            </div>

            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto p-2">
              {items.map((it, idx) => (
                <div key={idx} className="p-2 sm:p-3 flex flex-col md:flex-row items-start md:items-center gap-2">
                  <div className="flex-1 w-full">
                    <select
                      value={it.productId}
                      onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          [{p.sku}] {p.name} - Stock: {p.stockPhysical} uds
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    {/* Cantidad */}
                    <div className="w-20">
                      <label className="text-[10px] text-slate-500 block md:hidden">Cant</label>
                      <input
                        type="number"
                        min="1"
                        value={it.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-center font-bold"
                        placeholder="Cant"
                      />
                    </div>

                    {/* Precio Unitario */}
                    <div className="w-28">
                      <label className="text-[10px] text-slate-500 block md:hidden">Unitario</label>
                      <input
                        type="number"
                        step="0.01"
                        value={it.unitPrice}
                        onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-right"
                      />
                    </div>

                    {/* Descuento % */}
                    <div className="w-20">
                      <label className="text-[10px] text-slate-500 block md:hidden">Desc %</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={it.discountPercent}
                        onChange={(e) => handleItemChange(idx, 'discountPercent', e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-center text-emerald-700 font-bold"
                        placeholder="Desc %"
                      />
                    </div>

                    {/* Total Partida */}
                    <div className="w-28 text-right font-mono font-bold text-xs sm:text-sm text-black tabular-nums">
                      ${it.total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>

                    {/* Eliminar partida */}
                    <button
                      type="button"
                      disabled={items.length <= 1}
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-600 disabled:opacity-30 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal and Totals Bar */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <span>Vigencia de la propuesta:</span>
                <select
                  value={validityDays}
                  onChange={(e) => setValidityDays(parseInt(e.target.value) || 15)}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
                >
                  <option value={7}>7 días</option>
                  <option value={15}>15 días</option>
                  <option value={30}>30 días</option>
                </select>
              </div>

              <div className="space-y-1 text-right text-xs">
                <div className="text-slate-600 flex justify-between gap-8">
                  <span>Subtotal Bruto:</span>
                  <span className="font-mono font-bold">${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                </div>
                {discountTotal > 0 && (
                  <div className="text-emerald-700 flex justify-between gap-8">
                    <span>Descuento aplicado:</span>
                    <span className="font-mono font-bold">-${discountTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="text-slate-600 flex justify-between gap-8">
                  <span>I.V.A. (16%):</span>
                  <span className="font-mono font-bold">${taxIva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="text-base sm:text-lg font-bold text-[#0A2957] pt-1 border-t border-slate-300 flex justify-between gap-8">
                  <span>TOTAL NETO:</span>
                  <span className="font-mono font-extrabold text-black tabular-nums">
                    ${grandTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Surgical Delivery Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Notas de Entrega Quirúrgica / CEyE</label>
              <textarea
                rows={2}
                value={surgicalNotes}
                onChange={(e) => setSurgicalNotes(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Términos de Garantía y Flete</label>
              <textarea
                rows={2}
                value={deliveryTerms}
                onChange={(e) => setDeliveryTerms(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#0A2957] hover:bg-[#071c3c] rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 text-[#FFCC01]" />
              <span>Emitir Cotización Formal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
