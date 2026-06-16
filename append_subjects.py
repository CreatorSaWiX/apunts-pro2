import json
import os

new_subjects_data = [
    # Optativa
    ("APC", "Arquitectura del PC", "blue-400"),
    ("APSS", "Habilitats Acadèmiques i Professionals d'Expressió Oral en Anglès", "emerald-400"),
    ("ASDP", "Habilitats Acadèmiques Pel Desenvolupament de Projectes en Anglès", "amber-400"),
    ("ASMI", "Aspectes Socials i Mediambientals de la Informàtica", "fuchsia-400"),
    ("C", "Criptografia", "indigo-400"),
    ("CCQ", "Computació i Criptografia Quàntiques", "sky-400"),
    ("CDI", "Compressió de Dades i Imatges", "violet-400"),
    ("DCS", "Disseny de Corbes i Superfícies", "pink-400"),
    ("EET", "Educació, Enginyeria i Tecnologia", "lime-400"),
    ("FDM", "Física dels Dispositius de Memòria", "cyan-400"),
    ("FOMAR", "Física Orientada a la Modelització i l'Animació Realista", "rose-400"),
    ("GCS", "Gestió de la Ciberseguretat", "teal-400"),
    ("GEOC", "Geometria Computacional", "orange-400"),
    ("I2R3", "Introducció a la Recerca (3)", "purple-400"),
    ("I2R6", "Introducció a la Recerca (6)", "red-400"),
    ("LDPE", "Lideratge i Desenvolupament Professional a l'Enginyeria", "amber-400"),
    ("MD", "Mineria de Dades", "emerald-400"),
    ("PAE", "Projecte Aplicat d'Enginyeria", "blue-400"),
    ("ROB", "Robòtica", "slate-400"),
    ("SLDS", "Software Lliure i Desenvolupament Social", "lime-400"),
    ("TGA", "Targetes Gràfiques i Acceleradors", "pink-400"),
    ("VC", "Visió per Computador", "cyan-400"),
    ("VJ", "Videojocs", "fuchsia-400"),
    ("WSE", "Habilitats d'Expressió Escrita en Anglès per a l'Enginyeria", "violet-400"),

    # Tecnologies de la informació
    ("ASO", "Administració de Sistemes Operatius", "teal-400"),
    ("PI", "Protocols d'Internet", "sky-400"),
    ("PTI", "Projecte de Tecnologies de la Informació", "rose-400"),
    ("SI", "Seguretat Informàtica", "indigo-400"),
    ("SOA", "Sistemes Operatius Avançats", "emerald-400"),
    ("TXC", "Tecnologies de Xarxes de Computadors", "amber-400"),
    ("AD", "Aplicacions Distribuïdes", "pink-400"),
    ("CASO", "Conceptes Avançats de Sistemes Operatius", "cyan-400"),
    ("CPD", "Centres de Processament de Dades", "blue-400"),
    ("IM", "Internet Mòbil", "orange-400"),
    ("SDX", "Sistemes Distribuïts en Xarxa", "fuchsia-400"),
    ("TCI", "Transmissió i Codificació de la Informació", "lime-400")
]

file_path = "src/data/subjects.json"
if os.path.exists(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        existing_subjects = json.load(f)
else:
    existing_subjects = []

existing_acronyms = set([s["name"] for s in existing_subjects])

for acronym, name, color in new_subjects_data:
    if acronym not in existing_acronyms:
        existing_acronyms.add(acronym)
        existing_subjects.append({
            "id": f"S{len(existing_subjects)+1}",
            "name": acronym,
            "colorToken": color,
            "description": name
        })

with open(file_path, "w", encoding="utf-8") as f:
    json.dump(existing_subjects, f, indent=4, ensure_ascii=False)

print("Done. Appended", len(existing_subjects), "total subjects.")
