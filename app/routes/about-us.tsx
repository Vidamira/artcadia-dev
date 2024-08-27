import React, { ReactNode, useRef } from "react";
import { Link } from '@remix-run/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowUpRight } from "react-icons/fi";
import Features from "~/components/Features";
import HoverCard from '~/components/HoverCard';

// ... other imports



export default function AboutUs() {
  const teamMembers = [
    { imageUrl: 'https://cdn.shopify.com/s/files/1/0644/6075/1013/files/IMG_9199.jpg?v=1719782667', name: 'John Doe', emailUrl: 'john.doe@example.com' },
    // ... other team members data
  ];
  
  const features = [
    {
      id: 1,
      imgUrl: "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/slide1.png?v=1724007349",
      subheading: "Collaborate",
      heading: "Built for all of us.",
    },
    {
      id: 2,
      imgUrl: "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/slide2.png?v=1724007350",
      subheading: "Quality",
      heading: "Never compromise.",
    },
    {
      id: 3,
      imgUrl: "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/slide3.png?v=1724007350",
      subheading: "Modern",
      heading: "Dress for the best.",
    },
    // ... other features
  ];
  return (
      
      <div>
        <HoverCard teamMembers={teamMembers} />
        <Features features={features} />
      </div>
      
  );
}

