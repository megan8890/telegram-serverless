export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Telegram Serverless Bot is running!");
    }

    if (
      request.headers.get("X-Telegram-Bot-Api-Secret-Token") !==
      env.WEBHOOK_SECRET
    ) {
      return new Response("Unauthorized", { status: 401 });
    }

    const update = await request.json();
    const message = update.message;

    if (!message || !message.chat) {
      return new Response("OK");
    }

    const chatId = message.chat.id;
    const text = message.text || "";

    let answer;

    if (text === "/start") {
      answer = "Привет! 👋\n\nЯ первый Serverless-бот на Cloudflare Workers!";
    } else {
      answer = "Ты написал: " + text + "\n\nБот работает без VPS! 🚀";
    }

    await fetch(
      `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: answer
        })
      }
    );

    return new Response("OK");
  }
};
