import React from 'react';
import '../../styles/cardStyles.css';

export interface CardProps {
    imageSrc?: string;
    heading?: string;
    content?: string | { link: string; text: string };
    borderRadius?: string;
    backgroundColor?: string;
    maxWidth?: string;
    tags?: string[];    
  }
  
  const Card: React.FC<CardProps> = ({ imageSrc, heading, content, borderRadius = "8px", backgroundColor = "#fff", maxWidth = "300px" }) => {
    return (
      <div className="card" style={{ borderRadius, backgroundColor, maxWidth }}>
        {imageSrc && <img src={imageSrc} alt={heading} style={{ borderRadius: borderRadius }} />}
        {heading && <h3>{heading}</h3>}
        {content && (
          typeof content === 'string' ? <p>{content}</p> :
          <a href={content.link} data-href={content.link}>{content.text}</a>
        )}
      </div>
    );
  };
  
  export default Card;
  