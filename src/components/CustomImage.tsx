import { FC } from 'react';
import { AspectRatio, CardCover, CardOverflow } from '@mui/joy';
import { Image as ImageProps } from 'interfaces/ImageInterfaces';

export const CustomImage: FC<ImageProps> = ({ src, style }) => {
  const useCardOverflow = style?.padding;
  const borderRadius = style?.cornerRadius
  ? `${style?.cornerRadius.topLeft || '0'} ${style.cornerRadius.topRight || '0'} ${style.cornerRadius.bottomRight || '0'} ${style.cornerRadius.bottomLeft || '0'}`
  : undefined;

  const ImageLayers = (
    <>
      <CardCover>
        <img src={src} alt="" loading="lazy" />
      </CardCover>
      {style?.gradientOverlay && (
        <CardCover
          sx={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)',
          }}
        />
      )}
    </>
  );

  return useCardOverflow ? (
    <CardOverflow>
      <AspectRatio style={{ borderRadius }}>
        {ImageLayers}
      </AspectRatio>
    </CardOverflow>
  ) : (
    <AspectRatio
      sx={{
        borderRadius,
      }}
    >
      {ImageLayers}
    </AspectRatio>
  );
};