import { Image } from "./ImageInterfaces";
import { CornerRadius, PaddingStyle, TextStyle } from "./CommonStyleInterfaces";
import { ContentPosition, IconCategory, IconPosition, IconVariant } from "utils/types";

export interface Card {
  style?: CardStyle;
  image?: Image;
  content?: CardTextContent;
  actionIcon?: ActionIcon;
  metadata?: Metadata;
}

export interface CardTextContent {
  link: boolean;
  heading?: TextSection;
  title?: TextSection;
  subtitle?: TextSection;
  body?: TextSection;
  list?: LinkItem[];
  position?: ContentPosition; 
  expandable?: boolean;
}

export interface TextSection {
  text: string;
  typography?: TextStyle;
}

export interface LinkItem {
  icon?: string;
  text: string;
  link: string;
  typography?: TextStyle;
}

export interface ActionIcon {
  category: IconCategory;
  variant?: IconVariant;
  size?: 'sm' | 'md' | 'lg';
  position?: IconPosition;
  padding?: PaddingStyle; 
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

export interface Metadata {
  tags: string[];
}

export interface CardStyle {
  height?: string;
  width?: string;
  backgroundColor?: string;
  cornerRadius?: CornerRadius;
  resizable?: boolean;
}
