# UI Specification
## TOEFL Speaking "Listen & Repeat" Practice Service

**Version:** 1.0  
**Last Updated:** 2026-02-22  
**Role:** UI Designer  
**Status:** Draft

---

## 1. Design System

### 1.1 Color Palette (Stone-based Neutral)

shadcn Nova 테마의 Stone 팔레트를 기반으로 한 미니멀 디자인

#### Base Colors
```css
/* Background */
--background: 0 0% 100%;           /* #ffffff - 기본 배경 */
--foreground: 20 14.3% 4.1%;       /* #09090b - 기본 텍스트 */

/* Card */
--card: 0 0% 100%;                 /* #ffffff - 카드 배경 */
--card-foreground: 20 14.3% 4.1%;  /* #09090b - 카드 텍스트 */

/* Muted (비활성/보조) */
--muted: 60 4.8% 95.9%;            /* #f5f5f4 - 보조 배경 */
--muted-foreground: 25 5.3% 44.7%; /* #78716c - 보조 텍스트 */

/* Border */
--border: 20 5.9% 90%;             /* #e7e5e4 - 테두리 */
--input: 20 5.9% 90%;              /* #e7e5e4 - 입력 테두리 */
--ring: 20 14.3% 4.1%;             /* #09090b - 포커스 링 */
```

#### Semantic Colors
```css
/* Primary (브랜드 색상 - 차분한 인디고) */
--primary: 221.2 83.2% 53.3%;      /* #3b82f6 - 주 버튼 */
--primary-foreground: 210 40% 98%; /* #f8fafc - 주 버튼 텍스트 */

/* Secondary (중립적 회색) */
--secondary: 60 4.8% 95.9%;        /* #f5f5f4 */
--secondary-foreground: 24 9.8% 10%; /* #1c1917 */

/* Destructive (녹음 중지, 경고) */
--destructive: 0 84.2% 60.2%;      /* #ef4444 - 빨간색 */
--destructive-foreground: 210 40% 98%; /* #f8fafc */

/* Success (높은 점수) */
--success: 142.1 76.2% 36.3%;      /* #22c55e - 초록색 */
--success-foreground: 210 40% 98%; /* #f8fafc */

/* Warning (중간 점수) */
--warning: 45.4 93.4% 47.5%;       /* #eab308 - 노란색 */
--warning-foreground: 26 83.3% 14.1%; /* #422006 */

/* Accent (강조, 녹음 중) */
--accent: 0 84.2% 60.2%;           /* #ef4444 - 빨간색 (녹음) */
--accent-foreground: 210 40% 98%;  /* #f8fafc */
```

#### Chart Colors (그래프/차트 전용)
```css
/* 점수 차트용 색상 (레이더/바 차트) */
--chart-fluency: 221.2 83.2% 53.3%;        /* #3b82f6 - 파란색 */
--chart-intelligibility: 142.1 76.2% 36.3%; /* #22c55e - 초록색 */
--chart-accuracy: 262.1 83.3% 57.8%;        /* #8b5cf6 - 보라색 */

/* 추이 그래프 색상 */
--chart-line: 221.2 83.2% 53.3%;           /* #3b82f6 - 파란색 */
--chart-grid: 20 5.9% 90%;                  /* #e7e5e4 - 그리드선 */
--chart-background: 60 9.1% 97.8%;          /* #fafaf9 */
```

#### Difficulty Badge Colors
```css
--difficulty-easy: 142.1 76.2% 36.3%;   /* #22c55e - 초록 */
--difficulty-medium: 45.4 93.4% 47.5%;  /* #eab308 - 노란 */
--difficulty-hard: 0 84.2% 60.2%;       /* #ef4444 - 빨강 */
```

---

### 1.2 Typography Scale

#### Font Family
```css
--font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 
             "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--font-mono: ui-monospace, SFMono-Regular, "SF Mono", Consolas, 
             "Liberation Mono", Menlo, monospace;
```

#### Font Sizes
```css
/* Display (점수 표시용) */
--text-display: 3.75rem;     /* 60px - 총점 */
--text-display-line: 1;

/* Headings */
--text-h1: 2.25rem;          /* 36px */
--text-h1-line: 2.5rem;
--text-h2: 1.875rem;         /* 30px */
--text-h2-line: 2.25rem;
--text-h3: 1.5rem;           /* 24px */
--text-h3-line: 2rem;
--text-h4: 1.25rem;          /* 20px */
--text-h4-line: 1.75rem;

/* Body */
--text-base: 1rem;           /* 16px - 기본 */
--text-base-line: 1.5rem;
--text-lg: 1.125rem;         /* 18px */
--text-lg-line: 1.75rem;
--text-sm: 0.875rem;         /* 14px */
--text-sm-line: 1.25rem;
--text-xs: 0.75rem;          /* 12px */
--text-xs-line: 1rem;
```

#### Font Weights
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

#### Typography Usage Map
| 요소 | Size | Weight | Usage |
|------|------|--------|-------|
| 총점 | display (60px) | bold | 결과 화면 총점 |
| 카운트다운 | h1 (36px) | bold | "3, 2, 1" 숫자 |
| 페이지 제목 | h2 (30px) | semibold | "Practice", "History" |
| 섹션 제목 | h3 (24px) | semibold | "Your Statistics" |
| 문장 텍스트 | lg (18px) | normal | 원본 스크립트 표시 |
| 본문 | base (16px) | normal | 피드백, 설명 |
| 보조 텍스트 | sm (14px) | normal | 메타정보 (시간, 점수) |
| 캡션 | xs (12px) | normal | 난이도 배지 |

---

### 1.3 Spacing System

