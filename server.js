const express = require('express');
const app = express();//express 라이브러리 첨부와 사용
app.use(express.urlencoded({extended: true})); //body-parser 사용하기 위한 코드
const MongoClient = require('mongodb').MongoClient;//mongoDB 코드
app.set('view engine', 'ejs');

//원하는 포트(8080)에 서버를 오픈하기 ~ MongoClient 코드 안쪽으로 이동시켜둠
// app.listen(8080, function(){ //파라미터1. 오픈할 포트번호
//     console.log('hello 8080 server!')//파라미터2. 서버 오픈시 실행할 코드
// })

var db;//전역변수 만들기
MongoClient.connect('mongodb+srv://july:sysy2027@cluster0.acwyrqh.mongodb.net/?retryWrites=true&w=majority',{ useUnifiedTopology: true }, function(에러, client){
        if (에러) return console.log(에러);

        db = client.db('todoapp');//todoapp 이라는 database에 접속 요청 명령

        //DB에 자료 추가하는 3줄 코드
        // db.collection('post').insertOne({이름 : 'Jeon', _id : 200}, function(에러, 결과){
        //     //post라는 collection에 저장
        //     //insertOne(저장할데이터, 콜백함수)
        //     console.log('저장완료');
        // });

        //서버띄우는 코드 여기로 옮기기
        app.listen(8080, function(){ //파라미터1. 오픈할 포트번호
            console.log('hello 8080 server!')//파라미터2. 서버 오픈시 실행할 코드
        });
});



//get 요청 처리하는 기계
app.get('/pet', function(요청, 응답) { 
    응답.send('펫용품 사시오')
  })


// / 경로로 접속하면 index.html을 sendFile하는 기계
app.get('/', function(요청, 응답) { 
    응답.sendFile(__dirname +'/index.html') //dirname:현재파일의 경로
}); 

// /write 경로로 접속하면 write.html을 sendFile하는 기계
app.get('/write', function(요청, 응답) { 
    응답.sendFile(__dirname +'/write.html') //dirname:현재파일의 경로
}); 

//add 경로로 form 내용 서버에 POST 방식으로 전달
// app.post('/add', function(요청, 응답) { //input에 적은 내용은 [요청]에 저장됨
//     console.log(요청.body);
//     응답.send('전송완료')
// }); 

// app.post('/add', function(요청, 응답){
//     응답.send('전송완료');
//     db.collection('post').insertOne( { 제목 : 요청.body.title, 날짜 : 요청.body.date } , function(){
//       console.log('저장완료')
//     });
//   });

//어떤 사람이 /add로 post 요청을 하면 데이터 2개(날짜, 제목)을 보내주는데, 이때 post collection을 저장하기
app.post('/add', function(요청, 응답) {
    응답.send('post collection으로 전송완료');
    console.log(요청.body.date);
    console.log(요청.body.title);
    db.collection('post').insertOne({날짜 : 요청.body.date, 제목 : 요청.body.title}, function(){
        console.log('날짜와 제목 저장완료')
    });
}); 

// get요청으로 /list로 접속하면 실제 db의 데이터들의 html을 보여주자
app.get('/list', function(요청, 응답) { 
    //1. DB에 저장된 post라는 collection안의 [모든 데이터]를 꺼내자
    db.collection('post').find().toArray(function(에러, 결과){
        console.log(결과);
        응답.render('list.ejs', {posts : 결과});
    });
}); 