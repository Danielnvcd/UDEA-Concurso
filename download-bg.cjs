const ffmpeg = require('ffmpeg-static');
const { execSync } = require('child_process');
const path = require('path');

const m3u8Url = 'https://stream.mux.com/r6pXRAJb3005XEEbl1hYU1x01RFJDSn7KQApwNGgAHHbU.m3u8';
const outputPath = path.join(__dirname, 'public', 'assets', 'nuevo-fondo.mp4');

try {
  console.log('Downloading video...');
  execSync(`"${ffmpeg}" -i "${m3u8Url}" -c copy -bsf:a aac_adtstoasc "${outputPath}" -y`, { stdio: 'inherit' });
  console.log('Video downloaded successfully to', outputPath);
} catch (error) {
  console.error('Error downloading video:', error.message);
}
