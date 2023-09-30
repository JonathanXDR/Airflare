
import { EventEmitter } from 'events';
import mdns from 'multicast-dns';
import { Device } from './device';

export class Browser extends EventEmitter {
  private devices_: Map<string, Device>;
  private nextDeviceId_: number;
  private mdnsInstance: any;

  constructor() {
    super();
    this.devices_ = new Map();
    this.nextDeviceId_ = 0;
    this.mdnsInstance = mdns();

    this.mdnsInstance.on('response', this.handleResponse);
  }

  private handleResponse = (response: any) => {
    // Handle the discovery of AirPlay devices
    response.answers.forEach((answer: any) => {
      if (answer.name.includes('AirPlay') && answer.type === 'A') {
        const device = new Device(this.nextDeviceId_.toString(), answer);
        this.devices_.set(this.nextDeviceId_.toString(), device);
        this.nextDeviceId_++;
        this.emit('serviceUp', device);
      }
    });
  }

  public start() {
    this.mdnsInstance.query({
      questions: [{
        name: '_airplay._tcp.local',
        type: 'PTR'
      }]
    });
  }

  public stop() {
    // TODO: Implement the stop logic (if needed)
  }

  public getDevices(): Device[] {
    return Array.from(this.devices_.values());
  }

  public getDeviceById(id: string): Device | undefined {
    return this.devices_.get(id);
  }

  private findDeviceByInfo_(info: any): Device | undefined {
    // TODO: Implement this based on how the previous library identified unique devices
  }
}
