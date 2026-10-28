import { AppNotification, BankQuestion, Exam, ExamSubmission, ExamTemplate, Subject, UserProfile } from '../types/exam';

export const SUBJECT_METADATA: Record<Subject, { nameAr: string; color: string; icon: string }> = {
  biology: { nameAr: 'علم الأحياء', color: 'emerald', icon: 'Microscope' },
  math: { nameAr: 'الرياضيات والهندسة', color: 'indigo', icon: 'Calculator' },
  physics: { nameAr: 'الفيزياء', color: 'amber', icon: 'Zap' },
  chemistry: { nameAr: 'الكيمياء', color: 'rose', icon: 'FlaskConical' },
  arabic: { nameAr: 'اللغة العربية والبلاغة', color: 'teal', icon: 'BookOpen' },
  english: { nameAr: 'اللغة الإنجليزية', color: 'blue', icon: 'Globe' },
  history: { nameAr: 'التاريخ والدراسات', color: 'orange', icon: 'Landmark' },
  computer_science: { nameAr: 'علوم الحاسب والبرمجة', color: 'cyan', icon: 'Terminal' },
};

export const INITIAL_EXAMS: Exam[] = [];

export const INITIAL_SUBMISSIONS: ExamSubmission[] = [];

export const DEFAULT_GUEST_USER: UserProfile = {
  id: 'usr-guest-01',
  name: 'معلم جديد',
  email: 'teacher@school.edu',
  role: 'teacher',
  schoolName: 'المؤسسة التعليمية',
  currentPlan: 'pro',
};

