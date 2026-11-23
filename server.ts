import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  analyseCv,
  generateInterviewQuestions,
  improveCv,
  matchJobDescription,
} from './server/geminiService.ts';
import type { ExperienceLevel } from './src/types/career.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const ALLOWED_EXPERIENCE_LEVELS = new Set<ExperienceLevel>([
  'Student',
  'Recent Graduate',
  'Experienced Applicant',
]);

const MAX_TEXT_LENGTH = 25000;

function validateTextField(value: unknown, fieldName: string, minLength = 20): string {
  if (typeof value !== 'string') {
    throw new HttpError(400, `${fieldName} must be provided as text.`);
  }
  const trimmed = value.trim();
  if (!trimmed) {
    throw new HttpError(400, `Please provide ${fieldName} before submitting.`);
  }
  if (trimmed.length < minLength) {
    throw new HttpError(
      400,
      `${fieldName} appears too short to analyse meaningfully (minimum ${minLength} characters).`,
    );
  }
  if (trimmed.length > MAX_TEXT_LENGTH) {
    throw new HttpError(
      400,
      `${fieldName} exceeds the maximum allowed length of ${MAX_TEXT_LENGTH.toLocaleString()} characters.`,
    );
  }
  return trimmed;
}

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'the-graduate-advantage' });
  });

  app.post('/api/career/analyse-cv', async (req, res) => {
    try {
      const cvText = validateTextField(req.body?.cvText, 'your CV text', 30);
      const result = await analyseCv(cvText);
      res.json({ data: result });
    } catch (error: unknown) {
      const status = error instanceof HttpError ? error.status : 500;
      const message =
        error instanceof Error ? error.message : 'Unable to analyse CV right now.';
      res.status(status).json({ error: message });
    }
  });

  app.post('/api/career/match-job', async (req, res) => {
    try {
      const cvText = validateTextField(req.body?.cvText, 'your CV text', 30);
      const jobDescription = validateTextField(
        req.body?.jobDescription,
        'the job description',
        30,
      );
      const result = await matchJobDescription(cvText, jobDescription);
      res.json({ data: result });
    } catch (error: unknown) {
      const status = error instanceof HttpError ? error.status : 500;
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to compare your CV with this job right now.';
      res.status(status).json({ error: message });
    }
  });

  app.post('/api/career/improve-cv', async (req, res) => {
    try {
      const cvText = validateTextField(req.body?.cvText, 'your CV text', 30);
      const rawTargetRole = req.body?.targetRole;
      const targetRole =
        typeof rawTargetRole === 'string' ? rawTargetRole.trim().slice(0, 150) : undefined;
      const result = await improveCv(cvText, targetRole);
      res.json({ data: result });
    } catch (error: unknown) {
      const status = error instanceof HttpError ? error.status : 500;
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to generate CV improvement suggestions right now.';
      res.status(status).json({ error: message });
    }
  });

  app.post('/api/career/interview-questions', async (req, res) => {
    try {
      const jobTitle = validateTextField(req.body?.jobTitle, 'a target job title', 2);
      const rawLevel = req.body?.experienceLevel as ExperienceLevel;
      if (!ALLOWED_EXPERIENCE_LEVELS.has(rawLevel)) {
        throw new HttpError(
          400,
          'Experience level must be Student, Recent Graduate, or Experienced Applicant.',
        );
      }

      const companyOrIndustry =
        typeof req.body?.companyOrIndustry === 'string'
          ? req.body.companyOrIndustry.trim().slice(0, 150)
          : undefined;
      const jobDescription =
        typeof req.body?.jobDescription === 'string'
          ? req.body.jobDescription.trim().slice(0, MAX_TEXT_LENGTH)
          : undefined;

      const result = await generateInterviewQuestions({
        jobTitle,
        companyOrIndustry,
        jobDescription,
        experienceLevel: rawLevel,
      });
      res.json({ data: result });
    } catch (error: unknown) {
      const status = error instanceof HttpError ? error.status : 500;
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to generate interview questions right now.';
      res.status(status).json({ error: message });
    }
  });

  app.post('/api/contact', (req, res) => {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
    const topic = typeof req.body?.topic === 'string' ? req.body.topic.trim() : '';
    const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';

    if (!name || name.length < 2) {
      res.status(400).json({ error: 'Please enter your full name.' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }
    if (!message || message.length < 10) {
      res.status(400).json({
        error: 'Please enter a message of at least 10 characters.',
      });
      return;
    }

    res.json({
      success: true,
      acknowledgement: `Thank you, ${name}. Your message regarding "${topic || 'General Inquiry'}" has been received by The Graduate Advantage team.`,
    });
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('/{*splat}', (_req, res) => {
      const indexFile = path.join(distPath, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`The Graduate Advantage server listening on http://localhost:${PORT}`);
  });
}

startServer();
