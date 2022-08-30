import Post from '../../models/post';
import mongoose from 'mongoose';

// 요청 ObjectId 유효성 검증 미들웨어 함수
const { ObjectId } = mongoose.Types;
export const checkObjectId = (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400; // Bad Request (클라이언트 측에서 보낸 파라미터가 유효하지 않을 때)
    return;
  }

  return next();
};

export const write = async (ctx) => {
  const { title, body, tags } = ctx.request.body;
  const post = new Post({
    title,
    body,
    tags,
  });
  try {
    await post.save(); // .save() : DB에 저장시키는 메서드 함수(return type: new Promise())
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/**
 * @desc find() 함수를 호출한 후는 exec() 를 붙여 주어야 서버에 query를 요청함.
 * @param {object} ctx
 */
export const list = async (ctx) => {
  try {
    const posts = await Post.find().exec();
    ctx.body = posts;
  } catch (error) {
    ctx.throw(500, error);
  }
};

/**
 * @desc 특정 포스트를 특정 query로 찾아서 조회
 * @param {object} ctx
 */
export const read = async (ctx) => {
  const { id } = ctx.params;
  try {
    const post = await Post.findById(id).exec();
    console.log('posts:', post);
    if (!post) {
      ctx.status = 404; // Not found
      return;
    }
    ctx.body = post;
  } catch (error) {
    ctx.throw(500, error);
  }
};

/**
 * @desc 특정 id 에 대한 포스트를 삭제
 * @param {object} ctx 
 */
export const remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204; // No Content (성공은 했으나 응답할 데이터는 없음)
  } catch (error) {
    ctx.throw(500, error)
  }
};

/**
 * PATCH /api/posts/:id
 * @desc 특정 id에 대한 포스트의 데이터를 ctx.request.body 로 업데이트 
 * @param {object} ctx 
 */
export const update = async (ctx) => {
  const { id } = ctx.params;
  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true, // 업데이트된 데이터 반환 여부 (false 일 때는 업데이트 되기 전 데이터를 반환함.)
    }).exec();

    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (error) {
    ctx.throw(500, error);
  }
};
