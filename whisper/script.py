import os
import whisper
from pyannote.audio import Pipeline
import time
import logging

# Konfigurera loggning
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s - %(message)s', 
                    handlers=[
                        logging.FileHandler("script_log.log"),  # Loggar till fil
                        logging.StreamHandler()  # Loggar till konsolen
                    ])

# Funktion för att konvertera sekunder till mm:ss-format
def seconds_to_mmss(seconds):
    minutes = int(seconds // 60)
    seconds = int(seconds % 60)
    return f"{minutes:02}:{seconds:02}"

# Starta tidtagningen
start_time = time.time()

try:
    # Hämta Hugging Face-token från miljövariabeln
    hugging_face_token = os.getenv("HUGGING_FACE_TOKEN")
    if not hugging_face_token:
        raise ValueError("Miljövariabeln 'HUGGING_FACE_TOKEN' är inte satt.")

    logging.info("Startar talardiarisering...")
    
    # Ladda pyannote.audio-pipelinen för talardiarisering med din Hugging Face-token
    pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization", use_auth_token=hugging_face_token)

    # Kör talardiarisering på din ljudfil
    diarization = pipeline(r"C:\Users\robras\projekt\git\rosalomon.github.io\whisper\output.wav")
    logging.info("Diarisering slutförd.")
    
    logging.info("Startar transkribering...")
    
    # Ladda Whisper-modellen (byt till en större modell om du vill)
    model = whisper.load_model("medium")

    # Öppna filen för att skriva transkriberingen med tidsstämplar och talaridentifiering i mm:ss-format
    with open("transcription_with_speakers.txt", "w") as f:
        for segment in diarization.itertracks(yield_label=True):
            start_time_seconds = segment[0].start
            end_time_seconds = segment[0].end
            speaker = segment[2]  # Talare identifierad av pyannote.audio
            
            # Transkribera segmentet med Whisper
            audio_segment = whisper.load_audio(r"C:\Users\robras\projekt\git\rosalomon.github.io\whisper\output.wav", sr=16000)[int(start_time_seconds*16000):int(end_time_seconds*16000)]
            result = model.transcribe(audio_segment)

            # Konvertera tidsstämplar till mm:ss-format
            start = seconds_to_mmss(start_time_seconds)
            end = seconds_to_mmss(end_time_seconds)

            # Skriv ut transkriberingen tillsammans med talarens ID
            f.write(f"[{start} - {end}] {speaker}: {result['text']}\n")

    logging.info("Transkribering slutförd.")

except Exception as e:
    logging.error(f"Ett fel uppstod: {e}")

finally:
    # Sluta tidtagningen
    end_time = time.time()

    # Beräkna den totala exekveringstiden
    execution_time = end_time - start_time

    # Konvertera till timmar, minuter och sekunder
    hours = int(execution_time // 3600)
    minutes = int((execution_time % 3600) // 60)
    seconds = int(execution_time % 60)

    # Logga den formaterade tiden
    logging.info(f"Scriptet tog {hours} timmar, {minutes} minuter och {seconds} sekunder att köra.")
