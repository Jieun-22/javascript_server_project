var logger = require('../config/logger');

// 약국 리스트 조회 함수
var list = function(req, res) {
    console.log('pharmacy 모듈 안에 있는 list 호출됨.');
    
    var database = req.app.get('database');
    
    if(database.db) {
        //모든 약국 검색
        database.PharmacyModel.findAll(function(err, results) {
            logger.info('약국 리스트 조회를 위해 pharmacies DB에 접근함.');
            
            if (err) {
                console.error('약국 리스트 조회 중 오류 발생 : ' + err.stack);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>약국 리스트 조회 중 오류 발생</h2>');
                res.wrtie('<p>' + err.stack + '</p><br>');
                res.end();
                return;
            }
            
            if (results) {
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>약국 리스트</h2>');
                res.write('<div><ul>');
                
                for(var i = 0; i < results.length; i++) {
                    var curName = results[i]._doc.pharmacyname;
                    var curLoc = results[i]._doc.pharmacyloc;
                    var curTel = results[i]._doc.pharmacytel;
                    var curLongitude = results[i]._doc.geometry.coordinates[0];
                    var curLatitude = results[i]._doc.geometry.coordinates[1];
                    
                    res.write('     <li>#' + i + ' : ' + curName + ', ' + curTel + ', ' + curLoc +'</li>');
                }
                res.write('</ul></div>');
                res.write('<p><a href="/">홈으로</a></p>');
                res.end();
            }
        });
    } else {
        res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
        logger.error('데이터베이스 연결 실패');
    }

};

//반경내 약국 찾기 함수
var findCircle = function(req, res) {
    console.log('pharmacy 모듈 안에 있는 findCircle 호출됨.');
    
    var paramCenterLongitude = req.body.center_longitude || req.query.center_longitude;
    var paramCenterLatitude = req.body.center_latitude || req.query.center_latitude;
    var paramRadius = req.body.radius || req.query.radius;
    
    console.log('요청 파라미터 : ' + paramCenterLongitude + ', ' + paramCenterLatitude + ', ' +
               paramRadius);
    
    var database = req.app.get('database');
    
    if(database.db) {
        database.PharmacyModel.findCircle(paramCenterLongitude, paramCenterLatitude, paramRadius, 
                                         function(err, results) {
            logger.info('반경 내 약국 검색을 위해 pharmacies DB에 접근함.');
            if(err) {
                console.error('영역내 약국 검색 중 오류 발생 : ' + err.stack);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>약국 검색 중 오류 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                
                return;
            }
            
            if (results) {
                
                if( results.length > 0) {
                    res.render('findcircle.ejs', {result:results,
                                                 paramCenterLongitude: paramCenterLongitude,
                                                 paramCenterLatitude: paramCenterLatitude,
                                                 paramRadius: paramRadius});
                } else {
                    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>영역 안에 약국이 없습니다.</h2>');
                    res.end();
                }
                
                
			} else {
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>반경 내 약국 조회  실패</h2>');
				res.end();
			}
		});
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
        logger.error('데이터베이스 연결 실패');
	}
};

//홈화면에서 약국 찾기 선택됨.
var find = function(req,res){
    
    console.log('홈화면에서 반경 내 약국찾기 호출됨.');
    
    res.render('circlepharmacy.ejs');
}

module.exports.list = list;
module.exports.findCircle = findCircle;
module.exports.find = find;