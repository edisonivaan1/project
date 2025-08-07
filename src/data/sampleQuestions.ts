import { QuestionType } from '../types';

/* ========== PRESENT TENSES ========== */
export const presentTensesQuestions: QuestionType[] = [
  {
    id: 'pt-1',
    text: 'Ben _____ in a hospital.',
    options: ['work', 'works', 'is work', 'is works'],
    correctAnswer: 'works',
    explanation: '"Ben" is a third-person singular subject (like "he"). In the simple present, we add "-s" to the verb "work."',
    hint: 'Is it "he" or "they"? Add "s" if it\'s "he", "she", or "it".',
    image: 'questions/presentTense/pt-1.png',
    alt: 'Ben, a doctor, works in a hospital. A doctor in a white coat in a hospital setting.',
    audio: '/assets/audio_questions/presentTense/question1_audio.mp3'
  },
  {
    id: 'pt-2',
    text: '_____ you _____ fish?',
    options: ['Do - like', 'Does - like', 'Do - likes', 'Does - likes'],
    correctAnswer: 'Do - like',
    explanation: 'To form a simple present question with "you," we use the auxiliary verb "do" before the subject. The main verb "like" remains in its base form.',
    hint: 'Is it a question about "you"? Use "do".',
    image: 'questions/presentTense/pt-2.png',
    alt: 'A girl eating fish, representing the question "Do you like fish?"',
    audio: '/assets/audio_questions/presentTense/question2_audio.mp3'
  },
  {
    id: 'pt-3',
    text: 'Matthew never _____ television.',
    options: ['watch', 'are watch', 'watches', 'is matches'],
    correctAnswer: 'watches',
    explanation: '"Matthew" is a third-person singular subject (like "he"). Verbs ending in -ch (like "watch") add "-es" in the simple present for third-person singular subjects.',
    hint: 'It\'s "he" and the verb ends in "ch". Add "es".',
    image: 'questions/presentTense/pt-3.png',
    alt: 'Matthew sitting and watching television, illustrating the action of watching TV.',
    audio: '/assets/audio_questions/presentTense/question3_audio.mp3'
  },
  {
    id: 'pt-4',
    text: '______ she play football?',
    options: ['Done', 'Did', 'Do', 'Does'],
    correctAnswer: 'Does',
    explanation: 'To form a simple present question with "she," we use the auxiliary verb "does" before the subject. The main verb "play" remains in its base form.',
    hint: 'It\'s a question about "she". Use "does".',
    image: 'questions/presentTense/pt-4.png',
    alt: 'A girl kicking a soccer ball, representing the question about playing football.',
    audio: '/assets/audio_questions/presentTense/question4_audio.mp3'
  },
  {
    id: 'pt-5',
    text: 'They always ______ dinner at 7 o\'clock.',
    options: ['eat', 'is eat', 'are eats', 'eats'],
    correctAnswer: 'eat',
    explanation: '"They" is a plural subject. For "I, you, we, they," the verb remains in its base form in the simple present.',
    hint: 'Is it "they" or "he"? Don\'t add "s" for "they".',
    image: 'questions/presentTense/pt-5.png',
    alt: 'Several people having dinner together at 7 o\'clock, showing a regular dinner routine.',
    audio: '/assets/audio_questions/presentTense/question5_audio.mp3'
  },
  {
    id: 'pt-6',
    text: 'Valerie ______ English at university.',
    options: ['study', 'studies', 'is study', 'is studies'],
    correctAnswer: 'studies',
    explanation: '"Valerie" is a third-person singular subject (like "she"). Verbs ending in a consonant + "y" (like "study") change "y" to "i" and add "-es" in the simple present for third-person singular.',
    hint: 'It\'s "she" and the verb ends in "y". Change "y" to "i" and add "es".',
    image: 'questions/presentTense/pt-6.png',
    alt: 'Valerie studying English at university, sitting with books and notes.',
    audio: '/assets/audio_questions/presentTense/question6_audio.mp3'
  },
  {
    id: 'pt-7',
    text: 'I _____ English every Monday and Wednesday.',
    options: ['study', 'studies', 'am studying', 'have studied'],
    correctAnswer: 'study',
    explanation: 'Regular Schedules Take Present Simple.',
    hint: 'Routine On Fixed Days. I study English every Monday and Wednesday.',
    image: 'questions/presentTense/pt-7.png',
    alt: 'A man studying English with books, representing a weekly study routine.',
    audio: '/assets/audio_questions/presentTense/question7_audio.mp3'
  },
  {
    id: 'pt-8',
    text: 'She _____ her homework already.',
    options: ['finishes', 'is finishing', 'has finished', 'finish'],
    correctAnswer: 'has finished',
    explanation: 'Present Perfect Shows A Recently Completed Action Relevant Now.',
    hint: 'Use Have/Has + Past Participle. She has finished her homework.',
    image: 'questions/presentTense/pt-8.png',
    alt: 'A student showing her completed homework, indicating she has already finished.',
    audio: '/assets/audio_questions/presentTense/question8_audio.mp3'
  },
  {
    id: 'pt-9',
    text: 'The sun _____ in the east.',
    options: ['rise', 'rises', 'is rising', 'has risen'],
    correctAnswer: 'rises',
    explanation: 'Facts And Universal Truths Use Present Simple.',
    hint: 'General Truth. The sun rises in the east.',
    image: 'questions/presentTense/pt-9.png',
    alt: 'The sun rising in the east over the horizon, representing a universal fact.',
    audio: '/assets/audio_questions/presentTense/question9_audio.mp3'
  },
  {
    id: 'pt-10',
    text: 'Look! The children _____ in the park.',
    options: ['play', 'plays', 'are playing', 'have played'],
    correctAnswer: 'are playing',
    explanation: 'Present Continuous For An Action Happening Right Now.',
    hint: '"Look!" Signals Something In Progress. The children are playing.',
    image: 'questions/presentTense/pt-10.png',
    alt: 'Several children actively playing in the park right now.',
    audio: '/assets/audio_questions/presentTense/question10_audio.mp3'
  },
];

