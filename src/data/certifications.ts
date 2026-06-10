export interface Certification {
  id: string;
  title: string;
  issuer: string;
  credentialId?: string;
  credentialUrl: string;
  imageUrl: string;
  pdfUrl: string;
  skills: string[];
}

export const certifications: Certification[] = [
  {
    id: "1",
    title: "DSA with Java",
    issuer: "Apna College",
    credentialId: "66a7cc80d84663336c0980cf",
    credentialUrl: "",
    imageUrl: "/certificates/dsa-java.jpg",
    pdfUrl: "/certificates/dsa-java.pdf",
    skills: ["Java", "Data Structures", "Algorithms", "Problem Solving", "DSA"]
  },
  {
    id: "2",
    title: "Python Certification",
    issuer: "IIT Madras Pravartak (GUVI)",
    credentialUrl: "https://www.guvi.in/certificate?id=16qu5p5h82B8191ac2",
    imageUrl: "/certificates/python-guvi.jpg",
    pdfUrl: "/certificates/python-guvi.pdf",
    skills: ["Python", "Programming", "OOP", "Problem Solving"]
  },
  {
    id: "3",
    title: "AWS Academy Graduate – Cloud Foundations",
    issuer: "Amazon Web Services",
    credentialUrl: "https://www.credly.com/badges/1a45221b-8aab-486d-968e-3244e01db31a/public_url",
    imageUrl: "/certificates/aws-cloud-foundations.png",
    pdfUrl: "/certificates/aws-cloud-foundations.pdf",
    skills: ["AWS", "Cloud Computing", "Networking", "Security"]
  },
  {
    id: "4",
    title: "Complete Data Science, Machine Learning, DL, NLP Bootcamp",
    issuer: "Udemy",
    credentialUrl: "https://ude.my/UC-3a8ea8ec-dab5-4801-91bc-ba9fc5c0f389",
    imageUrl: "/certificates/data-science-ml.jpg",
    pdfUrl: "/certificates/data-science-ml.pdf",
    skills: ["Data Science", "Machine Learning", "Deep Learning", "NLP"]
  },
  {
    id: "5",
    title: "Generative AI with LangChain & HuggingFace",
    issuer: "Udemy",
    credentialUrl: "https://ude.my/UC-c6c3382b-3c7a-42e2-975b-33eccadff372",
    imageUrl: "/certificates/genai-langchain.jpg",
    pdfUrl: "/certificates/genai-langchain.pdf",
    skills: ["Generative AI", "LangChain", "LLMs", "HuggingFace"]
  },
  {
    id: "6",
    title: "AI Fundamentals with IBM SkillsBuild",
    issuer: "Cisco",
    credentialUrl: "https://www.credly.com/badges/e1dee77a-0434-4648-9b72-8c5bd3739ca3/public_url",
    imageUrl: "/certificates/ibm-ai-fundamentals.png",
    pdfUrl: "/certificates/ibm-ai-fundamentals.pdf",
    skills: ["Artificial Intelligence", "IBM SkillsBuild", "AI Fundamentals", "Machine Learning"]
  }
];
