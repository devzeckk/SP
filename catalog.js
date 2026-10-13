function filterTracks(tracks, query) {
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
  const term = normalize(query.trim());
  return tracks.filter(track => normalize(`${track.title} ${track.artist}`).includes(term));
}

function validTrack(track) {
  if (!track || typeof track.title !== 'string' || !track.title.trim() || typeof track.artist !== 'string' || !track.artist.trim()) return false;
  try {
    const url = new URL(track.url);
    return url.protocol === 'https:' && url.hostname === 'open.spotify.com' && !url.username && !url.password && /^\/track\/[A-Za-z0-9]{22}$/.test(url.pathname);
  } catch { return false; }
}
