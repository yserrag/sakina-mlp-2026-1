export const getHijriDate = (date: Date = new Date()) => {
  try {
    // Adding a fallback to 'islamic-civil' which has better mobile support
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      calendar: 'islamic-umalqura'
    };
    
    return new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', options).format(date);
  } catch (e) {
    // Mobile Fallback logic
    return new Intl.DateTimeFormat('en-IQ-u-ca-islamic-civil', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }
};