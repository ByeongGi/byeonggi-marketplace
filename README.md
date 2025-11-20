# Byeonggi's Claude Code Plugin Marketplace

공식 Claude Code 문서 기준을 준수하는 개인 플러그인 마켓플레이스입니다.

## 📦 설치

### 로컬 마켓플레이스 추가

```bash
/plugin marketplace add .
```

또는 GitHub에서 직접 설치:

```bash
/plugin marketplace add byeonggi/claude-marketplace
```

## 🔌 사용 가능한 플러그인

### Developer Tools

개발자 생산성을 위한 필수 도구 모음

```bash
/plugin install developer-tools@byeonggi-marketplace
```

**기능:**
- `/format` - 코드 포맷팅
- `code-reviewer` - 코드 리뷰 에이전트

### Project Templates

프로젝트 초기화 템플릿

```bash
/plugin install project-templates@byeonggi-marketplace
```

**기능:**
- `/init-project` - 프로젝트 스캐폴딩

## 🛠 개발자 가이드

### 요구사항

- Node.js >= 16.0.0
- jq (JSON 처리용)

### 설치 및 검증

```bash
# 의존성 설치
npm install

# 전체 검증 실행
npm run validate:all

# 버전 증가 (patch)
npm run version:patch
```

자세한 내용은 [DEVELOPMENT.md](./DEVELOPMENT.md)를 참고하세요.

## 📋 디렉토리 구조

```
byeonggi-marketplace/
├── .claude-plugin/
│   └── marketplace.json          # 마켓플레이스 설정
├── plugins/
│   ├── developer-tools/          # 개발 도구 플러그인
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── commands/
│   │   │   └── format.md
│   │   └── agents/
│   │       └── code-reviewer.md
│   └── project-templates/        # 프로젝트 템플릿 플러그인
│       ├── .claude-plugin/
│       │   └── plugin.json
│       └── commands/
│           └── init-project.md
├── scripts/
│   ├── validate.js               # JSON 스키마 검증
│   ├── sync-versions.js          # 버전 동기화
│   ├── check-plugin-structure.js # 구조 검증
│   └── schemas/                  # JSON 스키마 정의
│       ├── marketplace-schema.json
│       └── plugin-schema.json
├── package.json                  # npm 스크립트 및 의존성
├── DEVELOPMENT.md                # 개발 가이드
└── README.md                     # 이 파일
```

## 🚀 빠른 시작

### 1. 마켓플레이스 추가

```bash
cd /path/to/byeonggi-marketplace
/plugin marketplace add .
```

### 2. 플러그인 설치

```bash
/plugin install developer-tools@byeonggi-marketplace
/plugin install project-templates@byeonggi-marketplace
```

### 3. 플러그인 사용

```bash
# 코드 포맷팅
/format

# 새 프로젝트 생성
/init-project
```

## 📖 사용 가능한 명령어

### 검증

```bash
npm run validate          # JSON 스키마 검증
npm run validate:structure # 디렉토리 구조 검증
npm run validate:all      # 전체 검증
npm test                  # 테스트 실행
```

### 버전 관리

```bash
npm run version:patch     # 1.0.0 → 1.0.1
npm run version:minor     # 1.0.0 → 1.1.0
npm run version:major     # 1.0.0 → 2.0.0
npm run version:dry-run   # 변경 사항 미리보기
```

### 유틸리티

```bash
npm run format:json       # JSON 파일 포맷팅
npm run help              # 도움말 보기
```

## 📚 문서

- [DEVELOPMENT.md](./DEVELOPMENT.md) - 개발 가이드 및 규칙
- [CLAUDE.md](./CLAUDE.md) - 프로젝트 컨벤션
- [공식 문서](https://code.claude.com/docs/en/plugins)

## 🔧 기여하기

1. 새 플러그인 추가 시 `plugins/` 디렉토리에 생성
2. `npm run validate:all`로 검증
3. `npm run version:patch`로 버전 증가
4. Pull Request 생성

## ⚙️ 기술 스택

- **검증**: Ajv (JSON Schema validator)
- **버전 관리**: Semantic Versioning
- **자동화**: Node.js 스크립트

## 📄 라이선스

MIT

## 🔗 링크

- [Claude Code 공식 문서](https://code.claude.com/docs)
- [Plugin Marketplaces 가이드](https://code.claude.com/docs/en/plugin-marketplaces.md)
- [Plugins 레퍼런스](https://code.claude.com/docs/en/plugins-reference.md)
