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
  role: string;
  photoUrl: string;
  address: string;
  email: string;
}

export default function AboutUs() {
  const features = [
    
    {
      id: 1,
      imgUrl: "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/IMG_3323.jpg?v=1728476547",
      subheading: "",
      heading: "",
      customContent: {
        heading: "The Team",
        description: "For over a century, Art & Ambiente has been crafting exquisite interiors. Our rich heritage, combined with a passion for contemporary design, ensures that every space we create is a testament to timeless elegance and modern luxury.",
        buttonLabel: "Contact",
        buttonLink: "", // Replace with desired link (e.g., custom art page)
      },
    },

    // ... other features
  ];


  const features2 = [
    
    {
      id: 1,
      imgUrl: "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/slide2.png?v=1724007350",
      subheading: "",
      heading: "",
      customContent: {
        heading: "Our Partners",
        description: "For over a century, Art & Ambiente has been crafting exquisite interiors. Our rich heritage, combined with a passion for contemporary design, ensures that every space we create is a testament to timeless elegance and modern luxury.",
        buttonLabel: "Read more",
        buttonLink: "https://www.art-und-ambiente.de/", // Replace with desired link (e.g., custom art page)
      },
    },
    {
      id: 2,
      imgUrl: "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/IMG_4956.jpg?v=1728480012",
      subheading: "",
      heading: "",
      customContent: {
        heading: "Elevate Your Space with Artcadia",
        description: "Find the perfect artwork to enhance your public space. Whether it's a hotel, restaurant, or office, our curated collections offer a wide range of styles and sizes to suit your unique needs.",
        buttonLabel: "Read more",
        buttonLink: "/public-spaces", // Replace with your desired link
      },
    },
    {
      id: 3,
      imgUrl: "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/053-230305_Nadine-by-Chris-Marxen-Headshots-Berlin_1.png?v=1728482905",
      subheading: "",
      heading: "",
      customContent: {
        heading: "Contact Us",
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
      role:"CEO and Founder",
      photoUrl: "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/image_55.jpg?v=1710147070", // Replace with actual photo URL
      address: "Kurfürstendamm 215,D-10719 Berlin , Germany",
      email: "wolff@artcadia-gallery.com",
    },
    {
      id: 2,
      name: "Ling Luo",
      role:"Project Manager, CHN",
      photoUrl: "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/image_56.jpg?v=1710147346", // Replace with actual photo URL
      address: "Kurfürstendamm 215,D-10719 Berlin , Germany",
      email: "wolff@artcadia-gallery.com",
    },
    {
      id: 3,
      name: "Christine Matthäi",
      role:"Assistant Director,East Hamptons, USA",
      photoUrl: "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/image_58.jpg?v=1712177019", // Replace with actual photo URL
      address: "81 Toilsome Lane, East Hampton, NY 11937",
      email: "wolff@artcadia-gallery.com",
    },
    {
      id: 4,
      name: "Laurie Dolphin",
      role:"Art Ambassador New York, USA",
      photoUrl: "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/image_59.jpg?v=1712177964", // Replace with actual photo URL
      address: "401 East 88th Street,New York, NY 10128",
      email: "wolff@artcadia-gallery.com",
    },
    
    {
      id: 6,
      name: "Dr. Stefania Tabanelli",
      role:"Art Ambassador, ITA",
      photoUrl: "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/image_61.jpg?v=1712178247", // Replace with actual photo URL
      address: "Via Libia, 20/6A, 40138 Bologna",
      email: "wolff@artcadia-gallery.com",
    },
    {
      id: 7,
      name: "Inka Dornemann",
      role:"Art Ambassador Aspen, US",
      photoUrl: "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/image_60.jpg?v=1712178173", // Replace with actual photo URL
      address: "390 Lake Ave, Greenwich, CT 06830",
      email: "wolff@artcadia-gallery.com",
    },
    {
      id: 8,
      name: "Yannick Faltin",
      role:"Technical Support",
      photoUrl: "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/IMG_9199.jpg?v=1719782667", // Replace with actual photo URL
      address: "Kurfürstendamm 215,D-10719 Berlin , Germany",
      email: "yannickfaltin@mac.com",
    },
  ];


  return (
    <div className="container mx-auto max-w-7xl bg-zinc-950 text-zinc-100">
      <Features features={features} />
     
      {/* Team Grid Section */}
      <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-20 p-10">
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
              <h3 className="text-lg font-bold mb-1">{member.name}</h3>
              <h4 className="text-sm text-zinc-100 font-medium mb-2">{member.role}</h4>
              <p className="text-zinc-500">{member.address}</p>
            </div>
          </motion.div>
        ))}
      </section>

      <Features features={features2} />
    </div>
  );
}