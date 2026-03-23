// faq.js
export const faqRules = [
  {
    keywords: ["services", "what do you do", "offer"],
    reply:
      "We provide IT infrastructure, systems support, and software development.",
  },
  {
    keywords: ["contact", "phone", "email"],
    reply:
      "You can contact us via email at admin@infratechmw.com or WhatsApp on +265 999 251 635.",
  },
  {
    keywords: ["location", "where", "based"],
    reply:
      "Infratech Malawi Limited is based in Blantyre, Malawi and serves clients locally and regionally.",
  },
  {
    keywords: ["hours", "working time"],
    reply: "Our working hours are Monday to Friday, 8:00 AM – 5:00 PM.",
  },
  {
    keywords: ["thanks", "thanks alot", "bye"],
    reply: "Happy to help 😊👍",
  },
];

export function faqFallback(message) {
  const text = message.toLowerCase();

  for (const rule of faqRules) {
    if (rule.keywords.some((k) => text.includes(k))) {
      return rule.reply;
    }
  }

  return "I am an Infratech Malawi Ltd Artificial Intelligence(A.I) assistant, i can help with our services, contacts, or general company information. Please ask or send us an email to admin@infratechmw.com for more details";
}
