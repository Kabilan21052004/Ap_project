

# AI Resume Analyzer & Career Assistant

A professional web application that leverages AI and interactive 3D visuals to analyze resumes, provide actionable feedback, and deliver real-time job market insights tailored for the Indian job market. Built with Next.js, React, Three.js, and Google Gemini AI.

---
Demo video: 


## Features

* AI-Powered Resume Analysis (Gemini 2.0 Flash)
* Drag-and-Drop File Upload (PDF, DOC, DOCX, TXT)
* Dynamic Job Market Insights (India-specific roles, salaries, skills, locations)
* 3D Animated Particle Background (WebGL/Three.js)
* ATS Compatibility & Skill Gap Detection
* PDF Export of Analysis
* Responsive, Accessible UI (Tailwind CSS, ARIA, keyboard navigation)
* Manual and Performance Testing
* Dark Mode & Theme Animations

---

## Tech Stack

* Frontend: Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion
* 3D Graphics: Three.js (WebGL)
* AI/Backend: Google Gemini 2.0 Flash (Generative Language API)
* PDF Export: html2canvas, jsPDF

---

## Prerequisites

* Node.js 18+ and npm
* Google Gemini API key (for resume analysis)

---

## Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd ai-resume-analyzer
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure API Key:

   * Create a `.env.local` file in the root directory:

     ```
     GEMINI_API_KEY=your_gemini_api_key_here
     ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open in your browser:

   * Visit [http://localhost:3000](http://localhost:3000)

---

## Usage

* Upload your resume (PDF, DOC, DOCX, or TXT)
* Click “Analyze Resume” to receive instant AI-powered feedback
* Review your analysis, including:

  * Overall Impression
  * Content & Structure
  * Skills & Qualifications
  * Impact & Achievements
  * Areas for Improvement
  * Specific Recommendations
* Explore job market insights tailored for India:

  * In-demand roles, salary ranges, skill development, and locations
* Export your analysis as a PDF for records

---

## Indian Job Market Insights (Sample)

* In-Demand Roles: Software Engineer, Data Scientist, Cloud Engineer, DevOps Engineer, Full Stack Developer
* Salary Range: ₹6,00,000 – ₹35,00,000 (based on experience and skill set)
* Skill Development: Cloud Computing, AI/ML, Cybersecurity, Data Analytics, Blockchain
* Growth Opportunities: 30% projected job growth in tech/IT over the next 3 years
* Top Locations: Bengaluru, Hyderabad, Pune, Gurugram, Mumbai

---

## How It Works

* Text Extraction: Uses browser FileReader API to read text from supported files (text-based only)
* AI Analysis: Sends resume content to Google Gemini 2.0 Flash for intelligent feedback
* Visualization: Renders an interactive 3D particle background using Three.js/WebGL
* Job Insights: Displays real-time job trends and recommendations based on the Indian market

---

## Customization

* To support OCR: Integrate Tesseract.js or a cloud OCR API for image-based resumes
* To update job data: Modify `JobMarketInsights.tsx` or connect to a real-time job API
* To switch backgrounds: Toggle between `AnimatedBackground` (2D) and `WebGLBackground` (3D)

---

## License

* MIT

---

## Contributions

Contributions and feedback are welcome!

---
