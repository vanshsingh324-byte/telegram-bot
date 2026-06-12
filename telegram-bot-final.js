/**
 * TradingView -> Telegram Alert Bot
 * npm install express
 */

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.text({ type: "*/*" }));

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || "8780957629:AAGnaDHNW7FDnmvYorgp9coJugnXDsfIHcY";
const CHAT_ID        = process.env.CHAT_ID        || "1880567681";

async function sendTelegram(text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML" }),
  });
}

app.post("/alert", async (req, res) => {
  try {
    let body = req.body;
    let msg  = typeof body === "string" ? body : (body.message || JSON.stringify(body));
    const time = new Date().toLocaleString("en-GB", { timeZone: "Europe/Madrid" });
    await sendTelegram(`🔔 <b>TradingView Alert</b>\n\n${msg}\n\n🕒 ${time}`);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/", (req, res) => res.send("Bot is running ✅"));

app.get("/test", async (req, res) => {
  await sendTelegram("✅ <b>Test!</b>\nYour TradingView → Telegram bot is working!");
  res.send("Check Telegram!");
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Bot running on port ${PORT}`));
