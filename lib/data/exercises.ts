import { Exercise, AudioSegment, BLOB_BASE } from '../types';
import markersData from './markers.json';

const markers: Record<string, { duration: number; segments: AudioSegment[] }> = markersData as Record<string, { file: string; duration: number; segments: AudioSegment[] }>;

function makeUrl(path: string): string {
  return `${BLOB_BASE}/${path}`;
}

function getMarker(id: string): { duration: number; segments: AudioSegment[] } {
  return markers[id] || { duration: 0, segments: [] };
}

function makeQaClips(basePath: string, prefix: string, nums: number[]): Exercise['qaClips'] {
  return nums.map(n => ({
    id: `${prefix}_${String(n).padStart(2, '0')}`,
    label: `Q${n}`,
    audioUrl: makeUrl(`${basePath}/${prefix}_${String(n).padStart(2, '0')}_qa-model.mp3`),
  }));
}

// ============ DIAGNOSTIC TEST ============
const diagnostic: Exercise[] = [
  {
    id: 'DT_1', title: 'Diagnostic Test 1', titleKo: '진단 테스트 1',
    taskType: 'diagnostic', category: 'Diagnostic', categoryKo: '진단 테스트',
    difficulty: 'intermediate', audioUrl: makeUrl('diagnostic/DT_1.mp3'),
    ...getMarker('DT_1'),
  },
  {
    id: 'DT_2', title: 'Diagnostic Test 2', titleKo: '진단 테스트 2',
    taskType: 'diagnostic', category: 'Diagnostic', categoryKo: '진단 테스트',
    difficulty: 'intermediate', audioUrl: makeUrl('diagnostic/DT_2.mp3'),
    ...getMarker('DT_2'),
    qaClips: [8, 9, 10, 11].map(n => ({
      id: `DT_2_${String(n).padStart(2, '0')}`,
      label: `Q${n}`,
      audioUrl: makeUrl(`diagnostic/DT_2_${String(n).padStart(2, '0')}_qa-model.mp3`),
    })),
  },
];

// ============ TASK 1: Listen & Repeat ============
function makeT1(id: number, category: string, categoryKo: string, path: string, difficulty: Exercise['difficulty']): Exercise {
  const exId = `T1_${id}`;
  return {
    id: exId, title: `Task 1 - #${id}`, titleKo: `Task 1 - ${id}번`,
    taskType: 'task1', category, categoryKo, difficulty,
    audioUrl: makeUrl(`${path}/T1_${id}.mp3`),
    ...getMarker(exId),
  };
}

const task1Basic: Exercise[] = Array.from({ length: 6 }, (_, i) =>
  makeT1(i + 1, 'Basic', '기본다지기', 'task1/basic', 'beginner')
);

const task1Strategy: Exercise[] = Array.from({ length: 10 }, (_, i) =>
  makeT1(i + 7, 'Strategy', '전략익히기', 'task1/strategy', 'intermediate')
);

const task1Facility: Exercise[] = Array.from({ length: 8 }, (_, i) =>
  makeT1(i + 17, 'Facility Info', '시설 안내', 'task1/situation/facility', 'advanced')
);

const task1Event: Exercise[] = Array.from({ length: 8 }, (_, i) =>
  makeT1(i + 25, 'Event Info', '행사 안내', 'task1/situation/event', 'advanced')
);

const task1Procedure: Exercise[] = Array.from({ length: 8 }, (_, i) =>
  makeT1(i + 33, 'Procedure', '방법 및 절차', 'task1/situation/procedure', 'advanced')
);

const task1PowerTest: Exercise[] = [1, 2].map(n => ({
  id: `T1_PT_${n}`, title: `Power Test ${n}`, titleKo: `파워 테스트 ${n}`,
  taskType: 'task1' as const, category: 'Power Test', categoryKo: '파워 테스트',
  difficulty: 'advanced' as const, audioUrl: makeUrl(`task1/power-test/PT_${n}.mp3`),
  ...getMarker(`PT_${n}`),
}));

