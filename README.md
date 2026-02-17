# Voice Translator

A real-time voice translation app. Speak into your mic, pick a target language, and see translations appear live.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Socket.io Client
- **Backend:** Node.js, Express, Socket.io
- **Voice Input:** Web Speech API (`SpeechRecognition`)

## How to Run

### Prerequisites

- Node.js 18+
- A Chromium-based browser (Chrome, Edge) — Web Speech API is not supported in Firefox

### 1. Start the backend

```bash
cd server
npm install
npm run dev
```

Server runs on `http://localhost:3001`.

### 2. Start the frontend

```bash
cd client
npm install
npm run dev
```

App runs on `http://localhost:5173`.

## How It Works

1. User clicks "Start Recording" — the browser begins listening via the Web Speech API
2. As the user speaks, interim (in-progress) text is shown in real time
3. When a sentence is finalized, it is sent to the backend over Socket.io
4. The backend translates the text (currently mocked) and emits the result back
5. The translated sentence appears in the UI instantly

## Project Structure

```
client/
  src/
    components/
      LanguageSelector.tsx   # Target language dropdown
      RecordButton.tsx       # Mic start/stop button
      StatusBar.tsx          # Connection & listening indicators
      TranslationList.tsx    # Displays translations and interim text
    hooks/
      useSocket.ts           # Socket.io connection and event handling
      useSpeechRecognition.ts # Web Speech API wrapper
    types/
      index.ts               # Shared TypeScript interfaces
    App.tsx                   # Main app layout and state
server/
  src/
    index.js                 # Express + Socket.io server with mock translation
```

## Assumptions and Trade-offs

- **Mock translation:** The backend uses a hardcoded dictionary instead of a real AI API. This keeps the focus on the frontend architecture and real-time data flow. Swapping in a real API (e.g. OpenAI) would only require changing the `mockTranslate` function.
- **Web Speech API over MediaRecorder:** I chose `SpeechRecognition` because it gives sentence-level transcripts directly, which fits the task flow (capture sentence, send for translation). MediaRecorder would require an additional speech-to-text step.
- **Browser support:** Web Speech API is only fully supported in Chromium browsers. This is an acceptable trade-off for a demo project.
- **State management:** React's built-in `useState` and custom hooks were sufficient for this scope. Adding Zustand or Context would be over-engineering at this size.

## Bug Fixes

After finishing the initial build I went back and found a few bugs:

- **Language not switching during recording** — the `useSpeechRecognition` hook was recreating the `SpeechRecognition` instance every time the target language changed because `onSentence` was in the `useEffect` dependency array. The new instance never got started, and the old one kept using the previous language. Fixed it by storing `onSentence` in a ref so the recognition instance only gets created once.
- **Timestamp not being sent properly** — in the server I had `new Date().toISOString` without `()`, so it was sending the function reference instead of the actual date string. Added the missing parentheses.
- **Disconnect event listener on wrong object** — I was using `io.on('disconnect')` instead of `socket.on('disconnect')`, so the server was never actually detecting when a client disconnected. Changed it to listen on the individual socket.

## What I Would Improve With More Time

- Integrate a real translation API (OpenAI, DeepL, or Google Translate)
- Add source language auto-detection
- Persist translation history (localStorage or database)
- Add loading indicators per translation
- Support more target languages
- Add tests (unit tests for hooks, integration tests for socket events)
# numeo_voice_app
