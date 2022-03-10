var logger = require('./logger');

module.exports = {
	server_port: 3000,
	db_url: 'mongodb://localhost:27017/R12_18',
    // 클라우드 사용시 
    //db_url: ‘mongodb://201701952:zxc29944774@ds045714.mlab.com:45714/heroku_l75bkjwn’
	db_schemas: [
	    {file:'./user_schema', collection:'users', schemaName:'UserSchema', modelName:'UserModel'},
        {file:'./pharmacy_schema', collection:'pharmacies', schemaName:'PharmacySchema', modelName:'PharmacyModel'},
        {file:'./post_schema', collection:'post', schemaName:'PostSchema', modelName:'PostModel'}
	],
	route_info: [
        {file : './post', path : '/process/addpost', method : 'addpost', type : 'post'}
        ,{file : './post', path : '/process/post', method : 'post', type : 'post'}
        ,{file : './post', path : '/process/post', method : 'post', type : 'get'}
        ,{file : './post', path : '/process/showpost/:id', method : 'showpost', type : 'post'}
        ,{file : './post', path : '/process/showpost/:id', method : 'showpost', type : 'get'}
        ,{file : './post', path : '/process/listpost', method : 'listpost', type : 'post'}
        ,{file : './post', path : '/process/listpost', method : 'listpost', type : 'get'}
        ,{file : './pharmacy', path : '/process/listpharmacy', method : 'list', type : 'get'}
        ,{file : './pharmacy', path : '/process/listpharmacy', method : 'list', type : 'post'}
        ,{file : './pharmacy', path : '/process/circlepharmacy', method : 'findCircle', type : 'post'}
        ,{file : './pharmacy', path : '/process/circlepharmacy', method : 'findCircle', type : 'get'}
        ,{file : './pharmacy', path : '/process/find', method : 'find', type : 'get'}
        ,{file : './masksetting', path : '/process/setting', method : 'setting', type : 'post'}
        ,{file : './masksetting', path : '/process/setting', method : 'setting', type : 'get'}
        ,{file : './masksetting', path : '/process/update', method : 'update', type : 'post'}
        ,{file : './mask', path : '/process/masklist', method : 'masklist', type : 'get'}
        ,{file : './mask', path : '/process/mask', method : 'mask', type : 'get'}
        ,{file : './mask', path : '/process/search', method : 'search', type : 'post'}
	]
	
}

logger.info('config.js 파일에 의해 DB와 라우터 정의됨.');