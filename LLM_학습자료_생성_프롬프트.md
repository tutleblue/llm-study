# LLM 실전 학습자료 생성 프롬프트

> 사용법: 이 파일 전체를 Claude Code / Claude / ChatGPT 등 **웹 검색이 되는** LLM에 붙여 넣고,
> 맨 아래 `[내 설정]`만 채운 뒤 실행한다. 한 번에 전부 만들지 말고 "모듈 0부터 시작"처럼 모듈 단위로 진행시키는 것이 품질이 가장 좋다.

---

## 역할

너는 LLM 엔지니어링 교육 설계자다. Anthropic·OpenAI의 공식 문서, GitHub 공식 저장소, 검증된 논문, 신뢰도 높은 강의·유튜브를 근거로 **"읽고 끝나는 자료"가 아니라 "손으로 만들어 보며 익히는 자료"**를 만든다.

## 목표

학습자가 아래 능력을 갖추게 한다.

1. LLM이 어떻게 동작하는지(토큰, 컨텍스트, 샘플링, 학습 방식) 직관적으로 설명할 수 있다.
2. 프롬프트를 체계적으로 설계·평가·개선할 수 있다.
3. 도구 호출(tool use), RAG, MCP를 붙인 LLM 앱을 만들 수 있다.
4. 에이전트(단일·다중)를 설계하고, 언제 에이전트를 쓰지 말아야 하는지 판단할 수 있다.
5. Claude Code의 스킬(Skills)·서브에이전트·훅, OpenAI의 Agents SDK 같은 도구로 작업을 자동화할 수 있다.
6. LLM과 협업해 **보기 좋고 빠른 웹**(디자인 시스템, 인터랙션, 배포)을 만들 수 있다.
7. 결과물을 평가(eval)하고 비용·지연·안전성을 관리할 수 있다.

---

## 작업 원칙 (반드시 지킬 것)

### 1. 출처 규칙
- **1차 출처 우선**: 공식 문서 > 공식 GitHub 저장소·쿡북 > 원 논문 > 공식 블로그·엔지니어링 글 > 저명한 개인 강의(유튜브 등) > 일반 블로그.
- 모든 핵심 주장 옆에 출처 링크를 단다. 형식: `[출처 이름](URL)`.
- **작성 전에 웹 검색으로 최신 상태를 확인한다.** LLM 분야는 몇 달 단위로 바뀐다. 모델 이름, API 파라미터, 가격, 기능 이름은 기억에 의존하지 말고 공식 문서에서 확인한 날짜를 함께 적는다 (`확인일: YYYY-MM-DD`).
- 확인할 수 없는 내용은 지어내지 않는다. "확인 필요"로 표시한다.
- 유튜브는 제목·채널·링크·핵심 구간(타임스탬프)을 적고, 내용은 요약만 한다(대본 복제 금지).
- 출처끼리 말이 다르면 숨기지 말고 "⚠️ 출처 간 차이" 박스로 양쪽을 보여준다.

### 2. 학습 설계 원칙 (효율적 학습)
- **개념 → 최소 예제 → 직접 해보기 → 흔한 실수 → 확인 문제** 순서를 지킨다.
- 한 모듈은 **2~4시간** 분량으로 자른다. 모듈마다 "이것만 기억하라" 3줄 요약을 넣는다.
- 능동 회상(active recall): 모듈 끝에 답을 접어 둔 확인 문제 5개(`<details>` 사용).
- 간격 반복: 다음 모듈 시작에 이전 모듈 복습 질문 2개를 넣는다.
- 모든 실습은 **복사해서 바로 실행 가능한** 코드로, 예상 출력까지 적는다. Python 우선, 필요하면 TypeScript 병기.
- 추상적 설명보다 **나쁜 예 vs 좋은 예 비교(before/after)**를 많이 쓴다.
- 전문 용어는 처음 나올 때 한 줄로 풀어 쓰고, 영어 원어를 괄호로 병기한다.

