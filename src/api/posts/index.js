import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl';
const posts = new Router();

// const printInfo = (ctx) => {
//   ctx.body = {
//     method: ctx.method,
//     path: ctx.path,
//     params: ctx.params,
//   };
// };

posts.get('/', postsCtrl.list);
posts.post('/', postsCtrl.write);

/**
 * @desc 요청 ObjectId 유효성 검증 미들웨어 함수 적용 방법 2가지
 방법 1) 코드 간결성 Bad & 라우트 경로 가독성 Good
 방법 2) 코드 간결성 Good & 라우트 경로 가독성 Bad
        (1) /api/posts/:id 경로를 위한 라우터를 새로 생성
        (2) posts 에 해당 라우터를 등록
 */

// 방법 1) 
// post.get('/:id', postsCtrl.checkObjectId, postsCtrl.read);
// post.delete('/:id', postsCtrl.checkObjectId, postsCtrl.remove);
// post.patch('/:id', postsCtrl.checkObjectId, postsCtrl.update);

// 방법 2)
const post = new Router(); // (1)      
post.get('/', postsCtrl.read); // (2)
post.delete('/', postsCtrl.remove);
post.patch('/', postsCtrl.update);

posts.use('/:id', postsCtrl.checkObjectId, post.routes());
export default posts;
