import { Client, PayableAccount, Product, Provider, PurchaseOrder, Quote, ReceivablePayment, SurgerySchedule } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    sku: 'LMX-GRASP-533',
    name: 'Pinza Laparoscópica Grasper Maryland 5mm x 33cm',
    commercialName: 'Maryland Grasper Dismountable Monopolar',
    brand: 'Laparoscopic MX',
    category: 'instrumental_laparoscopico',
    model: 'MX-M533-ISO',
    description: 'Pinza disectora Maryland curva 5mm con mango ergonómico rotatorio 360°, puerto luer lock para limpieza y conector monopolar para electrocirugía.',
    specifications: {
      diameter: '5 mm',
      length: '33 cm',
      autoclavable: true,
      usage: 'reutilizable',
    },
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60',
    stockPhysical: 18,
    stockConsignment: 6,
    consignmentLocations: [
      { hospitalName: 'Hospital Ángeles Pedregal', quantity: 4 },
      { hospitalName: 'Centro Médico ABC Santa Fe', quantity: 2 },
    ],
    minStockAlert: 8,
    priceList: 7850,
    priceDistributor: 5900,
    costAcquisition: 3400,
    currency: 'MXN',
    serials: [
      { serial: 'SN-LMX-88910', purchaseDate: '2025-10-15', warrantyExpiration: '2026-10-15', autoclaveCycles: 28, status: 'disponible', location: 'Bodega Central - Rack A1' },
      { serial: 'SN-LMX-88911', purchaseDate: '2025-10-15', warrantyExpiration: '2026-10-15', autoclaveCycles: 42, status: 'en_quirofano', location: 'Hospital Ángeles - Quirófano 4' },
      { serial: 'SN-LMX-88912', purchaseDate: '2025-11-02', warrantyExpiration: '2026-11-02', autoclaveCycles: 14, status: 'disponible', location: 'Bodega Central - Rack A1' }
    ]
  },
  {
    id: 'prod-002',
    sku: 'KS-OPT-1030',
    name: 'Telescopio Laparoscópico Hopkins II 10mm 30° Autoclavable',
    commercialName: 'Óptica Rígida Karl Storz 30 Grados',
    brand: 'Karl Storz',
    category: 'opticas_y_lentes',
    model: 'Hopkins II 26003BA',
    description: 'Lente laparoscópico de alta definición Full HD/4K con fibra óptica de transmisión de luz de alta densidad. Autoclavable hasta 134°C.',
    specifications: {
      diameter: '10 mm',
      length: '31 cm',
      angle: '30°',
      autoclavable: true,
      usage: 'reutilizable',
    },
    imageUrl: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=500&auto=format&fit=crop&q=60',
    stockPhysical: 3,
    stockConsignment: 2,
    consignmentLocations: [
      { hospitalName: 'Hospital Español CDMX', quantity: 2 },
    ],
    minStockAlert: 2,
    priceList: 145000,
    priceDistributor: 122000,
    costAcquisition: 89000,
    currency: 'MXN',
    serials: [
      { serial: 'KS-492019-MX', purchaseDate: '2025-06-10', warrantyExpiration: '2027-06-10', autoclaveCycles: 65, status: 'disponible', location: 'Caja Fuerte Instrumental - Almacén' },
      { serial: 'KS-492020-MX', purchaseDate: '2025-08-20', warrantyExpiration: '2027-08-20', autoclaveCycles: 31, status: 'en_quirofano', location: 'Hospital Español - Torre B' }
    ]
  },
  {
    id: 'prod-003',
    sku: 'ETH-BLT-1005',
    name: 'Trocar Óptico Bladeless Endopath XCEL 5mm x 100mm',
    commercialName: 'Trocar Estéril de Acceso Óptico 5mm',
    brand: 'Ethicon',
    category: 'trocares_y_acceso',
    model: 'B5LT',
    description: 'Trocar estéril con cánula estriada de fijación y punta óptica sin cuchilla para visualización directa de los planos tisulares.',
    specifications: {
      diameter: '5 mm',
      length: '100 mm',
      autoclavable: false,
      usage: 'desechable',
    },
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=60',
    stockPhysical: 48,
    stockConsignment: 24,
    consignmentLocations: [
      { hospitalName: 'Hospital Ángeles Pedregal', quantity: 12 },
      { hospitalName: 'Clínica Lomas Altas', quantity: 12 },
    ],
    minStockAlert: 20,
    priceList: 2450,
    priceDistributor: 1850,
    costAcquisition: 1150,
    currency: 'MXN',
    lots: [
      { lotNumber: 'LOT-ETH-2024-91B', expirationDate: '2027-03-31', quantity: 36, sterile: true },
      { lotNumber: 'LOT-ETH-2023-45C', expirationDate: '2026-11-15', quantity: 12, sterile: true },
    ]
  },
  {
    id: 'prod-004',
    sku: 'MED-ENDO-STP60',
    name: 'Grapadora Quirúrgica Endoscópica Articulable Tri-Staple 60mm',
    commercialName: 'Endo GIA Ultra Universal 60mm',
    brand: 'Medtronic',
    category: 'grapado_y_sutura',
    model: 'EGIAUSTND',
    description: 'Engrapadora lineal cortante endoscópica con articulación de hasta 45 grados. Compatible con recargas Tri-Staple moradas, bronce y verdes.',
    specifications: {
      length: '60 mm',
      usage: 'reutilizable',
      autoclavable: true,
    },
    imageUrl: 'https://images.unsplash.com/photo-1583912267670-6575ad4e2098?w=500&auto=format&fit=crop&q=60',
    stockPhysical: 4,
    stockConsignment: 2,
    consignmentLocations: [
      { hospitalName: 'Centro Médico ABC Observatorio', quantity: 2 },
    ],
    minStockAlert: 3,
    priceList: 38900,
    priceDistributor: 31500,
    costAcquisition: 21800,
    currency: 'MXN',
    serials: [
      { serial: 'MDT-EGIA-221', purchaseDate: '2025-09-01', warrantyExpiration: '2026-09-01', autoclaveCycles: 19, status: 'disponible', location: 'Bodega Central - Anaquel Q' }
    ]
  },
  {
    id: 'prod-005',
    sku: 'BARD-MSH-1515',
    name: 'Malla Quirúrgica de Polipropileno Monofilamento 15 x 15 cm',
    commercialName: 'Malla para Plastía Inguinal y Ventral Marlex',
    brand: 'Boston Scientific / BD',
    category: 'mallas_y_biomateriales',
    model: '0112660',
    description: 'Malla no reabsorbible de alta resistencia tensil, microporosa, óptima incorporación fibroblástica y mínimo encogimiento tisular.',
    specifications: {
      diameter: '15 x 15 cm',
      autoclavable: false,
      usage: 'desechable',
    },
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60',
    stockPhysical: 25,
    stockConsignment: 10,
    consignmentLocations: [
      { hospitalName: 'Hospital Ángeles Pedregal', quantity: 6 },
      { hospitalName: 'Hospital San Ángel Inn Sur', quantity: 4 },
    ],
    minStockAlert: 15,
    priceList: 3200,
    priceDistributor: 2400,
    costAcquisition: 1420,
    currency: 'MXN',
    lots: [
      { lotNumber: 'LT-BD-89021', expirationDate: '2027-08-30', quantity: 20, sterile: true },
      { lotNumber: 'LT-BD-77114', expirationDate: '2026-10-20', quantity: 5, sterile: true }, // Próxima a caducar
    ]
  },
  {
    id: 'prod-006',
    sku: 'ASP-CDX-OPA38',
    name: 'Solución Desinfectante de Alto Nivel Cidex OPA 3.8 Litros',
    commercialName: 'Cidex OPA Ortoftalaldehído al 0.55%',
    brand: 'ASP Johnson & Johnson',
    category: 'soluciones_y_esterilizacion',
    model: 'CIDEX-20398',
    description: 'Solución química para desinfección de alto nivel de endoscopios, cámaras y laparoscopios sensibles al calor en solo 12 minutos a 20°C.',
    specifications: {
      length: '3.8 L',
      usage: 'desechable',
    },
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=60',
    stockPhysical: 14,
    stockConsignment: 4,
    minStockAlert: 10,
    priceList: 2150,
    priceDistributor: 1750,
    costAcquisition: 1100,
    currency: 'MXN',
    lots: [
      { lotNumber: 'CDX-2025-L98', expirationDate: '2026-12-15', quantity: 14, sterile: false },
    ]
  },
  {
    id: 'prod-007',
    sku: 'LMX-SCIS-533',
    name: 'Tijera Quirúrgica Laparoscópica Metzenbaum Curva 5mm x 33cm',
    commercialName: 'Tijera Metzenbaum Monopolar Dismountable',
    brand: 'Laparoscopic MX',
    category: 'instrumental_laparoscopico',
    model: 'MX-S533-ISO',
    description: 'Hojas micro-aserradas para corte de precisión con mínima dispersión térmica. Aislante de teflón de alto voltaje hasta 3kV.',
    specifications: {
      diameter: '5 mm',
      length: '33 cm',
      autoclavable: true,
      usage: 'reutilizable',
    },
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60',
    stockPhysical: 12,
    stockConsignment: 4,
    consignmentLocations: [
      { hospitalName: 'Hospital Español CDMX', quantity: 4 },
    ],
    minStockAlert: 6,
    priceList: 8200,
    priceDistributor: 6200,
    costAcquisition: 3600,
    currency: 'MXN',
    serials: [
      { serial: 'SN-LMX-77201', purchaseDate: '2025-11-10', warrantyExpiration: '2026-11-10', autoclaveCycles: 18, status: 'disponible', location: 'Bodega Central - Rack A2' }
    ]
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-001',
    name: 'Dr. Alejandro Morales Cisneros',
    contactPerson: 'Dr. Alejandro Morales / Lic. Mariana (Asistente)',
    type: 'cirujano_particular',
    specialty: 'Cirugía Bariátrica y Laparoscópica Avanzada',
    phone: '+52 55 4123 8920',
    whatsapp: '525541238920',
    email: 'dr.morales.bariatria@gmail.com',
    taxId: 'MOCA780412H81',
    deliveryAddress: 'Hospital Ángeles Pedregal, Torre de Especialidades Quirófano 4, Camino a Sta. Teresa 1055, Héroes de Padierna, CDMX',
    preferredHospital: 'Hospital Ángeles Pedregal',
    creditLimit: 120000,
    creditDays: 30,
    balanceDue: 24500,
    frequentProducts: ['LMX-GRASP-533', 'ETH-BLT-1005', 'MED-ENDO-STP60'],
    createdAt: '2024-03-12',
  },
  {
    id: 'cli-002',
    name: 'Hospital Ángeles Pedregal (Compras e Insumos)',
    contactPerson: 'Lic. Claudia Estrada / Ing. Biomédico Roberto Ruiz',
    type: 'hospital_clinica',
    specialty: 'Hospital Quirúrgico de Alta Especialidad',
    phone: '+52 55 5652 9911',
    whatsapp: '525556529911',
    email: 'compras.hospitalarias@angelespedregal.com.mx',
    taxId: 'HAP920311K22',
    deliveryAddress: 'Área de Almacén General de Insumos Quirúrgicos y CEyE, Camino a Sta. Teresa 1055, CDMX',
    preferredHospital: 'Hospital Ángeles Pedregal',
    creditLimit: 500000,
    creditDays: 45,
    balanceDue: 89400,
    frequentProducts: ['KS-OPT-1030', 'ETH-BLT-1005', 'BARD-MSH-1515', 'ASP-CDX-OPA38'],
    createdAt: '2023-08-01',
  },
  {
    id: 'cli-003',
    name: 'Dra. Sofía Valenzuela Prieto',
    contactPerson: 'Dra. Sofía Valenzuela',
    type: 'cirujano_particular',
    specialty: 'Ginecología y Laparoscopía Pélvica',
    phone: '+52 55 8920 1144',
    whatsapp: '525589201144',
    email: 'dra.sofiavalenzuela@ginecologia.org',
    taxId: 'VAPS820915TR3',
    deliveryAddress: 'Centro Médico ABC Santa Fe, Quirófano Ginecológico piso 2, Av. Carlos Graef Fernández 154, Cuajimalpa, CDMX',
    preferredHospital: 'Centro Médico ABC Santa Fe',
    creditLimit: 75000,
    creditDays: 15,
    balanceDue: 0,
    frequentProducts: ['LMX-GRASP-533', 'LMX-SCIS-533', 'ETH-BLT-1005'],
    createdAt: '2024-07-19',
  },
  {
    id: 'cli-004',
    name: 'Quirúrgica del Bajío S.A. de C.V.',
    contactPerson: 'Ing. Carlos Navarrete',
    type: 'subdistribuidor',
    specialty: 'Distribuidor Mayorista de Instrumental',
    phone: '+52 477 718 2099',
    whatsapp: '524777182099',
    email: 'carlos.navarrete@quirurgicabajio.com',
    taxId: 'QBA150821NN9',
    deliveryAddress: 'Blvd. Aeropuerto 1024, Col. San Carlos, León, Guanajuato',
    creditLimit: 250000,
    creditDays: 30,
    balanceDue: 62000,
    frequentProducts: ['LMX-GRASP-533', 'LMX-SCIS-533', 'BARD-MSH-1515'],
    createdAt: '2024-01-10',
  }
];

