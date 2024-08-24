import { FC } from 'react';
import { Card as JoyCard } from '@mui/joy';
import { Card as CardProps, CardStyle } from 'interfaces/CardInterfaces';
import { CustomImage } from './CustomImage';
import { CustomTextContent } from './CustomTextContent';
import { CustomIconButton } from './CustomIconButton';
import { styled } from '@mui/system';
import { ImageStyle } from 'interfaces/ImageInterfaces';


// Styled component to handle dynamic card styling
const StyledCard = styled(JoyCard)<{ cardStyle?: CardStyle, imageStyle?: ImageStyle}>(({ cardStyle, imageStyle }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  resize: cardStyle?.resizable ? 'both' : 'none', 
  overflow: 'hidden',
  width: cardStyle?.resizable ? 'auto' : cardStyle?.width, 
  height: cardStyle?.resizable ? 'auto' : cardStyle?.height, 
  minWidth: cardStyle?.width, 
  minHeight: cardStyle?.height, 
  backgroundColor: cardStyle?.backgroundColor,
  borderTopLeftRadius: cardStyle?.cornerRadius?.topLeft,
  borderTopRightRadius: cardStyle?.cornerRadius?.topRight,
  borderBottomLeftRadius: cardStyle?.cornerRadius?.bottomLeft,
  borderBottomRightRadius: cardStyle?.cornerRadius?.bottomRight,
  paddingTop: imageStyle?.margin?.marginTop, 
  paddingLeft: imageStyle?.margin?.marginLeft, 
  paddingRight: imageStyle?.margin?.marginRight, 
  transition: 'transform 0.3s, border 0.3s',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

export const CustomCard: FC<CardProps> = ({ style, image, content, actionIcon, metadata }) => {
  return (
    <StyledCard cardStyle={style} imageStyle={image?.style}>
      {image && <CustomImage src={image.src} style={image.style} />}
      {content && <CustomTextContent {...content}/>}
      {actionIcon && <CustomIconButton {...actionIcon} />}
    </StyledCard>
  );
};
