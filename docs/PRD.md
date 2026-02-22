# Product Requirements Document (PRD)
## TOEFL Speaking "Listen & Repeat" Practice Service

**Version:** 1.0  
**Last Updated:** 2026-02-22  
**Product Manager:** [Your Name]  
**Status:** Draft

---

## 1. Problem Statement

### Background
2026년 TOEFL 시험 개편으로 Speaking Section에 새로운 "Listen & Repeat" 문제 유형이 도입되었습니다. 이는 기존의 의견 제시·논리 전개 중심 문제와 달리, **청각 기억력, 발음 정밀도, 즉각 반응력**을 평가하는 새로운 형태의 문제입니다.

### Current Pain Points
- **연습 도구 부재**: 기존 토플 학습 플랫폼들은 아직 이 새로운 유형을 지원하지 않음
- **즉각적인 피드백 부족**: 학습자들이 자신의 발음·유창성·정확도를 객관적으로 평가받기 어려움
- **실전 시뮬레이션 부족**: 실제 시험 환경(MP3 재생 → 대기 → 비프음 → 녹음)을 경험할 기회 없음
- **진도 추적 어려움**: 반복 연습을 통한 성장 과정을 측정하기 힘듦

### Target Problem
**"2026 TOEFL 준비생들이 Listen & Repeat 유형을 효과적으로 연습하고, 즉각적인 피드백을 통해 실전 능력을 향상시킬 수 있는 도구가 없다"**

---

## 2. User Stories

### Primary User: TOEFL 준비생 (수험생)

#### As a TOEFL test-taker, I want to...

**Core Practice Flow**
- **실전 환경 연습**: 실제 시험과 동일한 타이밍(MP3 재생 → 3초 대기 → 비프음 → 녹음)으로 연습하고 싶다
- **즉시 피드백**: 내 답변이 얼마나 정확한지, 유창한지, 명료한지 즉시 확인하고 싶다
- **반복 연습**: 같은 문장을 여러 번 연습하면서 점수 개선을 확인하고 싶다

**Self-Assessment & Improvement**
- **약점 파악**: 내가 자주 틀리는 발음이나 단어 패턴을 알고 싶다
- **성장 추적**: 시간에 따른 전반적인 성적 향상을 시각적으로 확인하고 싶다
- **목표 설정**: 특정 점수(예: 평균 4점 이상)에 도달하기 위한 진척도를 보고 싶다

**Convenience & Accessibility**
- **모바일 접근**: 이동 중에도 간편하게 연습하고 싶다
- **오프라인 저장**: 인터넷 없이도 이전 평가 기록을 확인하고 싶다
- **빠른 시작**: 회원가입 없이 바로 연습을 시작하고 싶다

### Secondary User: 영어 학습자

- **발음 교정**: 네이티브 발음을 듣고 따라하며 발음을 개선하고 싶다
- **듣기 연습**: 빠른 속도의 영어를 정확히 듣고 이해하고 싶다
- **스피킹 자신감**: 즉각적인 응답 훈련을 통해 영어 말하기 자신감을 높이고 싶다

---

## 3. Feature Requirements (MVP)

### 3.1 Core Features (Must-Have)

#### F1: Listen & Repeat Exercise Flow
**Priority:** P0 (Critical)

**Description:**  
실제 TOEFL 시험 환경을 시뮬레이션하는 핵심 연습 기능

**Functional Requirements:**
- **FR1.1**: MP3 파일 재생 버튼 제공 (Play 아이콘)
- **FR1.2**: MP3 재생 완료 후 정확히 3초 대기 (카운트다운 표시)
- **FR1.3**: 비프음(beep sound) 재생 (Web Audio API 활용)
- **FR1.4**: 비프음 직후 자동 녹음 시작 (사용자 명시적 조작 없이)
- **FR1.5**: 녹음 중 시각적 피드백 (파형 또는 녹음 중 표시)
- **FR1.6**: 녹음 중지 버튼 제공 (사용자가 발화 완료 후 클릭)
- **FR1.7**: 녹음 실패 시 재시도 옵션 제공

**Technical Acceptance Criteria:**
- MP3 재생과 녹음 사이 타이밍 오차 < 100ms
- 모든 주요 브라우저에서 MediaRecorder API 지원 확인
- 마이크 권한 요청 및 거부 시 에러 핸들링

---

#### F2: Real-time Evaluation System
**Priority:** P0 (Critical)

