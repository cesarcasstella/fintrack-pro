# ADR-003: WhatsApp Integration Strategy

## Status
Accepted

## Date
2024-01-01

## Context

WhatsApp integration is a core differentiator for FinTrack Pro in the LATAM market. Requirements:

1. **Easy expense logging**: "Almuerzo 25000" → creates expense
2. **Natural language**: Support Spanish conversational input
3. **Quick responses**: <3 second response time
4. **Reliability**: Messages must not be lost
5. **Cost-effective**: Manageable costs at scale

## Decision

We will use **Twilio WhatsApp Business API** with **Claude Haiku** for NLP parsing.

### Architecture

```
User WhatsApp → Twilio → Webhook → Parser (Claude) → Database → Response
     ↑                                                              |
     └──────────────────── TwiML Response ──────────────────────────┘
```

### Message Flow

1. User sends message to WhatsApp number
2. Twilio receives and forwards to webhook
3. Webhook validates Twilio signature
4. Parser extracts intent and entities
5. Business logic processes request
6. Response sent via TwiML

### NLP Parser Design

**Claude Haiku Prompt:**
```
Extract financial information from this Spanish message.
Return JSON with: intent, amount, category, description.

Intents: expense, income, balance_query, summary_query, help

Message: "{user_message}"
```

**Example Parsing:**
| Message | Intent | Amount | Category | Description |
|---------|--------|--------|----------|-------------|
| "Almuerzo 25000" | expense | 25000 | food | Almuerzo |
| "Uber 15k" | expense | 15000 | transport | Uber |
| "Ingreso 1.5M salario" | income | 1500000 | salary | salario |
| "Balance" | balance_query | - | - | - |
| "Cuanto gaste en comida?" | summary_query | - | food | - |

### Category Inference

```typescript
const categoryKeywords = {
  food: ['almuerzo', 'cena', 'desayuno', 'comida', 'restaurante', 'cafe'],
  transport: ['uber', 'didi', 'taxi', 'bus', 'metro', 'gasolina'],
  utilities: ['luz', 'agua', 'gas', 'internet', 'telefono'],
  entertainment: ['cine', 'netflix', 'spotify', 'juego'],
  shopping: ['ropa', 'zapatos', 'amazon', 'mercado'],
};
```

## Implementation

### Webhook Handler

```typescript
// app/api/webhooks/whatsapp/route.ts
export async function POST(request: Request) {
  // 1. Validate Twilio signature
  const signature = request.headers.get('x-twilio-signature');
  if (!validateTwilioSignature(signature, body)) {
    return new Response('Unauthorized', { status: 401 });
  }

  // 2. Parse message
  const { From, Body, MessageSid } = parseFormData(body);

  // 3. Find or create user
  const user = await findOrCreateUserByPhone(From);

  // 4. Log incoming message
  await logWhatsAppMessage({ userId: user.id, body: Body, sid: MessageSid });

  // 5. Parse intent with Claude
  const parsed = await parseMessage(Body);

  // 6. Process based on intent
  let response: string;
  switch (parsed.intent) {
    case 'expense':
      const tx = await createTransaction(user.id, parsed);
      response = `Gasto registrado: ${parsed.description} $${formatNumber(parsed.amount)}`;
      break;
    case 'balance_query':
      const balances = await getAccountBalances(user.id);
      response = formatBalances(balances);
      break;
    // ... other intents
  }

  // 7. Return TwiML response
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
     <Response><Message>${response}</Message></Response>`,
    { headers: { 'Content-Type': 'text/xml' } }
  );
}
```

### Claude Integration

```typescript
// lib/whatsapp/parser.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

export async function parseMessage(message: string) {
  const response = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 200,
    messages: [{
      role: 'user',
      content: `Parse this Spanish financial message and return JSON:
        Message: "${message}"

        Return: { intent, amount, category, description }
        Intents: expense, income, balance_query, summary_query, help`
    }]
  });

  return JSON.parse(response.content[0].text);
}
```

## Alternatives Considered

### WhatsApp Provider
| Provider | Pros | Cons | Decision |
|----------|------|------|----------|
| Twilio | Reliable, good docs | Higher cost | **Selected** |
| Meta Direct | Lower cost | Complex approval | Future |
| Vonage | Alternative | Less documentation | Rejected |

### NLP Solution
| Solution | Pros | Cons | Decision |
|----------|------|------|----------|
| Claude Haiku | Fast, good Spanish | API cost | **Selected** |
| GPT-3.5 | Good accuracy | Slower, higher cost | Alternative |
| Regex | Free, fast | Limited flexibility | Hybrid |
| Wit.ai | Free | Requires training | Rejected |

## Cost Analysis

### Per-Message Cost
| Component | Cost |
|-----------|------|
| Twilio incoming | $0.005 |
| Twilio outgoing | $0.005 |
| Claude Haiku | ~$0.0001 |
| **Total** | ~$0.01/interaction |

### Monthly Projections
| Users | Messages/user | Total Messages | Cost |
|-------|---------------|----------------|------|
| 100 | 50 | 5,000 | $50 |
| 1,000 | 50 | 50,000 | $500 |
| 10,000 | 50 | 500,000 | $5,000 |

### Cost Mitigation
1. **Freemium limits**: 50 free messages/month
2. **Premium tier**: Unlimited for $5/month
3. **Regex fallback**: Use Claude only for complex messages
4. **Caching**: Cache common responses

## Consequences

### Positive
- Natural user experience
- High adoption in LATAM
- Competitive differentiator
- Works offline (messages queued)

### Negative
- Ongoing API costs
- Dependency on external services
- Response time varies
- WhatsApp policy compliance needed

### Risks and Mitigations
| Risk | Mitigation |
|------|------------|
| Twilio outage | Queue messages, retry logic |
| Claude errors | Fallback to regex parsing |
| High costs | Usage limits, premium tier |
| Spam abuse | Rate limiting, phone verification |

## Future Enhancements

1. **Voice messages**: Transcription + parsing
2. **Images**: Receipt scanning
3. **Rich messages**: Buttons, lists
4. **Proactive notifications**: Budget alerts
5. **Meta Direct API**: Lower costs at scale

## References
- [Twilio WhatsApp API](https://www.twilio.com/docs/whatsapp)
- [Claude API Documentation](https://docs.anthropic.com)
- [WhatsApp Business Policy](https://www.whatsapp.com/legal/business-policy)
