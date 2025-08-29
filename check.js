// check.js
const axios = require("axios");
const https = require("https");

const URL =
  "https://www.citaconsular.es/de/hosteds/widgetdefault/2bac73d737f88b7858c01d79d5a1aef8f";

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Configurar axios para ignorar errores de certificado SSL
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

async function notify(msg) {
  await axiosInstance.post(
    `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
    {
      chat_id: TELEGRAM_CHAT_ID,
      text: msg,
    }
  );
}

async function checkAvailability() {
  try {
    const { data } = await axiosInstance.get(URL, { timeout: 10000 });

    if (data && data.trim().length > 100) {
      await notify("🚨 El sistema de citas consulares ya muestra contenido!");
    } else {
      await notify("🚨 El sistema de citas consulares no muestra contenido!");
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

checkAvailability();
