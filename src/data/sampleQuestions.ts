import { QuestionType } from '../types';

/* ========== PRESENT TENSES ========== */
export const presentTensesQuestions: QuestionType[] = [
  {
    id: 'pt-1',
    text: 'He usually _ _ _ _ _ coffee in the morning.',
    options: ['drink', 'drinks', 'is drinking', 'has drunk'],
    correctAnswer: 'drinks',
    explanation: 'We Use Present Simple For Habits. With Third-Person Singular, We Add "-s" To The Verb.',
    hint: 'It Is A Daily Routine. He drinks coffee in the morning.',
    image: 'questions/presentTense/present_tense_question1_coffee_morning.png',
    alt: 'Una persona tomando café por la mañana'
  },
  {
    id: 'pt-2',
    text: 'Right now, I _____ for my keys.',
    options: ['look', 'am looking', 'have looked', 'looks'],
    correctAnswer: 'am looking',
    explanation: 'Present Continuous Describes Actions Happening At The Moment Of Speaking.',
    hint: 'The Action Is In Progress Now. I am looking for my keys.',
    image: '',
    alt: 'Una persona buscando sus llaves'
  },
  {
    id: 'pt-3',
    text: 'They _____ in London.',
    options: ['live', 'are living', 'have lived', 'lived'],
    correctAnswer: 'live',
    explanation: 'Present simple indicates a current fact or habitual situation: they currently live in London.',
    hint: 'Use the base form for a current state: They live in London.',
    image: 'questions/presentTense/present_tense_question3_london_city.png',
    alt: 'London city'
  },
  {
    id: 'pt-4',
    text: 'The birds _____ loudly.',
    options: ['sing', 'are singing', 'have sung', 'sings'],
    correctAnswer: 'sing',
    explanation: 'Present Simple indicates a habitual or general truth: the birds habitually sing loudly.',
    hint: 'Use the base form for a plural subject to express a habitual action: The birds sing loudly.',
    image: 'questions/presentTense/present_tense_question4_singing_birds.png',
    alt: 'Unos pájaros cantando'
  },
  {
    id: 'pt-5',
    text: 'Water _____ at 100 °C.',
    options: ['boils', 'is boiling', 'has boiled', 'boil'],
    correctAnswer: 'boils',
    explanation: 'We Use Present Simple For Scientific Facts And General Truths.',
    hint: 'General Truths Take Present Simple. Water boils at 100 °C.',
    image: 'questions/presentTense/present_tense_question5_boiling_water.png',
    alt: 'Agua hirviendo en una olla'
  },
  {
    id: 'pt-6',
    text: 'How often _____ you _____ to the gym?',
    options: ['do / go', 'are / going', 'have / gone', 'does / go'],
    correctAnswer: 'do / go',
    explanation: 'Present Simple + Auxiliary "Do" Is Used To Ask About Routines.',
    hint: 'Frequency Questions Use Do/Does + Base Verb. How often do you go?',
    image: 'questions/presentTense/present_tense_question6_gym_workout.png',
    alt: 'Un hombre haciendo ejercicio en el gimnasio'
  },
  {
    id: 'pt-7',
    text: 'I _____ English every Monday and Wednesday.',
    options: ['study', 'studies', 'am studying', 'have studied'],
    correctAnswer: 'study',
    explanation: 'Regular Schedules Take Present Simple.',
    hint: 'Routine On Fixed Days. I study English every Monday and Wednesday.',
    image: 'questions/presentTense/present_tense_question7_studying_english.png',
    alt: 'Un hombre estudiando inglés'
  },
  {
    id: 'pt-8',
    text: 'She _____ her homework already.',
    options: ['finishes', 'is finishing', 'has finished', 'finish'],
    correctAnswer: 'has finished',
    explanation: 'Present Perfect Shows A Recently Completed Action Relevant Now.',
    hint: 'Use Have/Has + Past Participle. She has finished her homework.',
    image: 'questions/presentTense/present_tense_question8_homework_done.png',
    alt: 'Un estudiante terminando su tarea'
  },
  {
    id: 'pt-9',
    text: 'The sun _____ in the east.',
    options: ['rise', 'rises', 'is rising', 'has risen'],
    correctAnswer: 'rises',
    explanation: 'Facts And Universal Truths Use Present Simple.',
    hint: 'General Truth. The sun rises in the east.',
    image: 'questions/presentTense/present_tense_question9_sunrise.png',
    alt: 'El sol saliendo en el horizonte'
  },
  {
    id: 'pt-10',
    text: 'Look! The children _____ in the park.',
    options: ['play', 'plays', 'are playing', 'have played'],
    correctAnswer: 'are playing',
    explanation: 'Present Continuous For An Action Happening Right Now.',
    hint: '"Look!" Signals Something In Progress. The children are playing.',
    image: '',
    alt: 'Unos niños jugando en el parque'
  },
];

