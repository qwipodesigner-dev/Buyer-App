import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon, StatusBar } from '../../components/Icons';

// Qwipo Assist — support chatbot.
//
// The "smart" bits, in order of importance:
//  1. A ~1.8 s typing indicator sits in the transcript while the bot
//     "thinks", so replies don't land instantly and read robotic.
//  2. Most intents are multi-turn — instead of dumping a canned answer,
//     the bot asks a clarifying question first (which order, which
//     document, etc.), then answers using the buyer's specific choice.
//  3. A tiny per-flow state machine (`waitingFor`) routes the user's next
//     message to the right follow-up handler.

type Msg =
  | { id: string; role: 'user' | 'bot'; text: string; suggestions?: string[] }
  | { id: string; role: 'typing' };

type WaitingFor =
  | null
  | { flow: 'track-order' }
  | { flow: 'missing-order' }
  | { flow: 'missing-detail'; orderId: string }
  | { flow: 'wrong-order' }
  | { flow: 'damaged-order' }
  | { flow: 'cancel-order' }
  | { flow: 'return-order' }
  | { flow: 'return-item'; orderId: string }
  | { flow: 'refund-order' }
  | { flow: 'payment-order' }
  | { flow: 'credit-upgrade' }
  | { flow: 'kyc-doc' }
  | { flow: 'human-connect' };

const SUPPORT_PHONE = '+91 91212 22836';
const SUPPORT_EMAIL = 'info@qwipo.com';
const TYPING_MS = 1800;

// Small stub of the buyer's recent orders. Used by any flow that needs
// the buyer to pick an order before the bot can answer specifically.
const RECENT_ORDERS: Record<string, {
  id: string;
  seller: string;
  when: string;
  status: string;
  eta: string;
  item: string;
  amount: number;
}> = {
  '#QW-24312': {
    id: '#QW-24312',
    seller: 'Sri Sai Krishna Traders',
    when: 'Today',
    status: 'Out for delivery',
    eta: 'Today by 6:00 PM',
    item: 'Aashirvaad Atta 5 Kg × 12 pcs',
    amount: 3216,
  },
  '#QW-24289': {
    id: '#QW-24289',
    seller: 'Omkar Enterprise',
    when: '2 days ago',
    status: 'Delivered',
    eta: 'Delivered on Wed, 11:20 AM',
    item: 'Freedom Sunflower Oil 1 Ltr × 16 pcs',
    amount: 2640,
  },
  '#QW-24245': {
    id: '#QW-24245',
    seller: 'Qwipo Sellers (Wholesalers)',
    when: 'Last week',
    status: 'Delivered',
    eta: 'Delivered on Fri, 4:05 PM',
    item: 'Maggi 70 g × 24 pcs · Parle-G 800 g × 12 pcs',
    amount: 5498,
  },
};

const ORDER_CHIPS = Object.keys(RECENT_ORDERS);

const GREETING: Msg = {
  id: 'greet',
  role: 'bot',
  text: `Hi! I'm Qwipo Assist. I can help with orders, returns, payments, KYC, and delivery questions. What would you like help with today?`,
  suggestions: [
    'Where is my order?',
    'Return an item',
    'Payment failed',
    'KYC failed?',
    'Delivery options',
  ],
};

// Intent classifier — same shape as before. Each intent's `handle` runs
// after the typing delay and decides the bot's next message + waitingFor.
type BotReply = { text: string; suggestions?: string[]; waitingFor?: WaitingFor };

type Intent = {
  id: string;
  keywords: string[][];
  handle: (userText: string) => BotReply;
};

const askForOrder = (prompt: string, waitingFor: WaitingFor): BotReply => ({
  text: prompt,
  suggestions: [...ORDER_CHIPS, 'Type another order ID'],
  waitingFor,
});

