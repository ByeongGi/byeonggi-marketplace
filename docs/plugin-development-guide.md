# 플러그인 개발 가이드

이 문서는 Byeonggi Plugin Marketplace를 위한 플러그인 개발 방법을 상세히 설명합니다.

## 플러그인 구조

표준 플러그인 구조는 다음과 같습니다:

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json       # 플러그인 메타데이터 (필수)
├── commands/             # 커스텀 슬래시 명령어
│   └── my-command.md
├── agents/               # AI 에이전트 정의
│   └── my-agent.md
├── skills/               # 에이전트 스킬
│   └── my-skill/
│       └── SKILL.md
└── hooks/                # 이벤트 핸들러
    └── hooks.json
```

## plugin.json 작성

`plugin.json`은 플러그인의 핵심 설정 파일입니다.

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "플러그인 설명",
  "author": {
    "name": "작성자 이름"
  },
  "commands": [
    "./commands/my-command.md"
  ]
}
```

## 커맨드 작성 (Markdown)

커맨드는 Markdown 파일로 정의하며, 프롬프트 엔지니어링을 통해 동작을 제어합니다.

```markdown
---
description: 커맨드 설명
---

# Command Name

이 커맨드가 수행해야 할 작업을 자연어로 상세히 기술합니다.
단계별로 지시사항을 적으면 더 정확하게 동작합니다.
```

## 테스트

로컬에서 플러그인을 테스트하려면:

1. 마켓플레이스 루트에서 `/plugin marketplace add .` 실행
2. `/plugin install my-plugin@byeonggi-marketplace` 실행
3. 커맨드 실행하여 동작 확인
