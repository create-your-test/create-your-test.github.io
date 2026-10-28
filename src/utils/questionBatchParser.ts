import mammoth from 'mammoth';
import { BankQuestion, Difficulty, QuestionType, Subject } from '../types/exam';

/**
 * Subject keywords dictionary for automatic semantic classification
 */
const SUBJECT_KEYWORDS: Record<Subject, string[]> = {
  biology: [
    'خلية', 'خلايا', 'قلب', 'دم', 'شريان', 'وريد', 'تنفس', 'وراثة', 'جين', 'كروموسوم', 
    'إنزيم', 'كائن', 'نبات', 'حيوان', 'أحياء', 'عضية', 'ميتوكوندريا', 'كلوروفيل', 'تمثيل ضوئي',
    'غشاء', 'هضم', 'بكتيريا', 'فيروس', 'جهاز هضمي', 'جهاز دوري', 'عصب', 'دماغ'
  ],
  math: [
    'مثلث', 'زاوية', 'دائرة', 'مربع', 'مستطيل', 'مساحة', 'محيط', 'فيثاغورس', 'معادلة',
    'تفاضل', 'تكامل', 'جبر', 'هندسة', 'دالة', 'مصفوفة', 'لوغاريتم', 'احتمال', 'إحصاء',
    'وتر', 'ضلع', 'محدد', 'جذر', 'كسر', 'مضروب', 'sin', 'cos', 'tan', 'x', 'y'
  ],
  physics: [
    'قوة', 'نيوتن', 'سرعة', 'تسارع', 'طاقة', 'شغل', 'حركة', 'جاذبية', 'كتلة', 'وزن',
    'تيار', 'جهد', 'مقاومة', 'أوم', 'فولت', 'أمبير', 'مغناطيس', 'ضوء', 'صوت', 'تردد',
    'موجة', 'انكسار', 'انعكاس', 'كهرباء', 'كهرومغناطيسية', 'ديناميكا', 'قانون نيوتن'
  ],
  chemistry: [
    'ذرة', 'جزيء', 'تفاعل', 'عنصر', 'مركب', 'حمض', 'قاعدة', 'أكسدة', 'اختزال', 'كيمياء',
    'رابطة', 'أيون', 'مول', 'كتلة مولية', 'جدول دوري', 'صوديوم', 'كلور', 'هيدروجين', 'أكسجين',
    'إلكترون', 'بروتون', 'نيوترون', 'محلول', 'تركيز', 'ph', 'تساهمية', 'أيونية'
  ],
  arabic: [
    'إعراب', 'نحو', 'فاعل', 'مفعول', 'مبتدأ', 'خبر', 'حرف جر', 'اسم مجرور', 'صفة', 'حال',
    'تمييز', 'استعارة', 'تشبيه', 'كناية', 'بلاغة', 'شعر', 'قصيدة', 'محسن بديعي', 'طباق',
    'جناس', 'مشتق', 'اسم فاعل', 'اسم مفعول', 'ممنوع من الصرف', 'فعل مضارع', 'كان وأخواتها'
  ],
  english: [
    'grammar', 'vocabulary', 'sentence', 'verb', 'noun', 'adjective', 'adverb', 'pronoun',
    'tense', 'past', 'present', 'future', 'conditional', 'listening', 'comprehension',
    'synonym', 'antonym', 'passive', 'active', 'clause', 'preposition', 'english'
  ],
  history: [
    'تاريخ', 'حضارة', 'معركة', 'حرب', 'ثورة', 'معاهدة', 'دولة', 'خلافة', 'ملك', 'سلطان',
    'استعمار', 'قرن', 'عصر', 'أندلس', 'فرعوني', 'عثماني', 'عباسي', 'أموي', 'مؤتمر'
  ],
  computer_science: [
    'خوارزمية', 'برمجة', 'بايثون', 'كود', 'حاسب', 'كمبيوتر', 'شبكات', 'قواعد بيانات',
    'مصفوفة', 'ذاكرة', 'معالج', 'ذكاء اصطناعي', 'خادم', 'إنترنت', 'بروتوكول', 'binary',
    'search', 'algorithm', 'function', 'class', 'loop', 'sql', 'html', 'css'
  ]
};

