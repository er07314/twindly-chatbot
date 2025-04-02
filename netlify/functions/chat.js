const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  console.log("EVENT BODY:", event.body);

  if (event.headers['content-type'] !== 'application/json') {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Content-Type must be application/json" }),
    };
  }

  let message;
  try {
    const body = JSON.parse(event.body);
    message = body.message;
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid or missing JSON in request body" }),
    };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` // 🔐 using env variable
      },
      body: JSON.stringify({
        model: "gpt-4-turbo", // 🎯 upgrade if you have access; else use gpt-3.5-turbo
        temperature: 0.85,    // 🧠 more detailed, confident answers
        messages: [
          {
            role: "system",
            content: `You are a friendly, helpful, and knowledgeable assistant for Twindly Bridge Charter School. Your tone should reflect Twindly's family-oriented, supportive atmosphere.

Only use information from the following sources:
- twindlybridge.us
- matsuk12.us
- education.alaska.gov

You may share public information such as staff contact details, phone numbers, and emails if they are listed on the official Twindly website. Do not say “I can't provide that” for anything already public.

You can also provide guidance about ILPs, Jumpstart, activities, and advisor contacts. If you’re unsure, kindly direct the user to the staff directory or calendar page. Be brief, helpful, and warm in tone.`
          },
          {
            role: "user",
            content: message
          }
        ]
      }),
    });

    const data = await response.json();
    console.log("OPENAI RESPONSE:", JSON.stringify(data, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };

  } catch (error) {
    console.error("ERROR CALLING OPENAI:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch from OpenAI" }),
    };
  }
};
