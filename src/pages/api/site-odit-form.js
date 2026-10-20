export const prerender = false;
export const POST = async ({ request, locals }) => {
  // 1. Get Environment Variables from Cloudflare Runtime
  // In Astro with Cloudflare adapter, secrets are in locals.runtime.env
  const env = locals.runtime?.env || import.meta.env;

  const {
    TURNSTILE_SECRET_KEY,
    MAILJET_API_KEY,
    MAILJET_SECRET_KEY,
    SENDER_EMAIL,
    RECIPIENT_EMAIL
  } = env;

  try {
    const body = await request.json();
    const { siteurl, email, consent, turnstileToken } = body;

    // 2. Server-side Validation
    if (!siteurl || !email || !consent || !turnstileToken) {
      return new Response(JSON.stringify({
        message: 'Моля попълнете всички задължителни полета и верификация.',
        type: 'error'
      }), { status: 400 });
    }

    // 3. STEP ONE: Verify the Turnstile Token (using URLSearchParams for Cloudflare compatibility)
    const turnstileResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: TURNSTILE_SECRET_KEY,
          response: turnstileToken,
        }).toString(),
      }
    );

    const turnstileData = await turnstileResponse.json();

    if (!turnstileData.success) {
      return new Response(JSON.stringify({
        message: 'Верификацията е неуспешна. Моля, опитайте отново.',
        type: 'error'
      }), { status: 403 });
    }

    // 4. STEP TWO: Send Email via Mailjet
    const mailjetResponse = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${MAILJET_API_KEY}:${MAILJET_SECRET_KEY}`),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Messages: [{
          From: { Email: SENDER_EMAIL, Name: 'GOK Studio Bot' },
          To: [{ Email: RECIPIENT_EMAIL, Name: 'GOK Studio Team' }],
          Subject: `Заявка за одит: ${siteurl}`,
          HTMLPart: `
            <h3>Нова заявка за безплатен одит</h3>
            <p><strong>URL на сайта:</strong> ${siteurl}</p>
            <p><strong>Имейл за контакт:</strong> ${email}</p>
            <p><strong>Съгласие за данни:</strong> Да</p>
            <hr />
            <p>Това съобщение е изпратено от формата на gokstudio.com</p>
          `,
        }],
      }),
    });

    const mailjetResult = await mailjetResponse.json();

    if (mailjetResponse.ok && mailjetResult.Messages[0].Status === 'success') {
      return new Response(JSON.stringify({
        message: 'Благодарим Ви! Ще изпратим Вашия одит в рамките на 24 часа.',
        type: 'success'
      }), { status: 200 });
    } else {
      throw new Error('Mailjet API error');
    }

  } catch (error) {
    // console.error('API Error:', error);
    return new Response(JSON.stringify({
      message: 'Възникна техническа грешка. Моля, опитайте по-късно.',
      type: 'error'
    }), { status: 500 });
  }
};