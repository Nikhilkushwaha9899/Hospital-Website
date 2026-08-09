(function (global) {
    'use strict';

    /*
     * MediClub Health Assistant
     * -------------------------
     * Local, rule-based healthcare information assistant.
     *
     * Purpose:
     * - Provide general health information across a broad range of symptoms.
     * - Help users understand common possible causes and appropriate next steps.
     * - Identify red-flag symptoms that may need urgent medical attention.
     * - Encourage professional consultation when symptoms are persistent,
     *   severe, unusual, or unclear.
     *
     * Safety:
     * - This assistant does NOT diagnose diseases.
     * - It does NOT replace a doctor, pharmacist, or emergency service.
     * - It does NOT provide individualized prescription dosing.
     * - Emergency checks are always performed before normal topic matching.
     */

    // =========================================================
    // 1. PROFESSIONAL INTRO / DISCLAIMER
    // =========================================================

    const WELCOME_MESSAGE =
        "Welcome to MediClub Health Assistant. I can provide general health information " +
        "about a wide range of symptoms and health concerns, help you understand possible " +
        "causes, suggest appropriate next steps, and identify situations that may require " +
        "urgent medical attention. I cannot provide a definitive diagnosis or replace a " +
        "qualified healthcare professional. Please describe your symptoms or health concern " +
        "and I’ll do my best to guide you.";

    const GENERAL_DISCLAIMER =
        "\n\n⚕️ This information is for general educational purposes only and is not a diagnosis. " +
        "If your symptoms are severe, persistent, worsening, or worrying you, please consult " +
        "a qualified healthcare professional.";

    const MEDICINE_DISCLAIMER =
        "\n\n⚕️ Medicine information is general educational information only. Follow the " +
        "medicine label or your clinician's instructions, and ask a pharmacist or doctor " +
        "whether a medicine is appropriate for you.";

    const EMERGENCY_ADVICE =
        " If this is an emergency, please contact local emergency services or go to the nearest " +
        "emergency department rather than waiting for a chat response.";

    // =========================================================
    // 2. EMERGENCY / RED-FLAG RECORDS — ALWAYS CHECK FIRST
    // =========================================================

    const EMERGENCY_RECORDS = [
        {
            id: 'crisis_selfharm',
            keywords: [
                'suicide', 'kill myself', 'end my life', 'self harm', 'self-harm',
                'hurt myself', 'want to die', 'no reason to live', 'take my life'
            ],
            reply:
                "I'm really glad you reached out. I can't provide crisis treatment through this chat. " +
                "Please tell a trusted adult, family member, teacher, doctor, or another trusted person " +
                "right now and stay with someone you trust. If you are in immediate danger, contact your " +
                "local emergency service or go to the nearest emergency department."
        },
        {
            id: 'emergency_physical',
            keywords: [
                'chest pain', 'pressure in chest', 'cant breathe', "can't breathe",
                'difficulty breathing', 'shortness of breath', 'severe bleeding',
                'heavy bleeding', 'unconscious', 'passed out', 'stroke symptoms',
                'heart attack', 'severe allergic reaction', 'anaphylaxis',
                'not breathing', 'seizure', 'blue lips', 'sudden weakness',
                'sudden paralysis', 'face drooping', 'speech difficulty'
            ],
            reply:
                "This may be a medical emergency. Please seek urgent medical care now " +
                "and do not wait for a chat response." + EMERGENCY_ADVICE
        },
        {
            id: 'emergency_overdose',
            keywords: [
                'overdose', 'poisoning', 'swallowed pills', 'took too many pills',
                'took too many tablets', 'poison', 'chemical ingestion'
            ],
            reply:
                "A suspected overdose or poisoning needs urgent medical assessment. Please contact " +
                "local emergency services or a poison-control service immediately, or go to the nearest " +
                "emergency department. Do not wait for symptoms to appear."
        },
        {
            id: 'emergency_head',
            keywords: [
                'worst headache', 'worst headache of my life',
                'sudden severe headache', 'head injury and unconscious',
                'head injury with confusion'
            ],
            reply:
                "A sudden, unusually severe headache or a serious head injury can require urgent assessment. " +
                "Please seek emergency medical care now rather than relying on a chat response."
        }
    ];

    // =========================================================
    // 3. BROAD HEALTH TOPICS
    // =========================================================

    const SYMPTOM_RECORDS = [
        {
            id: 'fever',
            keywords: ['fever', 'high temperature', 'temperature', 'chills', 'feeling hot'],
            reply:
                "Fever is commonly associated with infections, although there are other possible causes. " +
                "Rest, drink fluids, and monitor how you feel. Seek medical advice if the fever is high, " +
                "persistent, repeatedly returns, or occurs with severe pain, confusion, breathing difficulty, " +
                "a stiff neck, or a concerning rash."
        },
        {
            id: 'cold_cough',
            keywords: [
                'cold', 'cough', 'sore throat', 'runny nose', 'congestion',
                'sneezing', 'blocked nose', 'flu', 'influenza'
            ],
            reply:
                "Cough, congestion, sneezing, and sore throat are often caused by viral respiratory infections, " +
                "but allergies and other conditions can also cause similar symptoms. Rest, fluids, and avoiding " +
                "smoke or other irritants may help. Seek medical advice if symptoms are severe, persist unusually " +
                "long, worsen after improving, or are associated with breathing difficulty or chest pain."
        },
        {
            id: 'headache',
            keywords: [
                'headache', 'migraine', 'head pain', 'head ache',
                'throbbing headache', 'tension headache'
            ],
            reply:
                "Headaches can have many causes, including dehydration, lack of sleep, stress, eye strain, " +
                "tension, migraine, infection, or other medical conditions. Rest, hydration, regular meals, " +
                "and a break from screens may help some mild headaches. New, severe, frequent, or unusual " +
                "headaches should be assessed by a healthcare professional."
        },
        {
            id: 'dizziness',
            keywords: [
                'dizziness', 'dizzy', 'lightheaded', 'light headed',
                'room spinning', 'vertigo', 'balance problem'
            ],
            reply:
                "Dizziness can be related to dehydration, low blood pressure, inner-ear problems, illness, " +
                "medicines, or other causes. Sit or lie somewhere safe, rise slowly, and drink fluids if you " +
                "may be dehydrated. Seek prompt medical care if dizziness is sudden or severe, or occurs with " +
                "fainting, chest pain, severe headache, weakness, confusion, or difficulty speaking."
        },
        {
            id: 'stomach',
            keywords: [
                'stomach ache', 'stomach pain', 'abdominal pain', 'belly pain',
                'nausea', 'vomiting', 'diarrhea', 'indigestion', 'acidity',
                'heartburn', 'bloating', 'gas trouble', 'constipation'
            ],
            reply:
                "Digestive symptoms can have many causes, including infections, food-related problems, reflux, " +
                "constipation, stress, or other conditions. For mild symptoms, small frequent sips of fluid, " +
                "rest, and simple foods may help. Seek medical care for severe or worsening abdominal pain, " +
                "persistent vomiting, blood in vomit or stool, significant dehydration, or symptoms that do not improve."
        },
        {
            id: 'skin_allergy',
            keywords: [
                'rash', 'itching', 'allergy', 'hives', 'skin irritation',
                'skin allergy', 'eczema', 'dry skin', 'acne', 'pimples'
            ],
            reply:
                "Skin changes can be caused by irritation, allergies, infections, eczema, acne, or other conditions. " +
                "Avoid known irritants and try not to scratch affected areas. A rapidly spreading rash, severe pain, " +
                "blistering, facial or throat swelling, or breathing difficulty needs urgent medical attention."
        },
        {
            id: 'injury',
            keywords: [
                'sprain', 'twisted ankle', 'fall', 'bruise', 'swelling',
                'cut', 'wound', 'injury', 'muscle strain', 'pulled muscle'
            ],
            reply:
                "For a minor soft-tissue injury, protect the area, rest it from painful activity, and use a cold " +
                "pack wrapped in cloth for short periods to help with swelling. Avoid putting ice directly on skin. " +
                "Seek medical assessment for deep wounds, deformity, severe swelling or pain, inability to use the limb, " +
                "or an injury involving the head, neck, or spine."
        },
        {
            id: 'sleep',
            keywords: [
                'insomnia', "can't sleep", 'cant sleep', 'sleep issue',
                'trouble sleeping', 'not sleeping well', 'sleep problem',
                'sleeping too much'
            ],
            reply:
                "Sleep problems can be linked to stress, irregular routines, screen use, caffeine, medicines, " +
                "or other health conditions. Keeping a regular sleep schedule, reducing late caffeine, and limiting " +
                "screens before bedtime may help. If sleep problems continue for weeks or significantly affect daily life, " +
                "consider speaking with a doctor."
        },
        {
            id: 'stress',
            keywords: [
                'stress', 'anxious', 'anxiety', 'overwhelmed', 'burnout',
                'panic', 'nervous', 'worry', 'worried', 'feeling stressed'
            ],
            reply:
                "Stress and anxiety can affect sleep, concentration, appetite, and physical comfort. Slow breathing, " +
                "regular movement, healthy routines, and talking with someone you trust may help. If anxiety is persistent, " +
                "interferes with daily life, or feels difficult to manage, consider speaking with a doctor or mental-health professional."
        },
        {
            id: 'blood_pressure',
            keywords: [
                'blood pressure', 'hypertension', 'bp high', 'bp low',
                'high bp', 'low bp', 'blood pressure reading'
            ],
            reply:
                "Blood pressure varies with age, activity, stress, medicines, and health conditions. A single reading " +
                "does not always give the full picture. If you have repeated high or low readings, keep a record and " +
                "discuss them with a healthcare professional rather than changing medication on your own."
        },
        {
            id: 'diabetes',
            keywords: [
                'diabetes', 'blood sugar', 'glucose level',
                'sugar level', 'high sugar', 'low sugar'
            ],
            reply:
                "Diabetes involves blood-glucose regulation and can have different forms and treatment plans. Healthy eating, " +
                "activity, monitoring, and prescribed treatment are commonly important. If you have diabetes and develop " +
                "confusion, severe weakness, repeated vomiting, or another concerning change, seek urgent medical advice."
        },
        {
            id: 'back_pain',
            keywords: [
                'back pain', 'backache', 'lower back pain', 'upper back pain',
                'spine pain', 'neck pain', 'neck ache'
            ],
            reply:
                "Back or neck pain can come from muscle strain, posture, injury, or other causes. Gentle movement and avoiding " +
                "activities that clearly worsen the pain can help some mild cases. Seek medical assessment for severe pain, " +
                "pain after significant injury, numbness or weakness, or new bladder/bowel-control problems."
        },
        {
            id: 'joint_pain',
            keywords: [
                'joint pain', 'knee pain', 'arthritis', 'shoulder pain',
                'elbow pain', 'wrist pain', 'ankle pain', 'stiff joints'
            ],
            reply:
                "Joint discomfort can be caused by overuse, injury, inflammation, arthritis, or other conditions. Rest from " +
                "painful activity and gentle movement may help mild symptoms. A joint that becomes very swollen, red, hot, " +
                "severely painful, or difficult to move should be evaluated by a clinician."
        },
        {
            id: 'eye',
            keywords: [
                'eye pain', 'red eye', 'itchy eyes', 'eye infection',
                'blurry vision', 'blurred vision', 'watery eyes',
                'eye strain', 'dry eyes'
            ],
            reply:
                "Eye symptoms may be related to dryness, allergies, irritation, infection, or vision problems. Avoid rubbing " +
                "your eyes and take regular screen breaks. Sudden vision loss or major vision changes, severe eye pain, " +
                "significant injury, or chemical exposure require prompt medical attention."
        },
        {
            id: 'ear',
            keywords: [
                'ear pain', 'earache', 'ear infection',
                'hearing problem', 'ringing in ears', 'tinnitus',
                'blocked ear'
            ],
            reply:
                "Ear symptoms can result from infection, wax buildup, pressure changes, allergies, or other causes. Avoid " +
                "putting cotton buds or other objects inside the ear. Seek medical advice for severe pain, discharge, fever, " +
                "new hearing loss, severe dizziness, or symptoms that persist."
        },
        {
            id: 'dental',
            keywords: [
                'tooth pain', 'toothache', 'gum pain', 'dental pain',
                'cavity', 'tooth sensitivity', 'swollen gums'
            ],
            reply:
                "Tooth and gum pain can be caused by cavities, gum disease, infection, or sensitivity. Gentle oral hygiene " +
                "and avoiding very hot, cold, or sugary foods may reduce discomfort temporarily. Persistent pain, facial swelling, " +
                "fever, or difficulty swallowing needs prompt dental or medical assessment."
        },
        {
            id: 'womens_health',
            keywords: [
                'period pain', 'menstrual cramps', 'irregular periods',
                'period late', 'heavy periods', 'pregnancy question',
                'pregnancy symptoms', 'menstrual cycle'
            ],
            reply:
                "Menstrual and reproductive symptoms can have many causes. Mild period discomfort may improve with rest, " +
                "gentle activity, or a warm compress. Significant or unusual pain, very heavy bleeding, fainting, or pregnancy-related " +
                "concerns should be discussed with a qualified healthcare professional."
        },
        {
            id: 'child_health',
            keywords: [
                'child fever', 'baby fever', 'kid not eating',
                'child cough', 'infant', 'baby cough', 'child health',
                'baby not feeding'
            ],
            reply:
                "Children can become unwell more quickly than adults, and age matters when assessing symptoms. Keep the child " +
                "comfortable and hydrated as appropriate. Babies under 3 months with a fever, breathing difficulty, unusual sleepiness, " +
                "poor feeding, repeated vomiting, or other concerning changes need prompt medical assessment."
        },
        {
            id: 'urinary',
            keywords: [
                'burning urination', 'urine infection', 'uti',
                'frequent urination', 'painful urination', 'blood in urine',
                'urinary problem'
            ],
            reply:
                "Urinary symptoms can occur with urinary infections, irritation, stones, or other conditions. Hydration may help " +
                "with some mild discomfort, but burning or frequent urination should generally be assessed by a healthcare professional. " +
                "Fever, back/flank pain, vomiting, or blood in the urine warrants prompt medical attention."
        },
        {
            id: 'breathing',
            keywords: [
                'breathing problem', 'breathing difficulty', 'breathlessness',
                'wheezing', 'tight chest', 'phlegm', 'mucus',
                'asthma symptoms'
            ],
            reply:
                "Breathing symptoms can be caused by infections, allergies, asthma, irritation, or other conditions. Avoid smoke " +
                "and other known triggers. Significant breathing difficulty, blue lips, severe chest pain, fainting, or rapidly worsening " +
                "symptoms require emergency medical attention."
        },
        {
            id: 'throat',
            keywords: [
                'throat pain', 'sore throat', 'difficulty swallowing',
                'tonsil', 'tonsillitis', 'hoarse voice'
            ],
            reply:
                "Throat discomfort is commonly associated with viral infections, irritation, allergies, or other causes. Fluids and " +
                "rest may help mild symptoms. Seek medical attention for difficulty breathing, inability to swallow fluids, severe swelling, " +
                "or symptoms that are severe or persistent."
        },
        {
            id: 'weight_nutrition',
            keywords: [
                'weight gain', 'weight loss', 'not gaining weight',
                'appetite', 'nutrition', 'diet', 'healthy eating',
                'underweight', 'overweight'
            ],
            reply:
                "Changes in weight or appetite can be influenced by nutrition, activity, stress, medicines, and medical conditions. " +
                "Healthy eating patterns and regular activity are generally important, but sudden or unexplained weight change should be " +
                "discussed with a healthcare professional rather than managed through extreme dieting or restriction."
        },
        {
            id: 'fatigue',
            keywords: [
                'tired', 'fatigue', 'weakness', 'low energy',
                'always tired', 'feeling weak', 'exhausted'
            ],
            reply:
                "Fatigue can be related to poor sleep, stress, infection, nutrition, medicines, or a range of medical conditions. " +
                "Regular sleep, hydration, balanced meals, and appropriate activity may help. Persistent, unexplained, or severe fatigue " +
                "should be evaluated by a healthcare professional."
        },
        {
            id: 'hair',
            keywords: [
                'hair fall', 'hair loss', 'dandruff', 'itchy scalp',
                'hair thinning', 'scalp problem'
            ],
            reply:
                "Hair loss and scalp symptoms can have several causes, including stress, nutrition, hormonal changes, skin conditions, " +
                "or other health issues. Avoid harsh hair treatments if the scalp is irritated. Sudden or significant hair loss is worth " +
                "discussing with a doctor or dermatologist."
        }
    ];

    // =========================================================
    // 4. MEDICINE / OTC RECORDS
    // =========================================================

    const MEDICINE_RECORDS = [
        {
            id: 'paracetamol',
            keywords: ['paracetamol', 'acetaminophen', 'tylenol', 'crocin', 'dolo'],
            reply:
                "Paracetamol (acetaminophen) is commonly used for pain and fever. It can be harmful if too much is taken, " +
                "and it may be present in more than one combination product. Follow the product label or a clinician's instructions " +
                "and ask a pharmacist or doctor about suitability and dosing for you or a child. Seek urgent medical help if an overdose is suspected."
        },
        {
            id: 'ibuprofen',
            keywords: ['ibuprofen', 'advil', 'brufen', 'nsaid'],
            reply:
                "Ibuprofen is an anti-inflammatory medicine commonly used for pain, fever, and inflammation. It is not suitable for everyone, " +
                "including some people with stomach ulcers, kidney problems, certain heart conditions, or specific pregnancy situations. " +
                "Check the label and ask a pharmacist or doctor whether it is appropriate for you and how it should be used."
        },
        {
            id: 'antacid',
            keywords: ['antacid', 'gelusil', 'eno', 'acidity medicine', 'heartburn medicine'],
            reply:
                "Antacids can provide temporary relief from occasional heartburn or acidity. Frequent or persistent symptoms may need evaluation " +
                "because reflux and other digestive conditions can have different treatments. Follow the product label and ask a pharmacist if unsure."
        },
        {
            id: 'antihistamine',
            keywords: ['antihistamine', 'cetirizine', 'allegra', 'allergy tablet', 'anti-allergy'],
            reply:
                "Antihistamines are commonly used for allergy symptoms such as sneezing, itching, and runny nose. Some can cause drowsiness. " +
                "Check the product label and ask a pharmacist or doctor which option is appropriate for your age, symptoms, and other medicines."
        },
        {
            id: 'cough_syrup',
            keywords: ['cough syrup', 'cough medicine', 'expectorant'],
            reply:
                "Cough medicines differ depending on whether the cough is dry, mucus-producing, allergy-related, or associated with another condition. " +
                "A pharmacist can help select an appropriate product. Seek medical advice for a persistent cough, breathing difficulty, chest pain, or coughing blood."
        },
        {
            id: 'ors',
            keywords: ['ors', 'oral rehydration', 'electrolyte solution'],
            reply:
                "Oral rehydration solution helps replace fluids and electrolytes lost through vomiting, diarrhea, or heavy sweating. " +
                "Use the product according to its mixing instructions. If dehydration is severe, the person is very sleepy, cannot drink, or symptoms are worsening, seek medical care."
        },
        {
            id: 'antibiotic',
            keywords: ['antibiotic', 'amoxicillin', 'azithromycin'],
            reply:
                "Antibiotics treat certain bacterial infections and should be used only when prescribed or recommended by a qualified clinician. " +
                "They do not treat viral infections such as most common colds. Do not start, stop, or share antibiotics without professional guidance."
        },
        {
            id: 'vitamins',
            keywords: [
                'vitamin', 'multivitamin', 'supplement',
                'vitamin d', 'vitamin b12', 'iron tablet'
            ],
            reply:
                "Vitamins and supplements may be useful when there is a confirmed need, but unnecessary or excessive use can also cause harm " +
                "or interact with medicines. A clinician can help determine whether testing or supplementation is appropriate."
        }
    ];

    // =========================================================
    // 5. FIRST-AID RECORDS
    // =========================================================

    const FIRST_AID_RECORDS = [
        {
            id: 'burn',
            keywords: ['burn', 'burned my hand', 'scald', 'minor burn'],
            reply:
                "For a minor burn, cool the area under cool running water for about 20 minutes. Do not apply ice, butter, toothpaste, " +
                "or other home remedies directly to the burn. Cover it loosely with a clean non-stick dressing. Large, deep, electrical, " +
                "chemical, facial, hand, or genital burns need medical assessment."
        },
        {
            id: 'nosebleed',
            keywords: ['nosebleed', 'nose bleeding', 'bleeding nose'],
            reply:
                "For a nosebleed, sit upright, lean slightly forward, and pinch the soft part of the nose continuously for about 10–15 minutes. " +
                "Do not tilt your head backward. Seek medical care if bleeding is heavy, follows a significant injury, or does not stop."
        },
        {
            id: 'fainting',
            keywords: ['fainted', 'fainting', 'dizzy and fell', 'passed out'],
            reply:
                "If someone faints, place them somewhere safe and keep them lying down while they recover. Do not give food or drink until they are fully alert. " +
                "Emergency care is needed if they do not recover normally, have trouble breathing, have a seizure, have chest pain, or were seriously injured."
        },
        {
            id: 'choking',
            keywords: ['choking', 'something stuck in throat'],
            reply:
                "Choking can become life-threatening very quickly. If the person cannot breathe, cough, or speak, call emergency services immediately " +
                "and follow the instructions of the emergency dispatcher. Use first-aid techniques only if you know how to perform them safely."
        }
    ];

    // =========================================================
    // 6. GENERAL / HOSPITAL SERVICES
    // =========================================================

    const GENERAL_RECORDS = [
        {
            id: 'appointment',
            keywords: [
                'book appointment', 'appointment', 'see a doctor',
                'consult doctor', 'schedule visit', 'doctor appointment',
                'book doctor', 'consultation'
            ],
            reply:
                "You can book an appointment with one of our doctors from the Appointment page. " +
                "If your symptoms suggest an emergency, please seek urgent medical care instead of waiting for an appointment."
        },
        {
            id: 'vaccination',
            keywords: ['vaccine', 'vaccination', 'immunization', 'immunisation'],
            reply:
                "Vaccination schedules depend on age, health history, previous doses, and local recommendations. " +
                "Please confirm which vaccines are due with a qualified healthcare professional or your clinic."
        },
        {
            id: 'checkup',
            keywords: [
                'general checkup', 'health checkup',
                'full body checkup', 'annual checkup', 'health screening'
            ],
            reply:
                "Routine health checkups can help identify risk factors and health problems early. The appropriate tests depend on " +
                "your age, symptoms, medical history, and risk factors. You can book a consultation through our Appointment page."
        },
        {
            id: 'doctor_specialist',
            keywords: [
                'which doctor', 'which specialist', 'what doctor',
                'doctor for', 'specialist for', 'department for'
            ],
            reply:
                "The right specialist depends on the symptoms and the person's history. If you describe what you are experiencing, " +
                "I can provide general guidance about which type of healthcare professional may be appropriate. A clinician should make the final assessment."
        },
        {
            id: 'emergency_department',
            keywords: [
                'emergency', 'emergency room', 'emergency department',
                'urgent care', 'urgent medical help'
            ],
            reply:
                "For severe or rapidly worsening symptoms, use your local emergency service or go to the nearest emergency department. " +
                "Do not wait for a routine appointment when symptoms may be life-threatening."
        }
    ];

    const ALL_TOPIC_RECORDS = [].concat(
        SYMPTOM_RECORDS,
        MEDICINE_RECORDS,
        FIRST_AID_RECORDS,
        GENERAL_RECORDS
    );

    // =========================================================
    // 7. SMALL TALK
    // =========================================================

    const GREETINGS = [
        'hi', 'hello', 'hey', 'hii', 'helo',
        'good morning', 'good evening', 'good afternoon'
    ];

    const THANKS = ['thank', 'thanks', 'thankyou', 'thank you'];
    const BYE = ['bye', 'goodbye', 'see you'];

    const FALLBACK_REPLIES = [
        "I’d be happy to help. Please describe the health concern in a little more detail — for example, what you are experiencing, where it is happening, and how long it has been present.",
        "To guide you more accurately, please tell me about your main symptom or concern, when it started, and whether it is getting better, worse, or staying the same.",
        "I can help with many general health topics, symptoms, medicines, first aid, and hospital services. Please describe what you are experiencing in your own words."
    ];

    // =========================================================
    // 8. TEXT MATCHING ENGINE
    // =========================================================

    function normalize(text) {
        return String(text || '')
            .toLowerCase()
            .replace(/[^\w\s']/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function tokenize(text) {
        return normalize(text).split(' ').filter(Boolean);
    }

    function scoreRecord(normalizedText, record) {
        let score = 0;
        const words = tokenize(normalizedText);

        for (const kw of record.keywords) {
            const normalizedKeyword = normalize(kw);

            if (!normalizedKeyword) continue;

            if (normalizedText.includes(normalizedKeyword)) {
                // Multi-word phrases are more specific than single words.
                score += normalizedKeyword.includes(' ') ? 4 : 2;
            }

            // Light word-level matching for natural-language questions.
            const keywordWords = normalizedKeyword.split(' ');
            if (keywordWords.length === 1 && words.includes(keywordWords[0])) {
                score += 1;
            }
        }

        return score;
    }

    function findBestRecord(normalizedText, records) {
        let best = null;
        let bestScore = 0;

        for (const record of records) {
            const score = scoreRecord(normalizedText, record);

            if (score > bestScore) {
                bestScore = score;
                best = record;
            }
        }

        return best;
    }

    // =========================================================
    // 9. FOLLOW-UP / CONTEXT HELP
    // =========================================================

    function getFollowUpPrompt(text) {
        const normalized = normalize(text);

        const locationWords = [
            'pain', 'ache', 'rash', 'swelling', 'burning',
            'itching', 'bleeding', 'discomfort'
        ];

        if (locationWords.some(function (word) {
            return normalized.includes(word);
        })) {
            return "\n\nIf you want, you can also tell me where the symptom is, when it started, and whether it is getting better or worse.";
        }

        return "";
    }

    // =========================================================
    // 10. PUBLIC CHATBOT API
    // =========================================================

    function getAssistantReply(rawText) {
        const text = normalize(rawText || '');

        if (!text) {
            return "Please type your question or describe the health concern you would like help with.";
        }

        // -----------------------------------------------------
        // Emergency screening always comes first.
        // -----------------------------------------------------
        const emergencyHit = findBestRecord(text, EMERGENCY_RECORDS);

        if (emergencyHit) {
            return emergencyHit.reply;
        }

        // -----------------------------------------------------
        // Greetings
        // -----------------------------------------------------
        if (GREETINGS.some(function (g) {
            return text === g || text.startsWith(g + ' ');
        })) {
            return WELCOME_MESSAGE;
        }

        // -----------------------------------------------------
        // Thanks
        // -----------------------------------------------------
        if (THANKS.some(function (t) {
            return text.includes(t);
        })) {
            return "You're welcome. I'm glad I could help. If your symptoms continue, worsen, or concern you, please speak with a qualified healthcare professional.";
        }

        // -----------------------------------------------------
        // Goodbye
        // -----------------------------------------------------
        if (BYE.some(function (b) {
            return text === b || text.startsWith(b + ' ');
        })) {
            return "Take care. If you develop severe or rapidly worsening symptoms, please seek urgent medical attention rather than waiting for a chat response.";
        }

        // -----------------------------------------------------
        // Topic matching
        // -----------------------------------------------------
        const topicHit = findBestRecord(text, ALL_TOPIC_RECORDS);

        if (topicHit) {
            const isMedicine = MEDICINE_RECORDS.indexOf(topicHit) !== -1;
            const isEmergencyService = topicHit.id === 'emergency_department';

            if (isMedicine) {
                return topicHit.reply + MEDICINE_DISCLAIMER;
            }

            if (isEmergencyService) {
                return topicHit.reply;
            }

            return topicHit.reply +
                GENERAL_DISCLAIMER +
                getFollowUpPrompt(text);
        }

        // -----------------------------------------------------
        // Professional fallback
        // -----------------------------------------------------
        return FALLBACK_REPLIES[
            Math.floor(Math.random() * FALLBACK_REPLIES.length)
        ];
    }

    // Optional helper for the UI if you want to display the
    // disclaimer separately below the chat input.
    function getWelcomeMessage() {
        return WELCOME_MESSAGE;
    }

    function getGeneralDisclaimer() {
        return GENERAL_DISCLAIMER.trim();
    }

    global.MediclubAssistant = {
        getAssistantReply: getAssistantReply,
        getWelcomeMessage: getWelcomeMessage,
        getGeneralDisclaimer: getGeneralDisclaimer
    };

})(window);
