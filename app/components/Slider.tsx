import { useState } from 'react';
import ReactSimplyCarousel from 'react-simply-carousel';

function Slider() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const slideImages = [
    'https://cdn.shopify.com/s/files/1/0644/6075/1013/files/2024Grafik___2-Gros__Slider-_Artcadia-Wiederhergestellt.jpg?v=1724852920',
    'https://cdn.shopify.com/s/files/1/0644/6075/1013/files/slide1.png?v=1724007349',
    'https://cdn.shopify.com/s/files/1/0644/6075/1013/files/slide2.png?v=1724007350',
    'https://cdn.shopify.com/s/files/1/0644/6075/1013/files/slide3.png?v=1724007350',
    'https://cdn.shopify.com/s/files/1/0644/6075/1013/files/slide4.png?v=1724007350',
    'https://cdn.shopify.com/s/files/1/0644/6075/1013/files/slide5.png?v=1724007350',
    'https://cdn.shopify.com/s/files/1/0644/6075/1013/files/slide6.png?v=1724007350',
    'https://cdn.shopify.com/s/files/1/0644/6075/1013/files/slide7.png?v=1724007350',
    'https://cdn.shopify.com/s/files/1/0644/6075/1013/files/slide8.png?v=1724007350',
    
    
    // Add more image URLs here
  ];

  return (
    <div className="relative w-full">
      
      <ReactSimplyCarousel
        activeSlideIndex={activeSlideIndex}
        onRequestChange={setActiveSlideIndex}
        autoplay={true}
        autoplayDirection='forward'
        centerMode={true}
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