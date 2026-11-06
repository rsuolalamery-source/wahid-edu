import { IraqiSubject, IraqiGradeId, Badge, MalzamaItem, RecitationItem } from '../types';

export interface IraqiGradeMeta {
  id: IraqiGradeId;
  title: string;
  stage: 'متوسط' | 'علمي' | 'أدبي';
  isMinisterial: boolean;
  description: string;
}

export const IRAQI_GRADES: IraqiGradeMeta[] = [
  {
    id: '1-intermediate',
    title: 'الأول المتوسط',
    stage: 'متوسط',
    isMinisterial: false,
    description: 'المرحلة المتوسطة: المنهج المطور المعتمد لوزارة التربية العراقية'
  },
  {
    id: '2-intermediate',
    title: 'الثاني المتوسط',
    stage: 'متوسط',
    isMinisterial: false,
    description: 'المرحلة المتوسطة: المناهج العلمية والأدبية واللغات'
  },
  {
    id: '3-intermediate',
    title: 'الثالث المتوسط (وزاري)',
    stage: 'متوسط',
    isMinisterial: true,
    description: 'مرحلة البكالوريا والامتحانات الوزارية العامة للمرحلة المتوسطة'
  },
  {
    id: '4-prep-scientific',
    title: 'الرابع العلمي',
    stage: 'علمي',
    isMinisterial: false,
    description: 'المرحلة الإعدادية: الفرع العلمي (الرياضيات، الكيمياء، الفيزياء، الأحياء)'
  },
  {
    id: '5-prep-scientific',
    title: 'الخامس العلمي',
    stage: 'علمي',
    isMinisterial: false,
    description: 'المرحلة الإعدادية: الأساس العلمي المتين لمرحلة السادس'
  },
  {
    id: '6-prep-scientific',
    title: 'السادس العلمي (وزاري)',
    stage: 'علمي',
    isMinisterial: true,
    description: 'مرحلة البكالوريا والقبول المركزي لكليات الطب والهندسة والعلوم'
  },
  {
    id: '4-prep-literary',
    title: 'الرابع الأدبي',
    stage: 'أدبي',
    isMinisterial: false,
    description: 'المرحلة الإعدادية: الفرع الأدبي (التاريخ، الجغرافية، واللغات)'
  },
  {
    id: '5-prep-literary',
    title: 'الخامس الأدبي',
    stage: 'أدبي',
    isMinisterial: false,
    description: 'الفلسفة والمنطق، علم الاجتماع، الاقتصاد، التاريخ، والجغرافية'
  },
  {
    id: '6-prep-literary',
    title: 'السادس الأدبي (وزاري)',
    stage: 'أدبي',
    isMinisterial: true,
    description: 'مرحلة البكالوريا للفرع الأدبي المؤهلة لكليات القانون والآداب والإدارة'
  }
];

// جدول المواد المعتمد رسمياً لكل صف
export const GRADE_EXACT_SUBJECTS: Record<IraqiGradeId, string[]> = {
  '1-intermediate': [
    'الرياضيات',
    'اللغة العربية',
    'اللغة الإنجليزية',
    'التربية الإسلامية',
    'الاجتماعيات (تاريخ، جغرافية، وطنية)',
    'الفيزياء',
    'الكيمياء',
    'الأحياء'
  ],
  '2-intermediate': [
    'الرياضيات',
    'اللغة العربية',
    'اللغة الإنجليزية',
    'التربية الإسلامية',
    'الاجتماعيات (تاريخ، جغرافية، وطنية)',
    'الفيزياء',
    'الكيمياء',
    'الأحياء'
  ],
  '3-intermediate': [
    'الرياضيات',
    'اللغة العربية',
    'اللغة الإنجليزية',
    'التربية الإسلامية',
    'الاجتماعيات (تاريخ، جغرافية، وطنية)',
    'الفيزياء',
    'الكيمياء',
    'الأحياء'
  ],
  '4-prep-scientific': [
    'الرياضيات',
    'اللغة العربية',
    'اللغة الإنجليزية',
    'التربية الإسلامية',
    'الفيزياء',
    'الكيمياء',
    'الأحياء'
  ],
  '5-prep-scientific': [
    'الرياضيات',
    'اللغة العربية',
    'اللغة الإنجليزية',
    'التربية الإسلامية',
    'الفيزياء',
    'الكيمياء',
    'الأحياء'
  ],
  '6-prep-scientific': [
    'الرياضيات',
    'اللغة العربية',
    'اللغة الإنجليزية',
    'التربية الإسلامية',
    'الفيزياء',
    'الكيمياء',
    'الأحياء'
  ],
  '4-prep-literary': [
    'الرياضيات',
    'اللغة العربية',
    'اللغة الإنجليزية',
    'التربية الإسلامية',
    'التاريخ',
    'الجغرافية'
  ],
  '5-prep-literary': [
    'اللغة العربية',
    'اللغة الإنجليزية',
    'التربية الإسلامية',
    'التاريخ',
    'الجغرافية',
    'علم الاجتماع',
    'الفلسفة والمنطق',
    'الاقتصاد'
  ],
  '6-prep-literary': [
    'اللغة العربية',
    'اللغة الإنجليزية',
    'التربية الإسلامية',
    'التاريخ',
    'الجغرافية',
    'الاقتصاد',
    'الرياضيات (خاصة بالأدبي)'
  ]
};