**Description:**  
녹음 완료 즉시 3가지 차원에서 자동 평가 제공

**Functional Requirements:**
- **FR2.1**: 음성을 텍스트로 변환 (Whisper API 또는 Web Speech API)
- **FR2.2**: 원본 스크립트와 사용자 발화 비교
- **FR2.3**: 3가지 평가 차원별 점수 계산 (각 0~5점)
  - **Fluency (유창성)**
  - **Intelligibility (명료성)**
  - **Repeat Accuracy (정확도)**
- **FR2.4**: 총점 계산 (0~5점 스케일)
- **FR2.5**: 평가 결과 시각화 (차트, 점수 표시)
- **FR2.6**: 구체적인 피드백 메시지 제공

**Evaluation Logic (Detailed in Section 5):**
- **Fluency**: 첫 발화 지연 시간, 중간 멈춤 횟수·길이, 속도 일정성
- **Intelligibility**: 음소 정확도, 강세 패턴, 억양 자연스러움
- **Accuracy**: 내용어(content words) 정확도, 단어 순서, 의미 보존

**Technical Acceptance Criteria:**
- STT 처리 시간 < 3초 (일반 문장 기준)
- 평가 결과 표시까지 총 처리 시간 < 5초
- 평가 알고리즘 일관성 테스트 통과 (동일 입력 → 동일 출력)

---

#### F3: Practice History & Analytics
**Priority:** P0 (Critical)

**Description:**  
모든 연습 기록을 저장하고 진척도를 시각화

**Functional Requirements:**
- **FR3.1**: 각 연습 세션 저장 (문장, 녹음, 점수, 타임스탬프)
- **FR3.2**: 평가 히스토리 목록 조회 (최신순)
- **FR3.3**: 문장별 연습 횟수 및 최고 점수 표시
- **FR3.4**: 시간에 따른 점수 추이 그래프
- **FR3.5**: 평균 점수 통계 (전체, 최근 10회, 최근 30일)
- **FR3.6**: 개별 평가 항목별 강점/약점 분석

**Data Storage:**
- localStorage를 활용한 클라이언트 사이드 저장
- JSON 형식으로 구조화된 데이터 저장
- 최대 저장 용량 고려 (오래된 기록 자동 정리 옵션)

**Technical Acceptance Criteria:**
- 100개 이상의 연습 기록 저장 가능
- 히스토리 조회 성능 < 1초
- 데이터 손실 방지 (에러 발생 시 복구 가능)

---

### 3.2 Secondary Features (Nice-to-Have)

#### F4: Sample Sentence Library
**Priority:** P1 (High)

- 다양한 난이도의 샘플 문장 제공 (Easy, Medium, Hard)
- 주제별 카테고리 (Academic, Daily Life, Science, etc.)
- 각 문장에 대한 원본 MP3 및 스크립트 포함

#### F5: Playback & Review
**Priority:** P2 (Medium)

- 녹음된 내 음성 재생 기능
- 원본 MP3와 내 녹음 비교 청취
- 느린 속도 재생 옵션

#### F6: Progress Goals
**Priority:** P2 (Medium)

- 목표 설정 (예: "이번 주 평균 4.0점 달성")
- 목표 달성률 표시
- 연습 스트릭 (연속 학습 일수)

---

## 4. User Flow (Step by Step)