### 3. 형식 규칙
- 한국어로 쓴다. 코드·API 이름·공식 용어는 영어 그대로.
- Markdown, 모듈당 파일 1개 (`modules/01_xxx.md`).
- 다이어그램이 필요하면 Mermaid로 그린다.
- 수식은 최소화하고, 쓸 때는 직관적 설명을 먼저 붙인다.

---

## 커리큘럼 (모듈 구성)

각 모듈에 아래 "필수 참고 출처"를 기본으로 쓰되, 검색으로 더 최신·더 좋은 자료가 있으면 추가·교체하고 그 이유를 적는다.

### 모듈 0. 학습 지도와 환경 준비
- 전체 로드맵(Mermaid), 학습자 수준별 추천 경로(입문/개발자/고급).
- API 키 발급, 환경변수 관리, Python/Node 환경, Claude Code·Codex CLI 설치.
- 비용 관리 기본(토큰 단가 보는 법, 사용량 한도 설정).
- 참고: Anthropic Docs(docs.anthropic.com / docs.claude.com), OpenAI Platform Docs(platform.openai.com/docs), Claude Code 문서.

### 모듈 1. LLM은 어떻게 동작하나 (기초 직관)
- 토큰화, 임베딩, 트랜스포머·어텐션의 직관, 다음 토큰 예측, temperature/top-p.
- 사전학습 → 지시 튜닝 → RLHF/Constitutional AI → 추론(reasoning) 모델.
- 컨텍스트 윈도, 환각이 생기는 이유, 지식 컷오프.
- 참고:
  - Andrej Karpathy 유튜브: "Intro to Large Language Models", "Deep Dive into LLMs like ChatGPT", "Let's build GPT: from scratch", "Let's build the GPT Tokenizer"
  - 3Blue1Brown 유튜브 "Neural networks" 시리즈 중 Transformer·Attention 편
  - 논문: *Attention Is All You Need* (Vaswani et al., 2017), *Language Models are Few-Shot Learners* (GPT-3, 2020), *Training language models to follow instructions with human feedback* (InstructGPT, 2022), *Constitutional AI* (Anthropic, 2022)
  - Jay Alammar "The Illustrated Transformer"
  - GitHub: karpathy/nanoGPT, karpathy/minbpe

### 모듈 2. 프롬프트 엔지니어링 기본
- 명확·구체적 지시, 역할(system prompt), 예시(few-shot), 출력 형식 지정, XML 태그로 구조화.
- 생각할 공간 주기(chain-of-thought / extended thinking), 프롬프트 체이닝, 긴 문서 다루기.
- 실습: 같은 과제를 나쁜 프롬프트 → 좋은 프롬프트로 5단계 개선.
- 참고:
  - Anthropic Docs "Prompt engineering overview" 및 하위 가이드
  - GitHub: anthropics/prompt-eng-interactive-tutorial, anthropics/courses
  - OpenAI Docs "Prompt engineering", "Reasoning best practices", 모델별 프롬프팅 가이드(OpenAI Cookbook)
  - 논문: *Chain-of-Thought Prompting Elicits Reasoning* (Wei et al., 2022), *Self-Consistency* (Wang et al., 2022)

### 모듈 3. 프롬프트 엔지니어링 심화 (전문 영역)
- 시스템 프롬프트 설계 패턴, 프롬프트 템플릿과 변수, 구조화 출력(JSON Schema / Structured Outputs).
- 프롬프트 캐싱으로 비용·지연 줄이기, 컨텍스트 엔지니어링(무엇을 넣고 뺄지).
- 프롬프트 인젝션과 방어, 탈옥 대응, 출력 검증.
- 메타 프롬프팅(LLM으로 프롬프트 개선), Anthropic Console 프롬프트 생성·개선 도구.
- 참고:
  - Anthropic Engineering 블로그 "Effective context engineering for AI agents"
  - Anthropic Docs: prompt caching, structured outputs, extended thinking
  - OpenAI Docs: Structured Outputs, prompt caching
  - 논문: *ReAct* (Yao et al., 2022), *Tree of Thoughts* (2023), *Lost in the Middle* (Liu et al., 2023)
  - Simon Willison 블로그의 prompt injection 시리즈

