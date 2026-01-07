export const getHijriDate = (date: Date = new Date()) => {
    try {
      // Use the modern "Intl" API for accurate local calculation
      // 'en-u-ca-islamic-umalqura' uses the Saudi official calendar
      return new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date);
    } catch (e) {
      // Fallback if browser doesn't support the specific calendar
      return "Hijri Date Unavailable";
    }
  };