export const INITIAL_RECEIVABLES: ReceivablePayment[] = [
  {
    id: 'rec-001',
    clientId: 'cli-001',
    clientName: 'Dr. Alejandro Morales Cisneros',
    concept: 'Cotización Aprobada COT-2026-031 (Instrumental Laparoscópico)',
    totalAmount: 32500,
    paidAmount: 8000,
    balance: 24500,
    dueDate: '2026-10-15',
    status: 'parcial',
    notes: 'Anticipo del 25% recibido por transferencia. Saldo contra liquidación a 30 días.',
  },
  {
    id: 'rec-002',
    clientId: 'cli-002',
    clientName: 'Hospital Ángeles Pedregal',
    concept: 'Factura F-4421 (Lote Trocares Bladeless y Cidex OPA)',
    totalAmount: 89400,
    paidAmount: 0,
    balance: 89400,
    dueDate: '2026-10-25',
    status: 'pendiente',
    notes: 'Revisión en compras hospitalarias los días martes y jueves.',
  },
  {
    id: 'rec-003',
    clientId: 'cli-004',
    clientName: 'Quirúrgica del Bajío S.A. de C.V.',
    concept: 'Factura F-4390 (Pedido Mayorista Instrumental MX)',
    totalAmount: 92000,
    paidAmount: 30000,
    balance: 62000,
    dueDate: '2026-09-20', // Vencido
    status: 'vencido',
    notes: 'Recordatorio enviado por WhatsApp al Ing. Navarrete. Promesa de pago para este viernes.',
  }
];

