# Google 로그인 설정 체크리스트

## 진행 상황

| | 단계 | 상태 |
|---|---|---|
| 1 | Google 로그인 켜기 (Firebase Console) | ✅ 완료 |
| 2 | 승인된 도메인 추가 | ✅ 완료 |
| 3 | 허용 계정 등록 (`allowedUsers`) | ✅ 완료 |
| 3-B | 데이터베이스 규칙 게시 | ✅ 완료 |
| **3-C** | **수정된 파일 배포** | **← 지금 할 차례** |
| 4 | 앱에서 로그인 → 동기화 주소 저장 | ⬜ |
| 5 | 잠금 켜기 (`AUTH_REQUIRED = true`) | ⬜ |
| 6 | 최종 확인 | ⬜ |

> 잠금은 아직 **꺼져 있습니다.** 5단계까지 가기 전에는 앱 동작이 지금과 똑같습니다.

---

## 3-C. 수정된 파일 배포 ← 지금 할 차례

지금 `jacob-leee.github.io` 에 올라가 있는 파일은 **로그인 기능이 없는 예전 버전**입니다.
먼저 올려야 4단계의 로그인 버튼이 나타납니다.

### 올려야 할 파일

| 파일 | 왜 |
|---|---|
| `index.html` | Google 로그인 + 설정 화면 (**필수**) |
| `firebase-messaging-sw.js` | 알림 클릭 시 올바른 앱 열기 |
| `manifest.json` | 아이콘 경로 수정 |
| `mobile.html` | 아이콘 + SW 경로 수정 |
| `subbie.html` | 아이콘 + SW 경로 수정 |
| `icon-192.png` | 신규 — 알림·홈화면 아이콘 |
| `icon-512.png` | 신규 |
| `apple-touch-icon.png` | 신규 |
| `favicon.ico` | 신규 — 브라우저 탭 아이콘 |
| `favicon-16.png` | 신규 |
| `favicon-32.png` | 신규 |

GitHub 웹 UI에서 저장소 → `Add file` → `Upload files` → 위 파일들을 끌어다 놓고 커밋.

### 배포 후 확인

브라우저에서 **강력 새로고침** (`Ctrl` + `Shift` + `R`) 후:

- [ ] 브라우저 탭에 **SK 아이콘**이 보임 (지구본 아이콘이면 아직 반영 안 됨)
- [ ] ⚙️ 설정창에 **"Google 로그인 & 접근 권한"** 항목이 보임

> 아이콘이 안 바뀌면 캐시입니다. 시크릿 창에서 열어 확인해보세요.

---

## 1. Google 로그인 켜기  ✅

Firebase Console → **homes-nsw** 프로젝트 → 왼쪽 `Authentication`

- `Sign-in method` 탭 → **Google** 클릭 → 사용 설정 **켜기**
- 프로젝트 지원 이메일: 본인 이메일 선택
- **저장**

---

## 2. 승인된 도메인 추가  ✅

같은 화면 → `Settings` 탭 → **승인된 도메인**

- `jacob-leee.github.io` **추가**
- `localhost` 는 기본으로 있음 (테스트용, 지우지 말 것)

> 이걸 빼먹으면 로그인 시 `auth/unauthorized-domain` 오류가 납니다.
> 앱이 그 오류를 한글로 안내해 주니 당황하지 않으셔도 됩니다.

---

## 3. 허용 계정 등록  ✅

### ⚠️ 먼저 읽어주세요

Realtime Database의 **JSON 가져오기는 그 경로의 데이터를 통째로 교체합니다.**
루트(`/`)에서 실행하면 `orders`, `fcmTokens`, `notifications` 가 **전부 삭제됩니다.**

그래서 아래 **방법 A(수동 입력)** 를 권장합니다. 느리지만 기존 데이터를 건드릴 위험이 없습니다.

---

### 만들어야 할 구조

```
allowedUsers
└── lucklkh88@gmail,com          ← 점(.)이 쉼표(,)로 바뀐 것에 주의
    ├── name    : SK_Jacob
    ├── role    : admin
    └── addedAt : 0
```

