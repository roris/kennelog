import feathers, { Service, Application } from '@feathersjs/feathers';

import socketio from '@feathersjs/socketio-client';
import * as io from 'socket.io-client';

export class WebApi {
  usersService: Service<any>;

  app: Application<any>;

  socket: any;

  constructor() {
    this.socket = io(CONFIG.server);
    const app = feathers();
    app.configure(socketio(this.socket));

    this.app = app;
    this.usersService = app.service('users');
  }


}
