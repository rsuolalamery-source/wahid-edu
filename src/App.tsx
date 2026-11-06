import React, { useState, useEffect } from 'react';
import { 
  IraqiGradeId, 
  IraqiSubject, 
  IraqiLesson, 
  UserProgress, 
  StandardSubjectName, 
  IssuedCertificate, 
  MalzamaItem, 
  RecitationItem,
  TeacherProfile,
  StudentAccount
} from './types';
import { 
  IRAQI_GRADES, 
  IRAQI_SUBJECTS, 
  SYSTEM_BADGES, 
  SAMPLE_MALAZEM, 
  SAMPLE_RECITATIONS 
} from './data/iraqiCurriculumData';
import { Navbar, NavTab } from './components/Navbar';
import { IraqiSubjectCatalog } from './components/IraqiSubjectCatalog';
import { YouTubeLecturePlayer } from './components/YouTubeLecturePlayer';
import { IraqiExamCenter } from './components/IraqiExamCenter';
import { StudentGradesRecord } from './components/StudentGradesRecord';
import { MalazemPage } from './components/MalazemPage';
import { SameaniRecitation } from './components/SameaniRecitation';
import { ImportYouTubeModal } from './components/ImportYouTubeModal';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminManagerModal } from './components/AdminManagerModal';
import { PaperMathGraderModal } from './components/PaperMathGraderModal';
import { AddMalzamaModal } from './components/AddMalzamaModal';
import { DailyQuizModal } from './components/DailyQuizModal';
import { CertificateModal } from './components/CertificateModal';
import { CertificateVerifierModal } from './components/CertificateVerifierModal';
import { AuthModal } from './components/AuthModal';
import { OnboardingModal } from './components/OnboardingModal';
import { AiTutorModal } from './components/AiTutorModal';
import { Footer } from './components/Footer';

const STORAGE_KEY = 'wahed_taleem_iraqi_v4';
const ACCOUNTS_STORAGE_KEY = 'wahed_taleem_accounts_v1';
const CURRENT_USER_KEY = 'wahed_taleem_active_user_v1';
const SUBJECTS_STORAGE_KEY = 'wahed_taleem_subjects_v4';
const MALAZEM_STORAGE_KEY = 'wahed_taleem_malazem_v4';
const TEACHER_STORAGE_KEY = 'wahed_taleem_teacher_profile_v4';
const MANAGER_STORAGE_KEY = 'wahed_taleem_manager_session_v1';
const THEME_KEY = 'wahed_taleem_theme';

const initialProgress: UserProgress = {
  studentName: '',
  gradeId: '1-intermediate', // الافتراضي الأول متوسط للفلترة التلقائية
  hasCompletedOnboarding: false,
  completedLessons: [],
  unlockedLessonIds: ['les-1m-1', 'les-1a-1', 'les-1e-1', 'les-1p-1', 'les-1c-1', 'les-1b-1', 'les-1s-1'],
  examScores: {},
  streakDays: 4,
  totalPoints: 120,
  notes: {},
  customLectures: [],
  badges: [],
  issuedCertificates: [],
  recitationScores: {}
};