**핵심 규칙 — 이메일의 점(`.`)을 쉼표(`,`)로 바꿔 적습니다.**
Firebase 키에는 `.` `#` `$` `[` `]` `/` 를 쓸 수 없기 때문입니다.
`@` 와 `+` 는 그대로 둡니다.

| 실제 이메일 | 등록할 키 |
|---|---|
| `lucklkh88@gmail.com` | `lucklkh88@gmail,com` |
| `jake.lee@example.com` | `jake,lee@example,com` |
| `x+work@gmail.com` | `x+work@gmail,com` |

---

### 방법 A — 수동 입력 (권장, 안전)

**1)** Firebase Console → 왼쪽 메뉴 `빌드` → `Realtime Database` → `데이터` 탭

**2)** 맨 위 루트 줄(`homes-nsw-default-rtdb…`)에 마우스를 올리면
오른쪽에 **＋** 아이콘이 나타납니다. 클릭.

**3)** 이름 칸에 `allowedUsers` 입력. **값 칸은 비워둡니다.**

**4)** 값 칸을 비운 채로, 그 줄 오른쪽의 **＋** 를 다시 클릭합니다.
→ 한 단계 아래 자식이 생깁니다.

**5)** 새로 생긴 이름 칸에 `lucklkh88@gmail,com` 입력. 여기도 **값은 비워둡니다.**

**6)** 다시 그 줄의 **＋** 클릭 → 이름 `name`, 값 `SK_Jacob`

**7)** 같은 단계에서 **＋** 를 두 번 더 눌러 나머지를 채웁니다.

| 이름 | 값 |
|---|---|
| `name` | `SK_Jacob` |
| `role` | `admin` |
| `addedAt` | `0` |

**8)** 마지막으로 **추가** 버튼을 누르면 한 번에 저장됩니다.

> 값을 비워둔 채 ＋ 를 누르면 **자식**이 생기고,
> 값을 입력하면 그 줄이 **최종 항목**이 됩니다. 이 차이가 핵심입니다.

---

### 방법 B — JSON 가져오기 (빠르지만 주의)

루트가 아니라 **`allowedUsers` 경로로 이동한 뒤에만** 실행하세요.

**1)** 방법 A의 3단계까지만 해서 `allowedUsers` 노드를 먼저 만듭니다
(이름만 넣고 임시로 값에 `0` 입력 후 저장)

**2)** 데이터 화면의 주소 표시줄에서 `allowedUsers` 를 클릭해 그 안으로 들어갑니다.
화면 상단 경로가 `…firebaseio.com/allowedUsers` 로 바뀐 것을 **반드시 확인**합니다.

**3)** 오른쪽 **⋮** → `JSON 가져오기` → 아래 내용을 넣습니다.

```json
{
  "lucklkh88@gmail,com": {
    "name": "SK_Jacob",
    "role": "admin",
    "addedAt": 0
  }
}
```

경로 안에서 실행하므로 바깥의 `orders` 등은 영향을 받지 않습니다.
바깥 껍데기(`{"allowedUsers": …}`)를 넣지 않는 점에 주의하세요 —
이미 그 경로 안에 있기 때문에 중복되면 `allowedUsers/allowedUsers` 가 됩니다.

---

### 각 필드의 의미

| 필드 | 역할 |
|---|---|
| `role` | `admin` 인 사람만 다른 계정을 추가·삭제할 수 있습니다. 최소 1명은 있어야 합니다. |
| `name` | 알림 대상 이름. 오더의 담당자 칸 값과 **정확히 일치**해야 알림이 갑니다. |
| `addedAt` | 기록용 타임스탬프. `0` 이어도 동작에 지장 없습니다. |

`name` 은 반드시 앱의 담당자 이름과 철자가 같아야 합니다.
`SK_Jacob` 과 `SK_jacob` 은 다른 사람으로 취급됩니다.

---

### 확인

저장 후 데이터 트리가 이렇게 보이면 성공입니다.

