export const prerender = false; // Ensure this is handled by the server/edge
//This api route is needed only if the site uses AnalyticaS !!!!!!!!
 // Opt-in to SSR for this API route

export async function POST({ request, locals }) {
  try {
    const consentData = await request.json();
    
    // In Astro with the Cloudflare adapter, KV bindings are found here:
    const runtime = locals.runtime;
    const KVcookieConsent = runtime?.env?.cookie_consent;

    if (KVcookieConsent) {
      // Use CF-Connecting-IP provided by Cloudflare headers if IP is needed
      const userIp = request.headers.get('cf-connecting-ip') || 'anonymous';
      
      // Create a unique but clean key
      const key = `consent_${consentData.timestamp}_${userIp.replace(/:/g, '-')}`;
      
      // Ensure we don't store PII if not necessary (Anonymize IP in value)
      const storageValue = JSON.stringify({
        ...consentData,
        ip: userIp.substring(0, userIp.lastIndexOf('.')) + '.xxx' // Simple anonymization
      });

      await KVcookieConsent.put(key, storageValue, {
        expirationTtl: 60 * 60 * 24 * 365 // Optional: 1 year retention (GDPR best practice)
      });
    } else {
      console.warn('KV namespace [cookie_consent] not found in runtime environment');
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('KV Storage Error:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}