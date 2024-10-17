import type { CartApiQueryFragment } from 'storefrontapi.generated';
import type { CartLayout } from '~/components/CartMain';
import { Money, type OptimisticCart } from '@shopify/hydrogen';
import React, { useState } from 'react';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({ cart, layout }: CartSummaryProps) {
  return (
    <div aria-labelledby="cart-summary" className="bg-zinc-200 rounded p-4 mt-4 min-w-2xs">
      <h4 className="text-zinc-900 font-bold pt-4">Totals</h4>
      <dl className="cart-subtotal text-zinc-900 font-light">
        <dd>
          {cart.cost?.subtotalAmount?.amount ? (
            <Money data={cart.cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </dd>
      </dl>
      <br />
      
      <CartCheckoutActions cart={cart} />
    </div>
  );
}

function CartCheckoutActions({ cart }: { cart: OptimisticCart<CartApiQueryFragment | null> }) {
  const [showForm, setShowForm] = useState(false);

  const handleOpenForm = () => {
    setShowForm(true); // Show the form when clicking the "Continue" button
  };

  return (
    <div>
      {!showForm ? (
        <button
          className="bg-zinc-900 text-zinc-100 px-4 py-2 rounded-md hover:bg-zinc-500 hover:text-zinc-100"
          onClick={handleOpenForm}
        >
          Continue &rarr;
        </button>
      ) : (
        <ContactForm cart={cart} />
      )}
    </div>
  );
}

function ContactForm({ cart }: { cart: OptimisticCart<CartApiQueryFragment | null> }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Create a summary of the cart items to be sent via email
  const cartSummary = cart.lines.nodes.map((item) => {
    const productTitle = item.merchandise.product.title; // Get the product title
    const variantTitle = item.merchandise.title; // Get the variant title (e.g., dimensions)
    const price = item.cost.totalAmount.amount; // Get the price
    const imageUrl = item.merchandise.image?.url; // Get the product image URL

    return {
      productTitle,
      variantTitle,
      quantity: item.quantity,
      price,
      imageUrl,
    };
  });

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('email', email);
  formData.append('name', 'Customer Name'); // Replace with actual customer name
  formData.append('message', message);
  formData.append('cartSummary', JSON.stringify(cartSummary)); // Send cart items

  const response = await fetch('/api/email', {
    method: 'POST',
    body: formData,
  });

  if (response.ok) {
    alert('Inquiry sent successfully!');
  } else {
    const result = await response.json();
    alert(result.error || 'Failed to send inquiry.');
  }
};

  

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-950 p-8 rounded-lg text-zinc-100">
      <h3 className="text-2xl font-bold mb-6">Contact Us</h3>
      
      <div className="mb-6">
        <label htmlFor="email" className="block text-zinc-100 font-semibold mb-2">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-zinc-700 rounded-md bg-zinc-900 text-zinc-100"
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="message" className="block text-zinc-100 font-semibold mb-2">Message:</label>
        <textarea
          id="message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 border border-zinc-700 rounded-md bg-zinc-900 text-zinc-100"
          placeholder="Leave a message (optional)"
          rows={4}
        />
      </div>


      <div className="mb-6">
        <label className="block text-zinc-100 font-semibold mb-2">Cart Summary:</label>
        {cartSummary.map((item) => (
          <div key={item.productTitle} className="mb-4 flex items-start text-zinc-100">
            <img src={item.imageUrl} alt={item.productTitle} className="w-16 h-16 object-cover rounded mr-4" />
            <div>
              <strong className="text-zinc-100">{item.productTitle}</strong> <br />
              <span className="text-sm text-zinc-400">{item.variantTitle} (Qty: {item.quantity})</span> <br />
              <span className="text-sm text-zinc-100">€{item.price}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="w-full bg-zinc-900 text-zinc-100 p-3 rounded-md font-semibold hover:bg-zinc-700 transition-colors"
      >
        Send Inquiry
      </button>
    </form>
  );
}


