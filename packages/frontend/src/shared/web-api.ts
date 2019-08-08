import feathers, { Service, Application } from '@feathersjs/feathers';
import authentication from '@feathersjs/authentication-client';
import socketio from '@feathersjs/socketio-client';
import * as io from 'socket.io-client';

export interface LoginResponse {
  authenticated: boolean;
  user?: any;
  code?: number;
  reason?: string;
}

export class WebApi {
  blobs: Service<any>;

  users: Service<any>;

  uploads: Service<any>;

  dogs: Service<any>;

  private client: Application<any>;

  constructor() {
    const socket = io(CONFIG.server); // eslint-disable-line no-undef
    this.client = feathers();
    this.client.configure(socketio(socket));
    this.client.configure(authentication());

    this.blobs = this.client.service('blobs');
    this.uploads = this.client.service('uploads');
    this.users = this.client.service('users');
    this.dogs = this.client.service('dogs');
  }

  async login(credentials: any = false): Promise<LoginResponse> {
    try {
      let response;
      if (!credentials) {
        // attempt to login using the token in localStorage
        response = await this.client.authenticate();
      } else {
        // new login attempt
        const options = { strategy: 'local' };
        const payload = Object.assign(options, credentials);
        response = await this.client.authenticate(payload);
      }
      return { authenticated: true, user: response.user };
    } catch (error) {
      return { authenticated: false, code: error.code, reason: error.message };
    }
  }

  async logout(): Promise<any> {
    return this.client.logout();
  }
}
