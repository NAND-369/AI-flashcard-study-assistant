/**
 * Validates the structure of the AI JSON output.
 * Returns the clean object if completely valid, otherwise throws an error.
 */
export const validateFlashcardStructure = (data) => {
  // 1. Ensure the top level is a valid object
  if (!data || typeof data !== 'object') {
    throw new Error("AI output is not a valid data structure.");
  }

  // 2. Ensure a title string exists
  if (!data.title || typeof data.title !== 'string') {
    data.title = "Generated Flashcards"; // Safe fallback default title
  }

  // 3. Ensure flashcards array exists and is populated
  if (!Array.isArray(data.flashcards) || data.flashcards.length === 0) {
    throw new Error("The AI failed to create an array of study cards.");
  }

  // 4. Inspect every single flashcard inside the array
  const validatedCards = data.flashcards.map((card, index) => {
    const question = card.question?.trim();
    const answer = card.answer?.trim();

    if (!question || !answer) {
      throw new Error(`Flashcard at index ${index + 1} is missing textual content.`);
    }

    return {
      id: card.id || index + 1, // Fallback safe sequential ID
      question,
      answer
    };
  });

  return {
    title: data.title,
    flashcards: validatedCards
  };
};  