export type CaseItem = {
  id: string;
  sector: string;
  company_size: string;
  employees: number;
  pain: string;
  solution: string;
  impact_time: string;
  impact_detail: string;
  payback_weeks: number;
  visible: boolean;
  investment?: number;
  savings_annual?: number;
};

const cases: CaseItem[] = [
  {
    id: "caso-001",
    sector: "Logística",
    company_size: "8M€",
    employees: 45,
    pain: "42.000€/año verificando albaranes en papel",
    solution: "OCR + flujo automático a ERP",
    impact_time: "+35 h/semana liberadas del equipo administrativo",
    impact_detail: "≈ 0,8 jornada completa",
    payback_weeks: 6,
    investment: 4200,
    savings_annual: 52000,
    visible: true,
  },
  {
    id: "caso-002",
    sector: "Agencia Marketing",
    company_size: "12M€",
    employees: 60,
    pain: "Factura AWS 8,5K€/mes sin control",
    solution: "Rightsizing + Reserved Instances",
    impact_time: "+25 h/mes liberadas en análisis manual de costes",
    impact_detail: "Visibilidad diaria de la factura cloud",
    payback_weeks: 4,
    investment: 3100,
    savings_annual: 38000,
    visible: true,
  },
  {
    id: "caso-003",
    sector: "Fabricante Industrial",
    company_size: "25M€",
    employees: 120,
    pain: "Forecasting de demanda falla un 30%",
    solution: "ML predicción + alertas automáticas",
    impact_time: "−40 h/mes en rehacer planes de producción",
    impact_detail: "Menos urgencias y cambios de turno de última hora",
    payback_weeks: 5,
    investment: 5800,
    savings_annual: 47000,
    visible: true,
  },
  {
    id: "caso-004",
    sector: "Farmacéutica",
    company_size: "15M€",
    employees: 80,
    pain: "Validación de lotes manual: 18h/semana en documentación y trazabilidad",
    solution: "OCR + IA para clasificación automática de documentos de lote y alertas de compliance",
    impact_time: "+18 h/semana liberadas del equipo de calidad",
    impact_detail: "Trazabilidad y alertas automáticas de incumplimiento",
    payback_weeks: 7,
    investment: 7200,
    savings_annual: 52000,
    visible: true,
  },
  {
    id: "caso-005",
    sector: "Retail e-commerce",
    company_size: "22M€",
    employees: 95,
    pain: "Inventario desincronizado genera 12% de pérdidas por roturas o exceso de stock",
    solution: "Integración automática ERP ↔ e-commerce + alertas de reposición predictivas",
    impact_time: "−10 h/semana en ajustes manuales y reclamaciones",
    impact_detail: "Reducción de roturas y sobrestock con alertas anticipadas",
    payback_weeks: 4,
    investment: 5800,
    savings_annual: 68000,
    visible: true,
  },
  // Internos (solo chatbot)
  {
    id: "caso-006",
    sector: "Restauración",
    company_size: "3M€",
    employees: 35,
    pain: "Planificación de turnos manual causa 15% de sobrecostes en personal",
    solution: "Predicción de demanda + optimización automática de turnos",
    impact_time: "−12 h/semana en cuadrar turnos",
    impact_detail: "Mejor reparto de horas y menos horas extras",
    payback_weeks: 8,
    investment: 4500,
    savings_annual: 28000,
    visible: false,
  },
  {
    id: "caso-007",
    sector: "Clínicas privadas",
    company_size: "6M€",
    employees: 42,
    pain: "No-shows 18% de citas + gestión manual de recordatorios consume 12h/semana",
    solution: "Recordatorios automáticos WhatsApp + relleno inteligente de huecos",
    impact_time: "+12 h/semana liberadas de backoffice",
    impact_detail: "No-shows bajan al 8% con recordatorios y reasignación rápida",
    payback_weeks: 5,
    investment: 3200,
    savings_annual: 35000,
    visible: false,
  },
  {
    id: "caso-008",
    sector: "Servicios profesionales",
    company_size: "4M€",
    employees: 25,
    pain: "Partes de trabajo y facturación manual: 8h/semana + errores 5%",
    solution: "Automatización partes → ERP → facturación con validación automática",
    impact_time: "−8 h/semana en administración",
    impact_detail: "Menos errores de facturación y cobro más rápido",
    payback_weeks: 9,
    investment: 5200,
    savings_annual: 31000,
    visible: false,
  },
  {
    id: "caso-009",
    sector: "Consultoría IT",
    company_size: "7M€",
    employees: 38,
    pain: "Reporting semanal a clientes consume 14h + datos desactualizados",
    solution: "Dashboard en tiempo real con métricas automáticas por proyecto",
    impact_time: "−14 h/semana en reporting manual",
    impact_detail: "Clientes con visibilidad diaria sin pedir reportes",
    payback_weeks: 7,
    investment: 6100,
    savings_annual: 42000,
    visible: false,
  },
];

export const CASOS_MVP = cases;
export const CASOS_VISIBLES = cases.filter((caso) => caso.visible);
