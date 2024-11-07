import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

const imgs = [
  //hunt slonem
  "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/Group_118.png?v=1730986816",
  //isadora caprao
  "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/Group_122.png?v=1730986815",
  //kurt giehl
  "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/Group_116.png?v=1730986816",
  //lautaro cuttica
  "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/Group_114.png?v=1730978975",
  //jens c wittig
  "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/Group_125.png?v=1730987321",
  //magdalena
  "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/Group_98.png?v=1730978975",
  //perry burns
  "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/Group_120.png?v=1730986817",
  //christine matthai
  "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/Group_100.png?v=1730978975",
  //eugenio cuttica
  "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/Group_102.png?v=1730978976",
   //sebastian wehrle
   "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/Group_124.png?v=1730986816",
  //heiko hellwig
  "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/Group_126.png?v=1730989506",
  //cuttica
  "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/Group_104.png?v=1730978976",
  
  
 
  
  
  
  
];

const ONE_SECOND = 1000;
const AUTO_DELAY = ONE_SECOND * 10;
const DRAG_BUFFER = 50;
  
const SPRING_OPTIONS = {
  type: "spring",
  mass: 1,
  stiffness: 500,
  damping: 50,
};

export const SwipeCarousel = () => {
  const [imgIndex, setImgIndex] = useState(0);

  const dragX = useMotionValue(0);

  useEffect(() => {
    const intervalRef = setInterval(() => {
      const x = dragX.get();

      if (x === 0) {
        setImgIndex((pv) => {
          if (pv === imgs.length - 1) {
            return 0;
          }
          return pv + 1;
        });
      }
    }, AUTO_DELAY);

    return () => clearInterval(intervalRef);
  }, []);

  const onDragEnd = () => {
    const x = dragX.get();

    if (x <= -DRAG_BUFFER && imgIndex < imgs.length - 1) {
      setImgIndex((pv) => pv + 1);
    } else if (x >= DRAG_BUFFER && imgIndex > 0) {
      setImgIndex((pv) => pv - 1);
    }
  };

  return (
    <div className="relative overflow-hidden bg-zinc-950 py-8 max-w-7xl">
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x: dragX }}
        animate={{ translateX: `-${imgIndex * 100}%` }}
        transition={SPRING_OPTIONS}
        onDragEnd={onDragEnd}
        className="flex cursor-grab items-center active:cursor-grabbing"
      >
        <Images imgIndex={imgIndex} />
      </motion.div>

      <Dots imgIndex={imgIndex} setImgIndex={setImgIndex} />
      <GradientEdges />
    </div>
  );
};

const Images = ({ imgIndex }: { imgIndex: number }) => {
  return (
    <>
      {imgs.map((imgSrc, idx) => {
        return (
          <motion.div
            key={idx}
            style={{
              backgroundImage: `url(${imgSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              objectFit: "cover",
    
            }}
            animate={{
              scale: imgIndex === idx ? 0.95 : 0.85,
            }}
            transition={SPRING_OPTIONS}
            className="aspect-video w-full shrink-0 rounded-xl bg-neutral-800 object-cover snap-center"
          />
        );
      })}
    </>
  );
};

const Dots = ({
  imgIndex,
  setImgIndex,
}: {
  imgIndex: number;
  setImgIndex: Dispatch<SetStateAction<number>>;
}) => {
  return (
    <div className="mt-4 flex w-full justify-center gap-2">
      {imgs.map((_, idx) => {
        return (
          <button
            key={idx}
            onClick={() => setImgIndex(idx)}
            className={`h-3 w-3 rounded-full transition-colors ${
              idx === imgIndex ? "bg-neutral-50" : "bg-neutral-500"
            }`}
          />
        );
      })}
    </div>
  );
};

const GradientEdges = () => {
  return (
    <>
      <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-[10vw] max-w-[100px] bg-gradient-to-r from-neutral-950/50 to-neutral-950/0" />
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-[10vw] max-w-[100px] bg-gradient-to-l from-neutral-950/50 to-neutral-950/0" />
    </>
  );
};

export default SwipeCarousel;