// المواد والمحاضرات المنشورة من قبل الأساتذة
export const INITIAL_IRAQI_SUBJECTS: IraqiSubject[] = [
  // ===================== الأول المتوسط =====================
  {
    id: 'sub-1i-math',
    title: 'الرياضيات - الأول المتوسط',
    gradeId: '1-intermediate',
    gradeLabel: 'الأول المتوسط',
    branch: 'متوسط',
    semester: 'الكورس الأول',
    teacherName: 'أ. حيدر وليد',
    teacherTitle: 'مدرس الرياضيات الأول في العراق',
    iconName: 'Calculator',
    description: 'منهج الرياضيات المطور: الحساب الذهني والقوى، ترتيب العمليات، المعادلات الخطية، والجذور التربيعية والتكعيبية.',
    lessons: [
      {
        id: 'les-1m-1',
        title: 'المحاضرة 1: الحساب الذهني والقوى والصورة العلمية والرقمية',
        durationMinutes: 30,
        youtubeVideoId: 'f0Rj5x6gq7M',
        youtubeUrl: 'https://www.youtube.com/watch?v=f0Rj5x6gq7M',
        teacherName: 'أ. حيدر وليد',
        notes: `مفهوم القوى: a^n تعني ضرب الأساس a في نفسه n من المرات.
خاصية الإبدال والتجميع والتوزيع:
a × (b + c) = a×b + a×c
الصورة العلمية: كتابة العدد كحاصل ضرب عدد بين 1 و 10 في قوى العدد 10.`,
        aiSummaryPoints: [
          'القوى (الأسس): ضرب العدد في نفسه بعدد مرات الأس.',
          'الأس صفر: أي عدد غير الصفر مرفوع للأس صفر يساوي 1 دائماً (a^0 = 1).',
          'الصورة العلمية تُستخدم لتبسيط كتابة الأرقام الكبيرة جداً.'
        ],
        keyFormulas: ['a^0 = 1', 'a^1 = a', '10^n = 1 وبجانبه n أصفار'],
        dailyQuiz: [
          {
            id: 'dq-1m-1',
            question: 'ما هي قيمة المقدار: 4^3؟',
            options: ['64', '12', '16', '81'],
            correctIndex: 0,
            explanation: '4^3 = 4 × 4 × 4 = 16 × 4 = 64.'
          },
          {
            id: 'dq-1m-2',
            question: 'الصورة الرقمية للعدد 7 × 10^4 هي:',
            options: ['70,000', '7,000', '700', '700,000'],
            correctIndex: 0,
            explanation: '10^4 تعني 10,000، إذن 7 × 10,000 = 70,000.'
          }
        ]
      },
      {
        id: 'les-1m-2',
        title: 'المحاضرة 2: ترتيب العمليات على الأعداد الصحيحة والقيمة المطلقة',
        durationMinutes: 32,
        youtubeVideoId: 'yv_2q1A6xQw',
        youtubeUrl: 'https://www.youtube.com/watch?v=yv_2q1A6xQw',
        teacherName: 'أ. حيدر وليد',
        notes: `ترتيب العمليات الرياضية:
1. نبدأ بالعمليات بين الأقواس أولاً.
2. نضرب ونقسم من اليسار إلى اليمين.
3. نجمع ونطرح من اليسار إلى اليمين.
القيمة المطلقة: |x| هي المسافة بين x والصفر وتكون دائماً موجبة أو صفر.`,
        aiSummaryPoints: [
          'القيمة المطلقة تجعل أي عدد سالباً موجباً: |-8| = 8.',
          'الأقواس دائماً تسبق عمليات الضرب والقسمة والجمع.'
        ],
        dailyQuiz: [
          {
            id: 'dq-1m-3',
            question: 'ما هو ناتج: |-15| + |8|؟',
            options: ['23', '-7', '7', '-23'],
            correctIndex: 0,
            explanation: '|-15| = 15 و |8| = 8، إذن 15 + 8 = 23.'
          }
        ]
      }
    ],
    monthlyExams: [
      {
        id: 'exam-1m-m1',
        title: 'الامتحان الشهري الأول - الرياضيات (الأول المتوسط)',
        type: 'monthly',
        timeAllowedMinutes: 45,
        totalMarks: 100,
        questions: [
          {
            id: 'q-1m-e1',
            question: 'ناتج العملية: (24 - 6) ÷ 3 هو:',
            options: ['6', '8', '22', '12'],
            correctIndex: 0,
            explanation: 'نبدأ بما بين القوسين: 24 - 6 = 18، ثم 18 ÷ 3 = 6.'
          }
        ]
      }
    ]
  },

  {
    id: 'sub-1i-arabic',
    title: 'اللغة العربية - الأول المتوسط',
    gradeId: '1-intermediate',
    gradeLabel: 'الأول المتوسط',
    branch: 'متوسط',
    semester: 'الكورس الأول',
    teacherName: 'أ. عقيل الزبيدي',
    teacherTitle: 'مدرس اللغة العربية والأدب',
    iconName: 'BookMarked',
    description: 'أقسام الكلام (الاسم والفعل والحرف)، علامات الإعراب، والنصوص الشعرية وقواعد الخط والإملاء.',
    lessons: [
      {
        id: 'les-1a-1',
        title: 'المحاضرة 1: أقسام الكلام (الاسم، الفعل، الحرف) وعلامات التمييز',
        durationMinutes: 28,
        youtubeVideoId: 'UeR_VvH7e-4',
        youtubeUrl: 'https://www.youtube.com/watch?v=UeR_VvH7e-4',
        teacherName: 'أ. عقيل الزبيدي',
        notes: `الاسم: كلمة تدل على معنى في نفسها غير مقترن بزمان (علاماته: التنوين، دخول أل التعريف، الجر بحرف الجر).
الفعل: ما دل على حدث مقترن بزمن (ماضٍ، مضارع، أمر).
الحرف: كلمة لا يظهر معناها كاملاً إلا مع غيرها.`,
        aiSummaryPoints: [
          'علامات الاسم الأساسية: الجر، التنوين، ودخول (الـ) التعريف.',
          'علامات الفعل الماضي: قبول تاء التأنيث الساكنة وتاء الفاعل.'
        ],
        dailyQuiz: [
          {
            id: 'dq-1a-1',
            question: 'أي من الكلمات التالية تعتبر اسماً بدليل قبولها التنوين؟',
            options: ['كتابٌ', 'يكتبُ', 'عن', 'كتبَ'],
            correctIndex: 0,
            explanation: 'التنوين من علامات الأسماء الخاصة.'
          }
        ]
      }
    ],
    monthlyExams: [
      {
        id: 'exam-1a-m1',
        title: 'الامتحان الشهري الأول - قواعد اللغة العربية',
        type: 'monthly',
        timeAllowedMinutes: 45,
        totalMarks: 100,
        questions: [
          {
            id: 'q-1a-e1',
            question: 'في جملة «سَافَرَ الطَّالِبُ»، كلمة (سافرَ) هي فعل:',
            options: ['ماضٍ مبني على الفتح', 'مضارع مرفوع', 'أمر مبني', 'اسم مجرور'],
            correctIndex: 0,
            explanation: 'سافرَ فعل ماضٍ لدلالته على حدث وقع في الزمان الماضي.'
          }
        ]
      }
    ]
  },

  {
    id: 'sub-1i-english',
    title: 'اللغة الإنجليزية - الأول المتوسط',
    gradeId: '1-intermediate',
    gradeLabel: 'الأول المتوسط',
    branch: 'متوسط',
    semester: 'Unit 1 & 2',
    teacherName: 'أ. محمد العبيدي',
    teacherTitle: 'مدرس اللغة الإنجليزية لمدارس العراق',
    iconName: 'Languages',
    description: 'English for Iraq - First Intermediate: Grammar, Vocabulary, Reading, and Monthly Tests.',
    lessons: [
      {
        id: 'les-1e-1',
        title: 'Lecture 1: Unit 1 - Past Simple Tense and Holidays',
        durationMinutes: 25,
        youtubeVideoId: 'wY1x7oX22B0',
        youtubeUrl: 'https://www.youtube.com/watch?v=wY1x7oX22B0',
        teacherName: 'أ. محمد العبيدي',
        notes: `Past Simple: used to talk about finished actions in the past.
Regular: play -> played. Irregular: go -> went.`,
        aiSummaryPoints: [
          'Past simple takes -ed for regular verbs.',
          'Irregular verbs change form (go -> went).'
        ],
        dailyQuiz: [
          {
            id: 'dq-1e-1',
            question: 'What is the past form of the irregular verb "go"?',
            options: ['went', 'goed', 'goes', 'going'],
            correctIndex: 0,
            explanation: '"Go" is irregular, its past is "went".'
          }
        ]
      }
    ],
    monthlyExams: []
  },

  {
    id: 'sub-1i-islamic',
    title: 'التربية الإسلامية - الأول المتوسط',
    gradeId: '1-intermediate',
    gradeLabel: 'الأول المتوسط',
    branch: 'متوسط',
    semester: 'المنهج الكامل',
    teacherName: 'أ. عمار الساعدي',
    teacherTitle: 'مدرس التربية الإسلامية والقرآن الكريم',
    iconName: 'BookOpen',
    description: 'أحكام التلاوة (المد المتصل والمنفصل والبدل)، السور المقررة للحفظ والشرح، والأحاديث النبوية الشريفة وأخلاق المسلم.',
    lessons: [
      {
        id: 'les-1is-1',
        title: 'المحاضرة 1: أحكام التلاوة - المد المتصل والمد المنفصل ومد البدل',
        durationMinutes: 28,
        youtubeVideoId: 'UeR_VvH7e-4',
        youtubeUrl: 'https://www.youtube.com/watch?v=UeR_VvH7e-4',
        teacherName: 'أ. عمار الساعدي',
        notes: `حروف المد ثلاثة: (الألف الساكنة المفتوح ما قبلها، الواو الساكنة المضموم ما قبلها، الياء الساكنة المكسور ما قبلها).
المد المتصل: أن يجتمع حرف المد والهمزة في كلمة واحدة (مثل: السَّمَاء، جِيءَ، سُوء). مدته 4-5 حركات.
المد المنفصل: أن يأتي حرف المد في نهاية كلمة والهمزة في بداية الكلمة التي تليها (مثل: يَا أَيُّهَا، فِي أَنفُسِكُمْ).`,
        aiSummaryPoints: [
          'المد المتصل: الهمزة وحرف المد في كلمة واحدة.',
          'المد المنفصل: حرف المد في كلمة والهمزة في كلمة تالية.'
        ],
        dailyQuiz: [
          {
            id: 'dq-1is-1',
            question: 'في كلمة «السَّمَاء»، نوع المد هو:',
            options: ['مد متصل', 'مد منفصل', 'مد بدل', 'مد لازم'],
            correctIndex: 0,
            explanation: 'لاجتماع حرف المد والهمزة في نفس الكلمة.'
          }
        ]
      }
    ],
    monthlyExams: []
  },

  {
    id: 'sub-1i-social',
    title: 'الاجتماعيات (تاريخ، جغرافية، وطنية) - الأول المتوسط',
    gradeId: '1-intermediate',
    gradeLabel: 'الأول المتوسط',
    branch: 'متوسط',
    semester: 'المنهج الكامل',
    teacherName: 'أ. قصي الدليمي',
    teacherTitle: 'مدرس التاريخ والحضارات',
    iconName: 'Landmark',
    description: 'حضارات وادي الرافدين القديمة (السومرية والبابلية والآشورية)، وجغرافية الوطن العربي والمفاهيم الوطنية.',
    lessons: [
      {
        id: 'les-1s-1',
        title: 'المحاضرة 1: حضارة وادي الرافدين واختراع الكتابة المسمارية',
        durationMinutes: 30,
        youtubeVideoId: 'm4XwQ5Y6z7A',
        youtubeUrl: 'https://www.youtube.com/watch?v=m4XwQ5Y6z7A',
        teacherName: 'أ. قصي الدليمي',
        notes: `حضارة العراق مهد القوانين والمدن الأولى. السومريون هم أول من ابتكر الكتابة المسمارية في الألف الرابع ق.م.`,
        dailyQuiz: [
          {
            id: 'dq-1soc-1',
            question: 'ابتكر السومريون في بلاد الرافدين الكتابة المعروفة بـ:',
            options: ['الكتابة المسمارية', 'الهيروغليفية', 'الخط الفينيقي', 'اللاتينية'],
            correctIndex: 0,
            explanation: 'الكتابة المسمارية سُميت لأنها نُقشت بأقلام تشبه المسامير.'
          }
        ]
      }
    ],
    monthlyExams: []
  },

  {
    id: 'sub-1i-physics',
    title: 'الفيزياء - الأول المتوسط',
    gradeId: '1-intermediate',
    gradeLabel: 'الأول المتوسط',
    branch: 'متوسط',
    semester: 'الكورس الأول',
    teacherName: 'أ. حسن عبد الكاظم',
    teacherTitle: 'مدرس الفيزياء المعتمد',
    iconName: 'Zap',
    description: 'خواص المادة، قياس الحجم والكتلة، وحساب الكثافة وقوانين الضغط والقوة.',
    lessons: [
      {
        id: 'les-1p-1',
        title: 'المحاضرة 1: قياس حجوم المواد وقانون الكثافة والتطبيقات',
        durationMinutes: 28,
        youtubeVideoId: 'V9E6fWk44a8',
        youtubeUrl: 'https://www.youtube.com/watch?v=V9E6fWk44a8',
        teacherName: 'أ. حسن عبد الكاظم',
        notes: `الكثافة = الكتلة ÷ الحجم (ρ = m / V). الجسم يطفو إذا كانت كثافته أقل من كثافة السائل.`,
        dailyQuiz: [
          {
            id: 'dq-1p-1',
            question: 'جسم كتلته 20g وحجمه 5cm³، كم تبلغ كثافته؟',
            options: ['4 g/cm³', '100 g/cm³', '15 g/cm³', '0.25 g/cm³'],
            correctIndex: 0,
            explanation: 'الكثافة = 20 ÷ 5 = 4 g/cm³.'
          }
        ]
      }
    ],
    monthlyExams: []
  },

  {
    id: 'sub-1i-chemistry',
    title: 'الكيمياء - الأول المتوسط',
    gradeId: '1-intermediate',
    gradeLabel: 'الأول المتوسط',
    branch: 'متوسط',
    semester: 'الكورس الأول',
    teacherName: 'أ. مهند السوداني',
    teacherTitle: 'مدرس الكيمياء الأول',
    iconName: 'FlaskConical',
    description: 'الذرة ومكوناتها والعدد الذري والعدد الكتلي، والتوزيع الإلكتروني في المدارات.',
    lessons: [
      {
        id: 'les-1c-1',
        title: 'المحاضرة 1: مكونات الذرة والبروتونات والنيوترونات والإلكترونات',
        durationMinutes: 30,
        youtubeVideoId: '8aN_Uu09a0E',
        youtubeUrl: 'https://www.youtube.com/watch?v=8aN_Uu09a0E',
        teacherName: 'أ. مهند السوداني',
        notes: `الذرة تتكون من نواة (بروتونات موجبة ونيوترونات متعادلة) وإلكترونات سالبة تدور حولها.`,
        dailyQuiz: [
          {
            id: 'dq-1c-1',
            question: 'العدد الذري لعنصر الكربون 6 وعدده الكتلي 12، فكم عدد النيوترونات؟',
            options: ['6', '12', '18', '0'],
            correctIndex: 0,
            explanation: 'النيوترونات = 12 - 6 = 6.'
          }
        ]
      }
    ],
    monthlyExams: []
  },

  {
    id: 'sub-1i-biology',
    title: 'الأحياء - الأول المتوسط',
    gradeId: '1-intermediate',
    gradeLabel: 'الأول المتوسط',
    branch: 'متوسط',
    semester: 'الكورس الثاني',
    teacherName: 'أ. ماهر نايف',
    teacherTitle: 'مدرس علم الأحياء والوراثة',
    iconName: 'Microscope',
    description: 'المجهر الضوئي والخلية ومكوناتها والعضيات الخلوية وبيوت الطاقة (الميتوكوندريا).',
    lessons: [
      {
        id: 'les-1b-1',
        title: 'المحاضرة 1: المجهر والخلية الحية والميتوكوندريا',
        durationMinutes: 26,
        youtubeVideoId: 'kS4k7X2x_Q8',
        youtubeUrl: 'https://www.youtube.com/watch?v=kS4k7X2x_Q8',
        teacherName: 'أ. ماهر نايف',
        notes: `الخلية وحدة البناء والوظيفة. الميتوكوندريا هي المسؤولة عن تحرير الطاقة ATP في الخلية.`,
        dailyQuiz: [
          {
            id: 'dq-1b-1',
            question: 'العضية الخلوية المسؤولة عن تحرير الطاقة في الخلية تسمى:',
            options: ['الميتوكوندريا', 'جهاز كولجي', 'الرايبوسومات', 'الغشاء النووي'],
            correctIndex: 0,
            explanation: 'الميتوكوندريا هي بيوت الطاقة.'
          }
        ]
      }
    ],
    monthlyExams: []
  },

  // ===================== السادس العلمي =====================
  {
    id: 'sub-6s-math',
    title: 'الرياضيات - السادس العلمي',
    gradeId: '6-prep-scientific',
    gradeLabel: 'السادس العلمي (وزاري)',
    branch: 'علمي',
    semester: 'المنهج الكامل',
    teacherName: 'أ. حيدر وليد',
    teacherTitle: 'مدرس الرياضيات الأول في العراق',
    iconName: 'Calculator',
    description: 'الأعداد المركبة، مبرهنة دي موافر، القطوع المخروطية، التفاضل والتكامل، وتطبيقات الهندسة الفضائية.',
    lessons: [
      {
        id: 'les-6sm-1',
        title: 'المحاضرة 1: الأعداد المركبة ومفهوم الوحدة التخيلية (i)',
        durationMinutes: 42,
        youtubeVideoId: 'Jg7rLg1kP-c',
        youtubeUrl: 'https://www.youtube.com/watch?v=Jg7rLg1kP-c',
        teacherName: 'أ. حيدر وليد',
        notes: `قاعدة قسمة أسس i على 4 ومرافق العدد المركب: a + bi مرافقه a - bi.`,
        dailyQuiz: [
          {
            id: 'dq-6sm-1',
            question: 'ما هي قيمة المقدار i^{27} في أبسط صورة؟',
            options: ['-i', 'i', '1', '-1'],
            correctIndex: 0,
            explanation: '27 ÷ 4 = 6 والباقي 3، إذن i^3 = -i.',
            isMinisterial: true
          }
        ]
      }
    ],
    monthlyExams: [
      {
        id: 'exam-6s-math-m1',
        title: 'الامتحان الشهري الأول - الأعداد المركبة (السادس العلمي)',
        type: 'monthly',
        timeAllowedMinutes: 60,
        totalMarks: 100,
        questions: [
          {
            id: 'q-6sm-e1',
            question: 'إذا كان x + yi = (1 + 2i)(3 - i)، فما هي قيمتي x و y؟',
            options: ['x = 5, y = 5', 'x = 3, y = 2', 'x = 1, y = 5', 'x = 5, y = 1'],
            correctIndex: 0,
            explanation: '3 - i + 6i + 2 = 5 + 5i، إذن x = 5 و y = 5.',
            isMinisterial: true
          }
        ]
      }
    ]
  }
];

