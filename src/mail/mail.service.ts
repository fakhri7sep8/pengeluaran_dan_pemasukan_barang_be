import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import mjml2html from 'mjml';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class MailService {
  constructor(private mailer: MailerService) {}

  // Generate HTML email MJML
  private generateResetCodeEmail(code: string) {
      const year = new Date().getFullYear();
  return mjml2html(`
<mjml>
  <mj-head>
    <mj-font
      name="Inter"
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
    />
    <mj-preview>Reset Password Akun Anda</mj-preview>
  </mj-head>

  <mj-body background-color="#f3f4f6" font-family="Inter, sans-serif">
    <mj-section padding="40px 16px">
      <mj-column background-color="#ffffff" border-radius="20px" padding="32px">

        <!-- LOGO -->
        <mj-image src="cid:logo" width="110px" align="center" />
        <mj-spacer height="24px" />

        <!-- TITLE -->
        <mj-text
          align="center"
          font-size="24px"
          font-weight="700"
          color="#111827"
        >
          Reset Password
        </mj-text>
        <mj-spacer height="12px" />

        <!-- DESCRIPTION -->
        <mj-text
          align="center"
          font-size="15px"
          color="#6b7280"
          line-height="24px"
        >
          Kami menerima permintaan untuk mereset password akun Anda.
          Gunakan kode verifikasi di bawah ini untuk melanjutkan.
        </mj-text>
        <mj-spacer height="28px" />

        <!-- OTP BOX -->
        <mj-text align="center">
          <span
            style="
              display:inline-block;
              font-size:34px;
              font-weight:700;
              letter-spacing:10px;
              padding:18px 26px;
              border:1px dashed #d1d5db;
              border-radius:14px;
              background:#f9fafb;
              color:#111827;
            "
          >
            ${code}
          </span>
        </mj-text>
        <mj-spacer height="24px" />

        <!-- INFO -->
        <mj-text
          align="center"
          font-size="14px"
          color="#6b7280"
          line-height="22px"
        >
          Kode ini berlaku selama <strong>15 menit</strong>.<br />
          Jangan bagikan kode ini kepada siapa pun.
        </mj-text>
        <mj-spacer height="32px" />

        <!-- FOOT NOTE -->
        <mj-text
          align="center"
          font-size="13px"
          color="#9ca3af"
          line-height="20px"
        >
          Jika Anda tidak merasa melakukan permintaan ini,<br />
          silahkan abaikan email ini.
        </mj-text>

      </mj-column>
    </mj-section>

    <!-- FOOTER -->
    <mj-section padding="0 16px 24px">
      <mj-column>
        <mj-text align="center" font-size="12px" color="#9ca3af">
          © ${year} PT Sakka Kreasindo Perkasa
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`).html;
}


  // Kirim 6-digit kode reset password
  async sendResetCode(email: string, code: string) {
    // path logo
    const logoPath = join(__dirname, '../assets/logo.png');

    return this.mailer.sendMail({
      to: email,
      from: '"Sakka App Support" <noreply@sakkakreasindo.com>',
      subject: 'Kode Reset Password',
      html: this.generateResetCodeEmail(code),
      attachments: [
        {
          filename: 'logo.png',
          path: logoPath,
          cid: 'logo',
        },
      ],
    });
  }
}
