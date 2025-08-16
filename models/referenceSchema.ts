export type ReferenceType = 'artigo' | 'livro' | 'dissertacao' | 'site' | 'video' | 'slide';

export type BaseReference = {
  title: string;
  authors?: string; 
};

export type ArticleReference = BaseReference & {
  type: 'artigo';
  authors: string; 
  journal: string; 
  volume?: string;
  number?: string;
  pages?: string;
  year: number;
  doi?: string; 
  url?: string; 
  accessDate: string; 
};

export type BookReference = BaseReference & {
  type: 'livro';
  authors: string; 
  city: string;
  publisher: string;
  year: number;
  pages?: string;
  url?: string;
  accessDate?: string;
};

export type DissertationReference = BaseReference & {
  type: 'dissertacao';
  authors: string; 
  year: number;
  pages?: string; 
  degree: string; 
  university: string; 
  city: string;
  url?: string;
  accessDate?: string;
};

export type WebsiteReference = BaseReference & {
  type: 'site';
  organization?: string; 
  url: string;
  accessDate: string;
};

export type OnlineMediaReference = BaseReference & {
  type: 'video' | 'slide'; 
  url: string;
  accessDate: string;
};

export type Reference = 
  | ArticleReference 
  | BookReference 
  | DissertationReference 
  | WebsiteReference 
  | OnlineMediaReference; 