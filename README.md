# 주간 회고 자동화 프로토타입

한 주의 흩어진 작업 기록(슬랙·피그마·노션)을 입력하면 5개 모듈을 거쳐 완성된 회고 표가 나오는 자동화 프로토타입입니다.

## 배포 방법 (GitHub → Vercel)

### 1. GitHub에 올리기
1. GitHub에서 새 저장소(repository)를 만듭니다.
2. 이 폴더의 파일을 모두 업로드합니다.
   - `index.html`
   - `vercel.json`
   - `README.md`
3. Commit 합니다.

### 2. Vercel로 배포
1. [vercel.com](https://vercel.com) → **Add New → Project**
2. 방금 만든 저장소를 선택합니다.
3. Framework Preset은 **Other**(또는 자동 감지)로 두고, 별도 설정 없이 **Deploy**를 누릅니다.

빌드 과정 없이 정적 사이트로 바로 배포됩니다.

## 구성

- 단일 `index.html` 파일로 동작합니다. (React는 CDN으로 로드, 빌드 불필요)
- 처리 단계는 미리 준비된 예시 결과로 동작하므로 외부 API 키 없이 끝까지 실행됩니다.
- 소스 연결 → 목표 설정 → 처리 → 회고 표 완성까지 전체 흐름을 시연할 수 있습니다.
