import IconButton from "@mui/joy/IconButton";
import { styled } from "@mui/system"; // or "@mui/joy/styles"
import { ActionIcon } from "interfaces/CardInterfaces";
import { FC } from "react";
import { getIconByCategory, iconPositionMap } from "utils/utils";

const StyledIconButton = styled(IconButton, {
    shouldForwardProp: (prop) => prop !== 'position' && prop !== 'padding',
  })<Partial<ActionIcon>>(({ position = 'top-right', padding }) => ({
    position: 'absolute',
    ...iconPositionMap[position]?.(padding),
  }));

export const CustomIconButton: FC<ActionIcon> = ({
    category,
    variant = 'plain',
    size = 'md',
    disabled = false,
    onClick,
    position,
    padding,
    ariaLabel = "Action Icon",
}) => {

    const icon = getIconByCategory(category);

    return (
        <StyledIconButton
            variant={variant}
            size={size}
            disabled={disabled}
            onClick={onClick}
            position={position} 
            padding={padding} 
            aria-label={ariaLabel}
        >
            {icon}
        </StyledIconButton>
    );
};