export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date?: string;
  credential_id?: string;
  verify_url?: string;
  pdf_url?: string;
  skills: string[];
}

export const certifications: Certification[] = [
  {
    id: "1",
    title: "DSA with Java",
    issuer: "Apna College",
    skills: ["Java", "Data Structures", "Algorithms", "Problem Solving", "DSA"]
  },
  {
    id: "2",
    title: "Python Certification",
    issuer: "IIT Madras Pravartak (GUVI)",
    verify_url: "https://www.guvi.in/certificate?id=16qu5p5h82B8191ac2",
    skills: ["Python", "Programming", "OOP", "Problem Solving"]
  },
  {
    id: "3",
    title: "AWS Academy Graduate – Cloud Foundations",
    issuer: "Amazon Web Services",
    verify_url: "https://www.credly.com/badges/1a45221b-8aab-486d-968e-3244e01db31a/public_url",
    skills: ["AWS", "Cloud Computing", "EC2", "S3", "Networking"]
  },
  {
    id: "4",
    title: "Complete Data Science, Machine Learning, Deep Learning & NLP Bootcamp",
    issuer: "Udemy",
    verify_url: "https://ude.my/UC-3a8ea8ec-dab5-4801-91bc-ba9fc5c0f389",
    skills: ["Data Science", "Machine Learning", "Deep Learning", "NLP", "Python"]
  },
  {
    id: "5",
    title: "Complete Generative AI Course with LangChain and HuggingFace",
    issuer: "Udemy",
    verify_url: "https://ude.my/UC-c6c3382b-3c7a-42e2-975b-33eccadff372",
    skills: ["Generative AI", "LangChain", "HuggingFace", "LLMs", "AI Applications"]
  },
  {
    id: "6",
    title: "AI Fundamentals with IBM SkillsBuild",
    issuer: "Cisco",
    verify_url: "https://www.credly.com/badges/e1dee77a-0434-4648-9b72-8c5bd3739ca3/public_url",
    skills: ["Artificial Intelligence", "AI Fundamentals", "Machine Learning Concepts"]
  }
];
