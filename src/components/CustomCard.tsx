import { FC } from 'react';
import { Card as JoyCard } from '@mui/joy';
import { Card as CardProps } from 'interfaces/CardInterfaces';
import { CustomImage } from './CustomImage';
import { CustomTextContent } from './CustomTextContent';
import { CustomIconButton } from './CustomIconButton';
import { styled } from '@mui/system';

//TODO
//manage the merging of the settings and styling 

// Styled component to handle dynamic card styling
const StyledCard = styled(JoyCard)<{ resizable?: boolean }>(({ resizable, theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  resize: resizable ? 'both' : 'none',
  overflow: 'hidden',
  width: resizable ? 'auto' : '300px', // Fallback width if not resizable
  height: resizable ? 'auto' : '400px', // Fallback height if not resizable
  backgroundColor: theme.palette.background.paper,
  transition: 'transform 0.3s, border 0.3s',
  '&:hover': {
    borderColor: theme.palette.primary.outlinedHoverBorder,
    transform: 'translateY(-2px)',
  },
}));

//TODO

export const CustomCard: FC<CardProps> = ({ style, image, content, actionIcon, metadata }) => {
  const borderRadius = style?.cornerRadius
    ? `${style.cornerRadius?.topLeft || '0'} ${style.cornerRadius?.topRight || '0'} ${style.cornerRadius?.bottomRight || '0'} ${style.cornerRadius?.bottomLeft || '0'}`
    : undefined;

  return (
    <StyledCard resizable={style?.resizable} sx={{ borderRadius, backgroundColor: style?.backgroundColor }}>
      {image && <CustomImage src={image.src} style={image.style} />}
      {content && <CustomTextContent {...content} position={content.position} />}
      {actionIcon && <CustomIconButton {...actionIcon} />}
    </StyledCard>
  );
};
