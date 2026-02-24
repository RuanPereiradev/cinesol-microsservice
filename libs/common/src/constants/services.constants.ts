export const SERVICES = {
    API_GATEWAY: 'api-gateway',
    AUTH_SERVICE: 'auth-service',
    CATALOG_SERVICE: 'catalog-service',
    BOOKING_SERVICE: 'booking-service',
    PAYMENT_SERVICE: 'payment-service',
    NOTIFICATION_SERVICE: 'notification-service'
} as const;

export const SERVICES_PORTS = {
    API_GATEWAY: 3000,
    AUTH_SERVICE: 3001,
    CATALOG_SERVICE: 3002,
    BOOKING_SERVICE: 3003,
    PAYMENT_SERVICE: 3004,
    NOTIFICATION_SERVICE: 3005
} as const;