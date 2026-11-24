/* 대주제 01 — LLM은 어떻게 동작하나 (출처 확인일: 2026-11-24) */
(function () {
  var SRC = {
    karpathyIntro: { name: "Karpathy, Intro to Large Language Models (YouTube)", url: "https://www.youtube.com/watch?v=zjkBMFhNj_g" },
    karpathyDeep: { name: "Karpathy, Deep Dive into LLMs like ChatGPT (YouTube)", url: "https://www.youtube.com/watch?v=7xTGNNLPyMI" },
    karpathyTok: { name: "Karpathy, Let's build the GPT Tokenizer (YouTube)", url: "https://www.youtube.com/watch?v=zduSFxRajkE" },
    b3Transformer: { name: "3Blue1Brown, Transformers, the tech behind LLMs (YouTube)", url: "https://www.youtube.com/watch?v=wjZofJX0v4M" },
    b3Attention: { name: "3Blue1Brown, Attention in transformers, step-by-step (YouTube)", url: "https://www.youtube.com/watch?v=eMlx5fFNoYc" },
    attention: { name: "Vaswani et al., Attention Is All You Need (2017)", url: "https://arxiv.org/abs/1706.03762" },
    gpt3: { name: "Brown et al., Language Models are Few-Shot Learners (2020)", url: "https://arxiv.org/abs/2005.14165" },
    instruct: { name: "Ouyang et al., InstructGPT (2022)", url: "https://arxiv.org/abs/2203.02155" },
    cai: { name: "Bai et al., Constitutional AI (2022)", url: "https://arxiv.org/abs/2212.08073" },
    illustrated: { name: "Jay Alammar, The Illustrated Transformer", url: "https://jalammar.github.io/illustrated-transformer/" },
    oaiTokens: { name: "OpenAI Help, What are tokens and how to count them", url: "https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them" },
    oaiTokenizer: { name: "OpenAI Tokenizer", url: "https://platform.openai.com/tokenizer" },
    ctx: { name: "Claude Docs, Context windows", url: "https://platform.claude.com/docs/en/build-with-claude/context-windows" },
    glossary: { name: "Claude Docs, Glossary (temperature)", url: "https://platform.claude.com/docs/en/about-claude/glossary#temperature" },
    messages: { name: "Claude Docs, Working with messages", url: "https://platform.claude.com/docs/en/build-with-claude/working-with-messages" },
    thinking: { name: "Claude Docs, Thinking", url: "https://platform.claude.com/docs/en/build-with-claude/thinking" },
    models: { name: "Claude Docs, Models overview", url: "https://platform.claude.com/docs/en/models/overview" },
    lost: { name: "Liu et al., Lost in the Middle (2023)", url: "https://arxiv.org/abs/2307.03172" },
    tokenCount: { name: "Claude Docs, Token counting", url: "https://platform.claude.com/docs/en/build-with-claude/token-counting" }
  };

  window.registerWeek({
    id: "w01",
    summary: "수학 없이, LLM이 글을 만드는 원리를 직관으로 잡는다.",
    days: [
      /* ---------------- DAY 1 ---------------- */
      { title: "토큰과 다음 토큰 예측", lessons: [
        { id: "w01d1l1", title: "LLM은 '다음 토큰 예측기'다", minutes: 8, steps: [
          { type: "learn", md: "### LLM이 하는 일은 딱 하나\n지금까지의 글을 보고 **다음에 올 조각(토큰) 하나**를 고른다. 고른 토큰을 글 끝에 붙이고, 다시 다음 토큰을 고른다. 이걸 수백~수천 번 반복한 결과가 우리가 보는 답변이다.\n```\n입력: 대한민국의 수도는\n→ 다음 토큰 후보: 서울(높음), 어디(낮음), 부산(매우 낮음)\n→ '서울' 선택 → '대한민국의 수도는 서울' → 다시 다음 토큰…\n```\n> 대화도, 코드 작성도, 요약도 전부 이 반복 하나로 만들어진다.", src: [SRC.karpathyIntro] },
          { type: "mcq", q: "LLM이 답변을 만드는 기본 방식으로 가장 알맞은 것은?", choices: ["질문과 가장 비슷한 문서를 찾아 통째로 보여준다", "다음에 올 토큰 하나를 고르는 일을 반복한다", "문장 전체를 한 번에 계산해 출력한다", "미리 저장된 정답표에서 답을 꺼낸다"], answer: 1, explain: "한 번에 토큰 하나씩, 앞의 글 전체를 보고 다음을 고르는 것을 반복합니다(자기회귀, autoregressive)." },
          { type: "ox", q: "LLM은 답변을 다 만든 뒤에 처음부터 다시 고쳐 쓰는 단계가 기본으로 들어 있다.", answer: false, explain: "기본 생성은 한 방향으로 토큰을 이어 붙일 뿐입니다. 이미 낸 토큰을 되돌려 고치지 않아요. 그래서 '먼저 생각하고 답하게' 하는 기법이 의미가 있습니다(4챕터)." },
          { type: "learn", md: "### 그럼 '똑똑함'은 어디서 오나\n다음 토큰을 잘 맞히려면 문법, 사실, 논리, 코드 규칙까지 알아야 한다. 엄청난 양의 글로 이 예측을 연습하는 동안 모델 안에 그런 지식과 패턴이 **압축**된다.\n- Karpathy는 이를 \"인터넷을 손실 압축한 파일\"에 비유한다\n- 그래서 그럴듯하지만 틀린 말(환각)도 같은 원리로 나온다", src: [SRC.karpathyIntro] },
          { type: "mcq", q: "LLM이 '그럴듯하지만 틀린 말'을 하는 이유와 가장 가까운 설명은?", choices: ["인터넷에 연결이 끊겨서", "사실 확인 대신, 가장 그럴듯한 다음 토큰을 고르도록 학습했기 때문에", "일부러 거짓말을 하도록 설계되어서", "토큰 수가 부족해서"], answer: 1, explain: "목표가 '그럴듯한 이어 쓰기'이기 때문에, 근거가 없어도 그럴듯한 문장이 나올 수 있습니다. 5챕터에서 더 다룹니다." }
        ]},
        { id: "w01d1l2", title: "토큰이란 무엇인가", minutes: 8, steps: [
          { type: "learn", md: "### 토큰 = 모델이 읽는 글자 조각\n모델은 글자를 그대로 읽지 않고 **토큰**이라는 조각으로 잘라서 숫자(ID)로 바꿔 읽는다. 토큰은 단어일 수도, 단어의 일부일 수도, 공백+단어일 수도 있다.\n```\n\"unbelievable\" → un | believ | able   (예시)\n```\n- OpenAI 안내: 영어에서 대략 **1토큰 ≈ 4글자 ≈ 단어의 3/4**\n- 정확한 자르는 방식은 모델(토크나이저)마다 다르다", src: [SRC.oaiTokens, SRC.karpathyTok] },
          { type: "ox", q: "토큰은 항상 단어 하나와 정확히 같다.", answer: false, explain: "단어 일부, 공백을 포함한 조각, 문장부호 등 다양합니다." },
          { type: "mcq", q: "OpenAI 안내 기준, 영어 100토큰은 대략 몇 단어일까?", choices: ["약 25단어", "약 75단어", "약 100단어", "약 400단어"], answer: 1, explain: "1토큰 ≈ 단어의 3/4 → 100토큰 ≈ 75단어. 어디까지나 영어 기준 어림값입니다." },
          { type: "learn", try: true, md: "### 직접 해보기 (3분)\n[OpenAI Tokenizer](https://platform.openai.com/tokenizer)에 아래 두 문장을 각각 넣고 토큰 수를 비교해 보자.\n```\nThe capital of Korea is Seoul.\n대한민국의 수도는 서울이다.\n```\n- 같은 뜻인데 토큰 수가 같은가?\n- 한국어는 어떻게 잘리는가?\n> 토큰 수 = 비용과 컨텍스트 사용량. 언어와 모델에 따라 같은 내용도 토큰 수가 달라진다.", src: [SRC.oaiTokenizer] },
          { type: "mcq", q: "API 비용과 직접 연결되는 단위는?", choices: ["글자 수", "단어 수", "토큰 수", "문장 수"], answer: 2, explain: "LLM API는 입력·출력 토큰 수로 요금을 매깁니다. Claude API에는 보내기 전에 토큰 수를 세는 기능도 있어요." , src: SRC.tokenCount },
          { type: "ox", q: "같은 문장이라도 모델(토크나이저)이 다르면 토큰 수가 달라질 수 있다.", answer: true, explain: "토크나이저가 모델마다 다르기 때문입니다. Anthropic도 최신 모델에서 토큰 계산이 달라졌다고 안내합니다." }
        ]},
        { id: "w01d1l3", title: "컨텍스트 윈도: 한 번에 볼 수 있는 양", minutes: 8, cards: [
          { id: "c-w01-ctx", kind: "core", title: "컨텍스트 윈도", body: "모델이 **한 번에** 볼 수 있는 토큰의 최대량. 입력(대화·문서·시스템 프롬프트) + 출력이 모두 여기에 들어간다.\n- 2026-11 기준 현재 Claude 모델은 100만(1M) 토큰\n- 넘치면 앞부분을 잘라내거나 요약해야 한다\n- 크다고 다 잘 읽는 건 아니다(5챕터)" }
        ], steps: [
          { type: "learn", md: "### 컨텍스트 윈도 = 작업대 크기\n모델은 대화를 '기억'하는 게 아니라, 매번 **지금까지의 대화 전체를 다시 읽고** 다음 토큰을 고른다. 한 번에 올려놓을 수 있는 최대 토큰 수가 **컨텍스트 윈도**다.\n- 여기엔 시스템 프롬프트 + 대화 기록 + 첨부 문서 + 모델의 답변이 모두 들어간다\n- Claude 문서(2026-11 확인): 현재 모델들은 **1M(100만) 토큰**, 일부 구형 모델은 200K", src: [SRC.ctx] },
          { type: "mcq", q: "컨텍스트 윈도에 들어가지 않는 것은?", choices: ["시스템 프롬프트", "이전 대화 내용", "모델이 이번에 생성하는 답변", "다른 사용자와 나눈 대화"], answer: 3, explain: "이번 요청에 실제로 보낸 내용만 들어갑니다. 다른 대화는 모델이 볼 수 없어요." },
          { type: "ox", q: "채팅 앱에서 대화가 길어질수록 매 답변마다 처리하는 토큰도 늘어난다.", answer: true, explain: "매 턴마다 이전 대화를 다시 넣어 보내기 때문입니다. 그래서 긴 대화는 느려지고 비싸집니다." },
          { type: "learn", md: "### 바이브코딩에서 왜 중요한가\nClaude Code나 Codex가 큰 프로젝트를 다룰 때, 모든 파일을 한 번에 넣지 못한다. 그래서 도구들은\n- 필요한 파일만 골라 읽고\n- 대화가 길어지면 요약(compact)하고\n- 새 작업은 새 대화로 시작하길 권한다\n> 컨텍스트는 '무한한 기억'이 아니라 '한정된 작업대'다." },
          { type: "order", q: "모델이 대화의 다음 답을 만드는 순서대로 누르세요.", items: ["지금까지의 대화 전체를 입력으로 받는다", "토큰으로 잘라 숫자로 바꾼다", "다음 토큰을 하나 고른다", "끝날 때까지 다음 토큰 고르기를 반복한다"], explain: "매 턴마다 전체를 다시 읽고 → 토큰화 → 한 토큰씩 생성합니다." }
        ]}
      ]},

      /* ---------------- DAY 2 ---------------- */
      { title: "샘플링: 왜 답이 매번 다를까", lessons: [
        { id: "w01d2l1", title: "확률 분포에서 고르기", minutes: 8, steps: [
          { type: "learn", md: "### 모델은 '정답'이 아니라 '확률표'를 낸다\n다음 토큰마다 모델은 가능한 모든 토큰에 확률을 매긴다.\n```\n'오늘 날씨가' 다음 토큰\n  좋다   42%\n  맑다   21%\n  흐리다 12%\n  ...\n```\n여기서 **어떻게 하나를 뽑느냐**가 샘플링(sampling)이다. 늘 1등만 고를 수도, 확률대로 뽑을 수도 있다.", src: [SRC.karpathyDeep] },
          { type: "mcq", q: "같은 질문에 ChatGPT가 매번 조금씩 다른 답을 하는 주된 이유는?", choices: ["서버가 매번 다른 모델을 써서", "확률에 따라 토큰을 뽑는 샘플링 때문에", "인터넷 검색 결과가 바뀌어서", "버그라서"], answer: 1, explain: "확률표에서 무작위성을 섞어 뽑기 때문입니다. 정상 동작이에요." },
          { type: "learn", md: "### temperature: 확률표를 얼마나 뾰족하게?\n- **낮게** → 1등 토큰이 거의 독점 → 답이 일정하고 무난\n- **높게** → 확률이 고르게 퍼짐 → 다양하고 창의적이지만 엉뚱해질 위험\n\nClaude 용어집도 temperature를 '무작위성 조절 값'으로 설명하며, **0으로 해도 결과가 완전히 똑같지는 않다**고 적고 있다.", src: [SRC.glossary] },
          { type: "mcq", q: "temperature를 낮추면 일어나는 일은?", choices: ["확률이 높은 토큰이 더 자주 뽑혀 답이 일정해진다", "모델이 더 많은 지식을 쓴다", "답이 더 길어진다", "모델이 더 빨리 학습한다"], answer: 0, explain: "확률 분포가 뾰족해져 1등 토큰 쪽으로 쏠립니다." },
          { type: "ox", q: "temperature를 0으로 하면 언제나 글자 하나까지 똑같은 답이 나온다고 보장된다.", answer: false, explain: "Claude 문서도 0이어도 완전히 결정적이지는 않다고 안내합니다. 중요한 결과는 테스트로 확인해야 해요." }
        ]},
        { id: "w01d2l2", title: "최신 API에서 temperature는?", minutes: 7, steps: [
          { type: "learn", md: "### 2026년의 변화: 직접 못 만지는 경우가 늘었다\nClaude 문서(2026-11 확인)에 따르면 **Claude 4.7 이후 모델과 API 버전 2026-10-21부터는** `temperature`, `top_p`, `top_k`를 보내면 오류가 난다.\n- 추론(생각)하는 모델이 늘면서 샘플링은 모델 쪽이 관리하는 흐름\n- 개념은 여전히 중요하다: \"답이 왜 흔들리는가\"를 설명해 주기 때문\n- 다른 회사 도구나 예전 모델에는 이 설정이 남아 있기도 하다", src: [SRC.messages] },
          { type: "ox", q: "최신 Claude API에서는 temperature 값을 바꿔 보내는 것이 지원되지 않는다.", answer: true, explain: "Claude 4.7 이후 모델과 2026-10-21 API 버전부터 temperature·top_p·top_k는 지원되지 않습니다(400 오류)." },
          { type: "mcq", q: "그렇다면 최신 모델에서 답을 더 일정하게 만들고 싶을 때 현실적인 방법은?", choices: ["temperature를 음수로 보낸다", "출력 형식·예시·기준을 프롬프트에 명확히 준다", "같은 질문을 더 크게(대문자로) 쓴다", "방법이 없다"], answer: 1, explain: "형식·예시·평가 기준을 분명히 주는 것이 가장 효과적입니다. 다음 대주제인 프롬프트 엔지니어링의 핵심이에요." },
          { type: "learn", md: "### top-p, top-k도 알아두기\n- **top-k**: 확률 상위 k개 토큰 중에서만 뽑기\n- **top-p**: 확률을 위에서부터 더해 p(예: 90%)가 될 때까지의 토큰들 중에서만 뽑기\n\n둘 다 '꼬리'에 있는 엉뚱한 토큰을 잘라내는 장치다. 앞으로 문서나 다른 도구에서 보면 \"샘플링 범위 조절\"이라고 이해하면 된다." },
          { type: "mcq", q: "top-k = 3 이면?", choices: ["3번 생성해서 가장 좋은 답을 고른다", "확률 상위 3개 토큰 중에서만 뽑는다", "답을 3문장으로 제한한다", "3초 안에 답한다"], answer: 1 }
        ]},
        { id: "w01d2l3", title: "실습: 흔들림을 눈으로 보기", minutes: 10, cards: [
          { id: "c-w01-sampling", kind: "core", title: "샘플링", body: "모델은 다음 토큰의 **확률표**를 내고, 그중 하나를 뽑는다.\n- temperature 낮음 → 일정 / 높음 → 다양\n- 0이어도 완전히 같지는 않다\n- 최신 Claude API는 temperature·top_p·top_k를 받지 않음(2026-11 기준) → 일정함은 프롬프트로 만든다" }
        ], steps: [
          { type: "learn", try: true, md: "### 직접 해보기 (5분)\nClaude, ChatGPT, Gemini 중 둘 이상에서 **새 대화**를 열어 같은 질문을 3번씩 해 보자.\n```\n'시간 관리'를 주제로 한 줄짜리 카피를 하나만 써줘.\n```\n이어서 이렇게 바꿔 다시 3번:\n```\n'시간 관리'를 주제로 한 줄짜리 카피를 하나만 써줘.\n조건: 10자 이내, 명사로 끝, 예시) \"하루를 설계하는 습관\"\n```\n- 어느 쪽이 더 일정했나?" },
          { type: "mcq", q: "두 번째 프롬프트가 더 일정한 결과를 낸 가장 큰 이유는?", choices: ["질문이 더 길어서", "조건과 예시가 가능한 답의 범위를 좁혀서", "모델이 두 번째 질문을 더 좋아해서", "우연"], answer: 1, explain: "조건·예시는 확률표에서 '괜찮은 답'의 범위를 좁혀 줍니다. 샘플링 설정 없이도 일정함을 만드는 방법이에요." },
          { type: "ox", q: "창의적인 아이디어가 많이 필요할 때는 답이 흔들리는 것이 오히려 장점이 될 수 있다.", answer: true, explain: "여러 번 생성해 고르는 방식은 브레인스토밍에 유용합니다." },
          { type: "order", q: "샘플링이 일어나는 흐름을 순서대로 누르세요.", items: ["모델이 다음 토큰 후보마다 확률을 계산한다", "샘플링 규칙(temperature 등)이 확률표를 조정한다", "조정된 확률에 따라 토큰 하나를 뽑는다", "뽑은 토큰을 붙이고 다음 단계로 간다"] }
        ]}
      ]},

      /* ---------------- DAY 3 ---------------- */
      { title: "트랜스포머를 직관으로", lessons: [
        { id: "w01d3l1", title: "임베딩: 뜻을 좌표로", minutes: 8, steps: [
          { type: "learn", md: "### 토큰 → 숫자 목록(벡터)\n토큰 ID 자체에는 뜻이 없다. 모델은 각 토큰을 수백~수천 개의 숫자로 된 **벡터(임베딩)**로 바꾼다. 이 숫자들은 일종의 '뜻 공간'의 좌표다.\n- 뜻이 비슷한 단어는 가까운 위치에\n- 방향에도 의미가 담긴다 (유명한 예: 왕 − 남자 + 여자 ≈ 여왕)", src: [SRC.b3Transformer] },
          { type: "mcq", q: "임베딩에 대한 설명으로 맞는 것은?", choices: ["토큰을 그림으로 바꾼 것", "토큰의 뜻을 담은 숫자 목록(벡터)", "토큰을 압축한 zip 파일", "토큰의 글자 수"], answer: 1 },
          { type: "ox", q: "임베딩 공간에서 '고양이'와 '강아지'는 '고양이'와 '세금'보다 가까울 가능성이 높다.", answer: true, explain: "비슷한 맥락에서 쓰이는 단어일수록 가깝게 배치되는 경향이 있습니다." },
          { type: "learn", md: "### 이게 왜 실무에서 중요한가\n임베딩은 LLM 안에서만 쓰이는 게 아니다. **문서 검색(RAG)**에서는 문서와 질문을 임베딩으로 바꾼 뒤 '가까운' 문서를 찾는다. '도구 사용과 RAG' 대주제의 출발점이 바로 이 개념이다." },
          { type: "mcq", q: "임베딩을 활용하는 대표적인 실무 기능은?", choices: ["뜻이 비슷한 문서 찾기(의미 검색)", "이미지 압축", "비밀번호 암호화", "화면 렌더링"], answer: 0 }
        ]},
        { id: "w01d3l2", title: "어텐션: 문맥 보고 뜻 정하기", minutes: 9, steps: [
          { type: "learn", md: "### 같은 단어, 다른 뜻\n'배'는 과일일 수도, 배(ship)일 수도, 신체 부위일 수도 있다.\n```\n배를 깎아 먹었다      → 과일\n배를 타고 섬에 갔다   → ship\n```\n**어텐션(attention)**은 각 토큰이 문장 속 다른 토큰들을 \"얼마나 참고할지\" 정해, 문맥에 맞게 자기 뜻(벡터)을 업데이트하는 장치다.", src: [SRC.b3Attention, SRC.illustrated] },
          { type: "mcq", q: "'배를 타고 섬에 갔다'에서 '배'의 뜻을 정할 때 어텐션이 가장 크게 참고할 토큰은?", choices: ["를", "타고·섬", "갔다의 '다'", "문장 길이"], answer: 1, explain: "'타고', '섬'이 '배'가 탈것임을 알려 주는 단서입니다." },
          { type: "learn", md: "### 트랜스포머 = 어텐션 + 계산 블록을 여러 층 쌓은 것\n2017년 논문 *Attention Is All You Need*가 제안한 구조다.\n- 어텐션 층: 토큰끼리 정보를 주고받음\n- MLP(피드포워드) 층: 각 토큰에서 정보를 가공·저장\n- 이걸 수십~수백 층 반복 → 마지막에 다음 토큰 확률표", src: [SRC.attention, SRC.b3Transformer] },
          { type: "order", q: "트랜스포머가 다음 토큰을 고르는 흐름을 순서대로.", items: ["글을 토큰으로 자른다", "토큰을 임베딩 벡터로 바꾼다", "어텐션·MLP 층을 여러 번 통과하며 문맥을 반영한다", "마지막에 다음 토큰의 확률표를 낸다"] },
          { type: "ox", q: "어텐션은 각 토큰이 다른 토큰을 참고하는 정도를 문맥에 따라 다르게 정한다.", answer: true }
        ]},
        { id: "w01d3l3", title: "왜 트랜스포머가 이겼나", minutes: 7, cards: [
          { id: "c-w01-transformer", kind: "core", title: "트랜스포머 한 줄 요약", body: "토큰 → **임베딩(뜻 좌표)** → **어텐션(문맥 참고)** + MLP를 여러 층 → 다음 토큰 확률표.\n- 2017 *Attention Is All You Need*\n- 병렬 학습이 쉬워 GPU로 거대하게 키울 수 있었다" }
        ], steps: [
          { type: "learn", md: "### 이전 방식(RNN)의 한계\n예전 모델은 글을 **한 토큰씩 순서대로** 처리했다. 그래서 학습이 느리고, 긴 문장 앞부분을 잊기 쉬웠다.\n\n트랜스포머는 학습할 때 문장의 모든 위치를 **동시에(병렬로)** 계산할 수 있다. GPU에 잘 맞아서 모델과 데이터를 엄청나게 키울 수 있었다.", src: [SRC.attention] },
          { type: "mcq", q: "트랜스포머가 대형 모델 시대를 연 핵심 이유는?", choices: ["코드가 짧아서", "학습을 병렬로 처리할 수 있어 GPU로 크게 키우기 좋아서", "인터넷 연결이 필요 없어서", "한국어 전용이라서"], answer: 1 },
          { type: "learn", md: "### 규모를 키우자 생긴 일\nGPT-3 논문(2020)은 모델을 크게 키우자 **예시 몇 개만 보여줘도(few-shot)** 새 과제를 해내는 능력이 나타났다고 보고했다. 이것이 '프롬프트로 일을 시키는' 시대의 시작이다.", src: [SRC.gpt3] },
          { type: "ox", q: "few-shot이란 모델을 다시 학습시키지 않고, 프롬프트에 예시 몇 개를 넣어 과제를 알려주는 방식이다.", answer: true, explain: "'프롬프트 엔지니어링 기본' 대주제에서 직접 써 봅니다." },
          { type: "mcq", q: "트랜스포머도 '생성'할 때는 토큰을 어떻게 내놓나?", choices: ["전부 동시에", "여전히 한 토큰씩 차례로", "문장 단위로", "역순으로"], answer: 1, explain: "학습은 병렬이지만, 생성은 여전히 다음 토큰을 하나씩 이어 붙입니다." }
        ]}
      ]},

      /* ---------------- DAY 4 ---------------- */
      { title: "모델은 어떻게 만들어지나", lessons: [
        { id: "w01d4l1", title: "사전학습: 인터넷으로 다음 토큰 연습", minutes: 8, steps: [
          { type: "learn", md: "### 1단계 — 사전학습(pre-training)\n방대한 텍스트(웹, 책, 코드…)로 **다음 토큰 맞히기**를 끝없이 연습한다. 결과물은 '베이스 모델'.\n- 아는 건 많지만 대화 상대가 아니다\n- 질문을 넣으면 답 대신 비슷한 질문 목록을 이어 쓸 수도 있다 (문서 이어 쓰기 기계)\n- 이 단계가 비용의 대부분: 거대한 GPU 클러스터, 수 주~수 개월", src: [SRC.karpathyDeep, SRC.karpathyIntro] },
          { type: "mcq", q: "베이스 모델에 '파이썬에서 리스트를 정렬하는 법?'이라고 넣었을 때 일어날 수 있는 일은?", choices: ["항상 친절한 단계별 설명을 한다", "비슷한 질문들을 계속 나열하는 식으로 '이어 쓰기'를 할 수 있다", "아무것도 출력하지 않는다", "인터넷을 검색한다"], answer: 1, explain: "베이스 모델은 '대화'가 아니라 '문서 이어 쓰기'를 배웠기 때문입니다." },
          { type: "ox", q: "LLM 제작 비용의 대부분은 사전학습 단계에서 든다.", answer: true }
        ]},
        { id: "w01d4l2", title: "지시 튜닝과 RLHF: 비서로 만들기", minutes: 9, steps: [
          { type: "learn", md: "### 2단계 — 지시 튜닝(SFT)\n사람이 쓴 '질문 → 좋은 답' 예시로 추가 학습시켜 **대화하는 비서**처럼 행동하게 만든다.\n\n### 3단계 — RLHF\n모델 답 여러 개를 사람이 **비교·순위**를 매기고, 그 선호를 학습한 보상 모델로 강화학습을 한다. InstructGPT 논문(2022)은 이 방식으로 훨씬 작은 모델이 사람들에게 더 선호되는 답을 낼 수 있었다고 보고했다.", src: [SRC.instruct] },
          { type: "order", q: "대화형 LLM이 만들어지는 일반적인 순서.", items: ["사전학습 (다음 토큰 예측)", "지시 튜닝 (좋은 답 예시로 학습)", "선호 학습 (RLHF 등)", "배포 후 사용자와 대화"] },
          { type: "mcq", q: "RLHF에서 사람이 주로 하는 일은?", choices: ["모델 코드를 직접 수정", "모델 답변들을 비교해 더 좋은 것을 고른다", "GPU를 조립한다", "토큰을 하나씩 입력한다"], answer: 1 },
          { type: "learn", md: "### Anthropic의 Constitutional AI\n사람이 일일이 판단하는 대신, **원칙 목록(헌법)**을 주고 AI가 자기 답을 원칙에 비춰 비판·수정하게 하고, 그 판단(AI 피드백)으로 학습하는 방법이다(2022). Claude 학습 방식의 바탕이 된 연구다.", src: [SRC.cai] },
          { type: "ox", q: "Constitutional AI는 원칙 목록을 바탕으로 한 AI 피드백을 활용해 모델을 다듬는다.", answer: true }
        ]},
        { id: "w01d4l3", title: "추론 모델: 생각할 시간 주기", minutes: 8, cards: [
          { id: "c-w01-pipeline", kind: "core", title: "LLM 제작 파이프라인", body: "**사전학습**(다음 토큰 예측, 비용 대부분) → **지시 튜닝**(비서처럼) → **선호 학습**(RLHF / Constitutional AI) → (추론 모델) **생각하는 법 강화**.\n베이스 모델 = 문서 이어 쓰기 기계, 튜닝된 모델 = 비서." }
        ], steps: [
          { type: "learn", md: "### 답하기 전에 '생각 토큰'을 쓴다\n생성은 한 방향이라 이미 낸 토큰을 고칠 수 없다. 그래서 **답 전에 중간 풀이를 길게 쓰게** 하면 어려운 문제를 더 잘 푼다.\n- 최근 모델들은 이 '생각'을 강화학습으로 따로 훈련받는다 (추론 모델)\n- Claude 문서에는 상황에 따라 생각의 양을 조절하는 thinking 기능이 정리돼 있다", src: [SRC.thinking, SRC.karpathyDeep] },
          { type: "mcq", q: "어려운 수학 문제를 줄 때 '먼저 단계별로 풀이를 쓰고 답하라'가 효과적인 이유는?", choices: ["모델이 칭찬받는 걸 좋아해서", "중간 토큰들이 다음 토큰 예측의 근거가 되어 계산을 나눠 할 수 있어서", "답이 짧아져서", "비용이 줄어서"], answer: 1, explain: "토큰 하나당 계산량은 한정적이라, 생각을 여러 토큰에 나누면 더 복잡한 추론이 가능합니다." },
          { type: "ox", q: "생각(추론) 토큰을 많이 쓸수록 보통 시간과 비용도 늘어난다.", answer: true, explain: "생각도 토큰이라 시간과 비용이 듭니다. 간단한 일엔 과할 수 있어요." },
          { type: "mcq", q: "다음 중 '생각을 길게' 시킬 가치가 가장 적은 작업은?", choices: ["복잡한 버그 원인 찾기", "여러 조건을 따지는 일정 짜기", "'안녕'을 영어로 번역", "알고리즘 설계"], answer: 2 }
        ]}
      ]},

      /* ---------------- DAY 5 ---------------- */
      { title: "한계 알기 + 잡지식", lessons: [
        { id: "w01d5l1", title: "환각과 지식 컷오프", minutes: 8, cards: [
          { id: "c-w01-tip-docs", kind: "tip", title: "최신 라이브러리는 문서를 먹여라", body: "모델은 **지식 컷오프 이후**에 나온 API·라이브러리 버전을 모른다. 바이브코딩 중 이상한 옛 문법이 나오면:\n- 공식 문서 링크나 내용을 붙여 넣거나\n- 검색/문서 조회 도구(MCP 등)를 쓰게 하고\n- `package.json`·`requirements.txt`의 실제 버전을 알려 줘라" }
        ], steps: [
          { type: "learn", md: "### 환각(hallucination)\n없는 논문, 없는 함수, 틀린 수치를 **자신 있게** 말하는 현상. 원리상 '그럴듯한 이어 쓰기'를 하기 때문에 완전히 없앨 수는 없다.\n\n### 지식 컷오프\n모델이 학습한 데이터가 언제까지인지. Claude 문서는 '믿을 만한 지식 컷오프'를 \"지식이 가장 풍부하고 신뢰할 만한 시점\"으로 설명한다. 그 이후 일은 검색이나 문서 제공 없이는 모른다.", src: [SRC.models, SRC.karpathyIntro] },
          { type: "mcq", q: "환각을 줄이는 방법으로 가장 효과적인 것은?", choices: ["'절대 틀리지 마'라고 크게 쓴다", "근거 문서를 함께 주고, 모르면 모른다고 하게 한다", "temperature를 최대로 올린다", "질문을 짧게 한다"], answer: 1, explain: "근거 제공 + '모르면 모른다고 답하라'는 허용이 효과적입니다. '프롬프트 엔지니어링 심화'에서 더 다룹니다." },
          { type: "ox", q: "모델이 어떤 라이브러리 함수를 자신 있게 쓰면 실제로 존재한다고 믿어도 된다.", answer: false, explain: "없는 함수를 그럴듯하게 만들어 내는 일이 흔합니다. 실행·테스트·문서로 확인하세요." }
        ]},
        { id: "w01d5l2", title: "긴 컨텍스트의 함정", minutes: 7, cards: [
          { id: "c-w01-tip-fresh", kind: "tip", title: "작업이 바뀌면 새 대화", body: "대화가 길어질수록 느려지고 비싸지며, 중간 정보는 놓치기 쉽다.\n- 새 기능·새 버그 → **새 대화**로 시작\n- 이어 가야 하면 요약(compact)을 쓰거나 핵심 결정을 파일(CLAUDE.md, HANDOFF.md)에 적어 두고 새 대화에 읽게 하기" }
        ], steps: [
          { type: "learn", md: "### 'Lost in the Middle'\n2023년 연구는 긴 입력에서 필요한 정보가 **처음이나 끝**에 있을 때보다 **중간**에 있을 때 모델 성능이 떨어지는 경향을 보고했다.\n- 이후 모델들은 많이 개선됐지만, '크게 넣으면 다 읽는다'고 가정하지 말 것\n- 중요한 지시는 분명히, 필요하면 끝에서 한 번 더", src: [SRC.lost] },
          { type: "mcq", q: "긴 문서를 주고 질문할 때 좋은 습관은?", choices: ["질문을 문서 한가운데에 숨긴다", "필요한 부분만 골라 넣고, 질문·지시를 분명한 위치에 둔다", "문서를 여러 번 복사해 넣는다", "아무 지시 없이 문서만 준다"], answer: 1 },
          { type: "ox", q: "컨텍스트 윈도가 1M 토큰이면, 넣은 내용을 언제나 똑같이 잘 활용한다고 가정해도 된다.", answer: false, explain: "용량과 활용 품질은 다른 문제입니다. 필요한 것만 넣는 '컨텍스트 엔지니어링'은 '프롬프트 엔지니어링 심화'에서." }
        ]},
        { id: "w01d5l3", title: "정리", minutes: 8, cards: [
          { id: "c-w01-tip-verify", kind: "tip", title: "같은 답이 두 번 나와야 믿는다", body: "샘플링 때문에 LLM 답은 흔들린다. 중요한 결정(보안, 돈, 데이터 삭제)이 걸린 코드는\n- 테스트를 먼저 만들게 하고\n- 다른 대화나 다른 모델(Claude↔Codex↔Gemini)에게 리뷰시키고\n- 직접 실행해 결과를 눈으로 확인하라" }
        ], steps: [
          { type: "learn", md: "### 이것만 기억하라\n- LLM = **다음 토큰 예측**을 반복하는 기계. 똑똑함도 환각도 여기서 나온다\n- **토큰**이 비용과 컨텍스트의 단위. 컨텍스트는 한정된 작업대\n- 답이 흔들리는 건 **샘플링** 때문. 일정함은 프롬프트(형식·예시·기준)로 만든다\n- 사전학습 → 지시 튜닝 → 선호 학습 → (추론 강화)\n\n> 다음 대주제: 이 원리를 이용해 프롬프트를 '설계'한다." },
          { type: "mcq", q: "다음 중 이 대주제 내용과 맞지 않는 것은?", choices: ["토큰 수가 늘면 비용도 는다", "모델은 지난 대화를 따로 저장해 두고 기억한다", "생각 토큰은 시간과 비용을 쓴다", "트랜스포머는 어텐션으로 문맥을 반영한다"], answer: 1, explain: "모델은 매번 보내진 대화 전체를 다시 읽을 뿐, 따로 기억하지 않습니다(앱의 메모리 기능은 그 내용을 다시 넣어 주는 것)." },
          { type: "order", q: "LLM 한 번의 답이 만들어지는 전체 흐름.", items: ["대화 전체를 토큰으로 자른다", "임베딩 → 트랜스포머 층을 통과한다", "다음 토큰 확률표를 만든다", "샘플링으로 토큰 하나를 뽑고 반복한다"] },
          { type: "mcq", q: "Claude Code가 큰 저장소에서 '모든 파일을 한 번에 읽지 않는' 이유로 가장 알맞은 것은?", choices: ["파일 읽기가 금지되어 있어서", "컨텍스트가 한정되어 있고, 불필요한 내용은 품질과 비용에 손해라서", "파일을 읽으면 모델이 바뀌어서", "보안상 읽을 수 없어서"], answer: 1 },
          { type: "ox", q: "환각은 프롬프트를 잘 쓰면 완전히 0으로 만들 수 있다.", answer: false, explain: "줄일 수는 있어도 원리상 완전히 없앨 수는 없습니다. 그래서 검증이 필요해요." }
        ]}
      ]}
    ]
  });
})();
