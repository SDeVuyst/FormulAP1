export default {
  log: {
    level: 'info',
    disabled: false,
  },
  auth: {
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
  },
};