import type { Translation } from "../types";

interface TranslationListProps {
  translations: Translation[];
  interimText: string;
  onClear: () => void;
}

const TranslationList = ({
  translations,
  interimText,
  onClear,
}: TranslationListProps) => {
  return (
    <div className="translation-section">
      <div className="translation-header">
        <h2>Translation</h2>
        {translations && translations.length > 0 && (
          <button
            type="button"
            className="clear-btn"
            onClick={onClear}
          >
            Clear
          </button>
        )}
      </div>


      {interimText && (
        <div className="interim-text">
            <span className="label">Hearing</span>{interimText}
        </div>
      )}

      {translations && translations.length === 0 && !interimText && (
        <p className="empty-state">Nothing here</p>
      )}


      <div className="translation-items">
        {[...translations].reverse().map((t) => (
            <div key={t.id} className="tranlation-cards">
                <div className="original">
                    <span className="label">You said: </span>
                    <p>{t.origin}</p>
                </div>
                <div className="arrow"></div>
                <div className="translated">
                    <span className="label">Translation ({t.targetLang.toUpperCase()})</span>
                    <p>{t.translation}</p>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default TranslationList;
