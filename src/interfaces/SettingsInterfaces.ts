import { CardStyle } from "./CardInterfaces";
import { ContentStyle } from "./CommonStyleInterfaces";
import { ImageStyle } from "./ImageInterfaces";

export interface GlobalSettings {
  cardStyle: CardStyle;
  imageStyle: ImageStyle;
  contentStyle: ContentStyle;
  horizontalScroll: boolean;
}
