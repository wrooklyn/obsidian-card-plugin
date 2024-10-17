import { FC, useMemo, useState, useEffect, useRef } from 'react';
import { CardTextContent, LinkItem } from '../interfaces/CardInterfaces';
import { CardContent, Link } from '@mui/joy';
import { CustomTypography } from './CustomTypography';
import Icon from '@mui/material/Icon';
import { adjustPixelValue } from 'utils/utils';


const hLineStyle = {
  border: 'none',
  borderTop: '1px solid #DDDDDD',
  margin: '8px 0',
};

const renderLinkItem = (item: LinkItem) => (
  <Link
    href={item.link}
    level={item.style?.level}
    fontFamily={item.style?.font}
    fontWeight={item.style?.fontWeight}
    fontSize={item.style?.fontSize}
    textColor={item.style?.color}
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
}) => {
  const [expanded, setExpanded] = useState(!expandable);
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);

  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      const calculatedHeight = expanded ? bodyRef.current.scrollHeight : 0;
      setContentHeight(calculatedHeight);
    }
  }, [expanded, body]);

  const handleToggleExpand = () => {
    if (expandable) {
      setExpanded((prev) => !prev);
    }
  };

  const expandableIcon = useMemo(() => {
    if (!expandable) return null;
    return (
      <Icon style={{ 
          marginLeft: adjustPixelValue(title?.style?.margin?.marginLeft, -40), 
          marginTop: title?.style?.margin?.marginTop, marginBottom: title?.style?.margin?.marginBottom,
        }} 
          className="material-icons-round">
        {expanded ? 'expand_more' : 'chevron_right'}
      </Icon>
    );
  }, [expandable, expanded]);

  return (
    <CardContent>
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
      <div
        ref={bodyRef}
        style={{
          maxHeight: expanded ? 'none' : `${contentHeight}px`,
          overflow: 'hidden',
          transition: 'max-height 0.3s ease',
        }}
      >
        {body && <CustomTypography {...body} />}
        {list.map((item, index) => (
          <div key={index} style={{ marginBottom: '8px' }}>
            {renderLinkItem(item)}
            {index < list.length - 1 && <hr style={hLineStyle} />}
          </div>
        ))}
      </div>
    </CardContent>
  );
};
