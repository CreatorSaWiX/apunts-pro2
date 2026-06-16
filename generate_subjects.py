import json

subjects_data = [
    # Q1
    ("F", "Física", "blue-400"),
    ("FM", "Fonaments Matemàtics", "rose-400"),
    ("IC", "Introducció als Computadors", "amber-400"),
    ("PRO1", "Programació I", "emerald-400"),
    # Q2
    ("EC", "Estructura de Computadors", "fuchsia-400"),
    ("M1", "Matemàtiques I", "violet-400"),
    ("M2", "Matemàtiques II", "cyan-400"),
    ("PRO2", "Programació II", "lime-400"),
    # Q3
    ("BD", "Bases de Dades", "sky-400"),
    ("CI", "Interfícies de Computadors", "orange-400"),
    ("EDA", "Estructures de Dades i Algorismes", "red-400"),
    ("PE", "Probabilitat i Estadística", "purple-400"),
    ("SO", "Sistemes Operatius", "teal-400"),
    # Q4
    ("AC", "Arquitectura de Computadors", "yellow-400"),
    ("EEE", "Empresa i Entorn Econòmic", "pink-400"),
    ("IDI", "Interacció i Disseny d'Interfícies", "indigo-400"),
    ("IES", "Introducció a l'Enginyeria del Software", "green-400"),
    ("XC", "Xarxes de Computadors", "rose-400"),
    # Q5
    ("PAR", "Paral·lelisme", "amber-400"),
    ("PROP", "Projectes de Programació", "cyan-400"),
    
    # Computació
    ("A", "Algorísmia", "emerald-400"),
    ("G", "Gràfics", "pink-400"),
    ("IA", "Intel·ligència Artificial", "indigo-400"),
    ("LI", "Lògica a la Informàtica", "slate-400"),
    ("LP", "Llenguatges de Programació", "blue-400"),
    ("TC", "Teoria de la Computació", "violet-400"),
    ("AA", "Ampliació d'Algorísmia", "teal-400"),
    ("APA", "Aprenentatge Automàtic", "purple-400"),
    ("CAIM", "Cerca i Anàlisi d'Informació Massiva", "amber-400"),
    ("CL", "Compiladors", "rose-400"),
    ("CN", "Computació Numèrica", "cyan-400"),
    ("IO", "Investigació Operativa", "orange-400"),
    ("SID", "Sistemes Intel·ligents Distribuïts", "fuchsia-400"),

    # Enginyeria de Computadors
    ("AC2", "Arquitectura de Computadors II", "red-400"),
    ("DSBM", "Disseny de Sistemes Basats en Microcomputadors", "lime-400"),
    ("MP", "Multiprocessadors", "sky-400"),
    ("PEC", "Projecte d'Enginyeria de Computadors", "yellow-400"),
    ("SO2", "Sistemes Operatius II", "green-400"),
    ("XC2", "Xarxes de Computadors II", "pink-400"),
    ("CASO", "Conceptes Avançats de Sistemes Operatius", "emerald-400"),
    ("CPD", "Centres de Processament de Dades", "blue-400"),
    ("PAP", "Programació i Arquitectures Paral·leles", "amber-400"),
    ("PCA", "Programació Conscient de l'Arquitectura", "orange-400"),
    ("PDS", "Processament Digital del Senyal", "violet-400"),
    ("STR", "Sistemes de Temps Real", "fuchsia-400"),
    ("VLSI", "VLSI", "cyan-400"),

    # Enginyeria del Software
    ("AS", "Arquitectura del Software", "indigo-400"),
    ("ASW", "Aplicacions i Serveis Web", "sky-400"),
    ("DBD", "Disseny de Bases de Dades", "teal-400"),
    ("ER", "Enginyeria de Requisits", "rose-400"),
    ("GPS", "Gestió de Projectes de Software", "amber-400"),
    ("PES", "Projecte d'Enginyeria del Software", "emerald-400"),
    ("CAP", "Conceptes Avançats de Programació", "blue-400"),
    ("CBDE", "Conceptes per a Bases de Dades Especialitzades", "cyan-400"),
    ("CSI", "Conceptes de Sistemes d'Informació", "violet-400"),
    ("ECSDI", "Enginyeria del Coneixement i Sistemes Distribuïts Intel·ligents", "fuchsia-400"),
    ("SIM", "Simulació", "orange-400"),
    ("SOAD", "Sistemes Operatius per a Aplicacions Distribuïdes", "pink-400"),

    # Sistemes d'informació
    ("ADEI", "Anàlisi de Dades i Explotació de la Informació", "purple-400"),
    ("DSI", "Disseny de Sistemes d'Informació", "blue-400"),
    ("NE", "Negoci Electrònic", "emerald-400"),
    ("PSI", "Projecte de Sistemes d'Informació", "amber-400"),
    ("SIO", "Sistemes d'Informació per a Les Organitzacions", "rose-400"),
    ("ABD", "Administració de Bases de Dades", "cyan-400"),
    ("EDO", "Estratègia Digital a Les Organitzacions", "orange-400"),
    ("MI", "Màrqueting a Internet", "pink-400"),
    ("VPE", "Viabilitat de Projectes Empresarials", "lime-400")
]

# De-duplicate by Acronym (some like ER, CAIM, IO are in multiple screenshots)
seen = set()
unique_subjects = []
for acronym, name, color in subjects_data:
    if acronym not in seen:
        seen.add(acronym)
        unique_subjects.append({
            "id": f"S{len(unique_subjects)+1}",
            "name": acronym,
            "colorToken": color,
            "description": name
        })

with open("src/data/subjects.json", "w", encoding="utf-8") as f:
    json.dump(unique_subjects, f, indent=4, ensure_ascii=False)

unique_colors = sorted(list(set(s["colorToken"] for s in unique_subjects)))
safelist_lines = [
    f"// bg-{c} text-{c} border-{c}/20 bg-{c}/10 text-{c.replace('400', '300')}"
    for c in unique_colors
]

print("\n".join(safelist_lines))
