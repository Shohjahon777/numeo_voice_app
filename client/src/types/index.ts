export interface Translation {
    id: string;
    origin: string;
    translation: string;
    targetLang: string;
    timestamp: string;
}

export interface TranslationError {
    message: string;
    original: string;
}