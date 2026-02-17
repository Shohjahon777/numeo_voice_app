import { useCallback, useState } from "react";
import "./App.css";
import LanguageSelector from "./components/LanguageSelector";
import RecordButton from "./components/RecordButton";
import StatusBar from "./components/StatusBar";
import { useSocket } from "./hooks/useSocket";
import { useSpeechRecognition } from "./hooks/useSpeechRecognition";
import TranslationList from "./components/TranslationList";

function App() {
  const [targetLang, setTargetLang] = useState("uz");

  const {
    isConnected,
    translations,
    error,
    sendForTranslation,
    clearTranslations,
  } = useSocket();

  const handleSentence = useCallback(
    (text: string) => {
      sendForTranslation(text, targetLang);
    },
    [sendForTranslation, targetLang],
  );

  const {
    isListening,
    isSupported,
    interimText,
    startListening,
    stopListening,
  } = useSpeechRecognition(handleSentence);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Voice Translator</h1>
        <p className="subtitle">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
      </header>

      <StatusBar isConnected={isConnected} isListening={isListening}/>

      {error && <div className="error-banner">{error}</div>}

      <main className="app-main">
        <div className="controls">
          <RecordButton
            isConnected={isConnected}
            isListening={isListening}
            isSupported={isSupported}
            onStart={startListening}
            onStop={stopListening}
          />
          <LanguageSelector selected={targetLang} onChange={setTargetLang}/>
        </div>

        <TranslationList onClear={clearTranslations} translations={translations} interimText={interimText}/>
      </main>
    </div>
  );
}

export default App;
