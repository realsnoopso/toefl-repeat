/**
 * Browser Speech-to-Text using Web Speech API
 * Falls back gracefully if not supported
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export function isSttSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const W = window as any;
  return !!(W.SpeechRecognition || W.webkitSpeechRecognition);
}

export function startSpeechRecognition(
  onResult: (transcript: string) => void,
  onError?: (error: string) => void,
): { stop: () => void } {
  const W = window as any;
  const SpeechRecognitionCtor = W.SpeechRecognition || W.webkitSpeechRecognition;

  if (!SpeechRecognitionCtor) {
    onError?.('not-supported');
    return { stop: () => {} };
  }

  let stopped = false;
  let fullTranscript = '';
  let recognition: any = null;

  function createRecognition() {
    const r = new SpeechRecognitionCtor();
    r.lang = 'en-US';
    r.interimResults = true;
    r.maxAlternatives = 1;
    r.continuous = true;

    r.onresult = (event: any) => {
      let interim = '';
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          const text = event.results[i][0].transcript.trim();
          if (text) {
            fullTranscript += (fullTranscript ? ' ' : '') + text;
          }
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      onResult(fullTranscript + (interim ? ' ' + interim : ''));
    };

    r.onerror = (event: any) => {
      // 'no-speech' and 'aborted' are expected, don't report
      if (event.error !== 'aborted' && event.error !== 'no-speech') {
        onError?.(event.error);
      }
    };

    r.onend = () => {
      // Auto-restart if not manually stopped (recognition can end prematurely)
      if (!stopped) {
        try { r.start(); } catch { /* ignore */ }
      }
    };

    return r;
  }

  try {
    recognition = createRecognition();
    recognition.start();
  } catch {
    onError?.('start-failed');
  }

  return {
    stop: () => {
      stopped = true;
      try { recognition?.stop(); } catch { /* ignore */ }
    },
  };
}
