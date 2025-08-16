export interface Article {
  id: string;
  title: string;
  summary: string;
  journal: 'ACS Publications' | 'ScienceDirect' | 'Optica' | 'ResearchGate' | 'RSC Publishing' | 'Wiley' | 'PubMed' | 'IEEE Xplore' | 'Springer';
  url: string;
}