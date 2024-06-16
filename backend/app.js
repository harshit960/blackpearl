// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from 'fs/promises';
// import os from 'os';
import path from 'path';
const WebTorrent = require('webtorrent');
import express from 'express';
const app = express();

app.get('/', async (req, res) => {
    const client = new WebTorrent();
    const torrentId = "magnet:?xt=urn:btih:c9e15763f722f23e98a29decdfae341b98d53056&dn=Cosmos+Laundromat&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fcosmos-laundromat.torrent"; // URL of the torrent file
    console.log(torrentId);
    try {
        client.add(torrentId, async torrent => {
            // Got torrent metadata!
            console.log('Client is downloading:', torrent.infoHash)
            const files = torrent.files;
            for (const file of files) {
                const filePath = path.join(file.name);
                console.log(filePath);
                const fileBuffer = await new Promise((resolve, reject) => {
                    const chunks = [];
                    file.createReadStream()
                        .on('data', (chunk) => chunks.push(chunk))
                        .on('end', () => resolve(Buffer.concat(chunks)))
                        .on('error', reject);
                });
                await fs.writeFile(filePath, fileBuffer);
                console.log(`File ${file.name} saved to ${filePath}`);
            }
            return res.status(200).send(`Torrent file ${client.name} downloaded and uploaded to S3`);
        })
    } catch (error) {
        console.error('Error downloading or uploading torrent:', error);
        return res.status(500).send('Error downloading or uploading torrent');
    }
});

app.listen(10000, () => {
    console.log('Server is running on port 3000');
});
// // const s3Client = new S3Client({ region: 'ap-south-1' }); // Replace 'your-region' with your AWS region

// export const handler = async (event) => {
//     const torrentId = "magnet:?xt=urn:btih:c9e15763f722f23e98a29decdfae341b98d53056&dn=Cosmos+Laundromat&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fcosmos-laundromat.torrent"; // URL of the torrent file
//     // const tempDir = ""; // Get the temporary directory path
//     console.log(torrentId);
//     try {
//         client.add(torrentId, async torrent => {
//             // Got torrent metadata!
//             console.log('Client is downloading:', torrent.infoHash)
//             const files = torrent.files;
//             // console.log(files);
//             for (const file of files) {
//                 const filePath = path.join(file.name);
//                 console.log(filePath);
//                 const fileBuffer = await new Promise((resolve, reject) => {
//                     const chunks = [];
//                     file.createReadStream()
//                         .on('data', (chunk) => chunks.push(chunk))
//                         .on('end', () => resolve(Buffer.concat(chunks)))
//                         .on('error', reject);
//                 });
//                 await fs.writeFile(filePath, fileBuffer);
//                 console.log(`File ${file.name} saved to ${filePath}`);
//             }
//             // for (const file of torrent.files) {
//             //   document.body.append(file.name)
//             // }
//             return 4;
//         })
//         console.log(2);


//         // const torrentFilePath = path.join(tempDir, torrent.name);
//         // const torrentFileData = await fs.readFile(torrentFilePath);

//         // Example: Upload the torrent file to S3
//         // const s3Params = {
//         //     Bucket: 'your-bucket-name',
//         //     Key: `torrents/${torrent.name}`,
//         //     Body: torrentFileData
//         // };
//         // await s3Client.send(new PutObjectCommand(s3Params));

//         // // Cleanup: Remove the downloaded torrent file from temp directory
//         // await fs.unlink(torrentFilePath);

//         return {
//             statusCode: 200,
//             body: `Torrent file ${client.name} downloaded and uploaded to S3`
//         };
//     } catch (error) {
//         console.error('Error downloading or uploading torrent:', error);
//         return {
//             statusCode: 500,
//             body: 'Error downloading or uploading torrent'
//         };
//     }
// };
// // handler()