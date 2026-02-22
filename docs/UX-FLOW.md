# UX Flow Document
## TOEFL Speaking "Listen & Repeat" Practice Service

**Version:** 1.0  
**Last Updated:** 2026-02-22  
**Role:** UX Designer  
**Status:** Draft

---

## 1. 화면 목록 (MVP)

MVP는 **단일 페이지 앱(SPA)**으로 설계되며, 최소 3개의 주요 뷰로 구성됩니다.

### 1.1 Practice Screen (연습 화면)
- **목적**: 핵심 연습 플로우 수행
- **상태**: idle → playing → waiting → beep → recording → analyzing → result
- **주요 컴포넌트**: 
  - 문장 선택 영역
  - 플레이어 컨트롤
  - 상태 표시기
  - 녹음 컨트롤
  - 결과 패널

### 1.2 History Screen (히스토리 화면)
- **목적**: 과거 연습 기록 조회 및 분석
- **주요 컴포넌트**:
  - 연습 기록 리스트
  - 점수 추이 그래프
  - 필터/정렬 옵션
  - 상세 보기 모달

### 1.3 Settings Screen (설정 화면) - Optional for MVP
- **목적**: 마이크 테스트, 데이터 관리
- **주요 컴포넌트**:
  - 마이크 권한 체크
  - 데이터 삭제 버튼
  - 내보내기 옵션

---

## 2. 사용자 플로우

### 2.1 First-Time User Journey

```
앱 접속 
  → 마이크 권한 요청 표시
  → 권한 허용
  → Practice Screen (idle 상태)
  → 샘플 문장 목록 표시
  → 문장 선택
  → [Main Practice Flow 진입]
```

### 2.2 Main Practice Flow (핵심 연습 플로우)

```
Step 1: 문장 선택 (idle)
  사용자가 보는 것:
    - 샘플 문장 목록 (난이도 태그 포함)
    - 각 문장별 최고 점수 표시 (이전 연습 있을 경우)
  사용자가 하는 것:
    - 문장 카드 클릭
    - 문장 텍스트 확인
    - "Play" 버튼 활성화 확인

Step 2: MP3 재생 (playing)
  사용자가 보는 것:
    - 문장 텍스트 표시
    - 재생 중 프로그레스 바
    - "재생 중..." 상태 메시지
  사용자가 하는 것:
    - 집중해서 듣기
    - (자동으로 다음 단계 진행)

Step 3: 대기 시간 (waiting)
  사용자가 보는 것:
    - "Get Ready!" 메시지
    - 3초 카운트다운 (3... 2... 1...)
    - 시각적 타이머 (원형 프로그레스)
  사용자가 하는 것:
    - 준비하기 (입 열고 대기)

Step 4: 비프음 (beep)
  사용자가 보는 것:
    - "Speak Now!" 강조 메시지
    - 🔴 빨간색 강조 효과
  사용자가 듣는 것:
    - "삑" 짧은 비프음
  (자동으로 녹음 시작)

Step 5: 녹음 중 (recording)
  사용자가 보는 것:
    - 🔴 "Recording..." 표시
    - 실시간 파형 또는 음량 인디케이터
    - "Stop" 버튼 (큰 버튼)
  사용자가 하는 것:
    - 문장 따라 말하기
    - 완료 후 "Stop" 버튼 클릭

Step 6: 분석 중 (analyzing)
  사용자가 보는 것:
    - "Analyzing your speech..." 로딩 스피너
    - 진행률 표시 (STT 처리 중)
  사용자가 하는 것:
    - 대기 (2-5초)

Step 7: 결과 확인 (result)
  사용자가 보는 것:
    - 총점 (0~5점, 큰 숫자로 강조)
    - 세부 점수 (Fluency, Intelligibility, Accuracy)
    - 점수 비교 차트 (레이더 차트 또는 바 차트)
    - 피드백 메시지 (구체적 조언)
    - 발화 텍스트 vs 원본 스크립트 비교
  사용자가 하는 것:
    - 결과 확인
    - 선택:
      • "Try Again" → Step 1로 (같은 문장)
      • "Next Sentence" → 다음 문장 선택
      • "View History" → History Screen으로
```

