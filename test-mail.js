const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // 🔥 INI PENTING
  auth: {
    user: 'muhammadfakhriramadhan08@gmail.com',
    pass: 'kiwjfkvooxdaghsz',
  },
});

transporter.sendMail({
  from: '"Test 👋" <EMAIL@gmail.com>',
  to: 'EMAIL@gmail.com',
  subject: 'Test SMTP',
  text: 'Kalau masuk, berarti Gmail aman',
})
.then(() => console.log('EMAIL MASUK ✅'))
.catch(err => console.error('GAGAL ❌', err));
