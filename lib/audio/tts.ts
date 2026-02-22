// Web Speech API를 사용한 TTS
let voices: SpeechSynthesisVoice[] = [];
let voicesLoaded = false;

// 음성 목록 로드
export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (voicesLoaded && voices.length > 0) {
      resolve(voices);
      return;
    }

    voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      voicesLoaded = true;
      resolve(voices);
      return;
    }

    speechSynthesis.onvoiceschanged = () => {
      voices = speechSynthesis.getVoices();
      voicesLoaded = true;
      resolve(voices);
    };
  });
}

// 선호 음성 가져오기
export function getPreferredVoice(accent: 'us' | 'uk' = 'us'): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;
  
  const langCode = accent === 'uk' ? 'en-GB' : 'en-US';
  
  // 해당 언어 코드의 음성만 필터링
  const preferred = voices.filter(v => v.lang.startsWith(langCode.split('-')[0]));
  
  // 우선순위: Google > Microsoft > 기타 > 기본
  const google = preferred.find(v => v.name.toLowerCase().includes('google'));
  if (google) return google;
  
  const microsoft = preferred.find(v => v.name.toLowerCase().includes('microsoft'));
  if (microsoft) return microsoft;
  
  const samantha = preferred.find(v => v.name.toLowerCase().includes('samantha'));
  if (samantha) return samantha;
  
  const karen = preferred.find(v => v.name.toLowerCase().includes('karen'));
  if (karen) return karen;
  
  // 정확히 일치하는 언어 코드가 있으면 사용
  const exactMatch = preferred.find(v => v.lang === langCode);
  if (exactMatch) return exactMatch;
  
  return preferred[0] || voices[0] || null;
}

// 사용 가능한 음성 목록 가져오기
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  return voices.filter(v => v.lang.startsWith('en'));
}

// TTS 설정 인터페이스
export interface TTSSettings {
  accent?: 'us' | 'uk';
  rate?: number;
  pitch?: number;
  volume?: number;
  voiceName?: string;
}

// localStorage에서 TTS 설정 로드
export function loadTTSSettings(): TTSSettings {
  if (typeof window === 'undefined') return {};
  
  try {
    const saved = localStorage.getItem('tts-settings');
    return saved ? JSON.parse(saved) : { accent: 'us', rate: 1.0, pitch: 1.0, volume: 1.0 };
  } catch {
    return { accent: 'us', rate: 1.0, pitch: 1.0, volume: 1.0 };
  }
}

// TTS 설정 저장
export function saveTTSSettings(settings: TTSSettings): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('tts-settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save TTS settings:', error);
  }
}

// TTS로 텍스트 읽기
export function speakText(text: string, settings?: TTSSettings): Promise<void> {
  return new Promise(async (resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    // 음성 로드
    await loadVoices();
    
    // 설정 로드
    const userSettings = settings || loadTTSSettings();
    const accent = userSettings.accent || 'us';
    const rate = userSettings.rate || 1.0;
    const pitch = userSettings.pitch || 1.0;
    const volume = userSettings.volume || 1.0;

    const utterance = new SpeechSynthesisUtterance(text);
    
    // 음성 선택
    if (userSettings.voiceName) {
      const selectedVoice = voices.find(v => v.name === userSettings.voiceName);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    } else {
      const preferredVoice = getPreferredVoice(accent);
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }
    
    utterance.lang = accent === 'uk' ? 'en-GB' : 'en-US';
    utterance.rate = Math.max(0.5, Math.min(2.0, rate));
    utterance.pitch = Math.max(0.5, Math.min(2.0, pitch));
    utterance.volume = Math.max(0, Math.min(1.0, volume));

    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(event.error);

    window.speechSynthesis.speak(utterance);
  });
}

// TTS 중지
export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// TTS 지원 확인
export function isTTSSupported(): boolean {
  return 'speechSynthesis' in window;
}