### 2.3 History Review Flow

```
Step 1: History Screen 접근
  사용자가 보는 것:
    - 상단: 통계 요약 (평균 점수, 총 연습 횟수)
    - 리스트: 모든 연습 기록 (최신순)
    - 각 항목: 날짜, 문장 미리보기, 점수
  사용자가 하는 것:
    - 스크롤하여 기록 탐색
    - 특정 항목 클릭

Step 2: 상세 결과 보기
  사용자가 보는 것:
    - 선택한 연습의 전체 평가 내용
    - 점수 breakdown
    - 피드백 메시지
    - 발화 vs 원본 비교
  사용자가 하는 것:
    - "Retry This Sentence" → Practice Screen으로
    - "Back to History" → History Screen으로
```

---

## 3. 화면별 와이어프레임 (텍스트 기반)

### 3.1 Practice Screen - State 1: Idle (문장 선택)

```
┌─────────────────────────────────────────┐
│          TOEFL Repeat Practice          │  ← Header
├─────────────────────────────────────────┤
│  [History] [Settings]                   │  ← Navigation
├─────────────────────────────────────────┤
│                                         │
│  Select a sentence to practice:         │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 🟢 Easy                           │ │
│  │ "The cat sat on the mat."        │ │
│  │ Your best: ★ 4.5                 │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 🟡 Medium                         │ │
│  │ "Climate change affects global..." │ │
│  │ Your best: ★ 3.0                 │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 🔴 Hard                           │ │
│  │ "The implementation of renewable..." │
│  │ Not attempted yet                 │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ... (스크롤 가능)                      │
│                                         │
└─────────────────────────────────────────┘
```

**선택 후:**

```
┌─────────────────────────────────────────┐
│          TOEFL Repeat Practice          │
├─────────────────────────────────────────┤
│  [History] [Settings]                   │
├─────────────────────────────────────────┤
│                                         │
│  Selected Sentence (🟡 Medium):         │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │                                   │ │
│  │  "Climate change affects global  │ │
│  │   weather patterns and requires  │ │
│  │   immediate action."             │ │
│  │                                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Duration: 5 seconds                    │
│  Previous attempts: 3                   │
│  Best score: ★ 3.0                      │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │                                   │ │
│  │         ▶ Play Audio             │ │ ← 큰 버튼
│  │                                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [ Change Sentence ]                    │
│                                         │
└─────────────────────────────────────────┘
```

---

### 3.2 Practice Screen - State 2: Playing

```
┌─────────────────────────────────────────┐
│          TOEFL Repeat Practice          │
├─────────────────────────────────────────┤
│  [History] [Settings]                   │
├─────────────────────────────────────────┤
│                                         │
│  🔊 Playing Audio...                    │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │                                   │ │
│  │  "Climate change affects global  │ │
│  │   weather patterns and requires  │ │
│  │   immediate action."             │ │
│  │                                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │████████░░░░░░░░░░░░░░░░░░░░░░░│   │ ← 프로그레스 바
│  │  3.2s / 5.0s                    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Listen carefully!                      │
│                                         │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

---

### 3.3 Practice Screen - State 3: Waiting (3초 카운트다운)

```
┌─────────────────────────────────────────┐
│          TOEFL Repeat Practice          │
├─────────────────────────────────────────┤
│  [History] [Settings]                   │
├─────────────────────────────────────────┤
│                                         │
│         🎯 Get Ready!                   │
│                                         │
│             ┌─────┐                     │
│             │     │                     │
│             │  2  │  ← 큰 숫자 카운트다운  │
│             │     │                     │
│             └─────┘                     │
│         (원형 타이머 애니메이션)           │
│                                         │
│  Prepare to speak after the beep...     │
│                                         │
│                                         │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

---

### 3.4 Practice Screen - State 4: Beep (0.2초 순간)

