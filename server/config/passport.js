import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

/**
 * Configure Passport with Google OAuth 2.0 strategy
 */
const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.API_URL + '/auth/google/callback',
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          
          // Check if email is in admin list
          const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
          const isAdminEmail = adminEmails.includes(email.toLowerCase());
          
          // Check if user already exists
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            // Update user info
            user.name = profile.displayName;
            user.avatar = profile.photos[0]?.value;
            // Update role if admin email
            if (isAdminEmail && user.role !== 'admin') {
              user.role = 'admin';
            }
            await user.save();
            return done(null, user);
          }

          // Create new user
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: email,
            avatar: profile.photos[0]?.value,
            role: isAdminEmail ? 'admin' : 'user',
          });

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );

  // Serialize user for session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export default configurePassport;