```
homes-nsw-default-rtdb
├── allowedUsers
│   └── lucklkh88@gmail,com
│       ├── addedAt: 0
│       ├── name: "SK_Jacob"
│       └── role: "admin"
├── orders          ← 그대로 남아 있어야 함
└── fcmTokens       ← 그대로 남아 있어야 함
```

`orders` 가 사라졌다면 루트에서 JSON 가져오기를 실행한 것입니다.
그 경우 Google Sheets 쪽 원본은 무사하니, 앱에서 **Force Push** 로 복구할 수 있습니다.

---

### 자주 하는 실수

| 증상 | 원인 |
|---|---|
| 로그인해도 "접근 권한이 없습니다" | 키에 점(`.`)을 그대로 씀 → 쉼표(`,`)로 |
| 같은 증상 | 대문자 섞임 → 키는 **전부 소문자** |
| 알림이 안 옴 | `name` 이 담당자 이름과 불일치 |
| 계정 추가 버튼이 안 먹음 | 본인 `role` 이 `admin` 이 아님 |

> 2명째부터는 콘솔이 아니라 **앱 설정창(⚙️)에서** 추가하면 됩니다.
> 이메일만 넣으면 점→쉼표 변환은 앱이 알아서 합니다.

---

## 3-B. 데이터베이스 규칙 적용  ✅

Realtime Database는 **규칙에 없는 경로를 기본 거부**합니다.
지금 규칙에는 `config` 가 없어서, 이 단계를 건너뛰면
4단계에서 `permission denied` 가 납니다.

### 방법 A — 콘솔에서 붙여넣기 (권장, CLI 불필요)

Firebase Console → `Realtime Database` → **`규칙`** 탭

기존 내용을 **전부 지우고** 아래를 붙여넣은 뒤 **게시** 클릭:

```json
{
  "rules": {
    "allowedUsers": {
      ".read": "auth != null && auth.token.email_verified == true",
      "$emailKey": {
        ".write": "auth != null && auth.token.email_verified == true && root.child('allowedUsers').child(auth.token.email.replace('.', ',')).child('role').val() === 'admin'"
      }
    },
    "config": {
      ".read": "auth != null && auth.token.email_verified == true && root.child('allowedUsers').child(auth.token.email.replace('.', ',')).exists()",
      ".write": "auth != null && auth.token.email_verified == true && root.child('allowedUsers').child(auth.token.email.replace('.', ',')).child('role').val() === 'admin'"
    },
    "notifications": {
      ".read": false,
      ".write": true
    },
    "fcmTokens": {
      ".read": false,
      ".write": true
    },
    "orders": {
      ".read": true,
      ".write": true
    },
    "issues": {
      ".read": true,
      ".write": true
    }
  }
}
```

> 규칙 편집은 **데이터를 건드리지 않습니다.** 접근 권한만 바꿉니다.
> 3단계에서 넣은 `allowedUsers` 데이터는 그대로 남습니다.

### 방법 B — CLI

```bash
firebase deploy --only database
```

`database.rules.json` 파일에 위와 동일한 내용이 들어 있습니다.

---

### 지금 적용해도 안전한 이유

`allowedUsers` 와 `config` 는 **기존 앱이 전혀 건드리지 않는 새 경로**입니다.
잠가도 깨질 게 없고, 대신 동기화 주소가 이 시점부터 바로 보호됩니다.

`orders` / `issues` / `fcmTokens` / `notifications` 는 **아직 열어둡니다.**
`mobile.html` 과 `subbie.html` 에 로그인이 없어서, 지금 잠그면 두 앱이 즉시 멈춥니다.

### 적용 확인

게시 후 브라우저에서 아래 주소를 엽니다.

```
https://homes-nsw-default-rtdb.firebaseio.com/config.json
```

- `Permission denied` → **정상** (규칙이 걸림)
- 데이터가 그대로 보임 → 게시가 안 됨. 규칙 탭에서 다시 확인

> `allowedUsers.json` 도 같은 방식으로 확인할 수 있습니다.
> 콘솔 데이터 화면에서는 계속 보이는 게 정상입니다 — 콘솔은 규칙을 우회합니다.

---