// Default seed accounts for quick testing
const defaultAccounts: StudentAccount[] = [
  {
    id: 'acc-demo-1',
    name: 'حيدر أحمد',
    username: 'haidar',
    password: '123',
    gradeId: '1-intermediate',
    createdAt: new Date().toISOString(),
    progress: {
      ...initialProgress,
      studentName: 'حيدر أحمد',
      gradeId: '1-intermediate',
      hasCompletedOnboarding: true,
      completedLessons: ['les-1m-1'],
      totalPoints: 150
    }
  },
  {
    id: 'acc-demo-2',
    name: 'سجاد علي',
    username: 'sajjad',
    password: '123',
    gradeId: '5-prep-scientific',
    createdAt: new Date().toISOString(),
    progress: {
      ...initialProgress,
      studentName: 'سجاد علي',
      gradeId: '5-prep-scientific',
      hasCompletedOnboarding: true,
      unlockedLessonIds: ['les-5-prep-scientific-1-1', 'les-5-prep-scientific-2-1'],
      totalPoints: 210
    }
  }
];

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved !== null) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  // Accounts list state
  const [accounts, setAccounts] = useState<StudentAccount[]>(() => {
    try {
      const saved = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load accounts:', e);
    }
    return defaultAccounts;
  });

  useEffect(() => {
    try {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.error('Failed to save accounts:', e);
    }
  }, [accounts]);

  // Active Student Account
  const [activeUser, setActiveUser] = useState<StudentAccount | null>(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load active user:', e);
    }
    return null;
  });

  useEffect(() => {
    try {
      if (activeUser) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(activeUser));
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    } catch (e) {
      console.error('Failed to save active user:', e);
    }
  }, [activeUser]);

  // Manager state (مدير المنصة - المسؤول الوحيد عن إرسال دعوات المدرسين)
  const [isManager, setIsManager] = useState<boolean>(() => {
    try {
      return localStorage.getItem(MANAGER_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isManager) {
        localStorage.setItem(MANAGER_STORAGE_KEY, 'true');
      } else {
        localStorage.removeItem(MANAGER_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save manager session:', e);
    }
  }, [isManager]);

  // Teacher Profile state & URL Invite parsing (?teacher=أحمد_النداوي)
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>(() => {
    try {
      // 1. Check URL parameters first (?teacher=... or ?invite=...)
      const urlParams = new URLSearchParams(window.location.search);
      const teacherFromUrl = urlParams.get('teacher');
      const inviteFromUrl = urlParams.get('invite');

      if (teacherFromUrl) {
        const decodedName = decodeURIComponent(teacherFromUrl).replace(/_/g, ' ');
        return {
          name: decodedName,
          isLoggedIn: true,
          inviteToken: inviteFromUrl || 'url-invite'
        };
      }

      // 2. Check local storage
      const savedTeacher = localStorage.getItem(TEACHER_STORAGE_KEY);
      if (savedTeacher) return JSON.parse(savedTeacher);
    } catch (e) {
      console.error('Failed to parse teacher profile from URL/storage:', e);
    }
    return { name: '', isLoggedIn: false };
  });

  useEffect(() => {
    try {
      localStorage.setItem(TEACHER_STORAGE_KEY, JSON.stringify(teacherProfile));
    } catch (e) {
      console.error('Failed to save teacher profile:', e);
    }
  }, [teacherProfile]);

  // User Progress
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    if (activeUser?.progress) {
      return activeUser.progress;
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load user progress:', e);
    }
    return initialProgress;
  });

  // Selected Grade (الأول متوسط إلى السادس إعدادي)
  const [selectedGradeId, setSelectedGradeId] = useState<IraqiGradeId>(
    activeUser?.gradeId || userProgress.gradeId || '1-intermediate'
  );

  // Sync progress back to active account and localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
      if (activeUser) {
        const updatedAcc = { ...activeUser, progress: userProgress, gradeId: selectedGradeId };
        setActiveUser(updatedAcc);
        setAccounts(prev => prev.map(a => a.id === updatedAcc.id ? updatedAcc : a));
      }
    } catch (e) {
      console.error('Failed to save user progress:', e);
    }
  }, [userProgress, selectedGradeId]);

  // Curriculum Subjects (defaults + any teacher-published additions)
  const [curriculumSubjects, setCurriculumSubjects] = useState<IraqiSubject[]>(() => {
    try {
      const saved = localStorage.getItem(SUBJECTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load stored subjects:', e);
    }
    return IRAQI_SUBJECTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(SUBJECTS_STORAGE_KEY, JSON.stringify(curriculumSubjects));
    } catch (e) {
      console.error('Failed to save subjects:', e);
    }
  }, [curriculumSubjects]);

  // Malazem Booklets Library state
  const [malazemList, setMalazemList] = useState<MalzamaItem[]>(() => {
    try {
      const saved = localStorage.getItem(MALAZEM_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load malazem:', e);
    }
    return SAMPLE_MALAZEM;
  });

  useEffect(() => {
    try {
      localStorage.setItem(MALAZEM_STORAGE_KEY, JSON.stringify(malazemList));
    } catch (e) {
      console.error('Failed to save malazem list:', e);
    }
  }, [malazemList]);

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<NavTab>('subjects');

  // Active Subject & Lesson in Player
  const gradeSubjects = curriculumSubjects.filter(s => s.gradeId === selectedGradeId);
  const activeFallbackSubject = gradeSubjects[0] || curriculumSubjects[0];
  const [activeSubject, setActiveSubject] = useState<IraqiSubject>(activeFallbackSubject);
  const [activeLesson, setActiveLesson] = useState<IraqiLesson>(activeFallbackSubject?.lessons[0]);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(!activeUser && !teacherProfile.isLoggedIn);
  const [isAdminManagerOpen, setIsAdminManagerOpen] = useState<boolean>(false);
  const [isPaperGraderOpen, setIsPaperGraderOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [isTeacherDashboardOpen, setIsTeacherDashboardOpen] = useState<boolean>(false);
  const [isAddMalzamaOpen, setIsAddMalzamaOpen] = useState<boolean>(false);
  const [isVerifierOpen, setIsVerifierOpen] = useState<boolean>(false);
  const [dailyQuizLesson, setDailyQuizLesson] = useState<IraqiLesson | null>(null);
  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(false);
  const [tutorContext, setTutorContext] = useState<string>('');
  const [certificateData, setCertificateData] = useState<{ title: string; score: number; gradeLabel: string } | null>(null);

  // Sync active subject when grade changes
  useEffect(() => {
    const currentForGrade = curriculumSubjects.filter(s => s.gradeId === selectedGradeId);
    if (currentForGrade.length > 0) {
      setActiveSubject(currentForGrade[0]);
      if (currentForGrade[0].lessons.length > 0) {
        setActiveLesson(currentForGrade[0].lessons[0]);
      }
    }
  }, [selectedGradeId, curriculumSubjects]);

  // Login handler
  const handleLogin = (account: StudentAccount) => {
    setActiveUser(account);
    setUserProgress(account.progress);
    setSelectedGradeId(account.gradeId);
    setIsAuthModalOpen(false);
  };

  // Register handler
  const handleRegister = (name: string, username: string, password: string, gradeId: IraqiGradeId) => {
    const newAccount: StudentAccount = {
      id: `acc-${Date.now()}`,
      name,
      username,
      password,
      gradeId,
      createdAt: new Date().toISOString(),
      progress: {
        ...initialProgress,
        studentName: name,
        gradeId,
        hasCompletedOnboarding: true
      }
    };

    setAccounts(prev => [...prev, newAccount]);
    setActiveUser(newAccount);
    setUserProgress(newAccount.progress);
    setSelectedGradeId(gradeId);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setActiveUser(null);
    setIsManager(false);
    setTeacherProfile({ name: '', isLoggedIn: false });
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(TEACHER_STORAGE_KEY);
    localStorage.removeItem(MANAGER_STORAGE_KEY);
    setIsAuthModalOpen(true);
  };

  const handleOpenAdminPortal = () => {
    setIsAdminManagerOpen(true);
  };

  // Check & award badges automatically
  const checkAndAwardBadges = (updatedCompleted: string[], updatedScores: Record<string, number>) => {
    const newBadges = [...userProgress.badges];
    
    // 1st lesson completed
    if (updatedCompleted.length >= 1 && !newBadges.includes('badge-first-step')) {
      newBadges.push('badge-first-step');
    }
    // 3 daily tests passed
    if (updatedCompleted.length >= 3 && !newBadges.includes('badge-quiz-champ')) {
      newBadges.push('badge-quiz-champ');
    }
    // 100% score in any test
    const has100 = Object.values(updatedScores).some(s => s === 100);
    if (has100 && !newBadges.includes('badge-perfect-100')) {
      newBadges.push('badge-perfect-100');
    }
    // Streak
    if (userProgress.streakDays >= 5 && !newBadges.includes('badge-streak-master')) {
      newBadges.push('badge-streak-master');
    }

    return newBadges;
  };

  const handleSelectLesson = (lesson: IraqiLesson, subject: IraqiSubject) => {
    setActiveLesson(lesson);
    setActiveSubject(subject);
    setCurrentTab('player');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Find next sequential lesson in current subject
  const currentLessonIndex = activeSubject?.lessons.findIndex(l => l.id === activeLesson?.id) ?? -1;
  const nextSequentialLesson = currentLessonIndex !== -1 && currentLessonIndex < activeSubject.lessons.length - 1
    ? activeSubject.lessons[currentLessonIndex + 1]
    : undefined;
  
  const isNextLessonUnlocked = nextSequentialLesson
    ? userProgress.unlockedLessonIds.includes(nextSequentialLesson.id) || userProgress.completedLessons.includes(nextSequentialLesson.id)
    : false;

  const handleCompleteLesson = (lessonId: string) => {
    setUserProgress(prev => {
      const alreadyDone = prev.completedLessons.includes(lessonId);
      const updatedLessons = alreadyDone ? prev.completedLessons : [...prev.completedLessons, lessonId];
      const updatedBadges = checkAndAwardBadges(updatedLessons, prev.examScores);

      return {
        ...prev,
        completedLessons: updatedLessons,
        totalPoints: alreadyDone ? prev.totalPoints : prev.totalPoints + 30,
        badges: updatedBadges
      };
    });
  };

  // When daily quiz is passed: unlock next lesson in sequence automatically!
  const handlePassDailyQuiz = (lessonId: string, score: number) => {
    handleCompleteLesson(lessonId);

    if (nextSequentialLesson) {
      setUserProgress(prev => ({
        ...prev,
        unlockedLessonIds: prev.unlockedLessonIds.includes(nextSequentialLesson.id)
          ? prev.unlockedLessonIds
          : [...prev.unlockedLessonIds, nextSequentialLesson.id]
      }));
    }
  };

  const handleSaveNote = (lessonId: string, note: string) => {
    setUserProgress(prev => ({
      ...prev,
      notes: {
        ...prev.notes,
        [lessonId]: note
      }
    }));
  };

  const handleRecordExamScore = (examId: string, score: number) => {
    setUserProgress(prev => {
      const updatedScores = {
        ...prev.examScores,
        [examId]: score
      };
      const updatedBadges = checkAndAwardBadges(prev.completedLessons, updatedScores);

      return {
        ...prev,
        examScores: updatedScores,
        totalPoints: prev.totalPoints + (score >= 75 ? 100 : 40),
        badges: updatedBadges
      };
    });
  };

  const handleRecordRecitationScore = (recitationId: string, score: number) => {
    setUserProgress(prev => {
      const updatedBadges = [...prev.badges];
      if (score >= 85 && !updatedBadges.includes('badge-recitation-star')) {
        updatedBadges.push('badge-recitation-star');
      }

      return {
        ...prev,
        recitationScores: {
          ...prev.recitationScores,
          [recitationId]: score
        },
        totalPoints: prev.totalPoints + (score >= 85 ? 50 : 20),
        badges: updatedBadges
      };
    });
  };

  const handleImportLecture = (newLecture: IraqiLesson, subjectTitle: string) => {
    setUserProgress(prev => ({
      ...prev,
      customLectures: [newLecture, ...(prev.customLectures || [])],
      unlockedLessonIds: [...prev.unlockedLessonIds, newLecture.id]
    }));

    const dummySubject: IraqiSubject = {
      id: `imported-sub-${Date.now()}`,
      title: subjectTitle,
      gradeId: selectedGradeId,
      gradeLabel: IRAQI_GRADES.find(g => g.id === selectedGradeId)?.title || 'المنهج العراقي',
      branch: 'متوسط',
      semester: 'المنهج الكامل',
      teacherName: newLecture.teacherName,
      teacherTitle: 'مدرس مسحوب من يوتيوب',
      iconName: 'Youtube',
      description: 'محاضرة مستوردة من يوتيوب للدراسة والتدريب اليومي والشهري.',
      lessons: [newLecture],
      monthlyExams: []
    };

    setActiveSubject(dummySubject);
    setActiveLesson(newLecture);
    setCurrentTab('player');
  };

  // Teacher or Manager Dashboard: publish new lecture into curriculum
  const handleTeacherPublish = (gradeId: IraqiGradeId, standardSubject: StandardSubjectName, lecture: IraqiLesson) => {
    setCurriculumSubjects(prev => {
      const subjectIndex = prev.findIndex(s => s.gradeId === gradeId && (s.title.includes(standardSubject)));
      
      if (subjectIndex !== -1) {
        const updated = [...prev];
        updated[subjectIndex] = {
          ...updated[subjectIndex],
          lessons: [...updated[subjectIndex].lessons, lecture]
        };
        return updated;
      } else {
        const newSubject: IraqiSubject = {
          id: `sub-${gradeId}-${Date.now()}`,
          title: `${standardSubject} - ${IRAQI_GRADES.find(g => g.id === gradeId)?.title}`,
          gradeId: gradeId,
          gradeLabel: IRAQI_GRADES.find(g => g.id === gradeId)?.title || 'المنهج العراقي',
          branch: 'متوسط',
          semester: 'الكورس الأول',
          teacherName: lecture.teacherName,
          teacherTitle: 'مدرس المادة المعتمد',
          iconName: 'BookOpen',
          description: `منهج ومحاضرات ${standardSubject} وفق وزارة التربية العراقية.`,
          lessons: [lecture],
          monthlyExams: []
        };
        return [...prev, newSubject];
      }
    });

    setUserProgress(prev => ({
      ...prev,
      unlockedLessonIds: [...prev.unlockedLessonIds, lecture.id]
    }));
  };

  const handleAddMalzama = (newMalzama: MalzamaItem) => {
    setMalazemList(prev => [newMalzama, ...prev]);
  };

  const handleOpenCertificate = (title: string, score: number, gradeLabel: string) => {
    const certNumber = `WAHED-IQ-${Math.floor(100000 + Math.random() * 900000)}`;
    const newCert: IssuedCertificate = {
      certificateNumber: certNumber,
      studentName: userProgress.studentName || activeUser?.name || 'طالب متميز',
      subjectTitle: title,
      gradeLabel: gradeLabel,
      score: score,
      issueDate: new Date().toLocaleDateString('ar-IQ'),
      verified: true
    };

    setUserProgress(prev => {
      const updatedBadges = [...prev.badges];
      if (!updatedBadges.includes('badge-honor-cert')) {
        updatedBadges.push('badge-honor-cert');
      }

      return {
        ...prev,
        issuedCertificates: [newCert, ...prev.issuedCertificates.filter(c => c.subjectTitle !== title)],
        badges: updatedBadges
      };
    });

    setCertificateData({ title, score, gradeLabel });
  };

  const handleOpenTutorWithPrompt = (prompt?: string) => {
    setTutorContext(prompt || '');
    setIsTutorOpen(true);
  };

  const currentGradeMeta = IRAQI_GRADES.find(g => g.id === selectedGradeId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        selectedGradeId={selectedGradeId}
        studentName={activeUser?.name || userProgress.studentName || 'طالب'}
        isLoggedIn={Boolean(activeUser)}
        isTeacher={teacherProfile.isLoggedIn}
        teacherName={teacherProfile.name}
        isManager={isManager}
        onOpenTutor={() => handleOpenTutorWithPrompt()}
        onOpenPaperGrader={() => setIsPaperGraderOpen(true)}
        onOpenTeacherDashboard={() => setIsTeacherDashboardOpen(true)}
        onOpenAdminPortal={handleOpenAdminPortal}
        onOpenAddMalzama={() => setIsAddMalzamaOpen(true)}
        onLogout={handleLogout}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenVerifier={() => setIsVerifierOpen(true)}
        onOpenGradeSwitcher={() => setIsOnboardingOpen(true)}
        streakDays={userProgress.streakDays}
        totalPoints={userProgress.totalPoints}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        
        {/* Tab 1: Subjects & Lectures Catalog */}
        {currentTab === 'subjects' && (
          <IraqiSubjectCatalog
            subjects={gradeSubjects.length > 0 ? gradeSubjects : curriculumSubjects.slice(0, 8)}
            selectedGradeId={selectedGradeId}
            completedLessons={userProgress.completedLessons}
            unlockedLessonIds={userProgress.unlockedLessonIds}
            customLectures={userProgress.customLectures || []}
            onSelectLesson={handleSelectLesson}
            onOpenImportModal={() => setIsImportModalOpen(true)}
            onOpenTeacherDashboard={() => setIsTeacherDashboardOpen(true)}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            onOpenExamsTab={() => setCurrentTab('exams')}
            isTeacher={teacherProfile.isLoggedIn || isManager}
            teacherName={teacherProfile.name}
          />
        )}

        {/* Tab 2: Malazem (PDF Booklets) Library */}
        {currentTab === 'malazem' && (
          <MalazemPage
            malazem={malazemList}
            selectedGradeId={selectedGradeId}
            onSelectGrade={(gId) => setSelectedGradeId(gId)}
            onOpenTeacherPortal={() => setIsAddMalzamaOpen(true)}
            isTeacher={teacherProfile.isLoggedIn}
            isManager={isManager}
            teacherName={teacherProfile.name}
            onOpenAddMalzama={() => setIsAddMalzamaOpen(true)}
          />
        )}

        {/* Tab 3: Sameani Interactive Oral Recitation (Strictly Filtered by Grade) */}
        {currentTab === 'sameani' && (
          <SameaniRecitation
            recitations={SAMPLE_RECITATIONS}
            selectedGradeId={selectedGradeId}
            onRecordRecitationScore={handleRecordRecitationScore}
            onAskTutor={handleOpenTutorWithPrompt}
          />
        )}

        {/* Tab 4: Lecture Player with Focus Mode & AI Notes */}
        {currentTab === 'player' && activeLesson && (
          <YouTubeLecturePlayer
            lesson={activeLesson}
            subject={activeSubject}
            isCompleted={userProgress.completedLessons.includes(activeLesson.id)}
            userNote={userProgress.notes[activeLesson.id] || ''}
            nextLesson={nextSequentialLesson}
            isNextLessonUnlocked={isNextLessonUnlocked}
            onSaveNote={handleSaveNote}
            onCompleteLesson={handleCompleteLesson}
            onStartDailyQuiz={(lec) => setDailyQuizLesson(lec)}
            onNavigateToLesson={(nextLec) => handleSelectLesson(nextLec, activeSubject)}
            onAskAiTutor={handleOpenTutorWithPrompt}
            onOpenImportModal={() => setIsImportModalOpen(true)}
          />
        )}

        {/* Tab 5: Exams & Certificates Center */}
        {currentTab === 'exams' && (
          <IraqiExamCenter
            subjects={gradeSubjects.length > 0 ? gradeSubjects : curriculumSubjects}
            userExamScores={userProgress.examScores}
            onRecordScore={handleRecordExamScore}
            onOpenCertificate={handleOpenCertificate}
            onAskTutor={handleOpenTutorWithPrompt}
          />
        )}

        {/* Tab 6: Student Progress & Grades Record */}
        {currentTab === 'dashboard' && (
          <StudentGradesRecord
            userProgress={userProgress}
            subjects={gradeSubjects.length > 0 ? gradeSubjects : curriculumSubjects.slice(0, 8)}
            onUpdateStudentName={(name) => setUserProgress(prev => ({ ...prev, studentName: name }))}
            onOpenCertificate={handleOpenCertificate}
            onOpenVerifier={() => setIsVerifierOpen(true)}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
          />
        )}

      </main>

      {/* Footer */}
      <Footer
        onSelectTab={(tab) => {
          if (tab === 'courses') setCurrentTab('subjects');
          else if (tab === 'ai-quiz') setCurrentTab('exams');
          else if (tab === 'dashboard') setCurrentTab('dashboard');
          else setCurrentTab('subjects');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenTutor={() => handleOpenTutorWithPrompt()}
      />

      {/* Auth Modal (Login to Old Account vs Register New Account with Password) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onOpenAdminPortal={handleOpenAdminPortal}
        onClose={() => setIsAuthModalOpen(false)}
        isClosable={Boolean(activeUser || teacherProfile.isLoggedIn)}
      />

      {/* Admin Manager Modal (Exclusive for Platform Manager to Invite Teachers) */}
      <AdminManagerModal
        isOpen={isAdminManagerOpen}
        onClose={() => setIsAdminManagerOpen(false)}
        activeTeachersCount={8}
        studentsCount={accounts.length}
      />

      {/* Paper & Pen Solution Camera Grader Modal (مصحح الدفتر والورقة والقلم) */}
      <PaperMathGraderModal
        isOpen={isPaperGraderOpen}
        onClose={() => setIsPaperGraderOpen(false)}
        gradeTitle={currentGradeMeta?.title || 'المنهج العراقي'}
      />

      {/* Grade Switcher Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        initialName={activeUser?.name || userProgress.studentName}
        initialGrade={selectedGradeId}
        onSaveProfile={(name, gId) => {
          setSelectedGradeId(gId);
          setUserProgress(prev => ({ ...prev, studentName: name, gradeId: gId }));
          setIsOnboardingOpen(false);
        }}
        onClose={() => setIsOnboardingOpen(false)}
        isClosable={true}
      />

      {/* Teacher Dashboard (Publish Lecture & Quiz) */}
      {isTeacherDashboardOpen && (
        <TeacherDashboard
          onPublishLecture={handleTeacherPublish}
          onClose={() => setIsTeacherDashboardOpen(false)}
        />
      )}

      {/* Add Malzama Modal */}
      <AddMalzamaModal
        isOpen={isAddMalzamaOpen}
        onClose={() => setIsAddMalzamaOpen(false)}
        onAddMalzama={handleAddMalzama}
        teacherName={teacherProfile.name || 'أستاذ المادة'}
      />

      {/* Certificate Verifier Modal */}
      <CertificateVerifierModal
        isOpen={isVerifierOpen}
        onClose={() => setIsVerifierOpen(false)}
        issuedCertificates={userProgress.issuedCertificates}
      />

      {/* Pull Any Lecture From YouTube Modal */}
      <ImportYouTubeModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportLecture={handleImportLecture}
      />

      {/* Daily Sequential Quiz Modal */}
      {dailyQuizLesson && (
        <DailyQuizModal
          lesson={dailyQuizLesson}
          nextLesson={nextSequentialLesson}
          onClose={() => setDailyQuizLesson(null)}
          onPassDailyQuiz={handlePassDailyQuiz}
          onAdvanceToNextLesson={(nextLec) => {
            setDailyQuizLesson(null);
            handleSelectLesson(nextLec, activeSubject);
          }}
        />
      )}

      {/* Smart Iraqi AI Tutor */}
      <AiTutorModal
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
        initialPrompt={tutorContext}
      />

      {/* Official Certificate Modal */}
      {certificateData && (
        <CertificateModal
          title={certificateData.title}
          studentName={userProgress.studentName || activeUser?.name || 'طالب متميز'}
          score={certificateData.score}
          gradeLabel={certificateData.gradeLabel}
          onUpdateStudentName={(name) => setUserProgress(prev => ({ ...prev, studentName: name }))}
          onClose={() => setCertificateData(null)}
        />
      )}

    </div>
  );
}
