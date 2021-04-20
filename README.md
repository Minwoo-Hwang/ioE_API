# ioE_API

ioE Service API

## 접근

### 로그인

1. 회원가입

   POST /api/auth/register/local

   ```
   {
     "username": String.min(4).max(15),
     "email": Email,
     "password": String.min(6)
   }
   ```


2. 로그인

   POST /api/auth/login/local

   ```
   {
     "username": ID,
     "password": String.min(6)
   }
   ```


3. 중복확인

   + 이메일 : GET /api/auth/exists/email/:value

   + 아이디 : GET /api/auth/exists/username/:value


4. 로그아웃

   POST /api/auth/logout


5. 쿠키 체크

   GET /api/auth/check


### 디바이스

1. 등록

   POST /api/devices

   ```
   {
       device: String(),
       elv_id: String(),
       building: String(),
       address: String(),
       username: String(),
       email: String().email()
   }
   ```


2. 리스트

   GET /api/devices


3. 단일 조회

   GET /api/devices/:elvId


4. 상태 업데이트

   PATCH /api/devices/status/:deviceid

   ```
   {
     order: {
         smps: Boolean(),
         subport: Boolean(),
     },
     action:{
         smps: Boolean(),
         subport: Boolean()
     },
     input:{
         safety: Boolean(),
         door: Boolean(),
         doorzone: Boolean()
     }
   }
   ```