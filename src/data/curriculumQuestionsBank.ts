// بنك أسئلة المناهج العراقية الرسمية المعتمدة - مفصل لكل مرحلة دراسية على حدة
// يغطي (الأول متوسط، الثاني متوسط، الثالث متوسط، الرابع علمي وأدبي، الخامس علمي وأدبي، السادس علمي وأدبي)

import { IraqiGradeId } from '../types';

export interface CurriculumQuestion {
  id: string;
  gradeId: IraqiGradeId | 'all';
  gradeTitle: string;
  subject: string;
  chapter: string;
  chapterNumber: number;
  pageNumber: number;
  pageRange: string;
  questionNumber: string;
  category: 'تعريف' | 'مسألة رياضية' | 'سؤال وزاري' | 'تعليل' | 'مقارنة' | 'قاعدة نحوية' | 'حديث نبوي' | 'قرآن كريم';
  questionText: string;
  targetAnswer: string;
  hint: string;
}

export interface SubjectChapterMeta {
  chapterNumber: number;
  chapterTitle: string;
  defaultPage: number;
  pageRange: string;
}

// خريطة فصول المواد الدراسية لكل صف دراسي على حدة لمنع أي تداخل بين المراحل
export const GRADE_CHAPTERS_CATALOG: Record<string, Record<string, SubjectChapterMeta[]>> = {
  // =========================================================================
  // ١. الأول المتوسط (1-intermediate)
  // =========================================================================
  '1-intermediate': {
    'الرياضيات': [
      { chapterNumber: 1, chapterTitle: 'الفصل الأول: الأعداد الصحيحة والقوى وترتيب العمليات والقيمة المطلقة', defaultPage: 12, pageRange: 'ص 7 - 34' },
      { chapterNumber: 2, chapterTitle: 'الفصل الثاني: الأعداد النسبية والعمليات الحسابية عليها', defaultPage: 42, pageRange: 'ص 35 - 62' },
      { chapterNumber: 3, chapterTitle: 'الفصل الثالث: الحدود والمقادير الجبرية وجمعها وطرحها', defaultPage: 70, pageRange: 'ص 63 - 94' },
      { chapterNumber: 4, chapterTitle: 'الفصل الرابع: المعادلات والمتباينات من الدرجة الأولى', defaultPage: 102, pageRange: 'ص 95 - 120' },
      { chapterNumber: 5, chapterTitle: 'الفصل الخامس: الهندسة والمضلعات المنتظمة والمجسمات', defaultPage: 128, pageRange: 'ص 121 - 150' },
      { chapterNumber: 6, chapterTitle: 'الفصل السادس: القياس والمساحات السطحية والحجوم', defaultPage: 156, pageRange: 'ص 151 - 180' }
    ],
    'العلوم': [
      { chapterNumber: 1, chapterTitle: 'الوحدة الأولى: خواص المادة وحالاتها وقياس الحجوم والكثافة', defaultPage: 14, pageRange: 'ص 7 - 38' },
      { chapterNumber: 2, chapterTitle: 'الوحدة الثانية: الذرات والعناصر والمركبات والجدول الدوري', defaultPage: 46, pageRange: 'ص 39 - 76' },
      { chapterNumber: 3, chapterTitle: 'الوحدة الثالثة: القوة والحركة وقوانين نيوتن في الحركة', defaultPage: 84, pageRange: 'ص 77 - 114' },
      { chapterNumber: 4, chapterTitle: 'الوحدة الرابعة: الحرارة وطرائق انتقال الحرارة والتمدد الحراري', defaultPage: 122, pageRange: 'ص 115 - 150' }
    ],
    'الفيزياء': [
      { chapterNumber: 1, chapterTitle: 'الوحدة الأولى: المادة والكثافة وحجم الأجسام الصلبة والسائلة', defaultPage: 16, pageRange: 'ص 7 - 40' },
      { chapterNumber: 2, chapterTitle: 'الوحدة الثانية: القوة والحركة وقوانين نيوتن الثلاثة', defaultPage: 52, pageRange: 'ص 41 - 85' },
      { chapterNumber: 3, chapterTitle: 'الوحدة الثالثة: الشغل والقدرة والطاقة وتحولاتها', defaultPage: 94, pageRange: 'ص 86 - 125' }
    ],
    'الكيمياء': [
      { chapterNumber: 1, chapterTitle: 'الوحدة الأولى: مكونات الذرة والعدد الذري والكتلي ومستويات الطاقة', defaultPage: 18, pageRange: 'ص 7 - 45' },
      { chapterNumber: 2, chapterTitle: 'الوحدة الثانية: الجدول الدوري وترتيب الفلزات واللافلزات', defaultPage: 54, pageRange: 'ص 46 - 88' }
    ],
    'الأحياء': [
      { chapterNumber: 1, chapterTitle: 'الوحدة الأولى: الخلية وعضياتها والغشاء البلازمي والمجهر الضوئي', defaultPage: 15, pageRange: 'ص 7 - 42' },
      { chapterNumber: 2, chapterTitle: 'الوحدة الثانية: الانقسام الخلوي وتنوع الكائنات الحية والوراثة', defaultPage: 50, pageRange: 'ص 43 - 86' }
    ],
    'اللغة العربية': [
      { chapterNumber: 1, chapterTitle: 'الوحدة الأولى: أقسام الكلام (الاسم والفعل والحرف) وعلامات التمييز', defaultPage: 10, pageRange: 'ص 7 - 28' },
      { chapterNumber: 2, chapterTitle: 'الوحدة الثانية: المعرب والمبني من الأسماء والأفعال', defaultPage: 34, pageRange: 'ص 29 - 52' },
      { chapterNumber: 3, chapterTitle: 'الوحدة الثالثة: المعارف (العلم، المعرف بأل، والمعرف بالإضافة)', defaultPage: 58, pageRange: 'ص 53 - 78' },
      { chapterNumber: 4, chapterTitle: 'الوحدة الرابعة: الضمائر (المنفصلة والمتصلة والمستترة)', defaultPage: 84, pageRange: 'ص 79 - 110' }
    ],
    'الاجتماعيات (تاريخ، جغرافية، وطنية)': [
      { chapterNumber: 1, chapterTitle: 'الفصل الأول: عصور ما قبل التاريخ ونشأة الحضارات الإنسانية', defaultPage: 12, pageRange: 'ص 7 - 32' },
      { chapterNumber: 2, chapterTitle: 'الفصل الثاني: حضارة بلاد الرافدين (العراق القديم - سومر وأكد وبابل وآشور)', defaultPage: 38, pageRange: 'ص 33 - 68' },
      { chapterNumber: 3, chapterTitle: 'الفصل الثالث: حضارة وادي النيل وحضارات بلاد الشام واليمن', defaultPage: 74, pageRange: 'ص 69 - 110' }
    ],
    'التربية الإسلامية': [
      { chapterNumber: 1, chapterTitle: 'الوحدة الأولى: أحكام المد الأصلي وسورة الفجر', defaultPage: 8, pageRange: 'ص 5 - 28' },
      { chapterNumber: 2, chapterTitle: 'الوحدة الثانية: سورة البروج والحديث الشريف في الصدق والأمانة', defaultPage: 32, pageRange: 'ص 29 - 56' }
    ]
  },

  // =========================================================================
  // ٢. الثاني المتوسط (2-intermediate)
  // =========================================================================
  '2-intermediate': {
    'الرياضيات': [
      { chapterNumber: 1, chapterTitle: 'الفصل الأول: الأعداد الحقيقية وخصائص العمليات الحسابية', defaultPage: 14, pageRange: 'ص 7 - 36' },
      { chapterNumber: 2, chapterTitle: 'الفصل الثاني: تبسيط الجمل العددية التي تحوي جذوراً تربيعية', defaultPage: 44, pageRange: 'ص 37 - 66' },
      { chapterNumber: 3, chapterTitle: 'الفصل الثالث: المقادير الجبرية وضرب الحدود الجبرية والقسمة', defaultPage: 72, pageRange: 'ص 67 - 98' },
      { chapterNumber: 4, chapterTitle: 'الفصل الرابع: مبرهنة فيثاغورس والانعكاس والانسحاب في المستوى', defaultPage: 104, pageRange: 'ص 99 - 135' }
    ],
    'العلوم': [
      { chapterNumber: 1, chapterTitle: 'الوحدة الأولى: العناصر والمركبات والروابط الأيونية والتساهمية', defaultPage: 16, pageRange: 'ص 7 - 44' },
      { chapterNumber: 2, chapterTitle: 'الوحدة الثانية: الحركة والسرعة والانطلاق والتعجيل وقوانين نيوتن', defaultPage: 52, pageRange: 'ص 45 - 90' },
      { chapterNumber: 3, chapterTitle: 'الوحدة الثالثة: الضغط والطفو وقاعدة أرخميدس', defaultPage: 96, pageRange: 'ص 91 - 130' }
    ],
    'الفيزياء': [
      { chapterNumber: 1, chapterTitle: 'الوحدة الأولى: الحركة والمسافة والإزاحة والسرعة والتعجيل', defaultPage: 15, pageRange: 'ص 7 - 42' },
      { chapterNumber: 2, chapterTitle: 'الوحدة الثانية: قوانين نيوتن والجاذبية والوزن والكتلة', defaultPage: 48, pageRange: 'ص 43 - 84' }
    ],
    'الكيمياء': [
      { chapterNumber: 1, chapterTitle: 'الوحدة الأولى: الترابط الكيميائي والرابطة الأيونية والتساهمية والأيونات', defaultPage: 14, pageRange: 'ص 7 - 40' },
      { chapterNumber: 2, chapterTitle: 'الوحدة الثانية: الصيغ الكيميائية والتفاعلات الكيميائية والموازنة', defaultPage: 46, pageRange: 'ص 41 - 82' }
    ],
    'الأحياء': [
      { chapterNumber: 1, chapterTitle: 'الوحدة الأولى: تصنيف الكائنات الحية ومملكة البدائيات والطلائعيات', defaultPage: 12, pageRange: 'ص 7 - 38' },
      { chapterNumber: 2, chapterTitle: 'الوحدة الثانية: مملكة الفطريات ومملكة النباتات ومملكة الحيوانات', defaultPage: 44, pageRange: 'ص 39 - 85' }
    ],
    'اللغة العربية': [
      { chapterNumber: 1, chapterTitle: 'الوحدة الأولى: علامات الإعراب الأصلية والفرعية والأسماء الخمسة', defaultPage: 10, pageRange: 'ص 7 - 30' },
      { chapterNumber: 2, chapterTitle: 'الوحدة الثانية: جمع المذكر السالم وجمع المؤنث السالم وجمع التكسير', defaultPage: 36, pageRange: 'ص 31 - 60' },
      { chapterNumber: 3, chapterTitle: 'الوحدة الثالثة: المفعول به والمفعول المطلق والمفعول فيه', defaultPage: 66, pageRange: 'ص 61 - 92' }
    ],
    'الاجتماعيات (تاريخ، جغرافية، وطنية)': [
      { chapterNumber: 1, chapterTitle: 'الفصل الأول: الموقع الجغرافي للوطن العربي والتضاريس والمناخ', defaultPage: 12, pageRange: 'ص 7 - 36' },
      { chapterNumber: 2, chapterTitle: 'الفصل الثاني: الموارد المائية في العالم العربي والأنهار الدائمة', defaultPage: 42, pageRange: 'ص 37 - 70' }
    ]
  },

  // =========================================================================
  // ٣. الثالث المتوسط (3-intermediate - وزاري بكالوريا)
  // =========================================================================
  '3-intermediate': {
    'الرياضيات': [
      { chapterNumber: 1, chapterTitle: 'الفصل الأول: العلاقات والمتباينات المركبة ومتباينة القيمة المطلقة', defaultPage: 14, pageRange: 'ص 7 - 34' },
      { chapterNumber: 2, chapterTitle: 'الفصل الثاني: المقادير الجبرية وتحليل الفرق بين مربعين ومكعبين والتجربة', defaultPage: 40, pageRange: 'ص 35 - 64' },
      { chapterNumber: 3, chapterTitle: 'الفصل الثالث: حل المعادلات الآنية بالحذف والتعويض والقانون العام المميز', defaultPage: 70, pageRange: 'ص 65 - 98' },
      { chapterNumber: 4, chapterTitle: 'الفصل الرابع: الهندسة الإحداثية وميل المستقيم ومعادلة المستقيم', defaultPage: 104, pageRange: 'ص 99 - 136' },
      { chapterNumber: 5, chapterTitle: 'الفصل الخامس: الهندسة والقياس والمثلثات والمجسمات والهرم والمخروط', defaultPage: 142, pageRange: 'ص 137 - 170' },
      { chapterNumber: 6, chapterTitle: 'الفصل السادس: الإحصاء والاحتمالات والتوافيق والمبدأ الأساسي للعد', defaultPage: 176, pageRange: 'ص 171 - 200' }
    ],
    'الفيزياء': [
      { chapterNumber: 1, chapterTitle: 'الفصل الأول: الكهربائية الساكنة وقانون كولوم والمجال الكهربائي', defaultPage: 12, pageRange: 'ص 7 - 32' },
      { chapterNumber: 2, chapterTitle: 'الفصل الثاني: المغناطيسية وخواص المغناطيس وتخطيط المجال المغناطيسي', defaultPage: 38, pageRange: 'ص 33 - 50' },
      { chapterNumber: 3, chapterTitle: 'الفصل الثالث: التيار الكهربائي وقانون أوم وتوصيل المقاومات توالي وتوازي', defaultPage: 56, pageRange: 'ص 51 - 78' },
      { chapterNumber: 4, chapterTitle: 'الفصل الرابع: البطاريات والقوة الدافعة الكهربائية emf', defaultPage: 84, pageRange: 'ص 79 - 94' },
      { chapterNumber: 5, chapterTitle: 'الفصل الخامس: الطاقة والقدرة الكهربائية والأجهزة المنزلية وتكلفة الكهرباء', defaultPage: 100, pageRange: 'ص 95 - 110' },
      { chapterNumber: 6, chapterTitle: 'الفصل السادس: الكهربائية والمغناطيسية وتجربة أورستد والمحول الكهربائي', defaultPage: 116, pageRange: 'ص 111 - 134' },
      { chapterNumber: 7, chapterTitle: 'الفصل السابع: المحولة الكهربائية وقوانين كفاءة المحولة ونسبة التحويل', defaultPage: 138, pageRange: 'ص 135 - 150' },
      { chapterNumber: 8, chapterTitle: 'الفصل الثامن: تكنولوجيا مصادر الطاقة المتجددة (الشمسية والرياح والوقود الحيوي)', defaultPage: 154, pageRange: 'ص 151 - 168' }
    ],
    'الكيمياء': [
      { chapterNumber: 1, chapterTitle: 'الفصل الأول: التركيب الذري للمادة ومستويات الطاقة وترتيب لويس وقاعدة هوند', defaultPage: 14, pageRange: 'ص 7 - 38' },
      { chapterNumber: 2, chapterTitle: 'الفصل الثاني: عناصر الزمرتين الأولى والثانية (الصوديوم والكالسيوم وخواصها)', defaultPage: 44, pageRange: 'ص 39 - 58' },
      { chapterNumber: 3, chapterTitle: 'الفصل الثالث: عناصر الزمرة الثالثة (الألمنيوم واستخلاصه وسبائك الديورالومين)', defaultPage: 64, pageRange: 'ص 59 - 76' },
      { chapterNumber: 4, chapterTitle: 'الفصل الرابع: المحاليل والتعبير عن التركيز والنسبة المئوية الكتلية والحجمية', defaultPage: 82, pageRange: 'ص 77 - 94' },
      { chapterNumber: 5, chapterTitle: 'الفصل الخامس: عناصر الزمرة الرابعة (السيليكون وشبه الموصلات والهيدريدات)', defaultPage: 100, pageRange: 'ص 95 - 112' },
      { chapterNumber: 6, chapterTitle: 'الفصل السادس: مدخل في الكيمياء العضوية (غاز الميثان والإثيلين والأستيلين)', defaultPage: 118, pageRange: 'ص 113 - 134' },
      { chapterNumber: 7, chapterTitle: 'الفصل السابع: عناصر الزمرة الخامسة (النيتروجين وغاز الأمونيا)', defaultPage: 138, pageRange: 'ص 135 - 152' },
      { chapterNumber: 8, chapterTitle: 'الفصل الثامن: عناصر الزمرة السادسة (الكبريت واستخراجه وحامض الكبريتيك)', defaultPage: 156, pageRange: 'ص 153 - 170' }
    ],
    'الأحياء': [
      { chapterNumber: 1, chapterTitle: 'الفصل الأول: بناء جسم الإنسان والخلية والأنسجة الجسمية', defaultPage: 10, pageRange: 'ص 7 - 24' },
      { chapterNumber: 2, chapterTitle: 'الفصل الثاني: الجهاز الهيكلي (العظمي) وتركيب العظم والعمود الفقري', defaultPage: 30, pageRange: 'ص 25 - 42' },
      { chapterNumber: 3, chapterTitle: 'الفصل الثالث: الجهاز العضلي وأنواع العضلات والإعياء العضلي', defaultPage: 48, pageRange: 'ص 43 - 56' },
      { chapterNumber: 4, chapterTitle: 'الفصل الرابع: الجهاز الهضمي والأسنان والمعدة والكبد والبنكرياس', defaultPage: 62, pageRange: 'ص 57 - 78' },
      { chapterNumber: 5, chapterTitle: 'الفصل الخامس: جهاز الدوران (الدم والقلب والأوعية الدموية وفصائل الدم)', defaultPage: 84, pageRange: 'ص 79 - 104' },
      { chapterNumber: 6, chapterTitle: 'الفصل السادس: الجهاز التنفسي والرئتان والتبادل الغازي', defaultPage: 110, pageRange: 'ص 105 - 124' },
      { chapterNumber: 7, chapterTitle: 'الفصل السابع: الجهاز البولي والإخراج وأنواعه وأمراض الكلية', defaultPage: 130, pageRange: 'ص 125 - 142' }
    ],
    'اللغة العربية': [
      { chapterNumber: 1, chapterTitle: 'الوحدة الأولى: الميزان الصرفي والوزن للكلمات المجردة والمزيدة', defaultPage: 12, pageRange: 'ص 7 - 28' },
      { chapterNumber: 2, chapterTitle: 'الوحدة الثانية: أبواب الأفعال الثلاثية ومصادرها القياسية والسماعية', defaultPage: 34, pageRange: 'ص 29 - 52' },
      { chapterNumber: 3, chapterTitle: 'الوحدة الثالثة: المشتقات: اسم الفاعل وصيغ المبالغة وشروط عملها', defaultPage: 58, pageRange: 'ص 53 - 82' },
      { chapterNumber: 4, chapterTitle: 'الوحدة الرابعة: المشتقات: الصفة المشبهة واسم المفعول وإعراب المعمول', defaultPage: 88, pageRange: 'ص 83 - 110' },
      { chapterNumber: 5, chapterTitle: 'الوحدة الخامسة: المشتقات: اسم التفضيل وحالاته واسم الآلة', defaultPage: 116, pageRange: 'ص 111 - 138' }
    ],
    'الاجتماعيات (تاريخ، جغرافية، وطنية)': [
      { chapterNumber: 1, chapterTitle: 'الفصل الأول: جغرافية العراق الطبيعية (السطح والتضاريس والمناخ والمياه)', defaultPage: 14, pageRange: 'ص 7 - 44' },
      { chapterNumber: 2, chapterTitle: 'الفصل الثاني: جغرافية العراق البشرية (السكان والزراعة والثروة الحيوانية والنفط)', defaultPage: 50, pageRange: 'ص 45 - 88' },
      { chapterNumber: 3, chapterTitle: 'الفصل الثالث: تاريخ العراق المعاصر وثورة العشرين والعهد الملكي', defaultPage: 94, pageRange: 'ص 89 - 130' }
    ],
    'التربية الإسلامية': [
      { chapterNumber: 1, chapterTitle: 'الوحدة الأولى: أحكام المد (المد المتصل والمنفصل والبدل) وسورة الحشر', defaultPage: 8, pageRange: 'ص 5 - 32' },
      { chapterNumber: 2, chapterTitle: 'الوحدة الثانية: سورة النجم والحديث في البر والإثم', defaultPage: 36, pageRange: 'ص 33 - 62' }
    ]
  },

  // =========================================================================
  // ٤. السادس العلمي (6-prep-scientific - وزاري بكالوريا)
  // =========================================================================
  '6-prep-scientific': {
    'الفيزياء': [
      { chapterNumber: 1, chapterTitle: 'الفصل الأول: المتسعات والعوازل وتطبيقاتها', defaultPage: 12, pageRange: 'ص 7 - 48' },
      { chapterNumber: 2, chapterTitle: 'الفصل الثاني: الحث الكهرومغناطيسي وقانون فرداي ولنز', defaultPage: 54, pageRange: 'ص 49 - 94' },
      { chapterNumber: 3, chapterTitle: 'الفصل الثالث: التيار المتناوب والرنين والتوالي والتوازي', defaultPage: 102, pageRange: 'ص 95 - 140' },
      { chapterNumber: 4, chapterTitle: 'الفصل الرابع: البصريات الفيزيائية وتداخل الضوء والحيود والاستقطاب', defaultPage: 148, pageRange: 'ص 141 - 176' },
      { chapterNumber: 5, chapterTitle: 'الفصل الخامس: الفيزياء الحديثة وإشعاع الجسم الأسود والظاهرة الكهروضوئية', defaultPage: 184, pageRange: 'ص 177 - 210' },
      { chapterNumber: 6, chapterTitle: 'الفصل السادس: إلكترونيات الحالة الصلبة والشبه موصلات النقية والمشوبة', defaultPage: 218, pageRange: 'ص 211 - 238' },
      { chapterNumber: 7, chapterTitle: 'الفصل السابع: الأطياف الذرية والليزر وأشعة الليزر وتطبيقاتها', defaultPage: 245, pageRange: 'ص 239 - 264' }
    ],
    'الكيمياء': [
      { chapterNumber: 1, chapterTitle: 'الفصل الأول: علم الثرموداينمك وقانون هيس وطاقة كبس الحرة', defaultPage: 16, pageRange: 'ص 7 - 56' },
      { chapterNumber: 2, chapterTitle: 'الفصل الثاني: الاتزان الكيميائي وحسابات Kc و Kp وقاعدة لوشاتليه', defaultPage: 64, pageRange: 'ص 57 - 100' },
      { chapterNumber: 3, chapterTitle: 'الفصل الثالث: الاتزان الأيوني ومحاليل بفر وحاصل الإذابة Ksp', defaultPage: 112, pageRange: 'ص 101 - 150' },
      { chapterNumber: 4, chapterTitle: 'الفصل الرابع: الكيمياء الكهربائية ومعادلة نيرنست وقوانين فرداي', defaultPage: 160, pageRange: 'ص 151 - 198' },
      { chapterNumber: 5, chapterTitle: 'الفصل الخامس: الكيمياء التناسقية ونظرية أصرة التكافؤ VBT والليكاندات', defaultPage: 206, pageRange: 'ص 199 - 232' },
      { chapterNumber: 6, chapterTitle: 'الفصل السادس: طرائق التحليل الكيميائي والتسحيح والتحليل الوزني والحجمي', defaultPage: 240, pageRange: 'ص 233 - 270' },
      { chapterNumber: 7, chapterTitle: 'الفصل السابع: الكيمياء العضوية وهاليدات الألكيل والكحولات والإيثرات', defaultPage: 280, pageRange: 'ص 271 - 320' }
    ],
    'الرياضيات': [
      { chapterNumber: 1, chapterTitle: 'الفصل الأول: الأعداد المركبة ومبرهنة دي موافر والنتيجة', defaultPage: 18, pageRange: 'ص 7 - 52' },
      { chapterNumber: 2, chapterTitle: 'الفصل الثاني: القطوع المخروطية (المكافئ، الناقص، الزائد المشترك)', defaultPage: 62, pageRange: 'ص 53 - 98' },
      { chapterNumber: 3, chapterTitle: 'الفصل الثالث: تطبيقات التفاضل ومبرهنة رول والقيمة المتوسطة والتقريب', defaultPage: 115, pageRange: 'ص 99 - 162' },
      { chapterNumber: 4, chapterTitle: 'الفصل الرابع: التكامل وتطبيقاته والمساحات بين المنحنيات والحجوم الدورانية', defaultPage: 175, pageRange: 'ص 163 - 224' },
      { chapterNumber: 5, chapterTitle: 'الفصل الخامس: المعادلات التفاضلية الاعتيادية وفصل المتغيرات والمتجانسة', defaultPage: 232, pageRange: 'ص 225 - 258' },
      { chapterNumber: 6, chapterTitle: 'الفصل السادس: الهندسة الفضائية ومبرهنات الزاوية الزوجية والمجسمات', defaultPage: 268, pageRange: 'ص 259 - 290' }
    ],
    'الأحياء': [
      { chapterNumber: 1, chapterTitle: 'الفصل الأول: تركيب الخلية وعضياتها وانقسام الخلية الخيطي والاختزالي', defaultPage: 14, pageRange: 'ص 7 - 58' },
      { chapterNumber: 2, chapterTitle: 'الفصل الثاني: الأنسجة النباتية والأنسجة الحيوانية والأنسجة الرابطة', defaultPage: 68, pageRange: 'ص 59 - 96' },
      { chapterNumber: 3, chapterTitle: 'الفصل الثالث: التكاثر في الكائنات الحية والتكاثر في النباتات والإنسان', defaultPage: 110, pageRange: 'ص 97 - 176' },
      { chapterNumber: 4, chapterTitle: 'الفصل الرابع: التكوين الجنيني وأغشية الجنين والتشوهات الخلقية', defaultPage: 182, pageRange: 'ص 177 - 200' },
      { chapterNumber: 5, chapterTitle: 'الفصل الخامس: علم الوراثة المندلية وقانون الانعزال والسيادة غير التامة', defaultPage: 212, pageRange: 'ص 201 - 250' }
    ],
    'اللغة العربية': [
      { chapterNumber: 1, chapterTitle: 'الوحدة الأولى: أسلوب الاستفهام وإعراب أسماء الاستفهام دلالة وإعراباً', defaultPage: 12, pageRange: 'ص 9 - 46' },
      { chapterNumber: 2, chapterTitle: 'الوحدة الثانية: أسلوب النفي (ليس، ما، لا، إنْ، لم، لن، لما، غير)', defaultPage: 52, pageRange: 'ص 47 - 94' },
      { chapterNumber: 3, chapterTitle: 'الوحدة الثالثة: أسلوب التوكيد (اللفظي والمعنوي وبالحروف وبالقصر)', defaultPage: 102, pageRange: 'ص 95 - 138' },
      { chapterNumber: 4, chapterTitle: 'الوحدة الرابعة: أسلوب التقديم والتأخير (تقديم الخبر والمفعول به وجوباً وجوازاً)', defaultPage: 144, pageRange: 'ص 139 - 168' },
      { chapterNumber: 5, chapterTitle: 'الوحدة الخامسة: أسلوب المدح والذم وأسلوب التعجب القياسي والسماعي', defaultPage: 172, pageRange: 'ص 169 - 208' }
    ],
    'التربية الإسلامية': [
      { chapterNumber: 1, chapterTitle: 'الوحدة الأولى: أحكام النون الساكنة والتنوين وسورة البقرة', defaultPage: 10, pageRange: 'ص 5 - 34' },
      { chapterNumber: 2, chapterTitle: 'الوحدة الثانية: سورة آل عمران والحديث الشريف في محاسبة النفس', defaultPage: 40, pageRange: 'ص 35 - 68' }
    ]
  },

  // =========================================================================
  // ٥. السادس الأدبي (6-prep-literary - وزاري بكالوريا)
  // =========================================================================
  '6-prep-literary': {
    'التاريخ': [
      { chapterNumber: 1, chapterTitle: 'الفصل الأول: العراق في العهد العثماني وحكم المماليك ومدحت باشا', defaultPage: 14, pageRange: 'ص 7 - 42' },
      { chapterNumber: 2, chapterTitle: 'الفصل الثاني: التوسع الاستعماري في الوطن العربي واتفاقية سايكس بيكو', defaultPage: 48, pageRange: 'ص 43 - 86' },
      { chapterNumber: 3, chapterTitle: 'الفصل الثالث: ثورة العشرين الخالدة في العراق وتأسيس الدولة العراقية والعهد الملكي', defaultPage: 92, pageRange: 'ص 87 - 134' },
      { chapterNumber: 4, chapterTitle: 'الفصل الرابع: الحركات الوطنية والقومية وانتفاضات العراق وحرب فلسطين 1948', defaultPage: 140, pageRange: 'ص 135 - 180' }
    ],
    'الجغرافية': [
      { chapterNumber: 1, chapterTitle: 'الفصل الأول: جغرافية السكان وتوزيع السكان والنمو السكاني في العراق', defaultPage: 12, pageRange: 'ص 7 - 46' },
      { chapterNumber: 2, chapterTitle: 'الفصل الثاني: جغرافية المدن وجغرافية الريف ونظرية الدوائر المتراكزة', defaultPage: 52, pageRange: 'ص 47 - 92' },
      { chapterNumber: 3, chapterTitle: 'الفصل الثالث: جغرافية الزراعة واستعمالات الأرض الزراعية في العراق', defaultPage: 98, pageRange: 'ص 93 - 144' },
      { chapterNumber: 4, chapterTitle: 'الفصل الرابع: جغرافية الصناعة والتعدين والنفط والصناعات البتروكيمياوية', defaultPage: 150, pageRange: 'ص 145 - 196' }
    ],
    'الاقتصاد': [
      { chapterNumber: 1, chapterTitle: 'المبحث الأول: علم الاقتصاد والمفاهيم الاقتصادية الأساسية والمشكلة الاقتصادية', defaultPage: 10, pageRange: 'ص 5 - 38' },
      { chapterNumber: 2, chapterTitle: 'المبحث الثاني: الطلب والعرض وتوازن السوق والمرونة السعرية', defaultPage: 44, pageRange: 'ص 39 - 78' },
      { chapterNumber: 3, chapterTitle: 'المبحث الثالث: الدخل القومي والناتج المحلي الإجمالي والتضخم والبطالة', defaultPage: 84, pageRange: 'ص 79 - 124' },
      { chapterNumber: 4, chapterTitle: 'المبحث الرابع: المالية العامة والنفقات والإيرادات والموازنة العامة للدولة', defaultPage: 130, pageRange: 'ص 125 - 168' }
    ],
    'الرياضيات (خاصة بالأدبي)': [
      { chapterNumber: 1, chapterTitle: 'الفصل الأول: مبرهنة ذات الحدين ومبدأ العد والتباديل والتوافيق', defaultPage: 12, pageRange: 'ص 7 - 42' },
      { chapterNumber: 2, chapterTitle: 'الفصل الثاني: الغايات والاستمرارية للدوال الحقيقية', defaultPage: 48, pageRange: 'ص 43 - 78' },
      { chapterNumber: 3, chapterTitle: 'الفصل الثالث: قواعد المشتقة وتطبيقات التفاضل في الاقتصاد (دالة الإيراد الكلي)', defaultPage: 84, pageRange: 'ص 79 - 120' },
      { chapterNumber: 4, chapterTitle: 'الفصل الرابع: التكامل غير المحدد والمحدد وتطبيقاته الاقتصادية', defaultPage: 126, pageRange: 'ص 121 - 158' }
    ],
    'اللغة العربية': [
      { chapterNumber: 1, chapterTitle: 'الوحدة الأولى: أسلوب الاستفهام وإعراب أسماء الاستفهام', defaultPage: 12, pageRange: 'ص 9 - 46' },
      { chapterNumber: 2, chapterTitle: 'الوحدة الثانية: أسلوب النفي الشامل', defaultPage: 52, pageRange: 'ص 47 - 94' },
      { chapterNumber: 3, chapterTitle: 'الوحدة الثالثة: الأدب والنصوص والنقد الأدبي للمرحلة الإعدادية', defaultPage: 98, pageRange: 'ص 95 - 145' }
    ]
  }
};

