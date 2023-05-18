//1. express 라이브러리 첨부와 사용
const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true})); //body-parser 사용하기 위한 코드

//mongoDB 코드
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb+srv://july:sysy2027@cluster0.acwyrqh.mongodb.net/?retryWrites=true&w=majority', function(에러, client){
    if (에러) return console.log(에러);
        //서버띄우는 코드 여기로 옮기기
        app.listen(8080, function(){ //파라미터1. 오픈할 포트번호
            console.log('hello 8080 server!')//파라미터2. 서버 오픈시 실행할 코드
        });
});


// const express = require('express')
// const app = express()
// app.use(express.urlencoded({ extended: true }));

// const MongoClient = require('mongodb').MongoClient


// MongoClient.connect('mongodb+srv://july:<sysy2027>@cluster0.acwyrqh.mongodb.net/?retryWrites=true&w=majority', function(에러, client){
//   if (에러) return console.log(에러)
//   app.listen(8080, function() {
//     console.log('listening on 8080')
//   })
// });



//원하는 포트(8080)에 서버를 오픈하기
// app.listen(8080, function(){ //파라미터1. 오픈할 포트번호
//     console.log('hello 8080 server!')//파라미터2. 서버 오픈시 실행할 코드
// })

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
app.post('/add', function(요청, 응답) { //input에 적은 내용은 [요청]에 저장됨
    console.log(요청.body);
    응답.send('전송완료')
}); 

