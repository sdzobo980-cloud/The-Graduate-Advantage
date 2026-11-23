import type { ExperienceLevel } from '../types/career.ts';

export const SAMPLE_GRADUATE_CV = `MAYA PATEL
Bristol, United Kingdom | maya.patel.example@mail.org | github.com/mayapatel-demo

PERSONAL PROFILE
Final-year BSc Computer Science & Data Analytics student seeking an entry-level data analyst or graduate business technology role. Interested in turning operational datasets into clear decisions.

EDUCATION
University of Bristol — BSc (Hons) Computer Science & Data Analytics (2023 – 2026, Expected 2:1)
Relevant Modules: Statistical Modelling, Database Systems, Machine Learning Fundamentals, Software Engineering Group Project, Data Visualisation.

ACADEMIC PROJECTS
Regional Transit Delay Explorer (Final Year Dissertation Project, 2025 – 2026)
- Collected and cleaned 180,000 public bus schedule records in Python (pandas) and SQL.
- Built an interactive dashboard highlighting peak-hour route bottlenecks and wrote a 9,000-word analytical report.

University Society Budget Tracker (Group Software Project, 2024)
- Collaborated in a team of 4 to design a PostgreSQL schema and React front-end for student society treasurers.
- Wrote automated data validation checks and presented the prototype to faculty assessors.

WORK & LEADERSHIP EXPERIENCE
Shift Supervisor (Part-Time) — Cornerstone Coffee Roasters, Bristol (Oct 2024 – Present)
- Supervised 3–4 student baristas during weekend shifts and managed daily stock replenishment.
- Helped reduce morning queue wait times by reorganising prep station workflows.

Undergraduate Peer Mentor — University of Bristol Computing Department (Sep 2024 – May 2025)
- Supported 12 first-year undergraduates with weekly study check-ins and introductory Python lab guidance.

SKILLS
Technical: Python (pandas, scikit-learn), SQL (PostgreSQL), Excel (pivot tables, XLOOKUP), Git, Tableau, React basics.
Transferable: Written reporting, team coordination, stakeholder presentation, customer service.`;

export const SAMPLE_JOB_DESCRIPTION = `Graduate Data & Operations Analyst — Harbourview Logistics Group
Location: Bristol / Hybrid | Contract: Full-time Graduate Programme (24 months)

About the Role:
We are looking for a curious, structured Graduate Data & Operations Analyst to join our Supply Chain Insights team. You will work alongside operations managers and senior analysts to clean operational datasets, build weekly performance reports, and investigate delivery bottlenecks across regional depots.

Key Responsibilities:
- Clean, validate, and query operational shipping datasets using SQL and Python.
- Maintain and improve weekly performance dashboards in Power BI or Tableau.
- Partner with depot managers to translate data findings into practical process improvements.
- Present monthly summary findings clearly to non-technical stakeholders.

Requirements:
- Bachelor's degree in Computer Science, Data Analytics, Mathematics, Economics, or a related quantitative discipline.
- Practical experience with SQL querying and Python or R for data analysis (academic projects welcome).
- Experience using Excel and at least one BI visualisation tool (Power BI, Tableau, or Looker).
- Strong written and verbal communication skills, with the ability to explain findings to non-technical audiences.
- Desirable: Experience with cloud data warehouses (Snowflake or BigQuery) and A/B testing or forecasting.`;

export const SAMPLE_INTERVIEW_INPUT: {
  jobTitle: string;
  companyOrIndustry: string;
  jobDescription: string;
  experienceLevel: ExperienceLevel;
} = {
  jobTitle: 'Graduate Data & Operations Analyst',
  companyOrIndustry: 'Harbourview Logistics Group (Supply Chain & Logistics)',
  jobDescription: SAMPLE_JOB_DESCRIPTION,
  experienceLevel: 'Recent Graduate',
};
