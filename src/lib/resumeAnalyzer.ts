// Real resume analysis engine that parses PDF text and generates unique scores

export interface ResumeAnalysis {
  isResume: boolean;
  rejectReason?: string;
  confidence: number; // 0-100 how confident we are this is a resume
  overallScore: number;
  skillScore: number;
  experienceScore: number;
  projectScore: number;
  achievementScore: number;
  educationScore: number;
  formattingScore: number;
  atsScore: number;
  detectedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  improvements: string[];
  suggestedRoles: string[];
  suggestedProjects: string[];
  sections: {
    contact: { found: boolean; score: number; note: string };
    summary: { found: boolean; score: number; note: string };
    experience: { found: boolean; score: number; note: string };
    education: { found: boolean; score: number; note: string };
    skills: { found: boolean; score: number; note: string };
    projects: { found: boolean; score: number; note: string };
    certifications: { found: boolean; score: number; note: string };
  };
}

const TECH_SKILLS = [
  "python", "javascript", "typescript", "java", "c++", "c#", "go", "rust", "ruby", "php", "swift", "kotlin",
  "react", "angular", "vue", "next.js", "node.js", "express", "django", "flask", "spring", "fastapi",
  "html", "css", "tailwind", "bootstrap", "sass", "scss",
  "sql", "mysql", "postgresql", "mongodb", "redis", "firebase", "supabase", "dynamodb", "cassandra",
  "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "jenkins", "ci/cd", "github actions",
  "git", "linux", "bash", "rest api", "graphql", "microservices", "serverless",
  "machine learning", "deep learning", "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy",
  "nlp", "computer vision", "data science", "data analysis", "power bi", "tableau",
  "figma", "photoshop", "illustrator", "ui/ux", "wireframing",
  "agile", "scrum", "jira", "confluence",
  "blockchain", "solidity", "web3", "smart contracts",
  "cybersecurity", "penetration testing", "ethical hacking", "network security",
  "flutter", "react native", "android", "ios", "mobile development",
  "hadoop", "spark", "kafka", "airflow", "etl",
  "opencv", "langchain", "openai", "llm", "generative ai", "prompt engineering",
];

const SOFT_SKILLS = [
  "leadership", "communication", "teamwork", "problem solving", "critical thinking",
  "time management", "project management", "collaboration", "mentoring", "presentation",
  "analytical", "creative", "adaptable", "detail-oriented", "self-motivated",
];

const ACTION_VERBS = [
  "developed", "implemented", "designed", "created", "built", "led", "managed",
  "optimized", "improved", "achieved", "increased", "reduced", "launched",
  "architected", "engineered", "deployed", "automated", "collaborated",
  "mentored", "analyzed", "researched", "initiated", "established", "spearheaded",
];

const ROLE_SKILL_MAP: Record<string, string[]> = {
  "Full Stack Developer": ["javascript", "react", "node.js", "sql", "git", "html", "css", "rest api"],
  "Frontend Developer": ["javascript", "react", "html", "css", "typescript", "tailwind", "figma"],
  "Backend Developer": ["python", "node.js", "sql", "rest api", "docker", "microservices", "git"],
  "Data Scientist": ["python", "machine learning", "pandas", "sql", "tensorflow", "data analysis", "numpy"],
  "AI/ML Engineer": ["python", "machine learning", "deep learning", "tensorflow", "pytorch", "nlp"],
  "DevOps Engineer": ["docker", "kubernetes", "aws", "ci/cd", "terraform", "linux", "bash", "git"],
  "Cybersecurity Analyst": ["cybersecurity", "network security", "linux", "penetration testing", "python"],
  "Mobile Developer": ["react native", "flutter", "android", "ios", "javascript", "mobile development"],
  "Cloud Architect": ["aws", "azure", "gcp", "docker", "kubernetes", "terraform", "serverless"],
  "Product Manager": ["agile", "scrum", "jira", "communication", "analytical", "leadership"],
  "Data Engineer": ["python", "sql", "spark", "kafka", "airflow", "etl", "aws", "docker"],
  "UI/UX Designer": ["figma", "ui/ux", "wireframing", "photoshop", "illustrator", "html", "css"],
};

