import mdns from 'multicast-dns';

export class AirplayDevice {
  name: string;
  ip: string;
  port: number = 7000; // Default AirPlay port

  constructor(name: string, ip: string) {
    this.name = name;
    this.ip = ip;
  }
}

export class AirplayBrowser {
  private mdnsInstance: any;

  constructor() {
    this.mdnsInstance = mdns();
    this.mdnsInstance.on('response', this.handleResponse);
  }

  private handleResponse(response: any) {
    // Handle the discovery of AirPlay devices
    // This is a basic example and may need adjustments based on real AirPlay protocol details
    const airplayDevices: AirplayDevice[] = [];
    response.answers.forEach((answer: any) => {
      if (answer.name.includes('AirPlay') && answer.type === 'A') {
        airplayDevices.push(new AirplayDevice(answer.name, answer.data));
      }
    });
    console.log(airplayDevices);
  }

  public discoverDevices() {
    this.mdnsInstance.query({
      questions: [
        {
          name: '_airplay._tcp.local',
          type: 'PTR',
        },
      ],
    });
  }
}

export class AirplayStreamer {
  public static streamToDevice(device: AirplayDevice, mediaURL: string) {
    console.log(
      `Streaming ${mediaURL} to device ${device.name} at ${device.ip}:${device.port}`
    );
    // Here, you'd normally interface with the AirPlay protocol to start streaming the media
  }
}