```
┌─────────────────────────────────────────┐
│          TOEFL Repeat Practice          │
├─────────────────────────────────────────┤
│  [History] [Settings]                   │
├─────────────────────────────────────────┤
│                                         │
│       🔴 Speak Now! 🔴                  │ ← 빨간색 강조
│                                         │
│             ┌─────┐                     │
│             │     │                     │
│             │ 🔔  │  ← 비프 아이콘        │
│             │     │                     │
│             └─────┘                     │
│         (화면 전체 붉은 테두리)            │
│                                         │
│      ♪ BEEP ♪                           │
│                                         │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

---

### 3.5 Practice Screen - State 5: Recording

```
┌─────────────────────────────────────────┐
│          TOEFL Repeat Practice          │
├─────────────────────────────────────────┤
│  [History] [Settings]                   │
├─────────────────────────────────────────┤
│                                         │
│       🔴 Recording...                   │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │                                   │ │
│  │   ▁▃▅▇█▇▅▃▁ ▁▃▅▇█▇▅▃▁           │ │ ← 실시간 파형
│  │   ▁▃▅▇█▇▅▃▁ ▁▃▅▇█▇▅▃▁           │ │
│  │                                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Duration: 4.2s                         │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │                                   │ │
│  │      ⏹ Stop Recording            │ │ ← 큰 정지 버튼
│  │                                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Speak clearly and naturally            │
│                                         │
└─────────────────────────────────────────┘
```

---

### 3.6 Practice Screen - State 6: Analyzing

```
┌─────────────────────────────────────────┐
│          TOEFL Repeat Practice          │
├─────────────────────────────────────────┤
│  [History] [Settings]                   │
├─────────────────────────────────────────┤
│                                         │
│                                         │
│             ⏳                           │
│                                         │
│     Analyzing your speech...            │
│                                         │
│         [  ●  ●  ●  ]  ← 로딩 스피너    │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │████████████░░░░░░░░░░░░░░░░░░│   │ ← 진행률
│  │  Processing... 75%              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Converting speech to text...           │
│  Evaluating fluency...                  │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

---

### 3.7 Practice Screen - State 7: Result

```
┌─────────────────────────────────────────┐
│          TOEFL Repeat Practice          │
├─────────────────────────────────────────┤
│  [History] [Settings]                   │
├─────────────────────────────────────────┤
│                                         │
│  🎉 Your Score                          │
│                                         │
│         ┌───────┐                       │
│         │       │                       │
│         │  3.5  │  ← 큰 총점             │
│         │ ★★★★☆ │                       │
│         └───────┘                       │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Fluency:         ★★★★☆  4.0      │ │
│  │ Intelligibility: ★★★☆☆  3.0      │ │
│  │ Accuracy:        ★★★★☆  3.5      │ │
│  └───────────────────────────────────┘ │
│                                         │
│  📊 Performance Chart:                  │
│  ┌───────────────────────────────────┐ │
│  │        Fluency                    │ │
│  │           /\                      │ │
│  │          /  \                     │ │ ← 레이더 차트
│  │  Accuracy──Intelligibility        │ │
│  └───────────────────────────────────┘ │
│                                         │
│  💬 Feedback:                           │
│  "Good job! Minor improvements needed.  │
│   Focus on pronunciation clarity."      │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Your speech:                    │   │
│  │ "Climate change affects global  │   │
│  │  weather patterns and requires  │   │
│  │  immediate action"              │   │
│  │                                 │   │
│  │ Original:                       │   │
│  │ "Climate change affects global  │   │
│  │  weather patterns and requires  │   │
│  │  immediate action."             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────┐  ┌─────────────────┐  │
│  │ Try Again  │  │ Next Sentence  │  │
│  └─────────────┘  └─────────────────┘  │
│                                         │
│  [ View History ]                       │
│                                         │
└─────────────────────────────────────────┘
```

---

### 3.8 History Screen

