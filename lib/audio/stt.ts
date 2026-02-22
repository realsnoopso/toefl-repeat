// Web Speech API를 사용한 STT
export interface STTResult {
  transcript: string;
  confidence: number;
}

export function startSpeechRecognition(onResult: (result: STTResult) => void, onError: (error: any) => void): any {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    onError(new Error('Speech recognition not supported'));
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;

  recognition.onresult = (event: any) => {
    const result = event.results[0][0];
    onResult({
      transcript: result.transcript,
      confidence: result.confidence || 0.9
    });
  };

  recognition.onerror = (event: any) => {
    onError(event.error);
  };

  recognition.start();
  return recognition;
}

// 오디오 Blob을 STT로 변환 (Web Speech API는 실시간만 지원하므로 대체 방법)
export function transcribeAudioBlob(blob: Blob): Promise<STTResult> {
  return new Promise((resolve, reject) => {
    // Web Speech API는 Blob을 직접 지원하지 않음
    // 실제로는 Whisper API를 사용해야 하지만, MVP에서는 실시간 인식 결과를 사용
    reject(new Error('Blob transcription requires server-side API (e.g., Whisper)'));
  });
}

// STT 지원 확인
export function isSTTSupported(): boolean {
  return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
}
