# AI-Powered Visual Data Analytics and Business Intelligence

An AI-powered visual analytics platform designed to transform safety-related visual and document data into actionable insights through computer vision, intelligent document processing, analytics, and interactive dashboards.

## Overview

The platform, **Vision Desk**, combines AI-based visual detection, document processing, data analytics, and intelligent investigation workflows into a unified system.

It helps users:

* Detect safety violations from visual data
* Process and analyze PDF, DOCX, and TXT documents
* Retrieve relevant information using semantic search
* Generate AI-assisted investigation insights
* Visualize incidents and safety trends through interactive dashboards
* Export analytical reports in CSV format

## Key Features

### 1. AI-Based Visual Detection

* YOLO-based object and safety-violation detection
* Image/video-based analysis
* Detection results integrated with the dashboard

### 2. Intelligent Document Processing

* PDF, DOCX, and TXT extraction
* OCR-based text extraction
* Text chunking and preprocessing
* Sentence-transformer embeddings
* ChromaDB-based semantic retrieval

### 3. AI-Powered Investigation

* Retrieval-Augmented Generation (RAG)
* Context-aware document retrieval
* AI-assisted investigation workflow
* Automated investigation report generation

### 4. Visual Analytics Dashboard

* Incident monitoring
* KPI cards and statistical summaries
* Interactive charts
* Incident filtering
* Department-wise violation analysis
* CSV report export

## Individual Enhancement

This repository contains my individual version of the team project developed during the internship.

My enhancement focuses on improving the **visual analytics and dashboard experience** by:

* Adding department-wise violation visualization
* Introducing department-based incident filtering
* Integrating existing backend analytics with the dashboard
* Improving the presentation of safety data for easier analysis

The core platform architecture and other modules were developed collaboratively as part of the internship team.

## Technology Stack

| Component           | Technologies                        |
| ------------------- | ----------------------------------- |
| Frontend            | HTML, CSS, JavaScript, Chart.js     |
| Backend             | Python, Flask                       |
| Computer Vision     | YOLO                                |
| AI / LLM            | Gemini                              |
| RAG                 | Sentence Transformers, ChromaDB     |
| Document Processing | PyMuPDF, python-docx, Tesseract OCR |
| Database            | SQLite                              |
| Data Export         | CSV                                 |
| Version Control     | Git, GitHub                         |

## Project Structure

```text
vision_desk_ai/
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── module5/
│   ├── agents.py
│   ├── run.py
│   ├── state.py
│   └── workflow.py
│
├── app.py
├── detector.py
├── document_processor.py
├── document_pipeline.py
├── embeddings.py
├── chunker.py
├── vector_store.py
├── database.py
├── requirements.txt
└── README.md
```

## Workflow

```text
Input Data
    ↓
Visual / Document Processing
    ↓
AI-Based Detection & Extraction
    ↓
Embedding & Semantic Retrieval
    ↓
AI Investigation
    ↓
Data Analytics
    ↓
Interactive Dashboard
    ↓
Reports & Insights
```

## Running the Project

### 1. Clone the repository

```bash
git clone https://github.com/skkiranmayee-789/AI-Powered-Visual-Data-Analytics.git
cd AI-Powered-Visual-Data-Analytics
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the application

```bash
python app.py
```

Open the local application in your browser using the address displayed by Flask.

## Project Context

**Project:** AI-Powered Visual Data Analytics and Business Intelligence
**Platform:** Vision Desk
**Development:** Internship Project
**Team:** 3 Members
**Individual Repository:** Kiranmayee Sivvam

## License

This project was developed for educational and internship purposes.
