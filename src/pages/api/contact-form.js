// src/pages/api/contact-form.js
export const prerender = false; // Opt-in to SSR for this API route

export async function POST({ request, locals }) {
  // 1. Get Environment Variables from Cloudflare Locals
  const env = locals.runtime.env;
  const { 
    MAILJET_API_KEY, 
    MAILJET_SECRET_KEY, 
    SENDER_EMAIL, 
    RECIPIENT_EMAIL 
  } = env;

  try {
    const body = await request.json();
    const { name, phone, question, consent } = body;

    // 2. Basic Validation
    if (!name || !phone || !question || !consent) {
      return new Response(
        JSON.stringify({ message: 'Моля, попълнете всички задължителни полета.', type: 'error' }),
        { status: 400 }
      );
    }

    // 3. Call Mailjet directly (Internal function logic)
    const mailjetResponse = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${MAILJET_API_KEY}:${MAILJET_SECRET_KEY}`)
      },
      body: JSON.stringify({
        Messages: [
          {
            From: { Email: SENDER_EMAIL, Name: name },
            To: [{ Email: RECIPIENT_EMAIL, Name: "GOK Studio" }],
            Subject: "Ново запитване от контактната форма на сайта GOK-STUDIO.com",
            TextPart: `Име: ${name}\nТелефон: ${phone}\nВъпрос: ${question}`,
            HTMLPart: `<h3>Ново запитване</h3><p><strong>От:</strong> ${name}</p><p><strong>Телефон:</strong> ${phone}</p><p><strong>Въпрос:</strong> ${question}</p>`
          }
        ]
      })
    });

    const result = await mailjetResponse.json();

    if (mailjetResponse.ok && result.Messages[0].Status === 'success') {
      return new Response(
        JSON.stringify({
          message: 'Благодаря за вашето запитване! Ще получите отговор скоро!',
          type: 'success',
        }),
        { status: 200 }
      );
    } else {
      throw new Error('Mailjet failed');
    }

  } catch (error) {
    // console.error('Submission Error:', error);
    return new Response(
      JSON.stringify({
        message: 'Нещо се обърка. Моля, опитайте отново по-късно.',
        type: 'error',
      }),
      { status: 500 }
    );
  }
}