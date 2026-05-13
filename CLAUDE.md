# FIELDARENA

보험설계사용 고객 관리 모바일 웹앱.

## 아키텍처
브라우저 → Netlify(Next.js) → Render(Spring Boot) → Supabase(PostgreSQL)
- 프론트: 사용자 UI, axios로 REST API 호출
- 백엔드: REST API 제공, JPA로 DB 접근
- 인증/권한 없음 (단일 사용자 가정)

## 구조
- frontend/: Next.js 15 + React 19 + TypeScript (포트 3000)
- backend/:  Spring Boot 3.2 + Java 17 (포트 8080)
- DB: PostgreSQL (로컬) / Supabase (운영)

## 배포
- Netlify: https://cloneinsu.netlify.app
- Render:  https://cloneinsu-backend.onrender.com
- GitHub:  github.com/tjsalswl1004-alt/cloneinsu

## 작업 규칙
- 한국어로 답변
- 테스트 코드: 성공+실패 케이스 모두 작성
- Git 브랜치: feature/, fix/, chore/, refactor/
- 새 기능 시 frontend/backend 각자 CLAUDE.md도 참고
