# FinTrack Pro - API Documentation

## Base URL

```
Production: https://fintrack.app/api
Staging: https://staging.fintrack.app/api
Local: http://localhost:3000/api
```

## Authentication

All API requests (except auth endpoints) require authentication via session cookie.

### Headers
```
Cookie: next-auth.session-token=<token>
Content-Type: application/json
```

---

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
```

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Login
```http
POST /auth/login
```

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

---

### Transactions

#### List Transactions
```http
GET /transactions
```

**Query Parameters**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 20, max: 100) |
| type | string | No | Filter by type: income, expense, transfer |
| account_id | uuid | No | Filter by account |
| category_id | uuid | No | Filter by category |
| start_date | date | No | Filter from date (YYYY-MM-DD) |
| end_date | date | No | Filter to date (YYYY-MM-DD) |
| search | string | No | Search in description |

**Response** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "expense",
      "amount": 25000,
      "description": "Almuerzo",
      "date": "2024-01-15",
      "category": {
        "id": "uuid",
        "name": "Alimentacion",
        "icon": "utensils"
      },
      "account": {
        "id": "uuid",
        "name": "Cuenta Corriente"
      },
      "source": "whatsapp",
      "created_at": "2024-01-15T12:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

#### Create Transaction
```http
POST /transactions
```

**Request Body**
```json
{
  "type": "expense",
  "amount": 25000,
  "description": "Almuerzo en restaurante",
  "date": "2024-01-15",
  "category_id": "uuid",
  "account_id": "uuid"
}
```

**Response** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "expense",
    "amount": 25000,
    "description": "Almuerzo en restaurante",
    "date": "2024-01-15",
    "category_id": "uuid",
    "account_id": "uuid",
    "created_at": "2024-01-15T12:30:00Z"
  }
}
```

#### Get Transaction
```http
GET /transactions/:id
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "expense",
    "amount": 25000,
    "description": "Almuerzo en restaurante",
    "date": "2024-01-15",
    "category": { ... },
    "account": { ... },
    "recurring_rule": null,
    "source": "web",
    "created_at": "2024-01-15T12:30:00Z",
    "updated_at": "2024-01-15T12:30:00Z"
  }
}
```

#### Update Transaction
```http
PUT /transactions/:id
```

**Request Body**
```json
{
  "amount": 30000,
  "description": "Almuerzo con colegas"
}
```

**Response** `200 OK`

#### Delete Transaction
```http
DELETE /transactions/:id
```

**Response** `204 No Content`

---

### Accounts

#### List Accounts
```http
GET /accounts
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Cuenta Corriente",
      "type": "checking",
      "balance": 1500000,
      "currency": "COP",
      "is_active": true
    }
  ]
}
```

#### Create Account
```http
POST /accounts
```

**Request Body**
```json
{
  "name": "Ahorros",
  "type": "savings",
  "initial_balance": 5000000,
  "currency": "COP"
}
```

---

### Categories

#### List Categories
```http
GET /categories
```

**Query Parameters**
| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | Filter by: income, expense |

**Response** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Alimentacion",
      "type": "expense",
      "icon": "utensils",
      "color": "#10B981",
      "budget_limit": 500000,
      "is_system": true
    }
  ]
}
```

---

### Dashboard

#### Get Dashboard Data
```http
GET /dashboard
```

**Query Parameters**
| Parameter | Type | Description |
|-----------|------|-------------|
| period | string | current_month, last_month, last_3_months, year |

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "balance_total": 2500000,
    "income_month": 4500000,
    "expenses_month": 2100000,
    "savings_rate": 53.3,
    "top_categories": [
      {
        "category": "Alimentacion",
        "amount": 650000,
        "percentage": 31
      }
    ],
    "monthly_trend": [
      {
        "month": "2024-01",
        "income": 4500000,
        "expenses": 2100000
      }
    ],
    "upcoming_bills": [
      {
        "description": "Arriendo",
        "amount": 1200000,
        "due_date": "2024-02-01"
      }
    ]
  }
}
```

---

### Projections

#### Get 12-Month Projection
```http
GET /projections
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "months": [
      {
        "month": "2024-02",
        "projected_income": 4500000,
        "projected_expenses": 2100000,
        "projected_balance": 4900000,
        "confidence": 0.85
      }
    ],
    "assumptions": {
      "income_growth": 0,
      "expense_inflation": 0.005,
      "recurring_income": 4500000,
      "recurring_expenses": 1800000
    }
  }
}
```

#### Simulate Scenario
```http
POST /projections/simulate
```

**Request Body**
```json
{
  "scenario": "Que pasaria si compro un carro de 50 millones a 48 cuotas?",
  "parsed": {
    "type": "loan",
    "amount": 50000000,
    "installments": 48,
    "monthly_payment": 1250000
  }
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "baseline": { ... },
    "simulated": { ... },
    "impact": {
      "monthly_savings_reduction": 1250000,
      "savings_rate_new": 25.5,
      "months_to_break_even": 48,
      "recommendation": "Con este credito tu tasa de ahorro bajaria del 53% al 25%. Considera un plazo mas largo para reducir la cuota mensual."
    }
  }
}
```

---

### WhatsApp Webhook

#### Receive Message
```http
POST /webhooks/whatsapp
```

**Request Body** (Twilio format)
```
From=whatsapp:+573001234567
Body=Almuerzo 25000
MessageSid=SM123...
```

**Response** `200 OK`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Gasto registrado: Almuerzo $25,000 en Alimentacion. Balance: $2,475,000</Message>
</Response>
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El monto debe ser mayor a 0",
    "details": [
      {
        "field": "amount",
        "message": "Must be a positive number"
      }
    ]
  }
}
```

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| Authentication | 10 req/min |
| API (authenticated) | 100 req/min |
| WhatsApp webhook | 60 req/min |

---

## Webhooks

### WhatsApp Message Format

Messages are parsed using NLP (Claude Haiku):

| Message | Parsed As |
|---------|-----------|
| "Almuerzo 25000" | Expense: $25,000, Category: Food |
| "Ingreso 1500000 salario" | Income: $1,500,000, Category: Salary |
| "Balance" | Query: Account balances |
| "Resumen" | Query: Monthly summary |
| "Uber 15000" | Expense: $15,000, Category: Transport |

### Supported Commands
- `[descripcion] [monto]` - Register expense
- `ingreso [monto] [descripcion]` - Register income
- `balance` - Get account balances
- `resumen` - Get monthly summary
- `categorias` - List categories
- `ayuda` - Help message
