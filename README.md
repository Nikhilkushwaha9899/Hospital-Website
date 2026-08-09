<p align="center">
  <img src="medicine.png" alt="MediClub+ logo" width="90" />
</p>

<h1 align="center">🏥 MediClub+</h1>

<p align="center">
  A responsive, animated static hospital website — with a rule-based health assistant chatbot.
</p>

<p align="center">
  <a href="https://mediclub-ochre.vercel.app/"><strong>🔗 Live Demo</strong></a>
</p>

<p align="center"><em>Your health, our priority.</em></p>

---

## 📖 About the Project

MediClub+ is a front-end hospital website built with plain HTML, CSS, and JavaScript. It includes a homepage, an about page, doctor listings, an appointment booking form, health tips, and a **local, rule-based health assistant chatbot** — all wrapped in a glassmorphism UI with an animated WebGL2 gradient background.

There is **no backend or database** — the appointment form and other interactions are handled entirely client-side (e.g. `localStorage` for a submission confirmation), and the health assistant runs fully in-browser with no API calls or network requests.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| **HTML5** | Page structure and semantic markup |
| **CSS3** | Styling, glassmorphism UI, responsive layout (Poppins via Google Fonts) |
| **JavaScript (Vanilla)** | Nav toggle, form handling, chatbot logic, background animation |
| **WebGL2 / GLSL** | Real-time animated gradient background (custom fragment shader) |

---

## ✨ Features

- 🌊 **Animated WebGL2 background** — a custom fragment shader renders a smoothly shifting, blob-like gradient (`bg_animation.js`) behind every page
- 🖥️ Responsive UI with a collapsible hamburger menu on mobile
- 🏠 **Home** — hero section, hospital overview, staff highlights, and 10 patient testimonials with star ratings
- ℹ️ **About** — mission statement, core values, key stats (years of service, doctors, patients treated), and mission section
- 👩‍⚕️ **Doctors** — profile cards for 10 doctors with specialization, experience, and gender, each with a "Book An Appointment" link
- 📅 **Appointment** — a detailed booking form (name, date of birth, gender, phone, address, email, department, procedure, file upload for medical reports, preferred date/time); on submit it stores a flag in `localStorage` and redirects to the homepage, which shows a confirmation alert
- 💡 **Health Tips** — 9 wellness topic cards (hydration, diet, exercise, sleep, stress, checkups, harmful habits, hygiene, mental health) plus a "Did You Know?" stats section
- 🩺 **Health Support (AI Assistant)** — a local, rule-based chatbot (`assistant-model.js` + `assistant.js`) that:
  - Screens every message for emergency/red-flag symptoms first (chest pain, breathing difficulty, overdose, self-harm, stroke symptoms, etc.) and responds with urgent-care guidance
  - Matches common symptoms and health topics (fever, cough/cold, headache, dizziness, digestive issues, skin/allergy, injuries, medicines, and more) via keyword scoring
  - Always appends an educational disclaimer — it does **not** diagnose or replace a healthcare professional
  - Includes a simulated "typing" indicator and chat bubble UI, entirely client-side with no network calls
- 📞 Contact section and a pulsing 24/7 emergency helpline badge in the footer on every page

---

## 📌 Notes & Limitations

- This is a **front-end only** project — there is no backend, database, or real data persistence beyond `localStorage`.
- The appointment form does not actually send or store submissions anywhere.
- The **Health Support assistant is not a medical tool** — it's a local, keyword-based chatbot for educational/demo purposes. It always screens for emergency red-flag symptoms first and clearly states it cannot diagnose or replace a healthcare professional.
- Social media links in the footer are placeholders (`#`).
- Great as a learning reference for responsive design, glassmorphism UI, WebGL2 shaders, and building a simple rule-based chatbot in vanilla JS.

---

## 📜 License

This project is **open-source** and available for educational purposes. Feel free to explore, modify, and learn from the code.

---
