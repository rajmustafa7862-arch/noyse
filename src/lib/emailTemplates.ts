// ─── Shared types ─────────────────────────────────────────────────────────────

export interface TemplateData {
  subject:       string
  heroHeadline?: string
  heroSubtext?:  string
  bodyHtml?:     string   // pre-rendered HTML from Lexical content
  ctaText:       string
  ctaUrl:        string
}

// ─── Shared HTML building blocks ──────────────────────────────────────────────

const COLORS = {
  bg:        '#070708',
  surface:   '#16161a',
  border:    '#1e1e2a',
  blue:      '#4f6ef7',
  red:       '#ef4444',
  green:     '#10b981',
  textPrimary:   '#f0eff4',
  textSecondary: '#a0a0b0',
  textMuted:     '#4a4a5a',
} as const

function logo(): string {
  return `
    <table cellpadding="0" cellspacing="0" style="margin-bottom:0;">
      <tr>
        <td style="vertical-align:middle;padding-right:10px;">
          <div style="width:8px;height:8px;background:${COLORS.blue};border-radius:50%;"></div>
        </td>
        <td style="vertical-align:middle;">
          <span style="font-size:20px;font-weight:800;letter-spacing:0.1em;color:${COLORS.textPrimary};font-family:system-ui,sans-serif;">NOYSE</span>
        </td>
      </tr>
    </table>`
}

function ctaButton(text: string, url: string): string {
  return `
    <table cellpadding="0" cellspacing="0" style="margin-top:32px;">
      <tr>
        <td style="background:${COLORS.blue};border-radius:8px;">
          <a href="${url}"
             style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.02em;font-family:system-ui,sans-serif;">
            ${text} &rarr;
          </a>
        </td>
      </tr>
    </table>`
}

function footer(): string {
  return `
    <tr>
      <td style="padding:24px 48px;border-top:1px solid ${COLORS.border};">
        <p style="margin:0;font-size:12px;color:${COLORS.textMuted};line-height:1.6;font-family:system-ui,sans-serif;">
          You&rsquo;re receiving this because you subscribed at
          <a href="https://noyse.in" style="color:${COLORS.blue};text-decoration:none;">noyse.in</a>.
          No spam &mdash; ever.&nbsp;&nbsp;&bull;&nbsp;&nbsp;
          <a href="https://noyse.in" style="color:${COLORS.blue};text-decoration:none;">Unsubscribe</a>
        </p>
      </td>
    </tr>`
}

function shell(headerContent: string, bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:${COLORS.bg};font-family:system-ui,-apple-system,sans-serif;color:${COLORS.textPrimary};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg};padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="max-width:600px;width:100%;background:${COLORS.surface};border:1px solid ${COLORS.border};border-radius:12px;overflow:hidden;">

          <!-- Logo header -->
          <tr>
            <td style="padding:32px 48px;border-bottom:1px solid ${COLORS.border};">
              ${logo()}
            </td>
          </tr>

          <!-- Template-specific header -->
          ${headerContent}

          <!-- Body -->
          <tr>
            <td style="padding:40px 48px 48px;">
              ${bodyContent}
            </td>
          </tr>

          <!-- Footer -->
          ${footer()}

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ─── Template 1 — Daily Briefing ──────────────────────────────────────────────

export function briefingTemplate(data: TemplateData): string {
  const header = `
    <tr>
      <td style="padding:24px 48px;background:#0d0d14;border-bottom:1px solid ${COLORS.border};">
        <span style="font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${COLORS.blue};font-family:system-ui,sans-serif;">
          ◉ &nbsp; Daily Briefing
        </span>
      </td>
    </tr>`

  const body = `
    ${data.heroHeadline ? `
    <h1 style="margin:0 0 16px;font-size:30px;font-weight:800;line-height:1.2;color:${COLORS.textPrimary};">
      ${data.heroHeadline}
    </h1>` : ''}
    ${data.heroSubtext ? `
    <p style="margin:0 0 28px;font-size:17px;line-height:1.7;color:${COLORS.textSecondary};">
      ${data.heroSubtext}
    </p>` : ''}
    ${data.bodyHtml ? `
    <div style="font-size:15px;line-height:1.8;color:${COLORS.textSecondary};">
      ${data.bodyHtml}
    </div>` : ''}
    ${ctaButton(data.ctaText, data.ctaUrl)}`

  return shell(header, body)
}

// ─── Template 2 — Breaking News Alert ────────────────────────────────────────