// ─── Non-resume detection patterns ───
const NON_RESUME_PATTERNS = [
  /chapter\s+\d/i,
  /table\s+of\s+contents/i,
  /isbn/i,
  /acknowledgements/i,
  /bibliography/i,
  /abstract\s*[:\n]/i,
  /^dear\s+(sir|madam|hiring|mr|ms|mrs)/im,
  /sincerely|regards|yours\s+truly/i,
  /invoice\s*(number|no|#|date)/i,
  /total\s+amount|subtotal|tax\s+amount/i,
  /receipt|order\s+confirmation/i,
  /terms\s+and\s+conditions/i,
  /privacy\s+policy/i,
  /user\s+agreement/i,
  /question\s*\d|answer\s*:/i,
  /exam|quiz|test\s+paper/i,
  /lecture\s+notes/i,
  /slide\s+\d/i,
];

function detectSkills(text: string): { technical: string[]; soft: string[] } {
  const lower = text.toLowerCase();
  const technical = TECH_SKILLS.filter((s) => {
    const escaped = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\b${escaped}\\b`, "i").test(lower);
  });
  const soft = SOFT_SKILLS.filter((s) => lower.includes(s));
  return { technical, soft };
}

function countActionVerbs(text: string): number {
  const lower = text.toLowerCase();
  return ACTION_VERBS.filter((v) => lower.includes(v)).length;
}

function hasQuantifiableMetrics(text: string): boolean {
  return /\d+%|\d+\+|increased.*\d|reduced.*\d|improved.*\d|achieved.*\d/i.test(text);
}

function detectSections(text: string) {
  const lower = text.toLowerCase();
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(text);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);
  const hasLinkedIn = /linkedin/i.test(text);
  const hasGithub = /github/i.test(text);

  const contactScore = (hasEmail ? 30 : 0) + (hasPhone ? 30 : 0) + (hasLinkedIn ? 20 : 0) + (hasGithub ? 20 : 0);

  const hasSummary = /summary|objective|profile|about me/i.test(lower);
  const hasExperience = /experience|employment|work history|internship/i.test(lower);
  const hasEducation = /education|university|college|degree|bachelor|master|b\.tech|b\.e\.|m\.tech|m\.s\./i.test(lower);
  const hasSkills = /skills|technologies|tech stack|proficiencies|competencies/i.test(lower);
  const hasProjects = /project/i.test(lower);
  const hasCertifications = /certif|course|training|credential/i.test(lower);

  return {
    contact: { found: hasEmail || hasPhone, score: Math.min(contactScore, 100), note: contactScore >= 60 ? "Good contact info" : "Add email, phone, LinkedIn, and GitHub" },
    summary: { found: hasSummary, score: hasSummary ? 75 : 0, note: hasSummary ? "Professional summary found" : "Add a professional summary/objective" },
    experience: { found: hasExperience, score: hasExperience ? 70 : 0, note: hasExperience ? "Experience section found" : "Add work experience or internships" },
    education: { found: hasEducation, score: hasEducation ? 80 : 0, note: hasEducation ? "Education section found" : "Add education details" },
    skills: { found: hasSkills, score: hasSkills ? 75 : 0, note: hasSkills ? "Skills section found" : "Add a dedicated skills section" },
    projects: { found: hasProjects, score: hasProjects ? 70 : 0, note: hasProjects ? "Projects section found" : "Add projects to showcase your work" },
    certifications: { found: hasCertifications, score: hasCertifications ? 65 : 0, note: hasCertifications ? "Certifications found" : "Add relevant certifications" },
  };
}

/**
 * Multi-signal resume detection.
 * Returns a confidence score 0–100 and a boolean.
 */
export function isResumeContent(text: string): { isResume: boolean; confidence: number; reason?: string } {
  if (!text || text.trim().length < 50) {
    return { isResume: false, confidence: 0, reason: "The uploaded file contains too little text to be a resume." };
  }

  const lower = text.toLowerCase();
  const wordCount = text.split(/\s+/).length;

  // ── Check for non-resume document types first ──
  let nonResumeHits = 0;
  for (const pattern of NON_RESUME_PATTERNS) {
    if (pattern.test(text)) nonResumeHits++;
  }
  if (nonResumeHits >= 3) {
    return { isResume: false, confidence: 5, reason: "This appears to be a book, letter, invoice, or academic document — not a resume. Please upload your resume (PDF, TXT, or DOCX)." };
  }

  // ── Positive resume signals ──
  let score = 0;

  // Contact info (strong signal)
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(text);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);
  if (hasEmail) score += 20;
  if (hasPhone) score += 15;

  // Section headers (strong signals)
  const sectionPatterns = [
    { pattern: /\b(work\s+)?experience\b/i, weight: 15 },
    { pattern: /\beducation\b/i, weight: 15 },
    { pattern: /\bskills\b/i, weight: 12 },
    { pattern: /\bproject/i, weight: 8 },
    { pattern: /\binternship/i, weight: 10 },
    { pattern: /\bsummary\b|objective\b/i, weight: 8 },
    { pattern: /\bcertif/i, weight: 6 },
    { pattern: /\bachievement/i, weight: 6 },
    { pattern: /\buniversity|college|degree|bachelor|master\b/i, weight: 10 },
    { pattern: /\bresume\b|\bcurriculum\s+vitae\b|\bcv\b/i, weight: 12 },
  ];
  for (const { pattern, weight } of sectionPatterns) {
    if (pattern.test(lower)) score += weight;
  }

  // Tech skills presence (moderate signal)
  const techHits = TECH_SKILLS.filter((s) => lower.includes(s)).length;
  score += Math.min(15, techHits * 2);

  // Action verbs (moderate signal)
  const verbHits = ACTION_VERBS.filter((v) => lower.includes(v)).length;
  score += Math.min(10, verbHits * 2);

  // LinkedIn/GitHub links
  if (/linkedin\.com/i.test(text)) score += 5;
  if (/github\.com/i.test(text)) score += 5;

  // Penalize very short or very long docs
  if (wordCount < 80) score -= 15;
  if (wordCount > 5000) score -= 10;

  // Penalize if mostly numbers (spreadsheet/data dump)
  const digitRatio = (text.match(/\d/g) || []).length / text.length;
  if (digitRatio > 0.4) score -= 20;

  const confidence = Math.max(0, Math.min(100, score));
  const isResume = confidence >= 30;

  if (!isResume) {
    return {
      isResume: false,
      confidence,
      reason: "This file doesn't appear to be a resume. A resume typically includes sections like Experience, Education, Skills, and contact information (email/phone). Please upload a valid resume.",
    };
  }

  return { isResume: true, confidence };
}

export function analyzeResume(text: string): ResumeAnalysis {
  const resumeCheck = isResumeContent(text);

  if (!resumeCheck.isResume) {
    return {
      isResume: false,
      rejectReason: resumeCheck.reason,
      confidence: resumeCheck.confidence,
      overallScore: 0, skillScore: 0, experienceScore: 0, projectScore: 0, achievementScore: 0,
      educationScore: 0, formattingScore: 0, atsScore: 0,
      detectedSkills: [], missingSkills: [], strengths: [], improvements: [],
      suggestedRoles: [], suggestedProjects: [],
      sections: {
        contact: { found: false, score: 0, note: "" },
        summary: { found: false, score: 0, note: "" },
        experience: { found: false, score: 0, note: "" },
        education: { found: false, score: 0, note: "" },
        skills: { found: false, score: 0, note: "" },
        projects: { found: false, score: 0, note: "" },
        certifications: { found: false, score: 0, note: "" },
      },
    };
  }

  const { technical, soft } = detectSkills(text);
  const allDetected = [...technical, ...soft];
  const sections = detectSections(text);
  const actionVerbCount = countActionVerbs(text);
  const hasMetrics = hasQuantifiableMetrics(text);
  const wordCount = text.split(/\s+/).length;
  const lower = text.toLowerCase();

  // Skill score
  const skillScore = Math.min(100, Math.round((technical.length / 8) * 60 + (soft.length / 3) * 40));

  // Experience score
  let experienceScore = sections.experience.found ? 40 : 0;
  experienceScore += Math.min(30, actionVerbCount * 5);
  experienceScore += hasMetrics ? 20 : 0;
  experienceScore += /internship/i.test(lower) ? 10 : 0;
  experienceScore = Math.min(100, experienceScore);
  sections.experience.score = experienceScore;
  sections.experience.note = experienceScore > 70 ? "Strong experience section with action verbs" : experienceScore > 40 ? "Add metrics and action verbs to bullet points" : "Experience section needs more detail";

  // Project score
  let projectScore = sections.projects.found ? 40 : 0;
  const projectMentions = (lower.match(/project/gi) || []).length;
  projectScore += Math.min(30, projectMentions * 8);
  projectScore += /github|deployed|live|demo/i.test(lower) ? 20 : 0;
  projectScore += /tech stack|built with|technologies used/i.test(lower) ? 10 : 0;
  projectScore = Math.min(100, projectScore);
  sections.projects.score = projectScore;

  // Achievement score
  let achievementScore = 0;
  if (/award|achievement|honor|recognition|winner|1st|2nd|3rd|first place/i.test(lower)) achievementScore += 40;
  if (/hackathon|competition|contest/i.test(lower)) achievementScore += 25;
  if (/publish|paper|research|journal|conference/i.test(lower)) achievementScore += 25;
  if (hasMetrics) achievementScore += 10;
  achievementScore = Math.min(100, achievementScore);

  // Education score
  let educationScore = sections.education.found ? 50 : 0;
  if (/gpa|cgpa|percentage|grade/i.test(lower)) educationScore += 20;
  if (/bachelor|master|b\.tech|m\.tech|b\.e\.|m\.s\.|ph\.d/i.test(lower)) educationScore += 20;
  if (/relevant course|coursework/i.test(lower)) educationScore += 10;
  educationScore = Math.min(100, educationScore);
  sections.education.score = educationScore;

  // Formatting score
  let formattingScore = 50;
  if (wordCount >= 200 && wordCount <= 800) formattingScore += 20;
  else if (wordCount > 800) formattingScore += 5;
  if (sections.contact.found) formattingScore += 10;
  if (sections.summary.found) formattingScore += 10;
  if (actionVerbCount >= 5) formattingScore += 10;
  formattingScore = Math.min(100, formattingScore);

  // ATS score
  let atsScore = 0;
  atsScore += Math.min(30, technical.length * 4);
  atsScore += sections.contact.found ? 15 : 0;
  atsScore += sections.experience.found ? 15 : 0;
  atsScore += sections.education.found ? 10 : 0;
  atsScore += sections.skills.found ? 15 : 0;
  atsScore += actionVerbCount >= 3 ? 10 : 0;
  atsScore += hasMetrics ? 5 : 0;
  atsScore = Math.min(100, atsScore);

  // Overall
  const overallScore = Math.round(
    skillScore * 0.25 + experienceScore * 0.25 + projectScore * 0.15 +
    achievementScore * 0.1 + educationScore * 0.1 + formattingScore * 0.1 + atsScore * 0.05
  );

  // Strengths
  const strengths: string[] = [];
  if (technical.length >= 5) strengths.push(`Strong technical profile with ${technical.length} skills detected`);
  if (soft.length >= 2) strengths.push(`Good soft skills: ${soft.slice(0, 3).join(", ")}`);
  if (actionVerbCount >= 5) strengths.push("Excellent use of action verbs in descriptions");
  if (hasMetrics) strengths.push("Includes quantifiable achievements and metrics");
  if (sections.summary.found) strengths.push("Has a professional summary section");
  if (sections.projects.found && projectScore >= 50) strengths.push("Projects section demonstrates practical experience");
  if (sections.contact.score >= 60) strengths.push("Complete contact information provided");
  if (achievementScore >= 40) strengths.push("Noteworthy achievements and awards listed");
  if (strengths.length === 0) strengths.push("Resume uploaded successfully — room for significant improvement");

  // Improvements
  const improvements: string[] = [];
  if (technical.length < 5) improvements.push("Add more technical skills relevant to your target role");
  if (soft.length < 2) improvements.push("Include soft skills like leadership, communication, teamwork");
  if (!hasMetrics) improvements.push("Add quantifiable metrics (e.g., 'improved performance by 30%')");
  if (actionVerbCount < 3) improvements.push("Use more action verbs (developed, implemented, optimized)");
  if (!sections.summary.found) improvements.push("Add a professional summary or objective statement");
  if (!sections.projects.found) improvements.push("Add a projects section with tech stacks and live links");
  if (!sections.certifications.found) improvements.push("Include relevant certifications and courses");
  if (sections.contact.score < 60) improvements.push("Add LinkedIn and GitHub profile links");
  if (!/github/i.test(lower)) improvements.push("Link your GitHub profile to showcase code");
  if (wordCount < 200) improvements.push("Resume seems too short — add more detail to each section");
  if (wordCount > 900) improvements.push("Consider condensing — aim for 1-2 pages max");

  // Suggested roles
  const suggestedRoles: string[] = [];
  for (const [role, requiredSkills] of Object.entries(ROLE_SKILL_MAP)) {
    const matchCount = requiredSkills.filter((s) => technical.includes(s) || soft.includes(s)).length;
    if (matchCount >= 3) suggestedRoles.push(role);
  }
  if (suggestedRoles.length === 0) suggestedRoles.push("Explore foundational skills first");

  // Missing skills
  const missingSkills: string[] = [];
  if (suggestedRoles.length > 0 && suggestedRoles[0] !== "Explore foundational skills first") {
    const topRole = suggestedRoles[0];
    const required = ROLE_SKILL_MAP[topRole] || [];
    for (const s of required) {
      if (!technical.includes(s) && !soft.includes(s)) missingSkills.push(s);
    }
  } else {
    const common = ["python", "javascript", "git", "sql", "react", "docker"];
    for (const s of common) {
      if (!technical.includes(s)) missingSkills.push(s);
    }
  }

  // Suggested projects
  const suggestedProjects: string[] = [];
  if (technical.includes("react") || technical.includes("javascript")) suggestedProjects.push("Build a full-stack web app with React and Node.js");
  if (technical.includes("python")) suggestedProjects.push("Create a data analysis dashboard with Python and Streamlit");
  if (technical.includes("machine learning")) suggestedProjects.push("Build an ML model for sentiment analysis or image classification");
  if (technical.includes("docker") || technical.includes("aws")) suggestedProjects.push("Deploy a containerized app to AWS/GCP with CI/CD");
  if (suggestedProjects.length === 0) {
    suggestedProjects.push("Build a personal portfolio website", "Create a CRUD app with any framework", "Contribute to open-source projects on GitHub");
  }

  return {
    isResume: true,
    confidence: resumeCheck.confidence,
    overallScore, skillScore, experienceScore, projectScore, achievementScore,
    educationScore, formattingScore, atsScore,
    detectedSkills: allDetected, missingSkills, strengths, improvements,
    suggestedRoles, suggestedProjects, sections,
  };
}
