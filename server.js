const express = require('express');
const app = express();//express 라이브러리 첨부와 사용
app.use(express.urlencoded({extended: true})); //body-parser 사용하기 위한 코드
const MongoClient = require('mongodb').MongoClient;//mongoDB 코드
app.set('view engine', 'ejs');
app.use('/public', express.static('public')); //static파일을 보관하기 위해 public 폴더 사용 명시
const methodOverride = require('method-override') //method-override를 사용하기 위한 코드
app.use(methodOverride('_method'))
require('dotenv').config()
const {ObjectId} = require('mongodb'); //오브젝트 아이디로 감싸는 것


//원하는 포트(8080)에 서버를 오픈하기 ~ MongoClient 코드 안쪽으로 이동시켜둠
// app.listen(8080, function(){ //파라미터1. 오픈할 포트번호
//     console.log('hello 8080 server!')//파라미터2. 서버 오픈시 실행할 코드
// })

var db;//전역변수 만들기
MongoClient.connect(process.env.DB_URL, { useUnifiedTopology: true }, function(에러, client){
        if (에러) return console.log(에러);

        db = client.db('todoapp');//todoapp 이라는 database에 접속 요청 명령

        //서버띄우는 코드
        app.listen(process.env.PORT, function(){ //파라미터1. 오픈할 포트번호
            console.log('hello 8080 server!')//파라미터2. 서버 오픈시 실행할 코드
        });
});



//get 요청 처리하는 기계
app.get('/pet', function(요청, 응답) { 
    응답.send('pet store!')
  })


// / 경로로 접속하면 index.html을 sendFile하는 기계
app.get('/', function(요청, 응답) { 
    //응답.sendFile(__dirname +'/index.html') //dirname:현재파일의 경로/
    응답.render('index.ejs');
}); 

// /write 경로로 접속하면 write.html을 sendFile하는 기계
app.get('/write', function(요청, 응답) { 
    //응답.sendFile(__dirname +'/write.html') //dirname:현재파일의 경로
    응답.render('write.ejs');
}); 

//add 경로로 form 내용 서버에 POST 방식으로 전달
// app.post('/add', function(요청, 응답) { //★★★★★중요! input에 적은 내용은 [요청]에 저장됨
//     console.log(요청.body);
//     응답.send('전송완료')
// }); 

// app.post('/add', function(요청, 응답){
//     응답.send('전송완료');
//     db.collection('post').insertOne( { 제목 : 요청.body.title, 날짜 : 요청.body.date } , function(){
//       console.log('저장완료')
//     });
//   });



// get요청으로 /list로 접속하면 실제 db의 데이터들의 html을 보여주자
app.get('/list', function(요청, 응답) { 
    //1. DB에 저장된 post라는 collection안의 [모든 데이터]를 꺼내자
    db.collection('post').find().toArray(function(에러, 결과){
        // console.log(결과);
        응답.render('list.ejs', {posts : 결과});
    });
}); 

app.get('/search', (요청, 응답)=>{
    console.log(요청.query);
    db.collection('post').find( { $text : { $search: 요청.query.value }} ).toArray((에러, 결과)=>{
      console.log(결과)
      응답.render('search.ejs', {posts : 결과})
    })
  })
// app.get('/search', (요청, 응답)=>{
//     console.log(요청.query);
//     db.collection('post').find( { 제목 : 요청.query.value }).toArray((에러, 결과)=>{
//       console.log(결과)
//       응답.render('search.ejs', {posts : 결과})
//     })
//   })




// /detail로 접속하면 detail.ejs 렌더링
app.get('/detail/:id', function(요청, 응답){ //detail에 접속하면 id값(파라미터)에 맞는 페이지를 보여줌
    db.collection('post').findOne({_id : parseInt(요청.params.id)}, function(에러, 결과){ //요청.params.id URL의 파라미터 중 id라는 이름을 가진 것 findOne
        console.log(결과); //findOne으로 찾은 데이터는 결과에 저장
        응답.render('detail.ejs', { data : 결과 }); //data라는 이름으로 결과라는 데이터를 가져다가 detail.ejs파일로 보내달라

        if (에러) return console.log('에러가 발생하였습니다.');
    })
})

// /edit으로 접속하면 edit.ejs를 렌더링
app.get('/edit/:id', function(요청, 응답){ //edit/:id는 _id : 요청.params.id과 같다
    db.collection('post').findOne({ _id :  parseInt(요청.params.id) }, function(에러, 결과){
        응답.render('edit.ejs', { post : 결과 }) //edit.ejs 파일에서 결과를 post라는 이름으로 이용가능하다
        console.log(결과)
    })
});

app.put('/edit', function(요청, 응답){ //_id : 요청.body.id ==> input중 name 속성 이름이 id인 것
    db.collection('post').updateOne({ _id : parseInt(요청.body.id) }, {$set : { 제목 : 요청.body.title, 날짜 : 요청.body.date }}, function(에러, 결과){
        console.log('수정되었습니다')
        응답.redirect('/list')
    })
})

//로그인 페이지 만들기
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

//app.use 부분은 미들웨어. 미들웨어란? 요청과 응답 사이에 뭐가를 실행시키는 코드
app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', function(요청, 응답){
    응답.render('login.ejs')
});

app.post('/login', passport.authenticate('local', {
    failureRedirect : '/fail' //실패했을때 이곳으로 리다이렉트
}), function(요청, 응답){
    응답.redirect('/list')//redirect('이곳으로 리다이렉트')
});