```
┌─────────────────────────────────────────┐
│         Practice History                │
├─────────────────────────────────────────┤
│  [← Back to Practice]                   │
├─────────────────────────────────────────┤
│                                         │
│  📊 Your Statistics                     │
│  ┌───────────────────────────────────┐ │
│  │ Total Attempts: 42                │ │
│  │ Average Score:  3.2 ★★★☆☆        │ │
│  │ Best Score:     4.5 ★★★★★        │ │
│  │ Practice Time:  3h 24min          │ │
│  └───────────────────────────────────┘ │
│                                         │
│  📈 Score Trend (Last 10)               │
│  ┌───────────────────────────────────┐ │
│  │                          ●        │ │
│  │                    ●   ●          │ │
│  │              ●   ●                │ │ ← 선 그래프
│  │        ●   ●                      │ │
│  │  ●   ●                            │ │
│  └───────────────────────────────────┘ │
│                                         │
│  🗂 All Attempts (42)                   │
│  [ Recent ▼ ] [ All Scores ▼ ]         │ ← 필터
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 2026-02-22 10:15                  │ │
│  │ "Climate change affects..."       │ │
│  │ Score: ★★★★☆ 3.5                 │ │
│  │ [View Details]                    │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 2026-02-22 09:48                  │ │
│  │ "The cat sat on the mat."         │ │
│  │ Score: ★★★★★ 4.5                 │ │
│  │ [View Details]                    │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ... (스크롤 가능)                      │
│                                         │
│  [ Export Data ]  [ Clear All ]         │
│                                         │
└─────────────────────────────────────────┘
```

---

## 4. 상태 머신 (State Machine)

### 4.1 상태 다이어그램

```
                    ┌─────────┐
                    │  IDLE   │  ← 초기 상태 / 문장 선택 대기
                    └────┬────┘
                         │ 사용자가 "Play" 클릭
                         ▼
                    ┌─────────┐
                    │ PLAYING │  ← MP3 재생 중
                    └────┬────┘
                         │ MP3 재생 완료 (자동)
                         ▼
                    ┌─────────┐
                    │ WAITING │  ← 3초 카운트다운
                    └────┬────┘
                         │ 3초 경과 (자동)
                         ▼
                    ┌─────────┐
                    │  BEEP   │  ← 비프음 재생 (0.2초)
                    └────┬────┘
                         │ 비프음 종료 (자동)
                         ▼
                   ┌──────────┐
                   │RECORDING │  ← 녹음 중
                   └────┬─────┘
                        │ 사용자가 "Stop" 클릭
                        ▼
                   ┌──────────┐
                   │ANALYZING │  ← STT + 평가 처리 중
                   └────┬─────┘
                        │ 평가 완료 (자동)
                        ▼
                   ┌──────────┐
                   │ RESULT   │  ← 결과 표시
                   └─┬────┬───┘
                     │    │
        ┌────────────┘    └──────────────┐
        │                                 │
    "Try Again"                    "Next Sentence"
        │                                 │
        └──────────► IDLE ◄───────────────┘
                         ▲
                         │
                   "Change Sentence"
```

### 4.2 상태 전이 테이블

| 현재 상태 | 이벤트 | 다음 상태 | 조건 | 액션 |
|----------|-------|----------|------|------|
| IDLE | 문장 선택 | IDLE | - | 선택된 문장 표시, Play 버튼 활성화 |
| IDLE | Play 클릭 | PLAYING | 문장 선택됨 | MP3 재생 시작 |
| PLAYING | MP3 종료 | WAITING | - | 3초 타이머 시작 |
| PLAYING | 에러 | IDLE | MP3 로드 실패 | 에러 메시지 표시 |
| WAITING | 타이머 종료 | BEEP | 3초 경과 | 비프음 재생 |
| BEEP | 비프 종료 | RECORDING | 0.2초 경과 | 녹음 시작, 파형 표시 |
| RECORDING | Stop 클릭 | ANALYZING | - | 녹음 중지, STT 요청 |
| RECORDING | 마이크 에러 | IDLE | 권한 거부 등 | 에러 메시지, 재시도 옵션 |
| ANALYZING | 평가 완료 | RESULT | STT 성공 | 점수 표시 |
| ANALYZING | STT 실패 | IDLE | API 에러 | 에러 메시지, 재시도 권장 |
| RESULT | Try Again | IDLE | - | 같은 문장 유지 |
| RESULT | Next | IDLE | - | 다음 문장 선택 화면 |
| RESULT | View History | HISTORY | - | History Screen 이동 |

