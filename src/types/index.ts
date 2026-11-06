export type IraqiGradeId = 
  | '1-intermediate' // الأول المتوسط
  | '2-intermediate' // الثاني المتوسط
  | '3-intermediate' // الثالث المتوسط (وزاري)
  | '4-prep-scientific' // الرابع العلمي
  | '5-prep-scientific' // الخامس العلمي
  | '6-prep-scientific' // السادس العلمي (وزاري)
  | '4-prep-literary' // الرابع الأدبي
  | '5-prep-literary' // الخامس الأدبي
  | '6-prep-literary'; // السادس الأدبي (وزاري)

export type ExamType = 'daily' | 'monthly' | 'ministerial';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  isMinisterial?: boolean;
  ministerialYear?: string;
}

export interface IraqiLesson {
  id: string;
  title: string;
  partNumber?: number;
  durationMinutes: number;
  youtubeUrl: string;
  youtubeVideoId: string;
  teacherName: string;
  notes: string;
  aiSummaryPoints?: string[];
  keyFormulas?: string[];
  dailyQuiz: QuizQuestion[];
  isLocked?: boolean;
}

export interface ExamRecord {
  id: string;
  title: string;
  type: ExamType;
  timeAllowedMinutes: number;
  totalMarks: number;
  questions: QuizQuestion[];
}

export interface IraqiSubject {
  id: string;
  title: string;
  standardName?: string;
  gradeId: IraqiGradeId;
  gradeLabel: string;
  branch: 'متوسط' | 'علمي' | 'أدبي' | 'عام';
  semester: string;
  teacherName: string;
  teacherTitle: string;
  iconName: string;
  description: string;
  lessons: IraqiLesson[];
  monthlyExams: ExamRecord[];
}

export interface MalzamaItem {
  id: string;
  title: string;
  teacherName: string;
  gradeId: IraqiGradeId;
  gradeLabel: string;
  subjectTitle: string;
  pagesCount: number;
  editionYear: string;
  description: string;
  downloadUrl: string;
  fileSizeBytes: string;
  previewChapters: string[];
}

export interface RecitationItem {
  id: string;
  title: string;
  category: 'قرآن كريم' | 'حديث نبوي' | 'أدب ونصوص' | 'قوانين وتعريفات';
  gradeId: IraqiGradeId;
  subjectTitle: string;
  bookletOrTopic?: string;
  chapterOrPage?: string;
  questionPrompt?: string; // السؤال الذي يطرحه النظام على الطالب شفاهياً
  targetText: string; // النص الأصلي المطلوب تسميعه
  authorOrSource: string;
  clues: string[];
}

export type StandardSubjectName = string;

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface IssuedCertificate {
  certificateNumber: string;
  studentName: string;
  subjectTitle: string;
  gradeLabel: string;
  score: number;
  issueDate: string;
  verified: boolean;
}

export interface TeacherProfile {
  name: string;
  subjectName?: string;
  schoolOrCity?: string;
  inviteToken?: string;
  isLoggedIn: boolean;
}

export interface UserProgress {
  studentName: string;
  gradeId: IraqiGradeId;
  hasCompletedOnboarding: boolean;
  completedLessons: string[]; // lessonIds
  unlockedLessonIds: string[];
  examScores: Record<string, number>;
  streakDays: number;
  totalPoints: number;
  notes: Record<string, string>;
  customLectures?: IraqiLesson[];
  badges: string[];
  issuedCertificates: IssuedCertificate[];
  recitationScores: Record<string, number>; // recitationId -> accuracy percent
}

export interface StudentAccount {
  id: string;
  name: string;
  username: string;
  password: string;
  gradeId: IraqiGradeId;
  createdAt: string;
  progress: UserProgress;
}

export interface PaperStep {
  step: string;
  status: 'correct' | 'error' | 'warning';
  note: string;
}

export interface PaperGradingResult {
  score: number;
  isCorrect: boolean;
  stepByStepAnalysis: PaperStep[];
  identifiedErrors: string[];
  advice: string;
  modelSolution: string;
}

export interface RecitationEvaluationResult {
  accuracyScore: number;
  weaknesses: string[];
  strengths: string[];
  detailedFeedback: string;
  modelAnswer: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
}


