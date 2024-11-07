// app/routes/api.email.tsx
import { json, type ActionFunction } from '@remix-run/node';

export const action: ActionFunction = async ({ request, context }) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  // Dynamically import Nodemailer within the action
  const nodemailer = await import('nodemailer');

  const { email, name, message, cartSummary } = await request.json();

  if (!email || !name || !message || !cartSummary) {
    return json({ error: 'Missing required fields' }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.ionos.com',
    port: 465,
    secure: true,
    auth: {
      user: context.env.MY_EMAIL,
      pass: context.env.MY_PASSWORD,
    },
  });

  const mailOptions = {
    from: context.env.MY_EMAIL,
    to: context.env.MY_EMAIL,
    subject: `New Cart Inquiry from ${email}`,
    html: `
      <h2>New Cart Inquiry</h2>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Message:</strong> ${message}</p>
      <h3>Cart Summary:</h3>
      <ul>
        ${cartSummary.map(
          (item: { productTitle: string; variantTitle: string; quantity: number; price: number }) => `
            <li><strong>${item.productTitle}</strong> (${item.variantTitle}) - Quantity: ${item.quantity}, Price: €${item.price}</li>
          `
        ).join('')}
      </ul>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return json({ message: 'Email sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return json({ error: 'Failed to send email.' }, { status: 500 });
  }
};