### Main Practice Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        Initial Load                          │
│  - 웹 페이지 접속                                              │
│  - 마이크 권한 요청                                            │
│  - 샘플 문장 목록 표시 (또는 기본 문장 제공)                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Step 1: Select Sentence                     │
│  - 사용자가 연습할 문장 선택                                    │
│  - 문장 텍스트 표시 (선택적: 숨김 모드 제공)                    │
│  - "Play" 버튼 활성화                                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Step 2: Play MP3                            │
│  - 사용자가 "Play" 버튼 클릭                                   │
│  - MP3 파일 재생 시작                                         │
│  - 재생 중 시각적 표시 (프로그레스 바)                          │
│  - 재생 완료 감지                                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Step 3: Wait Period                         │
│  - 3초 카운트다운 시작 (3... 2... 1...)                        │
│  - 화면에 "Get Ready" 메시지 표시                              │
│  - 사용자 준비 시간                                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Step 4: Beep Sound                          │
│  - "삑" 비프음 재생 (짧고 명확한 신호음)                        │
│  - 화면에 "Speak Now!" 표시                                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Step 5: Auto-Start Recording                    │
│  - 비프음 직후 자동으로 녹음 시작                               │
│  - 녹음 중 표시 (빨간 점 또는 파형)                            │
│  - "Stop Recording" 버튼 표시                                 │
│  - 사용자가 문장 따라 말하기                                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Step 6: Stop Recording                          │
│  - 사용자가 "Stop Recording" 버튼 클릭                         │
│  - 녹음 중지 및 오디오 데이터 저장                              │
│  - "Analyzing..." 로딩 표시                                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│            Step 7: Speech-to-Text Conversion                 │
│  - 녹음된 오디오를 Whisper API 또는 Web Speech API로 전송      │
│  - 음성을 텍스트로 변환                                        │
│  - 변환 결과 검증                                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                Step 8: Evaluation                            │
│  - 원본 스크립트와 STT 결과 비교                               │
│  - Fluency, Intelligibility, Accuracy 각각 평가               │
│  - 총점 계산 (0~5점)                                          │
│  - 피드백 메시지 생성                                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Step 9: Display Results                         │
│  - 점수 표시 (Fluency, Intelligibility, Accuracy, Total)     │
│  - 시각적 차트 (레이더 차트 또는 바 차트)                       │
│  - 구체적인 피드백 메시지                                      │
│  - 사용자 발화 텍스트 vs 원본 스크립트 비교 표시                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                Step 10: Save & Next                          │
│  - 평가 결과를 localStorage에 저장                            │
│  - 옵션 제공:                                                 │
│    • "Try Again" (같은 문장 재도전)                           │
│    • "Next Sentence" (다음 문장으로)                          │
│    • "View History" (전체 평가 히스토리 보기)                  │
└─────────────────────────────────────────────────────────────┘
```

### Alternative Flow: Review History

```
┌─────────────────────────────────────────────────────────────┐
│              Access History Page                             │
│  - 네비게이션에서 "History" 클릭                               │
│  - localStorage에서 저장된 데이터 로드                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Display History List                            │
│  - 모든 연습 기록 표시 (최신순)                                │
│  - 각 항목: 날짜, 문장, 점수, 상세보기 버튼                     │
│  - 필터/정렬 옵션 (날짜별, 점수별)                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              View Detailed Result                            │
│  - 특정 평가 클릭 시 상세 정보 표시                            │
│  - 점수 breakdown, 피드백, 비교 텍스트                         │
│  - 녹음 재생 옵션 (if available)                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Evaluation Criteria (채점 기준 상세)

### 5.1 Overall Scoring Framework

- **Score Range**: 0~5 points (0.5 increments allowed)
- **Scoring Philosophy**: 
  - **NOT speed-based**: 빠르게 말하는 것이 아니라 정확하고 명료하게 말하는 것에 보상
  - **Memory + Precision + Reaction**: 청각 기억력, 발음 정밀도, 즉각 반응력의 균형 평가
  - **Holistic**: 3가지 차원을 종합적으로 고려

### 5.2 Dimension 1: Fluency (유창성) - 33.3%

**Definition:**  
비프음 이후 빠르게 시작하고, 긴 멈춤이나 재시작 없이 안정적인 리듬을 유지하는 능력

**Evaluation Metrics:**

| Metric | Description | Measurement |
|--------|-------------|-------------|
| **Response Latency** | 비프음 후 첫 발화까지 시간 | < 0.5초: 5점<br>0.5~1초: 4점<br>1~2초: 3점<br>2~3초: 2점<br>> 3초: 0~1점 |
| **Pause Frequency** | 중간 멈춤 횟수 | 없음: 5점<br>1회 짧은 멈춤: 4점<br>2회 이상 또는 1회 긴 멈춤: 2~3점<br>빈번한 멈춤: 0~1점 |
| **Speech Rate Consistency** | 말하기 속도의 일정함 | 일정한 템포 유지: 5점<br>약간의 속도 변화: 3~4점<br>매우 불규칙: 0~2점 |
| **Restarts/Corrections** | 재시작 또는 자기 수정 횟수 | 없음: 5점<br>1회: 3점<br>2회 이상: 0~2점 |

**Scoring Algorithm:**
```
fluency_score = (
    response_latency_score * 0.3 +
    pause_score * 0.3 +
    consistency_score * 0.2 +
    restart_score * 0.2
)
```