export const INITIAL_QUOTES: Quote[] = [
  {
    id: 'quot-001',
    folio: 'COT-2026-042',
    clientId: 'cli-001',
    clientName: 'Dr. Alejandro Morales Cisneros',
    clientSpecialty: 'Cirugía Bariátrica y Laparoscópica Avanzada',
    clientAddress: 'Hospital Ángeles Pedregal, Quirófano 4, CDMX',
    clientPhone: '+52 55 4123 8920',
    clientEmail: 'dr.morales.bariatria@gmail.com',
    createdAt: '2026-09-26',
    validUntil: '2026-10-10',
    status: 'enviada',
    priceType: 'lista',
    items: [
      {
        productId: 'prod-001',
        productName: 'Pinza Laparoscópica Grasper Maryland 5mm x 33cm',
        sku: 'LMX-GRASP-533',
        brand: 'Laparoscopic MX',
        specifications: 'Calibre 5mm / Longitud 33cm / Reutilizable Autoclavable',
        quantity: 2,
        unitPrice: 7850,
        discountPercent: 5,
        total: 14915,
      },
      {
        productId: 'prod-003',
        productName: 'Trocar Óptico Bladeless Endopath XCEL 5mm x 100mm',
        sku: 'ETH-BLT-1005',
        brand: 'Ethicon',
        specifications: 'Calibre 5mm / Longitud 100mm / Estéril Desechable',
        quantity: 5,
        unitPrice: 2450,
        discountPercent: 0,
        total: 12250,
      }
    ],
    subtotal: 27165,
    discountTotal: 785,
    taxIva: 4346.4,
    total: 31511.4,
    surgicalNotes: 'Material reservado para procedimiento bariátrico en Ángeles Pedregal. Entrega directa en CEyE 1 hora antes de cirugía.',
    deliveryTerms: 'Entrega sin costo en quirófano de la CDMX. Garantía directa de 1 año en instrumental Laparoscopic MX.'
  }
];

