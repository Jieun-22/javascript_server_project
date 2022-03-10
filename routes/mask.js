var logger = require('../config/logger');

var mask = function(req,res) {
    
    console.log('마스크 재고 확인 기능 실행됨.');
    
    res.render('search.ejs');
}

var search = function(req,res) {
    
    console.log('mask 모듈 안에 있는 search 호출됨.');
    
    var database = req.app.get('database');
    
    if(database.db) {
        var paramPharmacyName = req.body.pharmacyname || req.query.pharmacyname;
        
        //약국 이름으로 데이터베이스에 검색
        database.PharmacyModel.findByPharmacyName(paramPharmacyName, function(err,results) {
            
            logger.info('마스크 수량 확인을 위해 pharmacies DB에 접근함.');
            if(err) {
                
                console.error('약국이름으로 마스크 수량 확인중 에러발생 : ' + err.stack);
                
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>약국이름으로 마스크 수량 확인중 에러발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                
                return;
            }
            
            if(results == undefined || results.length < 1) {
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>입력하신 이름의 약국이 없습니다.</h2>');
                res.write('<p><a href="/process/mask">뒤로가기</a></p>');
                res.end();
                
                return;
            } else {
                var mask = results[0]._doc.mask;
                
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>' + paramPharmacyName + ' 마스크 수량 : ' + mask +'개 입니다.</h2>');
                
                res.write('<p><a href="/process/masklist">마스크 재고가 있는 약국 리스트 보기</a></p>');
                res.write('<p><a href="/">홈으로</a></p>');
                res.end();
            }
        });
    } else{
        
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
        
        logger.error('데이터베이스 연결 실패');
    }
    
}

var masklist = function(req,res) {
    console.log('mask 모듈 안에 있는 masklist 호출됨.');
    
    var database = req.app.get('database');
    
    if(database.db) {
        database.PharmacyModel.findAll(function(err,results) {
            
            logger.info('마스크 재고가 있는 약국 조회하기위해 pharmacies DB에 접근함.');
            if(err) {
                console.error('마스크 수량 조회중 오류 발생 : ' + err.stack);
            
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>마스크 수량 조회중 오류 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                
                return;
               }
            
            if(results) {
                var maskList = [];
                
                //마스크 재고 있는 약국 maskList에 넣기
                for(var i = 0; i <results.length; i++) {
                    
                    if(results[i]._doc.mask >0 ) {
                        maskList.push(results[i]);
                    }
                }
                
                if(maskList.length > 0) {
                    
                    //마스크 재고가 있는 약국이 있을 때
                    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>마스크 재고가 남아있는 약국 리스트</h2>');
                    res.write('<div><ul>');
                
                    for(var i = 0; i<maskList.length; i++) {
                        var curPharmacyName = maskList[i]._doc.pharmacyname;
                        var curMask = maskList[i]._doc.mask;
                        var curLoc = maskList[i]._doc.pharmacyloc;
                        var curTel = maskList[i]._doc.pharmacytel;
                        var curUpdatedAt = maskList[i]._doc.updated_at;
                        
                        res.write('  <li>#' + i + ' - 약국 이름 : '+curPharmacyName + ', 마스크 수량 : '  
                                  +curMask + '개, 약국 위치 : ' +   curLoc + ', 약국 전화번호 : ' + curTel + ', 업데이트된 날짜 : ' + curUpdatedAt );
                    }
                    res.write('</ul></div>');
                    res.write('<p><a href="/">홈으로</a></p>');
                    res.end();
                    
                } else {
                    //마스크 재고가 있는 약국이 없을 때
                    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>마스크 재고가 남아있는 약국이 없습니다.</h2>');
                    res.write('<p><a href="/">홈으로</a></p>');
                    res.end();
                }
               
                
                
            }
        });
    } else {
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
        logger.error('데이터베이스 연결 실패');
    }
    
}

module.exports.mask = mask;
module.exports.search = search;
module.exports.masklist = masklist;