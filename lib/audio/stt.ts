/**
 * Browser Speech-to-Text using Web Speech API (SpeechRecognition)
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export function startSpeechRecognition(
  onResult: (transcript: string) => void,
  onError?: (error: string) => void,
): { stop: () => void } {
  const W = window as any;
  const SpeechRecognitionCtor = W.SpeechRecognition || W.webkitSpeechRecognition;

  if (!SpeechRecognitionCtor) {
    onError?.('Speech recognition not supported in this browser');
    return { stop: () => {} };
  }

  const recognition = new SpeechRecognitionCtor();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = true;

  let fullTranscript = '';

  recognition.onresult = (event: any) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        const text = event.results[i][0].transcript.trim();
        fullTranscript += (fullTranscript ? ' ' : '') + text;
        onResult(fullTranscript);
      }
    }
  };

  recognition.onerror = (event: any) => {
    if (event.error !== 'aborted') {
      onError?.(event.error);
    }
  };

  recognition.start();

  return {
    stop: () => {
      try { recognition.stop(); } catch { /* ignore */ }
    },
  };
}
