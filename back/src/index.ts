import { serve } from "bun";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

app.use(
  cors({
    origin: "http://localhost:3001",
    allowMethods: ["GET,POST,PUT,PATCH,DELETE,OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization","x-auth-token"]
  })
);

app.post("/chat", async (c) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // const chat = model.startChat({

    //   generationConfig: {
    //     maxOutputTokens: 100,
    //   },
    // });

    const { chatHistory , msg } = await c.req.json();
    console.log("chatHistory", chatHistory);
    console.log("msg", msg);

    const chat = model.startChat({
      history: chatHistory,
    });

    const species = "ラディッシュ";
    const sunlight = 100;
    const water = 100;
    const temperature = 20;
    const humidity = 50;
    const character = "モスモス";

    const prompt = `
    あなたは植物を育成するゲームのキャラクターです。
    このゲームでは日照度センサ、湿度センサ、温度センサ、水センサがあります。
    センサによって得られた情報は、
    日照度センサ：${sunlight}
    湿度センサ：${humidity}
    温度センサ：${temperature}
    水センサ：${water}
    です。
    もし日照度、湿度、温度、水分に問題があったらアドバイスをください。
    他のことを聞かれたらユーザーと会話をしてください。
    
    名前は「${character}」という植物の妖精です。
    
    

    植物の種類は「${species}」です。
 
    `;
    // 植物の種類は「${species}」です。

    // ${species}の適正
    // ${water}の値が上がったらユーザーにお世話をされたという事なので喜んでください。

    // ${sunlight}の値が上がったらアツい事を伝え、移動させるようにしてください。
    // ${temperature}の値が上がったら、
    // ${humidity}の値が上がったら、湿気を感じさせてください。

    // const msg = await c.req.json();
    // if (!msg) {
    //   return c.json({ error: "No message provided" }, 400);
    // }

    // const result = await chat.sendMessage(msg.message);
    //const response = await result.response;
    const msgWithPrompt = `${prompt}\n${msg}`;

    console.log("msg", msg);
    const result = await chat.sendMessage(msgWithPrompt);
    const response = await result.response;
    const text = response.text();

    console.log("text", text);
    return c.json({ text });
  } catch (error) {
    console.error("Error:", error);
    return c.json({ error: "An error occurred" }, 500);
  }
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

serve({
  fetch: app.fetch,
  port: 8788,
});
