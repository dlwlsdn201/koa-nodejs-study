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

const Post = mongoose.model('Post', PostSchema);
export default Post;
