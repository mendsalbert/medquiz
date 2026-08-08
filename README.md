# MedQuiz

African clinical MCQ practice platform — MVP.

Visual language matches **AfriMedEval**: warm paper canvas, navy ink, teal + leaf accents, Fredoka display + Nunito body, full-bleed dark photo hero.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the next free port if 3000 is taken).

## MVP routes

| Route | What |
|---|---|
| `/` | Landing (AfriMed-style) |
| `/quizzes` | Specialty quiz picker |
| `/quiz/[id]` | Take quiz + results |

Tracks: OBGYN Essentials, Infectious Disease Focus, Paediatrics Core.
