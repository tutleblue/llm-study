/* 코스 뼈대. 주차 내용은 content/wNN.js 가 registerWeek()로 채운다. */
window.COURSE = {
  version: "0.2.0",
  weeks: [
    { id: "w01", title: "LLM은 어떻게 동작하나", part: "1부 기초" },
    { id: "w02", title: "프롬프트 엔지니어링 기본", part: "1부 기초" },
    { id: "w03", title: "프롬프트 엔지니어링 심화", part: "1부 기초" },
    { id: "w04", title: "평가(Evals)", part: "1부 기초" },
    { id: "w05", title: "바이브코딩 실전", part: "2부 바이브코딩·스킬" },
    { id: "w06", title: "Agent Skills와 최신 트렌드", part: "2부 바이브코딩·스킬" },
    { id: "w07", title: "도구 사용과 RAG", part: "3부 앱·에이전트" },
    { id: "w08", title: "MCP", part: "3부 앱·에이전트" },
    { id: "w09", title: "에이전트 설계", part: "3부 앱·에이전트" },
    { id: "w10", title: "LLM으로 멋진 웹 만들기", part: "3부 앱·에이전트" },
    { id: "w11", title: "딥테크 ① 모델", part: "4부 딥테크" },
    { id: "w12", title: "딥테크 ② 인프라", part: "4부 딥테크" },
    { id: "w13", title: "운영·보안 + 잡지식 총정리", part: "5부 운영·캡스톤" },
    { id: "w14", title: "트렌드 따라가기 + 캡스톤", part: "5부 운영·캡스톤" }
  ]
};
window.registerWeek = function (data) {
  var w = window.COURSE.weeks.filter(function (x) { return x.id === data.id; })[0];
  if (!w) return;
  w.days = data.days;
  w.summary = data.summary || "";
};
