// data/modules.ts
import { Module } from '../interfaces/content';

export const MODULES_DATA: Module[] = [
  {
    id: 'introducao-espectro',
    title: 'Introdução à Espectrofotometria',
    description: 'Conceitos básicos, importância e o espectro eletromagnético.',
    thumbnailUrl: '/images/spectrophotometry-intro.jpg',
    pages: [
      {
        id: 'o-que-e-espectrofotometria', 
        title: 'O que é Espectrofotometria?',
        content: [
          {
            id: 'intro-text-1',
            type: 'text',
            value: 'A espectrofotometria é uma técnica analítica fundamental em diversas áreas da ciência, como química, biologia e medicina.',
            format: 'paragraph',
          },
          {
            id: 'intro-image-1',
            type: 'image',
            src: '/images/espectro-geral.png',
            alt: 'Diagrama de um espectrofotômetro',
            caption: 'Visão geral de um espectrofotômetro e seus componentes.',
          },
          {
            id: 'intro-text-2',
            type: 'text',
            value: 'Ela se baseia na interação da luz com a matéria, permitindo a identificação e quantificação de substâncias.',
            format: 'paragraph',
          },
        ],
      },
      {
        id: 'o-espectro-eletromagnetico',
        title: 'O Espectro Eletromagnético',
        content: [
          {
            id: 'spectrum-text-1',
            type: 'text',
            value: 'O espectro eletromagnético abrange todas as formas de radiação eletromagnética, desde ondas de rádio até raios gama.',
            format: 'paragraph',
          },
          {
            id: 'spectrum-image-1',
            type: 'image',
            src: '/images/eletromagnetic-spectrum.png',
            alt: 'Representação do espectro eletromagnético',
            caption: 'Diferentes tipos de radiação eletromagnética e seus comprimentos de onda.',
          },
          {
            id: 'spectrum-text-2',
            type: 'text',
            value: 'A espectrofotometria utiliza principalmente a faixa visível e ultravioleta do espectro.',
            format: 'paragraph',
          },
        ],
      },
      // ... outras páginas com conteúdo detalhado
    ],
  },
  // ... outros módulos
];