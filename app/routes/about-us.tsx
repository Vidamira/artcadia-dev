import React, { ReactNode, useRef } from "react";
import { Link } from '@remix-run/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowUpRight } from "react-icons/fi";
import Features from "~/components/Features";
import HoverCard from '~/components/HoverCard';
import Example from "~/components/Example";

// ... other imports

interface TeamMember {
  id: number;
  name: string;
  photoUrl: string;
  address: string;
  email: string;
}

export default function AboutUs() {

  const features = [
    {
      id: 1,
      imgUrl: "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/slide3.png?v=1724007350",
      subheading: "Your online connection to the art world",
      heading: "About Artcadia",
      customContent: {
        heading: "The Team",
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
        heading: "Art & Ambiente: A Legacy of Refined Living",
        description: "For over a century, Art & Ambiente has been crafting exquisite interiors. Our rich heritage, combined with a passion for contemporary design, ensures that every space we create is a testament to timeless elegance and modern luxury.",
        buttonLabel: "Read more",
        buttonLink: "https://www.art-und-ambiente.de/", // Replace with desired link (e.g., custom art page)
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
  
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Nadine Diana Wolff",
      photoUrl: "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/image_55.jpg?v=1710147070", // Replace with actual photo URL
      address: "Kurfürstendamm 215,D-10719 Berlin , Germany",
      email: "wolff@artcadia-gallery.com",
    },
    {
      id: 2,
      name: "Ling Luo",
      photoUrl: "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/image_56.jpg?v=1710147346", // Replace with actual photo URL
      address: "Kurfürstendamm 215,D-10719 Berlin , Germany",
      email: "wolff@artcadia-gallery.com",
    },
    {
      id: 3,
      name: "Christine Matthäi",
      photoUrl: "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/image_58.jpg?v=1712177019", // Replace with actual photo URL
      address: "81 Toilsome Lane, East Hampton, NY 11937",
      email: "wolff@artcadia-gallery.com",
    },
    {
      id: 4,
      name: "Laurie Dolphin",
      photoUrl: "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/image_59.jpg?v=1712177964", // Replace with actual photo URL
      address: "401 East 88th Street,New York, NY 10128",
      email: "wolff@artcadia-gallery.com",
    },
    
    {
      id: 6,
      name: "Dott. Stefania Tabanelli",
      photoUrl: "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/image_61.jpg?v=1712178247", // Replace with actual photo URL
      address: "Via Libia, 20/6A, 40138 Bologna",
      email: "wolff@artcadia-gallery.com",
    },
    {
      id: 7,
      name: "Inka Dornemann",
      photoUrl: "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/image_60.jpg?v=1712178173", // Replace with actual photo URL
      address: "390 Lake Ave, Greenwich, CT 06830",
      email: "wolff@artcadia-gallery.com",
    },
    {
      id: 8,
      name: "Yannick Faltin",
      photoUrl: "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/IMG_9199.jpg?v=1719782667", // Replace with actual photo URL
      address: "Kurfürstendamm 215,D-10719 Berlin , Germany",
      email: "yannickfaltin@mac.com",
    },
  ];


  return (
    <div className="container mx-auto max-w-7xl bg-zinc-950 text-zinc-100">
      <Features features={features} />

      {/* Team Grid Section */}
      <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-20 my-16 p-10">
        {teamMembers.map((member) => (
          <motion.div key={member.id} className="card group rounded bg-zinc-900 hover:scale-110 transition duration-300 ease-in-out">
            <a href={`mailto:${member.email}`}> {/* Wrap the entire card in an anchor tag */}
              <img
                src={member.photoUrl}
                alt={member.name}
                className="rounded-t-lg h-48 object-cover w-full " // Zoom on hover
              />
            </a>
            <div className="p-4">
              <h3 className="text-lg font-medium mb-2">{member.name}</h3>
              <p className="text-gray-500">{member.address}</p>
            </div>
          </motion.div>
        ))}
      </section>

      <Features features={features2} />
    </div>
  );
}