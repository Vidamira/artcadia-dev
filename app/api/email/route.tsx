import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export async function POST(request: NextRequest) {
  const { email, name, message } = await request.json();

  const transport = nodemailer.createTransport({
    host: 'secure.emailsrvr.com', // Replace with your IONOS SMTP server host
    port: 465, // Use 465
    secure: true,
    auth: {
      user: process.env.MY_EMAIL, // Replace with your IONOS email address
      pass: process.env.MY_PASSWORD, // Replace with your IONOS email password
    },
  });

  const mailOptions: Mail.Options = {
    from: process.env.MY_EMAIL,
    to: process.env.MY_EMAIL, // Update to send to the actual recipient
    // cc: email, (uncomment this line if you want to send a copy to the sender)
    subject: `Message from ${name} (${email})`,
    text: message,
  };

  const sendMailPromise = () =>
    new Promise<string>((resolve, reject) => {
      transport.sendMail(mailOptions, function (err) {
        if (!err) {
          resolve('Email sent');
        } else {
          reject(err.message);
        }
      });
    });

  try {
    await sendMailPromise();
    return NextResponse.json({ message: 'Email sent' });
  } catch (err) {
    console.error(err); // Log the actual error for debugging
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
  }
}