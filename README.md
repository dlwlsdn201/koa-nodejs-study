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
 (진행 전)




># 참고
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
