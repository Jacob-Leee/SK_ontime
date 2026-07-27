# Google 로그인 설정 체크리스트

현재 상태: **코드는 완성, 기능은 꺼져 있음** (`AUTH_REQUIRED = false`)
아래 1~4단계를 마친 뒤 5단계에서 켭니다. 순서를 지키지 않으면 본인이 못 들어갑니다.

---

## 1. Google 로그인 켜기

Firebase Console → **homes-nsw** 프로젝트 → 왼쪽 `Authentication`

- `Sign-in method` 탭 → **Google** 클릭 → 사용 설정 **켜기**
- 프로젝트 지원 이메일: 본인 이메일 선택
- **저장**

---

## 2. 승인된 도메인 추가

같은 화면 → `Settings` 탭 → **승인된 도메인**

- `jacob-leee.github.io` **추가**
- `localhost` 는 기본으로 있음 (테스트용, 지우지 말 것)

> 이걸 빼먹으면 로그인 시 `auth/unauthorized-domain` 오류가 납니다.
> 앱이 그 오류를 한글로 안내해 주니 당황하지 않으셔도 됩니다.

---

## 3. 허용 계정 등록 (최초 1회, 콘솔에서 직접)

Firebase Console → `Realtime Database` → `데이터` 탭

루트에서 **+** → 이름 `allowedUsers` → 그 아래에 아래 구조를 만듭니다.
JSON 가져오기(⋮ → JSON 가져오기)로 한 번에 넣는 게 빠릅니다:

```json
{
  "allowedUsers": {
    "lucklkh88@gmail,com": {
      "name": "SK_Jacob",
      "role": "admin",
      "addedAt": 0
    }
  }
}
```

**핵심 규칙 — 이메일의 점(`.`)을 쉼표(`,`)로 바꿔 적습니다.**
Firebase 키에는 점을 쓸 수 없어서입니다. `@` 와 `+` 는 그대로 둡니다.

| 실제 이메일 | 등록할 키 |
|---|---|
| `lucklkh88@gmail.com` | `lucklkh88@gmail,com` |
| `jake.lee@example.com` | `jake,lee@example,com` |

- `role: "admin"` 인 사람만 나중에 다른 계정을 추가·삭제할 수 있습니다.
- `name` 은 알림 대상 이름입니다. 여기 적힌 이름으로 배정된 오더만 그 사람에게 알림이 갑니다.

> 2명째부터는 콘솔이 아니라 **앱 설정창에서** 추가하면 됩니다.

---

## 4. 동기화 주소 서버에 저장

앱 실행 → ⚙️ → **Google 로그인 & 접근 권한**

- `동기화 주소` 칸에 현재 쓰는 Apps Script 주소를 붙여넣고 **저장**

이게 되면 팀원은 주소를 몰라도 됩니다. 링크만 받아서 로그인하면 자동으로 붙습니다.

---

## 5. 잠금 켜기

`index.html` 에서 아래 한 줄을 찾아 `true` 로 바꾸고 배포합니다.

```js
const AUTH_REQUIRED = false;   // ← 이걸 true 로
```

**바꾸기 전에 반드시 3단계가 끝나 있어야 합니다.** 허용 명단이 비어 있으면
본인 계정도 거부되어 앱에 들어갈 수 없습니다.

만약 잠겼다면: `AUTH_REQUIRED` 를 다시 `false` 로 되돌려 배포하면 풀립니다.

---

## 6. 확인

- [ ] 본인 구글 계정으로 로그인 → 앱 진입됨
- [ ] 헤더 오른쪽에 이름/사진 + 로그아웃 표시됨
- [ ] 다른 구글 계정으로 시도 → **거부 메시지**가 뜸
- [ ] 시크릿 창에서 링크만으로 열기 → 로그인 화면이 먼저 뜸
- [ ] 로그인 후 Cloud Sync 가 자동으로 `Synced ✓` 됨
- [ ] ⚙️ → 알림의 "내 이름"이 자동 설정돼 있음

---

## 아직 남은 것 (나중에)

### 모바일 앱에도 로그인 붙이기
지금은 `index.html`(데스크톱)에만 적용돼 있습니다.
`mobile.html` 과 `subbie.html` 은 아직 로그인 없이 열립니다.

### 데이터베이스 규칙 잠그기
`database.rules.SECURE.json` 파일에 준비돼 있지만 **아직 배포하면 안 됩니다.**
세 앱 모두에 로그인이 붙은 뒤에 적용해야 합니다. 지금 배포하면
`mobile.html` 과 `subbie.html` 의 모든 읽기·쓰기가 즉시 차단됩니다.

적용 시점이 오면:

```bash
cp database.rules.SECURE.json database.rules.json
firebase deploy --only database
```

현재 규칙은 `/orders` 등에 인증 없는 쓰기를 허용하고 있습니다.
DB 주소를 아는 사람은 누구나 쓸 수 있는 상태이며, 위 작업으로 닫힙니다.
