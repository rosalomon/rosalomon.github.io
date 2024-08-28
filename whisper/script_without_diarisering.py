import whisper
import time

# Funktion för att konvertera sekunder till mm:ss-format
def seconds_to_mmss(seconds):
    minutes = int(seconds // 60)
    seconds = int(seconds % 60)
    return f"{minutes:02}:{seconds:02}"

# Starta tidtagningen
start_time = time.time()

# Ladda Whisper-modellen (byt till en större modell om du vill)
model = whisper.load_model("medium")

# Transkribera och få resultatet
result = model.transcribe(r"C:\Users\robras\projekt\git\rosalomon.github.io\whisper\output.wav")

# Öppna filen för att skriva transkriberingen med tidsstämplar i mm:ss-format
with open("transcription_with_timestamps_mmss.txt", "w") as f:
    for segment in result['segments']:
        start = seconds_to_mmss(segment['start'])
        end = seconds_to_mmss(segment['end'])
        text = segment['text']
        f.write(f"[{start} - {end}] {text}\n")

# Sluta tidtagningen
end_time = time.time()

# Beräkna den totala exekveringstiden
execution_time = end_time - start_time

# Konvertera till timmar, minuter och sekunder
hours = int(execution_time // 3600)
minutes = int((execution_time % 3600) // 60)
seconds = int(execution_time % 60)

# Skriv ut den formaterade tiden i konsolen
print(f"Scriptet tog {hours} timmar, {minutes} minuter och {seconds} sekunder att köra.")
