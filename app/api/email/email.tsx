import { json } from '@remix-run/node'; // or '@shopify/remix-oxygen' if using that package
import nodemailer from 'nodemailer';
import type { AppLoadContext, CartApiQueryFragment } from '@shopify/remix-oxygen';

export async function action({ request, context }: { request: Request, context: AppLoadContext }) {
  const formData = await request.formData();
  const email = formData.get('email');
  const name = formData.get('name');
  const message = formData.get('message');

  // Validate required fields
  if (!email || !name || !message) {
    return json({ error: 'Missing required fields: email, name, or message' }, { status: 400 });
  }

  // Fetch cart data using the context
  const cart = await context.fetch(
    '/api/cart',
    { headers: { 'Content-Type': 'application/json' } }
  ).then(response => response.json());

  // Extract cart summary from the fetched cart data
  const cartSummary = cart.lines.nodes.map((item: CartApiQueryFragment) => ({
    productTitle: item.merchandise.product.title,
    variantTitle: item.merchandise.title,
    quantity: item.quantity,
    price: item.cost.totalAmount.amount,
  }));

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
    html: `
      <h2>New Cart Inquiry</h2>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Message:</strong> ${message}</p>
      <h3>Cart Summary:</h3>
      <ul>
        ${cartSummary
          .map(
            (item: { productTitle: string; variantTitle: string; quantity: number; price: number }) => `
              <li><strong>${item.productTitle}</strong> (${item.variantTitle}) - Quantity: ${item.quantity}, Price: €${item.price}</li>
            `
          )
          .join('')}
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
}