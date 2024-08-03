import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { DEFAULT_SETTINGS } from 'settings';

export interface CardProps {
  imageSrc?: string;
  heading?: string;
  content?: string | { link: string; text: string };
  borderRadius?: string | {
    topLeft?: string;
    topRight?: string;
    bottomLeft?: string;
    bottomRight?: string;
  };
  backgroundColor?: string;
  imageProperties?: {
    fit?: 'cover' | 'contain'; 
    heightPercentage?: number;
    borderRadius?: string; 
  };
  maxWidth?: string;
  maxHeight?: string; 
  tags?: string[];
  theme?: 'dark' | 'light';
}  

const CustomCard: React.FC<CardProps> = ({
  imageSrc,
  heading,
  content,
  borderRadius = "12px",
  imageProperties,
  theme = 'light'
}) => {
  const muiTheme = useTheme();

  const backgroundColor = theme === 'light' ? "#F3F8FF" : "#fff";
  const cardStyles = {
    bgcolor: backgroundColor,
    borderRadius: borderRadius,    
  };

  const imageHeight = imageProperties?.heightPercentage ? `${imageProperties.heightPercentage}%` : 'auto';
  const imageFit = imageProperties?.fit || 'cover'; // Default to 'cover' if not specified

  return (
    <Card sx={cardStyles} elevation={6}>
      {imageSrc && (
        <CardMedia
          component="img"
          image={imageSrc}
          alt={heading || 'Image'}
          sx={{
            height: imageHeight,
            objectFit: imageFit,
            borderRadius: imageProperties?.borderRadius || '0px', // No border-radius by default
          }}
        />
      )}
      <CardContent>
        {heading && (
          <Typography gutterBottom variant="h5" component="div">
            {heading}
          </Typography>
        )}
        {content && (
          typeof content === 'string' ? (
            <Typography variant="body2" color="text.secondary">
              {content}
            </Typography>
          ) : (
            <Typography variant="body2" component="a" href={content.link} sx={{ color: 'text.secondary' }}>
              {content.text}
            </Typography>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default CustomCard;
