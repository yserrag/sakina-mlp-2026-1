/**
 * Sakina Weather Proxy (Cloudflare Pages Function)
 * Blueprint 2.1: Data Sovereignty - Hides user IP from third-party APIs
 */

export const onRequest: PagesFunction = async (context) => {
    const { searchParams } = new URL(context.request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
  
    // 1. Validation: Fail-closed for invalid coordinates
    if (!lat || !lon || isNaN(Number(lat)) || isNaN(Number(lon))) {
      return new Response(JSON.stringify({ error: 'Invalid coordinates' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  
    try {
      // 2. Server-side Fetch: Open-Meteo only sees the Cloudflare Edge IP
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day`,
        {
          headers: {
            'User-Agent': 'Sakina-Ambient-OS/2.0',
            // Note: Browser-sent 'Referer' and cookies are automatically stripped here
          },
        }
      );
  
      if (!response.ok) throw new Error('Weather API failed');
  
      const data = await response.json();
      
      // 3. Sanitized Return: Only send minimal data back to the browser
      return new Response(JSON.stringify({
        temp: Math.round(data.current.temperature_2m),
        code: data.current.weather_code,
        cached: new Date().toISOString()
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=600' // Edge caching for 10 mins to reduce load
        }
      });
  
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Weather service unavailable' }), { 
        status: 503 
      });
    }
  };