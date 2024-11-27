export default {
  log: {
    level: 'silly',
  },
  auth: {
    maxDelay: 0,
    jwt: {
      expirationInterval: 60 * 60, // s (1 hour)
      secret:
        'eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked',
    },
  },
};
  