import React from 'react';
import Card, { CardProps } from './Card';

interface CardContainerProps {
    cards: CardProps[];
  }
  
export const CardContainer: React.FC<CardContainerProps> = ({ cards }) => {
return (
    <div className="card-container">
    {cards.map((cardProps, index) => (
        <Card key={index} {...cardProps} />
    ))}
    </div>
);
};