/* ========== PAST TENSES ========== */
export const pastTensesQuestions: QuestionType[] = [
  {
    id: 'past-1',
    text: 'While I (read / a book), the phone suddenly (ring).',
    correctAnswer: 'While I was reading a book, the phone suddenly rang.',
    explanation: 'The first action was ongoing (Past Continuous), the second was a sudden interruption (Simple Past).',
    hint: 'Ongoing action interrupted.',
    image: 'questions/pastTense/pat-1.png',
    alt: 'A person reading a book at home when the phone suddenly rings.',
    isFillInTheBlank: true,
    audio: '/assets/audio_questions/past_question1_audio.mp3'
  },
  {
    id: 'past-2',
    text: 'She (go / to the store) after she (finish / her work).',
    correctAnswer: 'She went to the store after she had finished her work.',
    explanation: 'The finishing of work happened before going to the store, so Past Perfect is used for the earlier action.',
    hint: 'What happened first of the two?',
    image: 'questions/pastTense/pat-2.png',
    alt: 'A woman finishing her work at a desk and then going to the store.',
    isFillInTheBlank: true,
    audio: '/assets/audio_questions/past_question2_audio.mp3'
  },
  {
    id: 'past-3',
    text: 'I _____ soccer every Sunday when I was a child.',
    options: ['played', 'was playing', 'had played', 'have played'],
    correctAnswer: 'played',
    explanation: 'Past Simple For Repeated Actions In The Past.',
    hint: 'Childhood Habit → Past Simple. I played soccer every Sunday.',
    image: 'questions/pastTense/pat-3.png',
    alt: 'A child playing soccer on a field, representing a childhood habit.',
    isFillInTheBlank: true,
    audio: '/assets/audio_questions/past_question3_audio.mp3'
  },
  {
    id: 'past-4',
    text: 'After she _____ the letter, she felt relieved.',
    options: ['had written', 'wrote', 'was writing', 'has written'],
    correctAnswer: 'had written',
    explanation: 'Past Perfect Highlights The Earlier Past Action (Writing).',
    hint: 'First Write, Then Feel Relieved. She had written the letter.',
    image: 'questions/pastTense/pat-4.png',
    alt: 'A woman writing a letter and then showing relief.',
    isFillInTheBlank: true,
    audio: '/assets/audio_questions/past_question4_audio.mp3'
  },
  {
    id: 'past-5',
    text: 'They _____ TV when the lights went out.',
    options: ['watched', 'were watching', 'had watched', 'have watched'],
    correctAnswer: 'were watching',
    explanation: 'Past Continuous For An Ongoing Past Action Interrupted.',
    hint: 'Action In Progress → Past Continuous. They were watching TV.',
    image: 'questions/pastTense/pat-5.png',
    alt: 'Several people watching TV when the lights suddenly go out.',
    isFillInTheBlank: true,
    audio: '/assets/audio_questions/past_question5_audio.mp3'
  },
  {
    id: 'past-6',
    text: 'By the time the movie started, we _____ our seats.',
    options: ['found', 'had found', 'were finding', 'have found'],
    correctAnswer: 'had found',
    explanation: 'Past Perfect Shows Completion Before Another Past Event.',
    hint: 'Seat Finding Happened Earlier. We had found our seats.',
    image: 'questions/pastTense/pat-6.png',
    alt: 'A group of people finding and sitting in their seats in a movie theater before the movie starts.',
    isFillInTheBlank: true,
    audio: '/assets/audio_questions/past_question6_audio.mp3'
  },
  {
    id: 'past-7',
    text: 'He _____ in Berlin last year.',
    options: ['lived', 'was living', 'had lived', 'has lived'],
    correctAnswer: 'lived',
    explanation: 'Past Simple For A Finished Past Situation With A Specific Time ("Last Year").',
    hint: 'Specific Past Time → Past Simple. He lived in Berlin last year.',
    image: 'questions/pastTense/pat-7.png',
    alt: 'A man walking through the city of Berlin, with buildings and a recognizable tower.',
    isFillInTheBlank: true,
    audio: '/assets/audio_questions/past_question7_audio.mp3'
  },
  {
    id: 'past-8',
    text: 'What _____ you _____ when I called?',
    options: ['did / do', 'were / doing', 'had / done', 'have / done'],
    correctAnswer: 'were/doing',
    explanation: 'Past Continuous Describes The Activity In Progress During The Interruption.',
    hint: 'Focus On Ongoing Action. What were you doing?',
    image: 'questions/pastTense/pat-8.png',
    alt: 'A phone ringing while a person is doing another activity.',
    isFillInTheBlank: true,
    audio: '/assets/audio_questions/past_question8_audio.mp3'
  },
  {
    id: 'past-9',
    text: 'He was tired because he _____ all day.',
    options: ['worked', 'was working', 'had worked', 'has worked'],
    correctAnswer: 'had worked',
    explanation: 'Past Perfect Explains The Reason For A Past State.',
    hint: 'Work Finished Before Feeling Tired. He had worked all day.',
    image: 'questions/pastTense/pat-9.png',
    alt: 'A man exhausted sitting after working all day.',
    isFillInTheBlank: true,
    audio: '/assets/audio_questions/past_question9_audio.mp3'
  },
  {
    id: 'past-10',
    text: 'We _____ to the beach yesterday.',
    options: ['went', 'were going', 'had gone', 'have gone'],
    correctAnswer: 'went',
    explanation: 'Past Simple Is Used With Finished Time Adverbs Like "Yesterday".',
    hint: 'Completed Trip. We went to the beach yesterday.',
    image: 'questions/pastTense/pat-10.png',
    alt: 'A group of people enjoying at the beach during the day, representing a recent visit.',
    isFillInTheBlank: true,
    audio: '/assets/audio_questions/past_question10_audio.mp3'
  },
];

