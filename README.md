# 백엔드 프로그래밍: Node.js의 Koa 프레임워크

---

># Back-end Programming

- 데이터 조회 시, 어떤 종류의 데이터를 몇 개씩 보여줄지, 또 어떻게 보여줄지 등에 관한 Logic을 구현하는 것을 **서버 프로그래밍** 또는 **백엔드 프로그래밍 이라고 한다.**
- 백엔드 프로그래밍은 언어에 구애받지 않기 때문에 PHP, 파이썬, Golang, Java, JavaScrpit, Ruby 등 여러가지 언어 환경으로 진행할 수 있다.

># Node.js

- JavaScript 엔진 기반으로 웹 브라우저 뿐 아니라 Server에서도 JavaScript를 사용할 수 있게 해주는 런타임.

># Koa
- Express의 기존 개발팀이 개발한 Node.js 웹 프레임워크이다.
- 미들웨어,라우팅,템플릿, 파일 호스팅 등 다양한 기능이 자체적으로 내장되어 있는 Express와 달리 Koa는 미들웨어 기능만 갖추고 있으며, 나머지는 다른 라이브러리를 적용하여 사용한다. 즉, 필요한 기능들만 따로 붙여서 Server 을 구현하기 때문에 Express에 비해 **훨씬 가볍다는 특징**이 있다.
- Koa는 async/await 문법을 정식 지원하기 때문에 비동기 작업을 더 편하기 관리할 수 있다.

> # Config

## **Node.js 설치 확인**

- 가장 먼저 Node.js 런타임이 설치되어 있는지 확인하고, 설치되어있지 않으면 새로 설치한다. (NVM 또는 exe 파일로 수동 설치)
    
    ```bash
    $node --version
    ```
    

## **설치**

   ```bash
   $yarn add koa
   ```
> # Usage
 ## 서버 띄우기
 
 - Koa 프레임워크로 Server를 구동하는 방법이다.
     - **ctx** : context의 약어로서, 웹 request, response에 관한 정보를 담고 있다.
     - **next** : 현재 처리 중인 미들웨어의 다음 미들웨어를 호출하는 함수이다. 또한, Promise를 return 하는 특성이 Express와 차별화되는 부분이다. (이 함수가 호출되지 않으면, 그 다음 미들웨어를 처리하지 않는다.)
     
     ```jsx
     // src/index.js
     
     const Koa = require('koa');
     
     const app = new Koa();
     
     app.use(async (ctx, next) => { // app.use((ctx, next) => {...}) : 미들웨어 함수를 애플리케이션에 등록함 
       ctx.body = 'hello world';
       console.log(ctx.url);
       if (ctx.query.authorized !== '1') { // url query 에 authorized=1 이 없으면, 종료
         ctx.status = 401; // Unauthorized
         return;
       }
       await next();  // url query 에 authorized=1 이 있으면, 다음 미들웨어(app.use()) 실행
       console.log('END');
     });
     
     app.use((ctx, next) => {
       console.log(2);
       next();
     });
     
     app.listen(4000, () => { // app.listen(PORT, () => { 서버 포트 open 시, 실행 코드 }
       console.log('Listening to port 4000');
     });
     ```
     
 
 - **미들웨어는** `app.use`를 사용하여 등록되는 순서대로 처리된다.
     
     아래의 코드 경우, console 창에 url, 1, 2 순서로 출력된다.
     
     ```jsx
     const Koa = require('koa');
     
     const app = new Koa();
     
     app.use(async (ctx, next) => {
       console.log(ctx.url);
       console.log(1);
       await next();
     });
     
     app.use((ctx, next) => {
       console.log(2);
       await next();
     });
     
     app.listen(4000, () => {
       console.log('Listening to port 4000');
     });
     ```
     
     - ctx 파라미터에 들어있는 데이터는 아래와 같다.
         
         ```bash
         // console.log(ctx);
         
         ctx: {
           request: {
             method: 'GET',
             url: '/',
             header: {
               host: 'localhost:4000',
               connection: 'keep-alive',
               'cache-control': 'max-age=0',
               'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
               'sec-ch-ua-mobile': '?0',
               'sec-ch-ua-platform': '"Windows"',
               'upgrade-insecure-requests': '1',
               'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36',
               accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
               'sec-fetch-site': 'none',
               'sec-fetch-mode': 'navigate',
               'sec-fetch-user': '?1',
               'sec-fetch-dest': 'document',
               'accept-encoding': 'gzip, deflate, br',
               'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
             }
           },
           response: {
             status: 200,
             message: 'OK',
             header: [Object: null prototype] {
               'content-type': 'text/plain; charset=utf-8',
               'content-length': '11'
             }
           },
           app: { subdomainOffset: 2, proxy: false, env: 'development' },
           originalUrl: '/',
           req: '<original node req>',
           res: '<original node res>',
           socket: '<original node socket>'
         }
         ```
         
 
 ## nodemon 사용하기
 
 - 코드를 변경할 때마다 서버를 자동으로 재시작시켜주는 도구
     
     ### 설치
     
     - 개발 시에만 필요하므로 개발용 의존 모듈로 설치한다.
     
     ```bash
     $yarn add --dev nodemon
     ```
     
     ### 환경
     
     - package.json에 script 추가
         - `“start:dev”` : nodemon은 src 디렉터리 내부에서 코드 변경 감지 시, src/index.js 파일을 재시작시켜주는 명령어.
     
     ```json
     {
     	"script":{
         "start": "node src",  // 서버를 시작하는 명령어 (재시작 필요 없을 때)
         "start:dev": "nodemon --watch src/ src/index.js" // nodemon을 통해 서버를 실행하는 명령어 (재시작 필요할 때)
       }
     }
     ```
     
     ### 사용
     
     ```bash
     $yarn start
     $yarn start:dev
     ```

