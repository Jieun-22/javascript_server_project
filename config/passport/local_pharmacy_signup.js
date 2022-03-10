var LocalStrategy = require('passport-local').Strategy;
var logger = require('../logger');

module.exports = new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true   
	}, function(req, email, password, done) {
        
        var paramName = req.body.name || req.query.name;
        var paramPharmacyName = req.body.pharmacyname || req.query.pharmacyname;
        var paramPharmacyTel = req.body.pharmacytel || req.query.pharmacytel;
        var paramPharmacyLoc = req.body.pharmacyloc || req.query.pharmacyloc;
        var paramLongitude = req.body.longitude || req.query.longitude;
        var paramLatitude = req.body.latitude || req.query.latitude; 
	 
		console.log('passport의 local-pharmacy-signup 호출됨 : ' + email + ', ' + password + ', ' + paramName);
		
	    process.nextTick(function() {
	    	var database = req.app.get('database');
		    database.UserModel.findOne({ 'email' :  email }, function(err, user) {
                
                logger.info('약국 계정 회원가입을 위하여 users DB에 접근함.');
                
		        if (err) {
                    
                    logger.info('약국 계정 회원가입을 위하여 users DB에 findeOne 메소드 실행중 에러발생.');
		            return done(err);
		        }
		        
		        if (user) {
		        	console.log('기존에 계정이 있음.');
		            return done(null, false, req.flash('signupMessage', '계정이 이미 있습니다.'));  
                    
		        } else {
		        	var user = new database.UserModel({'email':email, 'password':password, 'name':paramName, 'pharmacy':true});
                    
		        	user.save(function(err) {
		        		if (err) {
                            
                            logger.error('users에 약국 계정 추가중 에러 발생. ');
		        			throw err;
		        		}
		        		
                        logger.info('users에 새로운 약국 계정 추가됨 :  ' + email);
		        	    console.log("약국 사용자 데이터 추가함.");
                    });
                    
                    var pharmacy = new database.PharmacyModel({'email':email, 'password':password, 'name':paramName, 'pharmacyname':paramPharmacyName, 'pharmacytel':paramPharmacyTel, 'pharmacyloc': paramPharmacyLoc
                    ,geometry : { 
                        type : 'Point', 
                        coordinates : [paramLongitude, paramLatitude]}});
                        
                    pharmacy.save(function(err) {
                        if(err) {
                            
                            logger.error('pharmacies에 약국 정보 추가중 오류 발생 : ' + err.stack);
                            throw err;
                        }
                        
                        logger.info('pharmacies에 새로운 약국 정보 추가됨 : ' + paramPharmacyName);
                        console.log("약국 데이터 추가함.");
                        return done(null, pharmacy);
                        
		        	});
		        }
		    });    
	    });

	});