### 4.3 상태별 타이머

| 상태 | 자동 전이 시간 | 수동 조작 가능 여부 |
|------|---------------|-------------------|
| IDLE | - | ✅ 사용자가 Play 클릭 필요 |
| PLAYING | MP3 길이 (3~15초) | ❌ 자동 진행 |
| WAITING | 정확히 3초 | ❌ 자동 진행 |
| BEEP | 0.2초 | ❌ 자동 진행 |
| RECORDING | - | ✅ 사용자가 Stop 클릭 필요 |
| ANALYZING | 2~5초 (API 처리) | ❌ 자동 진행 |
| RESULT | - | ✅ 사용자 선택 필요 |

---

## 5. 핵심 인터랙션

### 5.1 비프음 후 녹음 시작까지의 타이밍

**타이밍 플로우:**

```
MP3 재생 완료
    ↓
  (0ms) 3초 타이머 시작
    ↓
(3000ms) 타이머 종료, 비프음 재생
    ↓
 (200ms) 비프음 종료, 녹음 시작
    ↓
  (즉시) 파형 표시 활성화
```

**구현 세부사항:**
- **정확도 목표**: 비프음 종료 → 녹음 시작 지연 < 100ms
- **Web Audio API 활용**: `audioContext.currentTime` 기반 정밀 스케줄링
- **MediaRecorder 사전 준비**: WAITING 상태에서 미리 초기화하여 지연 최소화

**사용자 경험:**
- 비프음이 들리자마자 말할 수 있도록 시각적 "Speak Now!" 메시지 동시 표시
- 화면 테두리 붉은색 플래시 효과로 강한 시각적 신호 제공

---

### 5.2 녹음 중 시각적 피드백

**Option 1: 실시간 파형 (Waveform)**
```
┌─────────────────────────────────┐
│  ▁▃▅▇█▇▅▃▁ ▁▃▅▇█▇▅▃▁          │
│  ▁▃▅▇█▇▅▃▁ ▁▃▅▇█▇▅▃▁          │ ← 실시간 업데이트
└─────────────────────────────────┘
```
- **구현**: Web Audio API `AnalyserNode` 사용
- **업데이트 주기**: 60fps (requestAnimationFrame)
- **장점**: 사용자가 자신의 음성을 실시간으로 확인 가능
- **단점**: CPU 사용량 증가

**Option 2: 간단한 음량 인디케이터**
```
┌─────────────────────────────────┐
│  Volume: [████████░░░░░░] 65%  │
└─────────────────────────────────┘
```
- **구현**: 평균 음량 레벨 계산
- **업데이트 주기**: 10fps
- **장점**: 가벼움, 모든 디바이스에서 부드러운 동작
- **단점**: 덜 화려함

**MVP 권장**: Option 1 (파형) - 더 전문적이고 직관적

**추가 피드백 요소:**
- 🔴 빨간 점 깜빡임 (녹음 중 표시)
- 녹음 시간 카운터 (예: "Recording: 4.2s")
- 화면 테두리 붉은색 유지

---

### 5.3 결과 화면의 정보 구조

**정보 계층 (우선순위 순):**

```
1. 총점 (Total Score)
   - 가장 크고 눈에 띄게 (예: 60px 폰트)
   - 별점 시각화 (★★★★☆)
   
2. 세부 점수 (Dimension Scores)
   - Fluency, Intelligibility, Accuracy
   - 각각 별점 + 숫자 (예: ★★★★☆ 4.0)
   
3. 시각적 차트
   - 레이더 차트 (3개 축) 또는 바 차트
   - 이전 최고 점수와 비교선 표시 (if available)
   
4. 피드백 메시지
   - 총평 (Overall Feedback)
   - 차원별 구체적 조언
   
5. 텍스트 비교
   - 사용자 발화 텍스트
   - 원본 스크립트
   - 차이점 하이라이트 (빠진 단어, 잘못된 단어)
```

**레이아웃 예시 (모바일):**

