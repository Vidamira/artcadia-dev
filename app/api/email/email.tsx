import { json } from '@remix-run/node'; // or '@shopify/remix-oxygen' if using that package
import nodemailer from 'nodemailer';
import type { AppLoadContext } from '@shopify/remix-oxygen';



export async function action({ request, context }: { request: Request, context: AppLoadContext }) {
  const formData = await request.formData();
  const email = formData.get('email');
  const name = formData.get('name');
  const message = formData.get('message');
  const cartSummary = formData.get('cartSummary');

  // Ensure all necessary fields are present
  if (!email || !name || !message || !cartSummary) {
    return json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Set up Nodemailer transport using context.env
  const transporter = nodemailer.createTransport({
    host: 'smtp.ionos.com',
    port: 465,
    secure: true,
    auth: {
      user: context.env.MY_EMAIL, // Accessing from context.env
      pass: context.env.MY_PASSWORD, // Accessing from context.env
    },
  });

  const mailOptions = {
    from: context.env.MY_EMAIL, // Sender email from env
    to: context.env.MY_EMAIL, // or some other recipient
    subject: `New cart inquiry from ${name}`,
    text: `
      You have a new cart inquiry from:
      Name: ${name}
      Email: ${email}
      Message: ${message}
      Cart Summary: ${cartSummary}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return json({ error: 'Failed to send email' }, { status: 500 });
  }
}
