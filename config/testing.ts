export default {
  log: {
    level: 'silly',
    disabled: false,
  },
  auth: {
    maxDelay: 0,
    jwt: {
      audience: 'formulapi.hogent.be',
      issuer: 'formulapi.hogent.be',
      expirationInterval: 60 * 60, // s (1 hour)
      secret:
        'eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked',
    },
    argon: {
      hashLength: 32,
      timeCost: 6,
      memoryCost: 2 ** 17,
    },
    zxcvbn: {
      minScore: 3,
    },  
  },
};
  