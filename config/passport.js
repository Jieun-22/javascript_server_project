var local_login = require('./passport/local_login');
var local_signup = require('./passport/local_signup');
var local_pharmacy_signup = require('./passport/local_pharmacy_signup');

module.exports = function (app, passport) {
	console.log('config/passport 호출됨.');

    passport.serializeUser(function(user, done) {
        console.log('serializeUser() 호출됨.');
        console.dir(user);

        done(null, user);  
    });

    passport.deserializeUser(function(user, done) {
        console.log('deserializeUser() 호출됨.');
        console.dir(user);
        done(null, user);  
    });

	passport.use('local-login', local_login);
	passport.use('local-signup', local_signup);
    passport.use('local-pharmacy-signup', local_pharmacy_signup);
	console.log('3가지 passport 인증방식 설정됨.');
	
};