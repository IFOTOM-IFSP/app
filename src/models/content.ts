import { Ionicons } from "@expo/vector-icons";
import { ImageSourcePropType } from "react-native";
import { ThemeColors } from "../constants/Colors";

export interface ContentBlock {
  type: 'text'| 'list' | 'image' | 'video' | 'code' | 'interactive' ; 
  id: string; 
}

export interface TextContent extends ContentBlock {
  type: 'text';
  value: string; 
  format?: 'paragraph' | 'heading1' | 'heading2' | 'blockquote' |  'note' ; 
}

export interface ListContent extends ContentBlock{
  type: 'list';
  items: string[]; 
  ordered?: boolean; 
  format?: 'bullet' | 'numbered'; 
}

export interface ImageContent extends ContentBlock {
  type: 'image';
  src: ImageSourcePropType,
  alt: string; 
  caption?: string; 
  width?: number; 
  height?: number;
}

export interface VideoContent extends ContentBlock {
  type: 'video';
  src: string; 
  alt: string; 
  caption?: string; 
  provider?: 'youtube' | 'vimeo' | 'other'; 
}

export interface CodeContent extends ContentBlock {
  type: 'code';
  value: string; 
  language: string;
}

export interface InteractiveContent extends ContentBlock {
  type: 'interactive';
  componentName: string; 
  props?: Record<string, any>; 
}

export interface ModulePage {
  id: string;
  title: string;
  content: (TextContent | ListContent |ImageContent | VideoContent | CodeContent  | InteractiveContent)[]; 
}

export interface Module {
  id: string;
  title: string;
  description: string;
  pages: ModulePage[];
  iconName: keyof typeof Ionicons.glyphMap; 
  iconColorName: ThemeColors;
  iconBackgroundColorName: ThemeColors;
  nextModuleId?: string | null;
  estimatedTime?: string;
  prerequisites?: string[];
  thumbnailUrl?: string; 
}