// دالة مساعدة للحصول على فصول المادة حسب الصف الدراسي بدقة مطلقة
export function getSubjectChaptersForGrade(gradeId: string, subject: string): SubjectChapterMeta[] {
  // فحص مباشر للمرحلة المحددة
  const gradeCatalog = GRADE_CHAPTERS_CATALOG[gradeId];
  if (gradeCatalog && gradeCatalog[subject]) {
    return gradeCatalog[subject];
  }

  // إذا لم نجد تطابقاً حرفياً، ابحث عن أقرب تطابق للاسم داخل المرحلة
  if (gradeCatalog) {
    for (const [subjKey, chapters] of Object.entries(gradeCatalog)) {
      if (subjKey.includes(subject) || subject.includes(subjKey)) {
        return chapters;
      }
    }
  }

  // افتراضيات عامة مقسمة حسب المرحلة
  if (gradeId.includes('1-intermediate') || gradeId.includes('2-intermediate')) {
    return [
      { chapterNumber: 1, chapterTitle: 'الوحدة الأولى: المفاهيم الأساسية للمنهج المطور', defaultPage: 12, pageRange: 'ص 7 - 40' },
      { chapterNumber: 2, chapterTitle: 'الوحدة الثانية: التطبيقات والتمارين', defaultPage: 48, pageRange: 'ص 41 - 80' },
      { chapterNumber: 3, chapterTitle: 'الوحدة الثالثة: المراجعة وحل أسئلة الفصل', defaultPage: 88, pageRange: 'ص 81 - 120' }
    ];
  }

  return [
    { chapterNumber: 1, chapterTitle: 'الفصل الأول: المفاهيم المعتمدة وزارياً', defaultPage: 14, pageRange: 'ص 7 - 45' },
    { chapterNumber: 2, chapterTitle: 'الفصل الثاني: القوانين والمسائل', defaultPage: 52, pageRange: 'ص 46 - 90' },
    { chapterNumber: 3, chapterTitle: 'الفصل الثالث: الأسئلة الوزارية والشهرية', defaultPage: 96, pageRange: 'ص 91 - 140' }
  ];
}

