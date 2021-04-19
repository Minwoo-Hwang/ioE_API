# ioE_API
ioE Service API
<h2>접근</h2>
<h3>로그인</h3>
<ol>
  <li>회원가입<br>POST /api/auth/register/local<br>
    
    {
      "username": String.min(4).max(15),
      "email": Email,
      "password": String.min(6)
    }
    
  </li><br>
  <li>로그인<br>POST /api/auth/login/local</li><br>
  
    {
      "email": Email,
      "password": String.min(6)
    }
  
  <li>
    중복확인
    <ul>
      <li>이메일<br>GET /api/auth/exists/email/:value</li><br>
      <li>아이디<br>GET /api/auth/exists/username/:value</li>
    </ul>
  </li><br>
  <li>로그아웃<br>POST /api/auth/logout</li><br>
  <li>쿠키 체크<br>GET /api/auth/check</li>
</ol>
