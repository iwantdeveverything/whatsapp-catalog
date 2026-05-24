import { ProductSchema, type Product } from "@/lib/schemas";

const rawProducts = [
  {
    id: "zapatillas-running",
    name: "Zapatillas Running",
    description:
      "Zapatillas ultralivianas para correr, con amortiguación superior y suela antideslizante. Ideales para asfalto y trail.",
    price: 85000,
    images: [
      "https://placehold.co/800x800/1a1a2e/ffffff?text=Zapatillas+Running",
    ],
    category: "Calzado",
    contact: {
      whatsapp: "5491112345678",
      phone: "+541112345678",
    },
    isActive: true,
  },
  {
    id: "zapatos-cuero",
    name: "Zapatos de Cuero",
    description:
      "Zapatos de cuero legítimo cosidos a mano. Suela de goma natural. Disponibles en negro y marrón.",
    price: 120000,
    images: ["https://placehold.co/800x800/2d2d44/ffffff?text=Zapatos+Cuero"],
    category: "Calzado",
    contact: {
      whatsapp: "5491112345678",
    },
    isActive: true,
  },
  {
    id: "camisa-oxford",
    name: "Camisa Oxford",
    description:
      "Camisa Oxford de algodón egipcio, corte slim fit. Cuello con botones ocultos. Planchado permanente.",
    price: 45000,
    images: ["https://placehold.co/800x800/3a3a5c/ffffff?text=Camisa+Oxford"],
    category: "Ropa",
    contact: {
      whatsapp: "5491112345678",
      phone: "+541112345678",
    },
    isActive: true,
  },
  {
    id: "remera-algodon",
    name: "Remera Algodón Premium",
    description:
      "Remera de algodón peinado 30/1, tratamiento anti-pilling. Cuello rib acanalado, costura reforzada.",
    price: 18000,
    images: ["https://placehold.co/800x800/4a4a6e/ffffff?text=Remera+Algodon"],
    category: "Ropa",
    contact: {
      phone: "+541112345678",
    },
    isActive: true,
  },
  {
    id: "mochila-viajera",
    name: "Mochila Viajera 40L",
    description:
      "Mochila impermeable 40 litros con compartimento laptop acolchado, bolsillos organizadores y espalda transpirable.",
    price: 32000,
    images: ["https://placehold.co/800x800/5a5a80/ffffff?text=Mochila+Viajera"],
    category: "Accesorios",
    contact: {
      whatsapp: "5491112345678",
    },
    isActive: true,
  },
  {
    id: "gorro-invierno",
    name: "Gorro de Invierno",
    description:
      "Gorro tejido en lana merino con forro polar interior. Doble capa, ajuste universal.",
    price: 9500,
    images: ["https://placehold.co/800x800/6a6a92/ffffff?text=Gorro+Invierno"],
    category: "Accesorios",
    contact: {
      whatsapp: "5491112345678",
    },
    isActive: true,
  },
  {
    id: "servicio-disenio",
    name: "Servicio de Diseño Personalizado",
    description:
      "Diseño gráfico a medida: logos, branding, packaging. 3 revisiones incluidas. Entrega en 5 días hábiles.",
    price: "Consultar" as const,
    images: ["https://placehold.co/800x800/7a7aa4/ffffff?text=Disenio"],
    category: "Servicios",
    contact: {
      whatsapp: "5491112345678",
      phone: "+541112345678",
    },
    isActive: true,
  },
];

// Validate all products at module load time
export const products: Product[] = rawProducts.map((p) =>
  ProductSchema.parse(p),
);
