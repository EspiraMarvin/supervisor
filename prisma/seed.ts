import { PrismaClient, SessionStatus, RiskLevel } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

//  seeding, using direct TCP connection with adapter
const connectionString = process.env.DATABASE_URL!.includes('prisma+postgres')
  ? process.env
      .DATABASE_URL!.replace('prisma+postgres://', 'postgres://')
      .split('?api_key=')[0]
      .replace('localhost:51213', 'localhost:51214')
  : process.env.DATABASE_URL!;

const pool = new pg.Pool({
  connectionString,
  max: 1,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 0,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// therapy session transcripts
const transcripts = [
  {
    concept: 'Growth Mindset',
    duration: 52,
    transcript: `[00:00] Fellow Sarah: Good afternoon everyone! Welcome to today's session. How is everyone feeling today?

[00:01] Participant 1: I'm okay, a bit tired from school.
[00:02] Participant 2: I'm good, excited to be here!
[00:03] Participant 3: Feeling stressed about my exams coming up.

[00:04] Fellow Sarah: Thank you all for sharing. It's completely normal to feel stressed about exams. Today, we're going to talk about something that can really help with that stress - it's called Growth Mindset.

[00:05] Fellow Sarah: Can anyone tell me what they think "mindset" means?

[00:06] Participant 2: Is it like how you think about things?
[00:07] Fellow Sarah: Exactly! A mindset is the way we think about ourselves and our abilities. Now, there are two types of mindsets: fixed mindset and growth mindset.

[00:10] Fellow Sarah: With a fixed mindset, people believe their abilities are set in stone. They think "I'm either smart or I'm not." But with a growth mindset, people believe they can develop their abilities through effort and learning.

[00:12] Participant 3: So you're saying I can get better at math even though I'm bad at it now?
[00:13] Fellow Sarah: Exactly! Let me share a story. There was a student named John who always said "I'm bad at math." He had a fixed mindset. But then he learned about growth mindset and started saying "I'm not good at math YET, but I can improve with practice."

[00:18] Fellow Sarah: Let's do an activity. I want each of you to think of something you believe you're "not good at." Write it down.

[00:20] Participant 1: I wrote "public speaking."
[00:21] Fellow Sarah: Great! Now, let's reframe that with a growth mindset. Instead of "I'm bad at public speaking," what could you say?

[00:22] Participant 1: Um... "I'm not good at public speaking yet, but I can improve with practice"?
[00:23] Fellow Sarah: Perfect! That's the power of adding "yet" to your thoughts.

[00:25] Fellow Sarah: Research shows that our brains are like muscles - they grow stronger when we challenge them. Every time you struggle with something and keep trying, you're actually building new connections in your brain.

[00:30] Participant 3: That's actually really cool. So failing at something isn't bad?
[00:31] Fellow Sarah: Exactly! Failure is just feedback. It tells us what we need to work on. Some of the most successful people in the world failed many times before they succeeded.

[00:35] Fellow Sarah: Let's practice. I want everyone to share one challenge they're facing right now and how they can approach it with a growth mindset.

[00:36] Participant 2: I'm struggling to make friends at my new school. With a growth mindset, I can say that I haven't found my friend group yet, but I can keep trying different clubs and activities.

[00:38] Fellow Sarah: That's wonderful! Anyone else?

[00:39] Participant 1: I'm worried about my exam. But I guess I can say I haven't mastered this material yet, but I have time to study and improve.

[00:42] Fellow Sarah: Excellent examples, everyone! Now, let's talk about strategies you can use when you face challenges.

[00:45] Fellow Sarah: First, embrace challenges. Second, persist through obstacles. Third, see effort as the path to mastery. Fourth, learn from criticism. And fifth, find inspiration in others' success.

[00:48] Participant 3: Can we write these down?
[00:49] Fellow Sarah: Absolutely! I'll write them on the board for everyone.

[00:50] Fellow Sarah: Before we end, I want each of you to commit to one thing you'll try this week with a growth mindset. Who wants to start?

[00:51] Participant 2: I'll try out for the school play even though I'm nervous.
[00:52] Participant 1: I'll ask my teacher for help in the subject I'm struggling with.
[00:53] Participant 3: I'll practice math problems every day instead of avoiding them.

[00:54] Fellow Sarah: These are all amazing commitments! Remember, growth mindset is about progress, not perfection. Thank you all for participating today!`,
    riskLevel: RiskLevel.SAFE,
  },
  {
    concept: 'Gratitude Practice',
    duration: 48,
    transcript: `[00:00] Fellow James: Hello everyone! Welcome back. Today we're going to explore something powerful called gratitude.

[00:02] Participant 1: What's gratitude?
[00:03] Fellow James: Great question! Gratitude means being thankful and appreciating the good things in our lives, both big and small.

[00:05] Fellow James: Research shows that practicing gratitude can actually make us happier and healthier. It can reduce stress, improve sleep, and even strengthen our relationships.

[00:08] Participant 2: How do we practice it?
[00:09] Fellow James: There are many ways! Today, I'll teach you a simple technique called the "Three Good Things" practice.

[00:12] Fellow James: Every day, you write down three good things that happened, no matter how small. It could be "I had a nice breakfast" or "My friend made me laugh."

[00:15] Participant 3: That sounds easy!
[00:16] Fellow James: It is! But the key is to do it consistently. Let's try it now. Think about the past 24 hours. What are three good things that happened?

[00:18] Participant 1: I got to sleep in a bit this morning.
[00:19] Participant 2: My mom made my favorite meal for dinner last night.
[00:20] Participant 3: I finished my homework early.

[00:22] Fellow James: Excellent! Now, here's the important part - for each good thing, I want you to think about WHY it happened or WHY it made you feel good.

[00:25] Participant 1: I got to sleep in because it's Saturday, and it made me feel good because I was really tired.
[00:26] Fellow James: Perfect! That's exactly it. When we understand why good things happen, we can create more of them.

[00:30] Fellow James: Now let's talk about gratitude for people. Who is someone in your life you're grateful for?

[00:32] Participant 2: My grandmother. She always listens to me when I'm upset.
[00:33] Fellow James: Beautiful. Have you told her that you appreciate her?
[00:34] Participant 2: Not really...
[00:35] Fellow James: That's your homework! This week, I want each of you to express gratitude to someone. Tell them specifically what you appreciate about them.

[00:38] Fellow James: Let's practice gratitude for ourselves too. What's something you're proud of about yourself?

[00:40] Participant 3: I'm proud that I didn't give up on learning to play guitar even though it was hard at first.
[00:41] Fellow James: That's wonderful! Self-gratitude is just as important as being grateful for others.

[00:43] Fellow James: I want to teach you a quick gratitude meditation we can do together. Close your eyes and take a deep breath.

[00:44] Fellow James: Think of one person who has been kind to you. Picture their face. Feel the warmth of their kindness. Silently say "thank you" to them in your mind.

[00:46] Fellow James: Now think of one thing your body allows you to do - walk, see, hear, hug. Feel grateful for your body.

[00:47] Fellow James: Take one more deep breath and open your eyes. How does everyone feel?

[00:48] Participant 1: I feel calmer.
[00:49] Participant 2: I feel happy!
[00:50] Fellow James: That's the power of gratitude. It shifts our focus from what's wrong to what's right in our lives. Thank you all for being here today!`,
    riskLevel: RiskLevel.SAFE,
  },
  {
    concept: 'Self-Compassion',
    duration: 55,
    transcript: `[00:00] Fellow Maria: Welcome everyone! Today's topic is very important - self-compassion.

[00:02] Participant 1: What does that mean?
[00:03] Fellow Maria: Self-compassion means treating yourself with the same kindness and understanding that you would offer to a good friend.

[00:06] Fellow Maria: Many of us are very hard on ourselves. When we make a mistake, we might think "I'm so stupid" or "I always mess up." But we would never say that to a friend, would we?

[00:09] Participant 2: No, I'd tell my friend it's okay and everyone makes mistakes.
[00:10] Fellow Maria: Exactly! So why don't we give ourselves that same kindness?

[00:12] Fellow Maria: Dr. Kristin Neff, a researcher, says self-compassion has three parts: self-kindness, common humanity, and mindfulness.

[00:15] Fellow Maria: Self-kindness means being gentle with ourselves instead of harsh. Common humanity means recognizing that everyone struggles - you're not alone. Mindfulness means being aware of our feelings without getting overwhelmed by them.

[00:20] Participant 3: I'm always really hard on myself when I get bad grades.
[00:21] Fellow Maria: Thank you for sharing that. Let's explore that. What do you usually say to yourself when you get a bad grade?

[00:22] Participant 3: I tell myself I'm stupid and I'll never be good enough.
[00:23] Fellow Maria: That must feel really painful. Now, imagine your best friend got a bad grade. What would you say to them?

[00:25] Participant 3: I'd say it's just one grade, you can do better next time, and I'd help them study.
[00:26] Fellow Maria: Beautiful! That's self-compassion. Can you try saying those same words to yourself?

[00:28] Participant 3: It feels weird, but... "It's just one grade, I can do better next time, and I can ask for help."
[00:29] Fellow Maria: How does that feel?
[00:30] Participant 3: Better, actually. Less heavy.

[00:32] Fellow Maria: Let's do an exercise. Everyone place your hand on your heart. Feel the warmth of your hand.

[00:34] Fellow Maria: Now, think of a difficult situation you're facing. Notice how it makes you feel. Don't judge the feeling, just notice it.

[00:36] Fellow Maria: Now, say these words to yourself silently: "This is a moment of suffering. Suffering is part of life. May I be kind to myself. May I give myself the compassion I need."

[00:40] Fellow Maria: Take a deep breath and open your eyes when you're ready.

[00:42] Participant 1: That was powerful. I felt emotional.
[00:43] Fellow Maria: That's completely normal. Sometimes when we finally show ourselves kindness, emotions come up. That's okay.

[00:45] Fellow Maria: Let's talk about the inner critic - that harsh voice in our head. Everyone has one. What does yours say?

[00:47] Participant 2: Mine says I'm not as good as other people.
[00:48] Fellow Maria: Thank you for sharing. Here's a technique: when you hear that critical voice, imagine it's coming from a scared part of you that's trying to protect you. Thank it for trying to help, but tell it you've got this.

[00:50] Fellow Maria: Then replace that critical thought with a compassionate one. Instead of "I'm not as good as others," try "I'm doing my best, and that's enough."

[00:52] Participant 1: Can we really change how we think?
[00:53] Fellow Maria: Yes! It takes practice, but our brains can learn new patterns. Every time you choose a compassionate thought over a critical one, you're building that muscle.

[00:54] Fellow Maria: Your homework is to notice when you're being self-critical this week, and practice responding with self-compassion instead. Thank you all for your openness today!`,
    riskLevel: RiskLevel.SAFE,
  },
  {
    concept: 'Stress Management',
    duration: 50,
    transcript: `[00:00] Fellow David: Good afternoon! Today we're tackling something everyone deals with - stress.

[00:02] Participant 1: I'm stressed all the time.
[00:03] Fellow David: You're not alone. Stress is our body's response to challenges or demands. A little stress can be helpful, but too much can be harmful.

[00:06] Fellow David: Let's start by understanding what happens in our body when we're stressed. Has anyone felt their heart racing before a test?

[00:08] Participant 2: Yes! And my hands get sweaty.
[00:09] Fellow David: That's your body's "fight or flight" response. It's actually designed to protect you, but sometimes it activates when we don't really need it.

[00:12] Fellow David: Today I'll teach you practical tools to manage stress. The first is deep breathing. It sounds simple, but it's incredibly powerful.

[00:15] Fellow David: Let's try it together. Breathe in through your nose for 4 counts, hold for 4 counts, breathe out through your mouth for 4 counts. Ready?

[00:17] [Group does breathing exercise together]

[00:20] Fellow David: How does everyone feel?
[00:21] Participant 3: More relaxed actually.
[00:22] Fellow David: That's because deep breathing activates your parasympathetic nervous system - it tells your body "we're safe, we can calm down."

[00:25] Fellow David: The second tool is called progressive muscle relaxation. You tense and then relax different muscle groups. Let's try it with our shoulders.

[00:27] Fellow David: Raise your shoulders up to your ears and squeeze tight... hold it... now release and let them drop. Feel the difference?

[00:30] Participant 1: Wow, I didn't realize how tense I was.
[00:31] Fellow David: Most of us carry stress in our bodies without realizing it. This technique helps us release it.

[00:34] Fellow David: The third tool is time management. Often we're stressed because we feel overwhelmed by everything we have to do. Who relates to that?

[00:36] [All participants raise hands]

[00:37] Fellow David: Here's a simple strategy: write down everything you need to do. Then mark each task as urgent, important, both, or neither.

[00:40] Fellow David: Focus on urgent AND important tasks first. Important but not urgent tasks you schedule for later. Urgent but not important tasks you might delegate. And neither? Maybe you don't need to do them at all.

[00:43] Participant 2: That makes sense! I always feel like everything is urgent.
[00:44] Fellow David: Exactly. This helps you prioritize and feel more in control.

[00:46] Fellow David: The fourth tool is physical activity. Exercise is one of the best stress relievers. You don't need to run a marathon - even a 10-minute walk helps.

[00:48] Fellow David: Finally, the fifth tool is social support. Talking to someone you trust about your stress can make a huge difference. Don't try to handle everything alone.

[00:50] Fellow David: Let's practice. Turn to the person next to you and share one thing that's stressing you right now. Then, help each other brainstorm one small step to address it.

[00:52] [Participants pair up and talk]

[00:54] Fellow David: Great work everyone! Remember, managing stress is a skill. The more you practice these tools, the better you'll get at it. See you next time!`,
    riskLevel: RiskLevel.SAFE,
  },
  {
    concept: 'Building Resilience',
    duration: 53,
    transcript: `[00:00] Fellow Lisa: Hello everyone! Today's session is about resilience - the ability to bounce back from difficult situations.

[00:03] Participant 1: Like being tough?
[00:04] Fellow Lisa: Not exactly. Resilience isn't about being tough or never feeling sad. It's about being able to recover and adapt when hard things happen.

[00:07] Fellow Lisa: Think of a tree in a storm. A rigid tree might break, but a flexible tree bends and then springs back. That's resilience.

[00:10] Fellow Lisa: Everyone faces challenges - that's part of life. But resilient people have skills that help them cope. The good news? These skills can be learned!

[00:13] Fellow Lisa: The first skill is having a growth mindset - believing you can learn and improve. We talked about this before. Remember?

[00:15] Participant 2: Yes! It's about adding "yet" to things we can't do.
[00:16] Fellow Lisa: Exactly! The second skill is problem-solving. When you face a challenge, break it down into smaller, manageable steps.

[00:19] Fellow Lisa: Let's practice. Participant 3, you mentioned you're struggling with a group project. Let's break that down. What specifically is challenging?

[00:21] Participant 3: My group members aren't doing their part, and I'm worried we'll fail.
[00:22] Fellow Lisa: Okay, so the problem is unequal work distribution. What are some possible solutions?

[00:24] Participant 3: I could... talk to them about it? Or talk to the teacher?
[00:25] Fellow Lisa: Both good options! What else?
[00:26] Participant 1: Maybe create a schedule so everyone knows what they need to do?
[00:27] Fellow Lisa: Great! See how breaking it down makes it less overwhelming?

[00:30] Fellow Lisa: The third skill is emotional regulation - managing your feelings in healthy ways. When something bad happens, it's normal to feel upset. But we can choose how we respond.

[00:34] Fellow Lisa: If you're angry, you could punch a wall - but that might hurt you. Or you could take deep breaths, go for a walk, or talk to someone. Those are healthier responses.

[00:37] Participant 2: What if you feel really sad?
[00:38] Fellow Lisa: It's okay to feel sad. Let yourself feel it, but also do things that help - talk to someone, write in a journal, do an activity you enjoy. Don't isolate yourself.

[00:41] Fellow Lisa: The fourth skill is building strong relationships. Having people who support you makes a huge difference in resilience.

[00:44] Fellow Lisa: Who is someone in your life you can turn to when things are hard?

[00:45] Participant 1: My older sister.
[00:46] Participant 2: My best friend.
[00:47] Participant 3: My coach.

[00:48] Fellow Lisa: Wonderful! Make sure to nurture those relationships. And if you feel like you don't have enough support, reach out - to a teacher, a counselor, or even to this group.

[00:50] Fellow Lisa: The fifth skill is self-care. You can't pour from an empty cup. Make sure you're getting enough sleep, eating well, and doing things you enjoy.

[00:52] Fellow Lisa: Let's end with this: resilience isn't about never falling down. It's about getting back up. And every time you get back up, you're building your resilience muscle. You've all shown resilience just by being here and working on yourselves. I'm proud of you!`,
    riskLevel: RiskLevel.SAFE,
  },
  {
    concept: 'Positive Relationships',
    duration: 49,
    transcript: `[00:00] Fellow Emma: Welcome back everyone! Today we're exploring positive relationships and how they impact our mental health.

[00:03] Fellow Emma: Humans are social beings. We need connection with others. Research shows that having good relationships is one of the biggest factors in happiness and wellbeing.

[00:07] Participant 1: What makes a relationship "positive"?
[00:08] Fellow Emma: Great question! Positive relationships have trust, respect, good communication, and mutual support. Both people feel valued and heard.

[00:12] Fellow Emma: Let's start with communication. Good communication isn't just about talking - it's about listening too. Who can tell me what "active listening" means?

[00:15] Participant 2: Is it when you really pay attention to what someone is saying?
[00:16] Fellow Emma: Yes! It means giving someone your full attention, not interrupting, and showing you understand. Let's practice.

[00:18] Fellow Emma: Pair up. One person will share something about their day for one minute. The other person will practice active listening - make eye contact, nod, and don't interrupt. Then switch.

[00:22] [Participants practice]

[00:24] Fellow Emma: How was that?
[00:25] Participant 3: It felt good to be really listened to!
[00:26] Fellow Emma: Exactly! When someone truly listens to us, we feel valued. That's a key part of positive relationships.

[00:29] Fellow Emma: Now let's talk about boundaries. Boundaries are limits we set to protect our wellbeing. It's okay to say no sometimes.

[00:32] Participant 1: But what if saying no hurts someone's feelings?
[00:33] Fellow Emma: That's a common worry. But healthy relationships respect boundaries. If you always say yes when you want to say no, you'll end up resentful.

[00:36] Fellow Emma: Here's how to set a boundary kindly: "I appreciate you thinking of me, but I can't do that right now." You don't have to over-explain.

[00:39] Fellow Emma: Let's talk about conflict. Even in positive relationships, disagreements happen. The key is how you handle them.

[00:42] Fellow Emma: Use "I" statements instead of "you" statements. Instead of "You never listen to me," try "I feel unheard when I'm interrupted."

[00:45] Participant 2: That sounds less accusatory.
[00:46] Fellow Emma: Exactly! It expresses your feelings without attacking the other person.

[00:48] Fellow Emma: Finally, let's talk about toxic relationships - ones that drain you or make you feel bad about yourself. If a relationship consistently makes you feel worse, not better, it might be time to reconsider it.

[00:50] Fellow Emma: Your homework: practice active listening with someone this week, and think about your relationships. Which ones energize you? Which ones drain you? Thank you all!`,
    riskLevel: RiskLevel.SAFE,
  },
  {
    concept: 'Goal Setting',
    duration: 51,
    transcript: `[00:00] Fellow Michael: Good afternoon! Today we're going to learn about effective goal setting.

[00:02] Fellow Michael: Goals give us direction and motivation. But not all goals are created equal. Today I'll teach you the SMART goal framework.

[00:05] Fellow Michael: SMART stands for Specific, Measurable, Achievable, Relevant, and Time-bound. Let's break that down.

[00:08] Fellow Michael: Specific means clearly defined. Instead of "I want to do better in school," a specific goal is "I want to improve my math grade."

[00:11] Participant 1: What's measurable mean?
[00:12] Fellow Michael: It means you can track your progress. "Improve my math grade from a C to a B" is measurable. You'll know when you've achieved it.

[00:15] Fellow Michael: Achievable means realistic. If you're currently getting a D, aiming for an A+ next week might not be achievable. But aiming for a C is.

[00:18] Fellow Michael: Relevant means it matters to you. Don't set goals just because others think you should. Make sure it aligns with what YOU want.

[00:21] Fellow Michael: Time-bound means setting a deadline. "I want to improve my math grade to a B by the end of this semester."

[00:24] Fellow Michael: Let's practice. Everyone think of a goal you have. Now let's make it SMART.

[00:26] Participant 2: I want to be healthier.
[00:27] Fellow Michael: Good start! Let's make it SMART. What specifically would make you healthier?

[00:29] Participant 2: Um... maybe exercise more?
[00:30] Fellow Michael: Great! How much more? What kind of exercise?

[00:31] Participant 2: I want to go for a 20-minute walk three times a week.
[00:32] Fellow Michael: Perfect! That's specific and measurable. Is it achievable for you?

[00:33] Participant 2: Yes, I think so.
[00:34] Fellow Michael: Is it relevant to what you want?
[00:35] Participant 2: Yes, I want to feel more energetic.
[00:36] Fellow Michael: Great! Now add a timeframe. When will you start?

[00:37] Participant 2: I'll start this week and do it for the next month.
[00:38] Fellow Michael: Excellent! Now you have a SMART goal: "I will go for a 20-minute walk three times a week for the next month, starting this week."

[00:41] Fellow Michael: Now let's talk about breaking big goals into smaller steps. Big goals can feel overwhelming, but small steps are manageable.

[00:44] Participant 3: I want to get into university, but that feels so far away and big.
[00:45] Fellow Michael: Let's break it down. What do you need to do to get into university?

[00:47] Participant 3: Good grades, extracurriculars, application essays...
[00:48] Fellow Michael: Right! So instead of one huge goal, you have several smaller goals. What's one small step you can take this week toward that bigger goal?

[00:50] Participant 3: I could research universities I'm interested in.
[00:51] Fellow Michael: Perfect! That's manageable. Each week, take one small step. Before you know it, you'll have made significant progress.

[00:53] Fellow Michael: Remember, progress isn't always linear. You might have setbacks. That's normal! What matters is that you keep moving forward. Great work today everyone!`,
    riskLevel: RiskLevel.SAFE,
  },
  {
    concept: 'Mindfulness',
    duration: 47,
    transcript: `[00:00] Fellow Rachel: Hello everyone! Today's topic is mindfulness - being present in the moment.

[00:03] Fellow Rachel: Our minds are often in the past or future. We worry about what happened or what might happen. Mindfulness brings us back to now.

[00:06] Participant 1: Why is that important?
[00:07] Fellow Rachel: Because the present moment is the only one we can actually control. Plus, constantly worrying about past or future creates stress and anxiety.

[00:10] Fellow Rachel: Mindfulness has been shown to reduce anxiety, improve focus, and increase overall wellbeing. Let's try a simple mindfulness exercise.

[00:13] Fellow Rachel: Close your eyes. Notice your breath. Don't try to change it, just observe it. Is it fast or slow? Deep or shallow?

[00:16] [Group sits in silence]

[00:18] Fellow Rachel: Now notice sounds around you. Don't judge them as good or bad, just notice them.

[00:20] [More silence]

[00:22] Fellow Rachel: Now notice how your body feels. Are you comfortable? Tense anywhere? Just observe without trying to change anything.

[00:25] [Silence]

[00:27] Fellow Rachel: Take a deep breath and open your eyes when you're ready. How was that?

[00:29] Participant 2: My mind kept wandering.
[00:30] Fellow Rachel: That's completely normal! Mindfulness isn't about stopping thoughts. It's about noticing when your mind wanders and gently bringing it back. That's the practice.

[00:33] Fellow Rachel: Let's try a different type of mindfulness - mindful eating. I brought some raisins. Take one.

[00:35] Fellow Rachel: First, just look at it. Notice its color, texture, shape. Pretend you've never seen a raisin before.

[00:37] Fellow Rachel: Now smell it. What do you notice?

[00:38] Fellow Rachel: Now put it in your mouth but don't chew yet. Notice how it feels on your tongue.

[00:40] Fellow Rachel: Now slowly chew it. Notice the taste, the texture, how it changes as you chew.

[00:42] Participant 3: Wow, I've never paid that much attention to eating before!
[00:43] Fellow Rachel: Exactly! We usually eat mindlessly, barely tasting our food. Mindfulness helps us fully experience life.

[00:45] Fellow Rachel: You can practice mindfulness anytime - while walking, showering, even washing dishes. Just pay full attention to what you're doing.

[00:47] Fellow Rachel: Your homework is to practice 5 minutes of mindful breathing each day this week. Set a timer and just observe your breath. Notice when your mind wanders and gently bring it back. That's all! Thank you!`,
    riskLevel: RiskLevel.SAFE,
  },
  {
    concept: 'Emotional Intelligence',
    duration: 54,
    transcript: `[00:00] Fellow Alex: Welcome everyone! Today we're diving into emotional intelligence - the ability to understand and manage emotions.

[00:03] Fellow Alex: Emotional intelligence has four parts: self-awareness, self-management, social awareness, and relationship management.

[00:07] Fellow Alex: Self-awareness means recognizing your own emotions. It sounds simple, but many people struggle with this. Let's practice.

[00:10] Fellow Alex: Close your eyes and check in with yourself. How are you feeling right now? Try to name the specific emotion.

[00:13] Participant 1: I feel... nervous? Or maybe anxious?
[00:14] Fellow Alex: Good! You're distinguishing between similar emotions. That's self-awareness. Anyone else?

[00:16] Participant 2: I feel tired and a bit bored.
[00:17] Participant 3: I feel curious about what we're learning.

[00:18] Fellow Alex: Excellent! The more specific you can be about your emotions, the better you can manage them. That brings us to self-management.

[00:22] Fellow Alex: Self-management means controlling your emotional reactions. It doesn't mean suppressing emotions - it means expressing them appropriately.

[00:25] Fellow Alex: For example, if someone cuts in front of you in line, you might feel angry. Self-management means choosing not to yell at them, even though you feel angry.

[00:28] Participant 1: How do you do that when you're really upset?
[00:29] Fellow Alex: Great question! First, pause. Take a breath before reacting. Second, name the emotion - "I'm feeling angry." Third, choose your response.

[00:33] Fellow Alex: Let's practice with a scenario. Imagine you studied hard for a test but still failed. What emotions might you feel?

[00:35] Participant 2: Disappointed, frustrated, maybe embarrassed.
[00:36] Fellow Alex: Yes! Now, what would be an unhealthy way to manage those emotions?

[00:38] Participant 3: Giving up and not trying anymore?
[00:39] Fellow Alex: Exactly. What would be a healthy way?

[00:41] Participant 1: Talking to the teacher about what went wrong and making a plan to improve?
[00:42] Fellow Alex: Perfect! That's self-management.

[00:44] Fellow Alex: Now let's talk about social awareness - understanding others' emotions. This involves empathy and reading social cues.

[00:48] Fellow Alex: Practice this: when someone is talking to you, pay attention not just to their words, but to their tone, facial expressions, and body language.

[00:51] Fellow Alex: Finally, relationship management is using emotional intelligence to build strong relationships. It involves communication, conflict resolution, and teamwork.

[00:53] Fellow Alex: Your homework: practice identifying your emotions throughout the week. When you feel something, pause and name it specifically. That's the foundation of emotional intelligence!`,
    riskLevel: RiskLevel.SAFE,
  },
  {
    concept: 'Growth Mindset',
    duration: 45,
    transcript: `[00:00] Fellow Tom: Hi everyone, let's get started. Today we're talking about growth mindset.

[00:02] Participant 1: What's that?
[00:03] Fellow Tom: It's about believing you can improve through effort.

[00:05] Fellow Tom: So, um, there are two mindsets. Fixed and growth. Fixed is when you think you can't change. Growth is when you think you can get better.

[00:08] Participant 2: Okay...
[00:09] Fellow Tom: Yeah, so like, if you're bad at something, you can get better. That's growth mindset.

[00:12] Fellow Tom: Let me tell you about... um... there was this person who was bad at math but then got better.

[00:15] Participant 3: How did they get better?
[00:16] Fellow Tom: By practicing. Yeah, practice makes perfect.

[00:18] Fellow Tom: So, does anyone have something they're bad at?

[00:20] Participant 1: I'm bad at sports.
[00:21] Fellow Tom: Okay, so you should practice more.

[00:23] Participant 1: But I don't really like sports.
[00:24] Fellow Tom: Well, you should still try. That's growth mindset.

[00:26] Fellow Tom: Um, let's do an activity. Everyone write down something you want to get better at.

[00:28] [Long pause]

[00:30] Fellow Tom: Okay, who wants to share?

[00:32] Participant 2: I want to get better at making friends.
[00:33] Fellow Tom: Cool. Just talk to more people.

[00:35] Fellow Tom: So yeah, growth mindset is important. It helps you do better in school and stuff.

[00:38] Participant 3: Can you explain more about how to develop it?
[00:39] Fellow Tom: Just believe you can improve. That's basically it.

[00:41] Fellow Tom: Oh, and add "yet" to things. Like "I can't do this YET."

[00:43] Participant 1: Is there anything else we should know?
[00:44] Fellow Tom: Not really. Just remember that you can improve if you try. That's the main thing.

[00:45] Fellow Tom: Okay, I think that's all for today. See you next time!`,
    riskLevel: RiskLevel.SAFE,
  },
  {
    concept: 'Coping with Anxiety',
    duration: 58,
    transcript: `[00:00] Fellow Sophie: Welcome everyone. Today's session is about coping with anxiety, which I know many of you struggle with.

[00:03] Participant 1: I have anxiety all the time. It's really hard.
[00:04] Fellow Sophie: Thank you for sharing that. You're definitely not alone. Anxiety is one of the most common mental health challenges young people face.

[00:08] Fellow Sophie: First, let's understand what anxiety is. It's our body's alarm system. It's meant to protect us from danger. But sometimes, the alarm goes off when there's no real danger.

[00:12] Participant 2: Like when I have to give a presentation and my heart races?
[00:13] Fellow Sophie: Exactly! Your body thinks you're in danger, but you're actually safe. Today I'll teach you tools to turn down that alarm.

[00:17] Fellow Sophie: The first tool is the 5-4-3-2-1 grounding technique. When you feel anxious, name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.

[00:21] Fellow Sophie: This brings you back to the present moment. Anxiety is often about worrying about the future. Grounding reminds you that right now, in this moment, you're okay.

[00:25] Fellow Sophie: Let's try it together. Look around and name 5 things you see.

[00:27] Participant 3: I see the whiteboard, the chairs, the window, the door, and your shirt.
[00:28] Fellow Sophie: Good! Now 4 things you can touch?

[00:30] Participant 1: My chair, my pants, the table, my phone.
[00:31] Fellow Sophie: Perfect! You get the idea. Practice this whenever you feel anxiety rising.

[00:35] Fellow Sophie: The second tool is challenging anxious thoughts. Anxiety often involves catastrophic thinking - imagining the worst possible outcome.

[00:39] Fellow Sophie: For example, if you have to give a presentation, anxiety might say "Everyone will laugh at me and I'll fail the class and ruin my life."

[00:43] Participant 2: That's exactly what my brain does!
[00:44] Fellow Sophie: Right? So we challenge it. Ask yourself: Is this thought realistic? What's the evidence for and against it? What's the most likely outcome?

[00:48] Fellow Sophie: The most likely outcome is probably that you'll give the presentation, it'll be fine, and life will go on. Maybe not perfect, but not catastrophic either.

[00:52] Fellow Sophie: The third tool is breathing exercises. We've done this before, but it's especially important for anxiety. Let's do box breathing: in for 4, hold for 4, out for 4, hold for 4.

[00:55] [Group practices breathing]

[00:57] Fellow Sophie: The fourth tool is accepting uncertainty. Anxiety wants certainty, but life is uncertain. Practice saying "I don't know what will happen, and that's okay."

[01:00] Participant 3: That's hard for me. I always want to know everything will be okay.
[01:01] Fellow Sophie: I understand. But trying to control everything actually increases anxiety. Accepting uncertainty reduces it.

[01:05] Fellow Sophie: The fifth tool is self-care. When you're tired, hungry, or isolated, anxiety gets worse. Make sure you're taking care of your basic needs.

[01:08] Fellow Sophie: Finally, if your anxiety is severe or interfering with your daily life, please talk to a counselor or mental health professional. There's no shame in getting help.

[01:12] Participant 1: I've been thinking about that. I think my anxiety might be more than I can handle on my own.
[01:13] Fellow Sophie: I'm really glad you're recognizing that. That takes courage. I can help connect you with resources after our session today.

[01:15] Participant 1: Thank you. That would be helpful.
[01:16] Fellow Sophie: Of course. Remember everyone, anxiety is treatable. These tools work, but they take practice. Be patient with yourselves. Great work today!`,
    riskLevel: RiskLevel.SAFE,
  },
  {
    concept: 'Self-Worth and Identity',
    duration: 56,
    transcript: `[00:00] Fellow Kenya: Hello everyone! Today we're exploring self-worth and identity - understanding who you are and valuing yourself.

[00:03] Fellow Kenya: Many young people struggle with self-worth. We compare ourselves to others, especially on social media, and feel like we're not good enough.

[00:07] Participant 1: I do that all the time. Everyone else seems so perfect.
[00:08] Fellow Kenya: Thank you for that honesty. Here's the truth: social media shows highlight reels, not real life. Everyone struggles, even if they don't post about it.

[00:12] Fellow Kenya: Your worth isn't determined by likes, followers, grades, or achievements. You have inherent worth just because you exist.

[00:16] Participant 2: That's hard to believe sometimes.
[00:17] Fellow Kenya: I know. We live in a world that constantly tells us we need to earn our worth. But that's not true. Let me ask you this: does a baby have worth?

[00:21] Participant 3: Of course!
[00:22] Fellow Kenya: Why? A baby hasn't accomplished anything.
[00:23] Participant 3: Because... they're a person?
[00:24] Fellow Kenya: Exactly! Humans have inherent worth. That doesn't change as we grow up. You don't have to earn your worth.

[00:28] Fellow Kenya: Now let's talk about identity. Who you are is not just one thing. You're multifaceted - you have many roles, interests, and qualities.

[00:32] Fellow Kenya: Let's do an exercise. I want you to complete this sentence 10 different ways: "I am..."

[00:35] Participant 1: I am a student, a daughter, a friend, a sister, a reader, a dancer... um...
[00:37] Fellow Kenya: Keep going! You can include qualities too, not just roles.

[00:39] Participant 1: I am kind, I am creative, I am sometimes anxious, I am learning.
[00:40] Fellow Kenya: Beautiful! See how complex you are? You're not just one thing.

[00:43] Fellow Kenya: Sometimes we let one part of our identity define us completely. "I'm an athlete" or "I'm a good student." But what happens if you get injured or get a bad grade?

[00:47] Participant 2: You feel like you've lost everything?
[00:48] Fellow Kenya: Exactly. That's why it's important to have a multifaceted identity. You're many things, so if one area struggles, you still have others.

[00:52] Fellow Kenya: Let's talk about values - what matters to you. Your values are part of your identity. What do you care about?

[00:55] Participant 3: I care about helping people.
[00:56] Participant 1: I care about creativity and self-expression.
[00:57] Participant 2: I care about family and loyalty.

[00:58] Fellow Kenya: Those are your values. When you live according to your values, you feel authentic and fulfilled. When you go against them, you feel uncomfortable.

[01:02] Fellow Kenya: Here's an important point: you get to define your own identity. Not your parents, not your friends, not society. You.

[01:06] Participant 1: But what if who I want to be is different from what others expect?
[01:07] Fellow Kenya: That's hard, I won't lie. But living authentically, even when it's hard, is better than living a life that's not yours.

[01:10] Fellow Kenya: Your homework: write down your values, your strengths, and what makes you unique. Remind yourself of these when you're doubting your worth. You are valuable, exactly as you are!`,
    riskLevel: RiskLevel.SAFE,
  },
  // FLAGGED SESSION - Risk detected
  {
    concept: 'Coping with Depression',
    duration: 52,
    transcript: `[00:00] Fellow Marcus: Good afternoon everyone. Today we're talking about depression and coping strategies.

[00:03] Fellow Marcus: Depression is more than just feeling sad. It's a persistent feeling of emptiness, hopelessness, and loss of interest in things you used to enjoy.

[00:07] Participant 1: How do you know if you're depressed or just sad?
[00:08] Fellow Marcus: Good question. Sadness is usually temporary and tied to a specific event. Depression lasts for weeks or longer and affects your daily functioning.

[00:12] Fellow Marcus: Signs of depression include: persistent sadness, loss of energy, changes in sleep or appetite, difficulty concentrating, and feelings of worthlessness.

[00:16] Participant 2: I've been feeling really down lately. Like nothing matters.
[00:17] Fellow Marcus: Thank you for sharing that. That must be really difficult. Have you talked to anyone about these feelings?

[00:19] Participant 2: Not really. I don't want to burden anyone.
[00:20] Fellow Marcus: Your feelings are not a burden. Talking to someone - a counselor, trusted adult, or friend - is really important. Will you commit to talking to someone this week?

[00:23] Participant 2: I guess so.
[00:24] Fellow Marcus: I'm going to check in with you after our session, okay? Now, let's talk about coping strategies that can help.

[00:28] Fellow Marcus: The first strategy is behavioral activation. When you're depressed, you don't feel like doing anything. But staying inactive makes depression worse.

[00:32] Fellow Marcus: So even when you don't feel like it, do small activities. Get out of bed, take a shower, go for a short walk. Start tiny.

[00:36] Participant 3: What if you can't even do that?
[00:37] Fellow Marcus: Then start even smaller. Open the curtains. Sit up in bed. Any small action is progress.

[00:40] Fellow Marcus: The second strategy is challenging negative thoughts. Depression tells you lies: "I'm worthless," "Nothing will get better," "No one cares."

[00:44] Fellow Marcus: When you notice these thoughts, write them down. Then write evidence against them. It's hard, but it helps.

[00:48] Participant 2: I've been having really dark thoughts lately. Like... I sometimes think everyone would be better off without me.
[00:50] Fellow Marcus: Thank you for trusting us with that. Those thoughts are serious, and I'm concerned about you. Those are thoughts we need to address with professional help.

[00:53] Participant 2: I'm not going to do anything. I just... sometimes I think about it.
[00:55] Fellow Marcus: I understand, and I'm glad you're telling me. But thoughts of self-harm or suicide are a sign that you need more support than I can provide in this group setting.

[00:58] Fellow Marcus: After our session, I'm going to connect you with our counselor, okay? This is important.

[01:00] Participant 2: Okay.
[01:01] Fellow Marcus: For everyone here: if you ever have thoughts of harming yourself, please tell someone immediately. Call a crisis line, tell a parent, tell a teacher, tell me. Your life matters.

[01:05] Fellow Marcus: Depression is treatable. With the right support - therapy, sometimes medication, coping strategies - people recover. There is hope.

[01:09] Participant 3: What if you've tried to get help but nothing works?
[01:10] Fellow Marcus: Sometimes it takes time to find the right treatment. Don't give up. Keep trying different approaches until you find what works for you.

[01:13] Fellow Marcus: The third coping strategy is maintaining routine. Depression disrupts everything, but having structure helps. Set regular times for waking up, eating, and going to bed.

[01:17] Fellow Marcus: The fourth is social connection. Depression makes you want to isolate, but isolation makes it worse. Stay connected, even when it's hard.

[01:20] Fellow Marcus: The fifth is self-compassion. Be gentle with yourself. Depression is an illness, not a weakness or character flaw.

[01:23] Fellow Marcus: Remember: depression lies to you. It tells you things are hopeless, but they're not. Recovery is possible. Please reach out for help. Thank you all for being here today.`,
    riskLevel: RiskLevel.RISK,
    riskQuote:
      "I've been having really dark thoughts lately. Like... I sometimes think everyone would be better off without me.",
    riskReason:
      'Participant expressed thoughts of self-harm and suicidal ideation, indicating serious risk requiring immediate professional intervention.',
  },
  {
    concept: 'Healthy Boundaries',
    duration: 50,
    transcript: `[00:00] Fellow Nina: Hello everyone! Today's important topic is healthy boundaries.

[00:03] Fellow Nina: Boundaries are limits we set to protect our physical, emotional, and mental wellbeing. They're not walls - they're guidelines for how we want to be treated.

[00:08] Participant 1: Can you give an example?
[00:09] Fellow Nina: Sure! A boundary might be: "I don't lend money to friends" or "I need alone time after school to recharge" or "I don't respond to texts after 9pm."

[00:13] Fellow Nina: Boundaries are different for everyone. What's okay for one person might not be okay for another, and that's fine.

[00:17] Fellow Nina: There are different types of boundaries. Physical boundaries are about your body and personal space. Emotional boundaries are about your feelings. Time boundaries are about how you spend your time.

[00:22] Participant 2: I have trouble saying no to people. I always feel guilty.
[00:23] Fellow Nina: That's very common. Many people, especially young women, are taught that saying no is rude or selfish. But it's not. Saying no is taking care of yourself.

[00:27] Fellow Nina: Here's the thing: when you say yes but mean no, you end up resenting the other person. That damages the relationship more than if you'd just said no in the first place.

[00:31] Participant 3: But what if they get mad at me for saying no?
[00:32] Fellow Nina: If someone gets angry at you for setting a reasonable boundary, that tells you something about them, not about you. Healthy people respect boundaries.

[00:36] Fellow Nina: Let's practice saying no. I'll make a request, and you practice declining politely but firmly.

[00:38] Fellow Nina: "Can you do my homework for me?"
[00:39] Participant 1: "No, I can't do that, but I can help you understand the material."
[00:40] Fellow Nina: Perfect! You said no but offered an alternative. That's great.

[00:43] Fellow Nina: "Can I borrow money again? I know I haven't paid you back from last time."
[00:45] Participant 2: "I'm not comfortable lending money, but I hope you can figure it out."
[00:46] Fellow Nina: Excellent! You don't have to explain or justify. "I'm not comfortable with that" is a complete sentence.

[00:49] Fellow Nina: Now let's talk about recognizing when your boundaries are being violated. Signs include: feeling resentful, feeling taken advantage of, feeling exhausted by a relationship.

[00:53] Fellow Nina: If you notice these feelings, pause and ask yourself: what boundary do I need to set here?

[00:56] Participant 3: What if setting boundaries means losing friends?
[00:57] Fellow Nina: If someone only wants to be your friend when you have no boundaries, they're not a real friend. Real friends respect your limits.

[01:00] Fellow Nina: Your homework: identify one boundary you need to set this week and practice setting it. Start small. You're teaching people how to treat you. Thank you all!`,
    riskLevel: RiskLevel.SAFE,
  },
];

async function main() {
  console.log('Starting seed...');

  // create Fellows
  const fellows = await Promise.all([
    prisma.fellow.create({
      data: {
        name: 'Sarah Kamau',
        email: 'sarah.kamau@shamiri.co',
        age: 21,
      },
    }),
    prisma.fellow.create({
      data: {
        name: 'James Omondi',
        email: 'james.omondi@shamiri.co',
        age: 20,
      },
    }),
    prisma.fellow.create({
      data: {
        name: 'Maria Wanjiku',
        email: 'maria.wanjiku@shamiri.co',
        age: 22,
      },
    }),
    prisma.fellow.create({
      data: {
        name: 'David Kipchoge',
        email: 'david.kipchoge@shamiri.co',
        age: 19,
      },
    }),
    prisma.fellow.create({
      data: {
        name: 'Lisa Achieng',
        email: 'lisa.achieng@shamiri.co',
        age: 21,
      },
    }),
    prisma.fellow.create({
      data: {
        name: 'Emma Njeri',
        email: 'emma.njeri@shamiri.co',
        age: 20,
      },
    }),
    prisma.fellow.create({
      data: {
        name: 'Michael Mwangi',
        email: 'michael.mwangi@shamiri.co',
        age: 22,
      },
    }),
    prisma.fellow.create({
      data: {
        name: 'Rachel Adhiambo',
        email: 'rachel.adhiambo@shamiri.co',
        age: 21,
      },
    }),
    prisma.fellow.create({
      data: {
        name: 'Alex Kimani',
        email: 'alex.kimani@shamiri.co',
        age: 20,
      },
    }),
    prisma.fellow.create({
      data: {
        name: 'Tom Otieno',
        email: 'tom.otieno@shamiri.co',
        age: 19,
      },
    }),
    prisma.fellow.create({
      data: {
        name: 'Sophie Wambui',
        email: 'sophie.wambui@shamiri.co',
        age: 21,
      },
    }),
    prisma.fellow.create({
      data: {
        name: 'Kenya Mutua',
        email: 'kenya.mutua@shamiri.co',
        age: 22,
      },
    }),
    prisma.fellow.create({
      data: {
        name: 'Marcus Odhiambo',
        email: 'marcus.odhiambo@shamiri.co',
        age: 20,
      },
    }),
    prisma.fellow.create({
      data: {
        name: 'Nina Chebet',
        email: 'nina.chebet@shamiri.co',
        age: 21,
      },
    }),
  ]);

  // create sessions with transcripts
  const sessions = [];
  for (let i = 0; i < transcripts.length; i++) {
    const transcript = transcripts[i];
    const fellow = fellows[i % fellows.length];

    // status based on risk level
    let status: SessionStatus = SessionStatus.PROCESSED;
    if (transcript.riskLevel === RiskLevel.RISK) {
      status = SessionStatus.FLAGGED_FOR_REVIEW;
    }

    const session = await prisma.session.create({
      data: {
        groupId: `GRP-${String(i + 1).padStart(3, '0')}`,
        date: new Date(2026, 1, 16 - i), // recent dates
        transcript: transcript.transcript,
        duration: transcript.duration,
        concept: transcript.concept,
        status: status,
        fellowId: fellow.id,
      },
    });

    sessions.push(session);
  }

  console.log(`Created ${sessions.length} sessions`);

  // create AI Analysis for the RISK session
  // session with depression topic
  const riskSession = sessions.find(
    (s, i) => transcripts[i].riskLevel === RiskLevel.RISK,
  );

  if (riskSession) {
    const riskTranscript = transcripts.find(
      (t) => t.riskLevel === RiskLevel.RISK,
    );

    await prisma.analysis.create({
      data: {
        sessionId: riskSession.id,
        overallSummary:
          'Fellow Marcus conducted a session on coping with depression, demonstrating appropriate concern and professional boundaries. A participant disclosed suicidal ideation, which the Fellow handled correctly by expressing concern and committing to connect them with professional support.',
        contentCoverageScore: 3,
        contentCoverageJustification:
          'Fellow effectively taught depression coping strategies including behavioral activation, challenging negative thoughts, maintaining routine, social connection, and self-compassion. Content was comprehensive and evidence-based.',
        contentCoverageQuotes:
          '"Today we\'re talking about depression and coping strategies..."\n"Behavioral activation means doing small activities even when you don\'t feel like it..."\n"Depression tells you lies: I\'m worthless, Nothing will get better, No one cares."',
        facilitationQualityScore: 3,
        facilitationQualityJustification:
          'Fellow demonstrated excellent facilitation skills with warm, empathetic tone. Created safe space for vulnerable sharing and validated participant emotions. Used open-ended questions effectively.',
        facilitationQualityQuotes:
          '"Thank you for trusting us with that. Those thoughts are serious..."\n"Your feelings are not a burden..."\n"What do you think about these coping strategies?"',
        protocolSafetyScore: 3,
        protocolSafetyJustification:
          'Fellow demonstrated excellent protocol adherence by recognizing the limits of lay provider role and immediately committing to connect at-risk participant with professional counselor. Did not attempt to provide medical advice.',
        protocolSafetyQuotes:
          '"These thoughts are serious, and I\'m concerned about you. Those are thoughts we need to address with professional help..."\n"After our session, I\'m going to connect you with our counselor, okay?"',
        safetyFlag: false,
        riskLevel: RiskLevel.RISK,
        riskQuote: riskTranscript?.riskQuote || '',
        riskReason: riskTranscript?.riskReason || '',
        generatedAt: new Date(),
        modelUsed: 'gpt-5.1',
        processingTime: 3500,
      },
    });

    console.log('Created alysis with RISK flag for session on depression');
  }

  // create analyses for a few other sessions
  // SAFE risk level sesssions
  const sessionsToAnalyze = sessions
    .slice(0, 5)
    .filter((s) => s.id !== riskSession?.id);

  for (const session of sessionsToAnalyze) {
    const isPoorSession =
      session.concept === 'Growth Mindset' && session.duration === 45;

    await prisma.analysis.create({
      data: {
        sessionId: session.id,
        overallSummary: isPoorSession
          ? `Fellow delivered a basic session on ${session.concept} but lacked depth and engagement. Participants asked questions showing interest, but the Fellow's brief responses and superficial coverage limited learning. More thorough explanations and interactive activities are needed.`
          : `Fellow delivered a comprehensive session on ${session.concept}. Participants were engaged and demonstrated understanding through active participation. The Fellow used evidence-based techniques and created a safe, supportive environment for learning.`,
        contentCoverageScore: isPoorSession ? 2 : 3,
        contentCoverageJustification: isPoorSession
          ? 'Fellow mentioned growth mindset and added "yet" to statements, but explanations were superficial and rushed. Limited examples and no depth when participants asked for elaboration. Concept was introduced but not fully taught.'
          : `Fellow clearly explained ${session.concept} with relevant examples, checked for understanding, and ensured participants could apply the concept. Comprehensive coverage with practical applications.`,
        contentCoverageQuotes: isPoorSession
          ? '"Growth mindset is about believing you can improve through effort..."\n"Just add \'yet\' to things. Like I can\'t do this YET..."\n"That\'s basically it."'
          : `"Let me explain ${session.concept} clearly..."\n"Can anyone give me an example of this?"\n"How would you apply this in your own life?"`,
        facilitationQualityScore: isPoorSession ? 2 : 3,
        facilitationQualityJustification: isPoorSession
          ? 'Fellow was polite but somewhat transactional. Responses to participant questions were brief without deeper engagement. Followed a script without adapting to participant needs or expanding on topics.'
          : 'Fellow was warm and engaging, asked open-ended questions, validated participant contributions, and encouraged everyone to share. Created a safe, supportive environment for learning.',
        facilitationQualityQuotes: isPoorSession
          ? '"Okay..."\n"Yeah, so like, if you\'re bad at something, you can get better."\n"Does anyone have something they\'re bad at?"'
          : '"Thank you for sharing that!"\n"That\'s a great example. What made you think of that?"\n"How does everyone feel about what we\'ve discussed?"',
        protocolSafetyScore: 3,
        protocolSafetyJustification:
          'Fellow stayed focused on the assigned curriculum topic throughout the session. No medical advice, diagnoses, or unauthorized recommendations were made. Handled all discussions appropriately within the Shamiri protocol.',
        protocolSafetyQuotes: isPoorSession
          ? `"Today we\'re talking about ${session.concept}..."\n"Let\'s stick to what we\'re learning today."`
          : `"This is about ${session.concept}, which is part of our Shamiri curriculum..."\n"Remember, we\'re focusing on evidence-based strategies here."`,
        safetyFlag: false,
        riskLevel: RiskLevel.SAFE,
        riskQuote: null,
        riskReason: null,
        generatedAt: new Date(),
        modelUsed: 'gpt-5.1',
        processingTime: 2800,
      },
    });
  }

  console.log(`Created ${sessionsToAnalyze.length + 1} AI Analyses`);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