### 모듈 4. 평가(Evals) — 감이 아니라 숫자로 개선하기
- 성공 기준 정의, 테스트 세트 만들기, 코드 기반 채점 vs LLM-as-judge vs 사람 평가.
- 회귀 테스트로 프롬프트 변경 관리.
- 실습: 분류 과제 하나를 골라 20개 테스트 케이스 + 자동 채점 스크립트 작성.
- 참고: Anthropic Docs "Define success criteria" / "Create strong empirical evaluations", OpenAI Evals 문서·GitHub openai/evals, Hamel Husain의 eval 관련 글, 논문 *Judging LLM-as-a-Judge* (Zheng et al., 2023)

### 모듈 5. 도구 사용(Tool Use)과 RAG
- function calling / tool use 흐름, 도구 설명(description) 잘 쓰는 법.
- 임베딩, 벡터 검색, 청킹 전략, 재순위(rerank), Contextual Retrieval.
- 실습: 내 PDF·노트를 검색해 답하는 미니 RAG 챗봇.
- 참고: Anthropic Docs "Tool use", Anthropic 블로그 "Introducing Contextual Retrieval", OpenAI Docs "Function calling" / "File search", 논문 *Retrieval-Augmented Generation* (Lewis et al., 2020), GitHub anthropics/anthropic-cookbook, openai/openai-cookbook

### 모듈 6. MCP (Model Context Protocol)
- MCP가 푸는 문제, 서버/클라이언트/도구/리소스/프롬프트 개념.
- 실습: Python 또는 TypeScript로 나만의 MCP 서버 만들어 Claude Desktop / Claude Code에 연결.
- 보안: 권한 범위, 신뢰할 수 없는 서버 다루기.
- 참고: modelcontextprotocol.io 공식 문서·명세, GitHub modelcontextprotocol/servers, modelcontextprotocol/python-sdk, typescript-sdk, Anthropic 발표 글 "Introducing the Model Context Protocol"

### 모듈 7. 에이전트 설계
- 워크플로 vs 에이전트, 언제 에이전트가 필요 없는가.
- 패턴: 프롬프트 체이닝, 라우팅, 병렬화, 오케스트레이터-워커, 평가자-최적화자, 자율 에이전트 루프.
- 멀티 에이전트 시스템의 장단점(토큰 비용, 조율 실패).
- 에이전트용 도구 설계, 장기 작업·메모리·컨텍스트 압축.
- 실습: 웹 리서치 에이전트(검색 → 요약 → 검증 → 보고서).
- 참고:
  - Anthropic Engineering "Building effective agents" (필독), "How we built our multi-agent research system", "Writing effective tools for agents"
  - Claude Agent SDK 문서
  - OpenAI "A practical guide to building agents"(PDF), OpenAI Agents SDK 문서·GitHub openai/openai-agents-python
  - 논문: *ReAct*, *Toolformer* (2023), *Reflexion* (2023), *SWE-agent* (2024)
  - Andrew Ng / DeepLearning.AI 에이전트 관련 단기 강좌

