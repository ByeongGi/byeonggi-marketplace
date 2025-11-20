# 기여 가이드

Byeonggi Plugin Marketplace에 기여해 주셔서 감사합니다! 새로운 플러그인을 추가하거나 기존 플러그인을 개선하는 방법을 안내합니다.

## 플러그인 개발 프로세스

1. **플러그인 생성**: `plugins/` 디렉토리 아래에 새로운 폴더를 만듭니다.
2. **메타데이터 작성**: `.claude-plugin/plugin.json` 파일을 생성하고 필수 정보를 입력합니다.
3. **기능 구현**: `commands/`, `agents/` 등의 디렉토리에 기능을 구현합니다.
4. **마켓플레이스 등록**: `.claude-plugin/marketplace.json`의 `plugins` 목록에 새 플러그인을 추가합니다.

자세한 내용은 [CLAUDE.md](CLAUDE.md)와 [Plugin Development Guide](docs/plugin-development-guide.md)를 참고하세요.

## Pull Request 제출

변경 사항을 커밋하고 PR을 제출해 주세요. PR 내용에는 추가된 플러그인이나 변경된 기능에 대한 설명을 포함해 주세요.
