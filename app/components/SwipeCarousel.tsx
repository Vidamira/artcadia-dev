import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

const imgs = [
  "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/2024Grafik__2-Gros_Slider-_Artcadia-Wiederhergestellt.jpg?v=1725450983",
  "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/Grafik__2-Gross_Slider-_Artcadia.jpg?v=1720434305",
  "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/Grafik__Gross_Slider-artcadia_ef120425-9b90-4a3a-bc06-1fe03a5ef8e0.jpg?v=1719568905",
  "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/slide5.png?v=1724007350",
  "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/Grafik__GrossSlider_jens-ia.jpg?v=1720432258",
  "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/110-Grafik__2-Gross_Slider-_Artcadia.jpg?v=1720452307",
  "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/Grafik__Gross_Slider_Cu.-1.jpg?v=1719569059",
  "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/Grafik__Gross_Slider_Atcadia_1b1c58c9-3400-48e8-9252-22de5fb4e3e8.jpg?v=1720432221",
  "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/Grafik__Gross_Slider_ZHUORAN_Atcadia-1.jpg?v=1719585170",
  "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/slide1.png?v=1724007349",
  "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/slide4.png?v=1724007350",
  "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/Grafik__Gross_Slider_llt.jpg?v=1719564210"
];

const ONE_SECOND = 1000;
const AUTO_DELAY = ONE_SECOND * 10;
const DRAG_BUFFER = 50;
  
const SPRING_OPTIONS = {
  type: "spring",
  mass: 3,
  stiffness: 400,
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