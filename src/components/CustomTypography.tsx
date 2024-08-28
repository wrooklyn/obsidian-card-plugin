import Typography from '@mui/joy/Typography';
import { TextSection } from "../interfaces/CardInterfaces";
import { styled } from '@mui/joy';


const StyledTypography = styled(Typography, {
    shouldForwardProp: (prop) => prop !== 'textStyle',
  })<{ textStyle: TextSection['style'] }>(({ textStyle }) => ({
    fontFamily: textStyle?.font,
    fontWeight: textStyle?.fontWeight,
    fontSize: textStyle?.fontSize,
    color: textStyle?.color,
    margin: `${textStyle?.margin?.marginTop} ${textStyle?.margin?.marginRight} ${textStyle?.margin?.marginBottom} ${textStyle?.margin?.marginLeft} !important`,
  }));
  
  export const CustomTypography = ({ text, style }: TextSection) => {
    return (
      <StyledTypography level={style?.level} textStyle={style}>
        {text}
      </StyledTypography>
    );
  };
  