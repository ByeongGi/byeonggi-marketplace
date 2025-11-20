# CLAUDE.md

## 📚 참조 문서
- [Plugins 마켓 문서](https://code.claude.com/docs/en/plugin-marketplaces.md)
- [Plugins 참조 문서](https://code.claude.com/docs/en/plugins-reference.md)
- [Plugins 문서](https://code.claude.com/docs/en/plugins)

## 🛠 개발 컨벤션

### 플러그인 구조
- 모든 플러그인은 `plugins/` 디렉토리 하위에 위치해야 합니다.
- 각 플러그인은 고유한 디렉토리를 가집니다 (예: `plugins/my-plugin/`).
- 플러그인 식별자(`name`)는 **kebab-case**를 사용합니다 (예: `developer-tools`).

### 파일 명명 규칙
- 커맨드 파일: `commands/command-name.md` (kebab-case)
- 에이전트 파일: `agents/agent-name.md` (kebab-case)
- 스킬 파일: `skills/skill-name/SKILL.md`

### 버전 관리
- **Semantic Versioning** (MAJOR.MINOR.PATCH)을 따릅니다.
- `marketplace.json`과 `plugin.json`의 버전을 동기화하여 관리합니다.

## 🚀 주요 명령어

### 마켓플레이스 관리
- **로컬 마켓플레이스 추가**:
  ```bash
  /plugin marketplace add .
  ```
- **마켓플레이스 목록 확인**:
  ```bash
  /plugin marketplace list
  ```
- **마켓플레이스 제거**:
  ```bash
  /plugin marketplace remove byeonggi-marketplace
  ```

### 플러그인 관리
- **플러그인 설치**:
  ```bash
  /plugin install [plugin-name]@byeonggi-marketplace
  ```
- **플러그인 목록 확인**:
  ```bash
  /plugin list
  ```
- **플러그인 제거**:
  ```bash
  /plugin uninstall [plugin-name]
  ```

### 검증
- **JSON 유효성 검사**:
  ```bash
  cat .claude-plugin/marketplace.json | jq .
  cat plugins/*/.claude-plugin/plugin.json | jq .
  ```
