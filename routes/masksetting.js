var logger = require('../config/logger');

var setting = function(req,res) {
    
    console.log('setting의 setting 호출됨.');
    
    var database = req.app.get('database');
    
    if (!req.user) {
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>약국 계정으로 로그인해야 접근가능 합니다.</h2>');
        res.write('<br><br><p><a href="/">홈으로</a></p>');
        res.end();
        
    } else {
        if(database.db) {
           
            var userEmail = req.user.email;
            
            database.PharmacyModel.findByEmail(userEmail, function(err,results) {
                
                logger.info('마스크 수량 업데이트를 위한 약국계정 확인을 위해 pharmacies DB에 접근함.');
                
                if (err) {
                    console.error('사용자 확인 중 에러 발생 : ' + err.stack);
                    logger.error('사용자 확인 중 에러 발생');
                    
                    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>사용자 확인 중 에러가 발생하였습니다.');
                    res.write('<p>' + err.stack + '</p>');
                    res.end();
                    
                    return;
                }
                
                if (results == undefined || results.length < 1) {
				    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				    res.write('<h2>약국 계정만 접근 가능합니다.</h2>');
                    res.write('<br><br><p><a href="/">홈으로</a></p>');
				    res.end();
				
				    return;
                
			     } else {
                     
                     console.log('약국 사용자 계정 확인됨.');
                     res.render('setting.ejs');
                
                }
                
                
            });
        } else {
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		    res.write('<h2>데이터베이스 연결 실패</h2>');
		    res.end();
            logger.error('데이터베이스 연결 실패');
        }
       
    }
    
};

var update = function(req,res) {
    
    console.log('setting의 update 호출됨.');
    
    var database = req.app.get('database');
    var paramMask = req.body.mask || req.query.mask;
    
    if (database.db) {
        
        var userEmail = req.user.email;
        
        database.db.collection('pharmacies').update({email:userEmail},{$set:{mask:paramMask}}, function(err,doc) {
            logger.info('마스크 수량 업데이트를 위해 pharmacies DB에 접근함.');
            if(err) {
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>업데이트 실패</h2>');
                res.end();
                logger.error(userEmail + 'user가 pharmacies DB에 마스크 수량 업데이트중 오류 발생 : ' + err.stack);
            
            }  else {
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>업데이트 완료</h2>');
                res.write('<h3>'+ paramMask+'개로 수정되었습니다.</h3>');
                res.write('<p><a href="/">홈으로</a>.</p>');
                res.end();
                logger.info(userEmail + 'user가 pharmacies DB에 마스크 수량 업데이트함.');
            }
        });
        
        
		
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
        logger.error('데이터베이스 연결 실패');
	}    
}

module.exports.setting = setting;
module.exports.update = update;