## 4. 앱에서 로그인 → 동기화 주소 저장  ⬜

3-B에서 건 규칙이 `/config` 쓰기에 **관리자 로그인**을 요구합니다.
그래서 주소를 저장하기 전에 먼저 앱에서 로그인해야 합니다.

앱 실행 → ⚙️ → **Google 로그인 & 접근 권한**

**1)** `🔑 Google로 로그인 (설정 저장에 필요)` 클릭 → 본인 구글 계정 선택

> 잠금이 아직 꺼져 있어도 이 버튼은 동작합니다.
> 이 순서가 아니면 5단계 전에는 주소를 저장할 방법이 없어 설정이 막힙니다.

**2)** 로그인되면 상태 줄이 이렇게 바뀝니다:

```
잠금 꺼짐 — 소스의 AUTH_REQUIRED를 true로 바꾸면 켜집니다
✓ lucklkh88@gmail.com 로 로그인됨
```

**3)** `동기화 주소` 칸에 현재 쓰는 Apps Script 주소를 붙여넣고 **저장**

**4)** 아래 `허용 계정` 목록에 본인이 `ADMIN` 배지와 함께 보이면 정상입니다.
여기서 다른 팀원을 추가하면 됩니다 — 이메일만 넣으면 점→쉼표 변환은 앱이 처리합니다.

### 잘 됐는지 확인

`저장 실패 — permission denied` 가 나온다면 원인은 셋 중 하나입니다.

| 원인 | 확인 방법 |
|---|---|
| 로그인을 안 함 | 상태 줄에 "로그인되지 않음" |
| `role` 이 `admin` 이 아님 | 허용 계정 목록에 ADMIN 배지 없음 |
| 3단계 키에 점(`.`)이 남음 | 로그인 시 "접근 권한이 없습니다" |

이게 되면 팀원은 주소를 몰라도 됩니다. 링크만 받아서 로그인하면 자동으로 붙습니다.

---

## 5. 잠금 켜기  ⬜

**4단계에서 로그인이 실제로 성공한 것을 확인한 뒤에** 진행하세요.
로그인이 안 되는 상태에서 켜면 본인도 못 들어갑니다.

`index.html` 에서 아래 한 줄을 찾아 `true` 로 바꾸고 다시 올립니다.

```js
const AUTH_REQUIRED = false;   // ← 이걸 true 로
```

찾는 법: 편집기에서 `AUTH_REQUIRED` 검색. 파일에 딱 한 곳만 정의돼 있습니다.

### 잠겼을 때 푸는 법

`AUTH_REQUIRED` 를 다시 `false` 로 되돌려 올리면 즉시 풀립니다.
데이터는 그대로이니 안심하셔도 됩니다.

그래도 안 되면 브라우저 주소창에서:

```
localStorage.clear()
```

개발자도구(F12) → Console 탭에 입력 후 새로고침.

---

## 6. 최종 확인  ⬜

### 정상 동작

- [ ] 본인 구글 계정으로 로그인 → 앱 진입됨
- [ ] 헤더 오른쪽에 이름/사진 + 로그아웃 표시됨
- [ ] 로그인 후 Cloud Sync 가 자동으로 `Synced ✓` 됨
- [ ] ⚙️ → 알림의 "내 이름"이 `SK_Jacob` 으로 자동 설정돼 있음

### 차단 동작

- [ ] 시크릿 창에서 링크만으로 열기 → **로그인 화면이 먼저** 뜸
- [ ] 다른 구글 계정으로 시도 → **"접근 권한이 없습니다"** 메시지
- [ ] 로그아웃 후 새로고침 → 다시 로그인 화면

### 팀원 온보딩 시뮬레이션

가장 중요한 확인입니다. 다른 기기(또는 시크릿 창)에서:

- [ ] 링크만으로 접속 → 로그인 → **주소 입력 없이** 데이터가 뜸

이게 되면 목표 달성입니다. 팀원에게 링크만 보내면 됩니다.

> 새 팀원은 ⚙️ 에서 미리 추가해두어야 합니다.
> 명단에 없으면 로그인해도 거부됩니다.

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
