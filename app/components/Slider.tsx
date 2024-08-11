import { useState } from 'react';
import ReactSimplyCarousel from 'react-simply-carousel';

function Slider() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  return (
    <div className="relative w-full">
      <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-9xl font-bold z-50">Your Headline Here</h1>
      <ReactSimplyCarousel
        activeSlideIndex={activeSlideIndex}
        onRequestChange={setActiveSlideIndex}
        autoplay={true}
        autoplayDirection='forward'
        centerMode={false}
        infinite={true}
        itemsToShow={1}
        itemsToScroll={1}
        
        responsiveProps={[
          {
            itemsToShow: 1,
            itemsToScroll: 1,
            minWidth: 768,
          },
        ]}
        speed={500}
        delay={3000}
        easing="linear"
      >
        {/* here you can also pass any other element attributes. Also, you can use your custom components as slides */}
        <div className="slider-item relative w-screen h-96 bg-zinc-800 flex items-center justify-center text-white">
          slide 1
        </div>
        <div className="slider-item relative w-screen h-96 bg-zinc-700 flex items-center justify-center text-white">
          slide 2
        </div>
        <div className="slider-item relative w-screen h-96 bg-zinc-600 flex items-center justify-center text-white">
          slide 3
        </div>
        <div className="slider-item relative w-screen h-96 bg-zinc-500 flex items-center justify-center text-white">
          slide 4
        </div>
        <div className="slider-item relative w-screen h-96 bg-zinc-400 flex items-center justify-center text-white">
          slide 5
        </div>
        <div className="slider-item relative w-screen h-96 bg-zinc-300 flex items-center justify-center text-white">
          slide 6
        </div>
        <div className="slider-item relative w-screen h-96 bg-zinc-200 flex items-center justify-center text-white">
          slide 7
        </div>
        <div className="slider-item relative w-screen h-96 bg-zinc-100 flex items-center justify-center text-white">
          slide 8
        </div>
        <div className="slider-item relative w-screen h-96 bg-zinc-200 flex items-center justify-center text-white">
          slide 9
        </div>
        
        
        
        
      </ReactSimplyCarousel>
    </div>
  );
}

export default Slider;