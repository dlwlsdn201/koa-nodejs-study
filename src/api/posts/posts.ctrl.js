import Post from '../../models/post';

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
    if (!post) {
      ctx.status = 404; // Not found
      return;
    }
    ctx.body = post;
  } catch (error) {
    ctx.throw(500, error);
  }
};

export const remove = (ctx) => {};
export const update = (ctx) => {};
