import * as adhan from 'adhan';

/**
 * QiblaEngine
 * [FACTS]: Resolves the property access error by calling the function directly.
 */
export class QiblaEngine {
  /**
   * Calculates Qibla direction from current location.
   * [ANALYSIS]: The TS compiler identifies adhan.Qibla as the function itself.
   */
  static calculateDirection(lat: number, lng: number): number {
    const coords = new adhan.Coordinates(lat, lng);
    
    // [FACTS]: Call the function directly to satisfy the (coordinates) => number signature.
    return adhan.Qibla(coords);
  }

  static getMockState() {
    return {
      direction: 125.4, // Degrees from North
      isCompassActive: true
    };
  }
}