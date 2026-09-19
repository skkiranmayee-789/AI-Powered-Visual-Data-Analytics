# Vision Desk AI — Individual Project Version

## AI-Powered Visual Data Analytics and Business Intelligence

This repository is an individual enhanced version of the team's Vision Desk AI internship project.

### Core capabilities
- YOLO-based visual safety detection
- Document processing and RAG
- Vector-based semantic retrieval
- Gemini-powered intelligence
- Agentic workplace investigation workflow
- Flask backend with SQLite
- Interactive safety analytics dashboard
- CSV audit report export

### Individual enhancement
The individual version extends the team's dashboard analytics with:
1. Department-wise violation visualization using Chart.js.
2. Department-level filtering in the incident audit table.
3. Integration of department analytics with the existing dashboard metrics API.

The enhancement reuses the existing backend aggregation (`by_department`) and adds a dedicated visualization/filtering layer without changing the core detection, RAG, or agentic workflow modules.

## Run
```bash
pip install -r requirements.txt
python app.py
```

Open `http://127.0.0.1:5000` in a browser.

## Note
This repository is based on the team's internship project and contains an additional individual analytics enhancement.
