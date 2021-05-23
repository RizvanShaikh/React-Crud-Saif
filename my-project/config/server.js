module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'db919af17762b496ebbee821e46fe037'),
    },
    cors:{
      enabled:true
    }
  },
});