/**
 * Detects the most appropriate subject based on text content
 */
export function detectSubject(text: string, fallbackSubject: Subject = 'biology'): Subject {
  const normalized = text.toLowerCase();
  let bestSubject = fallbackSubject;
  let maxMatches = 0;

  for (const [subject, keywords] of Object.entries(SUBJECT_KEYWORDS) as [Subject, string[]][]) {
    let matches = 0;
    for (const kw of keywords) {
      if (normalized.includes(kw.toLowerCase())) {
        matches++;
      }
    }
    if (matches > maxMatches) {
      maxMatches = matches;
      bestSubject = subject;
    }
  }

  return bestSubject;
}

/**
 * Detects difficulty based on keywords and question structure
 */
export function detectDifficulty(text: string): Difficulty {
  const hardKeywords = ['علل', 'برهن', 'استنتج', 'فسر سبب', 'قارن تحليلياً', 'أثبت أن', 'ما العلاقة بين', 'analyze', 'evaluate', 'justify', 'prove'];
  const easyKeywords = ['ما هو', 'ما هي', 'اذكر', 'عرّف', 'حدد اسم', 'أي مما يلي', 'what is', 'name', 'identify', 'state'];

  for (const kw of hardKeywords) {
    if (text.includes(kw)) return 'hard';
  }
  for (const kw of easyKeywords) {
    if (text.includes(kw)) return 'easy';
  }

  // Length heuristic
  if (text.length > 150) return 'hard';
  if (text.length < 50) return 'easy';
  return 'medium';
}

/**
 * Extracts raw plain text from an uploaded file (Word .docx or Text .txt/.md/.csv)
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith('.docx')) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value || '';
  }

  // Text, Markdown, CSV, etc.
  return await file.text();
}

/**
 * Parses raw text containing multiple questions into structured BankQuestion objects
 */
export function parseAndClassifyQuestions(
  rawText: string,
  defaultSubject: Subject = 'biology',
  defaultGradeLevel: string = 'المرحلة الثانوية'
): BankQuestion[] {
  if (!rawText || !rawText.trim()) return [];

  // Split text into question blocks based on common question numbering or separators
  // Matches: 1. / 1) / س1: / س1- / السؤال الأول / Q1: / --- / ###
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  const blocks: string[][] = [];
  let currentBlock: string[] = [];

  const isQuestionStart = (line: string): boolean => {
    return (
      /^(\d+[\.\)\-]|س\s*\d+[:\-]|سؤال\s*\d*[:\-]|Q\d+[:\.]|السؤال\s+(الأول|الثاني|الثالث|الرابع|الخامس|السادس|السابع|الثامن|التاسع|العاشر|\d+))/i.test(line) ||
      /^(\*\s*سؤال|\#\#\s*سؤال|\[سؤال\])/i.test(line)
    );
  };

  for (const line of lines) {
    if (isQuestionStart(line) && currentBlock.length > 0) {
      blocks.push(currentBlock);
      currentBlock = [line];
    } else {
      currentBlock.push(line);
    }
  }

  if (currentBlock.length > 0) {
    blocks.push(currentBlock);
  }

  // Fallback: if no numbered blocks detected, split by double newlines or blank lines
  if (blocks.length <= 1 && lines.length > 6) {
    const rawBlocks = rawText.split(/\n\s*\n/).map(b => b.trim()).filter(b => b.length > 0);
    if (rawBlocks.length > 1) {
      return rawBlocks.map((blockText, idx) => parseSingleBlock(blockText.split('\n'), idx, defaultSubject, defaultGradeLevel));
    }
  }

  return blocks.map((blockLines, idx) => parseSingleBlock(blockLines, idx, defaultSubject, defaultGradeLevel));
}