```
┌─────────────────────────────────────┐
│         총점: 3.5 ★★★★☆            │ ← 큰 강조
├─────────────────────────────────────┤
│ Fluency:         ████░ 4.0          │
│ Intelligibility: ███░░ 3.0          │ ← 바 차트
│ Accuracy:        ████░ 3.5          │
├─────────────────────────────────────┤
│      [레이더 차트 이미지]            │ ← 시각화
├─────────────────────────────────────┤
│ 💬 "Good job! Focus on              │
│     pronunciation clarity."         │ ← 피드백
├─────────────────────────────────────┤
│ You said:                           │
│ "Climate change affects global      │
│  weather patterns and requires      │
│  immediate action"                  │ ← 비교
│                                     │
│ Original:                           │
│ "Climate change affects global      │
│  weather patterns and requires      │
│  immediate action."                 │
│                                     │
│ Missing: "." (period)               │ ← 차이점
└─────────────────────────────────────┘
```

**인터랙션:**
- 차트 터치 시 해당 차원 설명 툴팁 표시
- 텍스트 비교에서 틀린 부분 빨간색 하이라이트
- "Try Again" 버튼: 큰 primary 버튼
- "Next Sentence" 버튼: secondary 버튼

---

### 5.4 에러 핸들링 인터랙션

**마이크 권한 거부:**
```
┌─────────────────────────────────────┐
│  ❌ Microphone Access Denied        │
│                                     │
│  This app needs microphone access   │
│  to record your speech.             │
│                                     │
│  [ Request Permission Again ]       │
│  [ How to Enable? ]                 │
└─────────────────────────────────────┘
```

**STT 실패:**
```
┌─────────────────────────────────────┐
│  ⚠️ Could not analyze your speech   │
│                                     │
│  Please try again. Make sure you    │
│  speak clearly and avoid background │
│  noise.                             │
│                                     │
│  [ Retry ]  [ Cancel ]              │
└─────────────────────────────────────┘
```

**녹음 너무 짧음 (< 1초):**
```
┌─────────────────────────────────────┐
│  ℹ️ Recording too short              │
│                                     │
│  Your recording was only 0.5s.      │
│  Please try to complete the full    │
│  sentence.                          │
│                                     │
│  [ Try Again ]                      │
└─────────────────────────────────────┘
```

---

## 6. 제약 조건 및 설계 원칙

### 6.1 단일 페이지 앱 (SPA) 설계

**라우팅 구조:**
```
/ (root)
  └─ #/practice  ← 기본 화면
  └─ #/history   ← 히스토리 화면
  └─ #/settings  ← 설정 화면 (optional)
```

**컴포넌트 구조:**
```
App
├─ Header (고정)
├─ Router
│  ├─ PracticeView
│  │  ├─ SentenceSelector
│  │  ├─ AudioPlayer
│  │  ├─ RecordingController
│  │  └─ ResultPanel
│  ├─ HistoryView
│  │  ├─ StatsCard
│  │  ├─ TrendChart
│  │  └─ AttemptsList
│  └─ SettingsView
└─ Footer (optional)
```

**상태 관리:**
- 전역 상태: 현재 문장, 연습 기록, 사용자 통계
- 로컬 상태: 현재 플레이어 상태 (idle/playing/recording 등)

---

### 6.2 모바일 우선 설계

**화면 크기 대응:**

| 디바이스 | 최소 너비 | 레이아웃 조정 |
|---------|----------|-------------|
| Mobile | 320px | 단일 컬럼, 세로 스크롤 |
| Tablet | 768px | 여전히 단일 컬럼이나 패딩 증가 |
| Desktop | 1024px | 최대 너비 600px 중앙 정렬 |

**터치 인터랙션:**
- 모든 버튼 최소 크기: 44x44px (Apple HIG 권장)
- 중요 버튼 (Play, Stop): 60x60px 이상
- 스와이프 제스처: History에서 좌우 스와이프로 항목 삭제 (optional)

**성능 최적화:**
- 파형 애니메이션: `requestAnimationFrame` 사용
- 이미지/아이콘: SVG 또는 아이콘 폰트 (작은 파일 크기)
- 레이지 로딩: History 리스트 가상 스크롤 (100+ 항목 시)

