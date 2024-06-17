// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from 'fs/promises';
// import os from 'os';
import path from 'path';
import WebTorrent from 'webtorrent';
import express from 'express';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.get('/hlo', async (req, res) => {
return res.status(200).send(`Torrent and uploaded to S3`);
})

app.get('/', async (req, res) => {
    const client = new WebTorrent({maxConns: 1000});
    const torrentId = "magnet:?xt=urn:btih:2770FE270845674966E184BE60ED1BE0FE494F3A&dn=Dune%20Part%20Two%20%282024%29%20%5b1080p%5d%20%5bWEBRip%5d%20%5bYTS.MX%5d&tr=http%3a%2f%2fp4p.arenabg.com%3a1337%2fannounce&tr=udp%3a%2f%2f47.ip-51-68-199.eu%3a6969%2fannounce&tr=%2audp%3a%2f%2f9.rarbg.me%3a2780%2fannounce&tr=udp%3a%2f%2f9.rarbg.to%3a2710%2fannounce&tr=udp%3a%2f%2f9.rarbg.to%3a2730%2fannounce&tr=udp%3a%2f%2f9.rarbg.to%3a2920%2fannounce&tr=udp%3a%2f%2fopen.stealth.si%3a80%2fannounce&tr=udp%3a%2f%2fopentracker.i2p.rocks%3a6969%2fannounce&tr=udp%3a%2f%2ftracker.coppersurfer.tk%3a6969%2fannounce&tr=udp%3a%2f%2ftracker.cyberia.is%3a6969%2fannounce&tr=udp%3a%2f%2ftracker.dler.org%3a6969%2fannounce&tr=udp%3a%2f%2ftracker.internetwarriors.net%3a1337%2fannounce&tr=udp%3a%2f%2ftracker.leechers-paradise.org%3a6969%2fannounce&tr=udp%3a%2f%2ftracker.openbittorrent.com%3a6969%2fannounce&tr=udp%3a%2f%2ftracker.opentrackr.org%3a1337&tr=udp%3a%2f%2ftracker.pirateparty.gr%3a6969%2fannounce&tr=udp%3a%2f%2ftracker.tiny-vps.com%3a6969%2fannounce&tr=udp%3a%2f%2ftracker.torrent.eu.org%3a451%2fannounce&tr=wss%3a%2f%2fwstracker.online&tr=udp%3a%2f%2f9.rarbg.me%3a2780%2fannounce"
    console.log(torrentId);
    try {
        client.add(torrentId,{maxWebConns: 200, path: path.join(__dirname, 'vid') }, torrent => {
            
            torrent.on('done', () => {
              console.log('torrent download finished')
              client.destroy();
            })
            torrent.on('download', bytes => {
            const speed = torrent.downloadSpeed / (1024 * 1024); // Convert bytes to megabytes
            const time = Math.floor(torrent.timeRemaining / 1000); // Convert milliseconds to seconds
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            const percent = (torrent.progress * 100).toFixed(2);
            const numConnections = torrent.numPeers;
            const numPeers = torrent.numPeers;
            process.stdout.write(`Download Speed: ${speed.toFixed(2)} mB/s, Time Remaining: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}, Progress: ${percent}%, Connections: ${numConnections}, Peers: ${numPeers}\r`);
            // process.stdout.write(`Download Speed: ${speed.toFixed(2)} mB/s, Time Remaining: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}, Progress: ${percent}%\r`);
            });

          })
    } catch (error) {
        console.error('Error downloading or uploading torrent:', error);
        return res.status(500).send('Error downloading or uploading torrent');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
