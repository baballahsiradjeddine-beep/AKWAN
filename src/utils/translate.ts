/**
 * Translates text from Arabic to English using a simple fetch.
 * Works natively in the browser without Node.js 'global' dependencies.
 * @param text The Arabic text to translate.
 * @returns The translated English text or the original text if translation fails.
 */
export async function translateText(text: string): Promise<string> {
  if (!text || text.trim() === '') return text;
  
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    
    const data = await response.json();
    // The response data is an array where data[0] contains pairs of [translated, original]
    const translatedText = data[0].map((item: any) => item[0]).join('');
    
    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    // Silent fail, return original text on error
    return text;
  }
}
