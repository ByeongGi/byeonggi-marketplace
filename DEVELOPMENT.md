# 개발 가이드

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 로컬 마켓플레이스 추가

```bash
/plugin marketplace add .
```

## 🛠 개발 도구

### 검증 도구

공식 문서 기준에 따라 마켓플레이스와 플러그인을 검증합니다.

```bash
# 전체 검증 (권장)
npm run validate:all

# JSON 스키마 검증
npm run validate

# 디렉토리 구조 검증
npm run validate:structure

# 테스트 실행
npm test
```

### 버전 관리

Semantic Versioning을 따르며, marketplace.json과 모든 plugin.json의 버전을 자동으로 동기화합니다.

```bash
# Patch 버전 증가 (1.0.0 → 1.0.1)
npm run version:patch

# Minor 버전 증가 (1.0.0 → 1.1.0)
npm run version:minor

# Major 버전 증가 (1.0.0 → 2.0.0)
npm run version:major

# 변경 사항 미리보기 (실제 파일 수정 없음)
npm run version:dry-run

# 특정 버전으로 설정
node scripts/sync-versions.js --version 2.0.0
```

#### 버전 업데이트 워크플로우

1. **버전 증가 및 검증**
   ```bash
   npm run version:patch
   npm run validate:all
   ```

2. **Git 커밋 및 태그**
   ```bash
   git add .
   git commit -m "chore: bump version to 1.0.1"
   git tag v1.0.1
   git push origin main --tags
   ```

### 유틸리티

```bash
# JSON 파일 포맷팅
npm run format:json

# 사용 가능한 명령어 보기
npm run help
```

## 📋 개발 체크리스트

### 새 플러그인 추가 시

- [ ] `plugins/` 디렉토리 하위에 플러그인 디렉토리 생성
- [ ] 플러그인 이름은 kebab-case 사용
- [ ] `.claude-plugin/plugin.json` 생성 (필수)
- [ ] 필요한 디렉토리 구조 생성:
  - [ ] `commands/` - 커맨드 파일 (.md)
  - [ ] `agents/` - 에이전트 파일 (.md)
  - [ ] `skills/` - 스킬 디렉토리 (SKILL.md 포함)
  - [ ] `hooks/` - hooks.json
- [ ] `marketplace.json`의 `plugins` 배열에 추가
- [ ] `npm run validate:all` 실행하여 검증
- [ ] README.md 작성

### 플러그인 구조 규칙

**✅ 올바른 구조:**
```
plugins/my-plugin/
├── .claude-plugin/
│   └── plugin.json          # ✅ plugin.json만 여기에
├── commands/
│   └── my-command.md        # ✅ kebab-case
├── agents/
│   └── my-agent.md
└── skills/
    └── my-skill/
        └── SKILL.md
```

**❌ 잘못된 구조:**
```
plugins/my-plugin/
├── .claude-plugin/
│   ├── plugin.json
│   └── commands/            # ❌ 다른 파일/디렉토리 금지
└── MyCommand.md             # ❌ PascalCase 사용 금지
```

## 📐 JSON 스키마

### marketplace.json

```json
{
  "name": "marketplace-name",           // 필수, kebab-case
  "owner": {                            // 필수
    "name": "Your Name",                // 필수
    "email": "email@example.com",       // 선택
    "url": "https://example.com"        // 선택
  },
  "metadata": {                         // 선택
    "description": "설명",
    "version": "1.0.0",                 // Semantic Versioning
    "pluginRoot": "./plugins"
  },
  "plugins": [                          // 필수
    {
      "name": "plugin-name",            // 필수, kebab-case
      "source": "./plugins/plugin-name", // 필수
      "description": "설명",             // 권장
      "version": "1.0.0",               // 권장
      "category": "productivity",       // 선택
      "tags": ["tag1", "tag2"]          // 선택
    }
  ]
}
```

### plugin.json

```json
{
  "name": "plugin-name",                // 필수, kebab-case
  "version": "1.0.0",                   // 권장
  "description": "설명",                 // 권장
  "author": {                           // 선택
    "name": "Your Name",
    "email": "email@example.com",
    "url": "https://example.com"
  },
  "commands": [                         // 선택
    "./commands/command.md"
  ],
  "agents": [                           // 선택
    "./agents/agent.md"
  ],
  "skills": [                           // 선택
    "./skills/skill-name"               // SKILL.md 포함된 디렉토리
  ],
  "hooks": "./hooks/hooks.json",        // 선택
  "mcpServers": "./.mcp.json"           // 선택
}
```

## 🔍 문제 해결

### 검증 실패 시

1. **JSON 구문 오류**
   ```bash
   cat .claude-plugin/marketplace.json | jq .
   ```

2. **스키마 검증 실패**
   - 에러 메시지 확인
   - kebab-case 규칙 준수 여부 확인
   - 필수 필드 누락 여부 확인

3. **파일 경로 오류**
   - plugin.json에 명시된 경로의 파일이 실제로 존재하는지 확인
   - 상대 경로가 `./`로 시작하는지 확인

### 버전 동기화 이슈

모든 플러그인의 버전이 자동으로 동기화됩니다. 수동으로 수정하지 말고 `npm run version:*` 스크립트를 사용하세요.

## 📚 추가 리소스

- [Claude Code Plugin 공식 문서](https://code.claude.com/docs/en/plugins)
- [Plugin Marketplaces 문서](https://code.claude.com/docs/en/plugin-marketplaces.md)
- [Plugins 레퍼런스](https://code.claude.com/docs/en/plugins-reference.md)
