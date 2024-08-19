import React, { ReactNode, useRef } from "react";
import { Link } from '@remix-run/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowUpRight } from "react-icons/fi";
import Features from "~/components/Features";

// ... other imports

export default function AboutUs() {
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
        <Features features={features} />
      </div>
      
  );
}

