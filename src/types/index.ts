export type Role = 'admin' | 'surgeon' | 'hospital' | 'distributor';

export type ProductCategory = 
  | 'instrumental_laparoscopico'
  | 'opticas_y_lentes'
  | 'trocares_y_acceso'
  | 'grapado_y_sutura'
  | 'mallas_y_biomateriales'
  | 'soluciones_y_esterilizacion'
  | 'equipos_y_torres';

export interface LotInfo {
  lotNumber: string;
  expirationDate: string; // YYYY-MM-DD
  quantity: number;
  sterile: boolean;
}

export interface SerialNumber {
  serial: string;
  purchaseDate: string;
  warrantyExpiration: string;
  autoclaveCycles: number;
  status: 'disponible' | 'en_quirofano' | 'en_mantenimiento';
  location: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  commercialName: string;
  brand: string; // ej. Laparoscopic MX, Karl Storz, Ethicon, Boston Scientific, Medtronic
  category: ProductCategory;
  model: string;
  description: string;
  specifications: {
    diameter?: string; // ej. 5mm, 10mm
    length?: string; // ej. 33cm, 43cm bariatrico
    angle?: string; // ej. 0°, 30°, 45°
    autoclavable?: boolean;
    usage?: 'reutilizable' | 'desechable';
  };
  imageUrl: string;
  stockPhysical: number; // Bodega central
  stockConsignment: number; // En hospitales o demo
  consignmentLocations?: { hospitalName: string; quantity: number }[];
  minStockAlert: number;
  priceList: number; // Precio de lista al público (MXN)
  priceDistributor: number; // Precio distribuidor (MXN)
  costAcquisition: number; // Costo adquisición proveedor (MXN)
  currency: 'MXN' | 'USD';
  lots?: LotInfo[];
  serials?: SerialNumber[];
}

export type ClientType = 'cirujano_particular' | 'hospital_clinica' | 'clinica_corta_estancia' | 'subdistribuidor';

export interface Client {
  id: string;
  name: string;
  contactPerson: string;
  type: ClientType;
  specialty?: string; // ej. Cirugía General, Cirugía Bariátrica, Ginecología, Urología
  phone: string;
  whatsapp: string;
  email: string;
  taxId?: string; // RFC
  deliveryAddress: string;
  preferredHospital?: string;
  creditLimit: number;
  creditDays: number;
  balanceDue: number; // Saldo pendiente
  frequentProducts: string[]; // SKU list
  createdAt: string;
}

export interface ReceivablePayment {
  id: string;
  clientId: string;
  clientName: string;
  concept: string; // ej. Cotización COT-2026-042 o Factura F-819
  totalAmount: number;
  paidAmount: number;
  balance: number;
  dueDate: string;
  status: 'pendiente' | 'parcial' | 'pagado' | 'vencido';
  notes?: string;
}

export interface QuoteItem {
  productId: string;
  productName: string;
  sku: string;
  brand: string;
  specifications: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  total: number;
}

export interface Quote {
  id: string;
  folio: string; // ej. COT-2026-089
  clientId: string;
  clientName: string;
  clientSpecialty?: string;
  clientAddress: string;
  clientPhone: string;
  clientEmail: string;
  createdAt: string;
  validUntil: string;
  status: 'borrador' | 'enviada' | 'aprobada' | 'facturada' | 'rechazada';
  priceType: 'lista' | 'distribuidor';
  items: QuoteItem[];
  subtotal: number;
  discountTotal: number;
  taxIva: number; // 16%
  total: number;
  surgicalNotes: string;
  deliveryTerms: string;
}

export interface Provider {
  id: string;
  name: string;
  brandRepresented: string; // ej. Karl Storz, Medtronic, Laparoscopic MX
  contactName: string;
  email: string;
  phone: string;
  taxId?: string; // RFC o Tax ID
  bankAccount?: string; // CLABE o Cuenta
  estimatedDeliveryDays?: number; // Días de entrega
  origin: 'nacional' | 'importado';
  country: string;
  currency: 'MXN' | 'USD';
  paymentTerms: string;
  rating: number;
}

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitCost: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  folio: string; // ej. OC-2026-112
  providerId: string;
  providerName: string;
  orderDate: string;
  expectedDate: string;
  currency: 'USD' | 'MXN';
  exchangeRate?: number; // si es USD
  items: PurchaseOrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  status: 'en_preparacion' | 'en_transito' | 'en_aduana' | 'recibido';
  trackingNumber?: string;
  carrier?: string;
  receivedAt?: string;
}

export interface PayableAccount {
  id: string;
  providerId: string;
  providerName: string;
  invoiceFolio: string;
  amount: number;
  currency: 'USD' | 'MXN';
  exchangeRate: number;
  dueDate: string;
  status: 'pendiente' | 'pagado' | 'vencido';
}

export interface SurgerySchedule {
  id: string;
  procedureName: string; // ej. Colecistectomía Laparoscópica, Bypass Gástrico
  hospitalName: string;
  operatingRoom: string; // ej. Quirófano 3
  surgeonName: string;
  surgeonPhone: string;
  dateTime: string; // ISO string
  requiredItems: {
    name: string;
    quantity: number;
    delivered: boolean;
  }[];
  deliveryStatus: 'pendiente' | 'en_ruta' | 'entregado_en_quirofano';
  courierInfo?: {
    carrier: string; // ej. Mensajería Xcope, DHL Express, Estafeta
    trackingNumber: string;
    driverName?: string;
  };
  whatsappReminderSent: boolean;
  notes: string;
}
