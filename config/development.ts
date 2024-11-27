export default {
  log: {
    level: 'silly',
  },
  auth: {
    jwt: {
      expirationInterval: 60 * 60, // s (1 hour)
      secret:
        'eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked',
    },
  },
};
