import { CardProps } from '../components/Card';

export function parseCardBlock(content: string): CardProps[] {
  try {
    const cleanedContent = content.replace(/^```cardview\s*/, '').replace(/\s*```$/, '').trim();
    const cards = JSON.parse(cleanedContent);

    if (!Array.isArray(cards)) {
      throw new Error('Parsed content is not an array');
    }

    return cards.map((card, index) => {
      if (typeof card !== 'object' || card === null) {
        throw new Error(`Card at index ${index} is not an object`);
      }
      return card as CardProps;
    });
  } catch (error) {
    console.error('Error parsing card block:', error);
    throw error; 
  }
}