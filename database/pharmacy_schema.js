var crypto = require('crypto');

var PharmacySchema = {};

PharmacySchema.createSchema = function(mongoose) {
	
	// 스키마 정의
	var PharmacySchema = mongoose.Schema({
		email: {type: String, 'default':''}
	    , hashed_password: {type: String, required: true, 'default':''}
	    , name: {type: String, index: 'hashed', 'default':''}
	    , salt: {type:String, required:true}
        , pharmacyname: {type: String, 'default':''}
        , pharmacytel: {type: String, 'default':''}
        , pharmacyloc : {type : String, 'default' : ''}
        , geometry : {
            'type' : {type : String, 'default' : "Point"},
            coordinates : [{type : "Number"}] 
        }
        , mask : {type: Number, 'default':0}
	    , created_at: {type: Date, index: {unique: false}, 'default': Date.now}
	    , updated_at: {type: Date, index: {unique: false}, 'default': Date.now} 
	});
	
	PharmacySchema
	  .virtual('password')
	  .set(function(password) {
	    this._password = password;
	    this.salt = this.makeSalt();
	    this.hashed_password = this.encryptPassword(password);
	    console.log('virtual password 호출됨 : ' + this.hashed_password);
	  })
	  .get(function() { return this._password });
	
    PharmacySchema.index({geomety : '2dsphere'});
    
	PharmacySchema.method('encryptPassword', function(plainText, inSalt) {
		if (inSalt) {
			return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
		} else {
			return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
		}
	});
	
	PharmacySchema.method('makeSalt', function() {
		return Math.round((new Date().valueOf() * Math.random())) + '';
	});
	
	PharmacySchema.method('authenticate', function(plainText, inSalt, hashed_password) {
		if (inSalt) {
			console.log('authenticate 호출됨 : %s -> %s : %s', plainText, this.encryptPassword(plainText, inSalt), hashed_password);
			return this.encryptPassword(plainText, inSalt) === hashed_password;
		} else {
			console.log('authenticate 호출됨 : %s -> %s : %s', plainText, this.encryptPassword(plainText), this.hashed_password);
			return this.encryptPassword(plainText) === this.hashed_password;
		}
	});

	var validatePresenceOf = function(value) {
		return value && value.length;
	};
		
	PharmacySchema.pre('save', function(next) {
		if (!this.isNew) return next();
	
		if (!validatePresenceOf(this.password)) {
			next(new Error('유효하지 않은 password 필드입니다.'));
		} else {
			next();
		}
	})
	
	PharmacySchema.path('email').validate(function (email) {
		return email.length;
	}, 'email 칼럼의 값이 없습니다.');
	
	PharmacySchema.path('hashed_password').validate(function (hashed_password) {
		return hashed_password.length;
	}, 'hashed_password 칼럼의 값이 없습니다.');
	
	
	PharmacySchema.static('findByEmail', function(email, callback) {
		return this.find({email:email}, callback);
	});
	
    PharmacySchema.static('findByPharmacyName', function(pharmacyname, callback) {
		return this.find({pharmacyname:pharmacyname}, callback);
	});
    
	PharmacySchema.static('findAll', function(callback) {
		return this.find({}, callback);
	});
    
    PharmacySchema.static('findCircle', function(center_longitude, center_latitude, radius, callback) {
        console.log('PharmacySchema의 findCircle 호출됨.');
        
        this.find().where('geometry').within(
            {center : [parseFloat(center_longitude), parseFloat(center_latitude)],
                radius : parseFloat(radius/6371000),
                unique: true, spherical : true}).exec(callback);
    });
	
	console.log('PharmacySchema 정의함.');
    
	return PharmacySchema;
};

module.exports = PharmacySchema;

