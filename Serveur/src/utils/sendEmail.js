const transporter = require('../config/email');

const sendVerificationEmail = async (email, nom, token) => {
  const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Bazart" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Vérifiez votre email - Bazart',
    replyTo: process.env.EMAIL_USER,
    headers: {
      'X-Priority': '1',
      'X-Mailer': 'Bazart Mailer'
    },
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vérification email - Bazart</title>
      </head>
      <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:20px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                <tr>
                  <td style="background-color:#2b6cb0; padding:30px; text-align:center;">
                    <h1 style="color:#ffffff; margin:0; font-size:24px;">Bazart</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:40px 30px;">
                    <h2 style="color:#1a202c; margin-top:0;">Bonjour ${nom},</h2>
                    <p style="color:#4a5568; font-size:16px; line-height:1.6;">
                      Merci de vous être inscrit sur <strong>Bazart</strong> ! 
                      Pour finaliser votre inscription, veuillez vérifier votre adresse email.
                    </p>
                    <div style="text-align:center; margin:35px 0;">
                      <a href="${verificationUrl}" 
                         style="background-color:#2b6cb0; color:#ffffff; padding:14px 35px; 
                                text-decoration:none; border-radius:6px; font-size:16px; 
                                display:inline-block; font-weight:bold;">
                        Vérifier mon email
                      </a>
                    </div>
                    <p style="color:#718096; font-size:14px; line-height:1.6;">
                      Ou copiez ce lien dans votre navigateur :
                    </p>
                    <p style="word-break:break-all; color:#4a5568; font-size:13px; background:#f7fafc; padding:12px; border-radius:4px;">
                      ${verificationUrl}
                    </p>
                    <p style="color:#a0aec0; font-size:12px; margin-top:25px;">
                      ⏱ Ce lien expire dans 24 heures.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color:#f7fafc; padding:20px 30px; text-align:center; border-top:1px solid #e2e8f0;">
                    <p style="color:#a0aec0; font-size:12px; margin:0;">
                      Si vous n'avez pas créé de compte sur Bazart, ignorez cet email.<br>
                      © 2026 Bazart - Plateforme d'enchères
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `Bonjour ${nom},\n\nMerci de vous être inscrit sur Bazart !\n\nPour vérifier votre email, cliquez sur ce lien : ${verificationUrl}\n\nCe lien expire dans 24 heures.\n\nSi vous n'avez pas créé de compte, ignorez cet email.`
  };

  await transporter.sendMail(mailOptions);
};

// ADD THIS LINE:
module.exports = { sendVerificationEmail };