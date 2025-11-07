const WCodes = {
  0: { txt: 'Clear', icon: '☀️' }, 1: { txt: 'Mainly Clear', icon: '🌤️' }, 2: { txt: 'Partly Cloudy', icon: '⛅' }, 3: { txt: 'Overcast', icon: '☁️' },
  45: { txt: 'Fog', icon: '🌫️' }, 48: { txt: 'Rime Fog', icon: '🌫️' }, 51: { txt: 'Drizzle', icon: '🌦️' }, 53: { txt: 'Drizzle', icon: '🌦️' },
  61: { txt: 'Rain', icon: '🌧️' }, 63: { txt: 'Rain', icon: '🌧️' }, 80: { txt: 'Showers', icon: '🌦️' }, 95: { txt: 'Thunder', icon: '⛈️' }
};
function wcToIcon(code) { return (WCodes[code] && WCodes[code].icon) || '❓'; }
function wcToText(code) { return (WCodes[code] && WCodes[code].txt) || 'Unknown'; }

function getHourlyIndex(data) {
  const t = data.current_weather.time;
  return data.hourly.time.indexOf(t) !== -1 ? data.hourly.time.indexOf(t) : 0;
}

function renderCurrent(data, placeLabel) {
  const cur = data.current_weather;
  const tempEl = document.getElementById('temp');
  const condEl = document.getElementById('cond');
  const iconEl = document.getElementById('weatherIcon');
  const hiEl = document.getElementById('hi');
  const loEl = document.getElementById('lo');
  const windEl = document.getElementById('wind');
  const rainpEl = document.getElementById('rainp');
  const rainmmEl = document.getElementById('rainmm');
  const dateEl = document.getElementById('dateNow');

  document.getElementById('location').textContent = placeLabel || 'Your location';
  const dt = new Date(cur.time);
  dateEl.textContent = dt.toLocaleString(undefined, { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  tempEl.textContent = `${Math.round(cur.temperature)}°`;
  condEl.textContent = wcToText(cur.weathercode);
  iconEl.textContent = wcToIcon(cur.weathercode);

  // hi/lo
  if (data.daily && data.daily.temperature_2m_max) {
    hiEl.textContent = `H: ${Math.round(data.daily.temperature_2m_max[0])}°`;
    loEl.textContent = `L: ${Math.round(data.daily.temperature_2m_min[0])}°`;
  }

  // wind & precipitation at current hour (from hourly arrays)
  const idx = getHourlyIndex(data);
  const wind = (data.hourly.windspeed_10m && data.hourly.windspeed_10m[idx]) || cur.windspeed || 0;
  const precipProb = data.hourly.precipitation_probability ? data.hourly.precipitation_probability[idx] : null;
  const precip = data.hourly.precipitation ? data.hourly.precipitation[idx] : null;

  windEl.textContent = `${Math.round(wind)} km/h`;
  rainpEl.textContent = (precipProb == null) ? '--%' : `${Math.round(precipProb)}%`;
  rainmmEl.textContent = (precip == null) ? '-- mm' : `${Number(precip).toFixed(1)} mm`;
}

function renderHourly(data) {
  const hourly = data.hourly;
  const nowIndex = getHourlyIndex(data);
  const container = document.getElementById('hourly');
  container.innerHTML = '';
  for (let i = nowIndex; i < Math.min(nowIndex + 12, hourly.time.length); i++) {
    const timeISO = hourly.time[i];
    const hour = new Date(timeISO).getHours();
    const t = Math.round(hourly.temperature_2m[i]);
    const wc = hourly.weathercode[i];
    const wcIcon = wcToIcon(wc);
    const prob = hourly.precipitation_probability ? hourly.precipitation_probability[i] : null;
    const item = document.createElement('div');
    item.className = 'hour-item';
    item.innerHTML = `<div class="h">${i === nowIndex ? 'Now' : hour + ':00'}</div>
                      <div class="icon small-icon">${wcIcon}</div>
                      <div class="t">${t}°</div>
                      <div style="font-size:12px;opacity:.9;margin-top:6px">${prob == null ? '' : prob + '%'}</div>`;
    container.appendChild(item);
  }
}

function rainEmoji(prob) {
  if (prob == null) return '☔';
  if (prob >= 70) return '🌧️';
  if (prob >= 30) return '🌦️';
  return '☀️';
}

function renderDaily(data) {
  const list = document.getElementById('dailyList');
  list.innerHTML = '';
  const days = data.daily.time;
  for (let i = 0; i < days.length; i++) {
    const d = new Date(days[i]);
    const label = d.toLocaleDateString(undefined, { weekday: 'short' });
    const hi = Math.round(data.daily.temperature_2m_max[i]);
    const lo = Math.round(data.daily.temperature_2m_min[i]);
    const wc = data.daily.weathercode[i];
    const prob = data.daily.precipitation_probability_max ? data.daily.precipitation_probability_max[i] : null;
    const mm = data.daily.precipitation_sum ? Number(data.daily.precipitation_sum[i]).toFixed(1) : null;

    const row = document.createElement('div');
    row.className = 'day-row';
    row.innerHTML = `<div class="day-left">
        <div class="d">${label}</div>
        <div class="small-icon">${wcToIcon(wc)}</div>
        <div class="desc" style="opacity:.9;margin-left:8px">${wcToText(wc)}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <div style="text-align:right">${hi}° / ${lo}°</div>
        <div class="rain-badge">${rainEmoji(prob)} ${prob == null ? '--%' : prob + '%'} ${mm == null ? '' : ' • ' + mm + 'mm'}</div>
      </div>`;
    list.appendChild(row);
  }
}
