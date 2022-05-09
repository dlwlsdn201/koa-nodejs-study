const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

// // 라우터 설정
// router.get('/', ctx => {
//   ctx.body = '홈';
// });

// router.get('/about', ctx => {
//   ctx.body = '소개';
// });

// // app 인스턴스에 라우터 적용
// app.use(router.routes()).use(router.allowedMethods());

// app.listen(4000, () => {
//   console.log('Listening to port 4000');
// })

// ---------nodemon 사용하기---------
app.use(async (ctx, next) => {
  console.log(ctx.url);
  console.log(1);
  if (ctx.query.authorized !== '1') {
    ctx.status = 401; // Unauthorized
    return;
  }
  // next().then(() => {
  //   console.log('END');
  // });
  await next();
  console.log('END');
});

app.use((ctx, next) => {
  console.log(2);
  next();
});

app.use((ctx) => {
  ctx.body = 'hello world';
});

app.listen(4000, () => {
  console.log('Listening to port 4000');
});
