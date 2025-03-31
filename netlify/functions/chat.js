const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  const { message } = JSON.parse(event.body);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_OPENAI_API_KEY"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a friendly and helpful assistant for Twindly Bridge Charter School. Only use info from twindlybridge.us, matsuk12.us, or education.alaska.gov." },
        { role: "user", content: message }
      ]
    }),
  });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
