# Backend

Spring Boot 3.2.5 + Java 17 + JPA/Hibernate + Gradle 8.5.

## 명령어
- `.\gradlew bootRun` — 개발 서버 (포트 8080)
- `.\gradlew build` — JAR 빌드 (build/libs/)
- `.\gradlew test` — JUnit 테스트

## 패키지 구조 (`com.cloneinsu`)
- `controller/`  REST API 엔드포인트
- `service/`     비즈니스 로직 (트랜잭션 관리)
- `repository/`  JPA Repository 인터페이스
- `entity/`      JPA 엔티티 (테이블 매핑)
- `dto/`         요청/응답 DTO

## 데이터 모델 (6 테이블)
- `customers`            고객 (피보험자) — `id_front + id_back`으로 unique 식별
- `claims`               청구 본체 — customer_id, insurance_company_id FK
- `insurance_companies`  보험사 (56개 시드)
- `claim_accounts`       계좌 정보 (OneToOne with Claim, CASCADE)
- `claim_signatures`     서명 (OneToOne with Claim, CASCADE)
- `attachments`          첨부파일 메타데이터 (OneToMany)

## ClaimStatus (enum)
- `DRAFT` 임시저장 / `SENT` 발송완료 / `FAILED` 발송실패 / `PAID` 지급완료

## DTO 패턴
- `ClaimRequest`: 입력 — 평탄화된 모든 폼 필드
- `ClaimResponse`: 출력 — 중첩 구조 (customer, insuranceCompany, account, signature)
- 새 필드 추가 시 양쪽 다 업데이트 필요

## API 엔드포인트
- `GET /api/claims` (status 필터 가능)
- `GET /api/claims/stats` 통계
- `GET /api/claims/{id}`
- `POST /api/claims` 청구 생성
- `PUT /api/claims/{id}` 청구 수정
- `DELETE /api/claims/{id}`
- `GET /api/insurance-companies` (category 필터)
- `GET /api/customers`

## CORS
- 모든 컨트롤러에 `@CrossOrigin(origins = {...})` 필수
- 허용 origin: `http://localhost:3000`, `http://localhost:3001`, `https://cloneinsu.netlify.app`
- 새 컨트롤러 만들 때 잊지 말 것 (잊으면 프론트에서 호출 실패)

## 데이터베이스
- 로컬: PostgreSQL (localhost:5432, db=cloneinsu)
- 운영: Supabase (Session Pooler, IPv4 호환)
- `ddl-auto: update` (엔티티 변경 시 자동 갱신)
- `show-sql: true` (SQL 로그 출력)

## 환경변수 (`application.yml`)
- `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`
- `PORT` (Render가 자동 주입)
- 패턴: `${VAR_NAME:기본값}` — 로컬에선 기본값, 운영에선 env 사용

## 시드 데이터
- `DataInitializer` (ApplicationRunner + @Transactional)
- 서버 첫 실행 시 `insurance_companies` 테이블에 56개 자동 insert
  - 손해보험 20 / 생명보험 23 / 배상책임 13
- `seedIfEmpty()` 사용 — 이미 데이터 있으면 skip

## Service 패턴
- `@Service` 어노테이션
- `@Transactional` — DB 변경 메서드에 사용 (createClaim, updateClaim)
- `@RequiredArgsConstructor` (Lombok) — 생성자 주입
- `CustomerService.findOrCreate()` — 주민번호로 중복 확인 후 신규 생성

## Repository 패턴
- `JpaRepository<Entity, ID>` 상속
- 메서드 이름 기반 자동 쿼리 생성:
  - `findByStatusOrderByCreatedAtDesc(status)` → SELECT ... WHERE status = ? ORDER BY created_at DESC
  - `countByStatus(status)` → COUNT 쿼리

## Lombok
- `@Getter`, `@Setter`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`
- `@RequiredArgsConstructor` — 의존성 주입용

## 자주 하는 실수
- 새 컨트롤러에 `@CrossOrigin` 안 붙임 → 프론트 CORS 에러
- `@Transactional` 빠뜨림 → 데이터 일관성 깨짐
- DTO 변환 안 함 → 엔티티 직접 노출 (순환 참조 위험)
- Entity 변경 후 ddl-auto가 자동 갱신 — 그래도 운영 DB는 신중히

## 배포 (Render)
- `backend/Dockerfile` — gradle:8.5-jdk17 + eclipse-temurin:17-jre 2단계 빌드
- 빌드 명령: `RUN gradle bootJar -x test --no-daemon`
- 실행: `CMD ["java", "-jar", "app.jar"]`
- Free 플랜: 15분 idle 후 sleep (첫 응답 30~50초)
