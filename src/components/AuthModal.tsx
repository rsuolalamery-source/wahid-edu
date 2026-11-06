import React, { useState } from 'react';
import { IraqiGradeId, StudentAccount } from '../types';
import { IRAQI_GRADES } from '../data/iraqiCurriculumData';
import { 
  GraduationCap, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  Check, 
  AlertCircle,
  BookOpen
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onLogin: (account: StudentAccount) => void;
  onRegister: (name: string, username: string, password: string, gradeId: IraqiGradeId) => void;
  onOpenAdminPortal: () => void;
  onClose?: () => void;
  isClosable?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onLogin,
  onRegister,
  onOpenAdminPortal,
  onClose,
  isClosable = false,
}) => {
  const [nameOrUser, setNameOrUser] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [selectedGrade, setSelectedGrade] = useState<IraqiGradeId>('1-intermediate');
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  // Attempt login with existing saved account
  const handleExistingLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    const cleanInput = nameOrUser.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanInput || !cleanPass) {
      setErrorMessage('يرجى كتابة اسم الطالب وكلمة المرور للمتابعة.');
      return;
    }

    // Secret Manager check: if manager logs in with admin/مدير and pin 123456
    if ((cleanInput === 'admin' || cleanInput === 'مدير' || cleanInput === 'المدير') && (cleanPass === '123456' || cleanPass === 'admin')) {
      onOpenAdminPortal();
      if (onClose) onClose();
      return;
    }

    try {
      const savedAccountsStr = localStorage.getItem('wahed_taleem_accounts_v1');
      const accounts: StudentAccount[] = savedAccountsStr ? JSON.parse(savedAccountsStr) : [];

      const found = accounts.find(
        (acc) =>
          (acc.username.toLowerCase() === cleanInput || acc.name.toLowerCase() === cleanInput) &&
          acc.password === cleanPass
      );

      if (found) {
        onLogin(found);
        if (onClose) onClose();
      } else {
        setErrorMessage(
          'لم يتم العثور على حساب قديم بهذه البيانات، أو أن كلمة المرور غير صحيحة. يمكنك الضغط على «إنشاء حساب جديد» للبدء الآن.'
        );
        setIsRegisterMode(true);
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('حدث خطأ أثناء قراءة الحسابات، يرجى المحاولة مرة أخرى.');
    }
  };

  // Create a brand new account
  const handleNewRegistration = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    const cleanName = nameOrUser.trim();
    const cleanPass = password.trim();

    if (!cleanName) {
      setErrorMessage('يرجى إدخال اسم الطالب لإنشاء الحساب.');
      return;
    }
    if (!cleanPass || cleanPass.length < 3) {
      setErrorMessage('يرجى تحديد كلمة مرور مكونة من 3 خانات على الأقل لحماية حسابك.');
      return;
    }

    onRegister(cleanName, cleanName.toLowerCase().replace(/\s+/g, '_'), cleanPass, selectedGrade);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-2xl shadow-md">
            ١
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            منصة واحد تعليم - المنهج العراقي
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            اكتب اسمك وكلمة المرور، ثم اختر تسجيل الدخول على حسابك القديم أو إنشاء حساب جديد.
          </p>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-start gap-2 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={isRegisterMode ? handleNewRegistration : handleExistingLogin} className="space-y-4">
          
          {/* Student Name / Username */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-600" />
              <span>اسم الطالب / اسم المستخدم:</span>
            </label>
            <input
              type="text"
              required
              value={nameOrUser}
              onChange={(e) => {
                setNameOrUser(e.target.value);
                setErrorMessage('');
              }}
              placeholder="مثال: حيدر أحمد علي"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>كلمة المرور الخاصة بالحساب:</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="أدخل كلمة المرور..."
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="تبديل إظهار كلمة المرور"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Grade selection (shown when creating a new account or toggled) */}
          {isRegisterMode && (
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>اختر مرحلتك الدراسية (تتم فلترة المواد تلقائياً لصفك فقط):</span>
                <span className="text-[10px] text-emerald-600 font-normal">مطلوب للحساب الجديد</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                {IRAQI_GRADES.map((grade) => {
                  const isSelected = selectedGrade === grade.id;

                  return (
                    <button
                      key={grade.id}
                      type="button"
                      onClick={() => setSelectedGrade(grade.id)}
                      className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between text-xs ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-bold shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <span className="truncate">{grade.title}</span>
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 mr-1.5 ${
                          isSelected ? 'bg-emerald-600 text-white' : 'border border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dual Main Choice Buttons: Login (Old Account) VS Create New Account */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Option 1: Login on Old Account */}
              <button
                type="button"
                onClick={handleExistingLogin}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold shadow-md transition-all ${
                  !isRegisterMode
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول (الحساب القديم)</span>
              </button>

              {/* Option 2: Create New Account */}
              <button
                type="button"
                onClick={() => {
                  if (!isRegisterMode) {
                    setIsRegisterMode(true);
                  } else {
                    handleNewRegistration();
                  }
                }}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold shadow-md transition-all ${
                  isRegisterMode
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>{isRegisterMode ? 'تأكيد إنشاء الحساب الجديد' : 'إنشاء حساب جديد'}</span>
              </button>
            </div>

            {isRegisterMode && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(false)}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                >
                  لديك حساب قديم بالفعل؟ اضغط هنا لتسجيل الدخول
                </button>
              </div>
            )}
          </div>

        </form>

        {isClosable && onClose && (
          <div className="text-center pt-2">
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              إلغاء وإغلاق
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
