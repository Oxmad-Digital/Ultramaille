import { Resend } from "resend";

const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY manquant dans les variables d'environnement");
  }

  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: `Ultramaille <${FROM_ADDRESS}>`,
    to,
    subject: "Réinitialisation du mot de passe admin",
    html: `
      <p>Une demande de réinitialisation du mot de passe admin a été effectuée.</p>
      <p><a href="${resetUrl}">Cliquez ici pour choisir un nouveau mot de passe</a></p>
      <p>Ce lien expire dans 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
    `,
  });
}

export async function sendInvitationEmail(to: string, inviteUrl: string, role: "admin" | "member") {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY manquant dans les variables d'environnement");
  }

  const resend = new Resend(apiKey);
  const roleLabel = role === "admin" ? "administrateur" : "membre";

  await resend.emails.send({
    from: `Ultramaille <${FROM_ADDRESS}>`,
    to,
    subject: "Invitation à rejoindre l'administration Ultramaille",
    html: `
      <p>Vous avez été invité(e) à rejoindre l'administration Ultramaille en tant que <strong>${roleLabel}</strong>.</p>
      <p><a href="${inviteUrl}">Cliquez ici pour choisir votre mot de passe et activer votre compte</a></p>
      <p>Ce lien expire dans 7 jours. Si vous ne vous attendiez pas à cette invitation, ignorez cet email.</p>
    `,
  });
}
