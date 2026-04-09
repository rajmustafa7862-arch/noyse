import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Resend } from 'resend'
import { renderTemplate, lexicalToHtml } from '@/lib/emailTemplates'

const BATCH_SIZE = 100 // Resend batch limit per call

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const { newsletterId } = await req.json() as { newsletterId?: string }
    if (!newsletterId) {
      return NextResponse.json({ error: 'newsletterId is required.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    // ── 1. Fetch newsletter ──────────────────────────────────────
    const newsletter = await payload.findByID({
      collection: 'newsletters',
      id: newsletterId,
      overrideAccess: true,
    })

    if (!newsletter) {
      return NextResponse.json({ error: 'Newsletter not found.' }, { status: 404 })
    }
    if (newsletter.status === 'sent') {
      return NextResponse.json({ error: 'This newsletter has already been sent.' }, { status: 409 })
    }
    if (!newsletter.template || !['briefing', 'breaking', 'weekly'].includes(newsletter.template as string)) {
      return NextResponse.json({ error: 'Invalid or missing template.' }, { status: 400 })
    }

    // ── 2. Fetch all active subscribers ──────────────────────────
    const subscriberResult = await payload.find({
      collection: 'subscribers',
      where: { status: { equals: 'active' } },
      limit: 10000,
      overrideAccess: true,
    })

    const subscribers = subscriberResult.docs
    if (subscribers.length === 0) {
      return NextResponse.json({ error: 'No active subscribers to send to.' }, { status: 400 })
    }

    // ── 3. Render HTML ───────────────────────────────────────────
    const bodyHtml = newsletter.bodyContent
      ? lexicalToHtml(newsletter.bodyContent)
      : undefined

    const html = renderTemplate(newsletter.template as 'briefing' | 'breaking' | 'weekly', {
      subject:      newsletter.subject,
      heroHeadline: (newsletter.heroHeadline as string | undefined) ?? undefined,
      heroSubtext:  (newsletter.heroSubtext  as string | undefined) ?? undefined,
      bodyHtml,
      ctaText: (newsletter.ctaText as string | undefined) ?? 'Read on NOYSE',
      ctaUrl:  (newsletter.ctaUrl  as string | undefined) ?? 'https://noyse.in',
    })

    // ── 4. Send in batches ───────────────────────────────────────
    let successCount = 0
    const from = 'NOYSE Newsletter <newsletter@noyse.in>'

    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const chunk = subscribers.slice(i, i + BATCH_SIZE)
      const emails = chunk.map(sub => ({
        from,
        to:      sub.email as string,
        subject: newsletter.subject,
        html,
      }))

      try {
        await resend.batch.send(emails)
        successCount += chunk.length
      } catch (batchErr) {
        console.error(`[send-newsletter] Batch ${i}–${i + BATCH_SIZE} failed:`, batchErr)
        // Continue with remaining batches rather than aborting entirely
      }
    }

    // ── 5. Mark newsletter as sent ───────────────────────────────
    await payload.update({
      collection: 'newsletters',
      id: newsletterId,
      data: {
        status:         'sent',
        sentAt:         new Date().toISOString(),
        recipientCount: successCount,
      },
      overrideAccess: true,
    })

    return NextResponse.json({ success: true, count: successCount })
  } catch (err) {
    console.error('[send-newsletter] Unexpected error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Something went wrong.' },
      { status: 500 },
    )
  }
}