/* ========== CONDITIONALS ========== */
export const conditionalsQuestions: QuestionType[] = [
  {
    id: 'cond-1',
    text: 'If it _____ tomorrow, we will cancel the picnic.',
    options: ['will rain', 'rains', 'would rain', 'had rained'],
    correctAnswer: 'rains',
    explanation: 'First Conditional Uses Present Simple In The If-Clause And "Will" In The Result Clause.',
    hint: 'Possible Future Condition. If it rains, we will cancel.',
    image: 'questions/conditional/con_1.png',
    alt: 'A park with a picnic set up under dark clouds, suggesting it might rain tomorrow.',
    audio: '/assets/audio_questions/conditional/question1_audio.mp3'
  },
  {
    id: 'cond-2',
    text: 'If I _____ rich, I would travel around the world.',
    options: ['am', 'was', 'were', 'had been'],
    correctAnswer: 'were',
    explanation: 'Second Conditional Uses "Were" For All Persons In Hypothetical Present Situations.',
    hint: 'Imaginary Situation → If I were rich, I would travel.',
    image: 'questions/conditional/con_2.png',
    alt: 'A person imagining traveling around the world with suitcases and famous landmarks.',
    audio: '/assets/audio_questions/conditional/question2_audio.mp3'
  },
  {
    id: 'cond-3',
    text: 'If she had known the answer, she _____ me.',
    options: ['will tell', 'would tell', 'would have told', 'told'],
    correctAnswer: 'would have told',
    explanation: 'Third Conditional For Past Hypotheticals: If + Past Perfect → Would Have + PP.',
    hint: 'Regret About The Past. She would have told me.',
    image: 'questions/conditional/con_3.png',
    alt: 'A woman thinking and regretting not giving an answer in the past.',
    audio: '/assets/audio_questions/conditional/question3_audio.mp3'
  },
  {
    id: 'cond-4',
    text: 'If you study hard, you _____ the exam.',
    options: ['pass', 'will pass', 'would pass', 'would have passed'],
    correctAnswer: 'will pass',
    explanation: 'First Conditional Result Uses "Will" + Base Verb.',
    hint: 'Real Possibility. You will pass.',
    image: 'questions/conditional/con_4.png',
    alt: 'A student focused on studying for an exam with books and notes.',
    audio: '/assets/audio_questions/conditional/question4_audio.mp3'
  },
  {
    id: 'cond-5',
    text: 'I _____ the train if I had left earlier.',
    options: ['would catch', 'would have caught', 'caught', 'will catch'],
    correctAnswer: 'would have caught',
    explanation: 'Third Conditional Describes A Missed Past Possibility.',
    hint: 'Past Regret. I would have caught the train.',
    image: 'questions/conditional/con_5.png',
    alt: 'A man running toward a train that is leaving, showing he missed the train by leaving late.',
    audio: '/assets/audio_questions/conditional/question5_audio.mp3'
  },
  {
    id: 'cond-6',
    text: 'If they _____ here now, we could start.',
    options: ['are', 'were', 'had been', 'will be'],
    correctAnswer: 'were',
    explanation: 'Second Conditional Uses Past Simple ("Were") For Hypothetical Present.',
    hint: 'They Are Not Here → Hypothetical. If they were here.',
    image: 'questions/conditional/con_6.png',
    alt: 'A group of people waiting for others to arrive so they can start a meeting.',
    audio: '/assets/audio_questions/conditional/question6_audio.mp3'
  },
  {
    id: 'cond-7',
    text: 'If water reaches 0 °C, it _____.',
    options: ['freezes', 'will freeze', 'would freeze', 'froze'],
    correctAnswer: 'freezes',
    explanation: 'Zero Conditional Expresses Scientific Facts: If + Present Simple → Present Simple.',
    hint: 'General Truth. It freezes.',
    image: 'questions/conditional/con_7.png',
    alt: 'A glass of water freezing, illustrating the scientific fact that water freezes at 0 °C.',
    audio: '/assets/audio_questions/conditional/question7_audio.mp3'
  },
  {
    id: 'cond-8',
    text: 'What _____ you do if you lost your wallet?',
    options: ['will', 'would', 'did', 'had'],
    correctAnswer: 'would',
    explanation: 'Second Conditional Question Uses "Would" + Base Verb.',
    hint: 'Hypothetical Question. What would you do?',
    image: 'questions/conditional/con_8.png',
    alt: 'A person searching for a lost wallet on the street, representing a hypothetical situation.',
    audio: '/assets/audio_questions/conditional/question8_audio.mp3'
  },
  {
    id: 'cond-9',
    text: 'If I _____ you, I wouldn\'t do that.',
    options: ['am', 'was', 'were', 'had been'],
    correctAnswer: 'were',
    explanation: 'Fixed Expression In Second Conditional: "If I Were You".',
    hint: 'Advice Formula → If I were you.',
    image: 'questions/conditional/con_9.png',
    alt: 'A person giving advice to another, representing the phrase "If I were you".',
    audio: '/assets/audio_questions/conditional/question9_audio.mp3'
  },
  {
    id: 'cond-10',
    text: 'You can stay with us, _____ you help with the chores.',
    options: ['if', 'unless', 'provided', 'in case'],
    correctAnswer: 'provided',
    explanation: '"Provided (That)" Introduces A Conditional Meaning "Only If".',
    hint: 'Conditional Word Synonym For "If". Provided you help.',
    image: 'questions/conditional/con_10.png',
    alt: 'People doing household chores together, showing help at home as a condition.',
    audio: '/assets/audio_questions/conditional/question10_audio.mp3'
  },
];

