export const playAlarmSound = () => {
  const audio = new Audio('/alarm-sound.mp3'); // You'll need to add this file to your public folder
  audio.play();
}; 