const INTENTS: Intent[] = [
  {
    id: 'track',
    keywords: [['where', 'order'], ['track', 'order'], ['delivery', 'status'], ['when', 'arrive']],
    handle: () =>
      askForOrder(
        'Sure — which order would you like to track?',
        { flow: 'track-order' },
      ),
  },
  {
    id: 'missing',
    keywords: [['item', 'missing'], ['not', 'received'], ['short', 'delivered'], ['quantity', 'less']],
    handle: () =>
      askForOrder(
        "I'm sorry about that. Which order has the missing item?",
        { flow: 'missing-order' },
      ),
  },
  {
    id: 'wrong',
    keywords: [['wrong', 'item'], ['wrong', 'product'], ['different', 'delivered']],
    handle: () =>
      askForOrder(
        "Apologies for the mix-up. Which order received the wrong item?",
        { flow: 'wrong-order' },
      ),
  },
  {
    id: 'damaged',
    keywords: [['damaged'], ['broken'], ['leaking'], ['expired'], ['quality', 'issue']],
    handle: () =>
      askForOrder(
        "That's disappointing. Which order had the damaged product?",
        { flow: 'damaged-order' },
      ),
  },
  {
    id: 'cancel',
    keywords: [['cancel', 'order'], ['stop', 'delivery']],
    handle: () =>
      askForOrder(
        'Which order would you like to cancel?',
        { flow: 'cancel-order' },
      ),
  },
  {
    id: 'return',
    keywords: [['initiate', 'return'], ['start', 'return'], ['return', 'item'], ['return', 'order']],
    handle: () =>
      askForOrder(
        'Which order would you like to return?',
        { flow: 'return-order' },
      ),
  },
  {
    id: 'return-policy',
    keywords: [['return', 'policy'], ['return', 'window']],
    handle: () => ({
      text:
        'Distributor orders: 24-hour return window from delivery. Wholesaler orders: 48-hour window. Perishables & personal-care openings are non-returnable. Full policy at qwipo.com/returns.',
      suggestions: ['Initiate return', 'Refund timelines', 'Talk to a human'],
    }),
  },
  {
    id: 'refund-status',
    keywords: [['refund', 'status'], ['refund', 'when'], ['money', 'back']],
    handle: () =>
      askForOrder(
        'Which order or return would you like the refund status for?',
        { flow: 'refund-order' },
      ),
  },
  {
    id: 'refund-timelines',
    keywords: [['refund', 'timeline'], ['how', 'long', 'refund'], ['refund', 'time']],
    handle: () => ({
      text:
        'UPI / wallet: within 24 hours.\nDebit or credit card: 5-7 business days.\nQwipo Credit: instant.\n\nWhich refund method did you use?',
      suggestions: ['UPI / Wallet', 'Card', 'Qwipo Credit'],
    }),
  },
  {
    id: 'payment-failed',
    keywords: [['payment', 'failed'], ['payment', 'declined'], ['transaction', 'failed']],
    handle: () =>
      askForOrder(
        'Sorry about the failed payment. Which order was affected?',
        { flow: 'payment-order' },
      ),
  },
  {
    id: 'credit-limit',
    keywords: [['credit', 'limit'], ['increase', 'credit'], ['upgrade', 'credit']],
    handle: () => ({
      text:
        'Your current Qwipo Credit limit is ₹50,000 (₹37,500 available, ₹12,500 in use). Would you like to request an upgrade?',
      suggestions: ['Yes, request upgrade', 'How is the limit decided?', 'No thanks'],
      waitingFor: { flow: 'credit-upgrade' },
    }),
  },
  {
    id: 'net-terms',
    keywords: [['net', 'term'], ['invoice', 'due'], ['net-15'], ['net', '15']],
    handle: () => ({
      text:
        'Net-15 term invoices are auto-generated on the 1st and 16th of every month. Access them under Account → Invoices. Late payments accrue interest at 1.5% per month.',
      suggestions: ['Download latest invoice', 'Pay a due invoice', 'Talk to a human'],
    }),
  },
  {
    id: 'gst',
    keywords: [['gst', 'reconciliation'], ['gstr'], ['gst', 'report']],
    handle: () => ({
      text:
        'GSTR-2B reconciliation is available under Account → Invoices → GST Reports. Download monthly, quarterly, or annual reports as CSV or PDF.',
      suggestions: ['Monthly report', 'Quarterly report', 'Talk to a human'],
    }),
  },
  {
    id: 'kyc-general',
    keywords: [['business', 'kyc'], ['complete', 'kyc'], ['kyc', 'documents']],
    handle: () => ({
      text:
        'Business KYC requires four documents:\n• GSTIN certificate\n• Shop-and-Establishment certificate\n• PAN\n• Business address proof\n\nUpload under Account → KYC. Verification takes about 24 hours. Which one do you need help with?',
      suggestions: ['GSTIN', 'Address proof', 'PAN', 'Something else'],
      waitingFor: { flow: 'kyc-doc' },
    }),
  },
  {
    id: 'kyc-failed',
    keywords: [['kyc', 'failed'], ['kyc', 'pending'], ['kyc', 'rejected']],
    handle: () => ({
      text:
        'A KYC verification issue can usually be resolved quickly. Which document was flagged?',
      suggestions: ['GSTIN', 'Address proof', 'PAN', 'Something else'],
      waitingFor: { flow: 'kyc-doc' },
    }),
  },
  {
    id: 'gstin-update',
    keywords: [['gstin', 'update'], ['update', 'gst', 'number'], ['change', 'gst']],
    handle: () => ({
      text:
        'To update GSTIN: Account → Business Profile → Edit GSTIN. You will be asked to verify via OTP on your registered mobile number. The new GSTIN takes effect immediately.',
      suggestions: ['Change phone number', 'GST reports', 'Talk to a human'],
    }),
  },
  {
    id: 'address',
    keywords: [['add', 'address'], ['remove', 'address'], ['delivery', 'address'], ['change', 'address']],
    handle: () => ({
      text:
        'Manage delivery addresses under Account → Addresses. You can save up to 5 addresses and mark any one as the default for new orders.',
      suggestions: ['Add new address', 'Change default address', 'Talk to a human'],
    }),
  },
  {
    id: 'phone',
    keywords: [['change', 'phone'], ['change', 'mobile'], ['update', 'phone'], ['update', 'mobile']],
    handle: () => ({
      text:
        'To change your registered mobile: Account → Profile → Phone Number. You will need to verify OTPs on both the old and the new numbers.',
      suggestions: ['Update email', 'Talk to a human'],
    }),
  },
  {
    id: 'delivery-time',
    keywords: [['delivery', 'time'], ['delivery', 'slot'], ['beat', 'day'], ['tomorrow', 'delivery'], ['delivery', 'options']],
    handle: () => ({
      text:
        'Two delivery options per distributor:\n• Beat day (Friday for your route) — free delivery.\n• Tomorrow — free above the MOV, else ₹24 delivery fee.\n\nSelectable in the cart.',
      suggestions: ['What is MOV?', 'Change delivery date', 'Talk to a human'],
    }),
  },
  {
    id: 'mov',
    keywords: [['mov'], ['minimum', 'order'], ['min', 'order']],
    handle: () => ({
      text:
        'Every distributor sets a Minimum Order Value (MOV). Meeting the MOV is required to place an order and to qualify for free delivery on the Tomorrow slot.',
      suggestions: ['Delivery options', 'Suggest items to reach MOV', 'Talk to a human'],
    }),
  },
  {
    id: 'contact',
    keywords: [['contact', 'support'], ['human'], ['agent'], ['talk', 'human'], ['customer', 'care']],
    handle: () => ({
      text: `Sure — I'll connect you with our support team.\n\n📞 ${SUPPORT_PHONE} · 24/7\n✉️ ${SUPPORT_EMAIL}\n\nShould I place the call now?`,
      suggestions: ['Call support', 'Email support', 'Continue chatting'],
      waitingFor: { flow: 'human-connect' },
    }),
  },
];

