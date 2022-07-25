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

> 2. 화면과 같이 build a Cluster로 Cluster를 생성합니다.
>
>![https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F8641194d-61d2-4d71-8f99-c9d936231f59%2FbuildCluster.png](https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F8641194d-61d2-4d71-8f99-c9d936231f59%2FbuildCluster.png)

>3. 아래의 화면 처럼 클러스터를 생성하기 전에 설정 화면이 나온다. 맨 하단에 Free 라고 적혀있는 상태로 생성한다
>
>![https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2Fdb9f6be2-8dac-405a-b11a-1cbb6bfe7adc%2Fcluster.png](https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2Fdb9f6be2-8dac-405a-b11a-1cbb6bfe7adc%2Fcluster.png)

>4. 아래와 같은 화면이 나오고 생성하는데 1-3 분정도 소요된다.
>
>![https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F84f79aea-fa73-4c21-8974-3e8630e20dc5%2FclusterbeingCreated.png](https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F84f79aea-fa73-4c21-8974-3e8630e20dc5%2FclusterbeingCreated.png)

>5. 클러스터 생성 완료 화면이다.
>
>![https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F60de30a2-3c79-40fa-9270-c64c98386319%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%206.31.43.png](https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F60de30a2-3c79-40fa-9270-c64c98386319%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%206.31.43.png)

>6. 이제 connect하기 위해 Connect를 눌러 whitelist IP 등록을 해준다
>
>![https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2Fcc81fe86-0ce4-408a-a301-00e4f93ac42b%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%206.32.17.png](https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2Fcc81fe86-0ce4-408a-a301-00e4f93ac42b%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%206.32.17.png)
>
>`Whitelist IP` 란 승인 된 컴퓨터 IP주소를 나열하여 현재 사용하는 컴퓨터와 상호 작용 할 수 있도록 필터링 하는 IP 이다.

>7. 이제 데이터 베이스에 접근 할 수 있는 사용자를 등록한다.
>
>Database Access 메뉴에 들어와 사용자를 생성을 해주면 된다.
>
>![https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F4ab3179e-4ddf-4b10-91ca-8a196d268a40%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%206.35.08.png](https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F4ab3179e-4ddf-4b10-91ca-8a196d268a40%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%206.35.08.png)

>8. 아래의 이미지는 사용자를 생성하는 등록 화면이다.
>
>![https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F94372a15-a9e8-4c7a-a3e3-2f4d7eb7ca88%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%206.35.33.png](https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F94372a15-a9e8-4c7a-a3e3-2f4d7eb7ca88%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%206.35.33.png)

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
>