## REST API
- 클라이언트가 DB에 데이터를 요청하고 응답을 받는 프로세스의 중간에서 전달자 역할을 하는 서버

### HTTP Methods

| Methods | Description |
| --- | --- |
| GET | 데이터를 조회할 때 사용. |
| POST | 데이터 등록, 인증 작업 시 사용(PUT 보다 안전) |
| DELETE | 데이터 삭제할 때 사용 |
| PUT | 데이터를 수정(통째로 교체)할 때 사용 |
| PATCH | 데이터의 특정필드를 수정할 때 사용 |

### REST API 설계

- REST API 을 설계할 때는 API 주소와 Method 에 따라 어떤 역할을 하는지 쉽게 파악할 수 있도록 작성해야함.
- **예시** (블로그 포스트용 REST API)
    
    
    | 종류 | 기능 |
    | --- | --- |
    | POST /posts | 포스트 작성 |
    | GET /posts | 포스트 목록 조회 |
    | GET /posts/:id | 특정 포스트 조회 |
    | DELETE /posts/:id | 특정 포스트 삭제 |
    | POST /posts/:id/comments | 특정 포스트에 덧글 등록 |
    | DELETE /posts/:id/comments/:commentId | 특정 포소트의 특정 덧글 삭제 |
 ## Koa 프레임워크 사용하여 라우트 모듈화 하기
 (진행 중)


## 컨트롤러 파일 생성
### 컨트롤러

- `write, list, read, remove, replace, update` 등 라우트 처리 함수들만 모아놓은 파일

### koa-bodyparser 라이브러리

- POST/PUT/PATCH 같은 메서드의 Request Body에 JSON 형식으로 data를 넣어주면, 이를 parsing 하여 서버에서 사용할 수 있게 해주는 라이브러리
    
    ```bash
    $yarn add koa-bodyparser
    ```
    
- 사용 시, 주의할 점은 router 을 적용하는 코드의 윗부분에 정의해야함.
    
    ```jsx
    // Bad
    const Router = require('koa-router');
    
    const posts = new Router();
    
    const postsCtrl = require('./posts.ctrl');
    (...)
    ```
    
    ```jsx
    // Good
    const Router = require('koa-router');
    
    const postsCtrl = require('./posts.ctrl');
    
    const posts = new Router();
    (...)
    ```
### exports.update() 와 exports.replace() 의 차이

