import {inject} from 'aurelia-dependency-injection';
import feathers, { Service, Application } from '@feathersjs/feathers';
import authentication from '@feathersjs/authentication-client';
import socketio from '@feathersjs/socketio-client';
import * as io from 'socket.io-client';
import {SharedState} from './shared-state';

@inject(SharedState)
export class WebApi {

  users: Service<any>;

  private client: Application<any>;

  private socket: any;

  private sharedState: SharedState;

  constructor(sharedState: SharedState) {
    this.socket = io(CONFIG.server);
    const client = feathers();
    client.configure(socketio(this.socket));
    client.configure(authentication({storage: window.localStorage}));

    this.client = client;
    this.users = client.service('users');
    this.sharedState = sharedState;
  }  

  async login(credentials) {
    try {
      let res = {};
      if (!credentials) {
        res = await this.client.authenticate();
      } else {
        const payload = Object.assign({strategy: 'local'}, credentials);
        res = await this.client.authenticate(payload);
      }
      this.sharedState.user = res.user;
      this.sharedState.isLoggedIn = true;
      return { success: true };
    } catch (error) {
      return { success: false, error: error};
    }
  }

  async logout() {
    this.sharedState.isLoggedIn = false;
    this.sharedState.user = {};
    return this.client.logout();
  }
}