/* ========== PARTICIPLES AS ADJECTIVES ========== */
export const prepositionsQuestions: QuestionType[] = [
  {
    id: 'prep-1',
    text: 'The adventure movie was so ______! After watching it, I felt really ______ to travel the world.',
    correctAnswer: ['exciting', 'inspired'],
    explanation: 'The movie creates excitement (exciting), and as a result, the person feels inspired (inspired).',
    hint: 'What quality does the movie have, and how does it make you feel afterwards?',
    image: 'questions/prepositions/pre_1.png',
    alt: 'A person watching an adventure movie in the cinema and then dreaming of traveling the world.',
    isDragAndDrop: true,
    dragOptions: ['exciting', 'excited', 'inspired', 'inspiring'],
    audio: '/assets/audio_questions/prepositions/question1_audio.mp3'
  },
  {
    id: 'prep-2',
    text: 'After working 10 hours, I felt completely ______.',
    correctAnswer: 'tired',
    explanation: 'The person experiences the feeling, so it takes the -ed form.',
    hint: 'How do you feel?',
    image: 'questions/prepositions/pre_2.png',
    alt: 'A person with an extremely tired expression after working 10 hours straight.',
    isDragAndDrop: true,
    dragOptions: ['tiring', 'tired'],
    audio: '/assets/audio_questions/prepositions/question2_audio.mp3'
  },
  {
    id: 'prep-3',
    text: 'The dog barked loudly, which was very ______ to the neighbors. They were very ______.',
    correctAnswer: ['annoying', 'annoyed'],
    explanation: 'The barking causes annoyance (annoying). The neighbors feel annoyed (annoyed).',
    hint: 'What makes the noise, and who feels it?',
    image: 'questions/prepositions/pre_3.png',
    alt: 'A dog barking loudly and neighbors showing annoyance at the noise.',
    isDragAndDrop: true,
    dragOptions: ['annoying', 'annoyed'],
    audio: '/assets/audio_questions/prepositions/question3_audio.mp3'
  },
  {
    id: 'prep-4',
    text: 'The rollercoaster ride was absolutely ______!',
    correctAnswer: 'exciting',
    explanation: 'The ride itself produces the feeling of excitement, so the -ing form is used.',
    hint: 'Is the ride feeling excited?',
    image: 'questions/prepositions/pre_4.png',
    alt: 'People screaming and raising their hands on a rollercoaster, showing excitement.',
    isDragAndDrop: true,
    dragOptions: ['excited', 'exciting'],
    audio: '/assets/audio_questions/prepositions/question4_audio.mp3'
  },
  {
    id: 'prep-5',
    text: 'She was so ______ when she heard the news; she couldn\'t believe it.',
    correctAnswer: 'surprised',
    explanation: 'The person experienced the surprise from the news.',
    hint: 'How did she react?',
    image: 'questions/prepositions/pre_5.png',
    alt: 'A woman with a surprised expression after receiving unexpected news.',
    isDragAndDrop: true,
    dragOptions: ['surprising', 'surprised'],
    audio: '/assets/audio_questions/prepositions/question5_audio.mp3'
  },
  {
    id: 'prep-6',
    text: 'Learning a new language can be very ______, but it\'s also very ______.',
    correctAnswer: ['frustrating', 'rewarding'],
    explanation: 'The process of learning causes frustration (frustrating) and provides rewards (rewarding).',
    hint: 'What kind of experience is it, and what kind of results does it give?',
    image: 'questions/prepositions/pre_6.png',
    alt: 'A person studying a language, showing frustration and then satisfaction from achievement.',
    isDragAndDrop: true,
    dragOptions: ['frustrating', 'frustrated', 'rewarding', 'rewarded'],
    audio: '/assets/audio_questions/prepositions/question6_audio.mp3'
  },
  {
    id: 'prep-7',
    text: 'I find history books very ______.',
    correctAnswer: 'interesting',
    explanation: 'The books possess the quality that makes them interesting to read.',
    hint: 'Do the books feel interest?',
    image: 'questions/prepositions/pre_7.png',
    alt: 'A person reading history books with attention and curiosity.',
    isDragAndDrop: true,
    dragOptions: ['interested', 'interesting'],
    audio: '/assets/audio_questions/prepositions/question7_audio.mp3'
  },
  {
    id: 'prep-8',
    text: 'The sudden loud noise was quite ______, and the children felt very ______.',
    correctAnswer: ['alarming', 'alarmed'],
    explanation: 'The noise caused alarm (alarming), and the children felt alarm (alarmed).',
    hint: 'What was the nature of the noise, and how did they feel?',
    image: 'questions/prepositions/pre_8.png',
    alt: 'A sudden loud noise startling several children in a room.',
    isDragAndDrop: true,
    dragOptions: ['alarming', 'alarmed'],
    audio: '/assets/audio_questions/prepositions/question8_audio.mp3'
  },
  {
    id: 'prep-9',
    text: 'Climbing that mountain was the most ______ experience of my life. I was truly ______ by the view.',
    correctAnswer: ['amazing', 'amazed'],
    explanation: 'The experience caused amazement (amazing). The person felt amazement (amazed).',
    hint: 'What kind of experience is it, and how does it make you feel?',
    image: 'questions/prepositions/pre_9.png',
    alt: 'A person at the top of a mountain, amazed by the panoramic view.',
    isDragAndDrop: true,
    dragOptions: ['amazing', 'amazed'],
    audio: '/assets/audio_questions/prepositions/question9_audio.mp3'
  },
  {
    id: 'prep-10',
    text: 'The exam results were very ______. The students were all ______.',
    correctAnswer: ['disappointing', 'disappointed'],
    explanation: 'The results caused disappointment (disappointing). The students felt disappointment (disappointed).',
    hint: 'What kind of results were they, and how did the students feel about them?',
    image: 'questions/prepositions/pre_10.png',
    alt: 'A group of students looking at their exam results with disappointed expressions.',
    isDragAndDrop: true,
    dragOptions: ['disappointing', 'disappointed'],
    audio: '/assets/audio_questions/prepositions/question10_audio.mp3'
  },
];

