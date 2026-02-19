import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

// zod schema for structured AI output
const AnalysisSchema = z.object({
  overallSummary: z
    .string()
    .describe('Brief overall assessment of the session (2-4 sentences)'),

  // metric 1 - content coverage
  contentCoverageScore: z
    .number()
    .min(1)
    .max(3)
    .describe(
      'Score 1-3 for content coverage. 1=Missed (failed to teach or incorrect), 2=Partial (mentioned but rushed), 3=Complete (clearly explained with examples and checked understanding)',
    ),
  contentCoverageJustification: z
    .string()
    .describe(
      'Detailed explanation (2-4 sentences) of the content coverage score with specific examples from the transcript',
    ),
  contentCoverageQuotes: z
    .string()
    .nullable()
    .describe(
      'Direct quotes from transcript showing how the Fellow taught the concept (or failed to). Multiple quotes separated by newlines.',
    ),

  // metric 2 - facilitation quality
  facilitationQualityScore: z
    .number()
    .min(1)
    .max(3)
    .describe(
      'Score 1-3 for facilitation quality. 1=Poor (dominated conversation, interrupted, confusing), 2=Adequate (polite but transactional, scripted), 3=Excellent (warm, engaging, validated emotions)',
    ),
  facilitationQualityJustification: z
    .string()
    .describe(
      'Detailed explanation (2-4 sentences) of facilitation quality with specific examples',
    ),
  facilitationQualityQuotes: z
    .string()
    .nullable()
    .describe(
      'Direct quotes showing facilitation approach (e.g., open-ended questions, validation statements, or negative indicators). Multiple quotes separated by newlines.',
    ),

  // metric 3 - protocol safety
  protocolSafetyScore: z
    .number()
    .min(1)
    .max(3)
    .describe(
      'Score 1-3 for protocol safety. 1=Violation (gave medical advice, diagnosed, strayed significantly), 2=Minor Drift (briefly off-topic but returned), 3=Adherent (stayed focused on curriculum)',
    ),
  protocolSafetyJustification: z
    .string()
    .describe(
      'Detailed explanation (2-4 sentences) of protocol adherence with specific examples',
    ),
  protocolSafetyQuotes: z
    .string()
    .nullable()
    .describe(
      'Direct quotes showing protocol adherence or violations. Multiple quotes separated by newlines.',
    ),
  safetyFlag: z
    .boolean()
    .describe(
      'True if ANY protocol violations detected (medical advice, diagnosis, unauthorized advice)',
    ),

  // risk detection, CRITICAL - assessed separate from protocol safety
  riskLevel: z
    .enum(['SAFE', 'RISK'])
    .describe(
      'RISK if any indication of self-harm, suicidal ideation, severe crisis, or immediate danger. SAFE otherwise.',
    ),
  riskQuote: z
    .string()
    .nullable()
    .describe(
      'If RISK detected, provide the EXACT quote from the transcript that indicates the risk. Must be verbatim. Null if SAFE.',
    ),
  riskReason: z
    .string()
    .nullable()
    .describe(
      'If RISK detected, explain why this constitutes a risk and what type of risk it is (self-harm, suicidal ideation, crisis, etc.). Null if SAFE.',
    ),
});

type AnalysisResult = z.infer<typeof AnalysisSchema> & {
  modelUsed: string;
};