**Examples:**
- **5점**: 비프음 즉시 시작, 멈춤 없이 자연스러운 속도로 완료
- **3점**: 0.8초 후 시작, 1회 짧은 멈춤 있으나 전반적으로 안정적
- **1점**: 2초 후 시작, 여러 번 멈추고 재시작

---

### 5.2 Dimension 2: Intelligibility (명료성) - 33.3%

**Definition:**  
자음과 모음이 명확하고, 리스너가 모든 단어를 알아들을 수 있는 정도

**Evaluation Metrics:**

| Metric | Description | Measurement |
|--------|-------------|-------------|
| **Phoneme Accuracy** | 개별 음소의 정확성 | STT 신뢰도 점수 기반<br>모든 음소 명확: 5점<br>일부 불명확: 2~4점<br>대부분 불명확: 0~1점 |
| **Word Clarity** | 단어 경계의 명확성 | STT가 단어를 정확히 분리: 5점<br>일부 단어 뭉개짐: 2~4점<br>대부분 불명확: 0~1점 |
| **Stress & Intonation** | 강세와 억양의 자연스러움 | 자연스러운 영어 리듬: 5점<br>평평하거나 부자연스러움: 2~3점<br>이해 방해 수준: 0~1점 |
| **Volume & Articulation** | 음량과 발음의 명확성 | 적절한 음량, 또렷한 발음: 5점<br>너무 작거나 큼, 웅얼거림: 1~3점 |

**Scoring Algorithm:**
```
intelligibility_score = (
    phoneme_accuracy * 0.4 +
    word_clarity * 0.3 +
    stress_intonation * 0.2 +
    volume_articulation * 0.1
)
```

**Technical Implementation:**
- STT API의 confidence score 활용
- 오디오 파형 분석 (음량, 피치 변화)
- 음소 레벨 비교 (if possible with advanced STT)

**Examples:**
- **5점**: 모든 단어가 명확하게 들리고, 자연스러운 영어 억양
- **3점**: 대부분 알아들을 수 있으나 일부 자음이 불명확
- **1점**: 여러 단어가 뭉개져서 이해하기 어려움

---

### 5.3 Dimension 3: Repeat Accuracy (정확도) - 33.3%

**Definition:**  
내용어(content words)를 정확하게, 올바른 순서로, 의미 변경 없이 따라 말하는 능력

**Evaluation Metrics:**

| Metric | Description | Measurement |
|--------|-------------|-------------|
| **Content Word Accuracy** | 주요 의미 단어의 정확성 | 모든 내용어 일치: 5점<br>1개 누락/오류: 3~4점<br>2개 이상: 1~2점<br>대부분 틀림: 0점 |
| **Word Order** | 단어 순서의 정확성 | 정확한 순서: 5점<br>1~2개 순서 틀림: 2~3점<br>대부분 틀림: 0~1점 |
| **Function Words** | 관사, 전치사 등 기능어 | 모두 일치: 5점<br>일부 누락 허용: 3~4점 |
| **Meaning Preservation** | 전체 의미 보존 여부 | 의미 동일: 5점<br>약간 다름: 2~3점<br>완전히 다름: 0점 |

**Content Words vs Function Words:**
- **Content Words** (가중치 높음): 명사, 동사, 형용사, 부사
- **Function Words** (가중치 낮음): 관사(a, the), 전치사(in, on), 접속사(and, but)

**Scoring Algorithm:**
```
# 1. Extract content words from original script
content_words_orig = extract_content_words(original_script)
content_words_user = extract_content_words(user_transcript)

# 2. Calculate metrics
content_accuracy = calculate_word_match(content_words_orig, content_words_user)
order_score = calculate_sequence_similarity(original_script, user_transcript)
function_score = calculate_function_word_match(original_script, user_transcript)
meaning_score = semantic_similarity(original_script, user_transcript)

# 3. Weighted average
accuracy_score = (
    content_accuracy * 0.4 +
    order_score * 0.3 +
    meaning_score * 0.2 +
    function_score * 0.1
)
```

**Examples:**

| Original | User Speech | Content Acc | Order | Meaning | Score |
|----------|-------------|-------------|-------|---------|-------|
| "The cat sat on the mat" | "The cat sat on the mat" | 100% | 100% | 100% | 5.0 |
| "The cat sat on the mat" | "Cat sat on mat" | 100% | 100% | 100% | 4.5 |
| "The cat sat on the mat" | "The cat on the mat sat" | 100% | 60% | 90% | 3.5 |
| "The cat sat on the mat" | "The dog sat on the mat" | 80% | 100% | 70% | 3.0 |

