import { getSlideData, getDefaultSlides } from '@/lib/notion';
import { SlideData } from '@/types/slideshow';

/**
 * 슬라이드 데이터를 가져오는 API 함수
 * 
 * @returns {Promise<SlideData[]>} 슬라이드 데이터 배열
 */
export const fetchSlides = async (): Promise<SlideData[]> => {
  try {
    // 개발 환경에서도 서버 엔드포인트를 통해 데이터를 가져옵니다.
    return await getSlideData();
  } catch (error) {
    console.error('슬라이드 데이터 가져오기 실패:', error);
    // 오류 발생 시 기본 데이터 반환
    return getDefaultSlides();
  }
}
