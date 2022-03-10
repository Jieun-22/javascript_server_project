var logger = require('../config/logger');

var post = function(req,res) {
    if (!req.user) {
        console.log('사용자 인증 안된 상태임.');
        res.redirect('/login-post');
    } else {
        console.log('사용자 인증된 상태임.');
        res.redirect('/public/addpost.html');
    }
    
};

//글 추가 기능
var addpost = function(req, res) {
	console.log('post 모듈 안에 있는 addpost 호출됨.');
    
    var paramTitle = req.body.title || req.query.title;
    var paramContents = req.body.contents || req.query.contents;
    var paramWriter = req.user.email;
    
    console.log(req.user.email);
	
    console.log('요청 파라미터 : ' + paramTitle + ', ' + paramContents + ', ' + 
               paramWriter);
    
    
	var database = req.app.get('database');
	
	if (database.db) {
		
		database.UserModel.findByEmail(paramWriter, function(err, results) {
            
            logger.info('게시판 글쓰기 기능 사용 권한 확인을 위해 users DB에 접근함.');
			if (err) {
                console.error('게시판 글 추가 중 에러 발생 : ' + err.stack);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>게시판 글 추가 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                
                return;
            }

			if (results == undefined || results.length < 1) {
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>사용자 [' + paramWriter + ']를 찾을 수 없습니다.</h2>');
				res.end();
				
				return;
			}
			
			var userObjectId = results[0]._doc._id;
			console.log('사용자 ObjectId : ' + paramWriter +' -> ' + userObjectId);
			
			var post = new database.PostModel({ 
				title: paramTitle,
				contents: paramContents,
				writer: userObjectId
			});

			post.savePost(function(err, result) {
				if (err) {
                    
                    logger.error(paramWriter+'가 post DB에 글 추가중 에러발생 : '+ err.stack);
                    throw err;
                }
				
			    console.log("글 데이터 추가함.");
			    console.log('글 작성', '포스팅 글을 생성했습니다. : ' + post.writer);
                logger.info(paramWriter + '가 post DB에 글 추가함.');
			    
			    return res.redirect('/process/showpost/' + post._id ); 
			});
			
		});
		
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
        logger.error('데이터베이스 연결 실패');
	}
	
};

var listpost = function(req, res) {
	console.log('post 모듈 안에 있는 listpost 호출됨.');
  
    var paramPage = req.body.page || req.query.page;
    var paramPerPage = req.body.perPage || req.query.perPage;
    
	var database = req.app.get('database');
	
	if (database.db) {
		var options = {
			page: paramPage,
			perPage: paramPerPage
		}
		
		database.PostModel.list(options, function(err, results) {
            logger.info('게시판 글 목록 조회를 위해 posts DB에 접근함.');
            
			if (err) {
                console.error('게시판 글 목록 조회 중 에러 발생 : ' + err.stack);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>게시판 글 목록 조회 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                
                return;
            }
			
			if (results) {
 
				database.PostModel.count().exec(function(err, count) {

					res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
					
					var context = {
						title: '글 목록',
						posts: results,
						page: parseInt(paramPage),
						pageCount: Math.ceil(count / paramPerPage),
						perPage: paramPerPage, 
						totalRecords: count,
						size: paramPerPage
					};
					
					req.app.render('listpost', context, function(err, html) {
                        if (err) {
                            console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);

                            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                            res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');
                            res.write('<p>' + err.stack + '</p>');
                            res.end();

                            return;
                        }
                        
						res.end(html);
					});
					
				});
				
			} else {
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>글 목록 조회  실패</h2>');
				res.end();
                logger.error('post DB의 글 목록 조회중 에러발생');
			}
		});
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
        logger.error('데이터베이스 연결 실패');
	}
	
};

//게시판 글 보여주기
var showpost = function(req, res) {
	console.log('post 모듈 안에 있는 showpost 호출됨.');
  
    var paramId = req.body.id || req.query.id || req.params.id;
	
    console.log('요청 파라미터 : ' + paramId);
    
	var database = req.app.get('database');
	
	if (database.db) {

		database.PostModel.load(paramId, function(err, results) {
            logger.info('글 조회를 위해 posts DB에 접근함.');
            
			if (err) {
                console.error('게시판 글 조회 중 에러 발생 : ' + err.stack);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>게시판 글 조회 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                
                return;
            }
			
			if (results) {
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				
				var context = {
					title: '글 조회 ',
					posts: results
				};
				
				req.app.render('showpost', context, function(err, html) {
					if (err) {throw err;}
					
					res.end(html);
				});
			 
			} else {
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>글 조회  실패</h2>');
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

module.exports.post = post;
module.exports.listpost = listpost;
module.exports.addpost = addpost;
module.exports.showpost = showpost;
