import WebTorrent from 'https://esm.sh/webtorrent'

const client = new WebTorrent()
const torrentId = 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent'
const player = document.querySelector('video')

function download () {
  client.add(torrentId,async torrent => {
    // Torrents can contain many files. Let's use the .mp4 file
    const file = torrent.files.find(file => file.name.endsWith('.mp4'))
    // Log streams emitted by the video player
    file.on('stream', ({ stream, file, req }) => {
      if (req.destination === 'video') {
        console.log(`Video player requested data from ${file.name}! Ranges: ${req.headers.range}`)
        console.log(player);
      }
    })
    // Stream to a <video> element by providing an the DOM element
    file.streamTo(player)
    console.log('Ready to play!')
    
  })
}

navigator.serviceWorker.register("./sw.min.js", { scope: './' }).then(reg => {
  const worker = reg.active || reg.waiting || reg.installing
  function checkState (worker) {
    return worker.state === 'activated' && client.createServer({ controller: reg }) && download()
  }
  if (!checkState(worker)) {
    worker.addEventListener('statechange', ({ target }) => checkState(target))
  }
})