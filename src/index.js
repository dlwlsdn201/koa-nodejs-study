// ------실습--------
// 1. 파라미터를 통해 복합 쇼핑몰 페이지에 대한 카테고리 params 를 정의하여, 라우팅 페이지에 출력하기
// 2. 사용자에 대한 code query 를 정의하여, 유무에 따른 결과를 화면에 출력하기
const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

router.get('/production/:category?', (ctx) => {
  const { category } = ctx.params;

  const result = category ? `${category} 페이지` : '메인 홈페이지';
  ctx.body = result;
});

router.get('/users', (ctx) => {
  const { code } = ctx.query;
  const result = code
    ? `회원님의 코드는 ${code} 입니다.`
    : '코드를 찾을 수 없습니다.';

  ctx.body = result;
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(4000, () => {
  console.log('Listening to port 4000');
});

// const Koa = require('koa');
// const Router = require('koa-router');

// const app = new Koa();
// const router = new Router();

// // 라우터 설정
// router.get('/', ctx => {
//   ctx.body = '홈';
// });

// router.get('/about/:name?', (ctx) => {
//   const { name } = ctx.params;
//   // name의 존재 유무에 따라 다른 결과 출력
//   ctx.body = name ? `${name} 입니다` : '이름 오류';
// });

// router.get('/posts', (ctx) => {
//   const { id } = ctx.query;
//   // id 존재 유무에 따라 다른 결과 출력
//   ctx.body = id ? `포스트 #${id}` : '포스트 아이디가 없습니다';
// });

// // app 인스턴스에 라우터 적용
// app.use(router.routes()).use(router.allowedMethods());

// app.listen(4000, () => {
//   console.log('Listening to port 4000');
// })

// ---------nodemon 사용하기---------
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

// app.listen(4000, () => {
//   console.log('Listening to port 4000');
// });
