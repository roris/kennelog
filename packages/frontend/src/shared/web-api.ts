import feathers, { Application } from '@feathersjs/feathers';
import authentication from '@feathersjs/authentication-client';
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client';

import { Service } from '../services/service';

const SERVER_URL = 'http://localhost:3030';

export class WebApi {
  private client: Application<any>;

  constructor() {
    const socket = io(SERVER_URL); // eslint-disable-line no-undef
    this.client = feathers();
    this.client.configure(socketio(socket));
    this.client.configure(authentication());
  }

  async login(credentials: any = false): Promise<any> {
    if (!credentials) {
      // attempt to login using the token in localStorage
      return this.client.authenticate();
    } else {
      // new login attempt
      const options = { strategy: 'local' };
      const payload = Object.assign(options, credentials);
      return this.client.authenticate(payload);
    }
  }

  async logout(): Promise<any> {
    return this.client.logout();
  }

  service(name: string): Service {
    return new Service(this.client.service(name));
  }
}
