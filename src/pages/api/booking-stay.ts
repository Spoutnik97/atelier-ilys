import type { APIRoute } from 'astro'
import { Resend } from 'resend'

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData()

    const name = data.get('name')?.toString().trim()
    const email = data.get('email')?.toString().trim()
    const phone = data.get('phone')?.toString().trim()
    const room = data.get('room')?.toString().trim()
    const arrivalDate = data.get('arrivalDate')?.toString().trim()
    const departureDate = data.get('departureDate')?.toString().trim()
    const guests = data.get('guests')?.toString().trim()
    const message = data.get('message')?.toString().trim()
    const honey = data.get('_honey')?.toString()

    // Honeypot check
    if (honey) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 })
    }

    // Validation
    if (!name || !email || !phone || !room || !arrivalDate || !departureDate || !guests) {
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

    // Validate dates
    const arrival = new Date(arrivalDate)
    const departure = new Date(departureDate)
    if (isNaN(arrival.getTime()) || isNaN(departure.getTime())) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Dates invalides.' }),
        { status: 400 }
      )
    }
    if (departure <= arrival) {
      return new Response(
        JSON.stringify({ ok: false, error: 'La date de départ doit être après la date d\'arrivée.' }),
        { status: 400 }
      )
    }

    const nights = Math.round((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24))

    const apiKey = import.meta.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('RESEND_API_KEY not set')
      return new Response(
        JSON.stringify({ ok: false, error: 'Configuration email manquante.' }),
        { status: 500 }
      )
    }

    const resend = new Resend(apiKey)

    const formatDate = (dateStr: string) => {
      return new Date(dateStr).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    }

    await resend.emails.send({
      from: 'reservations@atelier-ilys.com',
      to: 'atelier.ilys@gmail.com',
      replyTo: email,
      subject: `[Séjour] Demande de ${name} — ${room}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #F5F0E8; border: 1px solid #EAE2D0;">
          <h2 style="color: #3D5A80; border-bottom: 2px solid #C8963E; padding-bottom: 8px;">Nouvelle demande de séjour — Atelier Ilys</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #2C2416; background: #EAE2D0; width: 35%;">Nom</td>
              <td style="padding: 8px 12px; color: #2C2416;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #2C2416; background: #EAE2D0;">Email</td>
              <td style="padding: 8px 12px;"><a href="mailto:${escapeHtml(email)}" style="color: #3D5A80;">${escapeHtml(email)}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #2C2416; background: #EAE2D0;">Téléphone</td>
              <td style="padding: 8px 12px; color: #2C2416;">${escapeHtml(phone)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #2C2416; background: #EAE2D0;">Hébergement</td>
              <td style="padding: 8px 12px; color: #2C2416;">${escapeHtml(room)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #2C2416; background: #EAE2D0;">Arrivée</td>
              <td style="padding: 8px 12px; color: #2C2416;">${formatDate(arrivalDate)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #2C2416; background: #EAE2D0;">Départ</td>
              <td style="padding: 8px 12px; color: #2C2416;">${formatDate(departureDate)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #2C2416; background: #EAE2D0;">Durée</td>
              <td style="padding: 8px 12px; color: #2C2416;">${nights} nuit${nights > 1 ? 's' : ''}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #2C2416; background: #EAE2D0;">Personnes</td>
              <td style="padding: 8px 12px; color: #2C2416;">${escapeHtml(guests)}</td>
            </tr>
            ${message ? `
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #2C2416; background: #EAE2D0; vertical-align: top;">Message</td>
              <td style="padding: 8px 12px; color: #2C2416; white-space: pre-wrap;">${escapeHtml(message)}</td>
            </tr>
            ` : ''}
          </table>
          <p style="margin-top: 20px; font-size: 12px; color: #999;">Demande envoyée depuis atelier-ilys.com/reserve-ton-sejour</p>
        </div>
      `,
    })

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (err) {
    console.error('Booking stay API error:', err)
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