// مكتبة الملازم الدراسية الرسمية المعتمدة
export const SAMPLE_MALAZEM: MalzamaItem[] = [
  {
    id: 'malzama-math-1i',
    title: 'ملزمة الرياضيات الذهبية - الأول المتوسط',
    teacherName: 'أ. حيدر وليد',
    gradeId: '1-intermediate',
    gradeLabel: 'الأول المتوسط',
    subjectTitle: 'الرياضيات',
    pagesCount: 140,
    editionYear: '2026 / المنهج المطور',
    description: 'شرح شامل ومفصل لجميع تمارين وأمثلة الكتاب مع حلول المسائل الحياتية ونماذج الامتحانات الشهرية ونصف السنة.',
    downloadUrl: '#',
    fileSizeBytes: '18.4 MB',
    previewChapters: ['الفصل الأول: الأعداد الصحيحة', 'الفصل الثاني: الأعداد النسبية', 'الفصل الثالث: الحدوديات والمقادير']
  },
  {
    id: 'malzama-arabic-1i',
    title: 'الدروس الوافية في قواعد اللغة العربية',
    teacherName: 'أ. عقيل الزبيدي',
    gradeId: '1-intermediate',
    gradeLabel: 'الأول المتوسط',
    subjectTitle: 'اللغة العربية',
    pagesCount: 110,
    editionYear: 'طبعة 2026 المعتمدة',
    description: 'تفكيك وإعراب القواعد المقررة، شروحات مبسطة للتفريق بين الأسماء والأفعال، وجداول تصريف الأفعال وحل تدريبات الكتاب.',
    downloadUrl: '#',
    fileSizeBytes: '14.2 MB',
    previewChapters: ['أقسام الكلام', 'المعرب والمبني', 'علامات الإعراب الأصلية والفرعية']
  },
  {
    id: 'malzama-science-1i',
    title: 'ملزمة العلوم المتكاملة (كيمياء وفيزياء وأحياء)',
    teacherName: 'أ. مهند السوداني & أ. حسن عبد الكاظم',
    gradeId: '1-intermediate',
    gradeLabel: 'الأول المتوسط',
    subjectTitle: 'الفيزياء والكيمياء',
    pagesCount: 160,
    editionYear: '2026 الحديثة',
    description: 'ملخص شامل للتعاريف والتعاليل والتجارب المخبرية مع حل جميع أسئلة الفصول ومسائل الكثافة والكتلة.',
    downloadUrl: '#',
    fileSizeBytes: '22.0 MB',
    previewChapters: ['خواص المادة وقياسها', 'الذرات والعناصر والجدول الدوري', 'الخلية وعلم الأحياء']
  },
  {
    id: 'malzama-social-1i',
    title: 'ملزمة الاجتماعيات الشاملة (تاريخ، جغرافية، وطنية)',
    teacherName: 'أ. قصي الدليمي',
    gradeId: '1-intermediate',
    gradeLabel: 'الأول المتوسط',
    subjectTitle: 'الاجتماعيات (تاريخ، جغرافية، وطنية)',
    pagesCount: 95,
    editionYear: '2026',
    description: 'خرائط ملونة، ملخصات حضارة بلاد الرافدين، وحل أسئلة الفصول الوزارية والامتحانات الشهرية.',
    downloadUrl: '#',
    fileSizeBytes: '12.8 MB',
    previewChapters: ['حضارة بلاد الرافدين والشرائع', 'جغرافية العالم العربي وتضاريسه', 'التربية الوطنية والمواطنة']
  },
  {
    id: 'malzama-math-6s',
    title: 'ملزمة الرياضيات الوزارية الشاملة - السادس العلمي',
    teacherName: 'أ. حيدر وليد',
    gradeId: '6-prep-scientific',
    gradeLabel: 'السادس العلمي (وزاري)',
    subjectTitle: 'الرياضيات',
    pagesCount: 320,
    editionYear: '2026 مع حلول الوزاريات لغاية 2025 دور ثالث',
    description: 'الملزمة الأقوى في العراق للأعداد المركبة والقطوع والتفاضل والتكامل مع شروحات مبرهنة دي موافر ورول.',
    downloadUrl: '#',
    fileSizeBytes: '45.0 MB',
    previewChapters: ['الفصل الأول: الأعداد المركبة', 'الفصل الثاني: القطوع المخروطية', 'الفصل الثالث: تطبيقات التفاضل']
  }
];

