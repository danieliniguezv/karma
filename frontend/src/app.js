import { SongInfo } from './components/header.js';

const artistName = SongInfo('Artist');
document.getElementById('artistName').appendChild(artistName);

const songName = SongInfo('Song Name');
document.getElementById('songName').appendChild(songName);

const duration = SongInfo('Duration');
document.getElementById('duration').appendChild(duration);
