# 회복탄력성 자가진단 (20문항)

감정조절력 · 충동통제/끈기 · 원인분석/문제해결 · 관계/공감 · 긍정성/의미, 5개 영역 × 4문항의 자기점검 도구입니다.

- 응답: 5점 리커트(1 전혀 그렇지 않다 ~ 5 매우 그렇다), 역채점 문항 4개(6, 7, 17, 19번)
- 점수: 영역별 4~20점, 총점 20~100점
- 수준: 85+ 매우 높음 / 70–84 높음 / 55–69 보통 / 54 이하 노력 필요
- 저장: Supabase `public.resilience_responses` (RLS: 익명 insert만 허용, 조회는 집계 함수 `get_resilience_stats()`로만)

참고한 척도: 김주환(2011) KRQ-53, Reivich & Shatté RQ/RFI, Connor-Davidson CD-RISC, Smith et al.(2008) BRS.
문항은 해당 척도의 구성요인을 참고해 새로 작성했으며, 표준화된 심리검사가 아닙니다.

## 배포

`main` 브랜치에 푸시하면 Vercel이 자동으로 프로덕션 배포합니다 → https://resilience-test-phi.vercel.app