---

### 5.4 Total Score Calculation

```
total_score = (
    fluency_score * 0.33 +
    intelligibility_score * 0.33 +
    accuracy_score * 0.34
)

# Round to nearest 0.5
total_score = round(total_score * 2) / 2
```

### 5.5 Feedback Generation Logic

Based on the total score, provide contextual feedback:

| Score Range | Overall Feedback | Action Items |
|-------------|------------------|--------------|
| 4.5 ~ 5.0 | "Excellent! Near-perfect repetition." | "Try harder sentences to challenge yourself." |
| 3.5 ~ 4.0 | "Good job! Minor improvements needed." | "Focus on [weakest dimension]" |
| 2.5 ~ 3.0 | "Fair attempt. Several areas need work." | "Practice: pause reduction, pronunciation clarity" |
| 1.5 ~ 2.0 | "Needs improvement. Keep practicing." | "Start with slower/shorter sentences" |
| 0.0 ~ 1.0 | "Difficult attempt. Don't give up!" | "Listen multiple times before speaking" |

**Dimension-Specific Feedback:**
- **Low Fluency**: "Try to start speaking immediately after the beep. Reduce pauses between words."
- **Low Intelligibility**: "Focus on clear pronunciation. Slow down if needed for clarity."
- **Low Accuracy**: "Listen more carefully to content words. Try to remember the exact sentence."

---

## 6. Data Model

### 6.1 Sentence Object
```typescript
interface Sentence {
  id: string;                    // Unique identifier
  text: string;                  // Original script
  audioUrl: string;              // MP3 file path/URL
  difficulty: 'easy' | 'medium' | 'hard';
  category?: string;             // Optional: topic category
  wordCount: number;             // Number of words
  contentWords: string[];        // Extracted content words
  duration: number;              // MP3 duration in seconds
  createdAt: Date;
}
```

### 6.2 Practice Attempt Object
```typescript
interface PracticeAttempt {
  id: string;                    // Unique attempt ID
  sentenceId: string;            // Reference to Sentence
  timestamp: Date;               // When the attempt was made
  
  // Audio data
  recordingBlob?: Blob;          // User's audio recording (optional, may not persist)
  recordingDuration: number;     // Duration in seconds
  
  // Transcription
  userTranscript: string;        // STT result
  sttConfidence?: number;        // STT API confidence score
  
  // Timing metrics
  responseLatency: number;       // Time from beep to first speech (ms)
  totalSpeechTime: number;       // Total speaking duration (ms)
  
  // Evaluation results
  scores: {
    fluency: number;             // 0~5
    intelligibility: number;     // 0~5
    accuracy: number;            // 0~5
    total: number;               // 0~5
  };
  
  // Detailed metrics (for analytics)
  metrics: {
    pauseCount: number;
    restartCount: number;
    contentWordMatches: number;
    contentWordTotal: number;
    functionWordMatches: number;
    wordOrderAccuracy: number;   // 0~1
  };
  
  // Feedback
  feedback: {
    overall: string;
    fluency: string;
    intelligibility: string;
    accuracy: string;
    actionItems: string[];
  };
}
```

### 6.3 User Statistics (Aggregate)
```typescript
interface UserStatistics {
  totalAttempts: number;
  totalPracticeTime: number;        // in seconds
  averageScore: number;
  
  // Score breakdowns
  averageFluency: number;
  averageIntelligibility: number;
  averageAccuracy: number;
  
  // Best performance
  bestScore: number;
  bestAttemptId: string;
  
  // Trends (last 30 days)
  recentTrend: 'improving' | 'stable' | 'declining';
  
  // Practice patterns
  mostPracticedSentenceId: string;
  favoriteCategory?: string;
  
  // Timestamps
  firstAttemptDate: Date;
  lastAttemptDate: Date;
}
```

### 6.4 LocalStorage Schema

```typescript
// Key: 'toefl-repeat-attempts'
// Value: Array<PracticeAttempt>

// Key: 'toefl-repeat-stats'
// Value: UserStatistics

// Key: 'toefl-repeat-sentences'
// Value: Array<Sentence>
```

