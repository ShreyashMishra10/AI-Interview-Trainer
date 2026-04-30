import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Use onboarding@resend.dev until a custom domain is verified in Resend dashboard
const FROM = "AI-Trainer <onboarding@resend.dev>";

export async function sendSessionCompleteEmail({
  to,
  name,
  jobRole,
  score,
  sessionId,
}: {
  to:        string;
  name:      string;
  jobRole:   string;
  score:     number | null;
  sessionId: string;
}) {
  const scoreColor =
    score === null  ? "#71717a"
    : score >= 75   ? "#34d399"
    : score >= 50   ? "#f59e0b"
    :                 "#f87171";

  const scoreLabel =
    score === null  ? "Not scored"
    : score >= 75   ? "Strong performance"
    : score >= 50   ? "Building momentum"
    :                 "Needs improvement";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#12121a;border:1px solid #27272a;border-radius:16px;overflow:hidden;max-width:560px;width:100%;">

        <!-- Header -->
        <tr><td style="background:#12121a;padding:32px 40px 24px;border-bottom:1px solid #27272a;">
          <p style="margin:0;font-size:13px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#f59e0b;">AI-Trainer</p>
          <h1 style="margin:8px 0 0;font-size:24px;font-weight:700;color:#ffffff;line-height:1.3;">Interview Complete</h1>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px 40px;">
          <p style="margin:0 0 24px;font-size:15px;color:#a1a1aa;line-height:1.6;">
            Hey ${name}, your <strong style="color:#ffffff;">${jobRole}</strong> interview session is done. Here's how you did:
          </p>

          <!-- Score card -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d16;border:1px solid #27272a;border-radius:12px;margin-bottom:24px;">
            <tr>
              <td style="padding:24px;text-align:center;">
                <p style="margin:0 0 4px;font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#71717a;">Your Score</p>
                <p style="margin:0;font-size:56px;font-weight:800;color:${scoreColor};line-height:1.1;">${score ?? "—"}</p>
                <p style="margin:4px 0 0;font-size:12px;color:${scoreColor};">${scoreLabel}</p>
              </td>
              <td style="padding:24px;border-left:1px solid #27272a;">
                <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#71717a;">Role</p>
                <p style="margin:0 0 16px;font-size:14px;color:#ffffff;font-weight:600;">${jobRole}</p>
                <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#71717a;">Status</p>
                <p style="margin:0;font-size:14px;color:#34d399;font-weight:600;">Completed</p>
              </td>
            </tr>
          </table>

          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center">
                <a href="https://ai-interview-trainer.com/dashboard/interviews/${sessionId}"
                   style="display:inline-block;background:#f59e0b;color:#000000;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:10px;">
                  View Full Transcript →
                </a>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 40px;border-top:1px solid #27272a;">
          <p style="margin:0;font-size:12px;color:#52525b;text-align:center;">
            You received this because email notifications are enabled.<br>
            <a href="https://ai-interview-trainer.com/dashboard/settings" style="color:#71717a;">Manage preferences</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return resend.emails.send({
    from:    FROM,
    to,
    subject: `Your ${jobRole} interview is complete${score !== null ? ` — Score: ${score}/100` : ""}`,
    html,
  });
}

export async function sendWelcomeEmail({ to, name }: { to: string; name: string }) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#12121a;border:1px solid #27272a;border-radius:16px;overflow:hidden;max-width:560px;width:100%;">

        <tr><td style="padding:40px 40px 32px;">
          <p style="margin:0 0 4px;font-size:13px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#f59e0b;">AI-Trainer</p>
          <h1 style="margin:12px 0 16px;font-size:26px;font-weight:700;color:#ffffff;">Welcome, ${name} 👋</h1>
          <p style="margin:0 0 24px;font-size:15px;color:#a1a1aa;line-height:1.7;">
            Your account is ready. Start your first mock interview, build your CV, or explore the Japanese Sensei roadmap.
          </p>
          <a href="https://ai-interview-trainer.com/dashboard"
             style="display:inline-block;background:#f59e0b;color:#000000;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:10px;">
            Go to Dashboard →
          </a>
        </td></tr>

        <tr><td style="padding:24px 40px;border-top:1px solid #27272a;">
          <p style="margin:0;font-size:12px;color:#52525b;text-align:center;">AI-Trainer · ai-interview-trainer.com</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return resend.emails.send({
    from:    FROM,
    to,
    subject: `Welcome to AI-Trainer, ${name}!`,
    html,
  });
}
