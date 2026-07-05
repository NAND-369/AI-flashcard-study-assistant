# AI Study Assistant

A full-stack React application that transforms free-form text or lecture notes into an interactive, 3D-flipping flashcard study tool using Google's Gemini AI. 

## Features
* **Dynamic Generation:** Converts text topics into structured study cards.
* **Race-Condition Protection:** Utilizes `AbortController` to intercept and cancel stale network requests if a user rapidly submits multiple topics.
* **Data Validation Armor:** Implements strict structural validation on the AI's JSON output to prevent UI crashes from hallucinated or malformed data.
* **Secure Architecture:** Employs an Express proxy server to keep API keys completely hidden from the client.

## Setup Instructions

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/NAND-369/AI-flashcard-study-assistant.git
cd AI-flashcard-study-assistant
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd server
npm install
\`\`\`
* Create a `.env` file in the `server` directory (reference `.env.example`).
* Add your Gemini API key: `GEMINI_API_KEY=your_key_here`
* Start the server:
\`\`\`bash
node server.js
\`\`\`

### 3. Frontend Setup
Open a new terminal window:
\`\`\`bash
cd client
npm install
npm run dev
\`\`\`
* The app will be running at `http://localhost:5173`.

## AI Usage Note
I utilized AI as an interactive tutor and pair programmer to help structure the phased approach of this project (MVP -> Backend -> Bridge -> Defenses). It assisted in debugging a Windows-specific `curl` command syntax error, updating a deprecated Gemini model endpoint (`gemini-1.5-flash` to `gemini-2.5-flash`), and scaffolding the CSS for the 3D card flip animation. All application logic, React state, and API routing were written and deeply understood by me.

## Known Limitations
* **Statelessness:** Currently, flashcards are not saved to a database. Refreshing the page clears the generated deck.
* **Error Specificity:** While the app catches malformed JSON gracefully, it relies on a single generic fallback UI error state rather than highlighting the specific missing key to the user.

## Time Spent
* **Total Time:** ~6 hours
  * Frontend & UI: 2 hours
  * Backend API & Prompt Engineering: 1.5 hours
  * Error Handling, Validation & Stale Request Protection: 1.5 hours
  * Documentation & Deliverables: 1 hour