export const INITIAL_TEMPLATES: ExamTemplate[] = [
  {
    id: 'tmpl-bio-01',
    title: 'قالب الاختبار الفصلي الموحد للأحياء: الجهاز الدوري والخلية',
    description: 'قالب اختبار قياسي متوافق مع المعايير الوزارية يتضمن مخططات تشريحية للقلب والخلية مع بنود تصحيح آلي فورية.',
    subject: 'biology',
    gradeLevel: 'الصف الأول الثانوي',
    difficulty: 'medium',
    estimatedDurationMinutes: 25,
    curriculumStandard: 'المعايير الوطنية الموحدة - وزارة التعليم',
    downloadsCount: 0,
    rating: 0,
    tags: ['أحياء', 'تشريح', 'جهاز دوري', 'خلية نباتية'],
    questions: [
      {
        id: 'tmpl-q-bio-1',
        text: 'أي من حجرات القلب تستقبل الدم المحمل بالأكسجين القادم من الرئتين عبر الأوردة الرئوية؟',
        type: 'multiple_choice',
        options: [
          'الأذين الأيمن (Right Atrium)',
          'الأذين الأيسر (Left Atrium)',
          'البطين الأيمن (Right Ventricle)',
          'البطين الأيسر (Left Ventricle)',
        ],
        correctAnswer: 'الأذين الأيسر (Left Atrium)',
        explanation: 'يدخل الدم المؤكسج مباشرة إلى الأذين الأيسر، ثم يمر عبر الصمام الميترالي إلى البطين الأيسر ليضخه الشريان الأبهر لكافة أعضاء الجسم.',
        points: 5,
        difficulty: 'medium',
        topic: 'تشريح القلب وتدفق الدم',
        media: {
          type: 'image',
          url: '/src/assets/images/diagram_human_heart_1793036033179.jpg',
          caption: 'مخطط تشريحي لحجرات القلب البشري'
        }
      },
      {
        id: 'tmpl-q-bio-2',
        text: 'ما هي العضية الخلوية الكبيرة المسؤولة عن تنظيم ضغط الامتلاء وتخزين العصارة والماء في النبات؟',
        type: 'multiple_choice',
        options: [
          'الفجوة العصارية المركزية الكبيرة',
          'الميتوكوندريا',
          'جهاز جولجي',
          'الريبوسومات'
        ],
        correctAnswer: 'الفجوة العصارية المركزية الكبيرة',
        explanation: 'الفجوة المركزية تشغل المساحة الأكبر من الخلية النباتية وتخزن السوائل والشوارد وتمنح النبتة استقامتها.',
        points: 5,
        difficulty: 'easy',
        topic: 'علم الخلية النباتية',
        media: {
          type: 'image',
          url: '/src/assets/images/diagram_plant_cell_1793036035691.jpg',
          caption: 'عضيات الخلية النباتية'
        }
      },
      {
        id: 'tmpl-q-bio-3',
        text: 'الصمام ثلاثي الشرفات يقع بين الأذين الأيمن والبطين الأيمن لمنع ارتداد الدم أثناء الانقباض.',
        type: 'true_false',
        options: ['صح', 'خطأ'],
        correctAnswer: 'صح',
        explanation: 'صحيح، يتحكم الصمام ثلاثي الشرفات في التدفق من الأذين الأيمن إلى البطين الأيمن.',
        points: 5,
        difficulty: 'easy',
        topic: 'صمامات القلب',
      }
    ]
  },
  {
    id: 'tmpl-math-02',
    title: 'قالب الاختبار التشخيصي: مبرهنة فيثاغورس وحساب المثلثات',
    description: 'قالب جاهز لقياس المهارات الهندسية الأساسية وحساب أطوال الأضلاع والمساحات ومميز المعادلات.',
    subject: 'math',
    gradeLevel: 'الصف الثالث الإعدادي / المتوسط',
    difficulty: 'medium',
    estimatedDurationMinutes: 20,
    curriculumStandard: 'معايير الرياضيات العالمية NCTM',
    downloadsCount: 0,
    rating: 0,
    tags: ['رياضيات', 'هندسة', 'فيثاغورس', 'حساب مثلثات'],
    questions: [
      {
        id: 'tmpl-q-math-1',
        text: 'في المثلث القائم إذا كان طول الضلعين a = 3 و b = 4، فما طول الوتر c ومساحة المربع المنشأ عليه؟',
        type: 'multiple_choice',
        options: [
          'طول الوتر c = 5 ومساحة المربع = 25',
          'طول الوتر c = 7 ومساحة المربع = 49',
          'طول الوتر c = 6 ومساحة المربع = 36',
          'طول الوتر c = 4.5 ومساحة المربع = 20.25'
        ],
        correctAnswer: 'طول الوتر c = 5 ومساحة المربع = 25',
        explanation: 'c² = a² + b² = 9 + 16 = 25 ومنها c = 5 ومساحة المربع = 25.',
        points: 5,
        difficulty: 'medium',
        topic: 'مبرهنة فيثاغورس',
        media: {
          type: 'image',
          url: '/src/assets/images/diagram_geometry_triangle_1793036035504.jpg',
          caption: 'إثبات فيثاغورس الهندسي'
        }
      },
      {
        id: 'tmpl-q-math-2',
        text: 'ما قيمة المميز لمعادلة الدرجة الثانية: x² - 6x + 9 = 0؟',
        type: 'fill_blank',
        correctAnswer: '0',
        explanation: 'Δ = b² - 4ac = (-6)² - 4(1)(9) = 36 - 36 = 0.',
        points: 5,
        difficulty: 'medium',
        topic: 'الجبر والمعادلات التربيعية',
        media: {
          type: 'formula',
          formulaText: 'Δ = b^2 - 4ac \\implies (-6)^2 - 4(1)(9) = 0',
          caption: 'حساب المميز التربيعي'
        }
      }
    ]
  },
  {
    id: 'tmpl-phys-03',
    title: 'قالب اختبار الفيزياء: الميكانيكا وقوانين الحركة والشغل',
    description: 'قالب تطبيقي يركز على قوانين نيوتن الثلاثة، الشغل والطاقة الحركية، وحساب التسارع.',
    subject: 'physics',
    gradeLevel: 'الصف الأول الثانوي',
    difficulty: 'hard',
    estimatedDurationMinutes: 30,
    curriculumStandard: 'منهاج العلوم والفيزياء العامة STEM',
    downloadsCount: 0,
    rating: 0,
    tags: ['فيزياء', 'ميكانيكا', 'نيوتن', 'طاقة وحركة'],
    questions: [
      {
        id: 'tmpl-q-phys-1',
        text: 'ما هي القوة المحصلة المؤثرة على جسم كتلته 5 كجم يتحرك بسرعة ثابتة مقدارها 20 م/ث في خط مستقيم؟',
        type: 'multiple_choice',
        options: [
          'صفر نيوتن (قانون نيوتن الأول)',
          '100 نيوتن',
          '4 نيوتن',
          '50 نيوتن'
        ],
        correctAnswer: 'صفر نيوتن (قانون نيوتن الأول)',
        explanation: 'بحسب قانون نيوتن الأول، طالما أن السرعة ثابتة والاتجاه ثابت (التسارع a = 0)، فإن القوة المحصلة ΣF = m * a = 0.',
        points: 5,
        difficulty: 'medium',
        topic: 'قوانين نيوتن للحركة'
      },
      {
        id: 'tmpl-q-phys-2',
        text: 'الطاقة الحركية لجسم تتناسب طردياً مع مربع سرعته.',
        type: 'true_false',
        options: ['صح', 'خطأ'],
        correctAnswer: 'صح',
        explanation: 'قانون الطاقة الحركية: KE = (1/2) * m * v²، أي تتناسب طردياً مع مربع السرعة.',
        points: 5,
        difficulty: 'easy',
        topic: 'الطاقة الميكانيكية والشغل',
        media: {
          type: 'formula',
          formulaText: 'KE = \\frac{1}{2} m v^2',
          caption: 'معادلة الطاقة الحركية'
        }
      }
    ]
  },
  {
    id: 'tmpl-eng-04',
    title: 'Cambridge B2 English Proficiency: Listening & Grammar',
    description: 'قالب تدريبي معتمد لاختبارات الكفاءة باللغة الإنجليزية مدعوم بمقطع استماع صوتي نقي وتحليل القواعد.',
    subject: 'english',
    gradeLevel: 'المرحلة الثانوية / المستوى المتقدم',
    difficulty: 'hard',
    estimatedDurationMinutes: 25,
    curriculumStandard: 'CEFR B2 Level Framework',
    downloadsCount: 0,
    rating: 0,
    tags: ['English', 'Listening', 'Audio', 'Grammar', 'B2'],
    questions: [
      {
        id: 'tmpl-q-eng-1',
        text: 'Listen to the audio clip and select the main environmental advantage of renewable microgrids:',
        type: 'multiple_choice',
        options: [
          'How renewable energy reduces atmospheric greenhouse emissions globally',
          'Immediate cost elimination in domestic appliance repairs',
          'Replacing industrial silicon semiconductor manufacturing',
          'Decreasing global oceanic tidal variations'
        ],
        correctAnswer: 'How renewable energy reduces atmospheric greenhouse emissions globally',
        explanation: 'The speaker highlights that clean renewable energy significantly cuts greenhouse gases.',
        points: 5,
        difficulty: 'medium',
        topic: 'Listening Comprehension',
        media: {
          type: 'audio',
          audioPromptText: 'Welcome students. Today we analyze how renewable solar and wind technologies significantly lower atmospheric carbon dioxide levels, creating a sustainable foundation for clean urban energy grids.',
          caption: 'English audio excerpt with waveform playback'
        }
      },
      {
        id: 'tmpl-q-eng-2',
        text: 'Choose the correct form: "Had we known about the laboratory delay, we _____ the schedule."',
        type: 'multiple_choice',
        options: [
          'would have adjusted',
          'will adjust',
          'adjusted',
          'had adjusted'
        ],
        correctAnswer: 'would have adjusted',
        explanation: 'Inverted third conditional: Had we known = If we had known... would have adjusted.',
        points: 5,
        difficulty: 'hard',
        topic: 'Conditional Inversion'
      }
    ]
  },
  {
    id: 'tmpl-arb-05',
    title: 'قالب اختبار قواعد النحو والبلاغة: الإعراب والمنصوبات',
    description: 'قالب متقدم يغطي المفاعيل والتمييز والمشتقات والمحسنات البديعية للمرحلة الثانوية.',
    subject: 'arabic',
    gradeLevel: 'الصف الثاني والثالث الثانوي',
    difficulty: 'medium',
    estimatedDurationMinutes: 25,
    curriculumStandard: 'منهاج اللغة العربية والبلاغة للثانوية العامة',
    downloadsCount: 0,
    rating: 0,
    tags: ['لغة عربية', 'نحو', 'بلاغة', 'إعراب'],
    questions: [
      {
        id: 'tmpl-q-arb-1',
        text: 'ما إعراب كلمة "رَغْبَةً" في جملة: (سَافَرَ الطَّالِبُ رَغْبَةً فِي العِلْمِ)؟',
        type: 'multiple_choice',
        options: [
          'مفعول لأجله منصوب وعلامة نصبه الفتحة',
          'حال منصوب بالفتحة',
          'مفعول به منصوب',
          'تمييز منصوب'
        ],
        correctAnswer: 'مفعول لأجله منصوب وعلامة نصبه الفتحة',
        explanation: 'المفعول لأجله يبين سبب وقوع الفعل ويصلح جواباً لـ (لماذا؟).',
        points: 5,
        difficulty: 'easy',
        topic: 'المنصوبات والمفاعيل'
      },
      {
        id: 'tmpl-q-arb-2',
        text: 'ما نوع المشتق في كلمة (مُسْتَودَع) عندما نقول: (هذا المكانُ مُسْتَودَعُ الأسرارِ)؟',
        type: 'fill_blank',
        correctAnswer: 'اسم مكان',
        explanation: 'تدل الكلمة هنا على موضع ومكان حفظ الأسرار فهو اسم مكان فوق ثلاثي.',
        points: 5,
        difficulty: 'medium',
        topic: 'المشتقات'
      }
    ]
  },
  {
    id: 'tmpl-chem-06',
    title: 'قالب اختبار الكيمياء: الروابط الكيميائية والتكافؤ وحساب الكتل',
    description: 'قالب تدريبي يركز على الروابط الأيونية والتساهمية وتحديد عدد التأكسد والكتلة المولية.',
    subject: 'chemistry',
    gradeLevel: 'الصف الأول الثانوي',
    difficulty: 'medium',
    estimatedDurationMinutes: 25,
    curriculumStandard: 'معايير الكيمياء التجريبية الحديثة',
    downloadsCount: 0,
    rating: 0,
    tags: ['كيمياء', 'روابط', 'تأكسد', 'جدول دوري'],
    questions: [
      {
        id: 'tmpl-q-chem-1',
        text: 'الرابطة المتكونة بين ذرة صوديوم (Na) وذرة كلور (Cl) لتكوين كلوريد الصوديوم هي رابطة:',
        type: 'multiple_choice',
        options: [
          'أيونية (فقد واكتساب إلكترونات)',
          'تساهمية نقية',
          'فلزية',
          'هيدروجينية'
        ],
        correctAnswer: 'أيونية (فقد واكتساب إلكترونات)',
        explanation: 'تنشأ الرابطة الأيونية بين فلز يفقد إلكتروناً (Na+) ولا فلز يكتسب إلكتروناً (Cl-).',
        points: 5,
        difficulty: 'easy',
        topic: 'الروابط الكيميائية'
      },
      {
        id: 'tmpl-q-chem-2',
        text: 'الغازات النبيلة (المجموعة 18) تتميز بامتلاء مدارها الخارجي بالإلكترونات مما يجعلها مستقرة كيميائياً.',
        type: 'true_false',
        options: ['صح', 'خطأ'],
        correctAnswer: 'صح',
        explanation: 'الغازات الخاملة مثل الهيليوم والنيون والآرجون مداراتها ممتلئة تماماً لذلك نادراً ما تتفاعل.',
        points: 5,
        difficulty: 'easy',
        topic: 'الجدول الدوري والتكافؤ'
      }
    ]
  }
];

