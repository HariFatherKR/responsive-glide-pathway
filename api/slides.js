// ESM 방식으로 작성한 서버리스 함수
import { Client } from '@notionhq/client';

// Notion API 버전 설정
const NOTION_API_VERSION = '2022-06-28';

// 기본 슬라이드 데이터
const defaultSlides = [
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

// CORS 헤더 설정
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
}

// Notion API에서 슬라이드 데이터 가져오기
async function getSlidesFromNotion(notionApiKey, databaseId) {
  // 환경 변수가 없는 경우 기본 데이터 반환
  if (!notionApiKey || !databaseId) {
    console.warn("Notion API Key 또는 Database ID가 없습니다. 기본 데이터를 반환합니다.");
    return defaultSlides;
  }

  try {
    // Notion 클라이언트 생성
    const notion = new Client({
      auth: notionApiKey,
      notionVersion: NOTION_API_VERSION
    });

    // 데이터베이스 쿼리
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'id',
          direction: 'ascending',
        },
      ],
    });

    // 결과 가공
    const slidesPromises = response.results.map(async (page) => {
      // 페이지 속성 가져오기
      const properties = page.properties;
      console.log('Notion 페이지 속성:', JSON.stringify(properties, null, 2));
      
      // 페이지 내용 가져오기
      let pageContent = '';
      try {
        const pageData = await notion.blocks.children.list({
          block_id: page.id,
        });
        
        console.log('Notion 페이지 내용:', JSON.stringify(pageData, null, 2));
        
        // 페이지 내용에서 텍스트 추출
        pageContent = pageData.results
          .filter(block => block.type === 'paragraph' && block.paragraph.rich_text.length > 0)
          .map(block => block.paragraph.rich_text.map(text => text.plain_text).join(''))
          .join('\n');
      } catch (pageError) {
        console.error('페이지 내용 가져오기 오류:', pageError);
      }
      
      // 슬라이드 데이터 구성
      return {
        id: properties.id?.number || 0,
        image: properties.image?.url || '',
        title: properties['이름']?.title?.[0]?.plain_text || '',
        description: pageContent || properties.description?.rich_text?.[0]?.plain_text || properties['이름']?.title?.[0]?.plain_text || '',
        link: properties.link?.url || '',
      };
    });

    // 모든 페이지 내용 가져오기 완료 대기
    const slides = await Promise.all(slidesPromises);
    return slides;
  } catch (error) {
    // 오류 발생 시 로그 출력 및 기본 데이터 반환
    console.error("Notion API에서 슬라이드 데이터를 가져오는 중 오류 발생:", error);
    return defaultSlides;
  }
}

// 서버리스 함수 핸들러
const handler = async (req, res) => {
  // CORS 헤더 설정
  setCorsHeaders(res);
  
  // OPTIONS 요청 처리
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // GET 요청이 아닌 경우 처리
  if (req.method !== 'GET') {
    res.status(405).json({ error: '허용되지 않는 메서드입니다.' });
    return;
  }

  try {
    // 환경 변수 가져오기
    const notionApiKey = process.env.NOTION_API_KEY || process.env.VITE_NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_ID || process.env.VITE_NOTION_DATABASE_ID;
    
    // 슬라이드 데이터 가져오기
    const slides = await getSlidesFromNotion(notionApiKey, databaseId);
    
    // 슬라이드 데이터 반환
    res.status(200).json(slides);
  } catch (error) {
    console.error('API 오류:', error);
    // 오류 발생 시 기본 데이터 반환
    res.status(200).json(defaultSlides);
  }
};

export default handler;