export const INITIAL_PROVIDERS: Provider[] = [
  {
    id: 'prov-001',
    name: 'Karl Storz Endoscopia México S.A. de C.V.',
    brandRepresented: 'Karl Storz',
    contactName: 'Lic. Guillermo Mendoza',
    email: 'contacto@storz-mexico.com',
    phone: '+52 55 5280 4400',
    origin: 'importado',
    country: 'Alemania',
    currency: 'USD',
    paymentTerms: '30 días crédito neto',
    rating: 4.9,
  },
  {
    id: 'prov-002',
    name: 'Laparoscopic MX Fábrica e Instrumental Quirúrgico',
    brandRepresented: 'Laparoscopic MX',
    contactName: 'Ing. Fernando Barrientos',
    email: 'ventas.fabrica@laparoscopicmx.com',
    phone: '+52 55 5890 2211',
    origin: 'nacional',
    country: 'México',
    currency: 'MXN',
    paymentTerms: '15 días / 50% anticipo',
    rating: 4.8,
  },
  {
    id: 'prov-003',
    name: 'Johnson & Johnson Medical México (Ethicon / ASP)',
    brandRepresented: 'Ethicon / Cidex OPA',
    contactName: 'Lic. Patricia Arreola',
    email: 'pedidos.hospitales@jnjmed.com',
    phone: '+52 55 5263 7000',
    origin: 'importado',
    country: 'Estados Unidos',
    currency: 'USD',
    paymentTerms: '45 días crédito',
    rating: 4.7,
  }
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-001',
    folio: 'OC-2026-088',
    providerId: 'prov-002',
    providerName: 'Laparoscopic MX Fábrica e Instrumental Quirúrgico',
    orderDate: '2026-09-22',
    expectedDate: '2026-10-02',
    currency: 'MXN',
    items: [
      {
        productId: 'prod-001',
        productName: 'Pinza Laparoscópica Grasper Maryland 5mm x 33cm',
        sku: 'LMX-GRASP-533',
        quantity: 10,
        unitCost: 3400,
        total: 34000,
      },
      {
        productId: 'prod-007',
        productName: 'Tijera Quirúrgica Laparoscópica Metzenbaum Curva 5mm x 33cm',
        sku: 'LMX-SCIS-533',
        quantity: 8,
        unitCost: 3600,
        total: 28800,
      }
    ],
    subtotal: 62800,
    shippingCost: 850,
    total: 63650,
    status: 'en_transito',
    trackingNumber: 'EST-992104921',
    carrier: 'Estafeta Terrestre',
  },
  {
    id: 'po-002',
    folio: 'OC-2026-089',
    providerId: 'prov-001',
    providerName: 'Karl Storz Endoscopia México',
    orderDate: '2026-09-15',
    expectedDate: '2026-10-08',
    currency: 'USD',
    exchangeRate: 18.5,
    items: [
      {
        productId: 'prod-002',
        productName: 'Telescopio Laparoscópico Hopkins II 10mm 30° Autoclavable',
        sku: 'KS-OPT-1030',
        quantity: 2,
        unitCost: 4800, // USD
        total: 9600, // USD
      }
    ],
    subtotal: 9600,
    shippingCost: 350,
    total: 9950,
    status: 'en_aduana',
    trackingNumber: 'DHL-AIR-0029194',
    carrier: 'DHL Global Forwarding (Aduana AICM)',
  }
];