Tailwind CSS 기반 8px 단위 스케일

```css
/* Spacing Scale */
--spacing-0: 0px;
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
```

#### Spacing Usage Guidelines
| Context | Spacing | Value |
|---------|---------|-------|
| 화면 좌우 패딩 (모바일) | spacing-4 | 16px |
| 화면 좌우 패딩 (태블릿+) | spacing-6 | 24px |
| 카드 내부 패딩 | spacing-6 | 24px |
| 버튼 좌우 패딩 | spacing-6 | 24px |
| 버튼 상하 패딩 | spacing-3 | 12px |
| 섹션 간 간격 | spacing-8 | 32px |
| 컴포넌트 간 간격 | spacing-4 | 16px |
| 리스트 항목 간 간격 | spacing-3 | 12px |

---

### 1.4 Border Radius
```css
--radius-sm: 0.375rem;  /* 6px - 작은 요소 */
--radius-md: 0.5rem;    /* 8px - 기본 */
--radius-lg: 0.75rem;   /* 12px - 카드 */
--radius-xl: 1rem;      /* 16px - 큰 카드 */
--radius-full: 9999px;  /* 완전 둥근 (원형 버튼) */
```

---

### 1.5 Shadows
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 
             0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 
             0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 
             0 8px 10px -6px rgb(0 0 0 / 0.1);
```

**Usage:**
- 카드: `shadow-md`
- 떠있는 버튼: `shadow-lg`
- 모달: `shadow-xl`

---

## 2. Component Specification

### 2.1 Practice Screen Components

#### State: IDLE (문장 선택)

##### SentenceList
**shadcn 컴포넌트:** `ScrollArea`, `Card`, `CardHeader`, `CardContent`, `Badge`

```tsx
interface SentenceListProps {
  sentences: Sentence[];
  onSelect: (sentence: Sentence) => void;
  selectedId?: string;
}