// بنك التسميع التفاعلي "سمّعني" (Recitation & Oral Testing)
export const SAMPLE_RECITATIONS: RecitationItem[] = [
  // ===================== الخامس العلمي =====================
  {
    id: 'rec-5s-phys-1',
    title: 'قانون الجذب العام لنيوتن (الفيزياء - الخامس العلمي)',
    category: 'قوانين وتعريفات',
    gradeId: '5-prep-scientific',
    subjectTitle: 'الفيزياء',
    bookletOrTopic: 'ملزمة فيزياء الخامس العلمي - أ. حسن عبد الكاظم',
    chapterOrPage: 'الفصل الثاني: الحركة الدائرية وقوانين الجاذبية (ص 28)',
    questionPrompt: 'سمّع نص قانون الجذب العام لنيوتن مع ذكر علاقة التناسب بين الكتل والمسافة:',
    targetText: 'كل جسمين ماديين في الكون يتجاذبان بقوة تتناسب طرديا مع حاصل ضرب كتلتيهما وعكسيا مع مربع البعد بين مركزيهما',
    authorOrSource: 'كتاب فيزياء الخامس العلمي - الفصل الثاني',
    clues: ['يتناسب طردياً مع ضرب الكتلتين', 'وعكسياً مع مربع البعد']
  },
  {
    id: 'rec-5s-chem-1',
    title: 'قاعدة هوند والتوزيع الإلكتروني (الكيمياء - الخامس العلمي)',
    category: 'قوانين وتعريفات',
    gradeId: '5-prep-scientific',
    subjectTitle: 'الكيمياء',
    bookletOrTopic: 'ملزمة الكيمياء الحديثة - أ. مهند السوداني',
    chapterOrPage: 'الفصل الأول: البناء الذري والتكافؤ (ص 16)',
    questionPrompt: 'سمّع نص قاعدة هوند المعتمدة في توزيع الإلكترونات داخل الأوربيتالات:',
    targetText: 'لا يحدث ازدواج بين الكترونين في مستوى الطاقة الثانوي الا بعد ان تشغل اوربيتالاته فرادى اولا',
    authorOrSource: 'كتاب كيمياء الخامس العلمي - وزارة التربية',
    clues: ['تشغل أوربيتالاته فرادى أولاً', 'ثم يبدأ الازدواج']
  },
  {
    id: 'rec-5s-bio-1',
    title: 'مفهوم التنفس الخلوي والبناء الضوئي (الأحياء - الخامس العلمي)',
    category: 'قوانين وتعريفات',
    gradeId: '5-prep-scientific',
    subjectTitle: 'الأحياء',
    bookletOrTopic: 'ملزمة الأحياء الشاملة - أ. ماهر نايف',
    chapterOrPage: 'الفصل الثالث: التنفس الخلوي وتبادل الغازات (ص 44)',
    questionPrompt: 'سمّع تعريف التنفس الخلوي والهدف الحيوي من حدوثه في الكائنات الحية:',
    targetText: 'التنفس الخلوي هو عملية تحرير الطاقة الكيميائية المخزونة في جزيئات سكر الجلوكوز وتحويلها الى طاقة قابلة للاستعمال الخلوي على شكل ادينوسين ثلاثي الفوسفات',
    authorOrSource: 'كتاب أحياء الخامس العلمي',
    clues: ['تحرير الطاقة الكيميائية', 'إنتاج ATP']
  },
  {
    id: 'rec-5s-arab-1',
    title: 'قصيدة المتنبي في عزة النفس (اللغة العربية - الخامس العلمي والأدبي)',
    category: 'أدب ونصوص',
    gradeId: '5-prep-scientific',
    subjectTitle: 'اللغة العربية',
    bookletOrTopic: 'ملزمة الأدب والنصوص - أ. عقيل الزبيدي',
    chapterOrPage: 'الوحدة الرابعة: روائع الأدب العباسي (ص 52)',
    questionPrompt: 'سمّع الأبيات الثلاثة الأولى من قصيدة أبي الطيب المتنبي في عزة النفس:',
    targetText: 'على قدر اهل العزم تاتي العزائم وتاتي على قدر الكرام المكارم وتعظم في عين الصغير صغارها وتصغر في عين العظيم العظائم',
    authorOrSource: 'ديوان أبي الطيب المتنبي',
    clues: ['على قدر أهل العزم تأتي العزائم', 'وتعظم في عين الصغير صغارها']
  },

  // ===================== السادس العلمي (وزاري) =====================
  {
    id: 'rec-6s-phys-1',
    title: 'سعة المتسعة وقوة لورنز (الفيزياء - السادس العلمي)',
    category: 'قوانين وتعريفات',
    gradeId: '6-prep-scientific',
    subjectTitle: 'الفيزياء',
    bookletOrTopic: 'ملزمة الفيزياء الوزارية الذهبية - أ. حسن عبد الكاظم',
    chapterOrPage: 'الفصل الأول: المتسعات (ص 9)',
    questionPrompt: 'سمّع نص تعريف سعة المتسعة المعتمد وزارياً:',
    targetText: 'سعة المتسعة هي النسبة بين الشحنة المختزنة على اي من صفيحتيها الى فرق الجهد الكهربائي بين الصفيحتين وتقاس بوحدة الفاراد',
    authorOrSource: 'فيزياء السادس العلمي - وزاري مكرر',
    clues: ['النسبة بين الشحنة وفرق الجهد', 'وحدة القياس الفاراد']
  },
  {
    id: 'rec-6s-chem-1',
    title: 'قاعدة لوشاتليه (الكيمياء - السادس العلمي)',
    category: 'قوانين وتعريفات',
    gradeId: '6-prep-scientific',
    subjectTitle: 'الكيمياء',
    bookletOrTopic: 'ملزمة الكيمياء الوزارية - أ. مهند السوداني',
    chapterOrPage: 'الفصل الثاني: الاتزان الكيميائي (ص 38)',
    questionPrompt: 'سمّع نص قاعدة لوشاتليه كاملة كما وردت في الامتحان الوزاري:',
    targetText: 'اذا اثر مؤثر خارجي مثل تغير التركيز او الحجم او الضغط او درجة الحرارة على تفاعل في حالة اتزان فان هذا التفاعل يتجه بالاتجاه الذي يقلل من تاثير ذلك المؤثر ليصل الى حالة اتزان جديدة',
    authorOrSource: 'كيمياء السادس العلمي - وزاري مكرر',
    clues: ['إذا أثر مؤثر خارجي', 'يتجه بالاتجاه الذي يقلل من تأثير ذلك المؤثر']
  },
  {
    id: 'rec-6s-math-1',
    title: 'مبرهنة رول والشروط الثلاثة (الرياضيات - السادس العلمي)',
    category: 'قوانين وتعريفات',
    gradeId: '6-prep-scientific',
    subjectTitle: 'الرياضيات',
    bookletOrTopic: 'ملزمة الرياضيات الوزارية - أ. حيدر وليد',
    chapterOrPage: 'الفصل الثالث: تطبيقات التفاضل (ص 95)',
    questionPrompt: 'سمّع شروط مبرهنة رول الثلاثة الرياضية:',
    targetText: 'الدالة مستمرة على الفترة المغلقة وقابلة للاشتقاق على الفترة المفتوحة و f(a) تساوي f(b) حينئذ يوجد على الاقل عدد c ينتمي للفترة المفتوحة يحقق المشتقة عنده تساوي صفرا',
    authorOrSource: 'رياضيات السادس العلمي - مبرهنة رول',
    clues: ['مستمرة على الفترة المغلقة', 'قابلة للاشتقاق على الفترة المفتوحة', 'f(a) = f(b)']
  },
  {
    id: 'rec-6s-isl-1',
    title: 'سورة الحشر (التربية الإسلامية - السادس الإعدادي)',
    category: 'قرآن كريم',
    gradeId: '6-prep-scientific',
    subjectTitle: 'التربية الإسلامية',
    bookletOrTopic: 'ملزمة التربية الإسلامية والقرآن الكريم - أ. عمار الساعدي',
    chapterOrPage: 'الوحدة الأولى: أحكام التلاوة والحفظ (ص 14)',
    questionPrompt: 'سمّع ختام سورة الحشر ابتداءً من قوله تعالى «هو الله الذي لا إله إلا هو»:',
    targetText: 'هو الله الذي لا اله الا هو عالم الغيب والشهادة هو الرحمن الرحيم هو الله الذي لا اله الا هو الملك القدوس السلام المؤمن المهيمن العزيز الجبار المتكبر',
    authorOrSource: 'القرآن الكريم - أواخر سورة الحشر',
    clues: ['هو الله الذي لا إله إلا هو', 'الملك القدوس السلام المؤمن']
  },

  // ===================== الأول المتوسط =====================
  {
    id: 'rec-1i-phys-1',
    title: 'تعريف قانون الكثافة (الفيزياء - الأول المتوسط)',
    category: 'قوانين وتعريفات',
    gradeId: '1-intermediate',
    subjectTitle: 'الفيزياء',
    bookletOrTopic: 'ملزمة العلوم المتكاملة - أ. حسن عبد الكاظم',
    chapterOrPage: 'الفصل الأول: خواص المادة وقياسها (ص 12)',
    questionPrompt: 'سمّع تعريف الكثافة مع وحدات القياس الشائعة:',
    targetText: 'الكثافة هي كتلة وحدة الحجوم من المادة وتقاس بوحدة غرام على سنتيمتر مكعب او كيلوغرام على متر مكعب',
    authorOrSource: 'كتاب العلوم - الجزء الأول',
    clues: ['كتلة وحدة الحجوم', 'وحدة القياس g/cm³']
  },
  {
    id: 'rec-1i-isl-1',
    title: 'سورة الفجر (التربية الإسلامية - الأول المتوسط)',
    category: 'قرآن كريم',
    gradeId: '1-intermediate',
    subjectTitle: 'التربية الإسلامية',
    bookletOrTopic: 'كتاب التربية الإسلامية - المقرر الوزاري',
    chapterOrPage: 'الوحدة الأولى: السور المقررة للحفظ (ص 8)',
    questionPrompt: 'سمّع الآيات الخمس الأولى من سورة الفجر:',
    targetText: 'والفجر وليال عشر والشفع والوتر والليل اذا يسر هل في ذلك قسم لذي حجر',
    authorOrSource: 'القرآن الكريم - سورة الفجر (الآيات 1-5)',
    clues: ['والفجر وليال عشر', 'هل في ذلك قسم لذي حجر']
  },
  {
    id: 'rec-1i-isl-2',
    title: 'حديث نبوي شريف في بر الوالدين (الأول المتوسط)',
    category: 'حديث نبوي',
    gradeId: '1-intermediate',
    subjectTitle: 'التربية الإسلامية',
    bookletOrTopic: 'ملخص الأحاديث النبوية المقررة',
    chapterOrPage: 'الوحدة الثانية: الأخلاق الإسلامية (ص 22)',
    questionPrompt: 'سمّع الحديث الشريف الوارد في بر الوالدين وتقديم الأم:',
    targetText: 'جاء رجل الى رسول الله فقال من احق الناس بحسن صحابتي قال امك قال ثم من قال ثم امك قال ثم من قال ثم امك قال ثم من قال ثم ابوك',
    authorOrSource: 'صحيح البخاري ومسلم - حديث بر الوالدين',
    clues: ['تكرار الأم ثلاث مرات', 'ثم أبوك في المرة الرابعة']
  },

  // ===================== الثالث المتوسط (وزاري) =====================
  {
    id: 'rec-3i-phys-1',
    title: 'قانون أوم في الكهربائية (الفيزياء - الثالث المتوسط)',
    category: 'قوانين وتعريفات',
    gradeId: '3-intermediate',
    subjectTitle: 'الفيزياء',
    bookletOrTopic: 'ملزمة الفيزياء الوزارية - الثالث المتوسط',
    chapterOrPage: 'الفصل الثالث: التيار الكهربائي (ص 60)',
    questionPrompt: 'سمّع نص قانون أوم الكهربائي:',
    targetText: 'حاصل قسمة فرق الجهد الكهربائي بين طرفي مقاوم الى مقدار التيار المنساب فيه يساوي مقدارا ثابتا يسمى المقاومة الكهربائية',
    authorOrSource: 'فيزياء الثالث المتوسط - قانون أوم',
    clues: ['فرق الجهد مقسوماً على التيار', 'المقاومة = V / I']
  },
  {
    id: 'rec-3i-arab-1',
    title: 'قصيدة يا دجلة الخير - محمد مهدي الجواهري (الثالث المتوسط)',
    category: 'أدب ونصوص',
    gradeId: '3-intermediate',
    subjectTitle: 'اللغة العربية',
    bookletOrTopic: 'ملزمة الأدب والنصوص - الثالث المتوسط',
    chapterOrPage: 'الوحدة الثالثة: شعر المهجر والرواد (ص 40)',
    questionPrompt: 'سمّع البيتين الأولين من قصيدة يا دجلة الخير للشاعر محمد مهدي الجواهري:',
    targetText: 'حييت سفحك عن بعد فحييني يا دجلة الخير يا ام البساتين حييت سفحك ظمانا الوذ به لوذ الحمائم بين الماء والطين',
    authorOrSource: 'شاعر العرب الأكبر محمد مهدي الجواهري',
    clues: ['حييت سفحك عن بعد فحييني', 'يا دجلة الخير يا أم البساتين']
  }
];

