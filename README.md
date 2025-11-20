# Byeonggi Plugin Marketplace

Claude Code를 위한 커스텀 플러그인 마켓플레이스입니다. 개발 생산성을 높이는 다양한 도구와 템플릿을 제공합니다.

## 📦 포함된 플러그인

| 플러그인 | 설명 | 버전 |
| :--- | :--- | :--- |
| **developer-tools** | 코드 포맷팅, 리뷰 등 개발자 필수 도구 모음 | 1.0.0 |
| **project-templates** | 다양한 프로젝트 템플릿으로 빠른 시작 지원 | 1.0.0 |

## 🚀 설치 및 사용 방법

### 1. 마켓플레이스 추가
이 리포지토리를 로컬에 클론한 후 다음 명령어로 마켓플레이스를 추가하세요:

```bash
/plugin marketplace add /path/to/byeonggi-marketplace
```

또는 GitHub에서 직접 추가할 수도 있습니다 (호스팅 설정 후):

```bash
/plugin marketplace add github:byeonggi/byeonggi-marketplace
```

### 2. 플러그인 설치
마켓플레이스가 추가되면 원하는 플러그인을 설치할 수 있습니다:

```bash
/plugin install developer-tools@byeonggi-marketplace
```

### 3. 사용하기
설치된 플러그인의 기능을 바로 사용할 수 있습니다:

```bash
/format       # developer-tools 플러그인의 포맷팅 커맨드
/init-project # project-templates 플러그인의 프로젝트 생성 커맨드
```

## 🛠 개발 및 기여

새로운 플러그인을 추가하거나 기존 플러그인을 개선하고 싶다면 [CONTRIBUTING.md](CONTRIBUTING.md)와 [CLAUDE.md](CLAUDE.md)를 참고하세요.

## 📄 라이선스

MIT License