**Storage Management:**
- Maximum attempts stored: 500 (configurable)
- Auto-cleanup: Remove oldest attempts when limit exceeded
- Export/Import functionality for backup

---

## 7. Technical Constraints

### 7.1 Browser Requirements

**Minimum Supported Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Required APIs:**
- ✅ Web Audio API (for MP3 playback & beep sound)
- ✅ MediaRecorder API (for audio recording)
- ✅ MediaDevices.getUserMedia() (microphone access)
- ⚠️ Web Speech API (fallback: Whisper API)

**Known Limitations:**
- **iOS Safari**: MediaRecorder support limited; may require polyfill or Whisper API
- **Older browsers**: No support for MediaRecorder; must use server-side solution

### 7.2 Performance Requirements

| Metric | Target | Maximum |
|--------|--------|---------|
| Page Load Time | < 2s | < 3s |
| MP3 Playback Start | < 200ms | < 500ms |
| Recording Start (after beep) | < 100ms | < 200ms |
| STT Processing Time | < 2s | < 5s |
| Total Feedback Display Time | < 3s | < 7s |
| History Page Load | < 500ms | < 1s |

### 7.3 Audio Constraints

**Recording Quality:**
- Sample Rate: 16kHz or higher (optimal for STT)
- Bit Depth: 16-bit
- Channels: Mono (sufficient for speech)
- Format: WebM (Chrome/Firefox) or MP4 (Safari)

**MP3 Requirements:**
- Sample sentences: 16-44.1kHz, mono/stereo
- Duration: 3~15 seconds per sentence
- File size: < 500KB per file

**Beep Sound:**
- Duration: 200ms
- Frequency: 800Hz (clear, attention-grabbing)
- Volume: Moderate (not jarring)

### 7.4 STT API Constraints

**Option 1: Web Speech API**
- ✅ Free, client-side
- ✅ Real-time processing
- ❌ Limited browser support
- ❌ Less accurate for non-native speakers
- ❌ No confidence scores in some browsers

**Option 2: OpenAI Whisper API**
- ✅ High accuracy
- ✅ Confidence scores available
- ✅ Works on all browsers
- ❌ Requires API key & billing
- ❌ Network dependency
- ❌ ~1-3s latency

**Recommendation:**
- **MVP**: Start with Web Speech API (fallback to Whisper if unsupported)
- **Production**: Offer Whisper as premium option for better accuracy

### 7.5 Data Storage Constraints

**LocalStorage Limits:**
- Typical limit: 5-10MB per domain
- Each PracticeAttempt: ~2KB (without audio blob)
- Estimated capacity: ~2,500 attempts (with metadata only)

**Workaround for Large Data:**
- Don't store audio blobs in localStorage (too large)
- Offer "Download Recording" option for users to save locally
- Periodic export to JSON file for backup

### 7.6 Accessibility Requirements

- ✅ Keyboard navigation support
- ✅ Screen reader friendly (ARIA labels)
- ✅ Visual indicators for audio events (for hearing-impaired users)
- ✅ Adjustable text size
- ✅ High contrast mode support

### 7.7 Security & Privacy

- ✅ No server-side storage of audio (privacy-first)
- ✅ Microphone permission explicit request
- ✅ Clear data deletion option
- ✅ No tracking/analytics without consent
- ⚠️ If using Whisper API: Inform users of data transmission

---

## 8. Success Metrics

### 8.1 Product Metrics (KPIs)

**User Engagement:**
- **Daily Active Users (DAU)**: Target 100+ within 3 months
- **Average Session Duration**: Target 10+ minutes
- **Attempts per Session**: Target 5+ attempts
- **Return Rate (7-day)**: Target 40%+

**Learning Outcomes:**
- **Score Improvement Rate**: 70% of users show improvement after 10 attempts
- **Average Score Trajectory**: +0.5 points improvement per 20 attempts
- **Completion Rate**: 80% of started attempts are completed

**Feature Adoption:**
- **History View Rate**: 60% of users view history at least once
- **Retry Rate**: 50% of attempts followed by retry on same sentence
- **Multi-session Users**: 50% of users return for 3+ sessions

### 8.2 Technical Metrics

**Performance:**
- **Page Load Time (P95)**: < 3 seconds
- **STT Success Rate**: > 95%
- **Recording Failures**: < 5%
- **Crash Rate**: < 1%

**Quality:**
- **Evaluation Consistency**: Same audio → same score (within ±0.5)
- **STT Accuracy**: > 90% word-level accuracy for native speakers
- **User-Reported Bugs**: < 2 critical bugs per month

