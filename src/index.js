const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();
const bodyParser = require('koa-bodyparser');

// ---------622p 라우트 모듈화 ~

const api = require('./api');

// 라우터 설정
router.use('/api', api.routes()); // api 라우트 적용

// 라우터 적용 전에 bodyParser 적용
app.use(bodyParser());

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

//  p.621 REST API
// ------실습--------
// 1. 파라미터를 통해 복합 쇼핑몰 페이지에 대한 카테고리 params 를 정의하여, 라우팅 페이지에 출력하기
// 2. 사용자에 대한 code query 를 정의하여, 유무에 따른 결과를 화면에 출력하기

// router.get('/production/:category?', (ctx) => {
//   const { category } = ctx.params;

//   const result = category ? `${category} 페이지` : '메인 홈페이지';
//   ctx.body = result;
// });

// router.get('/users', (ctx) => {
//   const { code } = ctx.query;
//   const result = code
//     ? `회원님의 코드는 ${code} 입니다.`
//     : '코드를 찾을 수 없습니다.';

//   ctx.body = result;
// });

// app.use(router.routes()).use(router.allowedMethods());

//

// ------p.616 nodemon 사용하기---------
// app.use(async (ctx, next) => {
//   console.log(ctx.url);
//   console.log(1);
//   if (ctx.query.authorized !== '1') {
//     ctx.status = 401; // Unauthorized
//     return;
//   }
//   // next().then(() => {
//   //   console.log('END');
//   // });
//   await next();
//   console.log('END');
// });

// app.use((ctx, next) => {
//   console.log(2);
//   next();
// });

// app.use((ctx) => {
//   ctx.body = 'hello world';
// });

app.listen(4000, () => {
  console.log('Listening to port 4000');
});
