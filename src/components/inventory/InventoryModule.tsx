import React, { useState, useMemo } from 'react';
import { Product, ProductCategory, LotInfo, SerialNumber } from '../../types';
import {
  Package,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  Clock,
  Shield,
  Building,
  CheckCircle,
  ExternalLink,
  Layers,
  ArrowRightLeft,
  X,
  SlidersHorizontal,
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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterAlertOnly, setFilterAlertOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConsignmentModal, setShowConsignmentModal] = useState(false);
  const [consignmentTargetProduct, setConsignmentTargetProduct] = useState<Product | null>(null);

  // Transfer Consignment state
  const [transferHospital, setTransferHospital] = useState('Hospital Ángeles Pedregal');
  const [transferQuantity, setTransferQuantity] = useState(1);

  // New Product form state
  const [newProd, setNewProd] = useState<Partial<Product>>({
    brand: 'Laparoscopic MX',
    category: 'instrumental_laparoscopico',
    currency: 'MXN',
    priceList: 5000,
    priceDistributor: 4000,
    costAcquisition: 2500,
    stockPhysical: 10,
    stockConsignment: 0,
    minStockAlert: 5,
    specifications: {
      diameter: '5 mm',
      length: '33 cm',
      autoclavable: true,
      usage: 'reutilizable',
    },
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60',
  });

  // Categories list
  const categories: { id: string; name: string }[] = [
    { id: 'all', name: 'Todos los Insumos' },
    { id: 'instrumental_laparoscopico', name: 'Instrumental Laparoscópico' },
    { id: 'opticas_y_lentes', name: 'Ópticas y Lentes 0°/30°' },
    { id: 'trocares_y_acceso', name: 'Trocares y Acceso' },
    { id: 'grapado_y_sutura', name: 'Grapado y Sutura' },
    { id: 'mallas_y_biomateriales', name: 'Mallas Quirúrgicas' },
    { id: 'soluciones_y_esterilizacion', name: 'Cidex OPA y Desinfección' },
  ];

  // Helper for lot expiry status
  const getLotStatus = (dateStr: string) => {
    const today = new Date();
    const expiry = new Date(dateStr);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return { label: 'Vencido', color: 'text-red-700 bg-red-50 border-red-200' };
    if (diffDays <= 30) return { label: `Crítico (${diffDays}d)`, color: 'text-red-700 bg-red-100 border-red-300' };
    if (diffDays <= 90) return { label: `Por Vencer (${diffDays}d)`, color: 'text-amber-800 bg-amber-50 border-amber-200' };
    return { label: `Vigente (${Math.floor(diffDays / 30)}m)`, color: 'text-emerald-800 bg-emerald-50 border-emerald-200' };
  };

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.model.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

      const hasLowStock = p.stockPhysical <= p.minStockAlert;
      const hasExpiringLot = p.lots?.some((l) => {
        const diff = Math.ceil((new Date(l.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return diff <= 90;
      });

      const matchesAlert = !filterAlertOnly || hasLowStock || hasExpiringLot;

      return matchesSearch && matchesCategory && matchesAlert;
    });
  }, [products, searchTerm, selectedCategory, filterAlertOnly]);

  // Consignment transfer submit
  const handleConsignmentTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consignmentTargetProduct) return;

    if (consignmentTargetProduct.stockPhysical < transferQuantity) {
      alert('No hay suficiente stock en bodega física para transferir esa cantidad.');
      return;
    }

    const updated = { ...consignmentTargetProduct };
    updated.stockPhysical -= transferQuantity;
    updated.stockConsignment += transferQuantity;

    const existingLoc = updated.consignmentLocations?.find((l) => l.hospitalName === transferHospital);
    if (existingLoc) {
      existingLoc.quantity += transferQuantity;
    } else {
      updated.consignmentLocations = [
        ...(updated.consignmentLocations || []),
        { hospitalName: transferHospital, quantity: transferQuantity },
      ];
    }

    onUpdateProduct(updated);
    setShowConsignmentModal(false);
    setConsignmentTargetProduct(null);
  };

  // Add new product submit
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.sku) return;

    const productToCreate: Product = {
      id: 'prod-' + Date.now(),
      sku: newProd.sku || 'SKU-' + Math.floor(Math.random() * 1000),
      name: newProd.name || '',
      commercialName: newProd.commercialName || newProd.name || '',
      brand: newProd.brand || 'Laparoscopic MX',
      category: (newProd.category as ProductCategory) || 'instrumental_laparoscopico',
      model: newProd.model || 'GEN-2026',
      description: newProd.description || 'Instrumental quirúrgico especializado.',
      specifications: {
        diameter: newProd.specifications?.diameter || '5 mm',
        length: newProd.specifications?.length || '33 cm',
        angle: newProd.specifications?.angle,
        autoclavable: newProd.specifications?.autoclavable ?? true,
        usage: newProd.specifications?.usage || 'reutilizable',
      },
      imageUrl: newProd.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60',
      stockPhysical: Number(newProd.stockPhysical) || 0,
      stockConsignment: Number(newProd.stockConsignment) || 0,
      minStockAlert: Number(newProd.minStockAlert) || 5,
      priceList: Number(newProd.priceList) || 0,
      priceDistributor: Number(newProd.priceDistributor) || 0,
      costAcquisition: Number(newProd.costAcquisition) || 0,
      currency: (newProd.currency as 'MXN' | 'USD') || 'MXN',
    };

    onAddProduct(productToCreate);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-12">
      {/* Module Banner with Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0A2957] bg-blue-50 px-2 py-0.5 rounded-md">
              Inventario Especializado
            </span>
            <span className="text-xs text-slate-500 font-mono">Scope QX / Laparoscopic MX</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0B1320] mt-1">
            Catálogo Quirúrgico y Control de Stock
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Monitoreo en tiempo real de bodega central, consignaciones hospitalarias, lotes estériles y series con garantía.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0A2957] hover:bg-[#071c3c] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-[#FFCC01]" />
            <span>Nuevo Insumo</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por SKU, nombre, marca (Karl Storz, Ethicon...) o modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0A2957]/30 transition-all text-[#0B1320]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-black"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Quick filter by alerts */}
          <button
            onClick={() => setFilterAlertOnly(!filterAlertOnly)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer whitespace-nowrap w-full md:w-auto justify-center ${
              filterAlertOnly
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Solo Alertas (Stock y Caducidades)</span>
          </button>
        </div>

        {/* Categories horizontal scroll tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#0A2957] text-[#FFCC01] shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:text-black hover:bg-slate-200/80'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table & Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">
            Mostrando <span className="font-bold text-black">{filteredProducts.length}</span> productos encontrados
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Stock Normal
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Reorden / Stock Bajo
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Consignación Activa
            </span>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-bold text-slate-700">No se encontraron insumos médicos</p>
            <p className="text-xs text-slate-500 mt-1">Prueba ajustando el término de búsqueda o categoría.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredProducts.map((p) => {
              const isLowStock = p.stockPhysical <= p.minStockAlert;
              const margin = p.priceList > 0 ? Math.round(((p.priceList - p.costAcquisition) / p.priceList) * 100) : 0;

              return (
                <div
                  key={p.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  {/* Left: Info and Specs */}
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
                        <span className="text-xs font-bold text-slate-700">{p.brand}</span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-600">{p.model}</span>
                        {isLowStock && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Stock Mínimo
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-[#0B1320] mt-1 line-clamp-1">
                        {p.name}
                      </h3>

                      {/* Technical specifications summary */}
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-600">
                        {p.specifications.diameter && (
                          <span>Ø {p.specifications.diameter}</span>
                        )}
                        {p.specifications.length && (
                          <>
                            <span className="text-slate-300">/</span>
                            <span>Longitud: {p.specifications.length}</span>
                          </>
                        )}
                        {p.specifications.angle && (
                          <>
                            <span className="text-slate-300">/</span>
                            <span className="font-semibold text-[#0A2957]">{p.specifications.angle}</span>
                          </>
                        )}
                        <span className="text-slate-300">/</span>
                        <span className={p.specifications.autoclavable ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
                          {p.specifications.autoclavable ? 'Autoclavable 134°C' : 'Desechable Estéril'}
                        </span>
                      </div>

                      {/* Lotes o Series preview */}
                      {p.lots && p.lots.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <span className="text-[11px] font-semibold text-slate-500">Lotes:</span>
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

                      {p.serials && p.serials.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <span className="text-[11px] font-semibold text-slate-500">Series:</span>
                          {p.serials.slice(0, 2).map((s, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200"
                            >
                              {s.serial} ({s.autoclaveCycles} ciclos)
                            </span>
                          ))}
                          {p.serials.length > 2 && (
                            <span className="text-[10px] text-slate-500 font-medium">
                              +{p.serials.length - 2} series más
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Center/Right: Stock Multialmacén y Precios */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center justify-between w-full md:w-auto gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    {/* Multialmacén Stock Column */}
                    <div className="text-left md:text-right min-w-[120px]">
                      <div className="text-xs text-slate-500">Bodega Central</div>
                      <div
                        className={`text-lg font-bold font-mono tabular-nums ${
                          isLowStock ? 'text-amber-700' : 'text-slate-900'
                        }`}
                      >
                        {p.stockPhysical} <span className="text-xs font-sans text-slate-500 font-normal">piezas</span>
                      </div>
                      <div className="text-[11px] text-blue-800 font-semibold mt-0.5 flex items-center md:justify-end gap-1">
                        <Building className="w-3 h-3 text-blue-600" />
                        <span>{p.stockConsignment} en consignación</span>
                      </div>
                    </div>

                    {/* Precios Column */}
                    <div className="text-left md:text-right min-w-[140px] pl-3 border-l border-slate-100">
                      <div className="text-xs text-slate-500">Precio Lista</div>
                      <div className="text-base font-bold text-[#0A2957] font-mono tabular-nums">
                        ${p.priceList.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[11px] text-slate-600 font-mono">
                        Dist: ${p.priceDistributor.toLocaleString('es-MX')} · Margen: <span className="font-semibold text-emerald-700">+{margin}%</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          setConsignmentTargetProduct(p);
                          setShowConsignmentModal(true);
                        }}
                        title="Transferir a Consignación en Hospital"
                        className="p-2 rounded-xl text-[#0A2957] bg-slate-100 hover:bg-[#0A2957] hover:text-white transition-colors cursor-pointer"
                      >
                        <ArrowRightLeft className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setSelectedProduct(p)}
                        className="px-3 py-2 text-xs font-bold text-[#0A2957] bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Ver Ficha
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Ficha Técnica Detallada */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-[#0B1320] my-8 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold text-[#0A2957] bg-blue-50 px-2 py-0.5 rounded">
                  {selectedProduct.sku}
                </span>
                <h2 className="text-lg font-bold text-[#0B1320] mt-1">{selectedProduct.name}</h2>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-black hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm">
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-full sm:w-44 h-44 object-cover rounded-xl border border-slate-200 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 space-y-2">
                  <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                    {selectedProduct.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <span className="text-slate-500 block">Marca:</span>
                      <span className="font-bold text-black">{selectedProduct.brand}</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <span className="text-slate-500 block">Modelo:</span>
                      <span className="font-bold text-black">{selectedProduct.model}</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <span className="text-slate-500 block">Calibre / Diámetro:</span>
                      <span className="font-bold text-black">{selectedProduct.specifications.diameter || 'N/A'}</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <span className="text-slate-500 block">Longitud / Medida:</span>
                      <span className="font-bold text-black">{selectedProduct.specifications.length || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consignaciones activas */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A2957] mb-2 flex items-center gap-1.5">
                  <Building className="w-4 h-4" /> Distribución Multialmacén y Hospitales
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Bodega Central Xcope:</span>
                    <span className="text-base font-bold text-black font-mono">{selectedProduct.stockPhysical} uds</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Total en Consignación:</span>
                    <span className="text-base font-bold text-blue-800 font-mono">{selectedProduct.stockConsignment} uds</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Alerta de Reorden:</span>
                    <span className="text-base font-bold text-amber-700 font-mono">&le; {selectedProduct.minStockAlert} uds</span>
                  </div>
                </div>

                {selectedProduct.consignmentLocations && selectedProduct.consignmentLocations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200 text-xs">
                    <span className="font-semibold text-slate-700 block mb-1">Ubicación de consignación:</span>
                    <ul className="space-y-1">
                      {selectedProduct.consignmentLocations.map((loc, idx) => (
                        <li key={idx} className="flex justify-between items-center text-slate-600">
                          <span>{loc.hospitalName}</span>
                          <span className="font-bold font-mono text-black">{loc.quantity} uds</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Lotes y fechas de caducidad */}
              {selectedProduct.lots && selectedProduct.lots.length > 0 && (
                <div className="border border-slate-200 rounded-xl p-4 bg-white">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A2957] mb-2 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> Control de Lotes y Caducidades de Insumos Estériles
                  </h4>
                  <div className="space-y-2">
                    {selectedProduct.lots.map((lot, idx) => {
                      const status = getLotStatus(lot.expirationDate);
                      return (
                        <div key={idx} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-lg border border-slate-100">
                          <div>
                            <span className="font-mono font-bold text-slate-900">{lot.lotNumber}</span>
                            <span className="text-slate-500 ml-2">({lot.quantity} piezas disponibles)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-slate-700">Expira: {lot.expirationDate}</span>
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${status.color}`}>
                              {status.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Series y ciclos de autoclave */}
              {selectedProduct.serials && selectedProduct.serials.length > 0 && (
                <div className="border border-slate-200 rounded-xl p-4 bg-white">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A2957] mb-2 flex items-center gap-1.5">
                    <Shield className="w-4 h-4" /> Registro de Series y Trazabilidad de Garantías
                  </h4>
                  <div className="space-y-2">
                    {selectedProduct.serials.map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-lg border border-slate-100">
                        <div>
                          <span className="font-mono font-bold text-[#0A2957]">{s.serial}</span>
                          <span className="text-slate-500 ml-2">Ubicación: {s.location}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-700 font-mono">Garantía hasta: {s.warrantyExpiration}</span>
                          <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                            {s.autoclaveCycles} ciclos autoclave
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Transferencia a Consignación */}
      {showConsignmentModal && consignmentTargetProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-[#0B1320]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-[#0A2957]" />
                <h3 className="text-base font-bold text-[#0A2957]">Transferir a Consignación</h3>
              </div>
              <button
                onClick={() => setShowConsignmentModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-black hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConsignmentTransfer} className="mt-4 space-y-4 text-sm">
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <span className="font-mono text-[#0A2957] font-bold">{consignmentTargetProduct.sku}</span>
                <p className="font-bold text-black">{consignmentTargetProduct.name}</p>
                <p className="text-slate-600">
                  Stock disponible en Bodega Central: <strong className="text-black font-mono">{consignmentTargetProduct.stockPhysical} piezas</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hospital o Clínica Destino</label>
                <select
                  value={transferHospital}
                  onChange={(e) => setTransferHospital(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0A2957]/30 text-[#0B1320]"
                >
                  <option value="Hospital Ángeles Pedregal">Hospital Ángeles Pedregal (Torre CEyE)</option>
                  <option value="Centro Médico ABC Santa Fe">Centro Médico ABC Santa Fe</option>
                  <option value="Hospital Español CDMX">Hospital Español CDMX</option>
                  <option value="Clínica Lomas Altas">Clínica Lomas Altas</option>
                  <option value="Hospital San Ángel Inn Sur">Hospital San Ángel Inn Sur</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cantidad de Piezas a Enviar</label>
                <input
                  type="number"
                  min="1"
                  max={consignmentTargetProduct.stockPhysical}
                  value={transferQuantity}
                  onChange={(e) => setTransferQuantity(parseInt(e.target.value) || 1)}
                  className="w-full p-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0A2957]/30 text-[#0B1320]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConsignmentModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#0A2957] hover:bg-[#071c3c] rounded-xl shadow-xs"
                >
                  Confirmar Transferencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Registrar Nuevo Insumo */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-[#0B1320] my-8 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#0A2957]">Registrar Nuevo Insumo Quirúrgico</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-black hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Código SKU</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. LMX-GRASP-533"
                    value={newProd.sku || ''}
                    onChange={(e) => setNewProd({ ...newProd, sku: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Marca</label>
                  <select
                    value={newProd.brand || 'Laparoscopic MX'}
                    onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Laparoscopic MX">Laparoscopic MX</option>
                    <option value="Karl Storz">Karl Storz</option>
                    <option value="Ethicon">Ethicon</option>
                    <option value="Medtronic">Medtronic</option>
                    <option value="Boston Scientific">Boston Scientific</option>
                    <option value="ASP Johnson & Johnson">ASP Johnson & Johnson (Cidex)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre Comercial del Instrumental</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Pinza Laparoscópica Grasper Maryland 5mm x 33cm"
                  value={newProd.name || ''}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoría</label>
                  <select
                    value={newProd.category || 'instrumental_laparoscopico'}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value as ProductCategory })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="instrumental_laparoscopico">Instrumental Laparoscópico</option>
                    <option value="opticas_y_lentes">Ópticas y Lentes</option>
                    <option value="trocares_y_acceso">Trocares y Acceso</option>
                    <option value="grapado_y_sutura">Grapado y Sutura</option>
                    <option value="mallas_y_biomateriales">Mallas Quirúrgicas</option>
                    <option value="soluciones_y_esterilizacion">Soluciones y Esterilización</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Modelo</label>
                  <input
                    type="text"
                    placeholder="ej. MX-M533-ISO"
                    value={newProd.model || ''}
                    onChange={(e) => setNewProd({ ...newProd, model: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Especificaciones Técnicas */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
                <span className="font-bold text-[#0A2957] block">Especificaciones Técnicas</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-500">Calibre</label>
                    <input
                      type="text"
                      placeholder="5mm, 10mm"
                      value={newProd.specifications?.diameter || ''}
                      onChange={(e) =>
                        setNewProd({
                          ...newProd,
                          specifications: { ...newProd.specifications, diameter: e.target.value },
                        })
                      }
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500">Longitud</label>
                    <input
                      type="text"
                      placeholder="33cm, 43cm"
                      value={newProd.specifications?.length || ''}
                      onChange={(e) =>
                        setNewProd({
                          ...newProd,
                          specifications: { ...newProd.specifications, length: e.target.value },
                        })
                      }
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500">Ángulo (si aplica)</label>
                    <input
                      type="text"
                      placeholder="0°, 30°, 45°"
                      value={newProd.specifications?.angle || ''}
                      onChange={(e) =>
                        setNewProd({
                          ...newProd,
                          specifications: { ...newProd.specifications, angle: e.target.value },
                        })
                      }
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Precios y Costos */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Precio de Lista ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProd.priceList || 0}
                    onChange={(e) => setNewProd({ ...newProd, priceList: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Precio Distribuidor ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProd.priceDistributor || 0}
                    onChange={(e) => setNewProd({ ...newProd, priceDistributor: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Costo Adquisición ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProd.costAcquisition || 0}
                    onChange={(e) => setNewProd({ ...newProd, costAcquisition: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Stock inicial y alerta */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Inicial Bodega Central</label>
                  <input
                    type="number"
                    value={newProd.stockPhysical || 0}
                    onChange={(e) => setNewProd({ ...newProd, stockPhysical: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alerta Stock Mínimo</label>
                  <input
                    type="number"
                    value={newProd.minStockAlert || 5}
                    onChange={(e) => setNewProd({ ...newProd, minStockAlert: parseInt(e.target.value) || 5 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
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
                  Guardar en Catálogo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
