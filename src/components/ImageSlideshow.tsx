
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SlideData } from '@/types/slideshow';

// 기본 슬라이드 데이터 (오류 발생 시 사용)
const defaultSlides: SlideData[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&h=1080&fit=crop",
    title: "최신 기술",
    description: "최신 기술로 구현하는 혁신적인 솔루션",
    link: "/technology"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1920&h=1080&fit=crop",
    title: "코딩 패러다임",
    description: "코딩의 새로운 패러다임을 경험해보세요",
    link: "/programming"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=1920&h=1080&fit=crop",
    title: "창의적 공간",
    description: "아이디어를 현실로 만드는 창의적 공간",
    link: "/innovation"
  }
];

const ImageSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<SlideData[]>(defaultSlides);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // API에서 슬라이드 데이터 가져오기
  useEffect(() => {
    const fetchSlideData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/slides');
        
        if (!response.ok) {
          throw new Error(`API 오류: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        if (data && data.length > 0) {
          setSlides(data);
        }
        setError(null);
      } catch (err) {
        console.error('슬라이드 데이터 가져오기 오류:', err);
        setError(err instanceof Error ? err : new Error('알 수 없는 오류'));
        // 기본 데이터 사용 (이미 초기화함)
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlideData();
  }, []);

  // 1초마다 슬라이드 변경
  useEffect(() => {
    if (slides.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000); // 3초마다 변경으로 수정

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleButtonClick = () => {
    // 링크 가져오기
    let link = slides[currentSlide].link;
    
    // 링크 형식 처리
    if (link.startsWith('http://') || link.startsWith('https://')) {
      // 이미 전체 URL이면 그대로 사용
    } else if (link.startsWith('www.')) {
      // www로 시작하는 경우 https:// 추가
      link = 'https://' + link;
    } else if (!link.includes('://') && !link.startsWith('/')) {
      // 도메인으로 보이는 경우 https:// 추가
      link = 'https://' + link;
    }
    
    // 새 창에서 링크 열기
    window.open(link, '_blank');
  };

  // 로딩 중이거나 오류 발생 시 표시할 내용
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || slides.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gray-900 text-white">
        <div className="text-center max-w-lg px-4">
          <h2 className="text-2xl font-bold mb-4">데이터를 불러올 수 없습니다</h2>
          <p className="mb-6">{error instanceof Error ? error.message : '슬라이드 데이터를 가져오는 중 오류가 발생했습니다.'}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md"
          >
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

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
            alt={slide.title || slide.description}
            className="w-full h-full object-cover"
          />
          {/* 그라디언트 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />
        </div>
      ))}

      {/* 콘텐츠 오버레이 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10 px-4">
        <div className="max-w-4xl mx-auto bg-black/30 p-8 rounded-2xl backdrop-blur-sm">
          {slides[currentSlide] && (
            <>
              {/* 타이틀 - 이미지 가운데에 강조되도록 표시 */}
              <h1 
                key={`title-${currentSlide}`}
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in text-white drop-shadow-lg"
              >
                {slides[currentSlide].title}
              </h1>
              
              {/* 설명 - 타이틀 아래에 표시 */}
              <p 
                key={`desc-${currentSlide}`}
                className="text-lg md:text-xl lg:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in"
              >
                {slides[currentSlide].description}
              </p>

              {/* 파란색 링크로 이동 버튼 */}
              <Button
                onClick={handleButtonClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl animate-fade-in"
              >
                자세히 보기
              </Button>
            </>
          )}
        </div>

        {/* 슬라이드 인디케이터 - 사용자 경험 개선 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {slides.map((slide, index) => (
            <button
              key={index}
              aria-label={`슬라이드 ${index + 1} 이동`}
              className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent ${
                index === currentSlide
                  ? 'bg-white scale-110'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>

        {/* 이전/다음 버튼 - 큰 화면에서만 표시 */}
        <div className="hidden md:block">
          <button 
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all"
            aria-label="이전 슬라이드"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all"
            aria-label="다음 슬라이드"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageSlideshow;
