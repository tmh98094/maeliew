export interface ServiceItem {
  title: string;
  price: string;
  features: string[];
  note?: string;
  serviceData?: any; // Optional service data for WhatsApp integration
}

export interface ServiceCategory {
  category: string;
  items: ServiceItem[];
}

export interface PortfolioItem {
  id: number;
  src: string;
  category: 'wedding' | 'editorial' | 'celebrity';
  title: string;
}