export const INITIAL_PAYABLES: PayableAccount[] = [
  {
    id: 'pay-001',
    providerId: 'prov-002',
    providerName: 'Laparoscopic MX Fábrica e Instrumental Quirúrgico',
    invoiceFolio: 'FAC-LMX-771',
    amount: 63650,
    currency: 'MXN',
    exchangeRate: 1,
    dueDate: '2026-10-18',
    status: 'pendiente',
  },
  {
    id: 'pay-002',
    providerId: 'prov-001',
    providerName: 'Karl Storz Endoscopia México',
    invoiceFolio: 'INV-KS-99021',
    amount: 9950,
    currency: 'USD',
    exchangeRate: 18.5,
    dueDate: '2026-10-25',
    status: 'pendiente',
  }
];

export const INITIAL_SURGERIES: SurgerySchedule[] = [
  {
    id: 'surg-001',
    procedureName: 'Colecistectomía Laparoscópica de 4 Puertos',
    hospitalName: 'Hospital Ángeles Pedregal',
    operatingRoom: 'Quirófano 4',
    surgeonName: 'Dr. Alejandro Morales Cisneros',
    surgeonPhone: '+52 55 4123 8920',
    dateTime: '2026-09-29T07:30:00', // Mañana temprano
    requiredItems: [
      { name: 'Pinza Laparoscópica Maryland 5mm', quantity: 1, delivered: true },
      { name: 'Trocar Óptico Bladeless 5mm x 100mm', quantity: 3, delivered: true },
      { name: 'Trocar Bladeless 10mm', quantity: 1, delivered: true },
      { name: 'Endoclics Titano Mediano-Grande', quantity: 2, delivered: false },
    ],
    deliveryStatus: 'en_ruta',
    courierInfo: {
      carrier: 'Mensajería Express Xcope',
      trackingNumber: 'XCP-RTE-CDMX-04',
      driverName: 'Javier Castillo (Móvil Quirúrgico)',
    },
    whatsappReminderSent: true,
    notes: 'Paciente con antecedente de colecistitis aguda. Entregar instrumental estéril directamente a la Enf. Instrumentista en Quirófano 4.',
  },
  {
    id: 'surg-002',
    procedureName: 'Plastía Inguinal Laparoscópica TEP Bilateral',
    hospitalName: 'Centro Médico ABC Santa Fe',
    operatingRoom: 'Quirófano 2',
    surgeonName: 'Dra. Sofía Valenzuela Prieto',
    surgeonPhone: '+52 55 8920 1144',
    dateTime: '2026-09-30T10:00:00',
    requiredItems: [
      { name: 'Malla Quirúrgica Polipropileno 15x15cm', quantity: 2, delivered: false },
      { name: 'Trocar Óptico 10mm', quantity: 1, delivered: false },
      { name: 'Tijera Metzenbaum Curva 5mm', quantity: 1, delivered: false },
    ],
    deliveryStatus: 'pendiente',
    courierInfo: {
      carrier: 'DHL Express',
      trackingNumber: 'DHL-889100234',
    },
    whatsappReminderSent: false,
    notes: 'Requerido lote con vigencia mayor a 2 años. Se requiere entrega previa a las 08:30 hrs en Almacén CEyE.',
  },
  {
    id: 'surg-003',
    procedureName: 'Demostración Técnica de Óptica Hopkins 4K con Comité de Compras',
    hospitalName: 'Hospital Español CDMX',
    operatingRoom: 'Auditorio Quirúrgico / Sala Demo',
    surgeonName: 'Dr. Roberto Galván (Jefe de Cirugía)',
    surgeonPhone: '+52 55 5255 9600',
    dateTime: '2026-10-02T13:00:00',
    requiredItems: [
      { name: 'Telescopio Laparoscópico Karl Storz 10mm 30° Demo', quantity: 1, delivered: false },
      { name: 'Cable de Fibra Óptica Alta Densidad', quantity: 1, delivered: false },
    ],
    deliveryStatus: 'pendiente',
    whatsappReminderSent: false,
    notes: 'Reunión comercial para licitación de renovación de torres laparoscópicas.',
  }
];

// Helper functions for LocalStorage Persistence
const STORAGE_PREFIX = 'xcope_app_';

export function getStoredData<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return defaultValue;
  }
}

export function setStoredData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}
