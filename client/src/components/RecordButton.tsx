interface RecordButtonProps {
  isListening: boolean;
  isSupported: boolean;
  isConnected: boolean;
  onStart: () => void;
  onStop: () => void;
}

const RecordButton = ({
  isListening,
  isSupported,
  isConnected,
  onStart,
  onStop
}: RecordButtonProps) => {
  if (!isSupported) {
    return (
      <div className="record-section">
        <p className="error-text">
          Speech Recognition is not supported in this browser.
        </p>
      </div>
    );
  }
  return (
    <div className="record-section">
      <button
        className={`record-btn ${isListening ? 'recording' : ''}`}
        type="button"
        disabled={!isConnected}
        onClick={isListening ? onStop : onStart}
        title={!isConnected ? 'Connect to the server first' : ''}
      >
        <span className="mic-icon">{isListening ? "🟨" : "🎤"}</span>
        {isListening ? "Stop Listening" : "Start Recording"}
      </button>

      {!isConnected && (
        <p className="hint-text">Waiting for server connection ...</p>
      )}
    </div>
  );
};

export default RecordButton;