// نظام الأوسمة
export const SYSTEM_BADGES: Badge[] = [
  {
    id: 'badge-first-step',
    title: 'وسام الخطوة الأولى',
    description: 'أتممت بنجاح أول محاضرة دراسية في المنصة.',
    icon: 'Rocket'
  },
  {
    id: 'badge-quiz-champ',
    title: 'بطل الاختبارات اليومية',
    description: 'اجتزت 3 اختبارات يومية تتابعية بنجاح.',
    icon: 'Zap'
  },
  {
    id: 'badge-perfect-100',
    title: 'الدرجة الكاملة (100%)',
    description: 'حققت 100% في امتحان تتابعي أو شهري وزاري.',
    icon: 'Crown'
  },
  {
    id: 'badge-streak-master',
    title: 'شعلة المواظبة اليومية',
    description: 'واصلت الدراسة والمتابعة لـ 5 أيام متتالية دون انقطاع.',
    icon: 'Flame'
  },
  {
    id: 'badge-recitation-star',
    title: 'فارس التسميع «سمّعني»',
    description: 'أتقنت تسميع نص محفوظ بدقة 90% فما فوق.',
    icon: 'ShieldCheck'
  },
  {
    id: 'badge-honor-cert',
    title: 'شهادة الشرف الوزارية',
    description: 'حصلت على شهادة إكمال المادة المعتمدة برمز QR.',
    icon: 'Award'
  }
];

