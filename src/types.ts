export interface IAirplayDevice {
  name: string;
  ip: string;
  port: number;
}

export interface IAirplayBrowser {
  discoverDevices(): void;
}
