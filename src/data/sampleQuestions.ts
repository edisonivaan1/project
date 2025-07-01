import { QuestionType } from '../types';

/* ========== PRESENT TENSES ========== */
export const presentTensesQuestions: QuestionType[] = [
  {
    id: 'pt-1',
    text: 'Ben _____ (work) in a hospital.',
    options: ['work', 'works', 'is work', 'is works'],
    correctAnswer: 'works',
    explanation: '"Ben" is a third-person singular subject (like "he"). In the simple present, we add "-s" to the verb "work."',
    hint: 'Is it "he" or "they"? Add "s" if it\'s "he", "she", or "it".',
    image: 'questions/presentTense/pt-1.png',
    alt: 'Una persona tomando café por la mañana',
    audio: '/src/assets/audio_questions/present_question1_audio.mp3'
  },
  {
    id: 'pt-2',
    text: '_____ you _____ (like) fish?',
    options: ['Do - like', 'Does - like', 'Do - likes', 'Does - likes'],
    correctAnswer: 'Do - like',
    explanation: 'To form a simple present question with "you," we use the auxiliary verb "do" before the subject. The main verb "like" remains in its base form.',
    hint: 'Is it a question about "you"? Use "do".',
    image: 'questions/presentTense/pt-2.png',
    alt: 'Una persona buscando sus llaves',
    audio: '/src/assets/audio_questions/present_question2_audio.mp3'
  },
  {
    id: 'pt-3',
    text: 'Matthew never _____ (watch) television.',
    options: ['watch', 'are watch', 'watches', 'is matches'],
    correctAnswer: 'watches',
    explanation: '"Matthew" is a third-person singular subject (like "he"). Verbs ending in -ch (like "watch") add "-es" in the simple present for third-person singular subjects.',
    hint: 'It\'s "he" and the verb ends in "ch". Add "es".',
    image: 'questions/presentTense/pt-3.png',
    alt: 'London city',
    audio: '/src/assets/audio_questions/present_question3_audio.mp3'
  },
  {
    id: 'pt-4',
    text: '______ she play football?',
    options: ['Done', 'Did', 'Do', 'Does'],
    correctAnswer: 'Does',
    explanation: 'To form a simple present question with "she," we use the auxiliary verb "does" before the subject. The main verb "play" remains in its base form.',
    hint: 'It\'s a question about "she". Use "does".',
    image: 'questions/presentTense/pt-4.png',
    alt: 'Unos pájaros cantando',
    audio: '/src/assets/audio_questions/present_question4_audio.mp3'
  },
  {
    id: 'pt-5',
    text: 'They always ______ (eat) dinner at 7 o\'clock.',
    options: ['eat', 'is eat', 'are eats', 'eats'],
    correctAnswer: 'boils',
    explanation: '"They" is a plural subject. For "I, you, we, they," the verb remains in its base form in the simple present.',
    hint: 'Is it "they" or "he"? Don\'t add "s" for "they".',
    image: 'questions/presentTense/pt-5.png',
    alt: 'Agua hirviendo en una olla',
    audio: '/src/assets/audio_questions/present_question5_audio.mp3'
  },
  {
    id: 'pt-6',
    text: 'Valerie ______ (study) English at university.',
    options: ['study', 'studies', 'is study', 'is studies'],
    correctAnswer: 'do / go',
    explanation: '"Valerie" is a third-person singular subject (like "she"). Verbs ending in a consonant + "y" (like "study") change "y" to "i" and add "-es" in the simple present for third-person singular.',
    hint: 'It\'s "she" and the verb ends in "y". Change "y" to "i" and add "es".',
    image: 'questions/presentTense/pt-6.png',
    alt: 'Un hombre haciendo ejercicio en el gimnasio',
    audio: '/src/assets/audio_questions/present_question6_audio.mp3'
  },
  {
    id: 'pt-7',
    text: 'I _____ English every Monday and Wednesday.',
    options: ['study', 'studies', 'am studying', 'have studied'],
    correctAnswer: 'study',
    explanation: 'Regular Schedules Take Present Simple.',
    hint: 'Routine On Fixed Days. I study English every Monday and Wednesday.',
    image: 'questions/presentTense/pt-7.png',
    alt: 'Un hombre estudiando inglés',
    audio: '/src/assets/audio_questions/present_question7_audio.mp3'
  },
  {
    id: 'pt-8',
    text: 'She _____(finish) her homework already.',
    options: ['finishes', 'is finishing', 'has finished', 'finish'],
    correctAnswer: 'has finished',
    explanation: 'Present Perfect Shows A Recently Completed Action Relevant Now.',
    hint: 'Use Have/Has + Past Participle. She has finished her homework.',
    image: 'questions/presentTense/pt-8.png',
    alt: 'Un estudiante terminando su tarea',
    audio: '/src/assets/audio_questions/present_question8_audio.mp3'
  },
  {
    id: 'pt-9',
    text: 'The sun _____(rise) in the east.',
    options: ['rise', 'rises', 'is rising', 'has risen'],
    correctAnswer: 'rises',
    explanation: 'Facts And Universal Truths Use Present Simple.',
    hint: 'General Truth. The sun rises in the east.',
    image: 'questions/presentTense/pt-9.png',
    alt: 'El sol saliendo en el horizonte',
    audio: '/src/assets/audio_questions/present_question9_audio.mp3'
  },
  {
    id: 'pt-10',
    text: 'Look! The children _____ in the park.',
    options: ['play', 'plays', 'are playing', 'have played'],
    correctAnswer: 'are playing',
    explanation: 'Present Continuous For An Action Happening Right Now.',
    hint: '"Look!" Signals Something In Progress. The children are playing.',
    image: 'questions/presentTense/pt-10.png',
    alt: 'Unos niños jugando en el parque',
    audio: '/src/assets/audio_questions/present_question10_audio.mp3'
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
    alt: 'Una fiesta vacía',
    audio: '/src/assets/audio_questions/past_question1_audio.mp3',
    isFillInTheBlank: true
  },
  {
    id: 'past-2',
    text: 'She (go / to the store) after she (finish / her work).',
    correctAnswer: 'She went to the store after she had finished her work.',
    explanation: 'The finishing of work happened before going to the store, so Past Perfect is used for the earlier action.',
    hint: 'What happened first of the two?',
    image: 'questions/pastTense/pat-2.png',
    alt: 'Un hombre cocinando mientras el teléfono suena',
    audio: '/src/assets/audio_questions/past_question2_audio.mp3',
    isFillInTheBlank: true
  },
  {
    id: 'past-3',
    text: '(Where / you / find / your keys) yesterday?',
    correctAnswer: 'Where did you find your keys yesterday?',
    explanation: 'Form a Simple Past question using "did" and the base form of the verb.',
    hint: 'Form a question about a past event.',
    image: 'questions/pastTense/pat-3.png',
    alt: 'Un niño jugando fútbol',
    isFillInTheBlank: true
  },
  {
    id: 'past-4',
    text: 'They (not / sleep) when I arrived, they were watching TV.',
    correctAnswer: 'They were not sleeping / weren\'t sleeping when I arrived, they were watching TV.',
    explanation: 'Form a negative in Past Continuous (was/were + not + -ing).',
    hint: 'Negate an ongoing past action.',
    image: 'questions/pastTense/pat-4.png',
    alt: 'Una persona escribiendo una carta',
    isFillInTheBlank: true
  },
  {
    id: 'past-5',
    text: 'He (take / a lot of photos) on his trip last month.',
    correctAnswer: 'He took a lot of photos on his trip last month.',
    explanation: '"Last month" indicates a completed action in the Simple Past. "Take" is an irregular verb.',
    hint: 'Completed action at a specific past time.',
    image: 'questions/pastTense/pat-5.png',
    alt: 'Unos adultos viendo televisión',
    isFillInTheBlank: true
  },
  {
    id: 'past-6',
    text: 'By the time I got to the cinema, the movie (already / start).',
    correctAnswer: 'By the time I got to the cinema, the movie had already started.',
    explanation: 'The movie starting happened before I got to the cinema, requiring Past Perfect.',
    hint: 'Something was finished before a past event.',
    image: 'questions/pastTense/pat-6.png',
    alt: 'Unos adultos buscando sus asientos en una sala de cine',
    isFillInTheBlank: true
  },
  {
    id: 'past-7',
    text: 'Yesterday morning, the birds (sing) and the sun (shine) beautifully.',
    correctAnswer: 'Yesterday morning, the birds were singing and the sun was shining beautifully.',
    explanation: 'Both actions were ongoing at that specific time in the past, setting the scene (Past Continuous).',
    hint: 'What was happening simultaneously?',
    image: 'questions/pastTense/pat-7.png',
    alt: 'Una ciudad con edificios y una torre',
    isFillInTheBlank: true
  },
  {
    id: 'past-8',
    text: 'She (not / finish / her homework) before dinner.',
    correctAnswer: 'She did not finish her homework before dinner.',
    explanation: 'Form a negative in Simple Past using "did not" and the base verb.',
    hint: 'A past action that didn\'t happen.',
    image: 'questions/pastTense/pat-8.png',
    alt: 'Un teléfono sonando',
    isFillInTheBlank: true
  },
  {
    id: 'past-9',
    text: '(What / you / do) at 8 PM last night?',
    correctAnswer: 'What were you doing at 8 PM last night?',
    explanation: 'Form a Past Continuous question to ask about an action in progress at a specific past moment.',
    hint: 'Ask about an action in progress at a past time.',
    image: 'questions/pastTense/pat-9.png',
    alt: 'Un trabajador cansado',
    isFillInTheBlank: true
  },
  {
    id: 'past-10',
    text: 'First, he (open / the door), and then he (enter / the room).',
    correctAnswer: 'First, he opened the door, and then he entered the room.',
    explanation: 'Both are completed actions happening one after the other in sequence.',
    hint: 'Events happening in order.',
    image: 'questions/pastTense/pat-10.png',
    alt: 'Unos adultos en la playa',
    isFillInTheBlank: true
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
    image: 'rainy_day.png',
    alt: 'Un día lluvioso'
  },
  {
    id: 'cond-2',
    text: 'If I _____ rich, I would travel around the world.',
    options: ['am', 'was', 'were', 'had been'],
    correctAnswer: 'were',
    explanation: 'Second Conditional Uses "Were" For All Persons In Hypothetical Present Situations.',
    hint: 'Imaginary Situation → If I were rich, I would travel.',
    image: 'world_travel.png',
    alt: 'Un hombre viajando alrededor del mundo'
  },
  {
    id: 'cond-3',
    text: 'If she had known the answer, she _____ me.',
    options: ['will tell', 'would tell', 'would have told', 'told'],
    correctAnswer: 'would have told',
    explanation: 'Third Conditional For Past Hypotheticals: If + Past Perfect → Would Have + PP.',
    hint: 'Regret About The Past. She would have told me.',
    image: 'thinking_person.png',
    alt: 'Una persona pensando'
  },
  {
    id: 'cond-4',
    text: 'If you study hard, you _____ the exam.',
    options: ['pass', 'will pass', 'would pass', 'would have passed'],
    correctAnswer: 'will pass',
    explanation: 'First Conditional Result Uses "Will" + Base Verb.',
    hint: 'Real Possibility. You will pass.',
    image: 'studying_exam.png',
    alt: 'Un estudiante estudiando para un examen'
  },
  {
    id: 'cond-5',
    text: 'I _____ the train if I had left earlier.',
    options: ['would catch', 'would have caught', 'caught', 'will catch'],
    correctAnswer: 'would have caught',
    explanation: 'Third Conditional Describes A Missed Past Possibility.',
    hint: 'Past Regret. I would have caught the train.',
    image: 'missed_train.png',
    alt: 'Un hombre perdiendo un tren'
  },
  {
    id: 'cond-6',
    text: 'If they _____ here now, we could start.',
    options: ['are', 'were', 'had been', 'will be'],
    correctAnswer: 'were',
    explanation: 'Second Conditional Uses Past Simple ("Were") For Hypothetical Present.',
    hint: 'They Are Not Here → Hypothetical. If they were here.',
    image: 'waiting_people.png',
    alt: 'Unos adultos esperando'
  },
  {
    id: 'cond-7',
    text: 'If water reaches 0 °C, it _____.',
    options: ['freezes', 'will freeze', 'would freeze', 'froze'],
    correctAnswer: 'freezes',
    explanation: 'Zero Conditional Expresses Scientific Facts: If + Present Simple → Present Simple.',
    hint: 'General Truth. It freezes.',
    image: 'ice_water.png',
    alt: 'Agua congelada'
  },
  {
    id: 'cond-8',
    text: 'What _____ you do if you lost your wallet?',
    options: ['will', 'would', 'did', 'had'],
    correctAnswer: 'would',
    explanation: 'Second Conditional Question Uses "Would" + Base Verb.',
    hint: 'Hypothetical Question. What would you do?',
    image: 'lost_wallet.png',
    alt: 'Una persona perdiendo su billetera'
  },
  {
    id: 'cond-9',
    text: 'If I _____ you, I wouldn\'t do that.',
    options: ['am', 'was', 'were', 'had been'],
    correctAnswer: 'were',
    explanation: 'Fixed Expression In Second Conditional: "If I Were You".',
    hint: 'Advice Formula → If I were you.',
    image: 'advice_giving.png',
    alt: 'Un hombre dando consejos'
  },
  {
    id: 'cond-10',
    text: 'You can stay with us, _____ you help with the chores.',
    options: ['if', 'unless', 'provided', 'in case'],
    correctAnswer: 'provided',
    explanation: '"Provided (That)" Introduces A Conditional Meaning "Only If".',
    hint: 'Conditional Word Synonym For "If". Provided you help.',
    image: 'house_chores.png',
    alt: 'Unos adultos ayudando en la casa'
  },
];

