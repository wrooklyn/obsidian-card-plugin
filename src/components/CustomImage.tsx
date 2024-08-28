import { FC } from 'react';
import { AspectRatio, CardCover, CardOverflow, styled } from '@mui/joy';
import { Image as ImageProps, ImageStyle } from 'interfaces/ImageInterfaces';

const StyledAspectRatio = styled(AspectRatio, {
  shouldForwardProp: (prop) => prop !== 'imageStyle',
})<{ imageStyle?: ImageStyle }>(({ imageStyle }) => ({
  '.MuiAspectRatio-root': {
    minHeight: '100%',
  },
  '.MuiAspectRatio-content': {
    borderTopLeftRadius: imageStyle?.cornerRadius?.topRight,
    borderTopRightRadius: imageStyle?.cornerRadius?.topRight,
    borderBottomRightRadius: imageStyle?.cornerRadius?.bottomRight,
    borderBottomLeftRadius: imageStyle?.cornerRadius?.bottomLeft,
    height: 'inherit',
  },
}));

export const CustomImage: FC<ImageProps> = ({ src, style }) => {
  const ImageLayers = (
    <>
      <CardCover>
        <img
          src={src}
          alt=""
          loading="lazy"
          style={{
            borderTopLeftRadius: style?.cornerRadius?.topRight,
            borderTopRightRadius: style?.cornerRadius?.topRight,
            borderBottomRightRadius: style?.cornerRadius?.bottomRight,
            borderBottomLeftRadius: style?.cornerRadius?.bottomLeft,
            objectFit: style?.fit,
            width: '100%',
            height: '100%',
          }}
        />
      </CardCover>
      {style?.gradientOverlay && (
        <CardCover
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)',
          }}
        />
      )}
    </>
  );

  return <StyledAspectRatio imageStyle={style}>{ImageLayers}</StyledAspectRatio>;
};
