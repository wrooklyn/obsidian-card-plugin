import { CardStyle } from "./CardInterfaces";
import { ImageStyle } from "./ImageInterfaces";
import { TextStyle } from "./CommonStyleInterfaces";

export interface CardTemplate {
  cardStyle?: CardStyle;
  imageStyle?: ImageStyle;
  contentStyle?: ContentStyle;
}

export interface ContentStyle {
  heading?: TextStyle;
  title?: TextStyle;
  subtitle?: TextStyle;
  body?: TextStyle;
  links?: TextStyle;
}