/* ========== PARTICIPLES AS ADJECTIVES ========== */
export const prepositionsQuestions: QuestionType[] = [
  {
    id: 'prep-1',
    text: 'That movie was incredibly ______. I couldn\'t stop watching it!',
    correctAnswer: 'boring',
    explanation: 'The movie is the source of the feeling, so it takes the -ing form.',
    hint: 'Does the movie feel something, or does it make you feel something?',
    image: 'questions/participles/movie_watching.png',
    alt: 'Una persona viendo una película',
    isDragAndDrop: true,
    dragOptions: ['bored', 'boring']
  },
  {
    id: 'prep-2',
    text: 'After working 10 hours, I felt completely ______.',
    correctAnswer: 'tired',
    explanation: 'The person experiences the feeling, so it takes the -ed form.',
    hint: 'How do you feel?',
    image: 'questions/participles/tired_worker.png',
    alt: 'Un trabajador cansado',
    isDragAndDrop: true,
    dragOptions: ['tiring', 'tired']
  },
  {
    id: 'prep-3',
    text: 'The dog barked loudly, which was very ______ to the neighbors. They were very ______.',
    correctAnswer: ['annoying', 'annoyed'],
    explanation: 'The barking causes annoyance (annoying). The neighbors feel annoyed (annoyed).',
    hint: 'What makes the noise, and who feels it?',
    image: 'questions/participles/dog_barking.png',
    alt: 'Un perro ladrando',
    isDragAndDrop: true,
    dragOptions: ['annoying', 'annoyed']
  },
  {
    id: 'prep-4',
    text: 'The rollercoaster ride was absolutely ______!',
    correctAnswer: 'exciting',
    explanation: 'The ride itself produces the feeling of excitement, so the -ing form is used.',
    hint: 'Is the ride feeling excited?',
    image: 'questions/participles/rollercoaster.png',
    alt: 'Una montaña rusa',
    isDragAndDrop: true,
    dragOptions: ['excited', 'exciting']
  },
  {
    id: 'prep-5',
    text: 'She was so ______ when she heard the news; she couldn\'t believe it.',
    correctAnswer: 'surprised',
    explanation: 'The person experienced the surprise from the news.',
    hint: 'How did she react?',
    image: 'questions/participles/surprised_person.png',
    alt: 'Una persona sorprendida',
    isDragAndDrop: true,
    dragOptions: ['surprising', 'surprised']
  },
  {
    id: 'prep-6',
    text: 'Learning a new language can be very ______, but it\'s also very ______.',
    correctAnswer: ['frustrating', 'rewarding'],
    explanation: 'The process of learning causes frustration (frustrating) and provides rewards (rewarding).',
    hint: 'What kind of experience is it, and what kind of results does it give?',
    image: 'questions/participles/language_learning.png',
    alt: 'Una persona aprendiendo idiomas',
    isDragAndDrop: true,
    dragOptions: ['frustrating', 'frustrated', 'rewarding', 'rewarded']
  },
  {
    id: 'prep-7',
    text: 'I find history books very ______.',
    correctAnswer: 'interesting',
    explanation: 'The books possess the quality that makes them interesting to read.',
    hint: 'Do the books feel interest?',
    image: 'questions/participles/history_books.png',
    alt: 'Libros de historia',
    isDragAndDrop: true,
    dragOptions: ['interested', 'interesting']
  },
  {
    id: 'prep-8',
    text: 'The sudden loud noise was quite ______, and the children felt very ______.',
    correctAnswer: ['alarming', 'alarmed'],
    explanation: 'The noise caused alarm (alarming), and the children felt alarm (alarmed).',
    hint: 'What was the nature of the noise, and how did they feel?',
    image: 'questions/participles/loud_noise.png',
    alt: 'Un ruido fuerte',
    isDragAndDrop: true,
    dragOptions: ['alarming', 'alarmed']
  },
  {
    id: 'prep-9',
    text: 'Climbing that mountain was the most ______ experience of my life. I was truly ______ by the view.',
    correctAnswer: ['amazing', 'amazed'],
    explanation: 'The experience caused amazement (amazing). The person felt amazement (amazed).',
    hint: 'What kind of experience is it, and how does it make you feel?',
    image: 'questions/participles/mountain_climbing.png',
    alt: 'Escalada de montaña',
    isDragAndDrop: true,
    dragOptions: ['amazing', 'amazed']
  },
  {
    id: 'prep-10',
    text: 'The exam results were very ______. The students were all ______.',
    correctAnswer: ['disappointing', 'disappointed'],
    explanation: 'The results caused disappointment (disappointing). The students felt disappointment (disappointed).',
    hint: 'What kind of results were they, and how did the students feel about them?',
    image: 'questions/participles/exam_results.png',
    alt: 'Resultados de examen',
    isDragAndDrop: true,
    dragOptions: ['disappointing', 'disappointed']
  },
];

