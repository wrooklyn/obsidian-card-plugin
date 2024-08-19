import { FontWeight, TextLevel } from "utils/types";

export interface PaddingStyle {
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
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
}
