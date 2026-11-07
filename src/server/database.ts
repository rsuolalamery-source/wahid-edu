import fs from 'fs';
import path from 'path';

export interface SavedTextbookQuestion {
  id: string;
  gradeId: string;
  subject: string;
  chapter: string;
  pageNumber: number | string;
  questionNumber: string;
  questionText: string;
  category: 'تعريف' | 'مسألة رياضية' | 'سؤال وزاري' | 'تعليل' | 'قرآن كريم' | 'حديث نبوي' | 'قاعدة نحوية' | 'مقارنة' | string;
  targetAnswer: string;
  hint?: string;
  createdAt: string;
}

export interface SavedRecitationRecord {
  id: string;
  studentName: string;
  gradeId: string;
  subject: string;
  chapter: string;
  pageNumber?: string;
  questionTitle: string;
  spokenText: string;
  accuracyScore: number;
  weaknesses: string[];
  strengths: string[];
  feedback: string;
  createdAt: string;
}

export interface SavedPaperSubmission {
  id: string;
  studentName: string;
  gradeId: string;
  subject: string;
  chapter: string;
  pageNumber?: string;
  problemTitle: string;
  solutionText?: string;
  hasImage: boolean;
  score: number;
  stepByStepAnalysis: Array<{ step: string; status: string; note: string }>;
  identifiedErrors: string[];
  advice: string;
  modelSolution: string;
  createdAt: string;
}

interface DatabaseSchema {
  textbookQuestions: SavedTextbookQuestion[];
  recitationRecords: SavedRecitationRecord[];
  paperSubmissions: SavedPaperSubmission[];
  studentProgress: Record<string, any>;
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'database.json');

// Ensure database directory and file exist
function initDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn('Database file read error, initializing defaults:', err);
  }

  const initial: DatabaseSchema = {
    textbookQuestions: [],
    recitationRecords: [],
    paperSubmissions: [],
    studentProgress: {}
  };

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write initial database file:', e);
  }

  return initial;
}

let dbCache: DatabaseSchema = initDb();

function saveDb() {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(dbCache, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save database to disk:', err);
  }
}

export const Database = {
  // Textbook Questions
  getTextbookQuestions(gradeId: string, subject: string, chapter?: string, pageNumber?: string | number): SavedTextbookQuestion[] {
    return dbCache.textbookQuestions.filter(q => {
      const matchGrade = !gradeId || q.gradeId === gradeId || q.gradeId === 'all';
      const matchSubject = !subject || q.subject.includes(subject) || subject.includes(q.subject);
      const matchChapter = !chapter || q.chapter.toLowerCase().includes(chapter.toLowerCase());
      const matchPage = !pageNumber || String(q.pageNumber) === String(pageNumber);
      return matchGrade && matchSubject && matchChapter && matchPage;
    });
  },

  addTextbookQuestions(questions: SavedTextbookQuestion[]) {
    for (const q of questions) {
      const existingIdx = dbCache.textbookQuestions.findIndex(existing => existing.id === q.id);
      if (existingIdx !== -1) {
        dbCache.textbookQuestions[existingIdx] = q;
      } else {
        dbCache.textbookQuestions.push(q);
      }
    }
    saveDb();
  },

  // Recitations
  saveRecitation(record: Omit<SavedRecitationRecord, 'id' | 'createdAt'>): SavedRecitationRecord {
    const entry: SavedRecitationRecord = {
      ...record,
      id: `rec-db-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString()
    };
    dbCache.recitationRecords.unshift(entry);
    if (dbCache.recitationRecords.length > 500) {
      dbCache.recitationRecords = dbCache.recitationRecords.slice(0, 500);
    }
    saveDb();
    return entry;
  },

  getRecitations(studentName?: string, subject?: string): SavedRecitationRecord[] {
    return dbCache.recitationRecords.filter(r => {
      const matchStudent = !studentName || r.studentName === studentName;
      const matchSubject = !subject || r.subject === subject;
      return matchStudent && matchSubject;
    });
  },

  // Paper Submissions
  savePaperSubmission(record: Omit<SavedPaperSubmission, 'id' | 'createdAt'>): SavedPaperSubmission {
    const entry: SavedPaperSubmission = {
      ...record,
      id: `paper-db-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString()
    };
    dbCache.paperSubmissions.unshift(entry);
    if (dbCache.paperSubmissions.length > 500) {
      dbCache.paperSubmissions = dbCache.paperSubmissions.slice(0, 500);
    }
    saveDb();
    return entry;
  },

  getPaperSubmissions(studentName?: string, subject?: string): SavedPaperSubmission[] {
    return dbCache.paperSubmissions.filter(p => {
      const matchStudent = !studentName || p.studentName === studentName;
      const matchSubject = !subject || p.subject === subject;
      return matchStudent && matchSubject;
    });
  },

  // Student Progress
  saveStudentProgress(studentId: string, progress: any) {
    dbCache.studentProgress[studentId] = {
      ...progress,
      updatedAt: new Date().toISOString()
    };
    saveDb();
  },

  getStudentProgress(studentId: string) {
    return dbCache.studentProgress[studentId] || null;
  }
};
