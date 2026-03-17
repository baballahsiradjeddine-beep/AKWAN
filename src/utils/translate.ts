import { translate } from '@vitalets/google-translate-api';

/**
 * Translates text from Arabic to English using google translate API.
 * @param text The Arabic text to translate.
 * @returns The translated English text or the original text if translation fails.
 */
export async function translateText(text: string): Promise<string> {
  if (!text || text.trim() === '') return text;
  
  try {
    const { text: translatedText } = await translate(text, { from: 'ar', to: 'en' });
    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    // Silent fail, return original text on error
    return text;
  }
}
