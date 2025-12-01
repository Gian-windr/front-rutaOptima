export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_BASE_URL || "http://localhost:8080",
  ENDPOINTS: {
    AUTH: "/api/auth",
    CUSTOMERS: "/api/customers",
    VEHICLES: "/api/vehicles",
    ORDERS: "/api/orders",
    ROUTE_PLANS: "/api/route-plans",
  },
};