export function breakingTemplate(data: TemplateData): string {
  const header = `
    <tr>
      <td style="padding:24px 48px;background:#1a0a0a;border-bottom:1px solid #2a1010;">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="background:${COLORS.red};border-radius:4px;padding:4px 10px;margin-right:12px;">
              <span style="font-size:10px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:#fff;font-family:system-ui,sans-serif;">
                BREAKING
              </span>
            </td>
            <td style="padding-left:12px;">
              <span style="font-size:11px;font-weight:600;letter-spacing:0.08em;color:${COLORS.red};font-family:system-ui,sans-serif;">
                News Alert
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>`

  const body = `
    ${data.heroHeadline ? `
    <h1 style="margin:0 0 16px;font-size:30px;font-weight:800;line-height:1.2;color:${COLORS.textPrimary};">
      ${data.heroHeadline}
    </h1>` : ''}
    ${data.heroSubtext ? `
    <p style="margin:0 0 28px;font-size:17px;line-height:1.7;color:${COLORS.textSecondary};">
      ${data.heroSubtext}
    </p>` : ''}
    ${data.bodyHtml ? `
    <div style="font-size:15px;line-height:1.8;color:${COLORS.textSecondary};">
      ${data.bodyHtml}
    </div>` : ''}
    ${ctaButton(data.ctaText, data.ctaUrl)}`

  return shell(header, body)
}

// ─── Template 3 — Weekly Digest ───────────────────────────────────────────────

export function weeklyTemplate(data: TemplateData): string {
  const header = `
    <tr>
      <td style="padding:24px 48px;background:#0a0e1a;border-bottom:1px solid ${COLORS.border};">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <span style="font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${COLORS.blue};font-family:system-ui,sans-serif;">
                ◈ &nbsp; Weekly Digest
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>`

  const body = `
    ${data.heroHeadline ? `
    <h1 style="margin:0 0 16px;font-size:30px;font-weight:800;line-height:1.2;color:${COLORS.textPrimary};">
      ${data.heroHeadline}
    </h1>` : ''}
    ${data.heroSubtext ? `
    <p style="margin:0 0 28px;font-size:17px;line-height:1.7;color:${COLORS.textSecondary};">
      ${data.heroSubtext}
    </p>` : ''}
    ${data.bodyHtml ? `
    <div style="font-size:15px;line-height:1.8;color:${COLORS.textSecondary};border-left:3px solid ${COLORS.blue};padding-left:20px;margin-bottom:8px;">
      ${data.bodyHtml}
    </div>` : ''}
    ${ctaButton(data.ctaText, data.ctaUrl)}`

  return shell(header, body)
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────

export function renderTemplate(
  template: 'briefing' | 'breaking' | 'weekly',
  data: TemplateData,
): string {
  switch (template) {
    case 'briefing': return briefingTemplate(data)
    case 'breaking': return breakingTemplate(data)
    case 'weekly':   return weeklyTemplate(data)
  }
}

// ─── Lexical → plain HTML (minimal, email-safe) ───────────────────────────────

type LexicalNode =
  | { type: 'text'; text: string; format?: number }
  | { type: string; tag?: string; listType?: string; url?: string; children?: LexicalNode[] }

function renderLexicalNodes(nodes: LexicalNode[]): string {
  return nodes.map(node => {
    if (node.type === 'text') {
      const n = node as { type: 'text'; text: string; format?: number }
      let t = (n.text ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      if (!t) return ''
      if (n.format && n.format & 1)  t = `<strong>${t}</strong>`
      if (n.format && n.format & 2)  t = `<em>${t}</em>`
      if (n.format && n.format & 8)  t = `<u>${t}</u>`
      if (n.format && n.format & 16) t = `<code style="background:#1e1e2a;padding:2px 4px;border-radius:3px;">${t}</code>`
      return t
    }
    const n = node as { type: string; tag?: string; listType?: string; url?: string; children?: LexicalNode[] }
    const inner = n.children ? renderLexicalNodes(n.children) : ''
    switch (n.type) {
      case 'paragraph':   return inner.trim() ? `<p style="margin:0 0 16px;">${inner}</p>` : '<br/>'
      case 'heading':     return `<${n.tag ?? 'h2'} style="margin:0 0 12px;color:#f0eff4;">${inner}</${n.tag ?? 'h2'}>`
      case 'quote':       return `<blockquote style="margin:0 0 16px;padding-left:16px;border-left:3px solid #4f6ef7;color:#a0a0b0;">${inner}</blockquote>`
      case 'list':        return n.listType === 'number' ? `<ol style="margin:0 0 16px;padding-left:20px;">${inner}</ol>` : `<ul style="margin:0 0 16px;padding-left:20px;">${inner}</ul>`
      case 'listitem':    return `<li style="margin-bottom:6px;">${inner}</li>`
      case 'link':        return `<a href="${n.url ?? '#'}" style="color:#4f6ef7;text-decoration:none;">${inner}</a>`
      case 'linebreak':   return '<br/>'
      case 'horizontalrule': return '<hr style="border:none;border-top:1px solid #1e1e2a;margin:24px 0;"/>'
      default:            return inner
    }
  }).join('')
}

export function lexicalToHtml(content: unknown): string {
  if (!content || typeof content !== 'object') return ''
  const root = (content as { root?: { children?: LexicalNode[] } }).root
  if (!root?.children) return ''
  return renderLexicalNodes(root.children)
}
