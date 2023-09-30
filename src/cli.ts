import yargs from 'yargs';
import { AirplayBrowser, AirplayStreamer } from './index';

yargs
  .command('discover', 'Discover AirPlay devices', {}, () => {
    const browser = new AirplayBrowser();
    browser.discoverDevices();
  })
  .command(
    'stream <device> <media>',
    'Stream media to a device',
    {},
    (argv) => {
      const deviceName = argv.device as string;
      const mediaURL = argv.media as string;
      // This is a simplification. In reality, you'd want to search for the device by name after discovery.
      const device = { name: deviceName, ip: '192.168.1.x', port: 7000 }; // mock device
      AirplayStreamer.streamToDevice(device, mediaURL);
    }
  ).argv;
