import { useCallback, useEffect, useRef, useState } from "react";

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionEventError {
  error: string;
  message: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionEventError) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

export function useSpeechRecognition(onSentence: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [interimText, setInterimText] = useState("");
  const isListeningRef = useRef(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const onSentenceRef = useRef(onSentence);

  useEffect(() => {
    onSentenceRef.current = onSentence;
  }, [onSentence]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {

        const result = event.results[i];
        const transcript = result[0].transcript;


        console.log('Result', result)

        if (result.isFinal) {
          onSentenceRef.current(transcript.trim());
          setInterimText("");
        } else {
          interim += transcript;
        }
      }

      if (interim) {
        setInterimText(interim);
      }
    };

    recognition.onerror = (event: SpeechRecognitionEventError) => {
      console.log("Error occured");
      if (event.error !== "no-speech") {
        isListeningRef.current = false;
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      if (recognitionRef.current && isListeningRef.current) {
        try {
          recognition.start();
        } catch {
        }
      }
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        isListeningRef.current = true;
        recognitionRef.current.start();
        setInterimText("");
      } catch {
        isListeningRef.current = false;
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if(recognitionRef.current){
        isListeningRef.current = false
        recognitionRef.current.stop()
        setIsListening(false)
        setInterimText('')
    }
  }, [])


  return{
    isListening,
    isSupported,
    interimText,
    startListening, 
    stopListening
  }
}
