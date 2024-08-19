import { CardStyle } from "./CardInterfaces";
import { ContentStyle } from "./CardTemplateInterface";
import { ImageStyle } from "./ImageInterfaces";

export interface GlobalSettings {
  cardStyle: CardStyle;
  imageStyle: ImageStyle;
  typography: ContentStyle;
  horizontalScroll: boolean;
}
