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
        "Authorization": "Bearer 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"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a friendly and helpful assistant for Twindly Bridge Charter School. Only use info from twindlybridge.us, matsuk12.us, or education.alaska.gov."
          },
          {
            role: "user",
            content: message
          }
        ]
      }),
    });

    const data = await response.json();
    console.log("OPENAI RESPONSE:", JSON.stringify(data, null, 2)); // 👈 Log full response

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };

  } catch (error) {
    console.error("ERROR CALLING OPENAI:", error); // 👈 Log any fetch errors

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch from OpenAI" }),
    };
  }
};