- 자세히
    
    # mongoose를 이용한 MongoDB 연동하기
    
    ## 설명
    
    ### RDBMS 의 한계점
    
    - 데이터 스키마가 고정적임.
    - 저장 및 관리해야할 Data가 많아질 수록 여러 컴퓨터에 분산시키는 것이 아닌, 해당 DB서버의 성능을 업그레이드 하는 방식으로 확장해줘야함. (확장성 ↓)
    
    ### MongoDB 의 장점
    
    - 유동적인 스키마
    - 서버의 data가 늘어나도 여러 컴퓨터로 분산 처리할 수 있도록 확장하기 쉽게 설계되어 있음.
    
    ### RDBMS, MongoDB는 어떨 때 사용해야할까?
    
    - data 구조가 빈번하게 바뀔 경우 → MongoDB
    - 엄격한 조건으로 data filtering 이 필요하거나, ACID 특성을 준수해야할 경우 → RDBMS
    
    ### 문서(document)
    
    - 한 개 이상의 [key-value] 쌍으로 이루어져 있는 MongoDB의 데이터 구조.
    - BSON(Binary JSON) 형태로 저장됨
    - RDBMS 에서 레코드와 비슷한 개념
    
    ### 컬렉션(Collection)
    
    - 여러 문서들이 들어있는 곳
    - RDBMS에서 테이블과 비슷한 개념
    
    ### MongoDB의 구조
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/013cb29a-2257-4db6-81cd-8474d1f83a1f/Untitled.png)
    
    ## 환경 및 설치
    
    ### 라이브러리 설치
    
    - `**mongoose`** : Node.js 환경에서 사용하는 MongoDB 기반 ODM(Object Data modeling) 라이브러리
    - `**dotenv`** : 각 환경변수를 `.env` 확장자를 가진 파일에 저장해 두고 서버가 구동될 때 이 파일을 읽어 해당 값을 환경변수로 설정해 주는 기능을 제공해주는 라이브러리
        
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
        
        ![스크린샷 2022-07-25 19.42.03.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/7967e2be-e0be-4dda-af4c-5c1a21c1ef9e/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2022-07-25_19.42.03.png)
        
    
    ### MongoDB Cloud Cluster 에 연결하기
    
    1. 로그인 후 Cloud - Atlas 경로에 들어와서 프로젝트를 생성해준다.
    
    ![https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F745b837b-b013-41e2-9839-3bcce7611df1%2FcreateProject.png](https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F745b837b-b013-41e2-9839-3bcce7611df1%2FcreateProject.png)
    
    2. 화면과 같이 build a Cluster로 Cluster를 생성합니다.
    
    ![https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F8641194d-61d2-4d71-8f99-c9d936231f59%2FbuildCluster.png](https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F8641194d-61d2-4d71-8f99-c9d936231f59%2FbuildCluster.png)
    
    3. 아래의 화면 처럼 클러스터를 생성하기 전에 설정 화면이 나온다. 맨 하단에 Free 라고 적혀있는 상태로 생성한다
    
    ![https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2Fdb9f6be2-8dac-405a-b11a-1cbb6bfe7adc%2Fcluster.png](https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2Fdb9f6be2-8dac-405a-b11a-1cbb6bfe7adc%2Fcluster.png)
    
    4. 아래와 같은 화면이 나오고 생성하는데 1-3 분정도 소요된다.
    
    ![https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F84f79aea-fa73-4c21-8974-3e8630e20dc5%2FclusterbeingCreated.png](https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F84f79aea-fa73-4c21-8974-3e8630e20dc5%2FclusterbeingCreated.png)
    
    5. 클러스터 생성 완료 화면이다.
    
    ![https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F60de30a2-3c79-40fa-9270-c64c98386319%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%206.31.43.png](https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F60de30a2-3c79-40fa-9270-c64c98386319%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%206.31.43.png)
    
    6. 이제 connect하기 위해 Connect를 눌러 whitelist IP 등록을 해준다
    
    ![https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2Fcc81fe86-0ce4-408a-a301-00e4f93ac42b%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%206.32.17.png](https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2Fcc81fe86-0ce4-408a-a301-00e4f93ac42b%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%206.32.17.png)
    
    `Whitelist IP` 란 승인 된 컴퓨터 IP주소를 나열하여 현재 사용하는 컴퓨터와 상호 작용 할 수 있도록 필터링 하는 IP 이다.
    
    7. 이제 데이터 베이스에 접근 할 수 있는 사용자를 등록한다.
    
    Database Access 메뉴에 들어와 사용자를 생성을 해주면 된다.
    
    ![https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F4ab3179e-4ddf-4b10-91ca-8a196d268a40%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%206.35.08.png](https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F4ab3179e-4ddf-4b10-91ca-8a196d268a40%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%206.35.08.png)
    
    8. 아래의 이미지는 사용자를 생성하는 등록 화면이다.
    
    ![https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F94372a15-a9e8-4c7a-a3e3-2f4d7eb7ca88%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%206.35.33.png](https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F94372a15-a9e8-4c7a-a3e3-2f4d7eb7ca88%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%206.35.33.png)
    
    9. node 환경을 통해 연결
    
    Cluster 화면에서 Connect를 눌러 화면이 나오면 Connect your application 을 선택한다.
    
    ![https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F43a56076-bda2-4b5a-b0f7-cf3dc2ebc7fe%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%209.32.08.png](https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2F43a56076-bda2-4b5a-b0f7-cf3dc2ebc7fe%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%209.32.08.png)
    
    connection code를 `copy` 해준다.
    
    ![https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2Fa5a57084-c340-4f76-8537-16bc73741783%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%209.32.15.png](https://velog.velcdn.com/images%2Frun_dev_aiden%2Fpost%2Fa5a57084-c340-4f76-8537-16bc73741783%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%209.32.15.png)
    
    1. Node.js 의 server 스크립트 파일에서 환경변수를 통해 mongoDB 설정을 한다.
        - `.env`
            
            ```bash
            PORT=4001
            MONGO_URI=mongodb+srv://jwdev:hiedi2005!@cluster0.tas6jxp.mongodb.net/?retryWrites=true&w=majority
            ```
            
        - `src/index.js`
            
            ```jsx
            require('dotenv').config();
            const Koa = require('koa');
            const Router = require('koa-router');
            const bodyParser = require('koa-bodyparser');
            const mongoose = require('mongoose');
            const api = require('./api');
            // 비구조화 할당을 통해 process.env 내부 값에 대한 reference 생성
            const { PORT, MONGO_URI } = process.env;
            
            mongoose
              .connect(MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
              })
              .then(() => {
                console.log('Connected to MongoDB');
              })
              .catch((e) => {
                console.error(e);
              });
            
            const app = new Koa();
            const router = new Router();
            
            // ---------622p 라우트 모듈화 ~
            
            // 라우터 설정
            router.use('/api', api.routes()); // api 라우트 적용
            
            // 라우터 적용 전에 bodyParser 적용
            app.use(bodyParser());
            
            // app 인스턴스에 라우터 적용
            app.use(router.routes()).use(router.allowedMethods());
            
            const port = PORT || 4000;
            app.listen(port, () => {
              console.log('Listening to port %d', port);
            });
            ```
            
    2. `$yarn start 또는 $yarn dev` 명령어를 통해 연결 상태 확인
        ![image](https://user-images.githubusercontent.com/53039583/180772395-8a768906-371c-486f-bfbf-7fb5357d52b2.png)


        
    
    ## 사용
    
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
