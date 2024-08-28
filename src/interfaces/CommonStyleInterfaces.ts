import { ContentPosition, FontWeight, TextLevel } from "utils/types";

export interface marginStyle {
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
}

export interface CornerRadius {
  topLeft?: string;
  topRight?: string;
  bottomLeft?: string;
  bottomRight?: string;
}

export interface TextStyle {
  level?: TextLevel;
  font?: string;
  fontWeight?: FontWeight;
  fontSize?: string;
  color?: string;
  margin?: marginStyle;
}

export interface ContentStyle {
  heading?: TextStyle;
  title?: TextStyle;
  subtitle?: TextStyle;
  body?: TextStyle;
  links?: TextStyle;
  position?: ContentPosition;
}
