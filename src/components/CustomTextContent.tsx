import { FC, useMemo, useState } from 'react';
import { CardTextContent, LinkItem } from '../interfaces/CardInterfaces';
import { CardContent, Link } from '@mui/joy';
import { CustomTypography } from './CustomTypography';
import { styled } from '@mui/system';
import Icon from '@mui/material/Icon';
import { ContentPosition } from 'utils/types';

const ContentWrapper = styled(CardContent)<{ position?: ContentPosition }>(({ position }) => {
  let alignmentStyles = {};
  switch (position) {
    case 'top':
      alignmentStyles = { alignSelf: 'flex-start' };
      break;
    case 'bottom':
      alignmentStyles = { alignSelf: 'flex-end' };
      break;
    case 'left':
      alignmentStyles = { alignSelf: 'flex-start', textAlign: 'left', width: '100%' };
      break;
    case 'right':
      alignmentStyles = { alignSelf: 'flex-end', textAlign: 'right', width: '100%' };
      break;
    default:
      alignmentStyles = { alignSelf: 'stretch' }; 
  }

  return {
    display: 'flex',
    flexDirection: 'column',
    ...alignmentStyles,
  };
});

const hLineStyle = {
  border: 'none',
  borderTop: '1px solid #DDDDDD',
  margin: '8px 0',
};

const renderLinkItem = (item: LinkItem) => (
  <Link
    href={item.link}
    level={item.typography?.level}
    fontFamily={item.typography?.font}
    fontWeight={item.typography?.fontWeight}
    fontSize={item.typography?.fontSize}
    textColor={item.typography?.color}
    underline="hover"
    startDecorator={item.icon && <Icon>{item.icon}</Icon>}
  >
    {item.text}
  </Link>
);

export const CustomTextContent: FC<CardTextContent> = ({
  heading,
  title,
  subtitle,
  body,
  list = [],
  expandable = false,
  position,
}) => {
  const [expanded, setExpanded] = useState(false);
  const handleToggleExpand = () => {
    if (expandable) {
      setExpanded((prev) => !prev);
    }
  };

  const expandableIcon = useMemo(() => {
    if (!expandable) return null;
    return (
      <Icon style={{ marginRight: '8px' }}>
        {expanded ? 'expand_more' : 'chevron_right'}
      </Icon>
    );
  }, [expandable, expanded]);

  return (
    <ContentWrapper position={position}>
      {heading && <CustomTypography {...heading} />}
      {title && (
        <div
          onClick={handleToggleExpand}
          style={{ display: 'flex', alignItems: 'center', cursor: expandable ? 'pointer' : 'default' }}
        >
          {expandableIcon}
          <CustomTypography {...title} />
        </div>
      )}
      {subtitle && <CustomTypography {...subtitle} />}
      {(!expandable || expanded) && (
        <>
          {body && <CustomTypography {...body} />}
          {list.map((item, index) => (
            <div key={index} style={{ marginBottom: '8px' }}>
              {renderLinkItem(item)}
              {index < list.length - 1 && <hr style={hLineStyle} />}
            </div>
          ))}
        </>
      )}
    </ContentWrapper>
  );
};