// Teacher mapping helper by subject
function getTeacherForSubject(subj: string): { teacher: string; title: string; icon: string; ytId: string } {
  if (subj.includes('رياضيات')) return { teacher: 'أ. حيدر وليد', title: 'مدرس الرياضيات الأول في العراق', icon: 'Calculator', ytId: 'f0Rj5x6gq7M' };
  if (subj.includes('عربي') || subj.includes('العربية')) return { teacher: 'أ. عقيل الزبيدي', title: 'مدرس اللغة العربية والأدب', icon: 'BookMarked', ytId: 'UeR_VvH7e-4' };
  if (subj.includes('إنجليز') || subj.includes('الانجليزية')) return { teacher: 'أ. محمد العبيدي', title: 'مدرس اللغة الإنجليزية لمدارس العراق', icon: 'Languages', ytId: 'wY1x7oX22B0' };
  if (subj.includes('إسلامية')) return { teacher: 'أ. عمار الساعدي', title: 'مدرس التربية الإسلامية والقرآن', icon: 'BookOpen', ytId: 'UeR_VvH7e-4' };
  if (subj.includes('فيزياء')) return { teacher: 'أ. حسن عبد الكاظم', title: 'مدرس الفيزياء المعتمد', icon: 'Zap', ytId: 'V9E6fWk44a8' };
  if (subj.includes('كيمياء')) return { teacher: 'أ. مهند السوداني', title: 'مدرس الكيمياء الأول', icon: 'FlaskConical', ytId: '8aN_Uu09a0E' };
  if (subj.includes('أحياء')) return { teacher: 'أ. ماهر نايف', title: 'مدرس علم الأحياء والوراثة', icon: 'Microscope', ytId: 'kS4k7X2x_Q8' };
  if (subj.includes('اجتماعيات') || subj.includes('تاريخ')) return { teacher: 'أ. قصي الدليمي', title: 'مدرس التاريخ والحضارات', icon: 'Landmark', ytId: 'm4XwQ5Y6z7A' };
  if (subj.includes('جغراف')) return { teacher: 'أ. رعد التميمي', title: 'مدرس الجغرافية والخرائط', icon: 'Globe', ytId: 'm4XwQ5Y6z7A' };
  if (subj.includes('اقتصاد')) return { teacher: 'أ. عباس الشمري', title: 'مدرس الاقتصاد والعلوم المالية', icon: 'TrendingUp', ytId: 'f0Rj5x6gq7M' };
  if (subj.includes('فلسفة')) return { teacher: 'أ. أحمد الجبوري', title: 'مدرس الفلسفة وعلم المنطق', icon: 'Scale', ytId: 'UeR_VvH7e-4' };
  if (subj.includes('علم الاجتماع')) return { teacher: 'أ. هدى العامري', title: 'مدرسة علم الاجتماع والبحوث', icon: 'Users', ytId: 'UeR_VvH7e-4' };
  return { teacher: 'أستاذ المادة المعتمد', title: 'وزارة التربية العراقية', icon: 'BookOpen', ytId: 'f0Rj5x6gq7M' };
}