- 두 함수의 용도는 비슷하지만 구현 방식에는 차이가 있다.
    - `update(PATCH)` : 기존 값은 유지하면서 새 값을 덮어씌움.
    - `replace(PUT)` : Request Body로 받은 값이 id를 제외한 모든 값을 대체함.

---
# mongoose를 이용한 MongoDB 연동하기

>## RDBMS 의 한계점

- 데이터 스키마가 고정적임.
- 저장 및 관리해야할 Data가 많아질 수록 여러 컴퓨터에 분산시키는 것이 아닌, 해당 DB서버의 성능을 업그레이드 하는 방식으로 확장해줘야함. (확장성 ↓)

>## MongoDB 의 장점

- 유동적인 스키마
- 서버의 data가 늘어나도 여러 컴퓨터로 분산 처리할 수 있도록 확장하기 쉽게 설계되어 있음.

>## RDBMS, MongoDB는 어떨 때 사용해야 할까?

- data 구조가 빈번하게 바뀔 경우 → MongoDB
- 엄격한 조건으로 data filtering 이 필요하거나, ACID 특성을 준수해야할 경우 → RDBMS

>## 문서(document)

- 한 개 이상의 [key-value] 쌍으로 이루어져 있는 MongoDB의 데이터 구조.
- BSON(Binary JSON) 형태로 저장됨
- RDBMS 에서 레코드와 비슷한 개념

>## 컬렉션(Collection)

- 여러 문서들이 들어있는 곳
- RDBMS에서 테이블과 비슷한 개념

