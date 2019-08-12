import feathers, { Service, Application } from '@feathersjs/feathers';
import authentication from '@feathersjs/authentication-client';
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client';

const SERVER_URL = 'http://localhost:3030';

export class WebApi {
  blobs: Service<any>;

  users: Service<any>;

  uploads: Service<any>;

  dogs: Service<any>;

  private client: Application<any>;

  constructor() {
    const socket = io(SERVER_URL); // eslint-disable-line no-undef
    this.client = feathers();
    this.client.configure(socketio(socket));
    this.client.configure(authentication());

    this.blobs = this.client.service('blobs');
    this.uploads = this.client.service('uploads');
    this.users = this.client.service('users');
    this.dogs = this.client.service('dogs');
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
}
