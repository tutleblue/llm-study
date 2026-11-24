# HANDOFF — LLM 학습 앱 (듀오링고형 모바일 웹)

> 이 문서만 읽고 작업을 이어받을 수 있도록 쓴다. Claude Code ↔ Codex가 번갈아 작업한다.
> 마지막 갱신: 2026-11-24 (Claude Code)

## 1. 프로젝트 개요와 목표

LLM 실전 지식(프롬프트 엔지니어링, 바이브코딩, Agent Skills, RAG·MCP·에이전트, 웹 제작, 소프트웨어 딥테크)을 **휴대폰에서 하루 30분씩** 배우는 **듀오링고 스타일 모바일 웹 앱**을 만든다. 학습 진도·연속 학습일·복습까지 앱이 관리한다.

## 2. 사용자 요구사항 (원문 의도 그대로)

1. LLM 공부 자료: 스킬, 에이전트, 멋진 웹 만들기, 프롬프트 엔지니어링 등 전문 영역까지. Anthropic·OpenAI·GitHub·유명 연구·유튜브 설명을 참고해 효율적으로 학습할 수 있게.
2. 학습자 설정
   - 수준: 파이썬 기초 문법 공부함, LLM 코딩으로 서비스 배포까지 경험
   - 쓰는 도구: Claude, Python, VS Code, ChatGPT, Gemini, Codex, Claude Code
   - 학습 시간: **하루 30분**
   - 중점: 프롬프트 엔지니어링, 소프트웨어 딥테크 관련 폭넓은 지식, 최신 스킬 트렌드, 바이브코딩 잡지식
3. **주로 모바일 웹으로 학습**한다.
4. **듀오링고처럼** 만든다.
5. **학습관리도 해준다.**

### 요구사항 해석 (사용자가 직접 말하지 않았지만 위에서 끌어낸 것 — 바꾸면 이유를 적을 것)
- "듀오링고처럼" → 경로(path)형 유닛 지도, 짧은 레슨(5~8 문제), 즉시 정답 피드백, XP, 연속 학습일(streak), 하트/재도전, 일일 목표, 축하 화면.
- "학습관리" → 진도 저장, 오늘 할 레슨 자동 안내, 틀린 문제 복습 큐(간격 반복), 주간 기록, 잡지식 카드 모음.
- "하루 30분" → 하루 = 레슨 3~4개(각 7~10분). 커리큘럼 14주 × 5일 (`학습계획안.md` 참고).
- 콘텐츠의 사실(모델명·기능·가격)은 공식 문서로 확인하고 레슨마다 출처 링크를 단다.

## 3. 기술 방향

- **형태: 웹 배포형**, GitHub Pages(`<user>.github.io/<repo>/`)로 배포한다. 로컬 실행 파일·바로가기·앱 내 업데이트·zip은 만들지 않는다.
- **UI: 다크 터미널형(사용자 선택 B안)**. 사용자 요청: "듀오링고식 배치 말고 코드처럼 배치, 직관적이지만 터미널 보는 것처럼". 그래서 홈은 `$ status` 출력, `$ tree course/` 파일 트리, 레슨은 `$ cat …md` 화면, 결과는 `exit code 0` 화면으로 꾸몄다. 레슨 흐름(짧은 레슨, 즉시 채점, 틀린 문제 다시 풀기, XP, 연속 학습일, 카드)은 듀오링고식 그대로 둔다.
- **진도 저장: 이 기기 브라우저의 localStorage**(`llmstudy.v1`). 서버가 없다. 기기를 바꿀 때는 stats 탭의 백업 코드(base64 JSON)로 옮긴다.
- **스택**: 빌드 도구·프레임워크 없는 바닐라 JS. 콘텐츠는 JSON 대신 JS 파일(`registerWeek({...})`)로 만들었다. 그래야 fetch 없이 `file://`에서도 열린다.
- **구조**
  ```
  docs/                  # GitHub Pages 루트
  ├── index.html         # CSP 메타 포함, 스크립트 로드 순서: course → w01 → store → app
  ├── css/app.css
  ├── js/store.js        # 진도·연속 학습일·복습 상자(1→2→4→7→15일)·백업. 불러온 값은 sanitize로 검사
  ├── js/app.js          # 해시 라우터: #/ (홈) · #/lesson/<id> · #/review · #/cards · #/stats
  ├── content/course.js  # 14주 목록 + registerWeek()
  ├── content/w01.js     # 1주차 15레슨(5일 × 3), 문제 44개, 카드 7장
  ├── content/w02.js     # 2주차 프롬프트 기본 15레슨, 문제 46개, 카드 7장
  ├── manifest.webmanifest, icon.svg, icon-180/192/512.png
  └── version.json
  ```
