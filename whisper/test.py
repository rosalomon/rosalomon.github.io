import os

# Kontrollera att miljövariabeln är korrekt laddad
hugging_face_token = os.getenv("HUGGING_FACE_TOKEN")
if hugging_face_token is None:
    raise ValueError("Miljövariabeln 'HUGGING_FACE_TOKEN' är inte satt.")

print(f"Hugging Face Token: {hugging_face_token}")
