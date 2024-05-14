import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";


// Serialize and Deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID:"737690520293-viq3fb2j1fcus7s6antta5nbi7ki82bp.apps.googleusercontent.com",
      clientSecret:"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", // Add your client secret here
      callbackURL:"http://localhost:8080/api/v1/auth/google/callback", //https://als-backend-node.onrender.com #this url will change when host another server 
      passReqToCallback: true,
      scope:["profile","email"]
    },

    async (request, accessToken, refreshToken, profile, done) => {
   //save data in DB frome here also
      return done(null, profile);
    }
  )
);