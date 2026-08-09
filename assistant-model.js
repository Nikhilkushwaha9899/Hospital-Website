(function (global) {

    // 1. EMERGENCY / CRISIS RECORDS — always checked first
    const EMERGENCY_RECORDS = [
        {
            id: 'crisis_selfharm',
            keywords: ['suicide', 'kill myself', 'end my life', 'self harm', 'self-harm', 'hurt myself', 'want to die', 'no reason to live'],
            reply: "I'm really glad you reached out. I'm not able to help with this myself, but please talk to someone right now — call or text 988 (Suicide & Crisis Lifeline) in the US, or your local emergency number. In India you can call the KIRAN helpline at 1800-599-0019, available 24/7. You don't have to go through this alone."
        },
        {
            id: 'emergency_physical',
            keywords: ['chest pain', 'cant breathe', "can't breathe", 'difficulty breathing', 'severe bleeding', 'heavy bleeding', 'unconscious', 'stroke', 'heart attack', 'severe allergic reaction', 'anaphylaxis', 'not breathing', 'seizure'],
            reply: "This sounds like it could be a medical emergency. Please call your local emergency number (108/112 in India, 911 in the US) or go to the nearest emergency room right away — please don't wait on a chat reply for this. Our 24/7 Emergency Helpline is also listed at the bottom of this page."
        },
        {
            id: 'emergency_overdose',
            keywords: ['overdose', 'poisoning', 'swallowed pills', 'took too many pills', 'took too many tablets'],
            reply: "This needs urgent medical attention. Please call your local emergency or poison-control number right now, or go to the nearest emergency room. Don't wait — if possible, have someone stay with you and bring the medicine packaging with you."
        }
    ];

    // 2. SYMPTOM / CONDITION RECORDS
    const SYMPTOM_RECORDS = [
        {
            id: 'fever',
            keywords: ['fever', 'high temperature', 'temperature', 'chills', 'feeling hot'],
            reply: "Fever is usually the body's response to infection. Rest, drink plenty of fluids, and dress lightly. See a doctor if fever goes above 103°F (39.4°C), lasts more than 3 days, or comes with a rash, stiff neck, severe pain, or confusion."
        },
        {
            id: 'cold_cough',
            keywords: ['cold', 'cough', 'sore throat', 'runny nose', 'congestion', 'sneezing', 'blocked nose'],
            reply: "Common cold symptoms usually ease with rest, fluids, and warm saltwater gargles for a sore throat. A humidifier can help with congestion. See a doctor if symptoms last beyond 10 days, worsen after improving, or you develop high fever, chest pain, or shortness of breath."
        },
        {
            id: 'headache',
            keywords: ['headache', 'migraine', 'head pain', 'head ache'],
            reply: "Mild headaches often ease with rest, hydration, and a break from screens in a quiet, dark room. Frequent or severe headaches, or ones with vision changes, weakness, confusion, or a stiff neck, need prompt medical evaluation — don't wait on those."
        },
        {
            id: 'stomach',
            keywords: ['stomach ache', 'stomach pain', 'nausea', 'vomiting', 'diarrhea', 'indigestion', 'acidity', 'bloating', 'gas trouble'],
            reply: "For mild stomach upset, small sips of water or an oral rehydration solution, bland food (rice, banana, toast), and rest often help. See a doctor if there's severe pain, blood in vomit or stool, signs of dehydration, or symptoms lasting more than 2 days."
        },
        {
            id: 'skin_allergy',
            keywords: ['rash', 'itching', 'allergy', 'hives', 'skin irritation', 'skin allergy'],
            reply: "Mild skin irritation can sometimes be eased with a cool compress and avoiding the suspected trigger. If a rash spreads quickly, is very painful, blistering, or comes with facial/throat swelling or trouble breathing, treat it as urgent and seek care immediately."
        },
        {
            id: 'injury',
            keywords: ['sprain', 'twisted ankle', 'fall', 'bruise', 'swelling', 'cut', 'wound', 'injury'],
            reply: "For minor sprains or bruises, the R.I.C.E. approach helps: Rest, Ice, Compression, Elevation. Clean minor cuts and cover with a sterile bandage. See a doctor for deep cuts, if you can't bear weight, or if swelling/pain is severe."
        },
        {
            id: 'sleep',
            keywords: ['insomnia', "can't sleep", 'cant sleep', 'sleep issue', 'trouble sleeping', 'not sleeping well'],
            reply: "Good sleep habits can help: a consistent sleep/wake time, limiting screens and caffeine before bed, and a cool, dark room. If sleep trouble persists for weeks or affects daily life, it's worth discussing with a doctor."
        },
        {
            id: 'stress',
            keywords: ['stress', 'anxious', 'anxiety', 'overwhelmed', 'burnout', 'panic'],
            reply: "It's completely normal to feel this way sometimes. Slow breathing, short walks, talking to someone you trust, and breaking tasks into smaller steps can help. If stress or anxiety is persistent or hard to manage, please consider reaching out to a doctor or counselor for real support."
        },
        {
            id: 'blood_pressure',
            keywords: ['blood pressure', 'hypertension', 'bp high', 'bp low', 'high bp', 'low bp'],
            reply: "Blood pressure is affected by diet, salt intake, stress, and activity levels. Regular monitoring and a doctor's guidance are important, especially with a history of high or low blood pressure — this isn't something to self-manage without medical advice."
        },
        {
            id: 'diabetes',
            keywords: ['diabetes', 'blood sugar', 'glucose level', 'sugar level'],
            reply: "Blood sugar management usually involves diet, activity, and — when prescribed — medication, all guided by a doctor. If you're managing diabetes, regular checkups and monitoring matter. Let me know if you'd like general lifestyle tips."
        },
        {
            id: 'back_pain',
            keywords: ['back pain', 'backache', 'lower back pain', 'spine pain'],
            reply: "Mild back pain often improves with gentle movement, good posture, and short rest — but not prolonged bed rest. Heat or cold packs can help. See a doctor if pain is severe, spreads down a leg, or comes with numbness, weakness, or loss of bladder/bowel control."
        },
        {
            id: 'joint_pain',
            keywords: ['joint pain', 'knee pain', 'arthritis', 'shoulder pain', 'stiff joints'],
            reply: "Mild joint discomfort can sometimes ease with rest, gentle stretching, and hot/cold compresses. If a joint is swollen, red, very painful, or the pain is persistent, please have a doctor take a look."
        },
        {
            id: 'eye',
            keywords: ['eye pain', 'red eye', 'itchy eyes', 'eye infection', 'blurry vision'],
            reply: "Mild eye irritation can sometimes be eased by resting your eyes and avoiding rubbing them. Sudden vision changes, severe pain, or an eye injury need prompt attention from a doctor or eye specialist — please don't delay those."
        },
        {
            id: 'ear',
            keywords: ['ear pain', 'earache', 'ear infection', 'hearing problem'],
            reply: "Mild ear discomfort can sometimes settle with rest and avoiding inserting anything into the ear. See a doctor if there's severe pain, discharge, fever, or hearing loss."
        },
        {
            id: 'dental',
            keywords: ['tooth pain', 'toothache', 'gum pain', 'dental pain', 'cavity'],
            reply: "For mild tooth discomfort, rinsing with warm salt water and avoiding very hot/cold food can help temporarily. Persistent tooth or gum pain should be checked by a dentist soon, since it usually needs proper treatment rather than home care alone."
        },
        {
            id: 'womens_health',
            keywords: ['period pain', 'menstrual cramps', 'irregular periods', 'pregnancy question'],
            reply: "Mild period cramps can sometimes ease with a warm compress, light activity, and rest. For irregular periods, pregnancy-related questions, or pain that disrupts daily life, it's best to consult a doctor or gynecologist for proper guidance."
        },
        {
            id: 'child_health',
            keywords: ['child fever', 'baby fever', 'kid not eating', 'child cough', 'infant'],
            reply: "Children's symptoms can change quickly, so it's best to be a little more cautious than with adults. Keep them hydrated and comfortable, and see a pediatrician promptly for fever in infants under 3 months, persistent symptoms, poor feeding, or if your child seems unusually lethargic."
        },
        {
            id: 'urinary',
            keywords: ['burning urination', 'urine infection', 'uti', 'frequent urination'],
            reply: "Drinking plenty of water can help with mild urinary discomfort, but burning, frequent urination, or urinary symptoms usually need a doctor's evaluation, since a urinary infection often needs proper treatment."
        }
    ];

    // 3. MEDICINE / OTC RECORDS
    //    General info only — NEVER specific dosages. Always
    //    redirect to label / pharmacist / doctor for dosing.
    const MEDICINE_RECORDS = [
        {
            id: 'paracetamol',
            keywords: ['paracetamol', 'acetaminophen', 'tylenol', 'crocin', 'dolo'],
            reply: "Paracetamol (also called acetaminophen) is a common over-the-counter medicine used to relieve mild pain and reduce fever. It's generally considered safe when taken as directed, but taking too much can seriously harm the liver, and it can interact with alcohol and some other medicines. Please follow the dose on the package label, or check with a pharmacist or doctor for the right dose for you or your child — I'm not able to give specific dosing here. Seek medical help right away if you suspect an overdose."
        },
        {
            id: 'ibuprofen',
            keywords: ['ibuprofen', 'advil', 'brufen', 'nsaid'],
            reply: "Ibuprofen is an over-the-counter anti-inflammatory used for pain, fever, and swelling. It's usually taken with food to reduce stomach upset, and isn't suitable for everyone — for example, some people with stomach ulcers, kidney issues, asthma, or who are pregnant should avoid it. Please check the package label or ask a pharmacist/doctor about whether it's right for you and the correct dose."
        },
        {
            id: 'antacid',
            keywords: ['antacid', 'gelusil', 'eno', 'acidity medicine', 'heartburn medicine'],
            reply: "Antacids are used to relieve occasional heartburn or acidity by neutralizing stomach acid. They're generally for short-term, occasional use. If you need them frequently or for more than 2 weeks, it's worth seeing a doctor to check for an underlying cause."
        },
        {
            id: 'antihistamine',
            keywords: ['antihistamine', 'cetirizine', 'allegra', 'allergy tablet', 'anti-allergy'],
            reply: "Antihistamines are commonly used to relieve allergy symptoms like sneezing, itching, and runny nose. Some can cause drowsiness, so it's worth checking the label before driving or operating machinery. A pharmacist or doctor can advise on the right one and dose for your situation."
        },
        {
            id: 'cough_syrup',
            keywords: ['cough syrup', 'cough medicine', 'expectorant'],
            reply: "Cough syrups vary — some suppress cough, others help loosen mucus — so the right one depends on the type of cough. A pharmacist can help match the syrup to your symptoms. See a doctor if cough lasts more than 2–3 weeks or comes with fever, chest pain, or blood."
        },
        {
            id: 'ors',
            keywords: ['ors', 'oral rehydration', 'electrolyte solution'],
            reply: "Oral rehydration solution (ORS) helps replace fluids and electrolytes lost through vomiting, diarrhea, or heavy sweating. It's generally safe and widely recommended, especially for children and during hot weather or illness. Follow the mixing instructions on the packet."
        },
        {
            id: 'antibiotic',
            keywords: ['antibiotic', 'amoxicillin', 'azithromycin'],
            reply: "Antibiotics treat bacterial infections and should only be taken when prescribed by a doctor — they don't work on viral infections like the common cold or flu, and using them incorrectly contributes to antibiotic resistance. Please don't self-medicate with antibiotics; see a doctor if you think you need one."
        },
        {
            id: 'vitamins',
            keywords: ['vitamin', 'multivitamin', 'supplement', 'vitamin d', 'vitamin b12', 'iron tablet'],
            reply: "Vitamins and supplements can help address specific deficiencies, but more isn't always better, and some interact with medications. A blood test and a doctor's advice can tell you if you actually need one and at what dose, rather than guessing."
        }
    ];

    // 4. FIRST-AID RECORDS
    const FIRST_AID_RECORDS = [
        {
            id: 'burn',
            keywords: ['burn', 'burned my hand', 'scald'],
            reply: "For a minor burn: cool it under running water for about 10–20 minutes, don't apply ice, butter, or ointments, and cover loosely with a clean, non-stick dressing. Seek medical care for burns that are large, deep, on the face/hands/genitals, or blistering severely."
        },
        {
            id: 'nosebleed',
            keywords: ['nosebleed', 'nose bleeding', 'bleeding nose'],
            reply: "For a nosebleed: sit up and lean slightly forward, pinch the soft part of your nose for about 10 minutes, and avoid tilting your head back. See a doctor if bleeding doesn't stop after 20 minutes or happens frequently."
        },
        {
            id: 'fainting',
            keywords: ['fainted', 'fainting', 'dizzy and fell', 'passed out'],
            reply: "If someone faints: lay them down and raise their legs slightly, loosen tight clothing, and ensure fresh air. If they don't regain consciousness within a minute, or fainting is frequent/unexplained, seek medical attention."
        },
        {
            id: 'choking',
            keywords: ['choking', 'something stuck in throat'],
            reply: "If someone is choking and can't breathe, cough, or speak, call emergency services immediately and, if trained, perform back blows/abdominal thrusts. This is urgent — please don't wait on a chat reply for a choking emergency."
        }
    ];

    // 5. GENERAL / SITE RECORDS
    const GENERAL_RECORDS = [
        {
            id: 'appointment',
            keywords: ['book appointment', 'appointment', 'see a doctor', 'consult doctor', 'schedule visit'],
            reply: "You can book an appointment with one of our doctors from the Appointment page in the menu above. If it's urgent, please use the Emergency Helpline listed in the footer instead of waiting for a booking."
        },
        {
            id: 'vaccination',
            keywords: ['vaccine', 'vaccination', 'immunization'],
            reply: "Vaccination schedules depend on age, health history, and local guidelines, so it's best to confirm with a doctor or our clinic which vaccines you or your child are due for."
        },
        {
            id: 'checkup',
            keywords: ['general checkup', 'health checkup', 'full body checkup', 'annual checkup'],
            reply: "Routine checkups are a great way to catch issues early — typically including blood pressure, weight, basic blood tests, and a general physical exam. You can book one through our Appointment page."
        }
    ];

    const ALL_TOPIC_RECORDS = [].concat(SYMPTOM_RECORDS, MEDICINE_RECORDS, FIRST_AID_RECORDS, GENERAL_RECORDS);

    // =========================================================
    // 6. SMALL TALK
    // =========================================================
    const GREETINGS = ['hi', 'hello', 'hey', 'hii', 'helo', 'good morning', 'good evening', 'good afternoon'];
    const THANKS = ['thank', 'thanks', 'thankyou', 'thank you'];
    const BYE = ['bye', 'goodbye', 'see you'];

    const FALLBACK_REPLIES = [
        "I'm not totally sure I understood that. Could you describe your symptoms a bit more — for example, where it hurts, how long it's lasted, and how severe it feels?",
        "I want to make sure I help correctly — could you share a bit more detail about what you're experiencing, or the medicine/topic you're asking about?",
        "Could you tell me more? For example, is this about a symptom (fever, cough, pain...), a medicine, first aid, or something like an appointment?"
    ];

    // 7. MATCHING ENGINE
    function normalize(text) {
        return text.toLowerCase().replace(/[^\w\s']/g, ' ').replace(/\s+/g, ' ').trim();
    }

    function scoreRecord(normalizedText, record) {
        let score = 0;
        for (const kw of record.keywords) {
            if (normalizedText.includes(kw)) {
                score += kw.includes(' ') ? 2 : 1;
            }
        }
        return score;
    }

    function findBestRecord(normalizedText, records) {
        let best = null;
        let bestScore = 0;
        for (const record of records) {
            const s = scoreRecord(normalizedText, record);
            if (s > bestScore) {
                bestScore = s;
                best = record;
            }
        }
        return best;
    }

    /**
     * Public "API": returns a reply string for a given user message.
     * Fully local — no network calls, no keys.
     */
    function getAssistantReply(rawText) {
        const text = normalize(rawText || '');

        if (!text) {
            return "Could you type your question or describe your symptoms?";
        }

        // Emergencies always win
        const emergencyHit = findBestRecord(text, EMERGENCY_RECORDS);
        if (emergencyHit) {
            return emergencyHit.reply;
        }

        // Small talk
        if (GREETINGS.some(function (g) { return text === g || text.startsWith(g + ' '); })) {
            return "Hello! Tell me what's bothering you — a symptom, a medicine question, first aid, or general wellness advice — and I'll do my best to help.";
        }
        if (THANKS.some(function (t) { return text.includes(t); })) {
            return "You're welcome! Take care of yourself, and don't hesitate to ask if anything else comes up.";
        }
        if (BYE.some(function (b) { return text === b || text.startsWith(b + ' '); })) {
            return "Take care! Remember, for anything serious or ongoing, please book an appointment with one of our doctors.";
        }

        // Topic matching across all categories
        const topicHit = findBestRecord(text, ALL_TOPIC_RECORDS);
        if (topicHit) {
            const isMedicine = MEDICINE_RECORDS.indexOf(topicHit) !== -1;
            const footer = isMedicine
                ? "\n\nThis is general information, not medical advice — please confirm dosing and suitability with a pharmacist or doctor."
                : "\n\nThis is general information, not a diagnosis — if symptoms are severe, persistent, or worsening, please book an appointment with one of our doctors.";
            return topicHit.reply + footer;
        }

        // Fallback
        return FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)];
    }

    global.MediclubAssistant = {
        getAssistantReply: getAssistantReply
    };

})(window);