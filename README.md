# SkillBot: Enhanced Personalized Learning with Knowledge Graphs and Prompt Engineering

[![National College of Ireland](https://img.shields.io/badge/Institution-National%20College%20of%20Ireland-blue)](https://www.ncirl.ie/)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**SkillBot** is an AI-powered web application that delivers truly personalized learning experiences by combining **Large Language Models (LLMs)**, **Knowledge Graphs (KGs)**, and advanced **prompt engineering**.  

Developed as an MSc Research Project in Data Analytics at the National College of Ireland (2024), SkillBot helps users build skills in programming, language learning, problem-solving, and general knowledge through adaptive learning paths, real-time assessments, and job-market-aligned recommendations.

### Key Highlights (reported in the thesis)
- **87% recommendation accuracy** (Precision 0.87, F1-score 0.84)
- **86.2/100 SUS usability score** (Excellent rating)
- **23% average skill knowledge gain** after use
- **Sub-500ms response time** (production-ready performance)

## Features (full system, as described in the thesis)
- Interactive chatbot with multi-turn conversations and context awareness
- Hybrid recommendation engine (collaborative filtering + content-based + KG reasoning)
- Dynamic, personalized learning paths based on progress, goals, and job market trends
- Knowledge graph with 2.3 million triples and TransE embeddings (97% factual accuracy)
- Real-time skill assessments and immediate feedback
- Secure user profiles with JWT/RBAC authentication

## Tech Stack (full system, as described in the thesis)
| Layer              | Technologies                              |
|--------------------|-------------------------------------------|
| Frontend           | React.js, Redux, Tailwind CSS, WebSockets |
| Backend            | Python Flask, Express.js, JWT/RBAC        |
| Databases          | Neo4j (Knowledge Graph), SQLite, Redis    |
| AI/ML              | GPT-3.5 (fine-tuned), RAG, BRTE prompts   |
| Deployment         | Docker, AWS ECS                           |
| Data Sources       | MOOC datasets, job postings, applicant data (via Hugging Face) |

## What's in this repository
The code of the full system described in the thesis (web app, knowledge graph, fine-tuned model) is not public. This repository holds:

| File / folder | What it is |
|---|---|
| `Enhanced_Personalized_Learning_Experiences_..._Prompt_Engineering (1).pdf` | The thesis |
| `Enhanced-Personalized-Learning-Experiences-...pptx` | Presentation slides |
| `EDA_for_datasets.ipynb` | Exploration of the job-post, MOOC and applicant datasets, including a job–skill graph |
| `Skill_Bot_LLM_create_and_devloped_for_huggingface_1.ipynb`, `Run_huggingface_skilbot_LLM_locally_2.ipynb` | An early prototype: an open model (Gemma-7B) fine-tuned on job posts to suggest skills, and a notebook to serve it |
| `skills-explorer/` | **A free, tested rebuild** of the core idea, job title → skills, that runs in the browser (see below) |

## Skills explorer (free rebuild, 2026)
Type a job title and see the skills the most similar real job ads ask for: **[try it on Hugging Face](https://huggingface.co/spaces/Malavnaik/skillbot-skills-explorer)**.

- Data: [job-skill-set](https://huggingface.co/datasets/batuhanmtl/job-skill-set) by Batuhan Mutlu, from [LinkedIn Job Postings](https://www.kaggle.com/datasets/arshkon/linkedin-job-postings) by Arsh Koneru (both CC BY-SA 4.0): 1,167 ads in five job areas. Only job titles, areas and skill lists are used.
- Method: `all-MiniLM-L6-v2` matches the typed title to the 25 most similar ads; their skills plus the skills typical of their job area are counted.
- Test (leave-one-out, each ad hidden in turn): **48%** of the 10 suggested skills appear in the real ad, against 47% for listing the most common skills of the ad's (known) area.
- Rebuild it: run the *Skills explorer* workflow in the Actions tab (`skills-explorer/prep.py` → `embed.mjs` → static Space).

## Evaluation Results (reported in the thesis)
From the thesis study with 50 participants:

| Metric              | SkillBot | CF Baseline | LLM Baseline |
|---------------------|----------|-------------|--------------|
| Precision           | 0.87     | 0.61        | 0.75         |
| Recall              | 0.82     | 0.58        | 0.70         |
| F1-Score            | 0.84     | 0.59        | 0.72         |

- **SUS Usability**: 86.2/100
- **Engagement**: 78% 7-day return rate
- Outperformed baselines by 12–15%

## Full Documentation
The complete thesis is in this repository (PDF) and in the [NCI research repository](https://norma.ncirl.ie/9439/).

## License
Code: MIT. The skills explorer's data is CC BY-SA 4.0 (see the credits above).

## Acknowledgments
- Supervisor: Jorge Basilio
- Institution: School of Computing, National College of Ireland
- Datasets: Hugging Face collections (MOOC, Job Skills, Applicant data)

For questions or collaboration, feel free to open an issue or contact the author:  
Malav Naik (x23271779@student.ncirl.ie)

# SkillBot AI-Driven Personalized Learning Platform

