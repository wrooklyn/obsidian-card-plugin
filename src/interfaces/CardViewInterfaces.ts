import { Card } from "./CardInterfaces";
import { CardTemplate } from "./CardTemplateInterface";

export interface CardViewConfig {
  template?: string | CardTemplate;
  cards: Card[];
}
