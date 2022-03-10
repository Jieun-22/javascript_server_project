var LocalStrategy = require('passport-local').Strategy;
var logger = require('../logger');

module.exports = new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true    
	}, function(req, email, password, done) {
        
        var paramName = req.body.name || req.query.name;
	 
		console.log('passport의 local-signup 호출됨 : ' + email + ', ' + password + ', ' + paramName);
		
	    
	    process.nextTick(function() {
	    	var database = req.app.get('database');
		    database.UserModel.findOne({ 'email' :  email }, function(err, user) {
                
		        
		        if (err) {
                    
                    logger.error('users 계정 추가중 오류 발생 : ' + err.stack);
		            return done(err);
		        }
		        
		        if (user) {
		        	console.log('기존에 계정이 있음.');
		            return done(null, false, req.flash('signupMessage', '계정이 이미 있습니다.'));  
                    
		        } else {
		        	var user = new database.UserModel({'email':email, 'password':password, 'name':paramName});
		        	user.save(function(err) {
		        		if (err) {
		        			throw err;
		        		}
		        		
                        logger.info('새로운 users 계정 추가됨 : ' + email);
		        	    console.log("사용자 데이터 추가함.");
		        	    return done(null, user);  
		        	});
		        }
		    });    
	    });

	});
