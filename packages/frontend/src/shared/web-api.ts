import feathers, { Service, Application } from '@feathersjs/feathers';
import authentication from '@feathersjs/authentication-client';
import socketio from '@feathersjs/socketio-client';
import * as io from 'socket.io-client';

export class WebApi {

  users: Service<any>;

  private client: Application<any>;

  private socket: any;

  constructor() {
    this.socket = io(CONFIG.server);
    const client = feathers();
    client.configure(socketio(this.socket));
    client.configure(authentication({storage: window.localStorage}));

    this.client = client;
    this.users = client.service('users');
  }  

  async login(credentials) {
    try {
      if (!credentials) {
        await this.client.authenticate();
      } else {
        const payload = Object.assign({strategy: 'local'}, credentials);
        await this.client.authenticate(payload);
      }
    } catch (error) {
      return { success: false, error: error};
    }

    return { success: true };
  }
}
