async function startWeatherForCoords(lat, lon, label){
  try{
    const raw = await WeatherAPI.fetchByCoords(lat, lon);
    renderCurrent(raw, label);
    renderHourly(raw);
    renderDaily(raw);
  }catch(err){
    alert('Unable to load weather for this place.');
  }
}

function getPosition(){
  return new Promise((res,rej)=>{
    if(!navigator.geolocation) return rej(new Error('no geolocation'));
    navigator.geolocation.getCurrentPosition(res,rej,{enableHighAccuracy:true,timeout:10000});
  });
}

async function autoStart(){
  try{
    const pos = await getPosition();
    const {latitude,longitude} = pos.coords;
    const place = await reverseName(latitude,longitude);
    startWeatherForCoords(latitude,longitude,place);
  }catch(e){
    document.getElementById('location').textContent = 'Tap search icon to choose location';
  }
}

async function reverseName(lat,lon){
  try{
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
    const j = await r.json();
    return j.address?.city || j.address?.town || j.address?.village || j.display_name.split(',')[0];
  }catch{return null;}
}

/* SEARCH SECTION */
const searchWrap = document.getElementById('searchWrap');
const searchBtn = document.getElementById('searchToggleBtn');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

let searchActive = false;

function toggleSearch(){
  searchActive = !searchActive;
  if(searchActive){
    searchWrap.style.display = "flex";
    searchResults.style.display = "block";
    searchInput.focus();
    searchBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>`;
  } else {
    searchWrap.style.display = "none";
    searchResults.style.display = "none";
    searchResults.innerHTML = "";
    searchInput.value = "";
    searchBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>`;
  }
}
searchBtn.addEventListener("click", toggleSearch);
document.getElementById("closeDiv").addEventListener("click", toggleSearch);
document.getElementById("search2").addEventListener("click", doSearch);
// Perform search
searchInput.addEventListener('keydown', e=>{
  if(e.key==='Enter') doSearch();
});
searchInput.addEventListener('keypress', doSearch);
async function doSearch(){
  const q = searchInput.value.trim();
  if(!q) return;
  searchResults.style.display = "block";
  searchResults.innerHTML = '<div class="search-item">Searching...</div>';
  try{
    const data = await geocodePlace(q);
    if(!data.length){ searchResults.innerHTML = '<div class="search-item">No results</div>'; return; }
    searchResults.innerHTML = '';
    data.forEach(r=>{
      const div = document.createElement('div');
      div.className = 'search-item';
      div.textContent = r.display_name;
      div.addEventListener('click', ()=>{
        toggleSearch(); // close search UI
        startWeatherForCoords(r.lat, r.lon, r.display_name.split(',')[0]);
      });
      searchResults.appendChild(div);
    });
  }catch{
    searchResults.innerHTML = '<div class="search-item">Error</div>';
  }
}

// Refresh button
document.getElementById('refreshBtn').addEventListener('click', ()=>autoStart());
autoStart();
