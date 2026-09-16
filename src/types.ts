export interface DonutSegment {
  id: string;
  label: string;
  percentage: number; // e.g. 74.2
  color: string;
  hoverColor: string;
  accentColor: string;
  description?: string;
  subValue?: string;
}

export interface RetailItem {
  id: string;
  prefix: string;
  value: number; // e.g. 3947
  unit: string; // "ngàn tỷ đồng"
  changePercent: number; // 12.8
  changeType?: 'up' | 'down';
}

export interface InfographicData {
  title: string;
  subtitle: string;
  centralStat: {
    prefix: string; // "Việt Nam đón"
    value: number; // 15.9
    unit: string; // "triệu"
    suffix: string; // "lượt khách quốc tế,"
    changePrefix: string; // "tăng"
    changePercent: number; // 14.4
  };
  segments: DonutSegment[];
  retailSection: {
    title: string;
    totalValue: number; // 5235
    totalUnit: string; // "ngàn tỷ đồng,"
    totalChangePrefix: string; // "tăng"
    totalChangePercent: number; // 13.3
    items: RetailItem[];
  };
}

export type NumberAnimationStyle = 'jump-smooth' | 'odometer' | 'staccato';
