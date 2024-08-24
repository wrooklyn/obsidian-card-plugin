import { CardStyle } from "./CardInterfaces";
import { ImageStyle } from "./ImageInterfaces";
import { ContentStyle } from "./CommonStyleInterfaces";

export interface CardTemplate {
  cardStyle?: CardStyle;
  imageStyle?: ImageStyle;
  contentStyle?: ContentStyle;
  horizontalScroll?: boolean;
}