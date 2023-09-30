export interface IAirplayDevice {
  name: string;
  ip: string;
  port: number;
}

export interface IAirplayBrowser {
  discoverDevices(): void;
}

export interface AirPlayServerInfo {
  deviceid: string;
  features: string;
  model: string;
  protovers: string;
  srcvers: string;
  [key: string]: any; // Optional: to allow for other properties you might not have listed
}
