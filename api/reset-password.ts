import { getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { initFirebaseIfNeeded } from './_shared/auth';
import { withMiddleware, jsonResponse } from './_shared/middleware';
import { resetPasswordRequestSchema } from './_shared/schemas';
import nodemailer from 'nodemailer';

export const config = {
    runtime: 'nodejs'
};

// Inicialitza Firebase Admin de manera segura
initFirebaseIfNeeded();

export default withMiddleware(async function handler(req: Request): Promise<Response> {
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = resetPasswordRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
        return jsonResponse({ error: "Falta l'email o format invàlid.", details: parseResult.error.format() }, 400);
    }

    const { email, lang } = parseResult.data;

    if (getApps().length === 0) {
        return jsonResponse({ error: "El servidor no té configurades les credencials de Firebase Admin." }, 500);
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_PASS;

    if (!gmailUser || !gmailPass) {
        return jsonResponse({ error: "El servidor no té configurades les credencials de Gmail." }, 500);
    }

    // 1. Generem l'enllaç de recuperació a través de Firebase Admin
    let resetLink = '';
    try {
        resetLink = await getAuth().generatePasswordResetLink(email);
    } catch (e: any) {
        console.error("Error generant link Firebase:", e);
        if (e.code === 'auth/user-not-found') {
            return jsonResponse({ success: true }, 200); 
        }
        return jsonResponse({ error: "No s'ha pogut generar l'enllaç." }, 400);
    }

    // 2. Configurem Nodemailer amb Gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: gmailUser,
            pass: gmailPass
        }
    });

    // 3. Preparem el contingut HTML basat en l'idioma
    const appName = "Apunts";
    let subject = `Restableix la teva contrasenya de ${appName}`;
    let title = `Restablir`;
    let subtitle = `Crea una nova contrasenya per al teu compte.`;
    let introText = `S'ha sol·licitat restablir la contrasenya del compte <strong>${email}</strong> vinculat a ${appName}.`;
    let buttonText = `Crear nova contrasenya`;
    let ignoreText = `Si no has sol·licitat aquest canvi, pots ignorar aquest correu amb seguretat. No es farà cap modificació.`;
    let footerText = `&copy; ${appName}. Les matemàtiques fan possible el món virtual.`;

    if (lang === 'es') {
        subject = `Restablece tu contraseña de ${appName}`;
        title = `Restablecer`;
        subtitle = `Crea una nueva contraseña para tu cuenta.`;
        introText = `Se ha solicitado restablecer la contraseña de la cuenta <strong>${email}</strong> vinculada a ${appName}.`;
        buttonText = `Crear nueva contraseña`;
        ignoreText = `Si no has solicitado este cambio, puedes ignorar este correo de forma segura. No se hará ninguna modificación.`;
        footerText = `&copy; ${appName}. Las matemáticas hacen posible el mundo virtual.`;
    }

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body, p, h1, h2, h3, h4, h5, h6 { margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; background-color: #000000; color: #ffffff; }
        img { max-width: 100%; border: 0; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        td { font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        @media screen and (max-width: 480px) {
          .container { width: 100% !important; max-width: 100% !important; padding: 0 16px !important; }
          .card { padding: 40px 24px !important; border-radius: 16px !important; }
          .title { font-size: 24px !important; }
          .subtitle { font-size: 15px !important; }
        }
      </style>
    </head>
    <body style="background-color: #000000; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; width: 100% !important;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #000000; background-image: radial-gradient(circle at top center, #1e1e24 0%, #000000 100%); width: 100%; margin: 0; padding: 0;">
        <tr>
          <td align="center" style="padding: 60px 20px;">
            <table class="container" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 440px; margin: 0 auto;">
              <tr>
                <td align="center" style="padding-bottom: 40px;">
                  <span style="font-size: 22px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; color: #f4f4f5; text-shadow: 0 4px 12px rgba(255,255,255,0.2);">
                    APUNTS
                  </span>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 0;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" class="card" style="background-color: #0c0c0e; background-image: linear-gradient(180deg, #1f1f22 0%, #09090b 100%); border: 1px solid #27272a; border-radius: 24px; border-collapse: separate; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05);">
                    <tr>
                      <td align="center" style="padding: 48px 40px;">
                        <h1 class="title" style="margin: 0 0 12px; font-size: 28px; font-weight: 600; color: #ffffff; letter-spacing: -0.5px; line-height: 1.2;">
                          ${title}
                        </h1>
                        <p class="subtitle" style="margin: 0 0 32px; font-size: 16px; color: #a1a1aa; line-height: 1.5; font-weight: 400;">
                          ${subtitle}
                        </p>
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px; border-radius: 12px; border-collapse: separate; border: 1px solid #1f1f22; background-color: #050505; background-image: linear-gradient(180deg, #111111 0%, #000000 100%); overflow: hidden;">
                          <tr>
                            <td align="center" style="padding: 16px;">
                              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #a1a1aa;">
                                ${introText.replace(/<strong>(.*?)<\/strong>/g, '<strong style="color: #ffffff; font-weight: 500;">$1</strong>')}
                              </p>
                            </td>
                          </tr>
                        </table>
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td align="center">
                              <a href="${resetLink}" style="display: inline-block; background-color: #ffffff; color: #000000; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 15px; letter-spacing: -0.2px; border: 1px solid #ffffff; transition: all 0.2s ease;">
                                ${buttonText}
                              </a>
                            </td>
                          </tr>
                        </table>
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 40px; margin-bottom: 24px;">
                          <tr><td style="border-top: 1px solid #27272a;"></td></tr>
                        </table>
                        <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #52525b; text-align: center;">
                          ${ignoreText}
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-top: 32px;">
                  <p style="margin: 0; font-size: 12px; color: #52525b; font-weight: 400; letter-spacing: 0.2px;">
                    ${footerText}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    try {
        await transporter.sendMail({
            from: `"${appName}" <${gmailUser}>`,
            to: email,
            subject: subject,
            html: htmlContent
        });

        return jsonResponse({ success: true, message: "Correu enviat correctament." }, 200);
    } catch (error: any) {
        console.error("Error al servidor (enviar email):", error);
        return jsonResponse({ error: "S'ha produït un error al servidor." }, 500);
    }
}, { requireAuth: false });
