import { FC } from 'react';
import { Card as JoyCard } from '@mui/joy';
import { Card as CardProps, CardStyle } from 'interfaces/CardInterfaces';
import { CustomImage } from './CustomImage';
import { CustomTextContent } from './CustomTextContent';
import { CustomIconButton } from './CustomIconButton';
import { styled } from '@mui/system';
import { ImageStyle } from 'interfaces/ImageInterfaces';
import { ContentPosition } from 'utils/types';

const StyledCard = styled(JoyCard, {
  shouldForwardProp: (prop) => prop !== 'cardStyle' && prop !== 'imageStyle' && prop !== 'contentPosition',
})<{ cardStyle?: CardStyle, imageStyle?: ImageStyle, contentPosition?: ContentPosition }>(({ cardStyle, imageStyle, contentPosition }) => {
  let flexDirection: 'row' | 'row-reverse' | 'column' | 'column-reverse' = 'column';

  switch (contentPosition) {
    case 'top':
      flexDirection = 'column-reverse';
      break;
    case 'bottom':
      flexDirection = 'column';
      break;
    case 'left':
      flexDirection = 'row-reverse';
      break;
    case 'right':
      flexDirection = 'row';
      break;
    default:
      flexDirection = 'column';
  }

  return {
    display: 'flex',
    flexDirection: flexDirection,
    position: 'relative',
    resize: cardStyle?.resizable ? 'both' : 'none',
    overflow: 'hidden',
    width: cardStyle?.width || 'auto',
    minWidth: cardStyle?.width || 'auto',
    minHeight: 'auto',
    backgroundColor: cardStyle?.backgroundColor,
    borderTopLeftRadius: cardStyle?.cornerRadius?.topLeft,
    borderTopRightRadius: cardStyle?.cornerRadius?.topRight,
    borderBottomLeftRadius: cardStyle?.cornerRadius?.bottomLeft,
    borderBottomRightRadius: cardStyle?.cornerRadius?.bottomRight,
    paddingBottom: imageStyle?.margin?.marginBottom,
    paddingTop: imageStyle?.margin?.marginTop,
    paddingLeft: imageStyle?.margin?.marginLeft,
    paddingRight: imageStyle?.margin?.marginRight,
    transition: 'transform 0.2s, border 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
    '& > *:first-child': {
      flexBasis: '40%', // Image takes 40% of the width
      height: '100%',
      width: '100%',
    },
    '& > *:not(:first-child)': {
      flexBasis: '60%', // Content takes 60% of the width
      height: '100%',
      width: '100%',
    },
  };
});



export const CustomCard: FC<CardProps> = ({ style, image, content, actionIcon, metadata }) => {
  return (
    <StyledCard cardStyle={style} imageStyle={image?.style} contentPosition={content?.position}>
      {image && <CustomImage src={image.src} style={image.style}/>}
      {content && <CustomTextContent {...content}/>}
      {actionIcon && <CustomIconButton {...actionIcon} />}
    </StyledCard>
  );
};