>## MongoDB의 구조

  ![image](https://user-images.githubusercontent.com/53039583/180770758-d6b0d886-bb36-455c-b859-b5f0a6fc5657.png)

>## 환경 및 설치

### 라이브러리 설치

- **mongoose** : Node.js 환경에서 사용하는 MongoDB 기반 ODM(Object Data modeling) 라이브러리
- **dotenv** : 각 환경변수를 `.env` 확장자를 가진 파일에 저장해 두고 서버가 구동될 때 이 파일을 읽어 해당 값을 환경변수로 설정해 주는 기능을 제공해주는 라이브러리
    
    ```bash
    $yarn add mongoose dotenv
    ```
    

### 환경변수 파일 생성

- 계정 및 비밀번호 등 코드 안에 직접 작성하기에는 민감하거나 환경별로 달라질 수 있는 값들을 환경변수로 대신 관리할 수 있다.
- 환경변수에는 서버에서 사용할 Port 와 MongoDB 주소를 넣어준다.
- .env 파일은 프로젝트의 root path에 생성한다.
    
    ```
    // .env
    
    PORT=4000
    MONGO_URL=<mongoDB URL>
    ```
    

### mongoDB 설치하기

1. Mac 터미널에서 Homebrew 패키지 관리자를 이용하여 mongosh을 설치한다.
    
    ```bash
    $brew install mongosh
    ```
    
2. 터미널에 mongosh 명령어를 통해 mongoDB 클러스터와 연결한다.
    
    ```bash
    $mongosh "mongodb+[mongoDB 클러스터 url]" --apiVersion 1 --username [유저명]
    ```
    
3. mongoDB 클러스터 생성 시, 설정했던 계정 암호를 입력하여 접속한다.
    
    ![image](https://user-images.githubusercontent.com/53039583/180770775-635dfeb3-543d-41c3-9ef7-486ad369c213.png)
    

### MongoDB Cloud Cluster 에 연결하기

>1. 로그인 후 Cloud - Atlas 경로에 들어와서 프로젝트를 생성해준다.
>
>![https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F745b837b-b013-41e2-9839-3bcce7611df1%2FcreateProject.png](https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F745b837b-b013-41e2-9839-3bcce7611df1%2FcreateProject.png)
>
> 2. 화면과 같이 build a Cluster로 Cluster를 생성합니다.
>
>![https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F8641194d-61d2-4d71-8f99-c9d936231f59%2FbuildCluster.png](https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F8641194d-61d2-4d71-8f99-c9d936231f59%2FbuildCluster.png)
>
>3. 아래의 화면 처럼 클러스터를 생성하기 전에 설정 화면이 나온다. 맨 하단에 Free 라고 적혀있는 상태로 생성한다
>
>![https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2Fdb9f6be2-8dac-405a-b11a-1cbb6bfe7adc%2Fcluster.png](https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2Fdb9f6be2-8dac-405a-b11a-1cbb6bfe7adc%2Fcluster.png)
>
>4. 아래와 같은 화면이 나오고 생성하는데 1-3 분정도 소요된다.
>
>![https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F84f79aea-fa73-4c21-8974-3e8630e20dc5%2FclusterbeingCreated.png](https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F84f79aea-fa73-4c21-8974-3e8630e20dc5%2FclusterbeingCreated.png)
>
>5. 클러스터 생성 완료 화면이다.
>
>![https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F60de30a2-3c79-40fa-9270-c64c98386319%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%206.31.43.png](https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F60de30a2-3c79-40fa-9270-c64c98386319%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%206.31.43.png)
>
>6. 이제 connect하기 위해 Connect를 눌러 whitelist IP 등록을 해준다
>
>![https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2Fcc81fe86-0ce4-408a-a301-00e4f93ac42b%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%206.32.17.png](https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2Fcc81fe86-0ce4-408a-a301-00e4f93ac42b%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%206.32.17.png)
>
>`Whitelist IP` 란 승인 된 컴퓨터 IP주소를 나열하여 현재 사용하는 컴퓨터와 상호 작용 할 수 있도록 필터링 하는 IP 이다.
>
>7. 이제 데이터 베이스에 접근 할 수 있는 사용자를 등록한다.
>
>Database Access 메뉴에 들어와 사용자를 생성을 해주면 된다.
>
>![https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F4ab3179e-4ddf-4b10-91ca-8a196d268a40%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%206.35.08.png](https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F4ab3179e-4ddf-4b10-91ca-8a196d268a40%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%206.35.08.png)
>
>8. 아래의 이미지는 사용자를 생성하는 등록 화면이다.
>
>![https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F94372a15-a9e8-4c7a-a3e3-2f4d7eb7ca88%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%206.35.33.png](https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F94372a15-a9e8-4c7a-a3e3-2f4d7eb7ca88%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%206.35.33.png)
>
>9. node 환경을 통해 연결<br/>
>  Cluster 화면에서 Connect를 눌러 화면이 나오면 Connect your application 을 선택한다.
>
>![https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F43a56076-bda2-4b5a-b0f7-cf3dc2ebc7fe%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%209.32.08.png](https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F43a56076-bda2-4b5a-b0f7-cf3dc2ebc7fe%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%209.32.08.png)
>
>connection code를 `copy` 해준다.
>
>![https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2Fa5a57084-c340-4f76-8537-16bc73741783%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%209.32.15.png](https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2Fa5a57084-c340-4f76-8537-16bc73741783%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%209.32.15.png)

>10. Node.js 의 server 스크립트 파일에서 환경변수를 통해 mongoDB 설정을 한다.
>    - `.env`
>        
>        ```bash
>        PORT=4001
>        MONGO_URI=mongodb+srv://jwdev:hiedi2005!@cluster0.tas6jxp.mongodb.net/?retryWrites=true&w=majority
>        ```
>   - `src/index.js`
>
>        ```jsx
>        require('dotenv').config();
>        const Koa = require('koa');
>        const Router = require('koa-router');
>        const bodyParser = require('koa-bodyparser');
>        const mongoose = require('mongoose');
>        const api = require('./api');
>        // 비구조화 할당을 통해 process.env 내부 값에 대한 reference 생성
>        const { PORT, MONGO_URI } = process.env;
>        
>        mongoose
>          .connect(MONGO_URI, {
>            useNewUrlParser: true,
>            useUnifiedTopology: true,
>          })
>          .then(() => {
>            console.log('Connected to MongoDB');
>          })
>          .catch((e) => {
>            console.error(e);
>          });
>        
>        const app = new Koa();
>        const router = new Router();
>        
>        // ---------622p 라우트 모듈화 ~
>        
>        // 라우터 설정
>        router.use('/api', api.routes()); // api 라우트 적용
>        
>        // 라우터 적용 전에 bodyParser 적용
>        app.use(bodyParser());
>        
>        // app 인스턴스에 라우터 적용
>        app.use(router.routes()).use(router.allowedMethods());
>        
>        const port = PORT || 4000;
>        app.listen(port, () => {
>          console.log('Listening to port %d', port);
>        });
>        ```
>11. `$yarn start 또는 $yarn dev` 명령어를 통해 연결 상태 확인
>    ![image](https://user-images.githubusercontent.com/53039583/180771037-1b4b72b9-056a-4438-863d-52d55f8e03c3.png)

---
  >## 사용
  ### 환경변수 데이터 불러오기
  
  - 환경변수의 데이터들은 `process.env` 값을 통해 조회할 수 있다.
      
      ```jsx
      // src/index.js 
      
      const { PORT } = process.env;
      ```
      
  
  ### mongoose로 서버와 데이터베이스 연결하기
  
  - 서버 — 데이터베이스 간 연결할 때는 mongoose 의 `connect()` 을 사용한다.
      
      ```jsx
      // src/index.js  -- server 메인 스크립트 파일
      
      + const { MONGO_URI } = process.env;
      
      + const mongoose = require('mongoose');
      
      + mongoose.connect(MONGO_URI, {
      +    useNewUrlParser: true,
      +    useUnifiedTopology: true,
      +  })
      +  .then(() => {
      +    console.log('Connected to MongoDB');
      +  })
      +  .catch((e) => {
      +    console.error(e);
      +  });
      ```
      
  - 위의 코드를 추가한 후 서버를 실행했을 때, 아래와 같은 결과가 출력되면 성공적으로 연결된 것이다.
  ![image](https://user-images.githubusercontent.com/53039583/180772247-a6574f11-e18b-4f0c-84f7-47bf5ad44fb5.png)

### mongoDB Cluster 와 Studio 3T GUI 툴을 연결하기
1. Studio 3T 툴 프로그램을 설치한다.
2. Studio 3T 실행 후, 좌측 상단에 [Connect] 버튼을 클릭한다.
    
    ![image](https://user-images.githubusercontent.com/53039583/183886727-6397bbd0-289c-4bbf-b556-6534794d7fc2.png)
    
3. [New Connection] 버튼을 클릭한다.
    
    ![image](https://user-images.githubusercontent.com/53039583/183886749-976d5a94-f4e8-4c08-9e3e-134f00a3089a.png)
    
4. 앞에서 복사했던 [mongoDB Cluster Connection string](https://www.notion.so/_22-c6c69f0dbf9f442398c9d884b98e7a32) 코드를 URL 입력 칸에 입력한다.
    
    ![image](https://user-images.githubusercontent.com/53039583/183886764-db3a3f84-b02e-4c25-a669-12d90998a9a7.png)
    
5. DB 이름 및 유저명, 비밀번호 등을 설정한 후 연결한다.

### esm 라이브러리로 ES Module의 import/export 문법 사용하기

- 기존 리액트 프로젝트에서 사용되는 ES 모듈의 import/export 문법은 Node.js 에서 아직 정식적으로 지원되지 않는다.
- Node.js에서 import/export 문법을 꼭 사용해야할 필요는 없으나, 이 문법을 사용하면 VS Code에서 자동 완성을 통해 모듈을 자동으로 쉽게 불러올 수 있고 코드도 더욱 깔끔해진다.
- 이러한 장점들을 쉽게 얻을려면 `esm` 이라는 라이브러리를 이용하면 된다.
    
    ```bash
    $yarn add esm
    ```
    

 

- 그리고 기존 `src/index.js` 파일의 이름을 `main.js` 로 변경하고 index.js 파일을 새로 생성해서 다음 코드를 작성한다.
    
    ```jsx
    // 이 파일에서만 no-global-assign ESLint 옵션을 비활성화 한다.
    /* eslint-disable no-global-assign */
    
    require = require('esm')(module /*, options*/);
    module.exports = require('main.js');
    ```
    
- 그리고, `package.json`에서 만들었던 스크립트를 아래와 같이 수정한다.
    
    ```jsx
    "scripts": {
        "start": "node -r esm src",
        "start:dev": "nodemon --watch src/ -r esm src/index.js"
      }
    ```
    
- ESLint에서 import/export 구문을 사용해도 오류로 간주하지 않도록 다음과 같이 `.eslintrc.json`  에서 sourceType 값을 “module” 로 설정한다.
    
    ```bash
    # .eslintrc.json
    
    "parserOptions": {
        "sourceType": "module",
    },
    ```
    
- 이제 프로젝트에서 import/export 구문을 자유롭게 사용할 수 있다.

### 모듈 자동완성 검색을 위한 jsconfig.json 환경 설정

- 에디터에서 프로젝트의 src 디렉터리 내부에 있는 모듈을 자동완성으로 불러올려면 루트 디렉터리에 `jsconfig.json` 파일 생성 후, 아래와 같이 설정한다.
    
    ```json
    {
      "compilerOptions": {
        "target": "es6", // 프로젝트에서 자동 import 기능 
        "module": "ES2015"
      },
      "include": ["src/**/*"] // module 자동 완성 검색 경로
    }
    ```
    

### 데이터베이스의 Schema와 Model

- mongoose 에는 **스키마**(schema)와 **모델**(model)이라는 개념이 있는데, 이 둘은 혼동되기 쉽다.
    - **스키마(schema)** : collection 에 들어가는 문서 내부의 각 field가 **어떤 형식으로 되어 있는지 정의**하는 객체(object). (typescript에서 type, interface 와 비슷)
    - **모델(model)** : 스키마를 사용하여 만드는 **instance**로서, DB 에서 실제 작업을 처리할 수 있는 함수들을 지니고 있는 객체(object)
    
    모델을 생성하려면, 스키마가 먼저 정의되어 있어야 한다.
    

- 스키마 생성하기
    - 예시) 블로그 포스트 만들기
        
        
        | 필드 이름 | 데이터 타입 | 설명 |
        | --- | --- | --- |
        | title | string | 제목 |
        | body | string | 내용 |
        | tags | [string] | 태그 목록 |
        | publishedDate | Date | 작성 날짜 |
        - **스키마, 모듈을 만들 때**는 mongoose 모듈의 각각 `Schema`,`model` 를 사용하여 정의한다.
            
            ```jsx
            // src/models/post.js
            
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
            ```
            
        - mongoose 의 `Schema`에서 지원하는 데이터 타입은 다음과 같다.
            
            
            | 타입 | 설명 |
            | --- | --- |
            | String | 문자열 |
            | Number | 숫자 |
            | Date | 날짜 |
            | Buffer | 파일을 담을 수 있는 버퍼 |
            | Boolean | true / false |
            | Mixed(Schema.Types.Mixed) | 어떤 데이터도 넣을 수 있는 형식 |
            | ObjectId(Schema.Types.ObjectId) | 객체 ID. 주로 다른 객체 참조 시 사용 |
            | Array | 배열 형태의 값으로 [<type>] 형태로 사용  |
- mongoose의 **model()**
    
    ```jsx
     mongoose.model(<Schema_name>, <Schema_object>)
    ```
    
    - DB는 스키마 이름을 정해 주면 그 이름의 복수 형태로 DB에 Collection 이름을 생성한다. 
    예를 들어, 스키마 이름을 Post 로 설정하면, 실제 DB에 만드는 Collection 이름은 posts 이다.
    - MongoDB에서 Collection 이름을 만들 때, 권장되는 컨벤션은 구분자를 사용하지 않고 복수 형태로 사용하는 것인데, **이 컨벤션을 따르고 싶지 않다면** 아래의 코드처럼 세 번쨰 파라미터에 사용자가 원하는 이름을 입력해주면 된다.
    (이 경우, 첫 번째 파라미터로 넣어 준 이름은 나중에 다른 스키마에서 현재 스키마를 참조해야 하는 상황에서 사용함)
        
        ```jsx
        mongoose.model('Post', PostSchema, **'custom_book_collection'**);
        ```
### 데이터 생성하기 (POST)

- POST 요청을 받아 `write() 함수를 호출하는 코드`를 posts/index.js 파일에 생성한다.
    
    ```jsx
    // src/api/posts/index.js
    
    import Router from 'koa-router';
    import * as postsCtrl from './posts.ctrl';
    const posts = new Router();
    
    posts.post('/', postsCtrl.write);
    ```
    
- POST 요청을 받아 실제로 데이터를 생성하는 `write()` 함수를 posts/ctrl.js 파일에 생성한다.
    
    ```jsx
    // src/api/posts/posts.ctrl.js
    
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
    ```
    
    - 포스트의 instance 를 만들 때는 `new` 키워드를 사용한다. 그리고 생성자 함수의 parameter에 데이터를 지닌 Object를 넣는다.
    - instance를 만들면 바로 DB에 저장되는 것이 아니라 `save()` 메서드 함수를 실행시켜야 비로소 저장이 된다.
    - 이 `save()` 함수의 반환 값 타입은 Promise 이므로 `async/await` 문법으로 DB 저장 요청을 완료할 때까지 await 를 사용하여 대기할 수 있다. (async/await 구문을 사용할 경우, 반드시 `try~catch` 구문으로 오류 예외 처리를 정의해야한다.)
- 코드를 다 작성한 경우, postman 프로그램으로 아래와 같이 정보를 요청한다.
    - Method : `POST`
    - URL: `http://localhost:4001/api/posts`
    - Body
        
        ```bash
        {
        	"title" : "리액트",
        	"body": "라이브러리 종류",
        	"tags": ["mongoose", "style-components", "scss"]
        }
        ```
        
- 결과
    
    ![image](https://user-images.githubusercontent.com/53039583/184119009-5a46ec10-80ae-4102-a62a-2890675623c7.png)
    

### 데이터 조회하기 (GET)

- 데이터를 조회할 때는 model instance의 `find()` 메서드 함수를 사용한다.
- `find()`  메서드 함수를 호출한 후에는 `exec()` 를 붙여줘야 server로 query를 요청한다.
- GET 요청을 받아 `list() 함수를 호출하는 코드`를 posts/index.js 파일에 생성한다.
    
    ```jsx
    // src/api/posts/index.js
    
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
    ```
    
- postman 프로그램으로 아래와 같이 정보를 요청한다.
    - Method : `GET`
    - URL: `http://localhost:4001/api/posts`
    - Param
        
        ```jsx
        {}
        ```
        
- 결과
    
    ![image](https://user-images.githubusercontent.com/53039583/184119027-85f19de1-2e99-4a0f-94cb-1572270f3183.png)
### 데이터 삭제하기 (DELETE)

- 데이터를 삭제할 때는 아래와 같은 종류의 함수를 사용할 수 있다.
    - `remove()` : 특정 조건을 만족하는 데이터를 모두 지운다.
    - `findByIdAndRemove()` : id를 찾아서 지운다.
    - `findOneAndRemove()` : 특정 조건을 만족하는 데이터 하나를 찾아서 제거한다.
    
- **findByIdAndRemove()**
    
    1) 아래에 표시되어 있는 DB 컬렉션의 데이터를 삭제해볼 것이다.
    
    ![image](https://user-images.githubusercontent.com/53039583/187425048-89b2491e-ff4e-4868-afbd-80c41e234a0b.png)
    2) 삭제할 함수를 정의한다.
    
    ```jsx
    // src/api/posts/posts.ctrl.js
    
    export const remove = (ctx) => {
      const { id } = ctx.params;
      try {
        await Post.findByIdAndRemove(id).exec();
        ctx.status = 204; // No Content (성공은 했으나 응답할 데이터는 없음)
      } catch (error) {
        ctx.throw(500, error)
      }
    };
    ```
    
    3) DELETE API 을 요청한다.
    
    - 여기서, `id` 값을 Params에 따로 선언하지 않고, url 에 바로 입력해도 작동하는 이유는 `src/api/posts/index.js` 에서 post.delete 에 대한 url 정의에 `/:id`  형태로 파라미터를 선언해주었기 때문이다.
    
    ![image](https://user-images.githubusercontent.com/53039583/187425068-0e3e4c06-f049-402d-96ab-0e5bfeea77a3.png)

    
    4) 다시 GET API 로 조회해보면 데이터가 삭제된 것을 확인할 수 있다.
    
    ![image](https://user-images.githubusercontent.com/53039583/187425092-d677b02f-4d90-4087-a159-fa4bd57e0ce4.png)
    

### 데이터 수정하기 (PATCH)

- 데이터를 업데이트할 때는  `findByIdAndUpdate()` 함수를 사용하는데, 파라미터는 총 세 가지가 있다.
    - arg1 : `id`
    - arg2 : `업데이트 내용`
    - arg3 : `업데이트 옵션`
    
    1) 아래의 컬렉션 데이터를 수정해볼 것이다.
    
    ![image](https://user-images.githubusercontent.com/53039583/187425107-e705eef3-9d38-41c0-bb33-d84af3f57f5e.png)
    
    2) update 함수를 구현한다.
    
    ```jsx
    // src/api/posts/posts.ctrl.js
    
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
    ```
    
    3) PATCH API 로 수정할 필드와 데이터를 `Body` 에 실어서 보낸다.
    
    ![image](https://user-images.githubusercontent.com/53039583/187425130-bd009ed4-5fb2-4d38-9c9f-6655462ac31b.png)
    
    4) DB 의 데이터가 업데이트 된 것을 확인할 수  있다.
    
    ![image](https://user-images.githubusercontent.com/53039583/187425162-ddd46ab8-e85c-4a4d-8285-c756f316bcd6.png)
    

## 요청 검증하기

### ObjectId 검증

- 보통 Error 500 오류는 서버에서 별도로 처리하지 않아 내부적으로 문제가 생겼을 때 발생한다.
- 클라이언트 측에서 잘못된 객체 Id 를 전달했다면 400 Bad Request 오류를 띄워주는 것이 맞다. 그러기 위해서는 클라이언트 측에서 요청한 id값이 DB에서 유효한 ObjectId 인지 검증하는 방법이 필요하다.
- 따라서, 유효성을 검증하는 미들웨어 함수를 아래와 같이 생성하여 처리할 수 있다.
    
    ```jsx
    // src/api/posts/posts.ctrl.js
    
    import mongoose from 'mongoose';
    
    const { ObjectId } = mongoose.Types;
    
    // 요청 ObjectId 유효성 검증 미들웨어 함수
    export const checkObjectId = (ctx, next) => {
      const { id } = ctx.params;
      if (!ObjectId.isValid(id)) {
        ctx.status = 400; // Bad Request (클라이언트 측에서 보낸 파라미터가 유효하지 않을 때)
        return;
      }
    
      return next();
    };
    ```
    
    ```jsx
    // src/api/posts/index.js
    
    import Router from 'koa-router';
    import * as postsCtrl from './posts.ctrl';
    const posts = new Router();
    
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
    ```
    
- 유효하지 않은 `:id` 파라미터 값 (xxxxxxxxxxx) 을 넣어서 GET API 을 보내면, Bad Request 가 뜨는 것을 확인할 수 있다.
    
    ![image](https://user-images.githubusercontent.com/53039583/187425190-025a26e3-6f37-457d-91f5-55bd9c3068f6.png)

---
# 참고
- Prettier에서 관리하는 코드 스타일을 ESLint 에서 관리하지 않도록 하려면 `eslint-config-prettier` 라이브러리를 설치하여 적용한다.
    
    ```json
    // eslintrc.json
    
    {
        "env": {
            "browser": true,
            "commonjs": true,
            "es2021": true
        },
    +   "extends": ["eslint:recommended", "prettier"],
        "parserOptions": {
            "ecmaVersion": "latest"
        },
        "rules": {
          "no-unused-vars": "warn",
          "no-console": "off"
        }
    }
    ```

---
# Errors
### [Error] zsh: command not found: nodemon

- nodemon 라이브러리가 설치되어 있거나 재설치 하였음에도 불구하고 위와 같이 명령어를 찾을 수 없다는 에러가 발생할 때가 있다.
- 이럴 때는 전역 설치를 하여 해결할 수 있다. (단, 기존에 nodemon 을 먼저 제거해야함)
    
    ```bash
    $yarn global add nodemon
    또는
    $npm install -g nodemon
    ```
