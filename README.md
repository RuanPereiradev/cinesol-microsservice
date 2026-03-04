# 🍿 CineSol: Microservices Cinema Platform

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/Apache%20Kafka-000000?style=for-the-badge&logo=apachekafka&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</p>

### O **CineSol** é uma solução robusta para gestão de cinemas e vendas de ingressos, utilizando arquitetura de microserviços para garantir escalabilidade e resiliência.

---

## 🏗️ Arquitetura do Sistema

O projeto utiliza **Domain-Driven Design (DDD)** e comunicação orientada a eventos.

### 🧩 Componentes Principais

| Serviço | Porta | Responsabilidade |
| :--- | :---: | :--- |
| **API Gateway** | `3000` | Roteamento, Autenticação e Validação de DTOs. |
| **Booking Service** | `3003` | Core de reservas, cálculos de preço e Seat Locks. |
| **Catalog Service** | `3001` | Gestão de Filmes, Salas e Sessões. |
| **Payment Service** | `3004` | Integração com gateways de pagamento. |



---

## 🛠️ Stack Tecnológica

* **Backend:** NestJS (Node.js)
* **Banco de Dados:** PostgreSQL & Prisma ORM
* **Mensageria:** Apache Kafka
* **Infra:** Docker & Docker Compose

---

## 🚀 Como Rodar

### 1. Infraestrutura
```bash
docker-compose up -d
```

### 2. Sincronização
```Bash
pnpm install
npx prisma migrate dev
npx prisma generate
```
### 3. Execução (Terminais Separados)

```Bash
pnpm run start:dev api-gateway
pnpm run start:dev booking-service
🎟️ Exemplo de Reserva (POST)
URL: http://localhost:3000/booking/register

JSON

{
  "userId": "2df172c2-acf3-4fc9-9929-9c46ecf0412d",
  "sessionId": "19b19f8d-43f8-4962-9952-03a41fa5940f",
  "seatIds": ["01f92170-6110-4d99-b2a1-4bdbbd01be05"],
  "ticketType": "MEIA",
  "basePrice": 40.0
}
```
# 🛡️ Regras de Negócio Implementadas
### ✅ Cálculo Automático: MEIA aplica 50% de desconto.

### ✅ Seat Locking: Bloqueio temporário de assento por 10 minutos para evitar duplicidade.

### ✅ Event-Driven: Emissão de evento booking.created via Kafka após sucesso.
<br>

# 📝 Documentação Adicional
### 👉 Cinesol.md


**Deseja que eu te ajude a criar o arquivo de variáveis de ambiente (`.env.example`) para o pessoal saber o que configurar?**