// بنك الأسئلة الدقيق الحقيقي لكل مرحلة دراسية على حدة
export const CURRICULUM_QUESTIONS_DB: CurriculumQuestion[] = [
  // =========================================================================
  // أسئلة الأول المتوسط (1-intermediate)
  // =========================================================================
  {
    id: 'q-1i-m-1',
    gradeId: '1-intermediate',
    gradeTitle: 'الأول المتوسط',
    subject: 'الرياضيات',
    chapter: 'الفصل الأول: الأعداد الصحيحة والقوى وترتيب العمليات والقيمة المطلقة',
    chapterNumber: 1,
    pageNumber: 12,
    pageRange: 'ص 7 - 25',
    questionNumber: 'س1',
    category: 'تعريف',
    questionText: 'ما هو مفهوم القيمة المطلقة للعدد الصحيح؟ وما ناتج المقدار: |-18| + |7| - |-5|؟',
    targetAnswer: 'القيمة المطلقة: هي المسافة بين العدد والصفر على خط الأعداد وتكون موجبة دائماً أو صفراً ويرمز لها |x|.\nالحل: |-18| = 18، و |7| = 7، و |-5| = 5.\nالمقدار = 18 + 7 - 5 = 25 - 5 = 20.',
    hint: 'القيمة المطلقة للعدد السالب تصبح موجبة دائماً.'
  },
  {
    id: 'q-1i-m-2',
    gradeId: '1-intermediate',
    gradeTitle: 'الأول المتوسط',
    subject: 'الرياضيات',
    chapter: 'الفصل الأول: الأعداد الصحيحة والقوى وترتيب العمليات والقيمة المطلقة',
    chapterNumber: 1,
    pageNumber: 18,
    pageRange: 'ص 15 - 34',
    questionNumber: 'س2',
    category: 'مسألة رياضية',
    questionText: 'باستخدام ترتيب العمليات على الأعداد الصحيحة، احسب ناتج المقدار: (24 - 6) ÷ 3 + 2 × (-4)؟',
    targetAnswer: 'الحل:\n1. نبدأ بالأقواس أولاً: (24 - 6) = 18.\n2. نجري عمليات القسمة والضرب: 18 ÷ 3 = 6، و 2 × (-4) = -8.\n3. نجمع ونطرح: 6 + (-8) = 6 - 8 = -2.',
    hint: 'الأقواس أولاً، ثم الضرب والقسمة من اليسار لليمين، ثم الجمع والطرح.'
  },
  {
    id: 'q-1i-ar-1',
    gradeId: '1-intermediate',
    gradeTitle: 'الأول المتوسط',
    subject: 'اللغة العربية',
    chapter: 'الوحدة الأولى: أقسام الكلام (الاسم والفعل والحرف) وعلامات التمييز',
    chapterNumber: 1,
    pageNumber: 10,
    pageRange: 'ص 7 - 25',
    questionNumber: 'س1',
    category: 'قاعدة نحوية',
    questionText: 'ما هي أقسام الكلام في اللغة العربية؟ واذكر علامتين خاصتين بالاسم وعلامة خاصة بالفعل الماضي مع التمثيل؟',
    targetAnswer: 'أقسام الكلام ثلاثة:\n1. الاسم: كلمة تدل على معنى غير مقترن بزمان (علاماته: قبول التنوين مثل: كتابٌ، ودخول الـ التعريف مثل: الكتاب، وحرف الجر مثل: في الصفِ).\n2. الفعل: ما دل على حدث مقترن بزمن (علامة الفعل الماضي قبول تاء التأنيث الساكنة مثل: كتبتْ، أو تاء الفاعل مثل: كتبتُ).\n3. الحرف: كلمة لا يظهر معناها إلا مع غيرها (مثل: في، إلى، على، لم، لن).',
    hint: 'الاسم يقبل التنوين و (أل)، والفعل الماضي يقبل تاء التأنيث الساكنة.'
  },
  {
    id: 'q-1i-sc-1',
    gradeId: '1-intermediate',
    gradeTitle: 'الأول المتوسط',
    subject: 'العلوم',
    chapter: 'الوحدة الأولى: خواص المادة وحالاتها وقياس الحجوم والكثافة',
    chapterNumber: 1,
    pageNumber: 14,
    pageRange: 'ص 7 - 35',
    questionNumber: 'س1',
    category: 'تعريف',
    questionText: 'ما المقصود بـ "كثافة المادة"؟ وما هو قانون قياس الكثافة وما هي وحدات قياسها؟',
    targetAnswer: 'الكثافة: هي كتلة وحدة الحجوم من المادة، وتساوي حاصل قسمة كتلة الجسم على حجمه.\nالقانون: الكثافة (ρ) = الكتلة (m) ÷ الحجم (V).\nوحدة القياس: kg/m^3 أو g/cm^3.',
    hint: 'الكثافة = الكتلة ÷ الحجم (ρ = m / V).'
  },
  {
    id: 'q-1i-soc-1',
    gradeId: '1-intermediate',
    gradeTitle: 'الأول المتوسط',
    subject: 'الاجتماعيات (تاريخ، جغرافية، وطنية)',
    chapter: 'الفصل الثاني: حضارة بلاد الرافدين (العراق القديم - سومر وأكد وبابل وآشور)',
    chapterNumber: 2,
    pageNumber: 38,
    pageRange: 'ص 33 - 60',
    questionNumber: 'س1',
    category: 'سؤال وزاري',
    questionText: 'من هم السومريون؟ وما هي أبرز إنجازاتهم الحضارية والتاريخية في العراق القديم؟',
    targetAnswer: 'السومريون: هم من أقدم الشعوب العريقة التي سكنت بلاد ما بين النهرين وشيدوا أولى الحضارات الإنسانية في جنوب العراق (سومر).\nأبرز إنجازاتهم:\n1. اختراع الكتابة المسمارية لتدوين السجلات والمعاملات وتاريخهم.\n2. بناء وتشييد الزقورات والمعابد الدينية.\n3. وضع أول القوانين والأنظمة المدنية وتنظيم شؤون الري والزراعة.',
    hint: 'اختراع الكتابة المسمارية وبناء الزقورات في جنوب العراق.'
  },

  // =========================================================================
  // أسئلة الثاني المتوسط (2-intermediate)
  // =========================================================================
  {
    id: 'q-2i-m-1',
    gradeId: '2-intermediate',
    gradeTitle: 'الثاني المتوسط',
    subject: 'الرياضيات',
    chapter: 'الفصل الأول: الأعداد الحقيقية وخصائص العمليات الحسابية',
    chapterNumber: 1,
    pageNumber: 14,
    pageRange: 'ص 7 - 30',
    questionNumber: 'س1',
    category: 'مسألة رياضية',
    questionText: 'بسط الجملة العددية التالية باستعمال خصائص العمليات على الأعداد الحقيقية: √12 (√3 - √8) - 6؟',
    targetAnswer: 'الحل:\n1. نبسط الجذور: √12 = √(4×3) = 2√3، و √8 = √(4×2) = 2√2.\n2. نعوض ونوزع: 2√3 (√3 - 2√2) - 6\n= 2√3 × √3 - 2√3 × 2√2 - 6\n= 2(3) - 4√6 - 6\n= 6 - 4√6 - 6 = -4√6.',
    hint: 'بسط √12 إلى 2√3 و √8 إلى 2√2 ثم وزع الضرب على القوس.'
  },
  {
    id: 'q-2i-sc-1',
    gradeId: '2-intermediate',
    gradeTitle: 'الثاني المتوسط',
    subject: 'العلوم',
    chapter: 'الوحدة الأولى: العناصر والمركبات والروابط الأيونية والتساهمية',
    chapterNumber: 1,
    pageNumber: 16,
    pageRange: 'ص 7 - 35',
    questionNumber: 'س1',
    category: 'مقارنة',
    questionText: 'قارن بين الرابطة الأيونية والرابطة التساهمية من حيث: كيفية تكوّنها، والأمثلة عليها؟',
    targetAnswer: 'المقارنة:\n1. الرابطة الأيونية: تنشأ نتيجة قوة جذب كهروستاتيكي بين أيونين مختلفين في الشحنة (أيون موجب لذرة فلز فقدت إلكترونات وأيون سالب لذرة لافلز اكتسبت إلكترونات)، مثال: كلوريد الصوديوم (NaCl).\n2. الرابطة التساهمية: تنشأ نتيجة مشاركة (مساهمة) كل ذرة بإلكترون أو أكثر لتكوين زوج إلكتروني مشترك للوصول لحالة الاستقرار، مثال: جزيء الماء (H2O) وغاز الميثان (CH4).',
    hint: 'الأيونية فقد واكتساب وتجاذب، التساهمية مشاركة ومساهمة بالإلكترونات.'
  },

  // =========================================================================
  // أسئلة الثالث المتوسط (3-intermediate - وزاري)
  // =========================================================================
  {
    id: 'q-3i-ph-1',
    gradeId: '3-intermediate',
    gradeTitle: 'الثالث المتوسط (وزاري)',
    subject: 'الفيزياء',
    chapter: 'الفصل الأول: الكهربائية الساكنة وقانون كولوم والمجال الكهربائي',
    chapterNumber: 1,
    pageNumber: 12,
    pageRange: 'ص 7 - 32',
    questionNumber: 'س1',
    category: 'تعريف',
    questionText: 'ما نص قانون كولوم في الكهربائية الساكنة؟ واكتب صيغته الرياضية مع بيان معنى كل رمز ووحدته؟',
    targetAnswer: 'نص قانون كولوم: القوة الكهربائية المتبادلة بين شحنتين كهربائيتين نقطيتين ساكنتين تتناسب طردياً مع حاصل ضرب مقدار الشحنتين، وعكسياً مع مربع البعد بينهما.\nالصيغة الرياضية: F = k (q1 × q2) / r^2\nحيث:\n- F: القوة الكهربائية بوحدة النيوتن (N).\n- q1, q2: مقدار الشحنتين بوحدة الكولوم (C).\n- r: البعد بين الشحنتين بوحدة المتر (m).\n- k: ثابت كولوم ويساوي في الفراغ 9 × 10^9 N.m^2/C^2.',
    hint: 'طردياً مع ضرب الشحنتين وعكسياً مع مربع البعد r^2.'
  },
  {
    id: 'q-3i-ph-2',
    gradeId: '3-intermediate',
    gradeTitle: 'الثالث المتوسط (وزاري)',
    subject: 'الفيزياء',
    chapter: 'الفصل الثالث: التيار الكهربائي وقانون أوم وتوصيل المقاومات توالي وتوازي',
    chapterNumber: 3,
    pageNumber: 56,
    pageRange: 'ص 51 - 78',
    questionNumber: 'س2',
    category: 'مسألة رياضية',
    questionText: 'مسألة وزارية مكررة: مقاومتان R1 = 3 Ω و R2 = 6 Ω رُبطتا على التوازي مع مصدر فرق جهده V = 12 V. احسب: 1) المقاومة المكافئة Req. 2) التيار المنساب في كل مقاومة. 3) التيار الكلي للدائرة؟',
    targetAnswer: 'الحل:\n1. ربط توازي: 1/Req = 1/R1 + 1/R2 = 1/3 + 1/6 = (2+1)/6 = 3/6 = 1/2 ==> Req = 2 Ω.\n2. فرق الجهد متساوٍ في التوازي: V1 = V2 = Vtotal = 12 V.\nI1 = V / R1 = 12 / 3 = 4 A.\nI2 = V / R2 = 12 / 6 = 2 A.\n3. التيار الكلي: Itotal = I1 + I2 = 4 + 2 = 6 A (أو Itotal = V / Req = 12 / 2 = 6 A).',
    hint: 'في التوازي فرق الجهد ثابت ومقلوب المقاومات 1/Req = 1/R1 + 1/R2.'
  },
  {
    id: 'q-3i-ch-1',
    gradeId: '3-intermediate',
    gradeTitle: 'الثالث المتوسط (وزاري)',
    subject: 'الكيمياء',
    chapter: 'الفصل الأول: التركيب الذري للمادة ومستويات الطاقة وترتيب لويس وقاعدة هوند',
    chapterNumber: 1,
    pageNumber: 14,
    pageRange: 'ص 7 - 38',
    questionNumber: 'س1',
    category: 'سؤال وزاري',
    questionText: 'ما نص قاعدة هوند ومبدأ أوفباو؟ واكتب الترتيب الإلكتروني لذرة الصوديوم Na (العدد الذري 11) مع رمز لويس ومستويات الطاقة الرئيسية؟',
    targetAnswer: '1. مبدأ أوفباو: تنص على أن مستويات الطاقة الثانوية تملأ بالإلكترونات حسب تدرج طاقتها من الأوطأ إلى الأعلى.\n2. قاعدة هوند: لا يحدث ازدواج بين إلكترونين في مستوى الطاقة الثانوي إلا بعد أن تشغل أوربيتالاته فرادى أولاً.\n3. ذرة الصوديوم 11Na: الترتيب الإلكتروني هو:\n1s^2  2s^2  2p^6  3s^1\nرمز لويس: يحتوي الغلاف الخارجي على إلكترون واحد (3s^1)، إذن رمز لويس: ( •Na ).',
    hint: 'أوفباو من الأوطأ للأعلى، وهوند إشغال فرادى قبل الازدواج.'
  },
  {
    id: 'q-3i-m-1',
    gradeId: '3-intermediate',
    gradeTitle: 'الثالث المتوسط (وزاري)',
    subject: 'الرياضيات',
    chapter: 'الفصل الثاني: المقادير الجبرية وتحليل الفرق بين مربعين ومكعبين والتجربة',
    chapterNumber: 2,
    pageNumber: 40,
    pageRange: 'ص 35 - 60',
    questionNumber: 'س1',
    category: 'مسألة رياضية',
    questionText: 'حلل كلاً من المقادير الجبرية التالية تحليلاً كاملاً:\n1) x^2 - 9\n2) x^3 + 27\n3) x^2 - 5x + 6؟',
    targetAnswer: 'الحل:\n1) فرق بين مربعين: x^2 - 9 = (x - 3)(x + 3).\n2) مجموع مكعبين: x^3 + 27 = (x + 3)(x^2 - 3x + 9).\n3) تحليل بالتجربة: x^2 - 5x + 6 = (x - 2)(x - 3).',
    hint: 'فرق المربعين قوسين متطابقين مختلفي الإشارة، ومجموع المكعبين قوس صغير وقوس كبير.'
  },

  // =========================================================================
  // أسئلة السادس العلمي (6-prep-scientific - وزاري)
  // =========================================================================
  {
    id: 'q-6sci-ph-1',
    gradeId: '6-prep-scientific',
    gradeTitle: 'السادس العلمي (وزاري)',
    subject: 'الفيزياء',
    chapter: 'الفصل الأول: المتسعات والعوازل وتطبيقاتها',
    chapterNumber: 1,
    pageNumber: 12,
    pageRange: 'ص 7 - 48',
    questionNumber: 'س1',
    category: 'تعريف',
    questionText: 'ما هو تعريف المتسعة ذات الصفيحتين المتوازيتين؟ وما الفائدة العملية منها في الدوائر الكهربائية؟',
    targetAnswer: 'المتسعة: جهاز يتألف من زوج أو أكثر من الصفائح الموصلة يفصل بينها عازل (فراغ أو هواء أو مادة عازلة كهربائياً)، تُستعمل لخزن الشحنات الكهربائية والطاقة الكهربائية في المجال الكهربائي المتولد بين صفيحتيها.',
    hint: 'تخزين الشحنات وتخزين الطاقة في المجال الكهربائي.'
  },
  {
    id: 'q-6sci-ph-2',
    gradeId: '6-prep-scientific',
    gradeTitle: 'السادس العلمي (وزاري)',
    subject: 'الفيزياء',
    chapter: 'الفصل الثاني: الحث الكهرومغناطيسي وقانون فرداي ولنز',
    chapterNumber: 2,
    pageNumber: 54,
    pageRange: 'ص 49 - 94',
    questionNumber: 'س1',
    category: 'تعريف',
    questionText: 'ما نص قانون لنز في الحث الكهرومغناطيسي؟ وما الفائدة العملية منه؟',
    targetAnswer: 'نص قانون لنز: التيار المحتث في دائرة كهربائية مقفلة يمتلك اتجاهاً بحيث أن مجاله المغناطيسي المحتث يعاكس بتأثيره التغير في الفيض المغناطيسي الأصلي الذي كان سبباً في توليد هذا التيار.\nفائدته: 1. تحديد اتجاه التيار المحتث. 2. تطبيق لقانون حفظ الطاقة.',
    hint: 'المعاكسة للتغير في الفيض الأصلي وحفظ الطاقة.'
  },
  {
    id: 'q-6sci-ch-1',
    gradeId: '6-prep-scientific',
    gradeTitle: 'السادس العلمي (وزاري)',
    subject: 'الكيمياء',
    chapter: 'الفصل الأول: علم الثرموداينمك وقانون هيس وطاقة كبس الحرة',
    chapterNumber: 1,
    pageNumber: 16,
    pageRange: 'ص 7 - 56',
    questionNumber: 'س1',
    category: 'تعريف',
    questionText: 'عرف دالة الحالة وقانون هيس في الكيمياء الحرارية مع بيان أهميتهما؟',
    targetAnswer: '1. دالة الحالة: تلك الخاصية التي تعتمد على الحالة الابتدائية والنهائية للنظام بغض النظر عن المسار مثل الأنثالبي والإنتروبي.\n2. قانون هيس: التغير في انثالبي التفاعل هو نفسه سواء تم التفاعل في خطوة واحدة أو في سلسلة من الخطوات، وأهميته حساب انثالبي التفاعلات البطيئة أو التي تكون نواتج جانبية غير مرغوب فيها.',
    hint: 'الاعتماد على البداية والنهاية دون المسار، وحساب انثالبي التفاعلات الصعبة.'
  },
  {
    id: 'q-6sci-ma-1',
    gradeId: '6-prep-scientific',
    gradeTitle: 'السادس العلمي (وزاري)',
    subject: 'الرياضيات',
    chapter: 'الفصل الأول: الأعداد المركبة ومبرهنة دي موافر والنتيجة',
    chapterNumber: 1,
    pageNumber: 18,
    pageRange: 'ص 7 - 52',
    questionNumber: 'س1',
    category: 'مسألة رياضية',
    questionText: 'باستخدام نتيجة مبرهنة دي موافر، جد الجذور التكعيبية للعدد المركب: z = 8 i؟',
    targetAnswer: 'الحل:\n1. الصيغة القطبية: z = 8[cos(π/2) + i sin(π/2)].\n2. الجذور التكعيبية z^(1/3) لـ k = 0, 1, 2:\n- عند k = 0: z1 = 2(√3/2 + 1/2 i) = √3 + i.\n- عند k = 1: z2 = 2(-√3/2 + 1/2 i) = -√3 + i.\n- عند k = 2: z3 = 2(0 - i) = -2i.',
    hint: 'الصيغة القطبية لـ 8i زاويتها π/2 وطبق قانون النتيجة.'
  },

  // =========================================================================
  // أسئلة السادس الأدبي (6-prep-literary - وزاري)
  // =========================================================================
  {
    id: 'q-6lit-hi-1',
    gradeId: '6-prep-literary',
    gradeTitle: 'السادس الأدبي (وزاري)',
    subject: 'التاريخ',
    chapter: 'الفصل الثالث: ثورة العشرين الخالدة في العراق وتأسيس الدولة العراقية والعهد الملكي',
    chapterNumber: 3,
    pageNumber: 92,
    pageRange: 'ص 87 - 134',
    questionNumber: 'س1',
    category: 'سؤال وزاري',
    questionText: 'ما هي الأسباب المباشرة وغير المباشرة لاندلاع ثورة العشرين الكبرى في العراق عام 1920؟',
    targetAnswer: 'الأسباب:\n1. المباشرة: اعتقال الشيخ شعلان أبو الجون شيخ عشيرة الظوالم في الرميثة بعد رفضه أوامر الحاكم البريطاني وقيام رجال عشيرته باقتحام السراي وتحريره في 30 حزيران 1920.\n2. غير المباشرة: الوعود الكاذبة بالاستقلال، الضرائب الباهظة والتعسف الاستعماري البريطاني، وفتاوى مراجع الدين العظام بالجهاد للدفاع عن العراق.',
    hint: 'اعتقال الشيخ شعلان أبو الجون والضرائب وفتاوى المرجعية.'
  },
  {
    id: 'q-6lit-ec-1',
    gradeId: '6-prep-literary',
    gradeTitle: 'السادس الأدبي (وزاري)',
    subject: 'الاقتصاد',
    chapter: 'المبحث الأول: علم الاقتصاد والمفاهيم الاقتصادية الأساسية والمشكلة الاقتصادية',
    chapterNumber: 1,
    pageNumber: 10,
    pageRange: 'ص 5 - 38',
    questionNumber: 'س1',
    category: 'تعريف',
    questionText: 'ما هي أركان المشكلة الاقتصادية؟ وميز بين الندرة النسبية والندرة المطلقة؟',
    targetAnswer: 'أركان المشكلة الاقتصادية:\n1. تعدد وتجدد وتزايد الحاجات البشرية باستمرار.\n2. ندرة الموارد الاقتصادية المتاحة لتلبية هذه الحاجات.\nالفرق:\n- الندرة النسبية: وجود المورد ولكن بكمية غير كافية لجميع الحاجات (وهي جوهر علم الاقتصاد).\n- الندرة المطلقة: انعدام وجود المورد كلياً في الطبيعة.',
    hint: 'الحاجات المتجددة والموارد المحدودة.'
  }
];

