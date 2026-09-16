import { InfographicData } from '../types';

export const initialInfographicData: InfographicData = {
  title: 'Bức tranh du lịch 8 tháng năm 2026',
  subtitle: 'của cả nước (so với cùng kỳ năm 2025)',
  centralStat: {
    prefix: 'Việt Nam đón',
    value: 15.9,
    unit: 'triệu',
    suffix: 'lượt khách quốc tế,',
    changePrefix: 'tăng',
    changePercent: 14.4,
  },
  segments: [
    {
      id: 'asia',
      label: 'Châu Á',
      percentage: 74.2,
      color: '#38bdf8', // Light sky blue
      hoverColor: '#7dd3fc',
      accentColor: '#0284c7',
      description: 'Thị trường trọng điểm lớn nhất với các nước Đông Bắc Á, Đông Nam Á',
    },
    {
      id: 'europe',
      label: 'Châu Âu',
      percentage: 16.8,
      color: '#93c5fd', // Light pastel blue
      hoverColor: '#bfdbfe',
      accentColor: '#3b82f6',
      description: 'Tăng trưởng mạnh nhờ chính sách thị thực thông thoáng và đường bay mới',
    },
    {
      id: 'americas',
      label: 'Châu Mỹ',
      percentage: 5.6,
      color: '#2563eb', // Royal blue accent
      hoverColor: '#3b82f6',
      accentColor: '#1d4ed8',
      description: 'Lượng khách ổn định từ Mỹ và Canada có thời gian lưu trú dài',
    },
    {
      id: 'others',
      label: 'Thị trường khác',
      percentage: 3.4,
      color: '#0284c7', // Deep sky blue
      hoverColor: '#38bdf8',
      accentColor: '#0369a1',
      description: 'Châu Đại Dương, Châu Phi và các thị trường mới nổi',
    },
  ],
  retailSection: {
    title: 'Tổng mức bán lẻ hàng hóa và doanh thu dịch vụ tiêu dùng',
    totalValue: 5235,
    totalUnit: 'ngàn tỷ đồng,',
    totalChangePrefix: 'tăng',
    totalChangePercent: 13.3,
    items: [
      {
        id: 'retail',
        prefix: 'Doanh thu bán lẻ hàng hóa đạt',
        value: 3947,
        unit: 'ngàn tỷ đồng,',
        changePercent: 12.8,
        changeType: 'up',
      },
      {
        id: 'accommodation',
        prefix: 'Dịch vụ lưu trú, ăn uống đạt',
        value: 670,
        unit: 'ngàn tỷ đồng,',
        changePercent: 16.4,
        changeType: 'up',
      },
      {
        id: 'travel',
        prefix: 'Du lịch lữ hành đạt',
        value: 68,
        unit: 'ngàn tỷ đồng,',
        changePercent: 17.1,
        changeType: 'up',
      },
      {
        id: 'otherServices',
        prefix: 'Các dịch vụ khác đạt gần',
        value: 549,
        unit: 'ngàn tỷ đồng,',
        changePercent: 13.2,
        changeType: 'up',
      },
    ],
  },
};
