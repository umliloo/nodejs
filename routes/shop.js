// var router = require('express').Router(); //require() : 다른 파일이나 라이브러리 가져다 쓸때 사용

// // router.use(로그인했니); //전역 미들웨어
// router.use('/shirts', 로그인했니); // /shirts 접속시에만 미들웨어 적용



// function 로그인했니(요청, 응답, next){ // /mypage 미들웨어
//     if(요청.user){
//         next()
//     } else {
//         응답.send('로그인하십시오')
//     }
// }

// router.get('/shirts', function(요청, 응답){
//    응답.send('셔츠 파는 페이지입니다.');
// });

// router.get('/pants', function(요청, 응답){
//    응답.send('바지 파는 페이지입니다.');
// }); 



// //exports() : 다른 곳에서 사용할 수 있게 현재 파일에서 내보낼 변수인 router를 지정 
// module.exports = router; 


var router = require('express').Router();

function 로그인했니(요청, 응답, next) {
  if (요청.user) { next() }
  else { 응답.send('로그인 안하셨는데요?') }
}
router.get('/shirts', 로그인했니, function(요청, 응답){
   응답.send('셔츠 파는 페이지입니다.');
});

router.get('/pants', function(요청, 응답){
   응답.send('바지 파는 페이지입니다.');
}); 

module.exports = router;