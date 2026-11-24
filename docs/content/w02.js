/* week02 — 프롬프트 엔지니어링 기본 (출처 확인일: 2026-11-24) */
(function () {
  var SRC = {
    bp: { name: "Claude Docs, Prompting best practices", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices" },
    overview: { name: "Claude Docs, Prompt engineering overview", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview" },
    sonnet5: { name: "Claude Docs, Prompting Claude Sonnet 5", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5" },
    tutorial: { name: "GitHub anthropics/prompt-eng-interactive-tutorial", url: "https://github.com/anthropics/prompt-eng-interactive-tutorial" },
    metaprompt: { name: "Claude Cookbooks, Metaprompt notebook", url: "https://colab.research.google.com/github/anthropics/claude-cookbooks/blob/main/misc/metaprompt.ipynb" },
    oai: { name: "OpenAI Docs, Prompt engineering", url: "https://developers.openai.com/api/docs/guides/prompt-engineering" },
    oaiReason: { name: "OpenAI Docs, Reasoning best practices", url: "https://developers.openai.com/api/docs/guides/reasoning-best-practices" },
    gemini: { name: "Google AI Studio Docs, Prompt design strategies", url: "https://aistudio.google.com/docs/prompting-strategies" },
    cot: { name: "Wei et al., Chain-of-Thought Prompting (2022)", url: "https://arxiv.org/abs/2201.11903" },
    zeroshot: { name: "Kojima et al., LLMs are Zero-Shot Reasoners (2022)", url: "https://arxiv.org/abs/2205.11916" },
    selfcons: { name: "Wang et al., Self-Consistency (2022)", url: "https://arxiv.org/abs/2203.11171" }
  };

  window.registerWeek({
    id: "w02",
    summary: "원하는 결과를 '운'이 아니라 '설계'로 얻는 기본기.",
    days: [
      /* ---------------- DAY 1 ---------------- */
      { title: "명확하고 직접적으로", lessons: [
        { id: "w02d1l1", title: "똑똑하지만 맥락 없는 신입", minutes: 8, steps: [
          { type: "learn", md: "### Anthropic이 권하는 출발점\nClaude를 **\"똑똑하지만 맥락이 없는 신입 직원\"**처럼 대하라. 신입은 능력이 있어도 우리 팀 사정·목적·취향을 모른다.\n\n### 동료 테스트\n작업 맥락을 거의 모르는 동료에게 내 프롬프트를 보여준다고 상상해 보자. 그 동료가 헷갈려 하면, 모델도 헷갈린다.", src: [SRC.bp] },
          { type: "mcq", q: "'동료 테스트'의 핵심은?", choices: ["프롬프트를 동료에게 대신 쓰게 한다", "맥락을 모르는 사람이 읽어도 이해되는지 확인한다", "동료와 같은 말투로 쓴다", "프롬프트를 짧게 줄인다"], answer: 1 },
          { type: "learn", md: "### 무엇을 넣어야 '맥락'이 되나\n- **목적**: 이 결과를 어디에 쓰는가\n- **독자**: 누가 읽는가\n- **형식·제약**: 길이, 말투, 형식\n- **순서가 중요하면** 번호 목록으로\n```\n나쁨: 이 글 요약해줘\n좋음: 아래 회의록을 팀장에게 보낼 3줄 요약으로 써줘.\n     결정된 것 / 미정인 것 / 담당자 순서로, 존댓말로.\n```" },
          { type: "mcq", q: "다음 중 '맥락'이 가장 풍부한 요청은?", choices: ["코드 리뷰해줘", "이 코드 이상해", "이 Python 함수를 리뷰해줘. 초보 팀원이 유지보수할 코드라 가독성을 성능보다 우선해줘", "리뷰 부탁해 빨리"], answer: 2 },
          { type: "ox", q: "모델이 똑똑하면 목적이나 독자를 말해주지 않아도 알아서 맞춰 준다고 기대해도 된다.", answer: false, explain: "능력과 맥락은 별개입니다. 모델은 내 머릿속을 볼 수 없어요." }
        ]},
        { id: "w02d1l2", title: "이유를 말하고, '하라'로 말하기", minutes: 8, steps: [
          { type: "learn", md: "### 규칙만 말하지 말고 이유를 함께\nAnthropic 문서의 예:\n```\n나쁨: 절대 말줄임표(...)를 쓰지 마.\n좋음: 이 답변은 음성(TTS)으로 읽힐 거야. 음성 엔진은\n     말줄임표를 읽지 못하니 쓰지 마.\n```\n이유를 알면 모델이 **비슷한 다른 경우까지 스스로 일반화**한다(예: 다른 읽기 어려운 기호도 피함).", src: [SRC.bp] },
          { type: "mcq", q: "지시에 '이유'를 붙이면 좋은 점은?", choices: ["프롬프트가 길어져 비용이 준다", "모델이 그 이유에 맞는 비슷한 상황까지 일반화할 수 있다", "모델이 지시를 무시한다", "응답 속도가 빨라진다"], answer: 1 },
          { type: "learn", md: "### '하지 마' 대신 '이렇게 해'\nAnthropic은 **하지 말 것보다 할 것을 말하라**고 권한다.\n```\n나쁨: 마크다운 쓰지 마.\n좋음: 답은 자연스럽게 이어지는 산문 문단으로 써.\n```\n'하지 마'는 무엇을 해야 할지 비워 둔다. '이렇게 해'는 목표를 준다.", src: [SRC.bp] },
          { type: "mcq", q: "'목록 쓰지 마'를 더 좋게 바꾼 것은?", choices: ["목록 절대절대 쓰지 마!!!", "목록은 금지야", "세 문단의 이어지는 글로 써줘", "목록 쓰면 혼난다"], answer: 2 },
          { type: "ox", q: "대문자나 느낌표로 강하게 강조하는 것이 이유를 설명하는 것보다 항상 효과적이다.", answer: false, explain: "강조보다 이유와 구체적인 대안이 더 잘 통합니다." }
        ]},
        { id: "w02d1l3", title: "최신 모델은 '말 그대로' 따른다", minutes: 8, cards: [
          { id: "c-w02-clear", kind: "core", title: "명확한 프롬프트 4원칙", body: "- **맥락**: 목적·독자·형식을 준다 (똑똑하지만 맥락 없는 신입)\n- **이유**: 규칙에 왜를 붙이면 일반화한다\n- **긍정형**: '하지 마'보다 '이렇게 해'\n- **범위 명시**: 최신 모델은 말 그대로 따른다 → '모든 섹션에', '수정까지' 처럼 범위를 적는다" }
        ], steps: [
          { type: "learn", md: "### 정밀하게 따르도록 훈련된 모델\nAnthropic 문서: 최신 Claude는 **지시를 정밀하게 따르도록** 훈련됐다.\n- \"바꿀 점을 제안해 줄래?\" → 제안만 하고 **직접 고치지 않을 수 있다**\n- 고쳐 주길 원하면: \"이 함수를 직접 수정해 줘\"\n\nSonnet 5 문서는 더 분명히 말한다: 한 항목에 준 지시를 **다른 항목으로 슬쩍 넓혀 적용하지 않는다**. 그러니 \"모든 섹션에 이 형식을 적용해\"처럼 범위를 적어야 한다.", src: [SRC.bp, SRC.sonnet5] },
          { type: "mcq", q: "Claude Code에 버그 수정을 '실제로' 시키려면 어떤 말이 가장 확실한가?", choices: ["이 버그 어떻게 생각해?", "고칠 방법 있을까?", "login.py의 이 버그를 직접 수정하고 테스트를 돌려줘", "버그가 있는 것 같아"], answer: 2, explain: "행동(수정·실행)과 대상(파일)을 분명히 말해야 합니다." },
          { type: "ox", q: "'첫 번째 표를 굵은 제목으로 바꿔줘'라고 하면, 최신 모델은 나머지 표도 알아서 같이 바꿔 줄 것이라 기대하는 게 안전하다.", answer: false, explain: "범위를 넓혀 적용하지 않을 수 있습니다. '모든 표'라고 적으세요." },
          { type: "learn", md: "### 더 원하면 '더 해 달라'고 말하기\n최소한의 결과보다 풍부한 결과를 원하면 그것도 명시한다. 문서의 예:\n> \"Go beyond the basics to create a fully-featured implementation.\"\n(기본을 넘어 기능을 다 갖춘 구현을 만들어 줘)", src: [SRC.bp] },
          { type: "mcq", q: "랜딩 페이지를 '대충 하나'가 아니라 공들인 결과로 받고 싶다. 가장 알맞은 추가 문장은?", choices: ["빨리", "기본을 넘어 애니메이션·반응형까지 갖춘 완성도 높은 페이지로 만들어줘", "알아서 해", "간단하게"], answer: 1 }
        ]}
      ]},

      /* ---------------- DAY 2 ---------------- */
      { title: "역할과 구조", lessons: [
        { id: "w02d2l1", title: "시스템 프롬프트와 역할", minutes: 8, steps: [
          { type: "learn", md: "### 시스템 프롬프트 = 대화 전체의 기본 설정\n사용자 메시지 앞에 놓여 **대화 내내 적용되는 지시**다. Anthropic: 역할을 정해 주면 행동과 말투가 집중된다. **한 문장만으로도 차이가 난다.**\n```\nsystem: You are a helpful coding assistant specializing in Python.\n```\n- Claude API: `system` 파라미터\n- OpenAI: `developer` 메시지(사용자 메시지보다 우선)\n- ChatGPT·Claude 앱: '맞춤 지시', '프로젝트 지침'이 비슷한 역할", src: [SRC.bp, SRC.oai] },
          { type: "mcq", q: "OpenAI API에서 '개발자가 주는 지시'로 사용자 메시지보다 우선하는 메시지 역할은?", choices: ["assistant", "developer", "tool", "admin"], answer: 1, explain: "OpenAI 문서: developer 메시지가 user 메시지보다 우선합니다. Claude는 system 파라미터를 씁니다." },
          { type: "ox", q: "시스템 프롬프트의 역할 설정은 최소 몇 단락은 되어야 효과가 있다.", answer: false, explain: "Anthropic은 한 문장만으로도 차이가 난다고 말합니다." },
          { type: "learn", md: "### OpenAI가 권하는 시스템(개발자) 프롬프트 순서\n1. **Identity** — 누구이고 목적은 무엇인가\n2. **Instructions** — 규칙, 해야 할 일·하지 말 일\n3. **Examples** — 입력/출력 예시\n4. **Context** — 참고 자료\n\n섹션은 마크다운 제목으로, 문서 덩어리는 XML 태그로 구분하라고 권한다.", src: [SRC.oai] },
          { type: "order", q: "OpenAI 문서가 권하는 개발자 프롬프트의 일반적인 순서.", items: ["Identity (정체성·목적)", "Instructions (지시)", "Examples (예시)", "Context (참고 자료)"] }
        ]},
        { id: "w02d2l2", title: "XML 태그로 나누기", minutes: 8, steps: [
          { type: "learn", md: "### 지시·자료·입력을 섞으면 헷갈린다\n프롬프트에 지시, 배경, 예시, 사용자 입력이 섞여 있으면 모델이 어디까지가 지시인지 헷갈릴 수 있다. **XML 태그**로 감싸면 경계가 분명해진다.\n```\n<instructions>\n아래 리뷰를 긍정/부정/중립으로 분류해.\n</instructions>\n<input>\n배송은 느렸지만 품질은 좋아요\n</input>\n```\n- 태그 이름은 **일관되고 설명적으로**\n- 위계가 있으면 중첩: `<documents>` 안에 `<document index=\"1\">`", src: [SRC.bp] },
          { type: "mcq", q: "XML 태그를 쓰는 가장 큰 이유는?", choices: ["모델이 XML만 이해해서", "지시와 데이터의 경계를 분명히 해 헷갈림을 줄이려고", "출력이 XML이 되게 하려고", "토큰 수를 줄이려고"], answer: 1 },
          { type: "mcq", q: "문서 여러 개를 넣을 때 알맞은 구조는?", choices: ["<a>문서1</a><b>문서2</b>", "<documents><document index=\"1\">…</document><document index=\"2\">…</document></documents>", "문서를 그냥 이어 붙인다", "<x>와 <X>를 섞어 쓴다"], answer: 1 },
          { type: "ox", q: "XML 태그 이름에는 정해진 '공식 이름'만 써야 한다.", answer: false, explain: "정해진 이름은 없습니다. 일관되고 내용을 잘 설명하는 이름이면 됩니다." },
          { type: "learn", md: "### 보안 보너스\n사용자 입력이나 웹 문서를 `<input>`, `<document>`처럼 감싸 두면, 그 안의 문장이 '지시'가 아니라 '자료'라는 신호가 된다. 프롬프트 인젝션 방어의 첫걸음이다(3주차)." }
        ]},
        { id: "w02d2l3", title: "긴 자료: 자료는 위, 질문은 끝", minutes: 8, cards: [
          { id: "c-w02-structure", kind: "core", title: "프롬프트 구조 잡기", body: "- **역할**: 시스템 프롬프트 한 문장부터\n- **경계**: `<instructions>` `<context>` `<input>` 같은 XML 태그\n- **긴 자료**: 자료는 맨 위, 질문은 맨 끝\n- **근거**: 답하기 전에 관련 인용을 먼저 뽑게 하기" }
        ], steps: [
          { type: "learn", md: "### 순서가 품질을 바꾼다\nAnthropic 문서: 2만 토큰이 넘는 긴 자료는 **프롬프트 맨 위**에 두고, **질문은 맨 끝**에 두면 응답 품질이 **최대 30%** 좋아질 수 있다.\n```\n<documents> …긴 계약서… </documents>\n\n위 계약서에서 해지 조건만 정리해줘.\n```\nGemini 문서도 긴 컨텍스트는 자료를 먼저 다 주고 질문을 끝에 두라고 권한다.", src: [SRC.bp, SRC.gemini] },
          { type: "mcq", q: "50쪽짜리 PDF 내용을 넣고 질문할 때 권장 배치는?", choices: ["질문 → 자료", "자료 → 질문", "자료 중간에 질문", "자료를 두 번 넣고 질문"], answer: 1 },
          { type: "learn", md: "### 인용 먼저 뽑게 하기\n긴 문서 질문은 먼저 관련 부분을 **그대로 인용**해 `<quotes>`에 모으게 한 뒤, 그 인용을 바탕으로 답하게 한다. 쓸데없는 내용에 휩쓸리지 않고, 근거가 보여 검증도 쉽다.", src: [SRC.bp] },
          { type: "ox", q: "'관련 문장을 먼저 인용한 뒤 답하라'는 방식은 답의 근거를 확인하기 쉽게 해 준다.", answer: true },
          { type: "mcq", q: "1주차의 'Lost in the Middle'과 가장 관련 있는 오늘의 팁은?", choices: ["역할 한 문장", "긴 자료는 위, 질문은 끝 + 인용 먼저", "이유를 붙이기", "예시 3~5개"], answer: 1 }
        ]}
      ]},

      /* ---------------- DAY 3 ---------------- */
      { title: "예시와 출력 형식", lessons: [
        { id: "w02d3l1", title: "few-shot: 예시로 보여주기", minutes: 8, steps: [
          { type: "learn", md: "### 말로 설명하기보다 보여주기\nAnthropic: 예시는 출력의 **형식·말투·구조**를 맞추는 가장 믿을 만한 방법 중 하나다. 권장: **3~5개**.\n좋은 예시의 3조건\n- **관련성**: 실제 사용 상황과 닮을 것\n- **다양성**: 경계 사례까지 덮고, 의도치 않은 패턴이 생기지 않게\n- **구조**: `<example>`로 감싸고, 여러 개면 `<examples>` 안에", src: [SRC.bp] },
          { type: "mcq", q: "Anthropic 문서가 권하는 예시 개수는?", choices: ["1개", "3~5개", "20개 이상", "예시는 쓰지 말 것"], answer: 1 },
          { type: "learn", md: "### 예시 예\n```\n<examples>\n<example>\n입력: 배송 빨라요\n출력: {\"감정\":\"긍정\",\"주제\":\"배송\"}\n</example>\n<example>\n입력: 색이 사진이랑 달라요\n출력: {\"감정\":\"부정\",\"주제\":\"품질\"}\n</example>\n<example>\n입력: 그냥 그래요\n출력: {\"감정\":\"중립\",\"주제\":\"기타\"}\n</example>\n</examples>\n```\n긍정·부정·중립을 **골고루** 넣은 것이 '다양성'이다." },
          { type: "mcq", q: "감정 분류 예시를 모두 '긍정' 사례로만 넣으면 생길 위험은?", choices: ["모델이 더 정확해진다", "모델이 긍정 쪽으로 치우친 패턴을 배울 수 있다", "토큰이 줄어든다", "아무 영향 없다"], answer: 1 },
          { type: "ox", q: "few-shot은 모델을 다시 학습시키는 것이다.", answer: false, explain: "프롬프트 안에서 보여줄 뿐, 모델의 가중치는 바뀌지 않습니다." }
        ]},
        { id: "w02d3l2", title: "예시에 대한 3사의 온도차", minutes: 8, steps: [
          { type: "learn", md: "### 같은 기법, 다른 강조점\n- **Google(Gemini)**: few-shot 예시를 **항상 넣으라**고 권한다. 단, 너무 많으면 과적합될 수 있고, 예시들의 형식은 똑같이 맞출 것\n- **Anthropic**: 3~5개, 관련·다양·구조\n- **OpenAI(추론 모델)**: **먼저 예시 없이(zero-shot)** 해보고, 필요하면 few-shot. 지시와 안 맞는 예시는 오히려 해가 될 수 있다\n\n> 출처끼리 강조점이 다르다. 결론: 예시 없이 먼저 → 형식이 흔들리면 다양한 예시 추가.", src: [SRC.gemini, SRC.bp, SRC.oaiReason] },
          { type: "mcq", q: "OpenAI가 추론 모델에 권하는 순서는?", choices: ["무조건 예시 10개", "zero-shot 먼저, 필요하면 few-shot", "예시만 주고 지시는 생략", "예시 대신 대문자 강조"], answer: 1 },
          { type: "ox", q: "Gemini 문서는 예시를 넣을 때 예시마다 형식을 다르게 해서 다양성을 주라고 권한다.", answer: false, explain: "형식은 똑같이 맞추고, 내용을 다양하게 하라는 것입니다." },
          { type: "mcq", q: "예시를 넣었더니 모델이 예시 문장을 거의 그대로 베낀다. 알맞은 대응은?", choices: ["예시를 더 똑같이 만든다", "예시 내용을 다양하게 바꾸거나 개수를 줄인다", "예시를 대문자로 쓴다", "temperature를 올린다"], answer: 1, explain: "과적합 신호입니다. 다양성을 늘리거나 개수를 줄이세요." }
        ]},
        { id: "w02d3l3", title: "출력 형식 정하기", minutes: 8, cards: [
          { id: "c-w02-examples", kind: "core", title: "예시·형식 체크리스트", body: "- 예시 **3~5개**, 관련·다양·같은 형식, `<example>`로 감싸기\n- 먼저 예시 없이 → 흔들리면 추가\n- 출력 스타일 = 프롬프트 스타일 (마크다운 줄이려면 프롬프트도 산문으로)\n- 정확한 JSON이 필요하면 **구조화 출력**\n- 최신 Claude는 prefill 불가 → \"서론 없이 바로 답해\"" }
        ], steps: [
          { type: "learn", md: "### 프롬프트의 모양이 답의 모양을 닮는다\nAnthropic: **원하는 출력과 같은 스타일로 프롬프트를 써라.** 프롬프트에서 마크다운을 빼면 답의 마크다운도 줄어든다.\n- 형식 표시 태그 쓰기: \"답은 `<summary>` 태그 안에\"\n- 원하는 형식이 까다로우면 자세히 적기", src: [SRC.bp] },
          { type: "mcq", q: "답이 자꾸 글머리표 목록으로 나온다. 프롬프트에서 먼저 해볼 것은?", choices: ["프롬프트도 목록 대신 산문으로 쓰고, '문단으로 써줘'라고 말한다", "프롬프트를 목록으로 더 많이 쓴다", "목록 금지를 10번 쓴다", "모델을 바꾼다"], answer: 0 },
          { type: "learn", md: "### prefill은 이제 그만\n예전에는 assistant 답변의 첫 부분(예: `{`)을 미리 넣어 형식을 강제하는 **prefill** 기법을 많이 썼다. Anthropic 문서(2026-11 확인): **Claude 4.6 이후 모델은 prefill을 지원하지 않는다**(400 오류).\n대신:\n- 정확한 형식 → **구조화 출력(structured outputs)** 또는 enum이 있는 도구\n- 서론 없애기 → 시스템 프롬프트에 \"서론 없이 바로 답해\"\n\n> 참고: Anthropic 인터랙티브 튜토리얼(Claude 3 기준)의 5장은 아직 prefill을 가르친다. 문서와 다른 곳은 최신 문서를 따를 것.", src: [SRC.bp, SRC.tutorial] },
          { type: "ox", q: "최신 Claude 모델에서도 assistant 메시지 앞부분을 미리 채워(prefill) 형식을 강제하는 방법이 권장된다.", answer: false, explain: "Claude 4.6 이후는 prefill이 지원되지 않습니다. 구조화 출력이나 지시로 대신하세요." },
          { type: "mcq", q: "앱에서 반드시 유효한 JSON을 받아야 한다. 가장 확실한 방법은?", choices: ["'JSON으로 줘'라고 부탁만 한다", "구조화 출력(스키마 지정) 기능을 쓴다", "예시 없이 운에 맡긴다", "prefill로 { 를 넣는다"], answer: 1 }
        ]}
      ]},

      /* ---------------- DAY 4 ---------------- */
      { title: "생각하게 하기", lessons: [
        { id: "w02d4l1", title: "Chain-of-Thought의 탄생", minutes: 8, steps: [
          { type: "learn", md: "### 2022년의 발견들\n- **CoT (Wei et al.)**: 풀이 과정을 담은 예시를 보여주자 큰 모델의 수학 문제 정답률이 크게 올랐다\n- **Zero-shot CoT (Kojima et al.)**: 예시 없이 **\"Let's think step by step\"** 한 줄만 붙였는데, 한 수학 벤치마크(MultiArith) 정답률이 17.7% → 78.7%\n- **Self-Consistency (Wang et al.)**: 풀이를 여러 번 뽑아 **가장 많이 나온 답**을 고르면 더 정확해졌다", src: [SRC.cot, SRC.zeroshot, SRC.selfcons] },
          { type: "mcq", q: "'Let's think step by step' 한 줄의 효과를 보고한 연구는?", choices: ["Attention Is All You Need", "Large Language Models are Zero-Shot Reasoners", "InstructGPT", "Lost in the Middle"], answer: 1 },
          { type: "mcq", q: "Self-Consistency의 아이디어는?", choices: ["한 번만 풀고 바로 답한다", "여러 풀이를 뽑아 가장 일관된(많이 나온) 답을 고른다", "답을 짧게 한다", "예시를 없앤다"], answer: 1 },
          { type: "ox", q: "CoT가 효과적인 이유는 1주차에서 배운 '생각 토큰이 다음 토큰 예측의 근거가 된다'는 원리와 연결된다.", answer: true }
        ]},
        { id: "w02d4l2", title: "2026년의 생각: 내장 thinking", minutes: 8, steps: [
          { type: "learn", md: "### 이제 모델이 스스로 생각한다\n최신 모델은 답하기 전 생각하는 능력이 **내장**돼 있다.\n- **Anthropic**: 최신 Claude는 상황에 맞춰 생각량을 조절(adaptive thinking), `effort`로 깊이 조절. 여러 최신 모델은 thinking이 기본으로 켜져 있다\n- **OpenAI**: 추론 모델에는 \"think step by step\" 같은 **CoT 프롬프트를 피하라**(불필요)\n- **Google**: 생각하는 모델에 풀이 단계를 답에 쓰게 할 필요는 대체로 없다", src: [SRC.bp, SRC.oaiReason, SRC.gemini] },
          { type: "mcq", q: "추론 모델에 대한 3사 문서의 공통된 흐름은?", choices: ["무조건 'step by step'을 붙여라", "단계별 풀이를 직접 지시하기보다 모델의 내장 추론에 맡겨라", "생각을 금지하라", "예시를 100개 넣어라"], answer: 1 },
          { type: "learn", md: "### 그래도 쓸 수 있는 팁 (Anthropic)\n- **구체적 단계 지시보다 일반적 지시**: \"깊이 생각해\"가 손으로 쓴 단계 계획보다 나은 경우가 많다\n- thinking이 꺼진 상황이면 수동 CoT가 **대안**: 먼저 추론하고, 최종 답은 `<answer>` 태그에\n- 과하게 생각하면: \"애매하면 바로 답해\"", src: [SRC.bp] },
          { type: "ox", q: "Anthropic 문서는 최신 모델에서 단계별 절차를 일일이 적어 주는 것이 '깊이 생각해' 같은 일반 지시보다 항상 낫다고 말한다.", answer: false, explain: "반대입니다. 일반 지시가 손으로 쓴 단계 계획보다 나은 경우가 많다고 합니다." },
          { type: "mcq", q: "간단한 번역에 모델이 너무 오래 생각한다. 알맞은 대응은?", choices: ["'애매하면 바로 답해'라고 하거나 effort를 낮춘다", "'더 깊이 생각해'를 추가한다", "예시를 20개 넣는다", "질문을 영어로 바꾼다"], answer: 0 }
        ]},
        { id: "w02d4l3", title: "프롬프트 체이닝과 자기 점검", minutes: 8, cards: [
          { id: "c-w02-think", kind: "core", title: "생각·체이닝 정리", body: "- 2022: CoT, 'Let's think step by step', Self-Consistency\n- 2026: 추론은 **내장**. 단계 지시보다 일반 지시, 과하면 '바로 답해'\n- 큰 일은 **체이닝**: 초안 → 검토 → 수정을 따로\n- \"[기준]에 맞는지 스스로 확인해\"로 자기 점검" }
        ], steps: [
          { type: "learn", md: "### 한 번에 다 시키지 말고 나눠서\n**프롬프트 체이닝**: 큰 작업을 여러 번의 호출로 나누고, 앞 결과를 다음 입력으로 넘긴다. Anthropic은 **중간 결과를 확인해야 할 때** 여전히 유용하다고 말한다.\n대표 패턴(자기 수정):\n```\n1) 초안 작성 → 2) 초안을 기준에 비춰 검토 → 3) 검토를 반영해 수정\n```", src: [SRC.bp] },
          { type: "order", q: "자기 수정 체이닝의 순서.", items: ["초안을 작성한다", "초안을 기준에 비춰 검토한다", "검토 결과를 반영해 수정한다"] },
          { type: "mcq", q: "체이닝이 특히 유리한 상황은?", choices: ["중간 결과를 사람이 확인하거나 고쳐야 할 때", "인사말 한 줄 생성", "숫자 두 개 더하기", "항상 한 번에 하는 게 낫다"], answer: 0 },
          { type: "learn", md: "### 자기 점검 시키기\nAnthropic: 답을 내기 전 **\"[테스트 기준]에 맞는지 확인해\"**라고 요청하면 실수를 잡는 데 도움이 된다.\n> 단, 문서는 일부 모델(Opus 5)에서는 이런 지시가 **과잉 검증**을 부른다며 빼라고 한다. 모델마다 다르니 결과를 보고 조절.", src: [SRC.bp] },
          { type: "ox", q: "자기 점검 지시는 모든 모델에서 무조건 넣는 것이 좋다고 문서에 적혀 있다.", answer: false, explain: "Opus 5처럼 과잉 검증이 생기는 모델에서는 빼라고 합니다." }
        ]}
      ]},

      /* ---------------- DAY 5 ---------------- */
      { title: "실전 + 잡지식", lessons: [
        { id: "w02d5l1", title: "Claude · ChatGPT · Gemini 비교", minutes: 8, cards: [
          { id: "c-w02-tip-literal", kind: "tip", title: "'제안해' vs '고쳐줘'", body: "Claude Code·Codex에 일을 시킬 때 동사를 정확히.\n- **'어떻게 생각해? / 제안해줘'** → 말로만 답할 수 있음\n- **'직접 수정하고 테스트까지 돌려줘'** → 실제로 고침\n- 범위도: '이 파일만' / '모든 컴포넌트에'" }
        ], steps: [
          { type: "learn", md: "### 같은 기본기, 다른 말투\n-**기본 지시 자리**: Claude `system` / OpenAI `developer` 메시지 / Gemini 시스템 지시\n- **모델을 보는 비유**: Anthropic \"똑똑하지만 맥락 없는 신입\" / OpenAI 추론 모델 \"선배 동료(목표만 주면 됨)\", 일반 GPT 모델 \"후배 동료(자세한 지시 필요)\"\n- **예시**: 3~5개 / zero-shot 먼저 / 항상 넣기\n- **CoT**: 셋 다 추론 모델엔 직접 단계 지시가 대체로 불필요", src: [SRC.bp, SRC.oai, SRC.gemini] },
          { type: "mcq", q: "OpenAI 문서가 추론 모델을 비유한 말은?", choices: ["후배 동료", "선배 동료", "신입 직원", "인턴"], answer: 1, explain: "추론 모델은 목표 중심의 높은 수준 지시만으로도 잘 하고, GPT 모델은 더 자세한 지시가 필요하다고 비유합니다." },
          { type: "ox", q: "세 회사 모두 '명확한 지시, 맥락 제공, 구조화'라는 기본기는 공통으로 권한다.", answer: true },
          { type: "mcq", q: "Gemini 문서의 few-shot 입장으로 맞는 것은?", choices: ["절대 쓰지 마라", "항상 넣기를 권하되 너무 많으면 과적합 주의", "추론 모델엔 금지", "1개만"], answer: 1 }
        ]},
        { id: "w02d5l2", title: "실습: 나쁜 프롬프트 고치기", minutes: 10, cards: [
          { id: "c-w02-tip-version", kind: "tip", title: "프롬프트도 코드처럼 버전 관리", body: "OpenAI 문서는 프롬프트를 **코드 안에서 버전 관리**하라고 권한다.\n- 서비스 프롬프트는 `prompts/` 폴더의 파일로\n- 바꿀 때마다 git 커밋 + 무엇이 좋아졌는지 메모\n- 4주차 Evals로 '좋아졌는지'를 숫자로 확인" }
        ], steps: [
          { type: "learn", try: true, md: "### 직접 해보기 (6분)\n아래 나쁜 프롬프트를 이번 주 원칙으로 고쳐 Claude·ChatGPT·Gemini 중 하나에 넣어 보자.\n```\n블로그 글 써줘. 바이브코딩에 대해. 너무 길지 않게.\n```\n고칠 체크리스트\n- 역할/독자/목적은?\n- 길이·형식을 숫자로?\n- 원하는 톤의 예시 1~2개?\n- 자료가 있으면 `<context>`로 감싸 위에, 요청은 끝에?\n- '하지 마' 대신 '이렇게 해'?" },
          { type: "mcq", q: "다음 중 이번 주 원칙을 가장 잘 반영한 프롬프트는?", choices: ["바이브코딩 블로그 글 짧게 써줘!!!", "블로그 글 써. 길게 쓰지 마. 어렵게 쓰지 마.", "개발 입문자 대상 블로그용으로, 바이브코딩의 장단점을 800자 안팎 3문단으로 써줘. 친근한 존댓말로, 마지막 문단은 바로 해볼 수 있는 팁 하나로 끝내줘.", "바이브코딩"], answer: 2 },
          { type: "mcq", q: "'어렵게 쓰지 마'를 긍정형으로 바꾼 것은?", choices: ["쉽게 쓰지 마", "중학생도 이해할 단어로, 전문 용어는 처음 나올 때 한 줄로 풀어서 써줘", "어렵지 않게", "어렵게 쓰면 안 돼"], answer: 1 },
          { type: "order", q: "긴 자료가 있는 프롬프트의 권장 배치.", items: ["시스템 프롬프트: 역할 한 문장", "<context> 긴 참고 자료 </context>", "<examples> 원하는 형식 예시 </examples>", "구체적인 요청과 출력 형식 (맨 끝)"] }
        ]},
        { id: "w02d5l3", title: "2주차 정리", minutes: 8, cards: [
          { id: "c-w02-tip-meta", kind: "tip", title: "프롬프트 초안은 AI에게", body: "빈 화면에서 고민하지 말고 초안부터 받자.\n- \"이 작업용 시스템 프롬프트를 써줘. 목적·독자·형식·예시 3개 포함\"\n- Anthropic은 프롬프트 초안용 **메타프롬프트 노트북**도 공개\n- 받은 초안을 동료 테스트 → 직접 돌려 보기 → 고치기" }
        ], steps: [
          { type: "learn", md: "### 이것만 기억하라\n- **똑똑하지만 맥락 없는 신입**에게 말하듯: 목적·독자·형식·이유\n- **'하지 마'보다 '이렇게 해'**, 최신 모델은 말 그대로 → 행동과 범위를 명시\n- **구조**: 역할 한 문장 + XML 태그, 긴 자료는 위·질문은 끝\n- **예시** 3~5개(다양하게), 정확한 형식은 구조화 출력\n- **생각**은 이제 내장. 단계 지시보다 일반 지시, 큰 일은 체이닝\n\n시작 전 Anthropic의 권장: **성공 기준**, **테스트 방법**, **첫 초안**을 먼저 갖출 것 → 4주차 Evals로 이어진다.", src: [SRC.overview, SRC.metaprompt] },
          { type: "mcq", q: "Anthropic이 프롬프트 엔지니어링을 '시작하기 전에' 갖추라고 하는 것이 아닌 것은?", choices: ["성공 기준", "기준에 맞는지 테스트할 방법", "첫 초안 프롬프트", "가장 비싼 모델"], answer: 3, explain: "지연·비용 문제는 오히려 다른 모델을 고르는 게 나을 수 있다고 합니다." },
          { type: "mcq", q: "최신 Claude에 '바로 본론부터' 답하게 하는 권장 방법은?", choices: ["assistant 응답을 prefill한다", "시스템 프롬프트에 '서론 없이 바로 답해'라고 쓴다", "질문을 대문자로", "temperature를 0으로"], answer: 1 },
          { type: "ox", q: "프롬프트 엔지니어링으로 모든 문제를 풀 수 있으니, 지연·비용 문제도 프롬프트만 고치면 된다.", answer: false, explain: "Anthropic 개요는 지연·비용 같은 문제는 모델 선택으로 푸는 게 나을 수 있다고 말합니다." },
          { type: "mcq", q: "예시 3개를 넣었는데 모두 같은 주제다. 가장 먼저 고칠 점은?", choices: ["예시를 지운다", "다양한 경우(경계 사례 포함)로 바꾼다", "예시를 대문자로", "예시를 10개로 늘리되 같은 주제로"], answer: 1 }
        ]}
      ]}
    ]
  });
})();
