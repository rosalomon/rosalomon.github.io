import whisper
import time
import logging
import warnings

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


# Ignorera specifika varningar
warnings.filterwarnings("ignore", category=FutureWarning)

# Starta tidtagningen
start_time = time.time()

try:
    logging.info("Startar transkribering...")

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
