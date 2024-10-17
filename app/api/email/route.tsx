import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server'; // Adjust based on your framework

export async function POST(request: NextRequest) {
  try {
    const { email, message, cartSummary } = await request.json();

    const transporter = nodemailer.createTransport({
      host: 'secure.emailsrvr.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const cartDetails = cartSummary.map((item: any) => `
      <li>
        <strong>${item.productTitle}</strong> (${item.variantTitle})<br />
        Quantity: ${item.quantity}, Price: €${item.price}
      </li>
    `).join('');

    const mailOptions = {
      from: process.env.MY_EMAIL,
      to: process.env.MY_EMAIL, // This is where the email will be sent (your email)
      subject: `New Cart Inquiry from ${email}`,
      html: `
        <h2>New Cart Inquiry</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
        <h3>Cart Summary:</h3>
        <ul>${cartDetails}</ul>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
