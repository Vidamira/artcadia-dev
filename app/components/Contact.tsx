'use client';

import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { sendEmail } from '../utils/send-email';

export type FormData = {
  name: string;
  email: string;
  message: string;
};

const Contact: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  function onSubmit(data: FormData) {
    sendEmail(data);
  }

  return (
    <div className="bg-zinc-100 p-8 rounded-lg shadow-lg max-w-lg mx-auto text-zinc-800">
      <h2 className="text-3xl font-semibold text-center mb-6 text-zinc-900">Contact Us</h2>
      <p className="text-center text-zinc-600 mb-8">
        Have questions or need assistance? Fill out the form below, and we’ll get back to you shortly.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Full Name"
            className="w-full rounded-md border border-gray-300 bg-white py-3 px-4 text-base text-gray-700 outline-none focus:border-purple-500 focus:shadow-md"
            {...register('name', { required: 'Full Name is required' })}
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            placeholder="example@domain.com"
            className="w-full rounded-md border border-gray-300 bg-white py-3 px-4 text-base text-gray-700 outline-none focus:border-purple-500 focus:shadow-md"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address',
              },
            })}
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-zinc-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            placeholder="Type your message"
            className="w-full resize-none rounded-md border border-gray-300 bg-white py-3 px-4 text-base text-gray-700 outline-none focus:border-purple-500 focus:shadow-md"
            {...register('message', { required: 'Message is required' })}
          ></textarea>
          {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>}
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="rounded-md bg-gray-500 py-3 px-8 text-base font-semibold text-white hover:bg-purple-600 transition-all duration-300 disabled:bg-purple-300 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Contact;