/* ========== GERUNDS AND INFINITIVES ========== */
export const articlesQuestions: QuestionType[] = [
  {
    id: 'art-1',
    text: 'I use my cell phone _____ messages.',
    options: ['to send', 'for send', 'to sending', 'for sending'],
    correctAnswer: 'to send',
    explanation: 'The infinitive "to send" clearly states the specific purpose for which the cell phone is used. The reason for using the phone is to perform the action of sending messages.',
    hint: 'Are you describing the specific action your phone helps you achieve, or the general activity it\'s designed for?',
    image: 'questions/gerundsInfinitives/gi-1.png',
    alt: 'A person using their cell phone to send text messages.',
    audio: '/assets/audio_questions/gerundsInfinitives/question1_audio.mp3'
  },
  {
    id: 'art-2',
    text: 'Some рeople use their phones ______ videos',
    options: ['for watch', 'to watching', 'to watch', 'for watching'],
    correctAnswer: 'to watch',
    explanation: 'Similarly, "to watch" explains the intention or objective behind using their phones. They use the phones for the purpose of watching videos.',
    hint: 'Think about whether you\'re emphasizing the purposeful act they perform with the phone, or the function/activity the phone provides.',
    image: 'questions/gerundsInfinitives/gi-2.png',
    alt: 'Several people watching videos on their mobile phones.',
    audio: '/assets/audio_questions/gerundsInfinitives/question2_audio.mp3'
  },
  {
    id: 'art-3',
    text: 'People often use their phones _____ photos.',
    options: ['to taking', 'for taking', 'for take', 'to take'],
    correctAnswer: 'to take',
    explanation: '"To take" indicates the direct purpose of using their phones. The phones are utilized for the action of taking photos.',
    hint: 'Is the emphasis on the action of capturing an image, or the role of the phone in the act of photography?',
    image: 'questions/gerundsInfinitives/gi-3.png',
    alt: 'A person taking a photo with their mobile phone.',
    audio: '/assets/audio_questions/gerundsInfinitives/question3_audio.mp3'
  },
  {
    id: 'art-4',
    text: 'I went to the shop ____ some bread',
    options: ['to buying', 'for buy', 'to buy', 'for buying'],
    correctAnswer: 'to buy',
    explanation: '"To buy" explains the reason or purpose why I went to the shop. It answers the question "Why did I go to the shop?"',
    hint: 'What was the action I intended?',
    image: 'questions/gerundsInfinitives/gi-4.png',
    alt: 'A person entering a shop to buy bread.',
    audio: '/assets/audio_questions/gerundsInfinitives/question4_audio.mp3'
  },
  {
    id: 'art-5',
    text: 'This machine is used ____ metal.',
    options: ['for cutting', 'for cut', 'to cut', 'to cutting'],
    correctAnswer: 'for cutting',
    explanation: '"For cutting" describes the function or general purpose of the machine. It tells us what the machine is designed for or used for as an activity.',
    hint: 'What is its main function?',
    image: 'questions/gerundsInfinitives/gi-5.png',
    alt: 'An industrial machine cutting metal in a factory.',
    audio: '/assets/audio_questions/gerundsInfinitives/question5_audio.mp3'
  },
  {
    id: 'art-6',
    text: 'She uses her computer _____ videos.',
    options: ['to edit', 'for edit', 'for editing', 'to editing'],
    correctAnswer: 'for editing',
    explanation: '"For editing" describes the activity or specific use that she puts her computer to. It\'s the purpose it serves for her.',
    hint: 'What activity does she do with it?',
    image: 'questions/gerundsInfinitives/gi-6.png',
    alt: 'A woman editing videos on her laptop computer.',
    audio: '/assets/audio_questions/gerundsInfinitives/question6_audio.mp3'
  },
  {
    id: 'art-7',
    text: 'She bought a new oven ____ cakes.',
    options: ['to bake', 'to baking', 'for baking', 'for bake'],
    correctAnswer: 'to bake',
    explanation: '"To bake" expresses the specific purpose for which she purchased the oven. The oven\'s utility is directly linked to the action of baking cakes.',
    hint: 'Is she buying it so that she can perform an action, or for a general type of cooking?',
    image: 'questions/gerundsInfinitives/gi-7.png',
    alt: 'A woman putting a cake into a new oven.',
    audio: '/assets/audio_questions/gerundsInfinitives/question7_audio.mp3' 
  },
  {
    id: 'art-8',
    text: 'He went to the library _____ for his exam.',
    options: ['for studying', 'for study', 'to studying', 'to study'],
    correctAnswer: 'to study',
    explanation: '"To study" indicates the reason why he went to the library. His purpose in going there was to perform the action of studying.',
    hint: 'What was the reason for his trip? Was it to do something specific, or for a general activity that happens there?',
    image: 'questions/gerundsInfinitives/gi-8.png',
    alt: 'A young man studying for an exam in the library, surrounded by books.',
    audio: '/assets/audio_questions/gerundsInfinitives/question8_audio.mp3'
  },
  {
    id: 'art-9',
    text: 'We use a map _____ our way.',
    options: ['to finding', 'to find', 'for find', 'for finding'],
    correctAnswer: 'to find',
    explanation: 'To find" explains the direct purpose of using a map. The map is used to achieve the action of finding the way.',
    hint: 'Consider if the map helps you achieve a particular outcome, or if its use is related to a broader activity.',
    image: 'questions/gerundsInfinitives/gi-9.png',
    alt: 'A group of people using a map to find the correct way.',
    audio: '/assets/audio_questions/gerundsInfinitives/question9_audio.mp3'
  },
  {
    id: 'art-10',
    text: 'They wear helmets ____ their heads.',
    options: ['for protect', 'to protect', 'to protecting', 'for protecting'],
    correctAnswer: 'to protect',
    explanation: '"To protect" clearly states the intention or purpose behind wearing helmets. The helmets are worn for the action of protecting.',
    hint: 'Are they wearing them in order to perform a certain action, or for a defensive purpose?',
    image: 'questions/gerundsInfinitives/gi-10.png',
    alt: 'Several people wearing helmets to protect their heads at a construction site or while cycling.',
    audio: '/assets/audio_questions/gerundsInfinitives/question10_audio.mp3'
  },
];

