export const KAFKA_BROKER = process.env.KAFKA_BROKER ?? 'localhost:9092';
export const KAFKA_CLIENT_ID = 'cineapp';
export const KAFKA_CONSUMER_GROUP = 'cineapp-consumer';

//Kafka Topics
export const KAFKA_TOPICS = {

    //Auth events
    USER_REGISTERED: 'user.registered',
    USER_LOGIN: 'user.logged_in',
    USER_UPDATED: 'user.updated',
    USER_DELETED: 'user.deleted',
    PASSWORD_RESET_REQUESTED: 'user.password-reset-requested',

    //Fluxo de Pedidos/Reservas
    ORDER_CREATED: 'order.created',
    ORDER_CANCELLED: 'order.cancelled',

    //Catalog events
    CATALOG_MOVIE_ADD: 'catalog.movie.add',

    // Payment events
    PAYMENT_COMPLETED: 'payment.completed',
    PAYMENT_FAILED: 'payment.failed',
    PAYMENT_REFUNDED: 'payment.refunded',

    //Notification triggers
    SEND_EMAIL: 'notification.send-email',
    SEND_PUSH: 'notification.send-push'

} as const;

export type kafkaTopics = (typeof KAFKA_TOPICS)[keyof typeof KAFKA_TOPICS]