// ============ TASK 2: Interview ============
function makeT2(id: number, category: string, categoryKo: string, path: string, difficulty: Exercise['difficulty'], qaNums?: number[]): Exercise {
  const exId = `T2_${id}`;
  const ex: Exercise = {
    id: exId, title: `Task 2 - #${id}`, titleKo: `Task 2 - ${id}번`,
    taskType: 'task2', category, categoryKo, difficulty,
    audioUrl: makeUrl(`${path}/T2_${id}.mp3`),
    ...getMarker(exId),
  };
  if (qaNums) {
    ex.qaClips = qaNums.map(n => ({
      id: `T2_${id}_${String(n).padStart(2, '0')}`,
      label: `Q${n}`,
      audioUrl: makeUrl(`${path}/T2_${id}_${String(n).padStart(2, '0')}_qa-model.mp3`),
    }));
  }
  return ex;
}

const task2Basic: Exercise[] = Array.from({ length: 6 }, (_, i) =>
  makeT2(i + 1, 'Basic', '기본다지기', 'task2/basic', 'beginner')
);

const task2Strategy: Exercise[] = [];
for (let id = 7; id <= 12; id++) {
  const qaStart = (id - 7) * 4 + 1;
  task2Strategy.push(makeT2(id, 'Strategy', '전략익히기', 'task2/strategy', 'intermediate',
    [qaStart, qaStart + 1, qaStart + 2, qaStart + 3]));
}

const topicMap: [string, string, string, number, number][] = [
  ['education', '교육', 'task2/topic/education', 13, 16],
  ['society', '사회', 'task2/topic/society', 17, 20],
  ['environment', '환경', 'task2/topic/environment', 21, 24],
  ['science', '과학기술', 'task2/topic/science', 25, 28],
  ['career', '진로', 'task2/topic/career', 29, 32],
  ['daily', '일상', 'task2/topic/daily', 33, 36],
  ['leisure', '여가', 'task2/topic/leisure', 37, 40],
];

const task2Topics: Exercise[] = [];
for (const [en, ko, path, start, end] of topicMap) {
  for (let id = start; id <= end; id++) {
    const qaOffset = (id - start) * 4 + 1;
    task2Topics.push(makeT2(id, en.charAt(0).toUpperCase() + en.slice(1), ko, path, 'advanced',
      [qaOffset, qaOffset + 1, qaOffset + 2, qaOffset + 3]));
  }
}

const task2PowerTest: Exercise[] = [1, 2].map(n => ({
  id: `T2_PT_${n}`, title: `Power Test ${n}`, titleKo: `파워 테스트 ${n}`,
  taskType: 'task2' as const, category: 'Power Test', categoryKo: '파워 테스트',
  difficulty: 'advanced' as const, audioUrl: makeUrl(`task2/power-test/PT_${n}.mp3`),
  ...getMarker(`PT_${n}`),
  qaClips: [1, 2, 3, 4].map(q => ({
    id: `T2_PT_${n}_${String(q).padStart(2, '0')}`,
    label: `Q${q}`,
    audioUrl: makeUrl(`task2/power-test/PT_${n}_${String(q).padStart(2, '0')}_qa-model.mp3`),
  })),
}));

// ============ ACTUAL TEST ============
const actualTest: Exercise[] = [
  {
    id: 'AT_1', title: 'Actual Test 1-1', titleKo: '실전 모의고사 1-1',
    taskType: 'actual-test', category: 'Actual Test 1', categoryKo: '실전 모의 1',
    difficulty: 'advanced', audioUrl: makeUrl('actual-test/test1/AT_1.mp3'),
    ...getMarker('AT_1'),
  },
  {
    id: 'AT_2', title: 'Actual Test 1-2', titleKo: '실전 모의고사 1-2',
    taskType: 'actual-test', category: 'Actual Test 1', categoryKo: '실전 모의 1',
    difficulty: 'advanced', audioUrl: makeUrl('actual-test/test1/AT_2.mp3'),
    ...getMarker('AT_2'),
    qaClips: [8, 9, 10, 11].map(n => ({
      id: `AT_2_${String(n).padStart(2, '0')}`,
      label: `Q${n}`,
      audioUrl: makeUrl(`actual-test/test1/AT_2_${String(n).padStart(2, '0')}_qa-model.mp3`),
    })),
  },
  {
    id: 'AT_3', title: 'Actual Test 2-1', titleKo: '실전 모의고사 2-1',
    taskType: 'actual-test', category: 'Actual Test 2', categoryKo: '실전 모의 2',
    difficulty: 'advanced', audioUrl: makeUrl('actual-test/test2/AT_3.mp3'),
    ...getMarker('AT_3'),
  },
  {
    id: 'AT_4', title: 'Actual Test 2-2', titleKo: '실전 모의고사 2-2',
    taskType: 'actual-test', category: 'Actual Test 2', categoryKo: '실전 모의 2',
    difficulty: 'advanced', audioUrl: makeUrl('actual-test/test2/AT_4.mp3'),
    ...getMarker('AT_4'),
    qaClips: [8, 9, 10, 11].map(n => ({
      id: `AT_4_${String(n).padStart(2, '0')}`,
      label: `Q${n}`,
      audioUrl: makeUrl(`actual-test/test2/AT_4_${String(n).padStart(2, '0')}_qa-model.mp3`),
    })),
  },
];

