// Localização: src/data/articleData.ts

export interface Article {
  id: string;
  title: string;
  summary: string;
  journal: 'ACS Publications' | 'ScienceDirect' | 'Optica' | 'ResearchGate' | 'RSC Publishing' | 'Wiley' | 'PubMed' | 'IEEE Xplore' | 'Springer';
  url: string;
}

export const ARTICLE_DATA: Article[] = [
  {
    id: '1',
    title: 'A 3D-printed smartphone imaging platform for real-time spectroscopic measurement of sweat metabolites',
    summary: 'Um método inovador para medição espectroscópica de metabolitos no suor utilizando um smartphone.',
    journal: 'ScienceDirect',
    url: 'https://www.sciencedirect.com/science/article/pii/S2468067221000717',
  },
  {
    id: '2',
    title: 'A compact, low-cost, 3D-printed spectroscope for use in undergraduate laboratories',
    summary: 'Desenvolvimento de um espectroscópio compacto e de baixo custo impresso em 3D para laboratórios de graduação.',
    journal: 'Optica',
    url: 'https://opg.optica.org/boe/fulltext.cfm?uri=boe-5-11-3792&id=301884',
  },
  {
    id: '3',
    title: 'Construction and Evaluation of a Low-Cost, Simple Spectrophotometer for Use in the High School Classroom',
    summary: 'Avaliação de um espectrofotômetro de baixo custo para salas de aula do ensino secundário, focando na sua construção e utilidade educacional.',
    journal: 'ACS Publications',
    url: 'https://pubs.acs.org/doi/abs/10.1021/ed083p56?ref=PDF',
  },
  {
    id: '4',
    title: 'Teaching UV–Vis Spectroscopy with a 3D-Printable Smartphone Spectrophotometer',
    summary: 'Um guia prático para ensinar espectroscopia UV-Vis usando um espectrofotômetro impresso em 3D e um smartphone.',
    journal: 'ACS Publications',
    url: 'https://pubs.acs.org/doi/10.1021/acs.jchemed.5b00654?ref=recommended',
  },
  {
    id: '5',
    title: 'The Design of a User-Friendly 3D-Printed Platform for Smartphone-Based Colorimetric and Spectrometric Assays',
    summary: 'Desenho de uma plataforma de fácil utilização, impressa em 3D, para ensaios colorimétricos e espectrométricos com smartphone.',
    journal: 'ACS Publications',
    url: 'https://pubs.acs.org/doi/10.1021/acs.jchemed.4c01173?ref=recommended',
  },
  {
    id: '7',
    title: 'Resolving Spectral Lines with a Periscope-Type DVD Spectroscope',
    summary: 'Análise da capacidade de resolução de um espectroscópio tipo periscópio, construído com um DVD, para linhas espectrais.',
    journal: 'ResearchGate',
    url: 'https://www.researchgate.net/publication/231268223_Resolving_Spectral_Lines_with_a_Periscope-Type_DVD_Spectroscope',
  },
  {
    id: '8',
    title: 'Development of an Open-Source and Low-Cost Smartphone Spectrophotometer Based on the Tricolor Model',
    summary: 'Criação de um espectrofotômetro open-source e de baixo custo baseado no modelo de cor tricromático para smartphones.',
    journal: 'ACS Publications',
    url: 'https://pubs.acs.org/doi/10.1021/acs.jchemed.0c01085?ref=PDF',
  },
  {
    id: '9',
    title: 'A simple and low-cost paper-based spectrophotometer',
    summary: 'Demonstração de um espectrofotômetro de baixo custo construído com base em papel, para análises simples.',
    journal: 'RSC Publishing',
    url: 'https://pubs.rsc.org/en/content/articlelanding/2013/an/c3an01441j',
  },
  {
    id: '10',
    title: 'Low-Cost Spectrograph Based on a WebCam: A Student Project',
    summary: 'Projeto estudantil para o desenvolvimento de um espectrógrafo de baixo custo utilizando uma webcam.',
    journal: 'ResearchGate',
    url: 'https://www.researchgate.net/publication/260057271_Low-Cost_Spectrograph_Based_on_a_WebCam_A_Student_Project',
  },
  {
    id: '11',
    title: 'A critical review on smartphone-based spectrometers',
    summary: 'Uma revisão crítica e abrangente sobre as capacidades e limitações dos espectrômetros baseados em smartphones.',
    journal: 'RSC Publishing',
    url: 'https://pubs.rsc.org/en/content/articlelanding/2021/an/d1an00025j',
  },
  {
    id: '12',
    title: 'An Accessible, 3D-Printed, Single-Beam, Smartphone-Based Vis-Spectrophotometer',
    summary: 'Detalhes da construção de um espectrofotômetro de feixe único, impresso em 3D, acessível e baseado em smartphone.',
    journal: 'ACS Publications',
    url: 'https://pubs.acs.org/doi/10.1021/acs.jchemed.0c00404?ref=PDF',
  },
  {
    id: '13',
    title: 'A simple and low-cost spectrophotometer using a smartphone for analytical chemistry education',
    summary: 'Construção de um espectrofotômetro simples e de baixo custo para o ensino de química analítica.',
    journal: 'ACS Publications',
    url: 'https://pubs.acs.org/doi/10.1021/acs.jchemed.8b00870?ref=PDF',
  },
  {
    id: '14',
    title: 'A smartphone-based spectrophotometer: A new approach for all-in-one quantitative analysis',
    summary: 'Apresentação de uma nova abordagem para análise quantitativa integrada utilizando um espectrofotômetro de smartphone.',
    journal: 'Wiley',
    url: 'https://onlinelibrary.wiley.com/doi/10.1002/jbio.201700382',
  },
  {
    id: '15',
    title: 'A 3D-Printed Platform for Smartphone-Based Spectrometric and Colorimetric Assays',
    summary: 'Uso de impressão 3D para criar uma plataforma para ensaios espectrométricos e colorimétricos com smartphone.',
    journal: 'PubMed',
    url: 'https://pubmed.ncbi.nlm.nih.gov/31735208/',
  },
  {
    id: '16',
    title: 'Smartphone-based point-of-care analysis of triglycerides by a 3D-printed accessory',
    summary: 'Análise de triglicerídeos em ponto de atendimento com um acessório impresso em 3D para smartphone.',
    journal: 'ScienceDirect',
    url: 'https://www.sciencedirect.com/science/article/abs/pii/S0925400517316209?via%3Dihub',
  },
  {
    id: '17',
    title: 'Ultra-portable, smartphone-based spectrometer for heavy metal concentration measurement',
    summary: 'Desenvolvimento de um espectrômetro ultraportátil para medir a concentração de metais pesados em água potável.',
    journal: 'Springer',
    url: 'https://link.springer.com/article/10.1007/s13201-021-01519-w',
  },
  {
    id: '18',
    title: 'Smartphone-based biosensors for regenerative medicine applications',
    summary: 'Revisão sobre biossensores baseados em smartphones e as suas aplicações no campo da medicina regenerativa.',
    journal: 'ScienceDirect',
    url: 'https://www.sciencedirect.com/science/article/abs/pii/B9780128186428000016?ref%3DPDF%26via%3Dihub',
  },
  {
    id: '19',
    title: '“Spec-Connect”—A Simple, Distance-Based Spectrometer for the Smartphone',
    summary: 'Apresentação do “Spec-Connect”, um espectrômetro simples baseado na distância para smartphones.',
    journal: 'ACS Publications',
    url: 'https://pubs.acs.org/doi/10.1021/ed3007499?ref=PDF',
  },
  {
    id: '20',
    title: 'The spectrum of the cuprammonium ion',
    summary: 'Estudo clássico sobre o espectro de absorção do íon cupramônio, um conceito fundamental em química.',
    journal: 'Wiley',
    url: 'https://onlinelibrary.wiley.com/doi/10.1002/recl.19580771110',
  },
  {
    id: '21',
    title: 'A Low-Cost Smartphone-Based Spectrometer for Sensing Applications',
    summary: 'Desenvolvimento de um espectrômetro de baixo custo para aplicações de sensoriamento utilizando um smartphone.',
    journal: 'IEEE Xplore',
    url: 'https://ieeexplore.ieee.org/document/9165196/',
  },
  {
    id: '22',
    title: 'Open-Source 3D-Printable Gonio-Spectrometer',
    summary: 'Construção de um gonio-espectrômetro open-source e imprimível em 3D para análises angulares.',
    journal: 'ACS Publications',
    url: 'https://pubs.acs.org/doi/10.1021/acs.jchemed.7b00254?ref=PDF',
  },
  {
    id: '23',
    title: 'Paper-Based SERS Analysis Using a Smartphone-Based Spectrometer',
    summary: 'Análise SERS (Surface-Enhanced Raman Scattering) em papel, utilizando um espectrômetro de smartphone.',
    journal: 'ACS Publications',
    url: 'https://pubs.acs.org/doi/10.1021/acsomega.0c05123',
  },
  {
    id: '24',
    title: 'Observing the Red-Absorbing Character of Vitamin B12 and Its Derivatives Using a Low-Cost Smartphone Spectrometer',
    summary: 'Uso de um espectrômetro de baixo custo para observar a absorção na região do vermelho pela vitamina B12.',
    journal: 'ACS Publications',
    url: 'https://pubs.acs.org/doi/10.1021/acs.jchemed.2c00060',
  },
  {
    id: '25',
    title: 'Smartphone Spectrometry',
    summary: 'Uma visão geral e introdução à espectrometria baseada em smartphones.',
    journal: 'ACS Publications',
    url: 'https://pubs.acs.org/doi/10.1021/ac502080t',
  }
];
