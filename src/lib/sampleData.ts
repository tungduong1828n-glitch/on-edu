import { Subject as SubjectType, Unit as UnitType } from './types';

export const defaultSubjects: SubjectType[] = [
    {
        id: 'english',
        name: 'Tiếng Anh',
        description: 'Ôn tập ngữ pháp và bài tập tiếng Anh lớp 12',
        icon: 'languages',
        color: '#06b6d4',
        gradient: 'from-cyan-500 to-teal-600',
        order: 1,
        isActive: true,
    },
    {
        id: 'math',
        name: 'Toán Học',
        description: 'Ôn tập công thức và bài tập toán lớp 12',
        icon: 'calculator',
        color: '#10b981',
        gradient: 'from-emerald-500 to-green-600',
        order: 2,
        isActive: true,
    },
    {
        id: 'physics',
        name: 'Vật Lý',
        description: 'Ôn tập lý thuyết và bài tập vật lý lớp 12',
        icon: 'atom',
        color: '#f59e0b',
        gradient: 'from-amber-500 to-orange-600',
        order: 3,
        isActive: true,
    },
    {
        id: 'chemistry',
        name: 'Hóa Học',
        description: 'Ôn tập công thức và bài tập hóa học lớp 12',
        icon: 'flask-conical',
        color: '#ef4444',
        gradient: 'from-red-500 to-rose-600',
        order: 4,
        isActive: true,
    },
    {
        id: 'literature',
        name: 'Ngữ Văn',
        description: 'Ôn tập văn bản và kỹ năng làm văn lớp 12',
        icon: 'book-open',
        color: '#8b5cf6',
        gradient: 'from-violet-500 to-purple-600',
        order: 5,
        isActive: true,
    },
    {
        id: 'history',
        name: 'Lịch Sử',
        description: 'Ôn tập kiến thức lịch sử Việt Nam và thế giới',
        icon: 'landmark',
        color: '#ec4899',
        gradient: 'from-pink-500 to-rose-600',
        order: 6,
        isActive: true,
    },
];

