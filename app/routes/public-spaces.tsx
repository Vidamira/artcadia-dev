import React, { ReactNode, useRef } from "react";
import { Link } from '@remix-run/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowUpRight } from "react-icons/fi";
import Features from "~/components/Features";
import HoverCard from '~/components/HoverCard';
import Example from "~/components/Example";

// ... other imports


export default function PublicSpaces() {

  const features = [
    {
      id: 1,
      imgUrl: "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/slide3.png?v=1724007350",
      subheading: "Art for any space",
      heading: "Public Spaces",
      customContent: {
        heading: "Consulting",
        description: "Artcadia brings together a vibrant team of art enthusiasts and industry experts from our Berlin and Manhattan locations. We share a deep understanding of the global art scene and a dedication to connecting you with the perfect piece. Whether you're a seasoned collector or just beginning your journey, our team is here to guide you with personalized advice and exceptional service.",
        buttonLabel: "Meet Our Team", // Optional: Link to a dedicated team page
        buttonLink: "/team", // Replace with desired link (e.g., team page)
      },
    },
    
  ];

  const features2 = [
    
    {
      id: 1,
      imgUrl: "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/slide2.png?v=1724007350",
      subheading: "Turning your vision into reality",
      heading: "Our Creative Partners",
      customContent: {
        heading: "Collaborating for Your Dream Artwork",
        description: "We partner with a network of talented artists, artisans, and art fabricators to deliver custom art experiences tailored to your unique needs. From concept development to final installation, our collaborative approach ensures your vision becomes a reality. We take pride in connecting you with the perfect partner to bring your artistic dreams to life.",
        buttonLabel: "Explore Custom Art",
        buttonLink: "/custom-art", // Replace with desired link (e.g., custom art page)
      },
    },
    {
      id: 2,
      imgUrl: "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/IMG_4403.jpg?v=1724851959",
      subheading: "Artcadia delivers worldwide, bringing the world's finest art to your home.",
      heading: "Contact Us",
      customContent: {
        heading: "We're Here to Help",
        description: "Have a question about a specific artwork, need assistance with your purchase, or simply want to chat about art? Our friendly and knowledgeable team is here to guide you. Let's connect!",
        buttonLabel: "Get in Touch",
        buttonLink: "/contact", // Replace with desired link (e.g., contact page)
      },
    },
    // ... other features
  ];
  


  return (
    <div className="container mx-auto max-w-7xl bg-zinc-950 text-zinc-100">
      <Features features={features} />

      <Features features={features2} />
    </div>
  );
}

