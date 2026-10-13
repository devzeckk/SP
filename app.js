const tracksList = document.querySelector('#tracks');
const searchInput = document.querySelector('#search-input');
const empty = document.querySelector('#empty');
const message = document.querySelector('#load-message');
let tracks = [];

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function icon(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `#${name}`);
  svg.append(use);
  return svg;
}
function link(track, className, label) {
  const node = element('a', className, label);
  node.href = track.url;
  node.target = '_blank';
  node.rel = 'noopener noreferrer';
  node.setAttribute('aria-label', `Abrir ${track.title}, de ${track.artist}, no Spotify (nova aba)`);
  return node;
}
function cover(track) {
  const image = element('img');
  // Covers are decorative beside the same track title, so avoid duplicate announcements.
  image.alt = '';
  image.loading = 'lazy';
  image.width = 300;
  image.height = 300;
  try {
    const url = new URL(track.cover);
    image.src = url.protocol === 'https:' && /(^|\.)(spotifycdn\.com|scdn\.co)$/.test(url.hostname) ? url.href : 'assets/favicon.svg';
  } catch { image.src = 'assets/favicon.svg'; }
  image.addEventListener('error', () => { image.src = 'assets/favicon.svg'; }, { once: true });
  return image;
}
function duration(milliseconds) {
  const seconds = Math.floor((Number(milliseconds) || 0) / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}
function renderTracks() {
  const filtered = filterTracks(tracks, searchInput.value);
  const fragment = document.createDocumentFragment();
  for (const track of filtered) {
    const row = element('li', 'track-row');
    row.value = tracks.indexOf(track) + 1;
    const number = element('span', 'track-number', String(row.value).padStart(2, '0'));
    number.setAttribute('aria-hidden', 'true');
    const info = element('div', 'track-info');
    const text = element('div', 'track-text');
    text.append(link(track, 'track-title', track.title));
    const artist = element('span', 'track-artist');
    if (track.explicit) {
      const explicit = element('span', 'explicit', 'E');
      explicit.setAttribute('aria-label', 'Conteúdo explícito');
      artist.append(explicit);
    }
    artist.append(document.createTextNode(track.artist));
    text.append(artist);
    info.append(cover(track), text);
    const open = link(track, 'track-open', 'Abrir');
    open.append(icon('arrow'));
    row.append(number, info, element('span', 'track-duration', duration(track.duration)), open);
    fragment.append(row);
  }
  tracksList.replaceChildren(fragment);
  empty.hidden = filtered.length !== 0;
  document.querySelector('#result-status').textContent = `${filtered.length} ${filtered.length === 1 ? 'faixa encontrada' : 'faixas encontradas'}`;
  document.querySelector('#total').textContent = `${filtered.length} ${filtered.length === 1 ? 'faixa' : 'faixas'}`;
}

async function loadCatalog() {
  try {
    const response = await fetch('musicas.json');
    if (!response.ok) throw new Error('Catálogo indisponível');
    const data = await response.json();
    if (!Array.isArray(data.tracks)) throw new Error('Catálogo inválido');
    tracks = data.tracks.filter(validTrack);
    const minutes = Math.round(tracks.reduce((total, track) => total + (Number(track.duration) || 0), 0) / 60000);
    document.querySelector('#selection-meta').textContent = `Seleção pessoal · ${tracks.length} faixas · ${Math.floor(minutes / 60)} h ${minutes % 60} min`;
    const highlights = document.querySelector('#highlights');
    highlights.replaceChildren();
    for (const index of [3, 0, 13, 36]) {
      const track = tracks[index];
      if (!track) continue;
      const card = link(track, 'highlight-card');
      const art = element('div', 'cover-wrap');
      const arrow = element('span', 'card-open');
      arrow.append(icon('arrow'));
      art.append(cover(track), arrow);
      card.append(art, element('h3', '', track.title), element('p', '', track.artist));
      highlights.append(card);
    }
    highlights.setAttribute('aria-busy', 'false');
    searchInput.disabled = false;
    message.hidden = true;
    renderTracks();
  } catch {
    message.textContent = 'Não foi possível carregar as faixas. Atualize a página para tentar novamente.';
    document.querySelector('#highlights').replaceChildren(element('p', 'loading', 'Os destaques aparecerão quando as faixas forem carregadas.'));
    document.querySelector('#highlights').setAttribute('aria-busy', 'false');
  } finally { tracksList.setAttribute('aria-busy', 'false'); }
}
searchInput.addEventListener('input', renderTracks);
document.querySelector('#clear-search').addEventListener('click', () => {
  searchInput.value = '';
  renderTracks();
  searchInput.focus();
});
loadCatalog();
