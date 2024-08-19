import Typography from '@mui/joy/Typography';
import { TextSection } from "../interfaces/CardInterfaces";


export const CustomTypography = ({text, typography}: TextSection)=>{
    return (
        <Typography
            level={typography?.level}
            fontFamily={typography?.font}
            fontWeight={typography?.fontWeight}
            fontSize={typography?.fontSize}
            textColor={typography?.color}
        >
            {text}
        </Typography>
    ) 
}