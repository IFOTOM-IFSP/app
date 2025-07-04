import {
  CodeContent,
  ContentBlock,
  ImageContent,
  InteractiveContent,
  TextContent,
  VideoContent,
} from "@/schema/contentSchema";
import React from "react";

import { CodeBlock } from "@/components/specific/renderers/CodeBlock";
import { ImageBlock } from "@/components/specific/renderers/ImageBlock";
import { InteractiveBlock } from "@/components/specific/renderers/InteractiveBlock";
import { TextBlock } from "@/components/specific/renderers/TextBlock";
import { VideoBlock } from "@/components/specific/renderers/VideoBlock";

type ContentBlockRendererProps = {
  block: ContentBlock;
};

export const ContentBlockRenderer: React.FC<ContentBlockRendererProps> = ({
  block,
}) => {
  switch (block.type) {
    case "text":
      return <TextBlock block={block as TextContent} />;

    case "image":
      return <ImageBlock block={block as ImageContent} />;

    case "video":
      return <VideoBlock block={block as VideoContent} />;

    case "code":
      return <CodeBlock block={block as CodeContent} />;

    case "interactive":
      return <InteractiveBlock block={block as InteractiveContent} />;

    default:
      console.warn(
        `Nenhum renderizador encontrado para o tipo de bloco: "${
          (block as any).type
        }"`
      );
      return null;
  }
};