app.get('/mypage', 로그인했니, function(요청, 응답){
    console.log(요청.user) //passport.deserializeUser에서 보낸 유저의 개인정보
    응답.render('mypage.ejs', {사용자 : 요청.user})
})



function 로그인했니(요청, 응답, next){ // /mypage 미들웨어
    if(요청.user){
        next()
    } else {
        응답.send('로그인하십시오')
    }
}


//아이디와 비밀번호를 입력했을때 
passport.use(new LocalStrategy({
    usernameField: 'id', //.ejs의 name값
    passwordField: 'pw', //.ejs의 name값
    session: true, //세션으로 저장할건지 참/거짓 여부
    passReqToCallback: false, //아이디/비밀번호 외의 다른 정보검사가 필요한지 여부
  }, function (입력한아이디, 입력한비번, done) {//아래부터 사용자의 아이디/비밀번호를 검증하는 코드
    //console.log(입력한아이디, 입력한비번);
    db.collection('login').findOne({ id: 입력한아이디 }, function (에러, 결과) {
      if (에러) return done(에러)
  
      if (!결과) return done(null, false, { message: '존재하지않는 아이디요' })//일치하는 아이디 없을때==결과에 아무것도 없을때
      if (입력한비번 == 결과.pw){//일치하는 아이디 있을때
        return done(null, 결과)
      } else {
        return done(null, false, { message: '비번틀렸어요' })
      }
    })
  }));
  
  //로그인 세션을 유지시킬려면
  passport.serializeUser(function (user, done) {//유저의 정보를 시리얼라이즈 하는 것 user에는 검증때 리턴된 [결과]가 들어감
    done(null, user.id)
  });
  
  passport.deserializeUser(function (아이디, done) {//아이디는 serializeUser의 user.id
    //DB에서 user.id로 유저를 찾은 후 세션아이디를 바탕으로 개인정보를 아래의 {}에 출력. 마이페이지 내의 각종 정보들을 가지고 올 수 있다
    db.collection('login').findOne({id : 아이디}, function(에러, 결과){
        done(null, 결과)
    })
  }); 

  app.post('/register', function (요청, 응답) {
    db.collection('login').insertOne({ id: 요청.body.id, pw: 요청.body.pw }, function (에러, 결과) {
      응답.redirect('/')
    })
  })

    //어떤 사람이 /add로 post 요청을 하면 데이터 2개(날짜, 제목)을 보내주는데, 이때 post collection을 저장하기
    app.post('/add', function(요청, 응답) {
        응답.send('post collection으로 전송완료');

        db.collection('counter').findOne({name : '게시물 갯수'}, function(에러, 결과){//counter라는 collection에서 name :'게시물 갯수'인 데이터를 찾아달라. findOne() 1개 찾는 함수
            // console.log(결과.totalPost);
            var 총게시물갯수 = 결과.totalPost;
            var post = { _id: 총게시물갯수 + 1, 작성자: 요청.user._id , 제목: 요청.body.title, 날짜: 요청.body.date }

            //_id값에 총게시물갯수+1 적용
            db.collection('post').insertOne(post, function(에러, 결과){
                console.log('날짜와 제목 저장완료');

                //counter안의 totalPost +1 시켜야함
                db.collection('counter').updateOne({name: '게시물 갯수'}, { $inc: {totalPost: 1} }, function(에러, 결과){//updateOne() : DB데이터 수정해주는 함수, set operator : {$set : {totalPost: 바꿀 값}}
                    if(에러){return console.log(에러)}
                    //  응답.send('전송완료!!');
                })
            })
        })
    })

    //delete 요청
    app.delete('/delete', function(요청, 응답){
        console.log(요청.body);
        요청.body._id = parseInt(요청.body._id); //서버에 요청시 문자로 전달되는 _id값을 숫자로 변환하는 함수 parseInt
        //요청.body에 포함된 게시물번호를 가진 글을 DB에서 삭제
        db.collection('post').deleteOne({_id : 요청.body._id, 작성자 : 요청.user._id }, function(에러, 결과){ //deleteOne({삭제할 항목}, function(){삭제 후 실행될 코드})
            console.log('삭제완료');//터미널창에 '삭제완료' 보여짐
            응답.status(200).send({message : "성공함"});//서버에서 응답 요청해주는 법 200은 OK, 400은 Bad request
        })
    })

    // app.use('/', require('./routes/shop.js') );

    app.get('/shop/shirts', function(요청, 응답){
        응답.send('셔츠 파는 페이지입니다.');
     });
     
     app.get('/shop/pants', function(요청, 응답){
        응답.send('바지 파는 페이지입니다.');
     }); 

     app.use('/', require('./routes/shop.js') );


     //채팅방 만들기

     app.get('/chat', 로그인했니, function(요청, 응답){ 

      db.collection('chatroom').find({ member : 요청.user._id }).toArray().then((결과)=>{
        console.log(결과);
        응답.render('chat.ejs', {data : 결과})
      })
    });
    
    app.post('/chatroom', 로그인했니, function(요청, 응답){

      var 저장할거 = {
        title : '무슨무슨채팅방',
        member : [ObjectId(요청.body.당한사람id), 요청.user._id],
        date : new Date()
      }
    
      db.collection('chatroom').insertOne(저장할거).then(function(결과){
        응답.send('저장완료')
      });
    });



      