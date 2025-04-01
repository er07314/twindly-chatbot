const fetch = require("node-fetch");

exports.handler = async function (event, context) {
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

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer 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"
    },
    body: JSON.stringify({
      model: "gpt-4",
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

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
