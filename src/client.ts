
import { EventEmitter } from 'events';
import { Socket } from 'net';

export class Client extends EventEmitter {
  private host_: string;
  private port_: number;
  private user_: string;
  private pass_: string;
  private socket_: Socket;
  private buffer_: Buffer;

  constructor(host: string, port: number, user: string, pass: string, callback: Function) {
    super();
    this.host_ = host;
    this.port_ = port || 7000; // Default port for AirPlay
    this.user_ = user;
    this.pass_ = pass;
    this.buffer_ = Buffer.alloc(0);

    this.socket_ = new Socket();
    this.socket_.connect(this.port_, this.host_, callback);

    this.socket_.on('data', this.handleData);
    this.socket_.on('end', () => this.emit('end'));
    this.socket_.on('error', (err) => this.emit('error', err));
  }

  private handleData = (data: Buffer) => {
    this.buffer_ = Buffer.concat([this.buffer_, data]);
    const parts = this.buffer_.toString('utf8').split('\r\n\r\n');
    if (parts.length === 2) {
      const headers = parts[0].split('\r\n');
      const body = parts[1];
      const statusCode = parseInt(headers[0].split(' ')[1]);
      this.emit('response', { headers, body, statusCode });
      this.buffer_ = Buffer.alloc(0);
    }
  }

  public close() {
    this.socket_.end();
  }

  public get(path: string, callback: (response: any) => void) {
    this.issue_('GET', path, null, callback);
  }

  public post(path: string, body: string, callback: (response: any) => void) {
    this.issue_('POST', path, body, callback);
  }

  private issue_(method: string, path: string, body: string | null, callback: (response: any) => void) {
    const data = \`\${method} \${path} HTTP/1.1\r\n\r\n\${body ? body : ''}\`;
    this.socket_.write(data, 'utf8');
    this.once('response', callback);
  }

  // TODO: Implement other methods from the provided client.js content
}