### 모듈 8. Claude Code 실전 — 스킬, 서브에이전트, 훅, 메모리
- CLAUDE.md로 프로젝트 맥락 주기, 권한 모드, 플랜 모드.
- **Agent Skills**: SKILL.md 구조(frontmatter name/description), 점진적 공개(progressive disclosure), 스크립트·참고 파일 묶기, 좋은 description 쓰는 법(언제 발동되는가).
- 서브에이전트(.claude/agents), 슬래시 명령, 훅(hooks), MCP 연결, 플러그인.
- 실습: 내 반복 작업 하나를 스킬로 만들고, 발동 테스트 5개로 검증.
- OpenAI 쪽 대응 개념(Codex CLI, AGENTS.md) 비교표.
- 참고: Claude Code 공식 문서(Skills, Subagents, Hooks, Memory, MCP), Anthropic Engineering "Equipping agents for the real world with Agent Skills", "Claude Code best practices", GitHub anthropics/skills, anthropics/claude-code, OpenAI Codex 문서·GitHub openai/codex, agents.md

### 모듈 9. LLM으로 멋진 웹 만들기
- LLM에게 디자인을 시키는 법: 레퍼런스·무드·디자인 토큰(색·타이포·간격)을 명시하기, "AI 티 나는 디자인" 피하기.
- 스택: HTML/CSS → React + Tailwind + shadcn/ui, 애니메이션(Framer Motion/GSAP), 3D(Three.js), 반응형·접근성.
- 작업 흐름: 와이어프레임 → 디자인 시스템 → 컴포넌트 → 인터랙션 → 성능(Lighthouse) → 배포(Vercel/Cloudflare/GitHub Pages).
- 스크린샷 기반 반복 개선(브라우저 자동화로 확인시키기).
- 실습: 포트폴리오 랜딩 페이지 1개를 3번 반복 개선하고 전/후 비교.
- 참고: Anthropic 프론트엔드 디자인 관련 스킬(GitHub anthropics/skills 내 frontend-design 등)과 Claude 문서의 프론트엔드 프롬프팅 팁, OpenAI Cookbook의 프론트엔드 생성 가이드, MDN Web Docs, web.dev, Tailwind·shadcn/ui 공식 문서, Refactoring UI(디자인 원칙)

### 모듈 10. 운영: 비용·지연·안전·배포
- 모델 선택(큰 모델 vs 작은 모델, 라우팅), 배치 API, 스트리밍, 캐싱.
- 관측(로깅·트레이싱), 레이트 리밋·재시도, 개인정보·비밀값 관리.
- 안전: 가드레일, 모더레이션, 사용 정책.
- 참고: Anthropic Docs (models overview, pricing, batch, rate limits), OpenAI Docs (models, Batch API, moderation, safety best practices), OWASP Top 10 for LLM Applications

### 모듈 11. 최신 연구 따라가기와 캡스톤
- 논문 읽는 법(Abstract → 그림 → 결론 → 실험), 추천 피드: arXiv cs.CL, Hugging Face Papers, Anthropic Research, OpenAI Research, Simon Willison 블로그, Latent Space 팟캐스트.
- 해석 가능성(Anthropic interpretability 연구 등)·스케일링 법칙(*Scaling Laws for Neural Language Models*, 2020; *Chinchilla*, 2022) 개관.
- **캡스톤 프로젝트**: 모듈 2~9를 합친 결과물 1개(예: MCP + RAG + 에이전트 + 웹 UI를 갖춘 개인 학습 도우미). 요구사항 명세 → 설계 → 구현 → eval → 배포 → 회고.

---

## 모듈 파일 템플릿 (모든 모듈 공통)

```markdown
# 모듈 N. 제목
> 예상 시간: X시간 | 난이도: ★☆☆ | 선수 모듈: N-1
> 확인일: YYYY-MM-DD

## 0. 지난 모듈 복습 (2문항)
## 1. 왜 배우나 (실무에서 이걸 모르면 생기는 일 1가지)
## 2. 핵심 개념 (그림/비유 + 출처)
## 3. 최소 예제 (실행 가능한 코드 + 예상 출력)
## 4. 직접 해보기 (단계별 실습, 막힐 때 힌트)
## 5. 나쁜 예 vs 좋은 예
## 6. 흔한 실수 TOP 5
## 7. Anthropic vs OpenAI 비교 (해당될 때)
## 8. 이것만 기억하라 (3줄)
## 9. 확인 문제 5개 (<details>로 답 숨김)
## 10. 더 깊이 (공식 문서 / 논문 / GitHub / 영상 — 각 1~3개, 왜 볼 가치가 있는지 한 줄씩)
```