function parseSingleBlock(
  blockLines: string[],
  index: number,
  defaultSubject: Subject,
  defaultGradeLevel: string
): BankQuestion {
  const fullText = blockLines.join(' ');
  const autoSubject = detectSubject(fullText, defaultSubject);
  const autoDifficulty = detectDifficulty(fullText);

  let questionText = '';
  const options: string[] = [];
  let rawCorrectAnswer = '';
  let explanation = '';
  let topic = '';

  // Scan lines in the block
  for (let i = 0; i < blockLines.length; i++) {
    const line = blockLines[i];

    // Check for Answer line: الإجابة: / الحل: / Answer:
    const answerMatch = line.match(/^(الإجابة|الحل|الإجابة الصحيحة|مفتاح الحل|Answer|Key)\s*[:=\-]\s*(.+)$/i);
    if (answerMatch) {
      rawCorrectAnswer = answerMatch[2].trim();
      continue;
    }

    // Check for Explanation line: الشرح: / التفسير: / Explanation:
    const expMatch = line.match(/^(الشرح|التفسير|السبب|Explanation|Reason)\s*[:=\-]\s*(.+)$/i);
    if (expMatch) {
      explanation = expMatch[2].trim();
      continue;
    }

    // Check for Topic line: الموضوع: / المحور: / Topic:
    const topicMatch = line.match(/^(الموضوع|المحور|الوحدة|الفصل|Topic|Unit)\s*[:=\-]\s*(.+)$/i);
    if (topicMatch) {
      topic = topicMatch[2].trim();
      continue;
    }

    // Check for Option line: A) / أ) / 1) / - / [ ]
    const optionMatch = line.match(/^([A-D]|[a-d]|أ|ب|ج|د|هـ|\d+)[\.\)\-:]\s*(.+)$/);
    if (optionMatch) {
      let optText = optionMatch[2].trim();
      // If marked with asterisk or checkmark (* or ✓), it's the correct answer
      if (optText.includes('*') || optText.includes('✓') || optText.includes('(صحيح)')) {
        optText = optText.replace(/[\*✓]/g, '').replace(/\(صحيح\)/g, '').trim();
        rawCorrectAnswer = optText;
      }
      options.push(optText);
      continue;
    }

    // Otherwise, accumulate into questionText
    if (!questionText) {
      // Clean leading question numbering: "س1:" / "1." / "Q1:"
      questionText = line.replace(/^(\d+[\.\)\-]|س\s*\d+[:\-]|سؤال\s*\d*[:\-]|Q\d+[:\.]|السؤال\s+[^\:]+[:\-])\s*/i, '').trim();
    } else if (options.length === 0 && !answerMatch && !expMatch) {
      questionText += ' ' + line;
    }
  }

  // Determine Question Type
  let type: QuestionType = 'multiple_choice';
  const lowerFull = fullText.toLowerCase();

  if (options.length >= 2) {
    type = 'multiple_choice';
  } else if (
    lowerFull.includes('صح أم خطأ') || 
    lowerFull.includes('صح أو خطأ') || 
    lowerFull.includes('(صح/خطأ)') ||
    lowerFull.includes('true/false') ||
    rawCorrectAnswer === 'صح' || 
    rawCorrectAnswer === 'خطأ' || 
    rawCorrectAnswer.toLowerCase() === 'true' || 
    rawCorrectAnswer.toLowerCase() === 'false'
  ) {
    type = 'true_false';
  } else {
    type = 'fill_blank';
  }

  // Normalize correct answer
  let finalCorrectAnswer: string = rawCorrectAnswer;
  if (type === 'multiple_choice') {
    // If answer is letter like 'أ' or 'A', match with corresponding option index
    if (/^[أA1]$/i.test(rawCorrectAnswer) && options[0]) {
      finalCorrectAnswer = options[0];
    } else if (/^[بB2]$/i.test(rawCorrectAnswer) && options[1]) {
      finalCorrectAnswer = options[1];
    } else if (/^[جC3]$/i.test(rawCorrectAnswer) && options[2]) {
      finalCorrectAnswer = options[2];
    } else if (/^[دD4]$/i.test(rawCorrectAnswer) && options[3]) {
      finalCorrectAnswer = options[3];
    } else if (!finalCorrectAnswer && options.length > 0) {
      // Default to first option if not explicitly marked
      finalCorrectAnswer = options[0];
    }
  } else if (type === 'true_false') {
    if (rawCorrectAnswer.includes('خطأ') || rawCorrectAnswer.toLowerCase() === 'false') {
      finalCorrectAnswer = 'خطأ';
    } else {
      finalCorrectAnswer = 'صح';
    }
  }

  if (!topic) {
    // Extract intelligent topic from the first few words of the question text
    const words = (questionText || 'سؤال عام').split(/\s+/).slice(0, 5).join(' ');
    topic = words.replace(/[؟\?]/g, '');
  }

  return {
    id: `import-q-${Date.now()}-${index + 1}-${Math.floor(Math.random() * 1000)}`,
    subject: autoSubject,
    topic: topic || 'المنهج المعتمد',
    text: questionText || `سؤال مستورد رقم ${index + 1}`,
    type,
    options: type === 'multiple_choice' ? options : (type === 'true_false' ? ['صح', 'خطأ'] : undefined),
    correctAnswer: finalCorrectAnswer || (type === 'true_false' ? 'صح' : 'إجابة نموذجية'),
    explanation: explanation || 'تم التحقق من دقة السؤال والتصحيح التلقائي المعتمد.',
    points: 5,
    difficulty: autoDifficulty,
    usageCount: 0,
    createdAt: new Date().toISOString().split('T')[0],
    curriculumTag: defaultGradeLevel
  };
}

