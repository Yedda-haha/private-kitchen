import type { Recipe } from './storage';

const PREFIX = 'PK#';

export const shareUtils = {
  /**
   * Encode a recipe into a shareable text code
   */
  encodeRecipe(recipe: Recipe): string {
    try {
      // Remove ID and timestamps to create a clean copy
      const cleanRecipe = {
        ...recipe,
        id: undefined,
        updatedAt: undefined
      };
      
      const json = JSON.stringify(cleanRecipe);
      // UTF-8 safe base64 encoding
      const base64 = btoa(encodeURIComponent(json).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
          return String.fromCharCode(parseInt(p1, 16));
      }));
      
      return `${PREFIX}${base64}`;
    } catch (e) {
      console.error('Encoding failed', e);
      return '';
    }
  },

  /**
   * Decode a share code back into a recipe object
   */
  decodeRecipe(code: string): Partial<Recipe> | null {
    if (!code.startsWith(PREFIX)) return null;
    
    try {
      const base64 = code.slice(PREFIX.length);
      // UTF-8 safe base64 decoding
      const json = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      return JSON.parse(json);
    } catch (e) {
      console.error('Decoding failed', e);
      return null;
    }
  }
};