---

## 산출물 구조

```
LLM_study/
├── README.md              # 로드맵, 학습 순서, 주간 계획표
├── modules/
│   ├── 00_setup.md
│   ├── 01_how_llms_work.md
│   └── ...
├── labs/                  # 실습 코드 (모듈별 폴더, requirements.txt 포함)
├── cheatsheets/           # 1장짜리 요약 (프롬프트 패턴, 에이전트 패턴, 스킬 작성법, 웹 디자인 프롬프트)
├── glossary.md            # 용어집 (한글 – 영문 – 한 줄 설명)
└── sources.md             # 전체 출처 목록 (분류별, 확인일 포함)
```

---

## 진행 방식

1. 먼저 `[내 설정]`을 읽고 학습자 수준·목표에 맞게 커리큘럼을 조정한 **계획안**(모듈 목록, 빼거나 합친 모듈과 이유, 주간 일정)을 보여주고 내 확인을 받는다.
2. 확인 후 `README.md`와 `sources.md`를 만든다. sources.md는 실제 검색으로 링크가 살아 있는지 확인한 것만 넣는다.
3. 모듈을 하나씩 작성한다. 각 모듈을 마치면 아래 **자체 점검**을 하고 결과를 짧게 보고한 뒤 다음으로 넘어간다.
4. 마지막에 치트시트와 용어집을 만든다.

## 자체 점검 (모듈마다)

- [ ] 핵심 주장마다 출처 링크가 있는가? 링크는 1차 출처인가?
- [ ] 모델명·파라미터·가격을 최신 공식 문서로 확인했는가(확인일 기재)?
- [ ] 코드가 실제로 실행되는가? (가능하면 직접 실행해 출력 확인)
- [ ] 초보자가 막힐 만한 지점에 힌트가 있는가?
- [ ] 분량이 2~4시간 안에 끝나는가?
- [ ] 출처 간 모순이 있으면 표시했는가?

---

## [내 설정] ← 여기만 채우기

- 현재 수준: 파이썬 기초 문법 공부함. LLM과 함께 코딩해서 서비스 배포까지 해 봄.
- 주로 쓸 도구: Claude, Claude Code, Codex, ChatGPT, Gemini, Python, VS Code
- 하루 학습 가능 시간: 30분
- 특히 깊게 알고 싶은 영역: 프롬프트 엔지니어링, 소프트웨어 딥테크 전반의 폭넓은 지식, 최신 스킬 트렌드, 바이브코딩 잡지식
- 빼도 되는 영역: (기재 없음 — 수학 이론은 직관 위주로만)
- 선호 형식: (기재 없음)

### 이 설정에 따른 추가 규칙
- **30분 단위로 쪼갠다.** 모듈 1개 = 1주(30분 × 5일). 모듈 파일 안을 `Day 1`~`Day 5`로 나누고, 각 Day는 30분 안에 끝나야 한다 (읽기 15분 + 손으로 해보기 10분 + 확인 문제 5분).
- **Day 5는 늘 "실습 + 잡지식 카드"**: 그 주 내용을 쓰는 작은 실습 1개, 바이브코딩 잡지식 카드 3장(한 장에 3~5줄: 팁·함정·단축키·명령어 등).
- 배포 경험이 있으므로 환경 설치·API 키 발급 같은 입문 설명은 생략하거나 한 줄 링크로 대신한다.
- 비교표에는 Anthropic·OpenAI와 함께 **Google Gemini**도 넣는다 (사용자가 셋 다 씀).
- 실습은 VS Code + Claude Code 또는 Codex에서 하는 것을 기본으로 한다.
