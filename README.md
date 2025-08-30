# Construct : AI Prompt Optimizer

## Overview

Construct is an MVP (Minimum Viable Product) application designed to generate optimized, structured prompts for Large Language Models (LLMs) based on simple user use cases. It leverages Google's Gemini API to create detailed prompts in a standardized format, making it easier to produce high-quality AI outputs. The project includes a FastAPI backend for prompt generation and execution, and a React frontend for user interaction.

## 📽️ Walkthrough

[walkthrough](https://github.com/user-attachments/assets/fd3501e4-29a0-412b-9204-cd7942c08609)

---

Key benefits:

- Transforms vague ideas into professional, structured prompts.
- Supports editing, testing, and exporting prompts.
- Includes linting for prompt quality assessment.

## Features

- **Prompt Generation**: Input a use case (e.g., "a marketing email for a new product launch") and receive a structured prompt with sections: Persona, Task, Context, Format, and Constraints.
- **Placeholder Support**: Automatically detects and allows filling of placeholders in the context for dynamic testing.
- **Prompt Editing**: Inline editing of generated prompt sections.
- **Testing**: Run the prompt with filled placeholders using the Gemini model and view outputs.
- **Export Options**: Copy sections, full prompt, or export as JSON/Markdown.
- **Quality Linting**: Scores the generated prompt and highlights issues (errors, warnings, info).
- **Template Suggestions**: Pre-built use case templates for quick starts.
- **Model Selection**: Choose between Gemini 1.5 Flash (fast) or Gemini 1.5 Pro (higher quality).
- **History Saving**: Saves generated prompts to local history (via localStorage).

## Tech Stack

- **Backend**: FastAPI (Python), Google Generative AI (Gemini), Pydantic for data validation.
- **Frontend**: React, Shadcn UI components, Lucide React icons, Tailwind CSS for styling.
- **Other**: dotenv for environment variables, FastAPI CORS middleware.

## Prerequisites

- Python 3.10+ (for backend).
- Node.js 18+ and npm/yarn (for frontend).
- Google API Key: Sign up at [Google AI Studio](https://aistudio.google.com/) and obtain a `GOOGLE_API_KEY`.

## Installation

### Backend Setup

1. Clone the repository:

   ```
   git clone https://github.com/xKrishnaSaxena/Construct
   ```

2. Create a virtual environment and install dependencies:

   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install fastapi uvicorn google-generativeai python-dotenv pydantic
   ```

3. Create a `.env` file in the backend directory:

   ```
   GOOGLE_API_KEY=your_google_api_key_here
   ```

4. Run the backend server:
   ```
   uvicorn main:app --reload  # Assuming the code is in main.py
   ```
   The API will be available at `http://localhost:8000`.

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd ../frontend
   ```

2. Install dependencies:

   ```
   npm install  # Or yarn install
   ```

   (Assumes dependencies like react, @shadcn/ui, lucide-react, etc., are in package.json. If not, add them manually.)

3. Run the development server:
   ```
   npm run dev  # Or yarn dev
   ```
   The app will be available at `http://localhost:3000` (or your configured port).

Note: The frontend assumes the backend is running at `http://localhost:8000`. Update `API_BASE` in the code if needed.

## Usage

### Backend API

- **Generate Prompt** (`POST /generate-prompt`):

  - Body: `{ "use_case": "your use case here", "model": "gemini-1.5-flash" }` (model is optional).
  - Response: Structured prompt JSON.

- **Run Prompt** (`POST /run-prompt`):

  - Body: `{ "structured_prompt": { ... } }` (the generated prompt object).
  - Response: `{ "output": "generated text" }`.

- **Health Check** (`GET /`):
  - Response: `{ "status": "Construct API is running!" }`.

Use tools like Postman or curl to test endpoints.

### Frontend

1. Open the app in your browser.
2. Select a template or enter a use case in the textarea.
3. Choose a model (Flash or Pro).
4. Click "Generate Prompt".
5. View, edit, copy, or export the structured prompt.
6. Fill placeholders in the "Fill placeholders & test" section and click "Run Test" to see the output.

## Configuration

- **Environment Variables**:

  - `GOOGLE_API_KEY`: Required for Gemini API access.

- **Customizing Templates**: Edit `templates` array in `src/data/templates.ts`.
- **Linting Rules**: Modify `lintPrompt` function in `src/lib/lint.ts` for custom quality checks.

## Development Notes

- **Backend**: The meta-prompt ensures structured JSON output. Handles errors like invalid JSON or missing keys.
- **Frontend**: Uses hooks for state management. Includes animations and gradients for modern UI.
- **Improvements**:
  - Add authentication for API.
  - Support more models (e.g., via OpenAI).
  - Implement persistent history (e.g., via IndexedDB).
  - Add unit tests.

## Troubleshooting

- **API Key Issues**: Ensure `.env` is loaded correctly. Check console for errors.
- **CORS Errors**: The backend allows all origins; adjust if needed.
- **Generation Failures**: Verify Gemini model availability and API quota.
- **Frontend Errors**: Ensure all dependencies (e.g., use-toast hook) are installed.

---