/* ========== PAST TENSES ========== */
export const pastTensesQuestions: QuestionType[] = [
  {
    id: 'past-1',
    text: 'When I arrived at the party, everyone _____.',
    options: ['left', 'was leaving', 'had left', 'has left'],
    correctAnswer: 'had left',
    explanation: 'Past Perfect Describes An Earlier Past Action Completed Before Another Past Action.',
    hint: 'First They Left, Then I Arrived. Everyone had left.',
    image: 'questions/pastTense/past_tense_question1_empty_party.png',
    alt: 'Una fiesta vacía'
  },
  {
    id: 'past-2',
    text: 'While I _____ dinner, the phone rang.',
    options: ['cooked', 'was cooking', 'had cooked', 'have cooked'],
    correctAnswer: 'was cooking',
    explanation: 'Past Continuous For An Action In Progress Interrupted By A Past Simple Event.',
    hint: 'Cooking Was Ongoing. I was cooking when the phone rang.',
    image: 'questions/pastTense/past_tense_question2_cooking_phone.png',
    alt: 'Un hombre cocinando mientras el teléfono suena'
  },
  {
    id: 'past-3',
    text: 'I _____ soccer every Sunday when I was a child.',
    options: ['played', 'was playing', 'had played', 'have played'],
    correctAnswer: 'played',
    explanation: 'Past Simple For Repeated Actions In The Past.',
    hint: 'Childhood Habit → Past Simple. I played soccer every Sunday.',
    image: 'questions/pastTense/past_tense_question3_child_soccer.png',
    alt: 'Un niño jugando fútbol'
  },
  {
    id: 'past-4',
    text: 'After she _____ the letter, she felt relieved.',
    options: ['had written', 'wrote', 'was writing', 'has written'],
    correctAnswer: 'had written',
    explanation: 'Past Perfect Highlights The Earlier Past Action (Writing).',
    hint: 'First Write, Then Feel Relieved. She had written the letter.',
    image: 'questions/pastTense/past_tense_question4_writing_letter.png',
    alt: 'Una persona escribiendo una carta'
  },
  {
    id: 'past-5',
    text: 'They _____ TV when the lights went out.',
    options: ['watched', 'were watching', 'had watched', 'have watched'],
    correctAnswer: 'were watching',
    explanation: 'Past Continuous For An Ongoing Past Action Interrupted.',
    hint: 'Action In Progress → Past Continuous. They were watching TV.',
    image: 'watching_tv.png',
    alt: 'Unos adultos viendo televisión'
  },
  {
    id: 'past-6',
    text: 'By the time the movie started, we _____ our seats.',
    options: ['found', 'had found', 'were finding', 'have found'],
    correctAnswer: 'had found',
    explanation: 'Past Perfect Shows Completion Before Another Past Event.',
    hint: 'Seat Finding Happened Earlier. We had found our seats.',
    image: 'questions/pastTense/past_tense_question6_movie_seats.png',
    alt: 'Unos adultos buscando sus asientos en una sala de cine'
  },
  {
    id: 'past-7',
    text: 'He _____ in Berlin last year.',
    options: ['lived', 'was living', 'had lived', 'has lived'],
    correctAnswer: 'lived',
    explanation: 'Past Simple For A Finished Past Situation With A Specific Time ("Last Year").',
    hint: 'Specific Past Time → Past Simple. He lived in Berlin last year.',
    image: 'questions/pastTense/past_tense_question7_berlin_city.png',
    alt: 'Una ciudad con edificios y una torre'
  },
  {
    id: 'past-8',
    text: 'What _____ you _____ when I called?',
    options: ['did / do', 'were / doing', 'had / done', 'have / done'],
    correctAnswer: 'were / doing',
    explanation: 'Past Continuous Describes The Activity In Progress During The Interruption.',
    hint: 'Focus On Ongoing Action. What were you doing?',
    image: 'phone_call.png',
    alt: 'Un teléfono sonando'
  },
  {
    id: 'past-9',
    text: 'She was tired because she _____ all day.',
    options: ['worked', 'was working', 'had worked', 'has worked'],
    correctAnswer: 'had worked',
    explanation: 'Past Perfect Explains The Reason For A Past State.',
    hint: 'Work Finished Before Feeling Tired. She had worked all day.',
    image: 'questions/pastTense/past_tense_question9_tired_worker.png',
    alt: 'Un trabajador cansado'
  },
  {
    id: 'past-10',
    text: 'We _____ to the beach yesterday.',
    options: ['went', 'were going', 'had gone', 'have gone'],
    correctAnswer: 'went',
    explanation: 'Past Simple Is Used With Finished Time Adverbs Like "Yesterday".',
    hint: 'Completed Trip. We went to the beach yesterday.',
    image: 'beach_day.png',
    alt: 'Unos adultos en la playa'
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

/* ========== PREPOSITIONS ========== */
export const prepositionsQuestions: QuestionType[] = [
  {
    id: 'prep-1',
    text: 'We will meet _____ Monday.',
    options: ['in', 'on', 'at', 'by'],
    correctAnswer: 'on',
    explanation: 'Use "On" With Days Of The Week.',
    hint: 'Day Of The Week → on Monday.',
    image: 'questions/prepositions/calendar_monday.png',
    alt: 'Un calendario mostrando el lunes'
  },
  {
    id: 'prep-2',
    text: 'The cat is _____ the table.',
    options: ['on', 'under', 'between', 'behind'],
    correctAnswer: 'under',
    explanation: '"Under" Shows A Lower Position Directly Beneath Something.',
    hint: 'Below The Surface. The cat is under the table.',
    image: 'questions/prepositions/cat_under_table.png',
    alt: 'Un gato debajo de una mesa'
  },
  {
    id: 'prep-3',
    text: 'He was born _____ 1999.',
    options: ['in', 'on', 'at', 'to'],
    correctAnswer: 'in',
    explanation: 'Use "In" With Years, Months, Seasons.',
    hint: 'Year → in 1999.',
    image: 'questions/prepositions/birth_year.png',
    alt: 'Un hombre nacido en 1999'
  },
  {
    id: 'prep-4',
    text: 'Let\'s meet _____ noon.',
    options: ['in', 'on', 'at', 'by'],
    correctAnswer: 'at',
    explanation: 'Use "At" For Precise Times.',
    hint: 'Exact Clock Time → at noon.',
    image: 'questions/prepositions/clock_noon.png',
    alt: 'Un reloj mostrando la hora de la mañana'
  },
  {
    id: 'prep-5',
    text: 'She walked _____ the bridge.',
    options: ['over', 'across', 'through', 'behind'],
    correctAnswer: 'across',
    explanation: '"Across" Indicates Movement From One Side To The Other Side Of Something Flat.',
    hint: 'Side-To-Side Movement. She walked across the bridge.',
    image: 'questions/prepositions/walking_bridge.png',
    alt: 'Una persona caminando sobre un puente'
  },
  {
    id: 'prep-6',
    text: 'The library is _____ the bank and the post office.',
    options: ['between', 'among', 'behind', 'next'],
    correctAnswer: 'between',
    explanation: '"Between" Is Used With Two Distinct Points.',
    hint: 'Two Places → between A and B.',
    image: 'questions/prepositions/library_location.png',
    alt: 'Una biblioteca entre un banco y un despacho de correos'
  },
  {
    id: 'prep-7',
    text: 'We drove _____ the tunnel.',
    options: ['along', 'through', 'over', 'into'],
    correctAnswer: 'through',
    explanation: '"Through" Describes Movement Inside And Out The Other Side Of An Enclosed Space.',
    hint: 'Inside Then Out. Drove through the tunnel.',
    image: 'questions/prepositions/tunnel_drive.png',
    alt: 'Un coche pasando por un túnel'
  },
  {
    id: 'prep-8',
    text: 'There is a picture _____ the wall.',
    options: ['in', 'on', 'at', 'over'],
    correctAnswer: 'on',
    explanation: '"On" Is Used For Surfaces.',
    hint: 'Attached To A Vertical Surface → on the wall.',
    image: 'questions/prepositions/wall_picture.png',
    alt: 'Un cuadro colgado en la pared'
  },
  {
    id: 'prep-9',
    text: 'He arrived _____ the airport just in time.',
    options: ['to', 'in', 'at', 'on'],
    correctAnswer: 'at',
    explanation: 'Use "At" With Specific Public Places (Airport, Station).',
    hint: 'Specific Point → at the airport.',
    image: 'questions/prepositions/airport_arrival.png',
    alt: 'Un hombre llegando a un aeropuerto'
  },
  {
    id: 'prep-10',
    text: 'The kids are playing _____ the garden.',
    options: ['in', 'on', 'at', 'under'],
    correctAnswer: 'in',
    explanation: '"In" Indicates Being Inside A Three-Dimensional Space (Garden, Room, City).',
    hint: 'Enclosed Area → in the garden.',
    image: 'questions/prepositions/garden_play.png',
    alt: 'Unos niños jugando en el jardín'
  },
];

/* ========== ARTICLES ========== */
export const articlesQuestions: QuestionType[] = [
  {
    id: 'art-1',
    text: 'He is _____ engineer.',
    options: ['a', 'an', 'the', '—'],
    correctAnswer: 'an',
    explanation: 'Use "An" Before Vowel Sounds.',
    hint: 'Engineer Starts With A Vowel Sound. He is an engineer.',
    image: 'questions/articles/articles_question1_engineer.png',
    alt: 'Un hombre trabajando como ingeniero'
  },
  {
    id: 'art-2',
    text: 'Can you pass me _____ salt, please?',
    options: ['a', 'an', 'the', '—'],
    correctAnswer: 'the',
    explanation: 'Definite Article "The" For Something Both Speaker And Listener Know.',
    hint: 'Specific Salt On The Table → the salt.',
    image: 'questions/articles/articles_question2_salt_shaker.png',
    alt: 'Un shaker de sal'
  },
  {
    id: 'art-3',
    text: 'Paris is _____ capital of France.',
    options: ['a', 'an', 'the', '—'],
    correctAnswer: 'the',
    explanation: 'Use "The" With Unique Things (Only One).',
    hint: 'Only One Capital → the capital.',
    image: 'questions/articles/articles_question3_paris_city.png',
    alt: 'Paris city'
  },
  {
    id: 'art-4',
    text: 'I bought _____ new phone yesterday.',
    options: ['a', 'an', 'the', '—'],
    correctAnswer: 'a',
    explanation: 'Indefinite Article Introduces A Singular, Unspecified Item.',
    hint: 'First Mention. I bought a new phone.',
    image: 'questions/articles/articles_question4_new_phone.png',
    alt: 'Un teléfono nuevo'
  },
  {
    id: 'art-5',
    text: 'Mount Everest is _____ highest mountain in the world.',
    options: ['a', 'an', 'the', '—'],
    correctAnswer: 'the',
    explanation: 'Superlatives Always Take "The".',
    hint: '"Highest" = Superlative. the highest mountain.',
    image: 'questions/articles/articles_question5_mount_everest.png',
    alt: 'El monte Everest'
  },
  {
    id: 'art-6',
    text: 'She plays _____ piano very well.',
    options: ['a', 'an', 'the', '—'],
    correctAnswer: 'the',
    explanation: 'Musical Instruments Generally Use "The".',
    hint: 'Instrument Rule. She plays the piano.',
    image: 'questions/articles/articles_question6_piano_player.png',
    alt: 'Una persona tocando el piano'
  },
  {
    id: 'art-7',
    text: 'I usually have _____ coffee after lunch.',
    options: ['a', 'an', 'the', '—'],
    correctAnswer: '—',
    explanation: 'Uncountable Nouns Used Generally Take No Article.',
    hint: 'Coffee In General → No Article.',
    image: 'questions/articles/articles_question7_coffee.png',
    alt: 'Una taza de café'
  },
  {
    id: 'art-8',
    text: 'We visited _____ Netherlands last summer.',
    options: ['a', 'an', 'the', '—'],
    correctAnswer: 'the',
    explanation: 'Countries With Plural Names Take "The".',
    hint: 'Plural Country Name. the Netherlands.',
    image: 'questions/articles/articles_question8_netherlands.png',
    alt: 'Una ciudad con edificios y una torre'
  },
  {
    id: 'art-9',
    text: 'She looked at _____ sky full of stars.',
    options: ['a', 'an', 'the', '—'],
    correctAnswer: 'the',
    explanation: 'Context Makes "Sky" Specific → Use "The".',
    hint: 'Specific Object Overhead → the sky.',
    image: 'questions/articles/articles_question9_starry_sky.png',
    alt: 'Un cielo estrellado'
  },
  {
    id: 'art-10',
    text: 'He goes to _____ school near his house.',
    options: ['a', 'an', 'the', '—'],
    correctAnswer: '—',
    explanation: 'Institution Use ("Go To School") Takes Zero Article.',
    hint: 'Generic Purpose Of The Institution → No Article.',
    image: 'questions/articles/articles_question10_school.png',
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
    alt: 'Un área de fumadores'
  },
];