/* ========== MODAL VERBS ========== */
export const modalVerbsQuestions: QuestionType[] = [
  {
    id: 'mod-1',
    text: 'She _____ swim when she was five.',
    options: ['can', 'could', 'may', 'must'],
    correctAnswer: 'could',
    explanation: '"Could" Expresses Past Ability.',
    hint: 'Past Ability → could swim.',
    image: 'questions/modalVerbs/modal_question1_child_swimming.png',
    alt: 'A five-year-old girl swimming in a pool, showing past ability.',
    audio: '/assets/audio_questions/modalVerbs/question1_audio.mp3'
  },
  {
    id: 'mod-2',
    text: 'You _____ park here. It\'s forbidden.',
    options: ['can', 'could', 'mustn\'t', 'might'],
    correctAnswer: 'mustn\'t',
    explanation: '"Mustn\'t" Expresses Prohibition.',
    hint: 'Not Allowed At All. You mustn\'t park here.',
    image: 'questions/modalVerbs/modal_question2_no_parking.png',
    alt: 'A "No parking" sign on a street, indicating parking is forbidden.',
    audio: '/assets/audio_questions/modalVerbs/question2_audio.mp3'
  },
  {
    id: 'mod-3',
    text: '_____ I open the window?',
    options: ['Must', 'Should', 'May', 'Have to'],
    correctAnswer: 'May',
    explanation: '"May" Or "Could" Are Polite Requests For Permission.',
    hint: 'Polite Permission. May I open the window?',
    image: 'questions/modalVerbs/modal_question3_window_open.png',
    alt: 'A person asking for permission to open a window in a room.',
    audio: '/assets/audio_questions/modalVerbs/question3_audio.mp3'
  },
  {
    id: 'mod-4',
    text: 'It _____ rain later, so take an umbrella.',
    options: ['can', 'must', 'might', 'should'],
    correctAnswer: 'might',
    explanation: '"Might" Expresses Weak Possibility.',
    hint: 'Uncertain Forecast → might rain.',
    image: 'questions/modalVerbs/modal_question4_rain_umbrella.png',
    alt: 'An open umbrella under a cloudy sky, suggesting a possibility of rain.',
    audio: '/assets/audio_questions/modalVerbs/question4_audio.mp3'
  },
  {
    id: 'mod-5',
    text: 'Students _____ submit the assignment by Friday.',
    options: ['should', 'could', 'might', 'would'],
    correctAnswer: 'should',
    explanation: '"Should" Gives Advice/Obligation That Is Not Strict.',
    hint: 'Strong Recommendation. Students should submit.',
    image: 'questions/modalVerbs/modal_question5_student_assignment.png',
    alt: 'A student handing in an assignment before Friday, showing responsibility.',
    audio: '/assets/audio_questions/modalVerbs/question5_audio.mp3'
  },
  {
    id: 'mod-6',
    text: 'He _____ be at home; the lights are on.',
    options: ['can', 'must', 'could', 'may'],
    correctAnswer: 'must',
    explanation: '"Must" For Logical Deduction (High Certainty).',
    hint: 'Evidence-Based Conclusion. He must be at home.',
    image: 'questions/modalVerbs/modal_question6_house_lights.png',
    alt: 'A house with lights on, suggesting someone is at home.',
    audio: '/assets/audio_questions/modalVerbs/question6_audio.mp3'
  },
  {
    id: 'mod-7',
    text: 'I _____ speak three languages.',
    options: ['can', 'must', 'should', 'might'],
    correctAnswer: 'can',
    explanation: '"Can" Shows Present Ability.',
    hint: 'Current Capability. I can speak three languages.',
    image: 'questions/modalVerbs/modal_question7_speak_languages.png',
    alt: 'A person speaking in three different languages, representing language ability.',
    audio: '/assets/audio_questions/modalVerbs/question7_audio.mp3'
  },
  {
    id: 'mod-8',
    text: 'We _____ leave early tomorrow; the boss insisted.',
    options: ['have to', 'could', 'may', 'might'],
    correctAnswer: 'have to',
    explanation: '"Have To" Expresses External Obligation.',
    hint: 'Outside Requirement. We have to leave early.',
    image: 'questions/modalVerbs/modal_question8_boss_meeting.png',
    alt: 'A group of employees preparing to leave the office early as instructed by the boss.',
    audio: '/assets/audio_questions/modalVerbs/question8_audio.mp3'
  },
  {
    id: 'mod-9',
    text: 'You _____ see a doctor if the pain continues.',
    options: ['must', 'should', 'can', 'might'],
    correctAnswer: 'should',
    explanation: '"Should" Offers Advice.',
    hint: 'Recommendation → should see a doctor.',
    image: 'questions/modalVerbs/modal_question9_doctor_visit.png',
    alt: 'A patient consulting a doctor for persistent pain.',
    audio: '/assets/audio_questions/modalVerbs/question9_audio.mp3'
  },
  {
    id: 'mod-10',
    text: 'Visitors _____ smoke in this area—it\'s allowed.',
    options: ['can', 'must', 'should', 'may not'],
    correctAnswer: 'can',
    explanation: '"Can" States General Permission.',
    hint: 'Allowed Action. Visitors can smoke here.',
    image: 'questions/modalVerbs/modal_question10_smoking_area.png',
    alt: 'A designated smoking area with people smoking legally.',
    audio: '/assets/audio_questions/modalVerbs/question10_audio.mp3'
  },
];
