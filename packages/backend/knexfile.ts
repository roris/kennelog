// Update with your config settings.

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './kennelog.sqlite3'
    },
    useNullAsDefault: false
  },

  staging: {
    client: 'sqlite3',
    connection: {
      filename: './kennelog.sqlite3'
    },
    useNullAsDefault: false
  },

  production: {
    client: 'sqlite3',
    connection: {
      filename: './kennelog.sqlite3'
    },
    useNullAsDefault: false
  }
};