function matchIntent(query: string): Intent | null {
  const q = query.toLowerCase();
  const tokens = new Set(q.split(/[^a-z0-9]+/).filter(Boolean));
  let best: { intent: Intent; score: number } | null = null;
  for (const intent of INTENTS) {
    for (const group of intent.keywords) {
      const matched = group.every((kw) => tokens.has(kw) || q.includes(kw));
      if (matched && (!best || group.length > best.score)) {
        best = { intent, score: group.length };
      }
    }
  }
  return best?.intent || null;
}

// Try to spot an order id in the user's message. Chips send the id
// verbatim; users typing free text usually paste "QW-24312" or "12345".
function findOrderId(text: string): string | null {
  const raw = text.toUpperCase();
  const match = raw.match(/#?QW-?\d{3,}/);
  if (match) {
    const norm = '#' + match[0].replace(/^#/, '').replace(/^QW/, 'QW-').replace('QW--', 'QW-');
    if (RECENT_ORDERS[norm]) return norm;
  }
  for (const id of ORDER_CHIPS) {
    if (raw.includes(id.toUpperCase())) return id;
  }
  return null;
}

// Follow-up handlers — routed via the current `waitingFor` state.
function handleFollowUp(text: string, waiting: WaitingFor): BotReply {
  if (!waiting) return { text: '' };
  const orderId = findOrderId(text);

  const needOrder = (askAgain: string): BotReply => ({
    text: askAgain,
    suggestions: [...ORDER_CHIPS, 'Cancel'],
    waitingFor: waiting,
  });

  switch (waiting.flow) {
    case 'track-order': {
      if (!orderId) return needOrder("I didn't catch that order id — please tap one of your recent orders below.");
      const o = RECENT_ORDERS[orderId];
      const nextSuggestions =
        o.status === 'Delivered'
          ? ['Report an issue', 'Reorder', 'Anything else?']
          : ['Contact delivery agent', 'Reschedule delivery', 'Change address'];
      return {
        text: `Order ${o.id} · ${o.seller}\n\n${o.status} — ${o.eta}.\nAmount: ₹${o.amount.toLocaleString('en-IN')}.\nItems: ${o.item}`,
        suggestions: nextSuggestions,
      };
    }
    case 'missing-order': {
      if (!orderId) return needOrder('Which order had the missing item? Tap one below.');
      return {
        text: `Got it — for ${orderId} (${RECENT_ORDERS[orderId].item}). Which item and quantity is missing?`,
        suggestions: ['Full item missing', 'Short by 1 pc', 'Short by more than 1 pc', 'Something else'],
        waitingFor: { flow: 'missing-detail', orderId },
      };
    }
    case 'missing-detail': {
      return {
        text: `Thanks. I've raised ticket #TKT-${Math.floor(Math.random() * 9000 + 1000)} for ${waiting.orderId}. Our team will reach out on your registered mobile within 24 hours. Refund or reshipment — whichever you prefer — will be processed after verification.`,
        suggestions: ['Prefer refund', 'Prefer reshipment', 'Anything else?'],
      };
    }
    case 'wrong-order': {
      if (!orderId) return needOrder('Which order got the wrong item?');
      return {
        text: `For ${orderId}, I've scheduled a pickup within 48 hours. Please keep the item in its original packaging. The correct SKU will dispatch as soon as pickup is confirmed.`,
        suggestions: ['Refund instead', 'Reschedule pickup', 'Anything else?'],
      };
    }
    case 'damaged-order': {
      if (!orderId) return needOrder('Which order had the damaged item?');
      return {
        text: `For ${orderId}, please attach a photo of the damaged item. Once received, we'll issue a full refund or replacement within 24 hours.`,
        suggestions: ['Attach photo', 'Prefer refund', 'Prefer replacement'],
      };
    }
    case 'cancel-order': {
      if (!orderId) return needOrder('Which order should I cancel?');
      const o = RECENT_ORDERS[orderId];
      if (o.status === 'Delivered') {
        return {
          text: `${orderId} has already been delivered, so cancellation isn't possible. You can still initiate a return within the return window.`,
          suggestions: ['Return this order', 'Talk to a human'],
        };
      }
      return {
        text: `${orderId} can be cancelled — the seller hasn't picked it up yet. No charges will apply. Confirm cancellation?`,
        suggestions: ['Yes, cancel', 'No, keep it'],
      };
    }
    case 'return-order': {
      if (!orderId) return needOrder('Which order would you like to return?');
      const o = RECENT_ORDERS[orderId];
      return {
        text: `${orderId} has ${o.item}. Which item would you like to return?`,
        suggestions: [o.item.split(' · ')[0], 'Full order', 'Something else'],
        waitingFor: { flow: 'return-item', orderId },
      };
    }
    case 'return-item': {
      return {
        text: `Return started for ${waiting.orderId}. Pickup scheduled within 48 hours. Refund is credited 3-5 business days after we receive the item.`,
        suggestions: ['Refund timelines', 'Anything else?'],
      };
    }
    case 'refund-order': {
      if (!orderId) return needOrder('For which order/return?');
      return {
        text: `Refund for ${orderId}: processed on Mon 2:14 PM. UPI credits show up within 24h. Please check with your bank if the amount hasn't landed yet.`,
        suggestions: ['Refund not received', 'Refund timelines', 'Talk to a human'],
      };
    }
    case 'payment-order': {
      if (!orderId) return needOrder('For which order did the payment fail?');
      return {
        text: `For ${orderId} — I see a failed UPI attempt at 11:42 AM. If your account was debited, the amount will auto-reverse within 24-48 hours. Would you like to retry payment now?`,
        suggestions: ['Retry with UPI', 'Retry with card', 'Use Qwipo Credit', 'Talk to a human'],
      };
    }
    case 'credit-upgrade': {
      if (/yes|upgrade/i.test(text)) {
        return {
          text: `Great. To process the upgrade, please upload the last 3 months of GST returns under Account → KYC → Credit Upgrade. Approval takes 24-48 hours.`,
          suggestions: ['Open KYC', 'How is the limit decided?', 'Anything else?'],
        };
      }
      if (/decid|how/i.test(text)) {
        return {
          text: `Credit limits are based on: your average monthly order value (30%), on-time repayment history (40%), GSTIN filing regularity (20%), and category mix (10%).`,
          suggestions: ['Request upgrade', 'Anything else?'],
        };
      }
      return {
        text: `No worries. Your credit stays at ₹50,000 for now. Anything else I can help with?`,
        suggestions: ['Delivery options', 'Refund status', 'No, thanks'],
      };
    }
    case 'kyc-doc': {
      const lower = text.toLowerCase();
      if (lower.includes('gst')) {
        return {
          text: `For GSTIN: make sure the certificate is a colour scan (not a screenshot), the GSTIN number matches your business profile, and the file is under 5 MB. Re-upload under Account → KYC → GSTIN.`,
          suggestions: ['Re-upload GSTIN', 'Talk to a human'],
        };
      }
      if (lower.includes('address') || lower.includes('shop')) {
        return {
          text: `For address proof: any of — Shop-and-Establishment cert, latest electricity bill (≤ 2 months), or a rent agreement. Make sure the business name and address are clearly visible.`,
          suggestions: ['Re-upload address', 'Talk to a human'],
        };
      }
      if (lower.includes('pan')) {
        return {
          text: `For PAN: upload a colour scan of the business PAN card. Individual PAN is accepted for proprietorships. Make sure the number and name are legible.`,
          suggestions: ['Re-upload PAN', 'Talk to a human'],
        };
      }
      return {
        text: `Best is to speak with our KYC team directly on ${SUPPORT_PHONE}. They'll walk you through what's needed.`,
        suggestions: ['Call support', 'Email support', 'Anything else?'],
      };
    }
    case 'human-connect': {
      if (/call/i.test(text)) {
        window.location.href = `tel:${SUPPORT_PHONE.replace(/\s/g, '')}`;
        return { text: 'Dialling now…' };
      }
      if (/email/i.test(text)) {
        window.location.href = `mailto:${SUPPORT_EMAIL}`;
        return { text: 'Opening email…' };
      }
      return {
        text: `No problem — I'm here. What else can I help with?`,
        suggestions: ['Where is my order?', 'Return an item', 'KYC failed?'],
      };
    }
  }
}

const FALLBACK: BotReply = {
  text: `Hmm, I couldn't find a clear answer for that. Would you like me to connect you with a support agent?\n\n📞 ${SUPPORT_PHONE} · ✉️ ${SUPPORT_EMAIL}`,
  suggestions: ['Call support', 'Email support', 'Talk to a human'],
};

export default function SupportChatScreen({ onBack, seed }: { onBack: () => void; seed?: string }) {
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState('');
  const [waitingFor, setWaitingFor] = useState<WaitingFor>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const seededRef = useRef(false);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (seed && !seededRef.current) {
      seededRef.current = true;
      setTimeout(() => send(seed), 400);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;

    // Handle the direct-action chips inline (no bot loop needed).
    if (/^call support$/i.test(text)) {
      window.location.href = `tel:${SUPPORT_PHONE.replace(/\s/g, '')}`;
      return;
    }
    if (/^email support$/i.test(text)) {
      window.location.href = `mailto:${SUPPORT_EMAIL}`;
      return;
    }
    if (/^(cancel|no,? thanks?|no thanks)$/i.test(text) && waitingFor) {
      setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', text }]);
      setInput('');
      setWaitingFor(null);
      // Small typing pause before the closing bot message.
      typingReply({ text: 'Okay, cancelled. Anything else I can help with?', suggestions: ['Where is my order?', 'Return an item', 'Payment failed'] });
      return;
    }

    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', text }]);
    setInput('');

    const reply = waitingFor
      ? handleFollowUp(text, waitingFor)
      : (matchIntent(text)?.handle(text) ?? FALLBACK);

    typingReply(reply);
  };

  const typingReply = (reply: BotReply) => {
    // Push the typing indicator immediately, then swap it for the real
    // bot bubble after the delay.
    const typingId = `t-${Date.now()}`;
    setMessages((prev) => [...prev, { id: typingId, role: 'typing' }]);
    setTimeout(() => {
      setMessages((prev) => {
        const next = prev.filter((m) => m.id !== typingId);
        return [
          ...next,
          {
            id: `b-${Date.now()}`,
            role: 'bot',
            text: reply.text,
            suggestions: reply.suggestions,
          },
        ];
      });
      setWaitingFor(reply.waitingFor === undefined ? null : reply.waitingFor);
    }, TYPING_MS);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const lastSuggestions = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m.role === 'bot' && m.suggestions?.length) return m.suggestions;
      if (m.role === 'typing') return [];
    }
    return [];
  }, [messages]);

  return (
    <>
      <StatusBar />
      <div className="screen-body support-chat-screen">
        <div className="top-bar">
          <button className="icon-btn" onClick={onBack} aria-label="Back">
            <Icon.Back />
          </button>
          <div className="top-title">
            <h1>Qwipo Assist</h1>
            <p>
              <span className="chat-online-dot" /> Usually replies in seconds
            </p>
          </div>
        </div>

        <div className="chat-body" ref={bodyRef}>
          {messages.map((m) => {
            if (m.role === 'typing') {
              return (
                <div key={m.id} className="chat-msg chat-msg-bot">
                  <div className="chat-avatar">Q</div>
                  <div className="chat-bubble chat-typing" aria-label="Bot is typing">
                    <span className="chat-typing-dot" />
                    <span className="chat-typing-dot" />
                    <span className="chat-typing-dot" />
                  </div>
                </div>
              );
            }
            return (
              <div key={m.id} className={`chat-msg chat-msg-${m.role}`}>
                {m.role === 'bot' && <div className="chat-avatar">Q</div>}
                <div className="chat-bubble">
                  {m.text.split('\n').map((line, i) => (
                    <div key={i}>{line || ' '}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {lastSuggestions.length > 0 && (
          <div className="chat-suggestions">
            {lastSuggestions.map((s) => (
              <button key={s} className="chat-chip" onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        <form className="chat-input-row" onSubmit={handleSubmit}>
          <input
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
          />
          <button
            type="submit"
            className="chat-send"
            aria-label="Send"
            disabled={!input.trim()}
          >
            <Icon.ChevronRight />
          </button>
        </form>
      </div>
    </>
  );
}
