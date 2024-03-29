// 블로그 포스트

/** 스키마 형식
  ==============================================
  [필드 이름]   |   [데이터 타입]  |  [설명]
  title     |      string      |   제목
  body      |      string      |   내용
  tags      |   Array<string>  |  태그목록
  publishedDate |        Date      |  작성날짜
  ==============================================
 */

import mongoose from 'mongoose';

const { Schema } = mongoose;

const PostSchema = new Schema({
  title: String,
  body: String,
  tags: [String], // 문자로 이루어진 배열
  publisgedDate: {
    type: Date,
    default: Date.now, // 현재 날짜를 기본값으로 지정
  },
});

/**
  mongoose의 model() Syntax ->  mongoose.model(<Schema_name>,  <Schema_object> )
    : DB는 스키마 이름을 정해 주면 그 이름의 복수 형태로 DB에 Collection 이름을 생성한다.
        예를 들어, 스키마 이름을 Post 로 설정하면, 실제 DB에 만드는 Collection 이름은 posts 이다.
 */

const Post = mongoose.model('Post', PostSchema);
export default Post;
