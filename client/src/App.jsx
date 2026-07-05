import React, { useState } from 'react';
import Flashcard from './components/Flashcard';
import { fetchFlashcards } from './services/api';
import { validateFlashcardStructure } from './utils/validator'; // Import our armor validator
import './App.css'; 

export default function App() {
  const [topic, setTopic] = useState('');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      // 1. Attempt connection (Handles Abort tracking internally)
      const rawStringData = await fetchFlashcards(topic);
      
      // 2. Catch Malformed JSON Syntax Errors
      let unvalidatedJSON;
      try {
        unvalidatedJSON = JSON.parse(rawStringData);
      } catch (jsonParseError) {
        throw new Error('AI returned broken text format instead of readable JSON data. Please retry.');
      }
      
      // 3. Catch structural mismatch errors using our utility
      const structuredCleanData = validateFlashcardStructure(unvalidatedJSON);
      
      // 4. Safe deployment to state!
      setData(structuredCleanData);
    } catch (err) {
      // If the request was intentionally aborted because a newer one started, silent escape
      if (err.name === 'AbortError') return;
      
      setError(err.message || 'Something went wrong while connecting to the AI system.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>AI Study Assistant</h1>
        <p>Turn any topic or notes into interactive flashcards.</p>
      </header>

      <main>
        {/* Input Area */}
        <div className="input-section">
          <textarea
            placeholder="Type a topic or paste lecture notes (e.g., 'Operating System Deadlocks')..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isLoading}
          />
          <button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? 'Processing Safe AI Generation...' : 'Generate Flashcards'}
          </button>
        </div>

        {/* Interactive Error Component with Retry Action */}
        {error && (
          <div className="error-box" style={{ background: '#fee2e2', color: '#b91c1c', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #f87171', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0 }}><strong>Generation Guard:</strong> {error}</p>
            <button 
              onClick={handleGenerate} 
              style={{ background: '#b91c1c', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}
            >
              Retry Request
            </button>
          </div>
        )}

        {/* Results Area */}
        {data && !isLoading && (
          <div className="results-section">
            <h2>{data.title}</h2>
            <div className="flashcard-grid">
              {data.flashcards.map((card, index) => (
                <Flashcard 
                  key={card.id} 
                  question={card.question} 
                  answer={card.answer} 
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}