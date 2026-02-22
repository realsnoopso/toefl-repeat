// Web Audio API로 비프음 생성
export function playBeep(): Promise<void> {
  return new Promise((resolve) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // 440Hz 비프음
      oscillator.frequency.value = 440;
      oscillator.type = 'sine';

      // 볼륨 설정
      gainNode.gain.value = 0.3;

      // 0.3초 재생
      const duration = 0.3;
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);

      oscillator.onended = () => {
        audioContext.close();
        resolve();
      };
    } catch (error) {
      console.error('Beep sound error:', error);
      resolve();
    }
  });
}
