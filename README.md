# SkillBot: Enhanced Personalized Learning with Knowledge Graphs and Prompt Engineering

[![National College of Ireland](https://img.shields.io/badge/Institution-National%20College%20of%20Ireland-blue)](https://www.ncirl.ie/)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**SkillBot** is an AI-powered web application that delivers truly personalized learning experiences by combining **Large Language Models (LLMs)**, **Knowledge Graphs (KGs)**, and advanced **prompt engineering**.  

Developed as an MSc Research Project in Data Analytics at the National College of Ireland (2024), SkillBot helps users build skills in programming, language learning, problem-solving, and general knowledge through adaptive learning paths, real-time assessments, and job-market-aligned recommendations.

### Key Highlights
- **87% recommendation accuracy** (Precision 0.87, F1-score 0.84)
- **86.2/100 SUS usability score** (Excellent rating)
- **23% average skill knowledge gain** after use
- **Sub-500ms response time** (production-ready performance)

## Features
- Interactive chatbot with multi-turn conversations and context awareness
- Hybrid recommendation engine (collaborative filtering + content-based + KG reasoning)
- Dynamic, personalized learning paths based on progress, goals, and job market trends
- Knowledge graph with 2.3 million triples and TransE embeddings (97% factual accuracy)
- Real-time skill assessments and immediate feedback
- Secure user profiles with JWT/RBAC authentication

## Tech Stack
| Layer              | Technologies                              |
|--------------------|-------------------------------------------|
| Frontend           | React.js, Redux, Tailwind CSS, WebSockets |
| Backend            | Python Flask, Express.js, JWT/RBAC        |
| Databases          | Neo4j (Knowledge Graph), SQLite, Redis    |
| AI/ML              | GPT-3.5 (fine-tuned), RAG, BRTE prompts   |
| Deployment         | Docker, AWS ECS                           |
| Data Sources       | MOOC datasets, job postings, applicant data (via Hugging Face) |

## Installation & Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/skillbot.git
cd skillbot

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && pip install -r requirements.txt

# Set up environment variables (OpenAI key, DB URIs, etc.)
cp .env.example .env

# Start everything with Docker
docker-compose up --build
```

Open your browser at `http://localhost:3000`

## Repository Structure
```
skillbot/
├── backend/          # Flask API & AI logic
├── frontend/         # React application
├── data/             # Scripts to build & load knowledge graph
├── docs/             # Thesis, architecture diagrams, evaluation results
├── docker-compose.yml
└── README.md
```

## Evaluation Results
Tested on 50 diverse participants:

| Metric              | SkillBot | CF Baseline | LLM Baseline |
|---------------------|----------|-------------|--------------|
| Precision           | 0.87     | 0.61        | 0.75         |
| Recall              | 0.82     | 0.58        | 0.70         |
| F1-Score            | 0.84     | 0.59        | 0.72         |

- **SUS Usability**: 86.2/100
- **Engagement**: 78% 7-day return rate
- Outperformed baselines by 12–15%

## Full Documentation
The complete thesis (PDF) is available in the `docs/` folder:  
[Enhanced Personalized Learning Experiences by Leveraging Knowledge Graphs and Prompt Engineering](docs/thesis.pdf)

## License
MIT License – see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Supervisor: Jorge Basilio
- Institution: School of Computing, National College of Ireland
- Datasets: Hugging Face collections (MOOC, Job Skills, Applicant data)

For questions or collaboration, feel free to open an issue or contact the author:  
Malav Naik (x23271779@student.ncirl.ie)

# SkillBot AI-Driven Personalized Learning Platform

