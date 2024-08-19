import { IconCategory } from "./types";
import BookmarkIcon from '@mui/icons-material/BookmarkBorder';
import FavoriteIcon from '@mui/icons-material/FavoriteBorder';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline';

export const iconMap: Record<IconCategory, JSX.Element> = {
    favorite: <FavoriteIcon />,
    completed: <CheckCircleIcon />,
    saved: <BookmarkIcon />,
};

  