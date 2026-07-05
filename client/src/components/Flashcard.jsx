import React, { useState } from 'react';

export default function Flashcard({ question, answer }) {
  // State to track if this specific card is flipped
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={`flashcard ${isFlipped ? 'flipped' : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="flashcard-inner">
        {/* Front of the card (Question) */}
        <div className="flashcard-front">
          <span className="label">Question</span>
          <p>{question}</p>
          <small>Click to flip</small>
        </div>
        
        {/* Back of the card (Answer) */}
        <div className="flashcard-back">
          <span className="label">Answer</span>
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
}