// Generate complete curriculum containing all exact subjects for every single grade
function buildCompleteCurriculum(): IraqiSubject[] {
  const result: IraqiSubject[] = [...INITIAL_IRAQI_SUBJECTS];
  const existingKeys = new Set(INITIAL_IRAQI_SUBJECTS.map(s => `${s.gradeId}_${s.title}`));

  IRAQI_GRADES.forEach(grade => {
    const subjectsForGrade = GRADE_EXACT_SUBJECTS[grade.id] || [];

    subjectsForGrade.forEach((subjName, idx) => {
      const subjectTitle = `${subjName} - ${grade.title}`;
      const key = `${grade.id}_${subjectTitle}`;

      // If already present in initial list, keep the rich manual one
      const existing = result.find(s => s.gradeId === grade.id && (s.title === subjectTitle || s.title.startsWith(subjName)));
      if (existing) return;

      const meta = getTeacherForSubject(subjName);

      const generatedSubject: IraqiSubject = {
        id: `sub-${grade.id}-${idx + 1}`,
        title: subjectTitle,
        gradeId: grade.id,
        gradeLabel: grade.title,
        branch: grade.stage,
        semester: 'الكورس الأول / المنهج الكامل',
        teacherName: meta.teacher,
        teacherTitle: meta.title,
        iconName: meta.icon,
        description: `المنهج الوزاري المقرر لمادة ${subjName} وفق توصيات وزارة التربية العراقية، متضمناً الشرح التتابعي والامتحانات اليومية والشهرية.`,
        lessons: [
          {
            id: `les-${grade.id}-${idx + 1}-1`,
            title: `المحاضرة 1: مدخل ومقدمة في مفردات ${subjName}`,
            durationMinutes: 30,
            youtubeVideoId: meta.ytId,
            youtubeUrl: `https://www.youtube.com/watch?v=${meta.ytId}`,
            teacherName: meta.teacher,
            notes: `ملخص المحاضرة الأولى لمادة ${subjName}:\n1. استيعاب المفاهيم والمصطلحات الأساسية.\n2. حل التطبيقات والتمارين التدريبية المقررة في الكتاب المدرسي.`,
            aiSummaryPoints: [
              `المفاهيم المحورية للمحاضرة في مادة ${subjName}.`,
              'أهم الملاحظات الوزارية المتكررة في الامتحانات.',
              'حل الواجب البيتي وإجراء الاختبار اليومي مباشرة.'
            ],
            dailyQuiz: [
              {
                id: `dq-${grade.id}-${idx + 1}-1`,
                question: `سؤال الاختبار اليومي التتابعي في مادة ${subjName}: ما هو المحور الأساسي الذي تم شرحه في المحاضرة؟`,
                options: [
                  'المفاهيم والقوانين الوزارية المحددة في المحاضرة',
                  'معلومات عامة خارج المنهج',
                  'نصوص غير مقررة وزارياً',
                  'مفردات محذوفة من المنهج'
                ],
                correctIndex: 0,
                explanation: `وفق توصيات المنهج العراقي، يركز الدرس على استيعاب القواعد والمسائل الوزارية لمادة ${subjName}.`
              }
            ]
          },
          {
            id: `les-${grade.id}-${idx + 1}-2`,
            title: `المحاضرة 2: تطبيقات متقدمة وأسئلة وزارية في ${subjName}`,
            durationMinutes: 35,
            youtubeVideoId: meta.ytId,
            youtubeUrl: `https://www.youtube.com/watch?v=${meta.ytId}`,
            teacherName: meta.teacher,
            notes: `شرح تفصيلي للمسائل والأمثلة الوزارية التابعة للمحاضرة الثانية.`,
            aiSummaryPoints: [
              'ربط القوانين النظرية بالتطبيقات العملية.',
              'حل أسئلة نهاية الفصل الوزارية.'
            ],
            dailyQuiz: [
              {
                id: `dq-${grade.id}-${idx + 1}-2`,
                question: `سؤال المتابعة: عند إتمام حل مسائل المحاضرة، ما الخطوة الأكاديمية التالية؟`,
                options: [
                  'مراجعة الملاحظات المدونة وخوض الامتحان الشهري',
                  'إهمال مراجعة القوانين',
                  'تخطي الاختبارات التتابعية',
                  'عدم مراجعة أسئلة الوزاري'
                ],
                correctIndex: 0,
                explanation: 'المراجعة المستمرة مع خوض الامتحانات التتابعية تضمن الدرجة الكاملة 100%.'
              }
            ]
          }
        ],
        monthlyExams: [
          {
            id: `exam-${grade.id}-${idx + 1}-m1`,
            title: `الامتحان الشهري الأول - ${subjName} (${grade.title})`,
            type: 'monthly',
            timeAllowedMinutes: 45,
            totalMarks: 100,
            questions: [
              {
                id: `q-${grade.id}-${idx + 1}-e1`,
                question: `سؤال الامتحان الشهري في ${subjName}: ما هو الهدف الأساسي من المراجعة الدورية؟`,
                options: [
                  'تثبيت المعلومات واستذكارها بدقة في الامتحان الوزاري',
                  'القراءة السريعة ليلة الامتحان فقط',
                  'الاعتماد على الحفظ دون الفهم',
                  'عدم حل المسائل الرياضية'
                ],
                correctIndex: 0,
                explanation: 'الفهم المتدرج يضمن الإتقان الكامل للمادة.'
              }
            ]
          }
        ]
      };

      result.push(generatedSubject);
    });
  });

  return result;
}

export const IRAQI_SUBJECTS: IraqiSubject[] = buildCompleteCurriculum();

