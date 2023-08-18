var router = require('express').Router(); //require() : 다른 파일이나 라이브러리 가져다 쓸때 사용

router.get('/sports', function(요청, 응답){
    응답.send('스포츠 게시판');
 });
 
 router.get('/game', function(요청, 응답){
    응답.send('게임 게시판');
 }); 

module.exports = router; 