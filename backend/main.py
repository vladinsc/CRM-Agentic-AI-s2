import fastapi
import fastapi.middleware.cors
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import random

app = fastapi.FastAPI()

app.add_middleware(
    fastapi.middleware.cors.CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============ Models ============

class Lead(BaseModel):
    id: str
    name: str
    company: str
    email: str
    phone: str
    score: int
    deal_value: int
    last_activity: str
    buying_signals: list[str]
    winning_argument: str
    draft_message: str

class Activity(BaseModel):
    id: str
    type: str
    message: str
    lead_name: Optional[str] = None
    timestamp: str
    status: str

class CopilotResponse(BaseModel):
    winning_argument: str
    draft_message: str
    quick_insights: list[str]

# ============ Mock Data ============

LEADS_DATA = [
    Lead(
        id="1",
        name="Alexandru Popescu",
        company="TechVision SRL",
        email="alexandru@techvision.ro",
        phone="+40 721 234 567",
        score=92,
        deal_value=45000,
        last_activity="Acum 2 ore",
        buying_signals=["A vizualizat pricing de 3 ori", "A deschis propunerea"],
        winning_argument="TechVision tocmai a primit o rundă de finanțare Series A. Alexandru caută soluții de scalare rapidă. Pune accent pe ROI-ul măsurabil și implementarea în 2 săptămâni.",
        draft_message="Bună Alexandru,\\n\\nAm observat că TechVision e într-o fază de creștere accelerată - felicitări pentru Series A!\\n\\nȘtiu că scalarea rapidă vine cu provocări operaționale. Am ajutat companii similare să reducă timpul de onboarding cu 60%.\\n\\nAi 15 minute săptămâna asta pentru un call scurt?\\n\\nSucces,"
    ),
    Lead(
        id="2",
        name="Maria Ionescu",
        company="DataFlow Systems",
        email="maria@dataflow.io",
        phone="+40 722 345 678",
        score=87,
        deal_value=32000,
        last_activity="Acum 5 ore",
        buying_signals=["Demo solicitat", "Întrebare despre integrări"],
        winning_argument="Maria e CTO și decide singură. DataFlow folosește deja un competitor, dar au probleme cu integrările. Subliniază ecosistemul deschis și API-ul nostru.",
        draft_message="Bună Maria,\\n\\nAm înțeles că integrările sunt o prioritate pentru DataFlow.\\n\\nAPI-ul nostru se conectează nativ cu toate tool-urile pe care le folosiți deja - Slack, Jira, GitHub.\\n\\nPoți vedea un demo personalizat de 20 de minute?\\n\\nCu drag,"
    ),
    Lead(
        id="3",
        name="Andrei Mihai",
        company="CloudNine Solutions",
        email="andrei@cloudnine.ro",
        phone="+40 723 456 789",
        score=78,
        deal_value=28000,
        last_activity="Ieri",
        buying_signals=["Newsletter subscriber", "Whitepaper descărcat"],
        winning_argument="Andrei e în faza de research. CloudNine are nevoie de compliance GDPR. Trimite-i case study-ul cu banca din România.",
        draft_message="Bună Andrei,\\n\\nAm văzut că ai descărcat whitepaper-ul nostru despre automatizare.\\n\\nȘtiu că în fintech, compliance-ul GDPR e critic. Am pregătit un case study cu o bancă din România care a rezolvat exact această provocare.\\n\\nȚi-l trimit?\\n\\nCu respect,"
    ),
    Lead(
        id="4",
        name="Elena Dumitrescu",
        company="GrowthLab Agency",
        email="elena@growthlab.ro",
        phone="+40 724 567 890",
        score=71,
        deal_value=18000,
        last_activity="Acum 2 zile",
        buying_signals=["Webinar participant"],
        winning_argument="Elena lucrează cu multiple branduri și are nevoie de rapoarte consolidate. Arată-i dashboard-ul multi-client și automatizările de reporting.",
        draft_message="Bună Elena,\\n\\nMulțumesc că ai participat la webinar-ul nostru!\\n\\nPentru o agenție ca GrowthLab, știu că raportarea către clienți consumă timp. Dashboard-ul nostru generează automat rapoarte white-label.\\n\\nVrei să vezi cum arată pentru agenții?\\n\\nSucces,"
    ),
    Lead(
        id="5",
        name="Cristian Stancu",
        company="LogiTech Transport",
        email="cristian@logitech-transport.ro",
        phone="+40 725 678 901",
        score=54,
        deal_value=52000,
        last_activity="Acum 5 zile",
        buying_signals=["Cold outreach response"],
        winning_argument="LogiTech are flotă mare și costuri ridicate. Cristian e CFO - vorbește în termeni de reducere costuri, nu features. ROI în 6 luni.",
        draft_message="Bună Cristian,\\n\\nMultă lume din logistică ne spune că costurile cu combustibilul și rutele ineficiente sunt o problemă mare.\\n\\nClienții noștri din transport au redus costurile operaționale cu 23% în primele 6 luni.\\n\\nAre sens să discutăm numerele pentru LogiTech?\\n\\nCu stimă,"
    ),
]

ACTIVITIES_DATA = [
    Activity(
        id="1",
        type="research",
        message="Am cercetat profilul companiei TechVision SRL",
        lead_name="Alexandru Popescu",
        timestamp="Acum 2 min",
        status="completed"
    ),
    Activity(
        id="2",
        type="email_draft",
        message="Am pregătit un draft de email personalizat",
        lead_name="Maria Ionescu",
        timestamp="Acum 5 min",
        status="completed"
    ),
    Activity(
        id="3",
        type="signal",
        message="Am detectat un semnal de cumpărare: vizită repetată pe pagina de prețuri",
        lead_name="Alexandru Popescu",
        timestamp="Acum 12 min",
        status="alert"
    ),
    Activity(
        id="4",
        type="analysis",
        message="Am actualizat scorul de intenție bazat pe comportament recent",
        lead_name="Andrei Mihai",
        timestamp="Acum 18 min",
        status="completed"
    ),
    Activity(
        id="5",
        type="enrichment",
        message="Am îmbogățit datele cu informații din LinkedIn",
        lead_name="Elena Dumitrescu",
        timestamp="Acum 25 min",
        status="completed"
    ),
]

# ============ Endpoints ============

@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "agentic-crm-backend"}


