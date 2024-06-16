import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import WebTorrent from 'https://esm.sh/webtorrent'
import { useEffect } from 'react'
import { useRef } from 'react'
import { useSearchParams } from 'react-router-dom';

function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('url');
    setSearchParams({ url });
  };
  const videoRef = useRef(null);
  const [torrentId, settorrentId] = useState(null);
  const [downloadSpeed, setdownloadSpeed] = useState();
  const [numPeers, setnumPeers] = useState();
  useEffect(() => {
    if (!searchParams.get('url')) {
      return;
    }
    const torrentId = searchParams.get('url');
    const client = new WebTorrent();
    // const torrentId = 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent';

    const download = () => {
      console.log(torrentId);
      client.add(torrentId,{maxWebConns:55}, async torrent => {

        console.log(torrent.files);
        const file = torrent.files.find(file => file.name.endsWith('.mkv'));
        console.log(file);
        file.on('stream', ({ stream, file, req }) => {
          if (req.destination === 'video') {
            console.log(`Video player requested data from ${file.name}! Ranges: ${req.headers.range}`);
            // console.log(videoRef.current);
            // setdow?nloadSpeed(torrent.downloadSpeed)
            // setnumPeers(torrent.numPeers)
          }
        });
        file.streamTo(videoRef.current);
        console.log('Ready to play!');
        torrent.on('download', (bytes) => {
          setdownloadSpeed(torrent.downloadSpeed)
          setnumPeers(torrent.numPeers)
        });
      });
    };

    const registerServiceWorker = async () => {
      try {
        const reg = await navigator.serviceWorker.register("./sw.min.js", { scope: './' });
        const worker = reg.active || reg.waiting || reg.installing;

        const checkState = (worker) => {
          if (worker.state === 'activated') {
            client.createServer({ controller: reg });
            download();
          }
        };

        if (!checkState(worker)) {
          worker.addEventListener('statechange', ({ target }) => checkState(target));
        }
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    };

    registerServiceWorker();
  }, []);
  if (!searchParams.get('url')) {
    return (
      <div>
        <h1>Enter a magnet link</h1>
        <form onSubmit={handleSearch}>

          <input type="text" name="url" onChange={handleSearch} />
          <button type="submit">Play</button>
        </form>
      </div>
    )
  }
  return (
    <>
      <a className="text-xl" href='/'>
        Home
      </a>
      <div className="h1">{(downloadSpeed / 1024).toFixed(2)} kB/s</div>
      <div className="h1">{numPeers}</div>
      <video ref={videoRef} autoPlay controls style={{ width: '100%' }}></video>
    </>
  )
}

export default App