- **레슨 데이터 형식**: `{id, title, minutes, cards:[{id, kind:"core"|"tip", title, body}], steps:[…]}`
  - `learn`: `{md, src, try?}`. md는 `###`, `-`, `>`, 코드 블록, `**굵게**`, `` `코드` ``, `[글](https://…)`만 지원한다.
  - `mcq`: `{q, choices, answer(원래 인덱스), explain}`. 보기는 화면에서 섞어서 보여 준다.
  - `ox`: `{q, answer:boolean, explain}`
  - `order`: `{q, items(정답 순서대로), explain}`
- **규칙**
  - 레슨은 순서대로 열린다. 오늘 목표는 3레슨(약 30분)이다.
  - 틀린 문제는 같은 레슨 끝에서 다시 나오고, 다음 날 복습 목록에 들어간다.
  - 복습은 연속 학습일에 들어가지만 하루 레슨 목표에는 들어가지 않는다.
  - practice(무작위 연습)는 복습 일정을 바꾸지 않는다.
- **버전**: `docs/version.json`과 `COURSE.version`(stats 화면 맨 아래에 표시)을 함께 올린다.

## 4. 구현 계획 / 다음 주차 추가 방법

1. `docs/content/wNN.js`를 `w01.js`와 같은 형식으로 쓴다. 기준은 `LLM_학습자료_생성_프롬프트.md`와 `학습계획안.md`다. 출처는 공식 문서로 확인하고 확인일을 적는다.
2. `index.html`에 `<script src="content/wNN.js?v=X.Y.Z">`를 마지막 주차 스크립트 다음 줄에 넣는다. 배포할 때마다 모든 `?v=` 값, `COURSE.version`, `version.json`을 함께 올린다(휴대폰 캐시 무효화).
3. 레슨 id는 `wNNdXlY` 형식을 쓰고 기존 id는 절대 바꾸지 않는다(진도 키이기 때문).
4. 브라우저 콘솔에서 콘텐츠 검사를 돌린다(mcq 정답 인덱스 범위, ox는 boolean, id 중복 없음).
5. 375×812 화면에서 레슨 하나를 끝까지 풀어 본다.

## 5. 제약 조건

- 개인정보·비밀값을 코드와 콘텐츠에 넣지 않는다. API 키도 외부 요청도 없다.
- 화면에 넣는 모든 문자열은 `esc()`를 거친다. 링크는 https만 허용하고 `rel="noopener noreferrer"`를 붙인다. 인라인 `style=""`은 CSP에 막히므로 스타일은 JS의 `el.style`이나 클래스로만 준다.
- 코드 수정을 보고할 때마다 보안 점검 결과와 이 문서에서 갱신한 부분을 한 줄로 적는다.
- 같은 기능을 여러 화면에 반복해서 두지 않는다. 진도는 홈 트리와 stats에만, 복습 진입점은 review 탭(홈에는 링크만)에 둔다.
- 모바일 우선: 터치 영역 44px 이상, 하단 고정 버튼, safe-area 대응.
- 원문을 길게 옮기지 않는다. 요약하고 출처 링크를 단다.
- 클래스 이름 `.lesson`은 레슨 플레이어 전용이다. 트리 행은 `.lsn`을 쓴다(이름이 겹쳐 생긴 버그가 있었음).

## 6. 현재 상태 (v0.2.0)

- 배포됨
  - 저장소: https://github.com/tutleblue/llm-study (main 브랜치 `/docs`)
  - 앱 주소: https://tutleblue.github.io/llm-study/
  - gh CLI에는 계정 이름이 `jykim5215`로 표시되지만 실제 GitHub 로그인은 `tutleblue`다(같은 계정).
- 콘텐츠
  - 1주차 LLM 동작 원리, 2주차 프롬프트 엔지니어링 기본: 각 15레슨
  - 2주차 출처 확인(2026-11-24): Claude Prompting best practices, OpenAI developers 문서(prompt engineering, reasoning best practices), Google AI Studio prompting strategies, CoT·Zero-shot CoT·Self-Consistency 논문
  - 반영한 최신 사항
    - Claude 4.6 이후는 prefill을 지원하지 않는다.
    - 추론 모델에는 수동 CoT보다 내장 thinking을 쓴다.
    - 최신 모델은 지시를 말 그대로 따른다.
- v0.2.0에서 바뀐 점
  - 다음 레슨이 있는 주차를 홈 트리에서 자동으로 펼친다.
  - 자산 URL에 `?v=` 캐시 무효화를 붙였다.
- 검증: 2주차 15레슨 전체를 정답으로 자동 풀이해 결과 화면까지 갔고, 375×812 화면을 확인했다.
- 다음 할 일: 3주차(프롬프트 엔지니어링 심화: 구조화 출력, 컨텍스트 엔지니어링, 캐싱, 프롬프트 인젝션)