// ============ ALL EXERCISES ============
export const allExercises: Exercise[] = [
  ...diagnostic,
  ...task1Basic,
  ...task1Strategy,
  ...task1Facility,
  ...task1Event,
  ...task1Procedure,
  ...task1PowerTest,
  ...task2Basic,
  ...task2Strategy,
  ...task2Topics,
  ...task2PowerTest,
  ...actualTest,
];

// Group by task type
export const exercisesByTask = {
  diagnostic,
  task1: [...task1Basic, ...task1Strategy, ...task1Facility, ...task1Event, ...task1Procedure, ...task1PowerTest],
  task2: [...task2Basic, ...task2Strategy, ...task2Topics, ...task2PowerTest],
  'actual-test': actualTest,
};

// Sections for UI
export interface ExerciseSection {
  id: string;
  title: string;
  titleKo: string;
  exercises: Exercise[];
}

export const exerciseSections: ExerciseSection[] = [
  { id: 'diagnostic', title: 'Diagnostic Test', titleKo: '진단 테스트', exercises: diagnostic },
  { id: 't1-basic', title: 'Task 1 - Basic', titleKo: 'Task 1 - 기본다지기', exercises: task1Basic },
  { id: 't1-strategy', title: 'Task 1 - Strategy', titleKo: 'Task 1 - 전략익히기', exercises: task1Strategy },
  { id: 't1-facility', title: 'Task 1 - Facility', titleKo: 'Task 1 - 시설 안내', exercises: task1Facility },
  { id: 't1-event', title: 'Task 1 - Events', titleKo: 'Task 1 - 행사 안내', exercises: task1Event },
  { id: 't1-procedure', title: 'Task 1 - Procedure', titleKo: 'Task 1 - 방법 및 절차', exercises: task1Procedure },
  { id: 't1-power', title: 'Task 1 - Power Test', titleKo: 'Task 1 - 파워 테스트', exercises: task1PowerTest },
  { id: 't2-basic', title: 'Task 2 - Basic', titleKo: 'Task 2 - 기본다지기', exercises: task2Basic },
  { id: 't2-strategy', title: 'Task 2 - Strategy', titleKo: 'Task 2 - 전략익히기', exercises: task2Strategy },
  { id: 't2-education', title: 'Task 2 - Education', titleKo: 'Task 2 - 교육', exercises: task2Topics.filter(e => e.category === 'Education') },
  { id: 't2-society', title: 'Task 2 - Society', titleKo: 'Task 2 - 사회', exercises: task2Topics.filter(e => e.category === 'Society') },
  { id: 't2-environment', title: 'Task 2 - Environment', titleKo: 'Task 2 - 환경', exercises: task2Topics.filter(e => e.category === 'Environment') },
  { id: 't2-science', title: 'Task 2 - Science', titleKo: 'Task 2 - 과학기술', exercises: task2Topics.filter(e => e.category === 'Science') },
  { id: 't2-career', title: 'Task 2 - Career', titleKo: 'Task 2 - 진로', exercises: task2Topics.filter(e => e.category === 'Career') },
  { id: 't2-daily', title: 'Task 2 - Daily Life', titleKo: 'Task 2 - 일상', exercises: task2Topics.filter(e => e.category === 'Daily') },
  { id: 't2-leisure', title: 'Task 2 - Leisure', titleKo: 'Task 2 - 여가', exercises: task2Topics.filter(e => e.category === 'Leisure') },
  { id: 't2-power', title: 'Task 2 - Power Test', titleKo: 'Task 2 - 파워 테스트', exercises: task2PowerTest },
  { id: 'actual-test', title: 'Actual Test', titleKo: '실전 모의고사', exercises: actualTest },
];
