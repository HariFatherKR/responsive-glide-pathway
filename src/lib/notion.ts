import { SlideData } from '@/types/slideshow';

// Notion API 관련 상수
const NOTION_API_BASE_URL = 'https://api.notion.com/v1';
const NOTION_API_VERSION = '2022-06-28';

// 환경 변수 가져오기 함수
const getEnvVariable = (name: string): string | null => {
  // 브라우저에서는 import.meta.env를 통해 환경 변수에 접근
  if (typeof window !== 'undefined') {
    // @ts-ignore - Vite의 환경 변수에 접근
    return import.meta.env[name] || null;
  }
  
  // 서버에서는 process.env를 통해 환경 변수에 접근
  return process.env[name] || null;
};

// 슬라이드 데이터를 가져오는 함수
export const getSlideData = async (): Promise<SlideData[]> => {
  try {
    // 환경 변수 확인
    const useNotionApi = getEnvVariable('VITE_USE_NOTION_API') === 'true';
    
    // 개발 환경에서는 기본 데이터 사용
    if (!useNotionApi) {
      console.log('기본 데이터를 사용합니다.');
      return getDefaultSlides();
    }
    
    console.log('서버리스 함수를 통해 슬라이드 데이터를 가져옵니다.');
    
    // 서버리스 함수 호출 - 절대 경로 사용
    try {
      // 개발 환경에서는 상대 경로 사용, 프로덕션에서는 절대 URL 사용
      const isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');
      let apiUrl;
      
      if (isProduction) {
        // 프로덕션 환경에서는 최신 배포 URL 사용
        apiUrl = 'https://responsive-glide-pathway-8qv9qtr38-seolmins-projects.vercel.app/api/slides';
      } else {
        // 개발 환경에서는 상대 경로 사용
        apiUrl = '/api/slides';
      }
      
      console.log('호출할 API URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API 오류 (${response.status}):`, errorText);
        throw new Error(`API 오류: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('가져온 데이터:', data);
      return data;
    } catch (apiError) {
      console.error('API 호출 오류, 기본 데이터를 사용합니다:', apiError);
      return getDefaultSlides();
    }
  } catch (error) {
    console.error('슬라이드 데이터 가져오기 오류:', error);
    // 오류 발생 시 기본 데이터 반환
    return getDefaultSlides();
  }
};

// 기본 슬라이드 데이터
export const getDefaultSlides = (): SlideData[] => [
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
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920&h=1080&fit=crop",
    title: "개발 환경",
    description: "개발자를 위한 완벽한 작업 환경",
    link: "/workspace"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&h=1080&fit=crop",
    title: "자연 영감",
    description: "자연에서 영감을 받은 디자인 철학",
    link: "/nature"
  }
];
