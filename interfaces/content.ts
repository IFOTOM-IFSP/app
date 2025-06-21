import { ThemeColorName } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { ImageSourcePropType } from "react-native";

export interface ContentBlock {
  type: 'text' | 'image' | 'video' | 'code' | 'interactive' ; 
  id: string; 
}


export interface TextContent extends ContentBlock {
  type: 'text';
  value: string; 
  format?: 'paragraph' | 'heading1' | 'heading2' | 'blockquote' | 'list' | 'note' ; 
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
  id: string;
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
  content: (TextContent | ImageContent | VideoContent | CodeContent  | InteractiveContent)[]; 
}


export interface Module {
  id: string;
  title: string;
  description: string;
  pages: ModulePage[];
  iconName: keyof typeof Ionicons.glyphMap; 
  iconColorName: ThemeColorName;
  iconBackgroundColorName: ThemeColorName;
  nextModuleId?: string | null;
  estimatedTime?: string;
  prerequisites?: string[];
  thumbnailUrl?: string; 
}