export const sampleEnglishUnits: UnitType[] = [
    {
        id: 'unit-1',
        subjectId: 'english',
        title: 'UNIT 1: LIFE STORIES',
        description: 'Thì Quá khứ tiếp diễn, Mệnh đề trạng ngữ chỉ cách thức',
        order: 1,
        isActive: true,
        lessons: [
            {
                id: 'past-continuous',
                title: 'Thì Quá khứ tiếp diễn (The Past Continuous)',
                theory: {
                    sections: [
                        {
                            id: 'formula',
                            title: 'Công thức',
                            type: 'formula',
                            content: '',
                            items: [
                                'Khẳng định: S + was/were + V-ing',
                                'Phủ định: S + wasn\'t/weren\'t + V-ing',
                                'Nghi vấn: (Wh-) + Was/Were + S + V-ing?'
                            ]
                        },
                        {
                            id: 'usage',
                            title: 'Cách dùng',
                            type: 'usage',
                            content: '',
                            items: [
                                'Diễn tả một hành động đang diễn ra tại một thời điểm cụ thể trong quá khứ.',
                                'Diễn tả một hành động đang diễn ra (dùng Quá khứ tiếp diễn) thì có hành động khác xen vào (dùng Quá khứ đơn).',
                                'Diễn tả hai hay nhiều hành động xảy ra song song cùng lúc trong quá khứ.',
                                'Diễn tả một hành động kéo dài liên tục trong một khoảng thời gian trong quá khứ.'
                            ]
                        },
                        {
                            id: 'note',
                            title: 'Lưu ý với While và When',
                            type: 'note',
                            content: '',
                            items: [
                                'While: Thường dùng cho hành động đang diễn ra (kéo dài).',
                                'When: Thường dùng cho hành động xen vào (ngắn).'
                            ]
                        }
                    ]
                },
                exercises: [
                    {
                        id: 'ex-fill-1',
                        type: 'fill-blank',
                        instruction: 'Điền vào chỗ trống với thì Quá khứ tiếp diễn hoặc Quá khứ đơn.',
                        questions: [
                            {
                                id: 'q1',
                                text: 'Our class ______ (visit) the zoo last week when a funny thing ______ (happen).',
                                blanks: ['was visiting', 'happened'],
                                answer: ['was visiting', 'happened'],
                                explanation: 'Hành động đang diễn ra (was visiting) bị xen vào bởi hành động ngắn (happened).'
                            },
                            {
                                id: 'q2',
                                text: 'At about 9:30 a.m. that day, we ______ (look) at the gorillas.',
                                blanks: ['were looking'],
                                answer: ['were looking'],
                                explanation: 'Hành động đang diễn ra tại thời điểm cụ thể (9:30 a.m.).'
                            },
                            {
                                id: 'q3',
                                text: 'We ______ (take) photos when someone saw a snake on the floor.',
                                blanks: ['were taking'],
                                answer: ['were taking'],
                                explanation: 'Hành động đang diễn ra (were taking) bị xen vào bởi hành động ngắn (saw).'
                            },
                            {
                                id: 'q4',
                                text: 'While I ______ (get) ready at home that morning, my pet snake ______ (fall) into my school bag.',
                                blanks: ['was getting', 'fell'],
                                answer: ['was getting', 'fell'],
                                explanation: 'While đi cùng hành động kéo dài (was getting), hành động xen vào dùng QKĐ (fell).'
                            },
                            {
                                id: 'q5',
                                text: 'At the zoo, it ______ (get) out of my bag. I ______ (pick) up my snake and calmly put it back.',
                                blanks: ['got', 'picked'],
                                answer: ['got', 'picked'],
                                explanation: 'Hai hành động xảy ra liên tiếp trong quá khứ, dùng QKĐ.'
                            },
                            {
                                id: 'q6',
                                text: 'While my teacher ______ (call) the zookeepers for help, my classmates ______ (take) selfies with me.',
                                blanks: ['was calling', 'were taking'],
                                answer: ['was calling', 'were taking'],
                                explanation: 'Hai hành động song song xảy ra cùng lúc, đều dùng Quá khứ tiếp diễn.'
                            }
                        ]
                    },
                    {
                        id: 'ex-combine-1',
                        type: 'rewrite',
                        instruction: 'Nối câu sử dụng từ trong ngoặc.',
                        questions: [
                            {
                                id: 'q1',
                                text: 'She was traveling in Australia. She saw lots of exciting places. (while)',
                                answer: 'While she was traveling in Australia, she saw lots of exciting places.',
                                explanation: 'Dùng While cho hành động đang diễn ra.'
                            },
                            {
                                id: 'q2',
                                text: 'I took a photo of my sister. She was swimming in the ocean. (when)',
                                answer: 'When my sister was swimming in the ocean, I took a photo of her.',
                                explanation: 'Dùng When với hành động xen vào.'
                            },
                            {
                                id: 'q3',
                                text: 'He was studying in university. He was working in a restaurant. (while)',
                                answer: 'While he was studying in university, he was working in a restaurant.',
                                explanation: 'Hai hành động song song, dùng While.'
                            },
                            {
                                id: 'q4',
                                text: 'He started to feel depressed about his exam results while he was cycling home. (when)',
                                answer: 'When he was cycling home, he started to feel depressed about his exam results.',
                                explanation: 'Dùng When để nối hành động xen vào.'
                            },
                            {
                                id: 'q5',
                                text: 'The adults were chatting about the news. All the children were playing. (while)',
                                answer: 'While the adults were chatting about the news, all the children were playing.',
                                explanation: 'Hai hành động song song, dùng While.'
                            }
                        ]
                    }
                ]
            },
            {
                id: 'adverbial-clauses',
                title: 'Mệnh đề trạng ngữ chỉ cách thức (Adverbial clauses of manner)',
                theory: {
                    sections: [
                        {
                            id: 'intro',
                            title: 'Từ nối',
                            type: 'text',
                            content: 'like, as if, as though (như thể là, cứ như là).',
                            items: []
                        },
                        {
                            id: 'usage',
                            title: 'Cách dùng',
                            type: 'usage',
                            content: 'Dùng để mô tả cách ai đó làm việc gì, thường đi sau các động từ chỉ giác quan (look, sound, feel).',
                            items: [
                                'Cấu trúc: Mệnh đề chính + like / as if / as though + Mệnh đề phụ.'
                            ]
                        },
                        {
                            id: 'rule',
                            title: 'Quy tắc "Lùi thì"',
                            type: 'note',
                            content: '',
                            items: [
                                'Tình huống có thật: Dùng thì hiện tại nếu sự việc có khả năng là thật. VD: She looks as if she is a millionaire.',
                                'Tình huống không có thật (Giả định): Dùng thì quá khứ (Past Simple) để nói về hiện tại. VD: He acts as if he were an old man.',
                                'Lưu ý: Với động từ to be trong câu giả định, dùng "were" cho tất cả các ngôi.'
                            ]
                        }
                    ]
                },
                exercises: [
                    {
                        id: 'ex-tick',
                        type: 'select',
                        instruction: 'Chọn câu đúng ngữ pháp.',
                        questions: [
                            { id: 'q1', text: 'She acted as if it was the end of the world.', options: ['Đúng', 'Sai'], answer: 'Đúng' },
                            { id: 'q2', text: 'I was so nervous that I felt as though I couldn\'t breathe.', options: ['Đúng', 'Sai'], answer: 'Đúng' },
                            { id: 'q3', text: 'He smelled as if a wet dog.', options: ['Đúng', 'Sai'], answer: 'Sai', explanation: 'Thiếu động từ sau as if. Đúng là: He smelled as if he were a wet dog.' },
                            { id: 'q4', text: 'They felt like they were on cloud nine when they passed their tests.', options: ['Đúng', 'Sai'], answer: 'Đúng' },
                            { id: 'q5', text: 'He seemed like bent out of shape.', options: ['Đúng', 'Sai'], answer: 'Sai', explanation: 'Thiếu mệnh đề. Đúng là: He seemed like he was bent out of shape.' },
                            { id: 'q6', text: 'Before the game, I felt as though a worried parent.', options: ['Đúng', 'Sai'], answer: 'Sai', explanation: 'Thiếu mệnh đề. Đúng là: I felt as though I were a worried parent.' },
                            { id: 'q7', text: 'It seemed as though the typhoon would never come to an end.', options: ['Đúng', 'Sai'], answer: 'Đúng' },
                            { id: 'q8', text: 'When they gave me my results, I felt like I was going to cry.', options: ['Đúng', 'Sai'], answer: 'Đúng' }
                        ]
                    },
                    {
                        id: 'ex-rewrite',
                        type: 'rewrite',
                        instruction: 'Viết lại câu thay thế tính từ/trạng từ bằng từ gợi ý.',
                        questions: [
                            {
                                id: 'q1',
                                text: 'She looked nervous. (as though/butterflies/in/stomach)',
                                answer: 'She looked as though she had butterflies in her stomach.',
                                explanation: 'Dùng as though + mệnh đề để mô tả.'
                            },
                            {
                                id: 'q2',
                                text: 'I felt fast. (like/be/fastest student/at school)',
                                answer: 'I felt like I was the fastest student at school.',
                                explanation: 'Dùng like + mệnh đề.'
                            },
                            {
                                id: 'q3',
                                text: 'He studied hard. (as if/life/depend/on it)',
                                answer: 'He studied as if his life depended on it.',
                                explanation: 'Dùng as if + mệnh đề với động từ ở quá khứ.'
                            },
                            {
                                id: 'q4',
                                text: 'They act really smart. (as though/they/be/experts)',
                                answer: 'They act as though they were experts.',
                                explanation: 'Giả định, dùng were cho tất cả ngôi.'
                            },
                            {
                                id: 'q5',
                                text: 'He looks scared. (as if/see/a ghost)',
                                answer: 'He looks as if he had seen a ghost.',
                                explanation: 'Dùng as if + past perfect để chỉ hành động trước đó.'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'unit-2',
        subjectId: 'english',
        title: 'UNIT 2: OUT INTO THE WORLD',
        description: 'Liên từ chỉ thời gian + Danh động từ, Câu hỏi gián tiếp lịch sự',
        order: 2,
        isActive: true,
        lessons: [
            {
                id: 'conjunctions-gerunds',
                title: 'Liên từ chỉ thời gian + Danh động từ',
                theory: {
                    sections: [
                        {
                            id: 'rule',
                            title: 'Quy tắc',
                            type: 'text',
                            content: 'Khi chủ ngữ của mệnh đề chính và mệnh đề phụ giống nhau, ta có thể rút gọn mệnh đề phụ bằng cách dùng V-ing sau liên từ.',
                            items: []
                        },
                        {
                            id: 'conjunctions',
                            title: 'Các liên từ áp dụng',
                            type: 'usage',
                            content: '',
                            items: [
                                'Before, After, Since, While, When'
                            ]
                        },
                        {
                            id: 'structure',
                            title: 'Cấu trúc',
                            type: 'formula',
                            content: '',
                            items: [
                                'Conjunction + V-ing (+Object), Main Clause',
                                'Hoặc: Main Clause + Conjunction + V-ing',
                                'VD: Before leaving home, don\'t forget to lock the doors.'
                            ]
                        }
                    ]
                },
                exercises: [
                    {
                        id: 'ex-fill',
                        type: 'fill-blank',
                        instruction: 'Điền dạng đúng của động từ vào chỗ trống.',
                        questions: [
                            {
                                id: 'q1',
                                text: 'Before ______ (visit) a new place, do some research before you ______ (arrive) at your destination.',
                                blanks: ['visiting', 'arrive'],
                                answer: ['visiting', 'arrive']
                            },
                            {
                                id: 'q2',
                                text: 'After ______ (check in) to the hotel, you can ______ (ask) where the best places to visit are.',
                                blanks: ['checking in', 'ask'],
                                answer: ['checking in', 'ask']
                            },
                            {
                                id: 'q3',
                                text: 'You should ______ (take) extra care of your belongings when ______ (travel) alone.',
                                blanks: ['take', 'traveling'],
                                answer: ['take', 'traveling']
                            },
                            {
                                id: 'q4',
                                text: 'Try to pick up some of the local language while ______ (talk) to locals. They\'ll really ______ (appreciate) it.',
                                blanks: ['talking', 'appreciate'],
                                answer: ['talking', 'appreciate']
                            },
                            {
                                id: 'q5',
                                text: 'I have already started to ______ (plan) my next trip since ______ (return) from South America.',
                                blanks: ['plan', 'returning'],
                                answer: ['plan', 'returning']
                            },
                            {
                                id: 'q6',
                                text: 'There\'s no need to change money before you ______ (leave) home. Just use an ATM after ______ (land).',
                                blanks: ['leave', 'landing'],
                                answer: ['leave', 'landing']
                            }
                        ]
                    },
                    {
                        id: 'ex-circle',
                        type: 'multiple-choice',
                        instruction: 'Chọn đáp án đúng.',
                        questions: [
                            { id: 'q1', text: 'Email a copy of your itinerary to family or friends ______ finalizing your trip.', options: ['before', 'since'], answer: 'before' },
                            { id: 'q2', text: '______ visiting interesting places, people often buy souvenirs from local people.', options: ['When', 'Since'], answer: 'When' },
                            { id: 'q3', text: '______ departing your home country, you should really arrange some travel insurance.', options: ['While', 'Before'], answer: 'Before' },
                            { id: 'q4', text: 'Planning your trip in advance is good, but you can also get knowledge from locals ______ visiting.', options: ['before', 'while'], answer: 'while' },
                            { id: 'q5', text: 'It\'s always better to use local currency ______ buying anything.', options: ['when', 'since'], answer: 'when' },
                            { id: 'q6', text: '______ returning home, I have really missed all the people I met on my trip.', options: ['Since', 'After'], answer: 'Since' }
                        ]
                    }
                ]
            },
            {
                id: 'polite-questions',
                title: 'Câu hỏi gián tiếp lịch sự (Polite indirect questions)',
                theory: {
                    sections: [
                        {
                            id: 'purpose',
                            title: 'Mục đích',
                            type: 'text',
                            content: 'Để hỏi thông tin một cách lịch sự hơn câu hỏi trực tiếp.',
                            items: []
                        },
                        {
                            id: 'phrases',
                            title: 'Các cụm từ mở đầu',
                            type: 'usage',
                            content: '',
                            items: [
                                'Could you tell me...?',
                                'I was wondering...?',
                                'Would you mind telling me...?',
                                'Do you know...?'
                            ]
                        },
                        {
                            id: 'structure',
                            title: 'Cấu trúc ngữ pháp',
                            type: 'formula',
                            content: '',
                            items: [
                                'Với câu hỏi Wh-: Mở đầu + Wh-word + S + V (Không đảo ngữ)',
                                'Với câu hỏi Yes/No: Mở đầu + if/whether + S + V',
                                'Lưu ý: Động từ đi sau chủ ngữ chia như câu khẳng định bình thường.'
                            ]
                        }
                    ]
                },
                exercises: [
                    {
                        id: 'ex-circle',
                        type: 'multiple-choice',
                        instruction: 'Chọn đáp án đúng.',
                        questions: [
                            { id: 'q1', text: '______ if you accept credit cards?', options: ['Do you know', 'Could you tell me'], answer: 'Do you know' },
                            { id: 'q2', text: 'I was wondering ______ the coffee machine.', options: ['how do you operate', 'how to operate'], answer: 'how to operate' },
                            { id: 'q3', text: 'Could you tell me ______ a dry cleaning service?', options: ['if you have', 'have you'], answer: 'if you have' },
                            { id: 'q4', text: 'Do you know ______ a good Indian restaurant near the hotel?', options: ['if there\'s', 'is there'], answer: 'if there\'s' },
                            { id: 'q5', text: 'Would you mind telling ______ there is a pool in the hotel?', options: ['me', 'me if'], answer: 'me if' },
                            { id: 'q6', text: 'Could you tell me ______?', options: ['where is the nearest subway', 'where the nearest subway is'], answer: 'where the nearest subway is' }
                        ]
                    },
                    {
                        id: 'ex-complete',
                        type: 'rewrite',
                        instruction: 'Hoàn thành câu hỏi gián tiếp.',
                        questions: [
                            { id: 'q1', text: 'Where\'s the remote control for the AC?', answer: 'I was wondering where the remote control for the AC is.' },
                            { id: 'q2', text: 'Is the Wi-Fi password all lowercase or uppercase?', answer: 'Could you tell me if the Wi-Fi password is all lowercase or uppercase.' },
                            { id: 'q3', text: 'Are the drinks complimentary?', answer: 'Do you know if the drinks are complimentary.' },
                            { id: 'q4', text: 'Who\'s the manager?', answer: 'Could you tell me who the manager is.' },
                            { id: 'q5', text: 'Do you have a taxi service to the airport?', answer: 'Would you mind telling me if you have a taxi service to the airport.' },
                            { id: 'q6', text: 'Where can I find an iron?', answer: 'I was wondering where I can find an iron.' }
                        ]
                    }
                ]
            }
        ]
    }
];
