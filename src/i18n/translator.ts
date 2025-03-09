export type TranslationFunction = (key: string, ...args: any[]) => string;

/**
 * Creates a translation function that works with our menu functions
 * @param t - The next-intl translation function
 * @returns A translation function that accepts string keys
 */
export function createTranslator(t: any): TranslationFunction {
  return (key: string) => {
    try {
      // @ts-ignore - We know this is a valid key because we've defined it in our messages
      return t(key);
    } catch (error) {
      console.error(`Translation key not found: ${key}`);
      return key.split('.').pop() || key;
    }
  };
}