### 8.3 User Satisfaction Metrics

**Qualitative:**
- **Net Promoter Score (NPS)**: Target 40+
- **User Feedback Rating**: Target 4.0+ / 5.0
- **"Useful for TOEFL Prep" Agreement**: Target 80%+

**Support:**
- **Support Ticket Volume**: < 5% of users file tickets
- **Average Resolution Time**: < 24 hours

### 8.4 Business Metrics (Future)

**Growth:**
- **User Acquisition Cost (CAC)**: To be determined
- **Monthly Growth Rate**: Target 20% MoM (months 2-6)

**Monetization (Post-MVP):**
- **Conversion to Premium**: Target 10% (if freemium model)
- **Average Revenue per User (ARPU)**: To be determined

### 8.5 Success Criteria for MVP Launch

**Must Meet:**
- ✅ Core practice flow works on Chrome, Firefox, Safari
- ✅ Evaluation scores are consistent and reasonable
- ✅ At least 20 sample sentences available
- ✅ History page loads and displays correctly
- ✅ No critical bugs in primary user flow

**Nice to Have:**
- ✅ Mobile responsive design
- ✅ 50+ sample sentences
- ✅ Export history feature
- ✅ Multiple STT options (Web Speech + Whisper)

---

## 9. Out of Scope (Post-MVP)

The following features are intentionally excluded from MVP but may be considered for future iterations:

- ❌ User authentication & cloud sync
- ❌ Social features (sharing, leaderboards)
- ❌ Mobile native apps (iOS/Android)
- ❌ AI tutor / personalized recommendations
- ❌ Video recording (for pronunciation visual feedback)
- ❌ Multiple language support (MVP: English only)
- ❌ Paid subscription model
- ❌ Integration with official TOEFL practice platforms

---

## 10. Timeline & Milestones (Proposed)

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| **Phase 1: Design & Setup** | Week 1-2 | - UI/UX mockups<br>- Tech stack setup<br>- Sample sentences collection |
| **Phase 2: Core Flow** | Week 3-4 | - MP3 playback + recording flow<br>- Beep sound + timing logic |
| **Phase 3: Evaluation** | Week 5-6 | - STT integration<br>- Scoring algorithm implementation<br>- Feedback generation |
| **Phase 4: History & UI** | Week 7 | - History page<br>- Analytics dashboard<br>- UI polish |
| **Phase 5: Testing** | Week 8 | - Cross-browser testing<br>- User acceptance testing<br>- Bug fixes |
| **Phase 6: Launch** | Week 9 | - Documentation<br>- Soft launch<br>- Monitoring & iteration |

**Total Estimated Time:** 9 weeks (2+ months)

---

## 11. Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| STT accuracy poor for non-native speakers | High | Medium | - Use Whisper API as fallback<br>- Allow manual transcript correction |
| Browser incompatibility (Safari/iOS) | High | Medium | - Early testing on all platforms<br>- Polyfills for MediaRecorder |
| LocalStorage quota exceeded | Medium | Low | - Implement auto-cleanup<br>- Export/import feature |
| Evaluation algorithm too harsh/lenient | Medium | Medium | - A/B testing with real users<br>- Calibration with TOEFL experts |
| Low user engagement | High | Medium | - Gamification (streaks, achievements)<br>- Clear progress visualization |
| Privacy concerns (audio recording) | Medium | Low | - Clear privacy policy<br>- Client-side only processing<br>- Easy data deletion |

---

## 12. Appendix

### 12.1 Glossary

- **Content Words**: Nouns, verbs, adjectives, adverbs that carry main meaning
- **Function Words**: Articles, prepositions, conjunctions that serve grammatical purpose
- **STT**: Speech-to-Text
- **Response Latency**: Time from beep to first spoken word
- **Beep Sound**: Audio cue signaling start of recording

### 12.2 References

- TOEFL Speaking Section Overview (2026 format)
- Web Speech API Documentation: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- OpenAI Whisper API: https://platform.openai.com/docs/guides/speech-to-text
- shadcn/ui Components: https://ui.shadcn.com/

### 12.3 Contact

**Product Manager**: [Your Name]  
**Engineering Lead**: [TBD]  
**Design Lead**: [TBD]  

---

**Document End**

*This PRD is a living document and will be updated as requirements evolve.*
