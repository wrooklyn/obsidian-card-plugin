import Typography from '@mui/joy/Typography';
import { TextSection } from "../interfaces/CardInterfaces";


export const CustomTypography = ({text, style}: TextSection)=>{
    return (
        <Typography
            level={style?.level}
            fontFamily={style?.font}
            fontWeight={style?.fontWeight}
            fontSize={style?.fontSize}
            textColor={style?.color}
        >
            {text}
        </Typography>
    ) 
}