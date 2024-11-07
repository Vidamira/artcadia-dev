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
      <CartItems cart={cart} />
      <CartCheckoutActions cart={cart} />
    </div>
  );
}

function CartItems({ cart }: { cart: OptimisticCart<CartApiQueryFragment | null> }) {
  return (
    <div>
      {cart.lines.nodes.map((item, index) => (
        <div key={index} className="flex items-start mb-4 text-zinc-900">
          <img
            src={item.merchandise.image?.url}
            alt={item.merchandise.product.title}
            className="w-16 h-16 object-cover rounded mr-4"
          />
          <div>
            <strong>{item.merchandise.product.title}</strong> <br />
            <span className="text-sm text-zinc-400">{item.merchandise.title} (Qty: {item.quantity})</span> <br />
            <span className="text-sm text-zinc-800">€{item.cost.totalAmount.amount}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function CartCheckoutActions({ cart }: { cart: OptimisticCart<CartApiQueryFragment | null> }) {
  const [showForm, setShowForm] = useState(false);

  const handleOpenForm = () => {
    setShowForm(true);
  };

  return (
    <div className="mt-4">
      {!showForm ? (
        <button
          className="bg-zinc-900 text-zinc-100 px-4 py-2 rounded-md hover:bg-zinc-500 hover:text-zinc-100 transition-all"
          onClick={handleOpenForm}
        >
          Continue &rarr;
        </button>
      ) : (
        <div>
          <p className="text-zinc-900 mb-4">Please fill out the form below to send an inquiry:</p>
          <ContactForm cart={cart} />
        </div>
      )}
    </div>
  );
}

function ContactForm({ cart }: { cart: OptimisticCart<CartApiQueryFragment | null> }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const cartSummary = cart.lines.nodes.map((item) => ({
    productTitle: item.merchandise.product.title,
    variantTitle: item.merchandise.title,
    quantity: item.quantity,
    price: item.cost.totalAmount.amount,
    imageUrl: item.merchandise.image?.url,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api.email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name: 'Customer Name', // Adjust as needed
        message,
        cartSummary,
      }),
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
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 border border-zinc-700 rounded-md bg-zinc-900 text-zinc-100"
          placeholder="Leave a message (optional)"
          rows={4}
        />
      </div>
      <div className="mb-6">
        <label className="block text-zinc-100 font-semibold mb-2">Cart Summary:</label>
        {cartSummary.map((item, index) => (
          <div key={index} className="mb-4 flex items-start text-zinc-100">
            <img src={item.imageUrl} alt={item.productTitle} className="w-16 h-16 object-cover rounded mr-4" />
            <div>
              <strong>{item.productTitle}</strong> <br />
              <span className="text-sm text-zinc-400">{item.variantTitle} (Qty: {item.quantity})</span> <br />
              <span className="text-sm text-zinc-100">€{item.price}</span>
            </div>
          </div>
        ))}
      </div>
      <button type="submit" className="w-full bg-zinc-900 text-zinc-100 p-3 rounded-md font-semibold hover:bg-zinc-700">
        Send Inquiry
      </button>
    </form>
  );
}
