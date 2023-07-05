const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUserByEmail, getUserById) {
  // Funkcja do autoryzacji użytkownika
  const authenticateUsers = async (email, password, done) => {
    // Znajdź po emailu
    const user = getUserByEmail(email);
    if (user == null) {
      return done(null, false, { message: "Nie ma takiego użytkownika!" });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Błędne hasło!" });
      }
    } catch (e) {
      console.log(e);
    }
  };

  

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUsers));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id));
  });
}

module.exports = initialize;
