
import { EventEmitter } from 'events';
import plist from 'plist';
import { Client } from './client';

export class Device extends EventEmitter {
  public id: string;
  private info_: any;
  private serverInfo_: any;
  private ready_: boolean;
  private client_: Client;

  constructor(id: string, info: any, opt_readyCallback?: Function) {
    super();
    this.id = id;
    this.info_ = info;
    this.serverInfo_ = null;
    this.ready_ = false;

    const host = info.host;
    const port = info.port || 7000; // Default port for AirPlay
    const user = 'Airplay';
    const pass = '';
    this.client_ = new Client(host, port, user, pass, () => {
      this.client_.get('/server-info', (res: any) => {
        const obj = plist.parse(res.body);
        const el = obj[0];
        this.serverInfo_ = {
          deviceId: el.deviceid,
          features: el.features,
          model: el.model,
          protocolVersion: el.protovers,
          sourceVersion: el.srcvers
        };
        this.makeReady_(opt_readyCallback);
      });
    });
  }

  private makeReady_(opt_readyCallback?: Function) {
    this.ready_ = true;
    if (opt_readyCallback) {
      opt_readyCallback(this);
    }
    this.emit('ready');
  }

  public isReady(): boolean {
    return this.ready_;
  }

  public close() {
    if (this.client_) {
      this.client_.close();
    }
    this.client_ = null;
    this.ready_ = false;
    this.emit('close');
  }

  public getInfo() {
    const info = this.info_;
    const serverInfo = this.serverInfo_;
    return {
      id: this.id,
      name: info.serviceName,
      deviceId: info.host,
      features: serverInfo.features,
      model: serverInfo.model,
      slideshowFeatures: [], // Placeholder for future features
      supportedContentTypes: [] // Placeholder for future features
    };
  }

  public getName(): string {
    return this.info_.serviceName;
  }

  // TODO: Implement other methods from the provided device.js content
}
