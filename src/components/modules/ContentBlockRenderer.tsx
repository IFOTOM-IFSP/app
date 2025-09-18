import {
  CodeContent,
  ContentBlock,
  ImageContent,
  InteractiveContent,
  ListContent,
  TextContent,
  VideoContent,
} from "@/models";
import React from "react";

import { CodeBlock } from "@/src/components/contentBlocks/CodeBlock";
import { ImageBlock } from "@/src/components/contentBlocks/ImageBlock";
import { InteractiveBlock } from "@/src/components/contentBlocks/InteractiveBlock";
import { TextBlock } from "@/src/components/contentBlocks/TextBlock";
import { VideoBlock } from "@/src/components/contentBlocks/VideoBlock";
import { ListBlock } from "../contentBlocks/ListBlock";

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

    case "list":
      return <ListBlock block={block as ListContent} />;

    default:
      console.warn(
        `Nenhum renderizador encontrado para o tipo de bloco: "${
          (block as any).type
        }"`
      );
      return null;
  }
};