export async function generateAnalysis(
  transcript: string,
  concept: string,
): Promise<AnalysisResult> {
  // check API key
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      'OPENAI_API_KEY is not configured in environment variables',
    );
  }

  const prompt = `You are an expert clinical supervisor for Shamiri Institute, reviewing therapy sessions conducted by Shamiri Fellows (lay providers aged 18-22).

Your task is to analyze this therapy session transcript using the Shamiri 3-Point Quality Index across three core metrics.

**Session Context:**
- Assigned Concept: ${concept}
- Session Type: Group therapy (evidence-based mental health intervention)
- Target Population: Young people
- Provider: Shamiri Fellow (lay provider with training, NOT a psychiatrist)

**IMPORTANT: You must evaluate the session using a 1-3 scale for each of the three metrics below.**

---

## Metric 1: Content Coverage (1-3)
**Question: Did the Fellow teach the material?**

Look for indicators that the Fellow properly taught ${concept}, such as:
- Clear explanation of the concept
- Relevant examples or stories
- Checking for student understanding
- Practical applications

**Scoring:**
- **1 (Missed)**: Failed to mention ${concept} or defined it incorrectly
- **2 (Partial)**: Mentioned ${concept} but moved on quickly without checking understanding
- **3 (Complete)**: Clearly explained ${concept}, gave examples, and asked students for thoughts/reflections

**Provide:**
- Score (1-3)
- Justification (2-4 sentences with specific evidence)
- Direct quotes from transcript showing how concept was taught (or not)

---

## Metric 2: Facilitation Quality (1-3)
**Question: How did the Fellow deliver the material?**

**Positive Indicators:**
- Open-ended questions ("What do you think?")
- Validation statements ("Thank you for sharing that")
- Encouragement of participation
- Clear, simple language
- Inviting quieter members to speak

**Negative Indicators:**
- Monologuing without student input
- Interrupting students
- Confusing jargon
- Transactional/robotic tone

**Scoring:**
- **1 (Poor)**: Dominated conversation, interrupted students, or used confusing jargon
- **2 (Adequate)**: Polite but transactional, followed script without deeper engagement
- **3 (Excellent)**: Warm, engaging, encouraged participation, validated emotions

**Provide:**
- Score (1-3)
- Justification (2-4 sentences with specific evidence)
- Direct quotes showing facilitation approach

---

## Metric 3: Protocol Safety (1-3)
**Question: Did the Fellow stay within boundaries?**

**CRITICAL: Shamiri Fellows are lay-providers, NOT psychiatrists.**

**Violations include:**
- Telling students to stop taking medication
- Diagnosing mental health conditions
- Providing medical or therapeutic advice beyond the curriculum
- Giving unrelated relationship advice
- Straying significantly from ${concept} content

**Minor drift:**
- Temporary off-topic conversation that is later redirected

**Scoring:**
- **1 (Violation)**: Gave unauthorized medical/relationship advice or significantly strayed off-topic
- **2 (Minor Drift)**: Briefly went off-topic but returned to curriculum
- **3 (Adherent)**: Stayed focused on Shamiri curriculum and handled distractions gracefully

**Provide:**
- Score (1-3)
- Justification (2-4 sentences with specific evidence)
- Direct quotes showing protocol adherence or violations
- Safety Flag: true if ANY violations detected

---

## Risk Detection (CRITICAL - separate evaluation)

**You MUST flag as RISK if you detect ANY of the following:**
- Explicit or implicit mentions of self-harm
- Suicidal ideation or statements
- Severe mental health crisis
- Immediate danger to self or others

**Be conservative: when in doubt about safety, flag as RISK**

If RISK detected:
- Extract the EXACT concerning quote (verbatim)
- Explain the risk type and why it's concerning

---

**Transcript:**
${transcript}

**Instructions:**
1. Evaluate each metric on the 1-3 scale
2. Provide detailed justifications with specific evidence
3. Include direct quotes from the transcript
4. Clearly flag any safety violations or risks
5. Provide a brief overall assessment

Analyze this session carefully and provide your structured evaluation.`;

  try {
    const result = await generateObject({
      model: openai('gpt-5.1'),
      schema: AnalysisSchema,
      prompt,
      temperature: 0.3,
    });

    return {
      ...result.object,
      modelUsed: 'gpt-5.1',
    };
  } catch (error) {
    console.error('Error generating analysis:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));

    // More specific error message
    if (error instanceof Error) {
      throw new Error(`AI Analysis failed: ${error.message}`);
    }
    throw new Error('Failed to generate AI analysis');
  }
}

// grading rubric reference
export const GRADING_RUBRIC = {
  contentCoverage: {
    3: 'Complete - Clearly explained concept, gave examples, checked understanding',
    2: 'Partial - Mentioned concept but moved on quickly without checking understanding',
    1: 'Missed - Failed to mention concept or defined it incorrectly',
  },
  facilitationQuality: {
    3: 'Excellent - Warm, engaging, encouraged participation, validated emotions',
    2: 'Adequate - Polite but transactional, followed script without deeper engagement',
    1: 'Poor - Dominated conversation, interrupted students, or used confusing jargon',
  },
  protocolSafety: {
    3: 'Adherent - Stayed focused on Shamiri curriculum, handled distractions gracefully',
    2: 'Minor Drift - Briefly went off-topic but returned to curriculum',
    1: 'Violation - Gave unauthorized medical/relationship advice or strayed significantly off-topic',
  },
};
