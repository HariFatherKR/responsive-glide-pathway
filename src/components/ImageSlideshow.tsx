
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SlideData } from '@/types/slideshow';

const ImageSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 슬라이드 데이터
  const slides: SlideData[] = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&h=1080&fit=crop",
      description: "최신 기술로 구현하는 혁신적인 솔루션",
      link: "/technology"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1920&h=1080&fit=crop",
      description: "코딩의 새로운 패러다임을 경험해보세요",
      link: "/programming"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=1920&h=1080&fit=crop",
      description: "아이디어를 현실로 만드는 창의적 공간",
      link: "/innovation"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920&h=1080&fit=crop",
      description: "개발자를 위한 완벽한 작업 환경",
      link: "/workspace"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&h=1080&fit=crop",
      description: "자연에서 영감을 받은 디자인 철학",
      link: "/nature"
    }
  ];

  // 1초마다 슬라이드 변경
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleButtonClick = () => {
    window.location.href = slides[currentSlide].link;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 배경 이미지들 */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.description}
            className="w-full h-full object-cover"
          />
          {/* 그라디언트 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" />
        </div>
      ))}

      {/* 콘텐츠 오버레이 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
            Welcome
          </h1>
          
          <p 
            key={currentSlide}
            className="text-lg md:text-xl lg:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in"
          >
            {slides[currentSlide].description}
          </p>

          <Button
            onClick={handleButtonClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl animate-fade-in"
          >
            자세히 보기
          </Button>
        </div>

        {/* 슬라이드 인디케이터 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white scale-110'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSlideshow;