/* ========== ARTICLES ========== */
export const articlesQuestions: QuestionType[] = [
  {
    id: 'art-1',
    text: 'I use my cell phone _____ messages.',
    options: ['to send', 'for send', 'to sending', 'for sending'],
    correctAnswer: 'to send',
    explanation: 'The infinitive "to send" clearly states the specific purpose for which the cell phone is used. The reason for using the phone is to perform the action of sending messages.',
    hint: 'Are you describing the specific action your phone helps you achieve, or the general activity it\'s designed for?',
    image: 'questions/gerundsInfinitives/gi-1.png',
    alt: 'Un hombre trabajando como ingeniero'
  },
  {
    id: 'art-2',
    text: 'Some рвople use their phones ______ videos',
    options: ['for watch', 'to watching', 'to watch', 'for watching'],
    correctAnswer: 'to watch',
    explanation: 'Similarly, "to watch" explains the intention or objective behind using their phones. They use the phones for the purpose of watching videos.',
    hint: 'Think about whether you\'re emphasizing the purposeful act they perform with the phone, or the function/activity the phone provides.',
    image: 'questions/gerundsInfinitives/gi-2.png',
    alt: 'Un shaker de sal'
  },
  {
    id: 'art-3',
    text: 'People often use their phones _____ photos.',
    options: ['to taking', 'for taking', 'for take', 'to take'],
    correctAnswer: 'to take',
    explanation: '"To take" indicates the direct purpose of using their phones. The phones are utilized for the action of taking photos.',
    hint: 'Is the emphasis on the action of capturing an image, or the role of the phone in the act of photography?',
    image: 'questions/gerundsInfinitives/gi-3.png',
    alt: 'Paris city'
  },
  {
    id: 'art-4',
    text: 'I went to the shop ____ some bread',
    options: ['to buying', 'for buy', 'to buy', 'for buying'],
    correctAnswer: 'to buy',
    explanation: '"To buy" explains the reason or purpose why I went to the shop. It answers the question "Why did I go to the shop?"',
    hint: 'What was the action I intended?',
    image: 'questions/gerundsInfinitives/gi-4.png',
    alt: 'Un teléfono nuevo'
  },
  {
    id: 'art-5',
    text: 'This machine is used ____ metal.',
    options: ['for cutting', 'for cut', 'to cut', 'to cutting'],
    correctAnswer: 'for cutting',
    explanation: '"For cutting" describes the function or general purpose of the machine. It tells us what the machine is designed for or used for as an activity.',
    hint: 'What is its main function?',
    image: 'questions/gerundsInfinitives/gi-5.png',
    alt: 'El monte Everest'
  },
  {
    id: 'art-6',
    text: 'She uses her computer _____ videos.',
    options: ['to edit', 'for edit', 'for editing', 'to editing'],
    correctAnswer: 'for editing',
    explanation: '"For editing" describes the activity or specific use that she puts her computer to. It\'s the purpose it serves for her.',
    hint: 'What activity does she do with it?',
    image: 'questions/gerundsInfinitives/gi-6.png',
    alt: 'Una persona tocando el piano'
  },
  {
    id: 'art-7',
    text: 'She bought a new oven ____ cakes.',
    options: ['to bake', 'to baking', 'for baking', 'for bake'],
    correctAnswer: 'to bake',
    explanation: '"To bake" expresses the specific purpose for which she purchased the oven. The oven\'s utility is directly linked to the action of baking cakes.',
    hint: 'Is she buying it so that she can perform an action, or for a general type of cooking?',
    image: 'questions/gerundsInfinitives/gi-7.png',
    alt: 'Una taza de café'
  },
  {
    id: 'art-8',
    text: 'He went to the library _____ for his exam.',
    options: ['for studying', 'for study', 'to studying', 'to study'],
    correctAnswer: 'to study',
    explanation: '"To study" indicates the reason why he went to the library. His purpose in going there was to perform the action of studying.',
    hint: 'What was the reason for his trip? Was it to do something specific, or for a general activity that happens there?',
    image: 'questions/gerundsInfinitives/gi-8.png',
    alt: 'Una ciudad con edificios y una torre'
  },
  {
    id: 'art-9',
    text: 'We use a map _____ our way.',
    options: ['to finding', 'to find', 'for find', 'for finding'],
    correctAnswer: 'to find',
    explanation: 'To find" explains the direct purpose of using a map. The map is used to achieve the action of finding the way.',
    hint: 'Consider if the map helps you achieve a particular outcome, or if its use is related to a broader activity.',
    image: 'questions/gerundsInfinitives/gi-9.png',
    alt: 'Un cielo estrellado'
  },
  {
    id: 'art-10',
    text: 'They wear helmets ____ their heads.',
    options: ['for protect', 'to protect', 'to protecting', 'for protecting'],
    correctAnswer: 'to protect',
    explanation: '"To protect" clearly states the intention or purpose behind wearing helmets. The helmets are worn for the action of protecting.',
    hint: 'Are they wearing them in order to perform a certain action, or for a defensive purpose?',
    image: 'questions/gerundsInfinitives/gi-10.png',
    alt: 'Un edificio de escuela'
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
    alt: 'Un niño nadando'
  },
  {
    id: 'mod-2',
    text: 'You _____ park here. It\'s forbidden.',
    options: ['can', 'could', 'mustn\'t', 'might'],
    correctAnswer: 'mustn\'t',
    explanation: '"Mustn\'t" Expresses Prohibition.',
    hint: 'Not Allowed At All. You mustn\'t park here.',
    image: 'questions/modalVerbs/modal_question2_no_parking.png',
    alt: 'Un letrero de no estacionar'
  },
  {
    id: 'mod-3',
    text: '_____ I open the window?',
    options: ['Must', 'Should', 'May', 'Have to'],
    correctAnswer: 'May',
    explanation: '"May" Or "Could" Are Polite Requests For Permission.',
    hint: 'Polite Permission. May I open the window?',
    image: 'questions/modalVerbs/modal_question3_window_open.png',
    alt: 'Una ventana abierta'
  },
  {
    id: 'mod-4',
    text: 'It _____ rain later, so take an umbrella.',
    options: ['can', 'must', 'might', 'should'],
    correctAnswer: 'might',
    explanation: '"Might" Expresses Weak Possibility.',
    hint: 'Uncertain Forecast → might rain.',
    image: 'questions/modalVerbs/modal_question4_rain_umbrella.png',
    alt: 'Un paraguas'
  },
  {
    id: 'mod-5',
    text: 'Students _____ submit the assignment by Friday.',
    options: ['should', 'could', 'might', 'would'],
    correctAnswer: 'should',
    explanation: '"Should" Gives Advice/Obligation That Is Not Strict.',
    hint: 'Strong Recommendation. Students should submit.',
    image: 'questions/modalVerbs/modal_question5_student_assignment.png',
    alt: 'Un estudiante entregando una tarea'
  },
  {
    id: 'mod-6',
    text: 'He _____ be at home; the lights are on.',
    options: ['can', 'must', 'could', 'may'],
    correctAnswer: 'must',
    explanation: '"Must" For Logical Deduction (High Certainty).',
    hint: 'Evidence-Based Conclusion. He must be at home.',
    image: 'questions/modalVerbs/modal_question6_house_lights.png',
    alt: 'Unas luces encendidas en una casa'
  },
  {
    id: 'mod-7',
    text: 'I _____ speak three languages.',
    options: ['can', 'must', 'should', 'might'],
    correctAnswer: 'can',
    explanation: '"Can" Shows Present Ability.',
    hint: 'Current Capability. I can speak three languages.',
    image: 'questions/modalVerbs/modal_question7_speak_languages.png',
    alt: 'Una persona hablando en tres idiomas'
  },
  {
    id: 'mod-8',
    text: 'We _____ leave early tomorrow; the boss insisted.',
    options: ['have to', 'could', 'may', 'might'],
    correctAnswer: 'have to',
    explanation: '"Have To" Expresses External Obligation.',
    hint: 'Outside Requirement. We have to leave early.',
    image: 'questions/modalVerbs/modal_question8_boss_meeting.png',
    alt: 'Unos jefes en una reunión'
  },
  {
    id: 'mod-9',
    text: 'You _____ see a doctor if the pain continues.',
    options: ['must', 'should', 'can', 'might'],
    correctAnswer: 'should',
    explanation: '"Should" Offers Advice.',
    hint: 'Recommendation → should see a doctor.',
    image: 'questions/modalVerbs/modal_question9_doctor_visit.png',
    alt: 'Un paciente visitando a un doctor'
  },
  {
    id: 'mod-10',
    text: 'Visitors _____ smoke in this area—it\'s allowed.',
    options: ['can', 'must', 'should', 'may not'],
    correctAnswer: 'can',
    explanation: '"Can" States General Permission.',
    hint: 'Allowed Action. Visitors can smoke here.',
    image: 'questions/modalVerbs/modal_question10_smoking_area.png',
    alt: 'Un área de fumadores',
    audio: 'src/assets/audio_questions/question1_audio.mpeg'
  },
];
