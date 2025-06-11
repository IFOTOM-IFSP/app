import { ContentBlock } from "@/interfaces/content";
import React from "react";

import { ImageBlock } from "@/components//renderers/ImageBlock";
import { InteractiveBlock } from "@/components//renderers/InteractiveBlock";
import { TextBlock } from "@/components//renderers/TextBlock";
import { VideoBlock } from "@/components//renderers/VideoBlock";
import { CodeBlock } from "@/components/renderers/CodeBlock";

const RENDERER_MAP = {
  text: TextBlock,
  image: ImageBlock,
  code: CodeBlock,
  interactive: InteractiveBlock,
  video: VideoBlock,
};

type ContentBlockRendererProps = {
  block: ContentBlock;
};

export const ContentBlockRenderer: React.FC<ContentBlockRendererProps> = ({
  block,
}) => {
  const ComponentToRender = RENDERER_MAP[block.type];

  if (!ComponentToRender) {
    console.warn(
      `Nenhum renderizador encontrado para o tipo de bloco: "${block.type}"`
    );
    return null;
  }

  // @ts-ignore
  return <ComponentToRender block={block} />;
};
