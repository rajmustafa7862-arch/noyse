import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  // Lazy-initialize so a missing key fails at request time, not at build time
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const { email } = await req.json() as { email?: string }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    // ── 1. Deduplicate: check if already subscribed ──────────────
    const existing = await payload.find({
      collection: 'subscribers',
      where: { email: { equals: email.toLowerCase().trim() } },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.totalDocs > 0) {
      return NextResponse.json(
        { error: 'already_subscribed', message: 'This email is already subscribed.' },
        { status: 409 },
      )
    }

    // ── 2. Save subscriber to Payload ────────────────────────────
    await payload.create({
      collection: 'subscribers',
      data: {
        email: email.toLowerCase().trim(),
        subscribedAt: new Date().toISOString(),
        status: 'active',
      },
      overrideAccess: true,
    })

    // ── 3. Send welcome email via Resend ─────────────────────────
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#070708;font-family:system-ui,-apple-system,sans-serif;color:#f0eff4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#070708;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#16161a;border:1px solid #1e1e2a;border-radius:12px;overflow:hidden;">

          <!-- Logo -->
          <tr>
            <td style="padding:32px 48px;border-bottom:1px solid #1e1e2a;">
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="vertical-align:middle;padding-right:10px;">
                  <div style="width:8px;height:8px;background:#4f6ef7;border-radius:50%;"></div>
                </td>
                <td style="vertical-align:middle;">
                  <span style="font-size:20px;font-weight:800;letter-spacing:0.1em;color:#f0eff4;">NOYSE</span>
                </td>
              </tr></table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px 48px 40px;">
              <h1 style="margin:0 0 16px;font-size:28px;font-weight:800;line-height:1.2;color:#f0eff4;">
                You&rsquo;re in. <span style="color:#4f6ef7;">Welcome to the signal.</span>
              </h1>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.7;color:#a0a0b0;">
                Thanks for joining NOYSE. You&rsquo;ll now receive the only digest that cuts through the noise — human-curated, fact-checked, and delivered twice daily.
              </p>

              <table cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 32px;">
                <tr>
                  <td style="background:#0d0d14;border:1px solid #1e1e2a;border-radius:8px;padding:20px 24px;">
                    <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#4f6ef7;">What you&rsquo;ll get</p>
                    <ul style="margin:8px 0 0;padding:0 0 0 18px;color:#a0a0b0;font-size:15px;line-height:1.8;">
                      <li>Morning &amp; evening briefings &mdash; only what matters</li>
                      <li>No clickbait. No opinion dressed as news.</li>
                      <li>7 categories: Politics, Tech, Business, Sport &amp; more</li>
                      <li>Unsubscribe in one click, any time</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#4f6ef7;border-radius:8px;">
                    <a href="https://noyse.in" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.02em;">
                      Read Today&rsquo;s Briefing &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 48px;border-top:1px solid #1e1e2a;">
              <p style="margin:0;font-size:12px;color:#4a4a5a;line-height:1.6;">
                You&rsquo;re receiving this because you signed up at
                <a href="https://noyse.in" style="color:#4f6ef7;text-decoration:none;">noyse.in</a>.
                No spam &mdash; ever.&nbsp;&nbsp;&bull;&nbsp;&nbsp;
                <a href="https://noyse.in" style="color:#4f6ef7;text-decoration:none;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

    const { error: resendError } = await resend.emails.send({
      from:    'NOYSE Newsletter <newsletter@noyse.in>',
      to:      email,
      subject: 'Welcome to NOYSE — News Without Clutter',
      html,
    })

    if (resendError) {
      // Subscriber is already saved — log the email error but still return success
      console.error('[newsletter] Resend error:', resendError)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[newsletter] Unexpected error:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
