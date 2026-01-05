// Sakina 2.0 Model Selection Strategy [cite: 125-127]
export type AIModelType = 'LOCAL_NANO' | 'CLOUD_FLASH' | 'UNAVAILABLE';

export async function selectBestModel(): Promise<AIModelType> {
  // 1. Primary Choice: On-Device Gemini Nano (Zero-Leak Privacy) [cite: 125]
  if (typeof window !== 'undefined' && 'ai' in window) {
    try {
      // @ts-ignore - window.ai is an emerging standard
      const capabilities = await window.ai.canCreateTextSession();
      if (capabilities === 'readily') return 'LOCAL_NANO';
    } catch (e) {
      console.warn("Local AI Check failed:", e);
    }
  }

  // 2. Secondary Choice: Cloud Fallback (Gemini 1.5 Flash)
  // Requires explicit user consent for non-local processing
  const hasCloudConsent = localStorage.getItem('sakina_cloud_ai_consent') === 'true';
  return hasCloudConsent ? 'CLOUD_FLASH' : 'UNAVAILABLE';
}