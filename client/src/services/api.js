// Keep a reference to the active controller outside the function
let activeController = null;

export const fetchFlashcards = async (topic) => {
  // If a previous request is still running, abort it immediately!
  if (activeController) {
    activeController.abort();
  }

  // Create a brand new controller for this current request
  activeController = new AbortController();

  try {
    const response = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic }),
      signal: activeController.signal, // Connect the abort signal to fetch
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Server failed to generate flashcards.');
    }

    return result.data;
  } catch (error) {
    // If the error is an intentional abort, don't treat it like a real network crash
    if (error.name === 'AbortError') {
      console.log('🔄 Stale request intercepted and aborted successfully.');
      throw error;
    }
    console.error('API Fetch Error:', error);
    throw error;
  } finally {
    // Reset the controller container if this specific request finishes completely
    if (activeController?.signal?.aborted === false) {
      activeController = null;
    }
  }
};