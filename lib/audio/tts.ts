// Web Speech API를 사용한 TTS
export function speakText(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // 영어로 설정
    utterance.lang = 'en-US';
    utterance.rate = 1.0; // 정상 속도
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

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