---

### 6.3 shadcn/ui 컴포넌트 활용

**추천 컴포넌트 매핑:**

| 화면 요소 | shadcn/ui 컴포넌트 |
|----------|-------------------|
| 문장 선택 카드 | `Card`, `CardHeader`, `CardContent` |
| Play 버튼 | `Button` (variant="default", size="lg") |
| Stop 버튼 | `Button` (variant="destructive", size="lg") |
| 점수 표시 | `Badge`, `Progress` |
| 피드백 메시지 | `Alert`, `AlertDescription` |
| 히스토리 리스트 | `Card` + `ScrollArea` |
| 차트 | `recharts` 라이브러리 (shadcn 호환) |
| 설정 토글 | `Switch` |
| 모달 (상세보기) | `Dialog`, `DialogContent` |
| 로딩 스피너 | Custom spinner (shadcn에 없음, 직접 구현) |

**색상 테마:**
- Primary: 브랜드 색상 (예: 파란색 #3b82f6)
- Destructive: 빨간색 (녹음 중 표시 #ef4444)
- Success: 초록색 (높은 점수 표시 #22c55e)
- Muted: 회색 (비활성 상태 #6b7280)

---

### 6.4 접근성 (Accessibility)

**키보드 내비게이션:**
- `Tab`: 다음 요소로 포커스 이동
- `Enter/Space`: 버튼 활성화 (Play, Stop)
- `Esc`: 모달 닫기

**ARIA 라벨:**
```html
<button aria-label="Play audio sample">▶</button>
<div role="status" aria-live="polite">Recording...</div>
<progress aria-label="Audio playback progress" value="3.2" max="5.0"></progress>
```

**시각적 보조:**
- 색맹 대응: 색상만으로 정보 전달 X (아이콘/텍스트 병기)
- 고대비 모드: 배경과 텍스트 명도 대비 4.5:1 이상
- 포커스 표시: 키보드 포커스 시 명확한 테두리

**청각 보조:**
- 비프음: 시각적 신호도 동시 제공 (화면 플래시, "Speak Now!" 텍스트)
- 오디오 재생: 재생 중임을 나타내는 프로그레스 바

---

## 7. 개발 우선순위

### Phase 1: 핵심 플로우 (주 1-2)
1. ✅ 문장 선택 화면 (IDLE)
2. ✅ MP3 재생 (PLAYING)
3. ✅ 3초 대기 + 비프음 (WAITING → BEEP)
4. ✅ 녹음 (RECORDING)
5. ✅ 결과 표시 (RESULT) - 더미 점수

### Phase 2: 평가 시스템 (주 3-4)
1. ✅ STT 연동 (Web Speech API 우선)
2. ✅ 평가 알고리즘 구현
3. ✅ 피드백 생성 로직
4. ✅ 점수 계산 검증

### Phase 3: 히스토리 & UI (주 5-6)
1. ✅ localStorage 저장/로드
2. ✅ History 화면 구현
3. ✅ 통계 차트 추가
4. ✅ UI 폴리싱 (애니메이션, 트랜지션)

### Phase 4: 테스트 & 최적화 (주 7-8)
1. ✅ 크로스 브라우저 테스트
2. ✅ 모바일 디바이스 테스트
3. ✅ 성능 최적화
4. ✅ 에러 핸들링 완성

---

## 8. 참고 자료

**디자인 영감:**
- Duolingo (언어 학습 앱의 UX 참고)
- IELTS Speaking Practice Apps (유사 평가 앱)
- Voice Memos (iOS) - 녹음 UI 참고

**기술 레퍼런스:**
- Web Audio API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- MediaRecorder: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
- shadcn/ui: https://ui.shadcn.com/
- Recharts: https://recharts.org/

---

**Document End**

이 UX 플로우 문서를 기반으로 개발자는 바로 구현을 시작할 수 있습니다. 각 상태의 시각적 표현, 전이 조건, 사용자 인터랙션이 명확하게 정의되어 있습니다.
