//openmetio data fetch
const WeatherAPI = {
  async fetchByCoords(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current_weather=true` +
      `&hourly=temperature_2m,weathercode,precipitation,precipitation_probability,windspeed_10m` +
      `&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max,precipitation_sum,windspeed_10m_max` +
      `&timezone=auto`;
    const res = await fetch(url);
    if(!res.ok) throw new Error('Failed to fetch weather');
    return res.json();
  }
};

// Nominatim (geocode) helper
async function geocodePlace(q){
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(q)}&limit=6`;
  const r = await fetch(url);
  if(!r.ok) return [];
  return r.json();
}
