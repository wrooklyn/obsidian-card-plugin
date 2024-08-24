import { ImageFit, ImagePosition } from "utils/types";
import { marginStyle, CornerRadius } from "./CommonStyleInterfaces";

export interface Image {
  src: string;
  style?: ImageStyle;
}

export interface ImageStyle {
  position?: ImagePosition;
  fit?: ImageFit;
  margin?: marginStyle;
  cornerRadius?: CornerRadius;
  gradientOverlay?: boolean;
}
