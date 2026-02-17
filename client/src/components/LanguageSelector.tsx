const LANGUAGE = [
  { code: "uz", label: "Uzbek" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spain" },
];

interface LanguageSelectorProps {
  selected: string;
  onChange: (lang: string) => void;
}

const LanguageSelector = ({ selected, onChange }: LanguageSelectorProps) => {
  return (
    <div className="language-selector">
      <label htmlFor="target-lang">Translate to: </label>
      <select
        name="lang"
        value={selected}
        id="target-lang"
        onChange={(e) => onChange(e.target.value)}
      >
        {LANGUAGE.map((lang) => (
          <option
            key={lang.code}
            value={lang.code}
          >
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
