export type ReferenceType = 'artigo' | 'livro' | 'dissertacao' | 'site' | 'video' | 'slide';

export type ArticleReference = {
  type: 'artigo';
  authors: string; 
  title: string;
  journal: string; 
  volume?: string;
  number?: string;
  pages?: string;
  year: number;
  doi?: string; 
  url?: string; 
  accessDate: string; 
};

export type BookReference = {
  type: 'livro';
  authors: string;
  title: string;
  city: string;
  publisher: string;
  year: number;
  pages?: string;
  url?: string;
  accessDate?: string;
};

export type DissertationReference = {
  type: 'dissertacao';
  authors: string; 
  title: string;
  year: number;
  pages?: string; 
  degree: string; 
  university: string; 
  city: string;
  url?: string;
  accessDate?: string;
};

export type WebsiteReference = {
  type: 'site';
  authors?: string; 
  title: string;
  organization?: string; 
  url: string;
  accessDate: string;
};

export type GenericOnlineReference = {
  type: 'video' | 'slide'; 
  title: string;
  authors?: string;
  url: string;
  accessDate: string;
};

export type Reference = ArticleReference | BookReference | DissertationReference | WebsiteReference | GenericOnlineReference;