interface Sentence {
  id: string;
  text: string;
  audioUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  wordCount: number;
  bestScore?: number; // 0~5 (이전 최고 점수, 없으면 undefined)
}
```

**구조:**
```tsx
<ScrollArea className="h-[60vh]">
  {sentences.map(sentence => (
    <Card 
      key={sentence.id}
      className="cursor-pointer hover:border-primary transition-colors"
      onClick={() => onSelect(sentence)}
    >
      <CardHeader className="flex-row items-center gap-2">
        <Badge variant={getDifficultyVariant(sentence.difficulty)}>
          {sentence.difficulty}
        </Badge>
        {sentence.bestScore && (
          <span className="text-sm text-muted-foreground">
            ★ {sentence.bestScore.toFixed(1)}
          </span>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-lg">{sentence.text}</p>
        <p className="text-xs text-muted-foreground mt-2">
          {sentence.wordCount} words
        </p>
      </CardContent>
    </Card>
  ))}
</ScrollArea>
```

**스타일링:**
- 각 카드 간격: `gap-3` (12px)
- 선택된 카드: `border-primary`, `bg-primary/5`
- Hover: `hover:border-primary/50`, `hover:shadow-md`

##### SentenceDetail (문장 선택 후)
**shadcn 컴포넌트:** `Card`, `Button`, `Separator`

```tsx
interface SentenceDetailProps {
  sentence: Sentence;
  onPlay: () => void;
  onChangeSelection: () => void;
  attemptCount: number;
}
```

**구조:**
```tsx
<Card className="w-full">
  <CardContent className="pt-6">
    <Badge variant={getDifficultyVariant(sentence.difficulty)}>
      {sentence.difficulty}
    </Badge>
    
    {/* 문장 텍스트 - 큰 글씨 */}
    <div className="my-6 p-6 bg-muted/30 rounded-lg">
      <p className="text-lg leading-relaxed">
        {sentence.text}
      </p>
    </div>

    <Separator className="my-4" />

    {/* 메타 정보 */}
    <div className="flex justify-between text-sm text-muted-foreground">
      <span>Duration: {sentence.duration}s</span>
      <span>Previous attempts: {attemptCount}</span>
      {sentence.bestScore && (
        <span>Best: ★ {sentence.bestScore.toFixed(1)}</span>
      )}
    </div>

    {/* Play 버튼 - 큰 버튼 */}
    <Button 
      size="lg" 
      className="w-full mt-6 h-14 text-lg"
      onClick={onPlay}
    >
      ▶ Play Audio
    </Button>

    {/* 문장 변경 버튼 */}
    <Button 
      variant="ghost" 
      className="w-full mt-2"
      onClick={onChangeSelection}
    >
      Change Sentence
    </Button>
  </CardContent>
</Card>
```

---

#### State: PLAYING (MP3 재생 중)

##### AudioPlayer
**shadcn 컴포넌트:** `Card`, `Progress`

```tsx
interface AudioPlayerProps {
  sentence: Sentence;
  currentTime: number;  // 초 단위
  duration: number;     // 초 단위
}
```

**구조:**
```tsx
<Card>
  <CardContent className="pt-6 space-y-4">
    {/* 상태 표시 */}
    <div className="flex items-center gap-2 text-muted-foreground">
      <span className="text-2xl">🔊</span>
      <span className="text-sm font-medium">Playing Audio...</span>
    </div>

    {/* 문장 텍스트 */}
    <div className="p-6 bg-muted/30 rounded-lg">
      <p className="text-lg leading-relaxed">
        {sentence.text}
      </p>
    </div>

    {/* 프로그레스 바 */}
    <div className="space-y-2">
      <Progress value={(currentTime / duration) * 100} />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{currentTime.toFixed(1)}s</span>
        <span>{duration.toFixed(1)}s</span>
      </div>
    </div>

    {/* 안내 메시지 */}
    <p className="text-center text-sm text-muted-foreground">
      Listen carefully!
    </p>
  </CardContent>
</Card>
```

---

#### State: WAITING (3초 카운트다운)

##### CountdownOverlay (Custom Component)
**Base:** `Card`

```tsx
interface CountdownOverlayProps {
  count: number;  // 3, 2, 1
}
```

**구조:**
```tsx
<Card className="border-primary/50">
  <CardContent className="pt-6 text-center">
    {/* 아이콘 */}
    <div className="mb-4">
      <span className="text-4xl">🎯</span>
    </div>

    {/* 메시지 */}
    <h3 className="text-2xl font-semibold mb-6">
      Get Ready!
    </h3>

    {/* 카운트다운 숫자 - 매우 큼 */}
    <div className="relative w-32 h-32 mx-auto mb-6">
      {/* 원형 프로그레스 (CSS animation) */}
      <div className="absolute inset-0 rounded-full border-8 border-muted">
        <div className="absolute inset-0 rounded-full border-8 border-primary 
                        border-t-transparent animate-spin" 
             style={{ animationDuration: '1s' }} />
      </div>
      
      {/* 숫자 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-6xl font-bold text-primary">
          {count}
        </span>
      </div>
    </div>

    {/* 안내 */}
    <p className="text-sm text-muted-foreground">
      Prepare to speak after the beep...
    </p>
  </CardContent>
</Card>
```

**애니메이션:**
- 숫자 변경 시: `fade-in` + `scale-in` 효과
- 원형 프로그레스: 1초마다 한 바퀴 회전

---

#### State: BEEP (비프음 순간)

##### BeepIndicator (Custom Component)

```tsx
interface BeepIndicatorProps {
  // Props 없음 - 0.2초간만 표시
}
```

**구조:**
```tsx
<Card className="border-destructive border-4 bg-destructive/10 
                 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]">
  <CardContent className="pt-6 text-center">
    {/* 큰 비프 아이콘 */}
    <div className="mb-4">
      <span className="text-6xl animate-bounce">🔔</span>
    </div>

    {/* Speak Now 메시지 - 강조 */}
    <h2 className="text-4xl font-bold text-destructive animate-pulse">
      Speak Now!
    </h2>

    {/* 비프음 표시 */}
    <p className="text-xl font-semibold text-destructive/80 mt-4">
      ♪ BEEP ♪
    </p>
  </CardContent>
</Card>
```

**애니메이션:**
- 전체 카드: `pulse` (깜빡임)
- 아이콘: `bounce` (튕김)
- 화면 전체 빨간 테두리: `shadow-destructive` glow 효과

---

#### State: RECORDING (녹음 중)

##### RecordingController (Custom Component)
**shadcn 컴포넌트:** `Card`, `Button`

```tsx
interface RecordingControllerProps {
  duration: number;      // 현재 녹음 시간 (초)
  audioLevel: number;    // 0~100 (음량 레벨)
  onStop: () => void;
}
```

**구조:**
```tsx
<Card className="border-destructive">
  <CardContent className="pt-6 space-y-6">
    {/* 상태 표시 */}
    <div className="flex items-center justify-center gap-2">
      <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
      <span className="text-lg font-semibold">Recording...</span>
    </div>

    {/* 파형 시각화 */}
    <AudioWaveform audioLevel={audioLevel} />

    {/* 녹음 시간 */}
    <div className="text-center">
      <span className="text-2xl font-mono font-bold">
        {duration.toFixed(1)}s
      </span>
    </div>

    {/* Stop 버튼 - 큰 빨간 버튼 */}
    <Button 
      variant="destructive" 
      size="lg" 
      className="w-full h-16 text-lg"
      onClick={onStop}
    >
      ⏹ Stop Recording
    </Button>

    {/* 안내 */}
    <p className="text-center text-sm text-muted-foreground">
      Speak clearly and naturally
    </p>
  </CardContent>
</Card>
```

##### AudioWaveform (Custom Component)

```tsx
interface AudioWaveformProps {
  audioLevel: number;  // 0~100
}
```

**구현 방식:**
```tsx
// Canvas 기반 실시간 파형
<div className="h-24 bg-muted/30 rounded-lg overflow-hidden">
  <canvas 
    ref={canvasRef}
    className="w-full h-full"
    width={600}
    height={96}
  />
</div>
```

**대체 방식 (간단):**
```tsx
// CSS 바 애니메이션
<div className="flex items-center justify-center gap-1 h-24">
  {Array.from({ length: 20 }).map((_, i) => (
    <div
      key={i}
      className="w-2 bg-destructive rounded-full transition-all duration-100"
      style={{
        height: `${Math.random() * audioLevel}%`,
        opacity: 0.3 + (audioLevel / 100) * 0.7
      }}
    />
  ))}
</div>
```

---

#### State: ANALYZING (분석 중)

##### AnalyzingIndicator (Custom Component)
**shadcn 컴포넌트:** `Card`, `Progress`

```tsx
interface AnalyzingIndicatorProps {
  progress: number;  // 0~100
  message: string;   // "Converting speech to text...", "Evaluating fluency..."
}
```

**구조:**
```tsx
<Card>
  <CardContent className="pt-6 space-y-6 text-center">
    {/* 로딩 스피너 */}
    <div className="flex justify-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent 
                      rounded-full animate-spin" />
    </div>

    {/* 메인 메시지 */}
    <h3 className="text-xl font-semibold">
      Analyzing your speech...
    </h3>

    {/* 프로그레스 바 */}
    <div className="space-y-2">
      <Progress value={progress} />
      <span className="text-sm text-muted-foreground">
        {progress}%
      </span>
    </div>

    {/* 현재 작업 */}
    <p className="text-sm text-muted-foreground">
      {message}
    </p>
  </CardContent>
</Card>
```

---

#### State: RESULT (결과 표시)

##### ScoreCard (Custom Component)
**shadcn 컴포넌트:** `Card`, `Badge`, `Progress`, `Separator`, `Button`

```tsx
interface ScoreCardProps {
  scores: {
    fluency: number;        // 0~5
    intelligibility: number; // 0~5
    accuracy: number;       // 0~5
    total: number;          // 0~5
  };
  feedback: {
    overall: string;
    fluency: string;
    intelligibility: string;
    accuracy: string;
    actionItems: string[];
  };
  userTranscript: string;
  originalScript: string;
  onTryAgain: () => void;
  onNextSentence: () => void;
  onViewHistory: () => void;
}
```

**구조:**
```tsx
<Card className="w-full">
  <CardContent className="pt-6 space-y-6">
    {/* 축하 아이콘 */}
    <div className="text-center">
      <span className="text-5xl">{getScoreEmoji(scores.total)}</span>
    </div>

    {/* 총점 - 매우 큰 강조 */}
    <div className="text-center space-y-2">
      <p className="text-sm text-muted-foreground">Your Score</p>
      <div className="text-6xl font-bold text-primary">
        {scores.total.toFixed(1)}
      </div>
      <div className="text-2xl">
        {renderStars(scores.total)}
      </div>
    </div>

    <Separator />

    {/* 세부 점수 */}
    <div className="space-y-3">
      <ScoreDimension 
        label="Fluency" 
        score={scores.fluency}
        color="blue"
      />
      <ScoreDimension 
        label="Intelligibility" 
        score={scores.intelligibility}
        color="green"
      />
      <ScoreDimension 
        label="Accuracy" 
        score={scores.accuracy}
        color="purple"
      />
    </div>

    <Separator />

    {/* 차트 */}
    <div className="bg-muted/30 p-4 rounded-lg">
      <ScoreChart scores={scores} />
    </div>

    <Separator />

    {/* 피드백 */}
    <div className="space-y-3">
      <h4 className="font-semibold">💬 Feedback</h4>
      <p className="text-sm">{feedback.overall}</p>
      
      {feedback.actionItems.length > 0 && (
        <ul className="text-sm text-muted-foreground space-y-1">
          {feedback.actionItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>

    <Separator />

    {/* 텍스트 비교 */}
    <TranscriptComparison 
      userTranscript={userTranscript}
      originalScript={originalScript}
    />

    <Separator />

    {/* 액션 버튼들 */}
    <div className="space-y-2">
      <Button 
        size="lg" 
        className="w-full"
        onClick={onTryAgain}
      >
        Try Again
      </Button>
      <Button 
        size="lg" 
        variant="secondary" 
        className="w-full"
        onClick={onNextSentence}
      >
        Next Sentence
      </Button>
      <Button 
        variant="ghost" 
        className="w-full"
        onClick={onViewHistory}
      >
        View History
      </Button>
    </div>
  </CardContent>
</Card>
```

##### ScoreDimension (Custom Component)

```tsx
interface ScoreDimensionProps {
  label: string;
  score: number;  // 0~5
  color: 'blue' | 'green' | 'purple';
}
```

**구조:**
```tsx
<div className="flex items-center justify-between">
  <span className="text-sm font-medium">{label}</span>
  <div className="flex items-center gap-2">
    {/* 별점 */}
    <span className="text-sm">{renderStars(score)}</span>
    {/* 숫자 */}
    <span className="text-sm font-semibold min-w-[2rem]">
      {score.toFixed(1)}
    </span>
  </div>
</div>
<Progress 
  value={(score / 5) * 100} 
  className={getColorClass(color)}
/>
```

##### ScoreChart (Custom Component using Recharts)

```tsx
interface ScoreChartProps {
  scores: {
    fluency: number;
    intelligibility: number;
    accuracy: number;
  };
}
```

**구현 (레이더 차트):**
```tsx
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, 
         PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const data = [
  { subject: 'Fluency', score: scores.fluency, fullMark: 5 },
  { subject: 'Intelligibility', score: scores.intelligibility, fullMark: 5 },
  { subject: 'Accuracy', score: scores.accuracy, fullMark: 5 },
];

<ResponsiveContainer width="100%" height={200}>
  <RadarChart data={data}>
    <PolarGrid stroke="hsl(var(--border))" />
    <PolarAngleAxis 
      dataKey="subject" 
      tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
    />
    <PolarRadiusAxis angle={90} domain={[0, 5]} />
    <Radar 
      name="Score" 
      dataKey="score" 
      stroke="hsl(var(--primary))" 
      fill="hsl(var(--primary))" 
      fillOpacity={0.5} 
    />
  </RadarChart>
</ResponsiveContainer>
```

##### TranscriptComparison (Custom Component)

```tsx
interface TranscriptComparisonProps {
  userTranscript: string;
  originalScript: string;
}
```

**구조:**
```tsx
<div className="space-y-3">
  <h4 className="font-semibold text-sm">Transcript Comparison</h4>
  
  {/* 사용자 발화 */}
  <div className="space-y-1">
    <p className="text-xs text-muted-foreground">You said:</p>
    <div className="p-3 bg-muted/30 rounded-md">
      <p className="text-sm">{userTranscript}</p>
    </div>
  </div>

  {/* 원본 */}
  <div className="space-y-1">
    <p className="text-xs text-muted-foreground">Original:</p>
    <div className="p-3 bg-muted/30 rounded-md">
      <p className="text-sm">{originalScript}</p>
    </div>
  </div>

  {/* 차이점 하이라이트 */}
  <DifferenceHighlight 
    userTranscript={userTranscript}
    originalScript={originalScript}
  />
</div>
```

---

### 2.2 History Screen Components

##### HistoryView
**shadcn 컴포넌트:** `Card`, `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`, `ScrollArea`, `Badge`

```tsx
interface HistoryViewProps {
  attempts: PracticeAttempt[];
  statistics: UserStatistics;
  onViewDetail: (attemptId: string) => void;
  onRetry: (sentenceId: string) => void;
}
```

**구조:**
```tsx
<div className="space-y-6">
  {/* 통계 카드 */}
  <StatisticsCard statistics={statistics} />

  {/* 탭: 리스트 vs 차트 */}
  <Tabs defaultValue="list">
    <TabsList className="grid w-full grid-cols-2">
      <TabsTrigger value="list">All Attempts</TabsTrigger>
      <TabsTrigger value="chart">Trends</TabsTrigger>
    </TabsList>

    <TabsContent value="list">
      <AttemptsList 
        attempts={attempts}
        onViewDetail={onViewDetail}
        onRetry={onRetry}
      />
    </TabsContent>

    <TabsContent value="chart">
      <TrendChart attempts={attempts} />
    </TabsContent>
  </Tabs>
</div>
```

##### StatisticsCard (Custom Component)

```tsx
interface StatisticsCardProps {
  statistics: {
    totalAttempts: number;
    averageScore: number;
    bestScore: number;
    totalPracticeTime: number; // seconds
  };
}
```

**구조:**
```tsx
<Card>
  <CardHeader>
    <h3 className="text-xl font-semibold">📊 Your Statistics</h3>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-2 gap-4">
      <StatItem 
        label="Total Attempts" 
        value={statistics.totalAttempts.toString()}
      />
      <StatItem 
        label="Average Score" 
        value={`${statistics.averageScore.toFixed(1)} ${renderStars(statistics.averageScore)}`}
      />
      <StatItem 
        label="Best Score" 
        value={`${statistics.bestScore.toFixed(1)} ${renderStars(statistics.bestScore)}`}
      />
      <StatItem 
        label="Practice Time" 
        value={formatDuration(statistics.totalPracticeTime)}
      />
    </div>
  </CardContent>
</Card>
```

##### AttemptsList

```tsx
interface AttemptsListProps {
  attempts: PracticeAttempt[];
  onViewDetail: (attemptId: string) => void;
  onRetry: (sentenceId: string) => void;
}
```

**구조:**
```tsx
<ScrollArea className="h-[50vh]">
  <div className="space-y-3">
    {attempts.map(attempt => (
      <Card key={attempt.id} className="cursor-pointer hover:shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                {formatDate(attempt.timestamp)}
              </p>
              <p className="text-sm font-medium line-clamp-2">
                {attempt.sentence.text}
              </p>
            </div>
            <Badge variant={getScoreBadgeVariant(attempt.scores.total)}>
              {attempt.scores.total.toFixed(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm">
              {renderStars(attempt.scores.total)}
            </span>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => onViewDetail(attempt.id)}
              >
                View Details
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onRetry(attempt.sentenceId)}
              >
                Retry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
</ScrollArea>
```

##### TrendChart (Custom Component using Recharts)

```tsx
interface TrendChartProps {
  attempts: PracticeAttempt[];
}
```

**구현 (선 그래프):**
```tsx
import { Line, LineChart, XAxis, YAxis, CartesianGrid, 
         Tooltip, ResponsiveContainer } from 'recharts';

// 최근 10~20개 시도만 표시
const data = attempts.slice(-20).map((attempt, i) => ({
  index: i + 1,
  score: attempt.scores.total,
  date: formatDate(attempt.timestamp, 'short'),
}));

<Card>
  <CardHeader>
    <h4 className="font-semibold">📈 Score Trend</h4>
  </CardHeader>
  <CardContent>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="hsl(var(--border))" 
        />
        <XAxis 
          dataKey="index" 
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          domain={[0, 5]} 
          ticks={[0, 1, 2, 3, 4, 5]}
          tick={{ fontSize: 12 }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
        <Line 
          type="monotone" 
          dataKey="score" 
          stroke="hsl(var(--primary))" 
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--primary))', r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </CardContent>
</Card>
```

---

## 3. Layout Structure

### 3.1 Component Tree

```
App
├─ Header (고정 헤더)
│  ├─ Logo (앱 이름)
│  └─ Navigation
│     ├─ NavLink (Practice)
│     ├─ NavLink (History)
│     └─ NavLink (Settings)
│
├─ Router (React Router v6)
│  │
│  ├─ Route: /practice
│  │  └─ PracticeView
│  │     ├─ PracticeContainer (상태 관리)
│  │     │  ├─ [IDLE] SentenceList + SentenceDetail
│  │     │  ├─ [PLAYING] AudioPlayer
│  │     │  ├─ [WAITING] CountdownOverlay
│  │     │  ├─ [BEEP] BeepIndicator
│  │     │  ├─ [RECORDING] RecordingController
│  │     │  ├─ [ANALYZING] AnalyzingIndicator
│  │     │  └─ [RESULT] ScoreCard
│  │     └─ StateDebugger (개발용, 프로덕션에서 제거)
│  │
│  ├─ Route: /history
│  │  └─ HistoryView
│  │     ├─ StatisticsCard
│  │     ├─ Tabs
│  │     │  ├─ TabsContent (list)
│  │     │  │  └─ AttemptsList
│  │     │  └─ TabsContent (chart)
│  │     │     └─ TrendChart
│  │     └─ DetailModal (optional)
│  │
│  └─ Route: /settings
│     └─ SettingsView
│        ├─ MicrophoneTest
│        ├─ DataManagement
│        └─ About
│
└─ Footer (optional, 간단한 링크)
```

---

### 3.2 Props Interfaces (주요 컴포넌트)

#### PracticeContainer

```tsx
interface PracticeContainerProps {
  // 초기 선택된 문장 (optional)
  initialSentenceId?: string;
}

interface PracticeState {
  // 현재 상태
  currentState: 'idle' | 'playing' | 'waiting' | 'beep' | 'recording' | 'analyzing' | 'result';
  
  // 선택된 문장
  selectedSentence: Sentence | null;
  
  // 오디오 관련
  audioElement: HTMLAudioElement | null;
  audioDuration: number;
  audioCurrentTime: number;
  
  // 카운트다운
  countdown: number; // 3, 2, 1
  
  // 녹음 관련
  mediaRecorder: MediaRecorder | null;
  recordingBlob: Blob | null;
  recordingDuration: number;
  audioLevel: number; // 0~100
  
  // 분석 관련
  sttProgress: number; // 0~100
  sttMessage: string;
  
  // 결과
  evaluationResult: PracticeAttempt | null;
}
```

#### HistoryView

```tsx
interface HistoryViewProps {
  // Props 없음 - localStorage에서 직접 로드
}

interface HistoryState {
  attempts: PracticeAttempt[];
  statistics: UserStatistics;
  selectedAttemptId: string | null;
  filterDifficulty: 'all' | 'easy' | 'medium' | 'hard';
  sortBy: 'date' | 'score';
}
```

---

### 3.3 Responsive Layout

#### Breakpoints
```css
/* Mobile first */
@media (min-width: 640px)  { /* sm */ }
@media (min-width: 768px)  { /* md - Tablet */ }
@media (min-width: 1024px) { /* lg - Desktop */ }
@media (min-width: 1280px) { /* xl */ }
```

#### Container Max-Width
```css
/* 모든 화면은 중앙 정렬, 최대 너비 제한 */
.container {
  max-width: 600px;  /* 가독성을 위해 좁게 */
  margin: 0 auto;
  padding: 0 1rem;   /* 16px */
}

@media (min-width: 768px) {
  .container {
    padding: 0 1.5rem; /* 24px */
  }
}
```

#### Mobile vs Desktop Differences

| 요소 | Mobile (< 768px) | Desktop (≥ 768px) |
|------|------------------|-------------------|
| Header | 고정, 간략한 아이콘 | 고정, 전체 텍스트 |
| Card Padding | 16px | 24px |
| Font Size (총점) | 48px | 60px |
| 버튼 높이 | 48px | 56px |
| 차트 높이 | 200px | 250px |
| 리스트 높이 | 40vh | 50vh |

---

## 4. Custom Components Design

### 4.1 AudioWaveform

**목적:** 녹음 중 실시간 파형 표시

**구현 방식:**
- Web Audio API `AnalyserNode` 사용
- Canvas에 파형 그리기 (60fps)

**Props:**
```tsx
interface AudioWaveformProps {
  audioLevel: number;  // 0~100 (현재 음량)
  isRecording: boolean;
}
```

**디자인:**
- 높이: 96px (6rem)
- 배경: `bg-muted/30`
- 파형 색상: `stroke-destructive` (빨강)
- 파형 두께: 2px
- 부드러운 애니메이션: `transition-all duration-100`

**대체 구현 (간단):**
```tsx
// 20개의 세로 막대, 높이가 음량에 따라 변화
<div className="flex items-center justify-center gap-1 h-24 px-4">
  {Array.from({ length: 20 }).map((_, i) => (
    <motion.div
      key={i}
      className="w-1.5 bg-destructive rounded-full"
      animate={{
        height: `${10 + Math.random() * audioLevel * 0.8}%`,
      }}
      transition={{
        duration: 0.1,
        ease: 'easeOut',
      }}
    />
  ))}
</div>
```

---

### 4.2 CountdownOverlay

**목적:** 3초 카운트다운 시각화

**구현:**
- 원형 프로그레스 + 숫자
- 1초마다 숫자 변경 (3 → 2 → 1)
- 매끄러운 애니메이션

**Props:**
```tsx
interface CountdownOverlayProps {
  count: number;  // 3, 2, 1
}
```

**디자인:**
- 원형 크기: 128px (w-32 h-32)
- 숫자 크기: 60px (text-6xl)
- 숫자 색상: `text-primary`
- 원형 테두리: 8px, `border-primary`
- 애니메이션: 
  - 숫자 변경 시: `fade-in` + `scale` (0.9 → 1.0)
  - 원형: 1초간 한 바퀴 회전 (`rotate-360`)

**CSS 애니메이션:**
```css
@keyframes countdown-number {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  20% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.countdown-number {
  animation: countdown-number 0.3s ease-out;
}
```

---

### 4.3 ScoreCard

**목적:** 평가 결과 종합 표시

**Props:** (이미 위에 정의됨)

**디자인 세부사항:**
- 총점 강조: 60px, `font-bold`, `text-primary`
- 별점: 노란색 ⭐ (filled) + 회색 ☆ (empty)
- 세부 점수 바: `Progress` 컴포넌트, 색상 다르게
  - Fluency: 파란색 (`bg-blue-500`)
  - Intelligibility: 초록색 (`bg-green-500`)
  - Accuracy: 보라색 (`bg-purple-500`)
- 피드백: `text-sm`, `text-muted-foreground`
- 구분선: `Separator` 컴포넌트

---

### 4.4 ScoreChart

**목적:** 3차원 점수 시각화 (레이더 차트)

**라이브러리:** Recharts

**Props:**
```tsx
interface ScoreChartProps {
  scores: {
    fluency: number;
    intelligibility: number;
    accuracy: number;
  };
  previousBest?: {
    fluency: number;
    intelligibility: number;
    accuracy: number;
  }; // optional, 이전 최고 점수와 비교
}
```

**디자인:**
- 크기: 200px 높이 (ResponsiveContainer)
- 색상:
  - 현재 점수: `primary` (파란색, 투명도 50%)
  - 이전 최고: `muted-foreground` (회색, 점선)
- 배경: `bg-muted/30`, 둥근 모서리
- 그리드선: `border` 색상
- 축 레이블: 12px, `foreground` 색상

---

## 5. Accessibility & Interaction

### 5.1 Keyboard Navigation

| Key | Action | Context |
|-----|--------|---------|
| `Tab` | 다음 요소로 포커스 이동 | 전역 |
| `Shift + Tab` | 이전 요소로 포커스 이동 | 전역 |
| `Enter` / `Space` | 버튼 클릭, 카드 선택 | 버튼, 카드 |
| `Escape` | 모달 닫기 | 모달 열림 시 |
| `Arrow Up/Down` | 리스트 내비게이션 | History 리스트 |

### 5.2 ARIA Labels

```tsx
// 버튼
<Button aria-label="Play audio sample">
  ▶ Play Audio
</Button>

// 프로그레스
<Progress 
  value={50} 
  aria-valuenow={50}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label="Audio playback progress"
/>

// 상태 알림 (스크린 리더용)
<div role="status" aria-live="polite" className="sr-only">
  {currentState === 'recording' && "Recording in progress"}
  {currentState === 'analyzing' && "Analyzing your speech"}
</div>

// 카드 (클릭 가능)
<Card 
  role="button" 
  tabIndex={0}
  aria-label={`Practice sentence: ${sentence.text}`}
  onClick={handleSelect}
  onKeyDown={(e) => e.key === 'Enter' && handleSelect()}
>
```

### 5.3 Focus States

```css
/* 모든 포커스 가능 요소 */
*:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

/* 버튼 포커스 */
.button:focus-visible {
  ring-2 ring-ring ring-offset-2;
}

/* 카드 포커스 */
.card:focus-visible {
  border-color: hsl(var(--primary));
  box-shadow: 0 0 0 3px hsl(var(--primary) / 0.1);
}
```

### 5.4 Touch Targets

**최소 크기 기준:**
- 일반 버튼: 44×44px (Apple HIG)
- 주요 액션 버튼 (Play, Stop): 56×56px (14rem 높이)
- 리스트 항목: 최소 48px 높이
- 카드: 최소 12px 패딩 (터치 여유 공간)

```tsx
// 예시: 작은 아이콘 버튼도 충분한 터치 영역
<button className="p-3 min-h-[44px] min-w-[44px]">
  <Icon className="w-5 h-5" />
</button>
```

---

## 6. Animation & Transitions

### 6.1 상태 전이 애니메이션

| From State | To State | Animation |
|------------|----------|-----------|
| IDLE | PLAYING | Fade-in player card |
| PLAYING | WAITING | Slide-up countdown overlay |
| WAITING | BEEP | Flash (border pulse) |
| BEEP | RECORDING | Fade-in recording UI |
| RECORDING | ANALYZING | Fade out → Fade in spinner |
| ANALYZING | RESULT | Fade-in result card + Confetti (high score) |

### 6.2 Framer Motion 활용

```tsx
import { motion, AnimatePresence } from 'framer-motion';

// 상태별 컴포넌트 애니메이션
<AnimatePresence mode="wait">
  {currentState === 'idle' && (
    <motion.div
      key="idle"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <SentenceDetail />
    </motion.div>
  )}
  
  {currentState === 'result' && (
    <motion.div
      key="result"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      <ScoreCard />
    </motion.div>
  )}
</AnimatePresence>
```

### 6.3 Micro-interactions

**호버 효과:**
```css
/* 카드 */
.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  transition: all 0.2s ease;
}

/* 버튼 */
.button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.button:active {
  transform: translateY(0);
}
```

**로딩 스피너:**
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1s linear infinite;
}
```

**파형 펄스 (녹음 중):**
```css
@keyframes wave-pulse {
  0%, 100% { transform: scaleY(0.5); }
  50% { transform: scaleY(1.5); }
}

.wave-bar {
  animation: wave-pulse 0.5s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.05s); /* 순차적 애니메이션 */
}
```

---

## 7. Error States & Empty States

### 7.1 에러 상태 디자인

#### 마이크 권한 거부
```tsx
<Card className="border-destructive">
  <CardContent className="pt-6 text-center space-y-4">
    <div className="text-5xl">🎤❌</div>
    <h3 className="text-lg font-semibold">Microphone Access Denied</h3>
    <p className="text-sm text-muted-foreground">
      This app needs microphone access to record your speech.
    </p>
    <Button onClick={requestPermission}>
      Request Permission Again
    </Button>
    <Button variant="ghost" onClick={showHelp}>
      How to Enable?
    </Button>
  </CardContent>
</Card>
```

#### STT 실패
```tsx
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Could not analyze your speech</AlertTitle>
  <AlertDescription>
    Please try again. Make sure you speak clearly and avoid background noise.
  </AlertDescription>
  <Button size="sm" onClick={retry} className="mt-2">
    Retry
  </Button>
</Alert>
```

#### 녹음 너무 짧음
```tsx
<Alert>
  <Info className="h-4 w-4" />
  <AlertTitle>Recording too short</AlertTitle>
  <AlertDescription>
    Your recording was only {duration}s. Please try to complete the full sentence.
  </AlertDescription>
</Alert>
```

### 7.2 빈 상태 디자인

#### 히스토리 없음
```tsx
<Card>
  <CardContent className="pt-6 text-center space-y-4">
    <div className="text-6xl">📝</div>
    <h3 className="text-lg font-semibold">No practice history yet</h3>
    <p className="text-sm text-muted-foreground">
      Start practicing to see your progress here!
    </p>
    <Button onClick={goToPractice}>
      Start Practicing
    </Button>
  </CardContent>
</Card>
```

#### 문장 목록 로딩 중
```tsx
<div className="space-y-3">
  {[1, 2, 3].map(i => (
    <Card key={i} className="animate-pulse">
      <CardContent className="pt-6">
        <div className="h-4 bg-muted rounded w-3/4 mb-2" />
        <div className="h-3 bg-muted rounded w-1/2" />
      </CardContent>
    </Card>
  ))}
</div>
```

---

## 8. Implementation Notes

### 8.1 필수 shadcn 컴포넌트 설치 목록

이미 설치됨:
- ✅ Button
- ✅ Card
- ✅ Progress
- ✅ Tabs
- ✅ Badge
- ✅ Separator

추가 설치 필요:
```bash
cd /home/admin/.openclaw/workspace/toefl-repeat
pnpx shadcn@latest add alert
pnpx shadcn@latest add scroll-area
pnpx shadcn@latest add dialog  # (모달용, optional)
pnpx shadcn@latest add switch   # (설정용, optional)
```

### 8.2 라이브러리 설치

```bash
npm install recharts framer-motion
npm install -D @types/recharts
```

### 8.3 CSS Variables 설정 (Tailwind Config)

`tailwind.config.js`에 커스텀 색상 추가:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        chart: {
          fluency: 'hsl(221.2 83.2% 53.3%)',
          intelligibility: 'hsl(142.1 76.2% 36.3%)',
          accuracy: 'hsl(262.1 83.3% 57.8%)',
        },
        difficulty: {
          easy: 'hsl(142.1 76.2% 36.3%)',
          medium: 'hsl(45.4 93.4% 47.5%)',
          hard: 'hsl(0 84.2% 60.2%)',
        }
      }
    }
  }
}
```

### 8.4 유틸리티 함수

**별점 렌더링:**
```tsx
function renderStars(score: number): string {
  const fullStars = Math.floor(score);
  const hasHalfStar = score % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return '⭐'.repeat(fullStars) + 
         (hasHalfStar ? '⭐' : '') + 
         '☆'.repeat(emptyStars);
}
```

**점수에 따른 이모지:**
```tsx
function getScoreEmoji(score: number): string {
  if (score >= 4.5) return '🎉';
  if (score >= 3.5) return '😊';
  if (score >= 2.5) return '🙂';
  if (score >= 1.5) return '😐';
  return '😔';
}
```

**난이도 배지 variant:**
```tsx
function getDifficultyVariant(difficulty: 'easy' | 'medium' | 'hard') {
  const variants = {
    easy: 'default',    // 초록색
    medium: 'secondary', // 노란색
    hard: 'destructive'  // 빨간색
  };
  return variants[difficulty];
}
```

---

## 9. Design Checklist

### 9.1 MVP Launch 전 체크리스트

**시각적 일관성:**
- [ ] 모든 카드 패딩 일관성 (24px)
- [ ] 버튼 크기 일관성 (최소 44px 높이)
- [ ] 색상 팔레트 준수 (Stone 기반)
- [ ] 폰트 크기 스케일 준수

**인터랙션:**
- [ ] 모든 버튼 호버/포커스 상태 확인
- [ ] 키보드 내비게이션 작동
- [ ] ARIA 라벨 모든 주요 요소에 적용
- [ ] 로딩/에러 상태 시각화 완료

**반응형:**
- [ ] 모바일 (375px) 테스트
- [ ] 태블릿 (768px) 테스트
- [ ] 데스크톱 (1024px+) 테스트
- [ ] 가로 모드 대응

**성능:**
- [ ] 파형 애니메이션 60fps 유지
- [ ] 페이지 전환 300ms 이내
- [ ] 이미지/아이콘 최적화 (SVG 사용)

**접근성:**
- [ ] 색 대비 4.5:1 이상 (WCAG AA)
- [ ] 스크린 리더 테스트
- [ ] 키보드만으로 전체 플로우 가능

---

## 10. Future Enhancements (Post-MVP)

### 10.1 다크 모드
- shadcn/ui의 dark mode CSS variables 활용
- `dark:` prefix로 모든 컴포넌트 대응

### 10.2 애니메이션 개선
- 높은 점수 시 confetti 효과 (canvas-confetti)
- 상태 전이 시 더 부드러운 transition
- 마이크로 인터랙션 추가 (버튼 클릭 시 ripple)

### 10.3 커스텀 테마
- 사용자가 색상 선택 가능 (Blue, Green, Purple)
- 폰트 크기 조절 옵션

### 10.4 고급 시각화
- 3D 레이더 차트 (three.js)
- 상세 음성 분석 파형 (음소별 강세 표시)
- 시간대별 연습 히트맵

---

**문서 종료**

이 UI 스펙을 기반으로 개발자는 shadcn/ui 컴포넌트를 활용하여 즉시 구현을 시작할 수 있습니다. 모든 상태, 색상, 타이포그래피, 스페이싱이 명확히 정의되어 있으며, 접근성과 반응형 디자인도 고려되었습니다.
