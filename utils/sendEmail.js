const { createTransport } = require("nodemailer");
const { EMAIL } = require("../config");

const HTML_TEMPLATE = (subject, children) => {
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body {
            font-family: sans-serif;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }

        h1 {
            text-align: center;
            margin-bottom: 20px;
        }

        .info {
            margin-bottom: 20px;
        }

        .info label {
            display: block;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .info p {
            margin: 0;
        }
        
        .flex {
          display: flex;
          gap: 2;
        }
        
        /* Signature container */
        .signature-container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #fff;
        }

        /* Signature content */
        .signature-content {
            line-height: 1.5;
        }

        /* Contact information */
        .contact-info {
            margin-bottom: 10px;
        }

        .contact-info p {
            margin: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        ${children}

        <div class="signature-container">
        <div class="signature-content">
            <p>Atentamente,</p>
            <p>Préstamo de Salas - Programa de Ingenieria de Sistemas UFPS</p>
            <p><a href="https://app-classify.vercel.app">www.app-classify.vercel.app</a></p>
        </div>
    </div>
    </div>
</body>
</html>`
}

async function sendEmail({ to, subject, message }) {
  const transporter = createTransport({
    host: EMAIL.HOST,
    port: EMAIL.PORT,
    service: EMAIL.SERVICE,
    secure: false,
    auth: {
      user: EMAIL.MAIL,
      pass: EMAIL.APP_PASS,
    },
  });

  const mailOptions = {
    from: EMAIL.MAIL,
    to,
    subject,
    html: HTML_TEMPLATE(subject, message),
  };

  try {
    return await transporter.sendMail(mailOptions);
  } catch (e) {
    console.log(e);
    throw new Error("Error al enviar el email.");
  }
}

module.exports = sendEmail;