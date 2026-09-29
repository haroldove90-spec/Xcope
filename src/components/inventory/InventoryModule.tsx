import React, { useState, useMemo } from 'react';
import { Product, ProductCategory, LotInfo } from '../../types';
import {
  Package,
  Search,
  Plus,
  Minus,
  AlertTriangle,
  Clock,
  DollarSign,
  TrendingUp,
  X,
  Edit2,
  CheckCircle2,
  SlidersHorizontal,
  FileText,
} from 'lucide-react';

interface InventoryModuleProps {
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

export const InventoryModule: React.FC<InventoryModuleProps> = ({
  products,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);

  // Modal states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddEditModal, setShowAddEditModal] = useState(false);

  // Quick Stock Adjustment Modal state
  const [stockAdjustProduct, setStockAdjustProduct] = useState<Product | null>(null);
  const [adjustType, setAdjustType] = useState<'entrada' | 'salida'>('entrada');
  const [adjustQuantity, setAdjustQuantity] = useState<number>(1);
  const [adjustReason, setAdjustReason] = useState<'compra' | 'merma' | 'devolucion' | 'muestra_medica'>('compra');

  // Form state for unified Create/Edit
  const [formData, setFormData] = useState<Partial<Product>>({
    sku: '',
    name: '',
    brand: 'Laparoscopic MX',
    category: 'instrumental_laparoscopico',
    model: '',
    description: '',
    priceList: 6500,
    priceDistributor: 4800,
    costAcquisition: 3000,
    stockPhysical: 10,
    minStockAlert: 5,
    specifications: {
      diameter: '5 mm',
      length: '33 cm',
      angle: '',
      autoclavable: true,
      usage: 'reutilizable',
    },
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60',
    lots: [],
  });

  const [lotForm, setLotForm] = useState({
    lotNumber: '',
    expirationDate: '',
    quantity: 10,
    sterile: true,
  });

  const specialties = [
    { id: 'all', name: 'Todas las Especialidades' },
    { id: 'instrumental_laparoscopico', name: 'Laparoscopia' },
    { id: 'opticas_y_lentes', name: 'Endoscopia / Ópticas' },
    { id: 'grapado_y_sutura', name: 'Grapado Quirúrgico' },
    { id: 'trocares_y_acceso', name: 'Trocares de Acceso' },
    { id: 'mallas_y_biomateriales', name: 'Mallas y Hernias' },
    { id: 'soluciones_y_esterilizacion', name: 'Cidex OPA / CEyE' },
  ];

  const getLotStatus = (dateStr: string) => {
    const today = new Date();
    const expiry = new Date(dateStr);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return { label: 'Vencido', color: 'text-red-700 bg-red-100 border-red-300' };
    if (diffDays <= 30) return { label: `Crítico (${diffDays}d)`, color: 'text-red-700 bg-red-50 border-red-200' };
    if (diffDays <= 90) return { label: `Próximo (${diffDays}d)`, color: 'text-amber-800 bg-amber-50 border-amber-200' };
    return { label: `Vigente (${Math.floor(diffDays / 30)}m)`, color: 'text-emerald-800 bg-emerald-50 border-emerald-200' };
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.model.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory = selectedSpecialty === 'all' || p.category === selectedSpecialty;
      const isUrgentResupply = p.stockPhysical <= p.minStockAlert;
      const matchAlert = !filterLowStockOnly || isUrgentResupply;

      return matchSearch && matchCategory && matchAlert;
    });
  }, [products, searchTerm, selectedSpecialty, filterLowStockOnly]);

  // Open Edit modal
  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({ ...p });
    setShowAddEditModal(true);
  };

  // Open Create modal
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      brand: 'Laparoscopic MX',
      category: 'instrumental_laparoscopico',
      model: 'GEN-2026',
      description: 'Instrumental y consumible quirúrgico especializado.',
      priceList: 5500,
      priceDistributor: 4200,
      costAcquisition: 2500,
      stockPhysical: 10,
      minStockAlert: 5,
      specifications: {
        diameter: '5 mm',
        length: '33 cm',
        autoclavable: true,
        usage: 'reutilizable',
      },
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60',
      lots: [],
    });
    setShowAddEditModal(true);
  };

  // Save Add/Edit
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sku || !formData.name) return;

    if (editingProduct) {
      // Update
      const updated: Product = {
        ...editingProduct,
        sku: formData.sku,
        name: formData.name,
        commercialName: formData.commercialName || formData.name,
        brand: formData.brand || 'Laparoscopic MX',
        category: (formData.category as ProductCategory) || 'instrumental_laparoscopico',
        model: formData.model || '',
        description: formData.description || '',
        priceList: Number(formData.priceList) || 0,
        priceDistributor: Number(formData.priceDistributor) || 0,
        costAcquisition: Number(formData.costAcquisition) || 0,
        stockPhysical: Number(formData.stockPhysical) || 0,
        minStockAlert: Number(formData.minStockAlert) || 5,
        specifications: {
          diameter: formData.specifications?.diameter,
          length: formData.specifications?.length,
          angle: formData.specifications?.angle,
          autoclavable: formData.specifications?.autoclavable,
          usage: formData.specifications?.usage,
        },
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60',
        lots: formData.lots || editingProduct.lots,
      };
      onUpdateProduct(updated);
    } else {
      // Create new
      const created: Product = {
        id: 'prod-' + Date.now(),
        sku: formData.sku,
        name: formData.name,
        commercialName: formData.name,
        brand: formData.brand || 'Laparoscopic MX',
        category: (formData.category as ProductCategory) || 'instrumental_laparoscopico',
        model: formData.model || '',
        description: formData.description || '',
        priceList: Number(formData.priceList) || 0,
        priceDistributor: Number(formData.priceDistributor) || 0,
        costAcquisition: Number(formData.costAcquisition) || 0,
        stockPhysical: Number(formData.stockPhysical) || 0,
        stockConsignment: 0,
        minStockAlert: Number(formData.minStockAlert) || 5,
        currency: 'MXN',
        specifications: {
          diameter: formData.specifications?.diameter,
          length: formData.specifications?.length,
          angle: formData.specifications?.angle,
          autoclavable: formData.specifications?.autoclavable,
          usage: formData.specifications?.usage,
        },
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60',
        lots: formData.lots || [],
      };
      onAddProduct(created);
    }

    setShowAddEditModal(false);
  };

  // Quick Stock Adjustment Handler
  const handleExecuteStockAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockAdjustProduct) return;

    const currentQty = stockAdjustProduct.stockPhysical;
    let newQty = currentQty;

    if (adjustType === 'entrada') {
      newQty = currentQty + adjustQuantity;
    } else {
      newQty = Math.max(0, currentQty - adjustQuantity);
    }

    const updated = {
      ...stockAdjustProduct,
      stockPhysical: newQty,
    };

    onUpdateProduct(updated);
    setStockAdjustProduct(null);
    setAdjustQuantity(1);
  };

  // Add Lot to form
  const handleAddLot = () => {
    if (!lotForm.lotNumber || !lotForm.expirationDate) return;
    const newLots: LotInfo[] = [
      ...(formData.lots || []),
      {
        lotNumber: lotForm.lotNumber,
        expirationDate: lotForm.expirationDate,
        quantity: lotForm.quantity,
        sterile: lotForm.sterile,
      },
    ];
    setFormData({ ...formData, lots: newLots });
    setLotForm({ lotNumber: '', expirationDate: '', quantity: 10, sterile: true });
  };

  return (
    <div className="space-y-5 pb-20 lg:pb-12">
      {/* Module Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0A2957] bg-blue-50 px-2 py-0.5 rounded-md">
              Módulo 1
            </span>
            <span className="text-xs text-slate-500 font-mono">Scope QX / Laparoscopic MX</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0B1320] mt-1">
            Productos e Inventario Quirúrgico
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Control de catálogo médico, existencias, costos, lotes estériles y margen directo.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0A2957] hover:bg-[#071c3c] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#FFCC01]" />
          <span>+ Alta de Producto</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por SKU, nombre, marca o modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden text-[#0B1320]"
            />
          </div>

          <button
            onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer w-full md:w-auto justify-center whitespace-nowrap ${
              filterLowStockOnly
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Semáforo: Solo Resurtido Urgente</span>
          </button>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {specialties.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedSpecialty(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedSpecialty === cat.id
                  ? 'bg-[#0A2957] text-[#FFCC01] shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:text-black hover:bg-slate-200/80'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table with Quick Stock Adjust (+ / -) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            Total en catálogo: <strong className="text-black font-bold">{filteredProducts.length}</strong> insumos
          </span>
          <div className="flex items-center gap-3 text-slate-600">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Normal
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Resurtido Urgente
            </span>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredProducts.map((p) => {
            const isLowStock = p.stockPhysical <= p.minStockAlert;
            const marginAmount = p.priceList - p.costAcquisition;
            const marginPercent = p.priceList > 0 ? Math.round((marginAmount / p.priceList) * 100) : 0;

            return (
              <div
                key={p.id}
                className={`p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                  isLowStock ? 'bg-amber-50/30' : ''
                }`}
              >
                {/* Left: Product Info & Specs */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-slate-200 shrink-0 bg-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#0A2957] bg-slate-100 px-2 py-0.5 rounded">
                        {p.sku}
                      </span>
                      <span className="text-xs font-bold text-slate-800">{p.brand}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-600">{p.model}</span>
                      {isLowStock && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Resurtido Urgente
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-black mt-1 line-clamp-1">
                      {p.name}
                    </h3>

                    {/* Especificaciones */}
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-600">
                      {p.specifications.diameter && <span>Ø {p.specifications.diameter}</span>}
                      {p.specifications.length && (
                        <>
                          <span className="text-slate-300">/</span>
                          <span>Long: {p.specifications.length}</span>
                        </>
                      )}
                      {p.specifications.angle && (
                        <>
                          <span className="text-slate-300">/</span>
                          <span className="font-bold text-[#0A2957]">{p.specifications.angle}</span>
                        </>
                      )}
                      <span className="text-slate-300">/</span>
                      <span className={p.specifications.autoclavable ? 'text-emerald-700 font-semibold' : 'text-slate-500'}>
                        {p.specifications.autoclavable ? 'Autoclavable' : 'Estéril Desechable'}
                      </span>
                    </div>

                    {/* Lotes & Vencimiento */}
                    {p.lots && p.lots.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className="text-[11px] font-semibold text-slate-500">Lote & Caducidad:</span>
                        {p.lots.map((l, idx) => {
                          const status = getLotStatus(l.expirationDate);
                          return (
                            <span
                              key={idx}
                              className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${status.color}`}
                            >
                              {l.lotNumber} ({l.expirationDate}) - {status.label}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Margen, Existencias y Ajuste Manual Rápido */}
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between lg:justify-end w-full lg:w-auto gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  {/* Precios y Margen en Tiempo Real */}
                  <div className="text-left sm:text-right min-w-[130px]">
                    <div className="text-xs text-slate-500">Público / Lista</div>
                    <div className="text-base font-bold text-[#0A2957] font-mono tabular-nums">
                      ${p.priceList.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[11px] text-slate-600 font-mono">
                      Costo: ${p.costAcquisition.toLocaleString('es-MX')} · Dist: ${p.priceDistributor.toLocaleString('es-MX')}
                    </div>
                    <div className="text-[11px] font-bold text-emerald-700 mt-0.5">
                      Margen: +{marginPercent}% (${marginAmount.toLocaleString('es-MX')})
                    </div>
                  </div>

                  {/* Stock y Botones Directos de Entrada/Salida */}
                  <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <div className="px-2 text-center min-w-[70px]">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Existencia</span>
                      <span
                        className={`text-lg font-bold font-mono tabular-nums ${
                          isLowStock ? 'text-amber-700' : 'text-black'
                        }`}
                      >
                        {p.stockPhysical}
                      </span>
                    </div>

                    {/* Botón Entrada (+) */}
                    <button
                      onClick={() => {
                        setStockAdjustProduct(p);
                        setAdjustType('entrada');
                        setAdjustQuantity(1);
                        setAdjustReason('compra');
                      }}
                      title="Entrada rápida de piezas (Compra o Devolución)"
                      className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-transform active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    {/* Botón Salida (-) */}
                    <button
                      onClick={() => {
                        setStockAdjustProduct(p);
                        setAdjustType('salida');
                        setAdjustQuantity(1);
                        setAdjustReason('muestra_medica');
                      }}
                      title="Salida rápida de piezas (Merma o Muestra médica)"
                      className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-transform active:scale-95 cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Editar Ficha Técnica */}
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="p-2 rounded-xl text-slate-600 hover:text-[#0A2957] hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                    title="Editar producto"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Ajuste Manual de Existencias (Entrada / Salida Rápida) */}
      {stockAdjustProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-[#0B1320]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#0A2957]">
                {adjustType === 'entrada' ? 'Entrada Rápida de Stock' : 'Salida Rápida de Stock'}
              </h3>
              <button
                onClick={() => setStockAdjustProduct(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteStockAdjust} className="mt-4 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="font-mono font-bold text-[#0A2957]">{stockAdjustProduct.sku}</span>
                <p className="font-bold text-black">{stockAdjustProduct.name}</p>
                <p className="text-slate-600">
                  Existencia actual en bodega: <strong className="font-mono text-black">{stockAdjustProduct.stockPhysical} piezas</strong>
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cantidad a modificar</label>
                <input
                  type="number"
                  min="1"
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(parseInt(e.target.value) || 1)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-base font-bold text-center"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Motivo del Movimiento</label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  {adjustType === 'entrada' ? (
                    <>
                      <option value="compra">Compra a Fabricante / Resurtido</option>
                      <option value="devolucion">Devolución de Quirófano / Hospital</option>
                    </>
                  ) : (
                    <>
                      <option value="muestra_medica">Muestra Médica a Cirujano</option>
                      <option value="merma">Merma o Caducidad</option>
                      <option value="devolucion">Salida por Demostración</option>
                    </>
                  )}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStockAdjustProduct(null)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 font-bold text-white rounded-xl shadow-xs ${
                    adjustType === 'entrada' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Confirmar {adjustType === 'entrada' ? 'Entrada' : 'Salida'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Alta y Edición Unificada */}
      {showAddEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-[#0B1320] my-8 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#0A2957]">
                {editingProduct ? 'Editar Producto Quirúrgico' : 'Alta de Nuevo Producto'}
              </h3>
              <button
                onClick={() => setShowAddEditModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Código / SKU</label>
                  <input
                    type="text"
                    required
                    value={formData.sku || ''}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    placeholder="LMX-GRASP-533"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Marca</label>
                  <select
                    value={formData.brand || 'Laparoscopic MX'}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Laparoscopic MX">Laparoscopic MX</option>
                    <option value="Karl Storz">Karl Storz</option>
                    <option value="Ethicon">Ethicon</option>
                    <option value="Medtronic">Medtronic</option>
                    <option value="Boston Scientific">Boston Scientific</option>
                    <option value="ASP Johnson & Johnson">ASP (Cidex)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre Comercial del Producto</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="ej. Pinza Laparoscópica Grasper Maryland 5mm x 33cm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Especialidad</label>
                  <select
                    value={formData.category || 'instrumental_laparoscopico'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="instrumental_laparoscopico">Laparoscopia</option>
                    <option value="opticas_y_lentes">Endoscopia / Ópticas</option>
                    <option value="grapado_y_sutura">Grapado Quirúrgico</option>
                    <option value="trocares_y_acceso">Trocares de Acceso</option>
                    <option value="mallas_y_biomateriales">Mallas y Biomateriales</option>
                    <option value="soluciones_y_esterilizacion">Cidex OPA y Esterilización</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Modelo</label>
                  <input
                    type="text"
                    value={formData.model || ''}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    placeholder="MX-M533-ISO"
                  />
                </div>
              </div>

              {/* Precios y Margen en Tiempo Real */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-[#0A2957] block">Estructura de Precios y Margen</span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-600 block">Costo Adquisición ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.costAcquisition || 0}
                      onChange={(e) => setFormData({ ...formData, costAcquisition: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block">Precio Público / Lista ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.priceList || 0}
                      onChange={(e) => setFormData({ ...formData, priceList: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg font-mono font-bold text-[#0A2957]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block">Precio Distribuidor ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.priceDistributor || 0}
                      onChange={(e) => setFormData({ ...formData, priceDistributor: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Margen Calculado en Tiempo Real */}
                <div className="pt-2 text-xs flex justify-between items-center text-slate-700">
                  <span>Margen de Ganancia Estimado:</span>
                  <span className="font-mono font-bold text-emerald-700 text-sm">
                    +{formData.priceList && formData.costAcquisition
                      ? Math.round(((formData.priceList - formData.costAcquisition) / formData.priceList) * 100)
                      : 0}% (${(Number(formData.priceList || 0) - Number(formData.costAcquisition || 0)).toLocaleString('es-MX')} MXN)
                  </span>
                </div>
              </div>

              {/* Lotes y Caducidades */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-[#0A2957] block">Captura de Lote y Caducidad</span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Número de Lote (ej. LT-2026-01)"
                    value={lotForm.lotNumber}
                    onChange={(e) => setLotForm({ ...lotForm, lotNumber: e.target.value })}
                    className="p-2 bg-white border border-slate-200 rounded-lg font-mono text-xs"
                  />
                  <input
                    type="date"
                    value={lotForm.expirationDate}
                    onChange={(e) => setLotForm({ ...lotForm, expirationDate: e.target.value })}
                    className="p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddLot}
                    className="p-2 bg-[#0A2957] text-[#FFCC01] font-bold rounded-lg text-xs hover:bg-[#071c3c]"
                  >
                    + Agregar Lote
                  </button>
                </div>

                {formData.lots && formData.lots.length > 0 && (
                  <div className="space-y-1 pt-1">
                    {formData.lots.map((l, i) => (
                      <div key={i} className="flex justify-between items-center text-[11px] p-1.5 bg-white rounded border border-slate-200">
                        <span className="font-mono font-bold text-black">{l.lotNumber} (Vence: {l.expirationDate})</span>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, lots: formData.lots?.filter((_, idx) => idx !== i) })}
                          className="text-red-600 font-bold"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Stock inicial y alerta de reorden */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Existencia en Bodega</label>
                  <input
                    type="number"
                    value={formData.stockPhysical || 0}
                    onChange={(e) => setFormData({ ...formData, stockPhysical: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Semáforo: Stock Mínimo para Resurtido</label>
                  <input
                    type="number"
                    value={formData.minStockAlert || 5}
                    onChange={(e) => setFormData({ ...formData, minStockAlert: parseInt(e.target.value) || 5 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-amber-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddEditModal(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#0A2957] hover:bg-[#071c3c] rounded-xl shadow-xs"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
