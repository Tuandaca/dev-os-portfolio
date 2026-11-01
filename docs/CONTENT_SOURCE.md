# Portfolio content sources

## Source of truth

The primary source is the owner-supplied, one-page `NgoAnhTuan2y_fullstack_Eng.pdf` (SHA256 `2F7154E61F5DB72E9E272C9BA3F69A5D56836C1EB13185E7D918C1F79F10880A`). Its byte-identical public copy is `public/resume/NgoAnhTuan2y_fullstack_Eng.pdf`. The owner explicitly approved publishing the original CV with its contact details on 2026-11-01.

| Content | Primary evidence | Publication rule |
| --- | --- | --- |
| Name, headline, location, contact, portfolio and GitHub URLs | CV header | Use the CV values; GitHub profile is public and the portfolio URL returned HTTP 200 on 2026-11-01. Email and phone are CV-supplied, not delivery-tested. |
| Summary and project-based experience | CV Professional Summary and AI-Augmented Development | Keep “2 years of hands-on, project-based experience” separate from employment duration. Do not call it two years of full-time commercial employment. |
| Technical skills | CV Technical Skills | List technologies without invented proficiency levels. |
| University IT role | CV Experience | Software Developer, IT Department, Van Lang University, 2025–2026. Do not infer full-time status or month-level dates. |
| Freelance evaluation | CV Experience | Web Data Evaluator (Freelance), Rating Task, 2021–2025. Do not relabel it as full-stack employment. |
| Education and certification | CV Education & Certification | Bachelor of Software Engineering, Ton Duc Thang University, 2021–2026, GPA 7.01/10; Aptis ESOL B2 (2024). Do not infer a graduation date beyond the CV. |
| Cinema project | CV Selected Projects; repository audit | Present as a personal project; publish code-supported technical details only. No unverified runtime results or deployment claims. |
| Travel AI project | CV Selected Projects; repository audit | Present as a collaborative capstone, Sep–Dec 2025. Separate CV-described FAISS prototype work from the current repository backend. No achieved evaluation metrics without evidence. |

## Repository verification

- **Cinema:** `Tuandaca/cinema` at `c2581f94dd1de9aaeba209a3bd7b3f38bcb3c80e`. Inspected `apps/web/package.json`, `apps/api/package.json`, `apps/api/prisma/schema.prisma`, `apps/api/src/redis/redis.service.ts`, `apps/api/src/booking/booking.gateway.ts`, `apps/api/src/booking/booking.controller.ts`, and `apps/api/src/ai/ai.service.ts`. These support the web/API stack, seat and booking models, Redis-backed locking, Socket.IO events, and Gemini-based guidance. The AI service is designed to guide users, not automatically book or pay. README metrics, reliability, deployment, and payment completion claims are not independently verified.
- **Travel AI:** `Tuandaca/DACNTT` at `398222f8896833f61acf6a348a25ba0109fc3b4d`. Inspected `app/backend/unified_server.py`, `app/backend/bus_core.py`, `app/backend/requirements.txt`, the README, and deployment configuration. The code supports FastAPI chat and image-chat endpoints, sentence-transformer embeddings with a Neo4j vector index, graph-based bus routing, and Gemini integration. The CV describes a FAISS-based retrieval prototype; FAISS was not found in the current backend or its requirements, so do not present it as the current serving architecture. The README identifies a two-student capstone. Docker and a sync workflow are configuration evidence, not proof of a live deployment. The public repository appears to contain hard-coded Neo4j credentials in documentation/notebooks and credential-named files. Do not quote or copy values. Withhold a prominent direct project link until the owner reviews and rotates any live credentials.

## Legacy content

`src/data/portfolioData.ts` is retained for compatibility but is not imported by recruiter pages. It contains unsupported employment descriptions, periods, metrics, achievements, and deployment statements. New content lives in `src/content/`; do not reuse legacy claims without evidence.

## Review discipline

Update this file alongside any owner-specific content change. Record whether each claim comes from the CV, inspected repository code, or independent runtime evidence. Keep unsupported claims out of public pages. The original PDF is public by owner choice; future changes to publishing scope require updating both the public asset and links.
