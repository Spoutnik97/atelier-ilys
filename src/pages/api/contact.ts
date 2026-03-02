import type { APIRoute } from 'astro'
import { Resend } from 'resend'

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData()

    const name = data.get('name')?.toString().trim()
    const email = data.get('email')?.toString().trim()
    const phone = data.get('phone')?.toString().trim()
    const message = data.get('message')?.toString().trim()
    const honey = data.get('_honey')?.toString()

    // Honeypot check
    if (honey) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 })
    }

    // Validation
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Champs requis manquants.' }),
        { status: 400 }
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Email invalide.' }),
        { status: 400 }
      )
    }

    const apiKey = import.meta.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('RESEND_API_KEY not set')
      return new Response(
        JSON.stringify({ ok: false, error: 'Configuration email manquante.' }),
        { status: 500 }
      )
    }

    const resend = new Resend(apiKey)

    await resend.emails.send({
      from: 'contact@atelier-ilys.com',
      to: 'atelier.ilys@gmail.com',
      replyTo: email,
      subject: `[Contact] Message de ${name}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #F5F0E8; border: 1px solid #EAE2D0;">
          <h2 style="color: #3D5A80; border-bottom: 2px solid #C8963E; padding-bottom: 8px;">Nouveau message — Atelier Ilys</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #2C2416; background: #EAE2D0; width: 30%;">Nom</td>
              <td style="padding: 8px 12px; color: #2C2416;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #2C2416; background: #EAE2D0;">Email</td>
              <td style="padding: 8px 12px; color: #2C2416;"><a href="mailto:${escapeHtml(email)}" style="color: #3D5A80;">${escapeHtml(email)}</a></td>
            </tr>
            ${phone ? `
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #2C2416; background: #EAE2D0;">Téléphone</td>
              <td style="padding: 8px 12px; color: #2C2416;">${escapeHtml(phone)}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #2C2416; background: #EAE2D0; vertical-align: top;">Message</td>
              <td style="padding: 8px 12px; color: #2C2416; white-space: pre-wrap;">${escapeHtml(message)}</td>
            </tr>
          </table>
          <p style="margin-top: 20px; font-size: 12px; color: #999;">Message envoyé depuis atelier-ilys.com</p>
        </div>
      `,
    })

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (err) {
    console.error('Contact API error:', err)
    return new Response(
      JSON.stringify({ ok: false, error: 'Erreur interne du serveur.' }),
      { status: 500 }
    )
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