export const CURRICULUM_STANDARD_QUESTIONS: BankQuestion[] = [
  {
    id: 'bank-q-01',
    subject: 'biology',
    topic: 'تشريح القلب وتدفق الدم',
    text: 'بناءً على المخطط التشريحي للقلب البشري: أي حجرة تستقبل الدم المؤكسج القادم من الرئتين عبر الأوردة الرئوية؟',
    type: 'multiple_choice',
    options: [
      'الأذين الأيمن (Right Atrium)',
      'الأذين الأيسر (Left Atrium)',
      'البطين الأيمن (Right Ventricle)',
      'البطين الأيسر (Left Ventricle)',
    ],
    correctAnswer: 'الأذين الأيسر (Left Atrium)',
    explanation: 'يدخل الدم المحمل بالأكسجين عبر الأوردة الرئوية إلى الأذين الأيسر ثم يضخ للجسم.',
    points: 4,
    difficulty: 'medium',
    usageCount: 42,
    createdAt: '2026-10-15',
    curriculumTag: 'ثانوي - فصل أول',
    media: {
      type: 'image',
      url: '/src/assets/images/diagram_human_heart_1793036033179.jpg',
      caption: 'تشريح حجرات القلب وتدفق الدم'
    }
  },
  {
    id: 'bank-q-02',
    subject: 'biology',
    topic: 'عضيات الخلية النباتية',
    text: 'ما العضية المسؤولة عن تخزين الماء وإعطاء الخلية النباتية دعامتها وصلابتها عبر ضغط الامتلاء؟',
    type: 'multiple_choice',
    options: [
      'الفجوة العصارية المركزية الكبيرة',
      'جهاز جولجي',
      'الميتوكوندريا',
      'الشبكة الإندوبلازمية'
    ],
    correctAnswer: 'الفجوة العصارية المركزية الكبيرة',
    explanation: 'الفجوة الكبيرة في النبات تقوم بامتصاص وتخزين السوائل وتحافظ على انتفاخ الخلية.',
    points: 4,
    difficulty: 'easy',
    usageCount: 38,
    createdAt: '2026-10-16',
    curriculumTag: 'ثانوي - علم الخلية',
    media: {
      type: 'image',
      url: '/src/assets/images/diagram_plant_cell_1793036035691.jpg',
      caption: 'عضيات الخلية النباتية'
    }
  },
  {
    id: 'bank-q-03',
    subject: 'biology',
    topic: 'البناء الضوئي',
    text: 'ما اسم العضيات الخلوية النباتية التي تحتوي على صبغة الكلوروفيل وتقوم بالتمثيل الضوئي؟',
    type: 'fill_blank',
    correctAnswer: 'البلاستيدات الخضراء',
    explanation: 'البلاستيدات الخضراء تحول ضوء الشمس إلى طاقة كيميائية في صورة سكر الجلوكوز.',
    points: 4,
    difficulty: 'medium',
    usageCount: 55,
    createdAt: '2026-10-17',
    curriculumTag: 'ثانوي - الأيض والبناء الضوئي'
  },
  {
    id: 'bank-q-04',
    subject: 'math',
    topic: 'مبرهنة فيثاغورس',
    text: 'في مثلث قائم الزاوية طول ضلعيه القائمين 6 سم و 8 سم، ما طول الوتر؟',
    type: 'fill_blank',
    correctAnswer: '10',
    explanation: 'c = √(6² + 8²) = √(36 + 64) = √100 = 10 سم.',
    points: 5,
    difficulty: 'easy',
    usageCount: 88,
    createdAt: '2026-10-10',
    curriculumTag: 'إعدادي/متوسط - هندسة'
  },
  {
    id: 'bank-q-05',
    subject: 'math',
    topic: 'الجبر والمعادلات التربيعية',
    text: 'إذا كان المميز Δ = b² - 4ac سالباً أصغر من الصفر، فكم عدد الجذور الحقيقية للمعادلة؟',
    type: 'multiple_choice',
    options: [
      'صفر (لا توجد جذور حقيقية)',
      'جذر حقيقي واحد فقط',
      'جذران حقيقيان مختلفان',
      'عدد لا نهائي من الجذور'
    ],
    correctAnswer: 'صفر (لا توجد جذور حقيقية)',
    explanation: 'عندما يكون المميز سالباً لا يوجد جذر تربيعي لعدد سالب في مجموعة الأعداد الحقيقية R.',
    points: 5,
    difficulty: 'medium',
    usageCount: 64,
    createdAt: '2026-10-12',
    curriculumTag: 'ثانوي - الجبر'
  },
  {
    id: 'bank-q-06',
    subject: 'physics',
    topic: 'قوانين نيوتن',
    text: 'لكل فعل رد فعل مساوٍ له في المقدار ومعاكس له في الاتجاه يمثل نص قانون نيوتن:',
    type: 'multiple_choice',
    options: [
      'الثالث',
      'الأول',
      'الثاني',
      'قانون الجذب العام'
    ],
    correctAnswer: 'الثالث',
    explanation: 'قانون نيوتن الثالث ينص على قوى الفعل ورد الفعل المتبادلة بين الأجسام.',
    points: 3,
    difficulty: 'easy',
    usageCount: 71,
    createdAt: '2026-10-14',
    curriculumTag: 'ثانوي - ميكانيكا'
  },
  {
    id: 'bank-q-07',
    subject: 'physics',
    topic: 'الشغل والطاقة',
    text: 'وحدة قياس الشغل والطاقة في النظام الدولي للوحدات (SI) هي:',
    type: 'multiple_choice',
    options: [
      'الجول (Joule)',
      'النيوتن (Newton)',
      'الواط (Watt)',
      'الباسكال (Pascal)'
    ],
    correctAnswer: 'الجول (Joule)',
    explanation: 'الجول يعادل نيوتن × متر وهو الوحدة القياسية للطاقة والشغل.',
    points: 3,
    difficulty: 'easy',
    usageCount: 49,
    createdAt: '2026-10-18',
    curriculumTag: 'ثانوي - طاقة'
  },
  {
    id: 'bank-q-08',
    subject: 'chemistry',
    topic: 'الروابط الكيميائية',
    text: 'الرابطة في جزيء الماء H2O هي رابطة تساهمية قطبية بسبب فرق الكهروسالبية بين الأكسجين والهيدروجين.',
    type: 'true_false',
    options: ['صح', 'خطأ'],
    correctAnswer: 'صح',
    explanation: 'الأكسجين أعلى كهروسالبية من الهيدروجين فيجذب زوج الإلكترونات نحوه مكوناً شحنات جزئية.',
    points: 4,
    difficulty: 'medium',
    usageCount: 33,
    createdAt: '2026-10-19',
    curriculumTag: 'ثانوي - كيمياء جزيئية'
  },
  {
    id: 'bank-q-09',
    subject: 'chemistry',
    topic: 'الجدول الدوري',
    text: 'العناصر ذات النشاط الكيميائي الأقل في الجدول الدوري هي:',
    type: 'multiple_choice',
    options: [
      'الغازات النبيلة (المجموعة 18)',
      'الفلزات القلوية (المجموعة 1)',
      'الهالوجينات (المجموعة 17)',
      'الفلزات الانتقالية'
    ],
    correctAnswer: 'الغازات النبيلة (المجموعة 18)',
    explanation: 'تتميز باستقرار مداراتها الإلكترونية واكتمالها بثمانية إلكترونات (أو اثنين للهيليوم).',
    points: 4,
    difficulty: 'easy',
    usageCount: 52,
    createdAt: '2026-10-20',
    curriculumTag: 'ثانوي - عناصر'
  },
  {
    id: 'bank-q-10',
    subject: 'arabic',
    topic: 'المنصوبات',
    text: 'ما علامة نصب جمع المؤنث السالم؟',
    type: 'multiple_choice',
    options: [
      'الكسرة نيابة عن الفتحة',
      'الفتحة الظاهرة',
      'الياء',
      'حذف النون'
    ],
    correctAnswer: 'الكسرة نيابة عن الفتحة',
    explanation: 'جمع المؤنث السالم يرفع بالضمة وينصب ويجر بالكسرة (مثال: رأيتُ المعلماتِ).',
    points: 4,
    difficulty: 'medium',
    usageCount: 90,
    createdAt: '2026-10-11',
    curriculumTag: 'إعدادي/ثانوي - نحو'
  },
  {
    id: 'bank-q-11',
    subject: 'arabic',
    topic: 'البلاغة',
    text: 'الجمع بين الشيء وضده في الكلام مثل (يَعْلَمُونَ وَلَا يَعْلَمُونَ) يسمى:',
    type: 'multiple_choice',
    options: [
      'طباق سلب',
      'طباق إيجاب',
      'جناس ناقص',
      'مقابلة'
    ],
    correctAnswer: 'طباق سلب',
    explanation: 'طباق السلب يكون بين الكلمة ونفيها أو نهيها بأداة نفي.',
    points: 4,
    difficulty: 'hard',
    usageCount: 46,
    createdAt: '2026-10-13',
    curriculumTag: 'ثانوي - بلاغة'
  },
  {
    id: 'bank-q-12',
    subject: 'english',
    topic: 'Academic Vocabulary',
    text: 'Choose the correct synonym for "Meticulous":',
    type: 'multiple_choice',
    options: [
      'Extremely careful and precise',
      'Careless and hasty',
      'Aggressive and hostile',
      'Ancient and obsolete'
    ],
    correctAnswer: 'Extremely careful and precise',
    explanation: '"Meticulous" means showing great attention to detail, very careful and thorough.',
    points: 4,
    difficulty: 'medium',
    usageCount: 39,
    createdAt: '2026-10-15',
    curriculumTag: 'Secondary - Vocabulary'
  },
  {
    id: 'bank-q-13',
    subject: 'english',
    topic: 'Advanced Grammar',
    text: 'Complete the sentence: "Hardly _____ the auditorium when the symposium began."',
    type: 'multiple_choice',
    options: [
      'had the guests entered',
      'the guests entered',
      'did the guests entered',
      'have the guests entered'
    ],
    correctAnswer: 'had the guests entered',
    explanation: 'Negative adverbial inversion at the beginning of sentence: Hardly + had + subject + past participle... when...',
    points: 5,
    difficulty: 'hard',
    usageCount: 29,
    createdAt: '2026-10-16',
    curriculumTag: 'Secondary - Inversion'
  },
  {
    id: 'bank-q-14',
    subject: 'computer_science',
    topic: 'الخوارزميات والبرمجة',
    text: 'التعقيد الزمني (Time Complexity) للبحث الثنائي (Binary Search) في مصفوفة مرتبة هو:',
    type: 'multiple_choice',
    options: [
      'O(log n)',
      'O(n)',
      'O(n^2)',
      'O(1)'
    ],
    correctAnswer: 'O(log n)',
    explanation: 'يقسم البحث الثنائي مساحة البحث إلى النصف في كل خطوة، مما يعطي تعقيداً لوغاريتمياً O(log n).',
    points: 5,
    difficulty: 'medium',
    usageCount: 60,
    createdAt: '2026-10-17',
    curriculumTag: 'ثانوي - هياكل بيانات'
  }
];

export const INITIAL_BANK_QUESTIONS: BankQuestion[] = [];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [];