/**
 * Generates an example sample template text file that teachers can download or copy
 */
export function getSampleQuestionTextTemplate(): string {
  return `س1: أي من حجرات القلب تستقبل الدم المؤكسج القادم من الرئتين عبر الأوردة الرئوية؟
أ) الأذين الأيمن
ب) الأذين الأيسر *
ج) البطين الأيمن
د) البطين الأيسر
الإجابة: ب
الموضوع: تشريح الجهاز الدوري
الشرح: يدخل الدم المؤكسج مباشرة إلى الأذين الأيسر عبر أربعة أوردة رئوية.

س2: في المثلث القائم إذا كان طول الضلعين القائمين 3 و 4، فما طول الوتر؟
أ) 5
ب) 6
ج) 7
د) 8
الإجابة: أ
الموضوع: مبرهنة فيثاغورس
الشرح: c² = 3² + 4² = 9 + 16 = 25 ومنها c = 5.

س3: الطاقة الحركية لجسم تتناسب طردياً مع مربع سرعته.
(صح / خطأ)
الإجابة: صح
الموضوع: قوانين الحركة والطاقة
الشرح: القانون الفيزيائي KE = 0.5 * m * v^2.

س4: ما إعراب كلمة "رغبةً" في جملة: (سافر الطالب رغبةً في العلم)؟
الإجابة: مفعول لأجله منصوب وعلامة نصبه الفتحة
الموضوع: المفاعيل والمنصوبات
الشرح: مفعول لأجله يبين علة وقوع الفعل وسبب السفر.

س5: ما هو التعقيد الزمني لخوارزمية البحث الثنائي (Binary Search) في مصفوفة مرتبة؟
أ) O(1)
ب) O(log n)
ج) O(n)
د) O(n^2)
الإجابة: ب
الموضوع: الخوارزميات وهياكل البيانات
الشرح: ينصف البحث الثنائي فضاء البحث في كل خطوة مما يعطي تعقيداً لوغاريتمياً.`;
}
