import React, { useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { FiMousePointer } from "react-icons/fi";

interface TeamMember {
  imageUrl: string;
  name: string;
  emailUrl: string;
}

const HoverCard = ({ teamMembers }: { teamMembers: TeamMember[] }) => {
  const [hoverIndex, setHoverIndex] = useState(-1);

  const ROTATION_RANGE = 32.5;
  const HALF_ROTATION_RANGE = 32.5 / 2;

  const cardVariants = {
    initial: {
      opacity: 0,
      scale: 0.8,
    },
    hover: {
      opacity: 1,
      scale: 1,
    },
  };

  const TiltCard = ({ imageUrl, index }: { imageUrl: string; index: number }) => {
    const ref = useRef<HTMLDivElement | null>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const xSpring = useSpring(x);
    const ySpring = useSpring(y);

    const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();

      const width = rect.width;
      const height = rect.height;

      const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
      const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

      const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
      const rY = mouseX / width - HALF_ROTATION_RANGE;

      x.set(rX);
      y.set(rY);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
      setHoverIndex(-1);
    };

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: "preserve-3d",
          transform,
        }}
        className="relative h-32 w-32 rounded-xl overflow-hidden shadow-lg"
        variants={cardVariants}
        initial="initial"
        animate={hoverIndex === index ? "hover" : "initial"}
      >
        <img
          src={imageUrl}
          alt="Team Member"
          className="object-cover h-full w-full"
        />
        {hoverIndex === index && (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-500 opacity-75 px-4 py-2 flex flex-col justify-center items-center">
            <p className="text-white text-center text-sm">{teamMembers[index].name}</p>
            <a
              href={teamMembers[index].emailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-center text-xs mt-2 hover:underline"
            >
              {teamMembers[index].emailUrl}
            </a>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {teamMembers.map((member, index) => (
        <TiltCard key={member.name} imageUrl={member.imageUrl} index={index} />
      ))}
    </div>
  );
};

export default HoverCard;