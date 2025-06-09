import { QuestionType } from '../types';

export const presentTensesQuestions: QuestionType[] = [
  {
    id: 'pt-1',
    text: 'She usually _ _ _ _ _ coffee in the morning.',
    options: ['drink', 'drinks', 'is drinking', 'has drunk'],
    correctAnswer: 'drinks',
    explanation: 'We Use Present Simple For Habits Or Routines. With Third Person Singular (She), We Add -s To The Verb.',
    hint: 'This Is A Habitual Action, So We Need The Present Simple Tense. Remember The Third Person Singular Rule. She drinks coffee in the morning.',
  },
  {
    id: 'pt-2',
    text: 'Look! The children _____ in the park.',
    options: ['play', 'plays', 'are playing', 'have played'],
    correctAnswer: 'are playing',
    explanation: 'We Use Present Continuous For Actions Happening Right Now. The Word "Look!" Indicates Something Happening At The Moment Of Speaking.',
    hint: 'This Is Happening Right Now As We Speak. Which Tense Do We Use For Actions In Progress? Look! The children are playing in the park.',
  },
  {
    id: 'pt-3',
    text: 'I _____ to Paris three times in my life.',
    options: ['go', 'went', 'am going', 'have been'],
    correctAnswer: 'have been',
    explanation: 'We Use Present Perfect For Experiences In Life Up To Now, Especially With Expressions Like "In My Life" Or "Ever".',
    hint: 'This Is About Life Experience, Connecting The Past To The Present. I Have Been To Paris Three Times In My Life.',
  },
];

export const pastTensesQuestions: QuestionType[] = [
  {
    id: 'past-1',
    text: 'When I arrived at the party, everyone _____.',
    options: ['left', 'was leaving', 'had left', 'has left'],
    correctAnswer: 'had left',
    explanation: 'We Use Past Perfect (Had + Past Participle) For Actions That Happened Before Another Past Action. First Everyone Left, Then I Arrived.',
    hint: 'Think About Which Action Happened First: My Arrival Or Everyone Leaving? I Arrived At The Party, And Everyone Had Left By The Time I Got There.',
  },
  {
    id: 'past-2',
    text: 'While I _____ dinner, the phone rang.',
    options: ['cooked', 'was cooking', 'had cooked', 'have cooked'],
    correctAnswer: 'was cooking',
    explanation: 'We Use Past Continuous (Was/Were + -ing) For Actions In Progress In The Past, Often Interrupted By Another Action In Past Simple. While I Was Cooking, The Phone Rang.',
    hint: 'The Cooking Was In Progress When The Phone Rang. Which Tense Shows An Action In Progress? While I Was Cooking, The Phone Rang.',
  },
];

export const conditionalsQuestions: QuestionType[] = [
  {
    id: 'cond-1',
    text: 'If it _____ tomorrow, we will cancel the picnic.',
    options: ['will rain', 'rains', 'would rain', 'had rained'],
    correctAnswer: 'rains',
    explanation: 'In First Conditional (For Possible Future Situations), We Use Present Simple In The If-Clause And Will + Infinitive In The Main Clause. If It Rains Tomorrow, We Will Cancel The Picnic.',
    hint: 'This Is A Possible Future Situation. In First Conditional, What Tense Do We Use After "If"? If It Rains Tomorrow, We Will Cancel The Picnic.',
  },
  {
    id: 'cond-2',
    text: 'If I _____ rich, I would travel around the world.',
    options: ['am', 'was', 'were', 'had been'],
    correctAnswer: 'were',
    explanation: 'In Second Conditional (For Hypothetical Present/Future Situations), We Use Past Simple In The If-Clause (Were For All Persons) And Would + Infinitive In The Main Clause. If I Were Rich, I Would Travel Around The World.',
    hint: 'This Is An Imaginary Situation In The Present. For Hypothetical Situations, Especially With "Be", We Use A Specific Form. If I Were Rich, I Would Travel Around The World.',
  },
];