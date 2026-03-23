import db from "../db.js"; // your existing MySQL pool

export async function faqFallback(message) {
  const text = message.toLowerCase();

  const [rows] = await db.query(
    "SELECT keywords, reply FROM faqs WHERE active = 1",
  );

  for (const row of rows) {
    const keywords = row.keywords.split(",").map((k) => k.trim().toLowerCase());

    if (keywords.some((k) => text.includes(k))) {
      return row.reply;
    }
  }

  return (
    "I am an Infratech Malawi Ltd Artificial Intelligence (A.I) assistant. " +
    "I can help with our services, contacts, or general company information. 😊 " +
    "You may also email us at 📧 admin@infratechmw.com"
  );
}
