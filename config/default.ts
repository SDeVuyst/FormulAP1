export default {
  port: 9000,
  log: {
    level: 'info',
    disabled: false,
  },
  auth: {
    maxDelay: 5000,
    jwt: {
      audience: 'formulapi.hogent.be',
      issuer: 'formulapi.hogent.be',
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