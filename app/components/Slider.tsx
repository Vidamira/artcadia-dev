import { useState } from 'react';
import ReactSimplyCarousel from 'react-simply-carousel';

function Slider() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const slideImages = [
    'https://cdn.shopify.com/s/files/1/0644/6075/1013/files/110-Grafik___2-Gross__Slider-_Artcadia.jpg?v=1720452307',
    'https://cdn.shopify.com/s/files/1/0644/6075/1013/files/10-Grafik___2-Gross__Slider-_Artcadia.jpg?v=1720440271',
    'https://cdn.shopify.com/s/files/1/0644/6075/1013/files/9-Grafik___2-Gross__Slider-_Artcadia.jpg?v=1720437312',
    'https://cdn.shopify.com/s/files/1/0644/6075/1013/files/04Grafik___2-Gross__Slider-_Artcadia.jpg?v=1720436927',
    'https://cdn.shopify.com/s/files/1/0644/6075/1013/files/Grafik___2-Gross__Slider-_Artcadia.jpg?v=1720434305',
    'https://cdn.shopify.com/s/files/1/0644/6075/1013/files/Grafik___Gross__Slider_jens_-ia.jpg?v=1720432258',
    'https://cdn.shopify.com/s/files/1/0644/6075/1013/files/Grafik___Gross__Slider-_Artcadia.jpg?v=1720432239',
    'https://cdn.shopify.com/s/files/1/0644/6075/1013/files/Grafik___Gross__Slider_Atcadia_1b1c58c9-3400-48e8-9252-22de5fb4e3e8.jpg?v=1720432221',
    'https://cdn.shopify.com/s/files/1/0644/6075/1013/files/02Grafik___2-Gross__Slider-_Artcadia.jpg?v=1720432169',
    
    // Add more image URLs here
  ];

  return (
    <div className="relative w-full">
      <h1 className="absolute bottom-0 right-0 transform -translate-x-1/2 -translate-y-1/2 text-white text-9xl font-bold z-50">DISCOVER YOUR PERFECT PIECE</h1>
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
        {slideImages.map((imageUrl, index) => (
          <div key={index} className="slider-item relative w-screen h-96 flex items-center justify-center">
            <img src={imageUrl} alt={`Slide ${index + 1} Image`} />
          </div>
        ))}
      </ReactSimplyCarousel>
    </div>
  );
}

export default Slider;