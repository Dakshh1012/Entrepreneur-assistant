import pyaudio
import wave
import requests

# Configuration
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100
CHUNK = 1024
AUDIO_FILE = "audio.wav"
RECORD_SECONDS = 10  # Default recording time

# PyAudio setup
audio = pyaudio.PyAudio()

def record_audio():
    print("🎙️ Recording started...")
    stream = audio.open(format=FORMAT, channels=CHANNELS,
                        rate=RATE, input=True,
                        frames_per_buffer=CHUNK)

    frames = []
    try:
        while True:
            data = stream.read(CHUNK)
            frames.append(data)
    except KeyboardInterrupt:
        print("\n🛑 Recording stopped.")
    
    stream.stop_stream()
    stream.close()

    # Save audio to file
    wf = wave.open(AUDIO_FILE, 'wb')
    wf.setnchannels(CHANNELS)
    wf.setsampwidth(audio.get_sample_size(FORMAT))
    wf.setframerate(RATE)
    wf.writeframes(b''.join(frames))
    wf.close()

    print("✅ Audio saved!")

def send_audio():
    print("📤 Sending audio to backend...")
    url = "http://127.0.0.1:5000/analyze_pitch"
    files = {"file": open(AUDIO_FILE, "rb")}
    response = requests.post(url, files=files)
    print("📩 Response from backend:", response.json())

if __name__ == "__main__":
    record_audio()
    send_audio()
