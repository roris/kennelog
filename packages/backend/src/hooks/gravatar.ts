// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
const crypto = require('crypto');

const gravatarUrl = 'https://s.gravatar.com/avatar';

export default (options = {}): Hook => {
  return async (context: HookContext) => {

    const { email } = context.data;
    const hash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');

    context.data.avatar = `${gravatarUrl}/${hash}`;

    return context;
  };
};