@app.get("/leads")
async def get_leads() -> list[Lead]:
    """Get all leads sorted by score (intent) descending"""
    return sorted(LEADS_DATA, key=lambda x: x.score, reverse=True)


@app.get("/leads/{lead_id}")
async def get_lead(lead_id: str) -> Lead:
    """Get a specific lead by ID"""
    for lead in LEADS_DATA:
        if lead.id == lead_id:
            return lead
    raise fastapi.HTTPException(status_code=404, detail="Lead not found")


@app.get("/activities")
async def get_activities() -> list[Activity]:
    """Get recent AI activities"""
    return ACTIVITIES_DATA


@app.get("/activities/stream")
async def get_activity_stream() -> Activity:
    """Get a new simulated AI activity (for real-time simulation)"""
    activity_templates = [
        {"type": "research", "message": "Am analizat ultimele știri despre {company}"},
        {"type": "email_draft", "message": "Am optimizat subiectul emailului pentru {name}"},
        {"type": "signal", "message": "Am detectat activitate pe website de la {company}"},
        {"type": "analysis", "message": "Am recalculat scorul de intenție pentru {name}"},
        {"type": "enrichment", "message": "Am găsit conexiuni comune pe LinkedIn cu {name}"},
    ]
    
    lead = random.choice(LEADS_DATA)
    template = random.choice(activity_templates)
    
    return Activity(
        id=str(random.randint(100, 999)),
        type=template["type"],
        message=template["message"].format(name=lead.name, company=lead.company),
        lead_name=lead.name,
        timestamp="Acum",
        status="completed" if template["type"] != "signal" else "alert"
    )


@app.get("/copilot/{lead_id}")
async def get_copilot_insights(lead_id: str) -> CopilotResponse:
    """Get AI copilot insights for a specific lead"""
    for lead in LEADS_DATA:
        if lead.id == lead_id:
            return CopilotResponse(
                winning_argument=lead.winning_argument,
                draft_message=lead.draft_message,
                quick_insights=[
                    f"Scor de închidere: {lead.score}%",
                    f"Valoare deal: €{lead.deal_value:,}",
                    f"Ultima activitate: {lead.last_activity}",
                ]
            )
    raise fastapi.HTTPException(status_code=404, detail="Lead not found")


@app.get("/stats")
async def get_stats() -> dict:
    """Get dashboard statistics"""
    total_leads = len(LEADS_DATA)
    hot_leads = len([l for l in LEADS_DATA if l.score >= 80])
    warm_leads = len([l for l in LEADS_DATA if 60 <= l.score < 80])
    total_pipeline = sum(l.deal_value for l in LEADS_DATA)
    
    return {
        "total_leads": total_leads,
        "hot_leads": hot_leads,
        "warm_leads": warm_leads,
        "total_pipeline": total_pipeline,
        "ai_actions_today": 47,
        "avg_score": sum(l.score for l in LEADS_DATA) // total_leads,
    }