// دالة البحث والفلترة الدقيقة للأسئلة مع الفصل التام بين المراحل الدراسية
export function getGradeCurriculumQuestions(
  gradeId: string,
  subject: string,
  chapter?: string,
  pageNumber?: number | string,
  categoryFilter?: string,
  searchQuery?: string
): CurriculumQuestion[] {
  const normGrade = (gradeId || '').trim();
  const normSub = (subject || '').trim();
  const normCh = (chapter || '').trim();
  const numPage = pageNumber ? Number(pageNumber) : 0;
  const normQuery = (searchQuery || '').trim().toLowerCase();

  // 1. تصفية صارمة حسب المرحلة والصف الدراسي أولاً لمنع تسرب أي مادة لمرحلة أخرى
  let results = CURRICULUM_QUESTIONS_DB.filter(q => {
    if (normGrade && q.gradeId !== 'all') {
      // مطابقة كاملة لرمز الصف (مثلاً: 1-intermediate يجب ألا يأخذ إلا 1-intermediate)
      return q.gradeId === normGrade;
    }
    return true;
  });

  // إذا لم نجد أسئلة خاصة بالصف، نبحث عن أقرب مرحلة (متوسط أو إعدادي)
  if (results.length === 0) {
    if (normGrade.includes('intermediate')) {
      results = CURRICULUM_QUESTIONS_DB.filter(q => q.gradeId.includes('intermediate'));
    } else if (normGrade.includes('scientific')) {
      results = CURRICULUM_QUESTIONS_DB.filter(q => q.gradeId.includes('scientific'));
    } else if (normGrade.includes('literary')) {
      results = CURRICULUM_QUESTIONS_DB.filter(q => q.gradeId.includes('literary'));
    }
  }

  // 2. تصفية حسب المادة
  if (normSub) {
    const subjectMatches = results.filter(q => 
      q.subject.includes(normSub) || normSub.includes(q.subject)
    );
    if (subjectMatches.length > 0) {
      results = subjectMatches;
    }
  }

  // 3. تصفية حسب الفصل
  if (normCh) {
    const chapterMatches = results.filter(q => 
      q.chapter.toLowerCase().includes(normCh.toLowerCase()) || 
      normCh.toLowerCase().includes(q.chapter.toLowerCase()) ||
      normCh.includes(String(q.chapterNumber))
    );
    if (chapterMatches.length > 0) {
      results = chapterMatches;
    }
  }

  // 4. تصفية حسب التصنيف إن وجد (نظام الفلترة)
  if (categoryFilter && categoryFilter !== 'الكل') {
    results = results.filter(q => q.category === categoryFilter);
  }

  // 5. تصفية حسب نص البحث إن كتب الطالب أو المدرس كلمة مفتاحية
  if (normQuery) {
    results = results.filter(q => 
      q.questionText.toLowerCase().includes(normQuery) ||
      q.targetAnswer.toLowerCase().includes(normQuery) ||
      q.hint.toLowerCase().includes(normQuery)
    );
  }

  // 6. ترتيب حسب قرب الصفحة
  if (numPage > 0 && results.length > 0) {
    results.sort((a, b) => Math.abs(a.pageNumber - numPage) - Math.abs(b.pageNumber - numPage));
  }

  return results;
}
