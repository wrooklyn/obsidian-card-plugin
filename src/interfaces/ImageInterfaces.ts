import { ImageFit, ImagePosition } from "utils/types";
import { PaddingStyle, CornerRadius } from "./CommonStyleInterfaces";

export interface Image {
  src: string;
  style?: ImageStyle;
}

export interface ImageStyle {
  position?: ImagePosition;
  fit?: ImageFit;
  padding?: PaddingStyle;
  cornerRadius?: CornerRadius;
  gradientOverlay?: boolean;
}
