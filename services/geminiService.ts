import { GoogleGenAI } from "@google/genai";
import { Loan, Covenant } from "../types";

// Initialize the API client safely. 
// If API_KEY is missing, we will fallback to mock responses in the methods.
const apiKey = process.env.API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generateLoanSummary = async (loan: Loan): Promise<string> => {
  if (!ai) {
    // Mock response if no API key
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Based on the loan agreement for ${loan.borrower}, the credit facility of ${(loan.amount / 1000000).toFixed(1)}M ${loan.currency} is currently in ${loan.status} standing. The primary risk factors are centered around the upcoming leverage ratio test in Q1 2024. Recommend close monitoring of EBITDA adjustments.`);
      }, 1500);
    });
  }

  try {
    const prompt = `
      Act as a senior credit risk analyst. 
      Analyze the following loan data and provide a concise, professional executive summary (max 3 sentences).
      Highlight any risks if compliance score is below 90.
      
      Loan Data:
      Borrower: ${loan.borrower}
      Amount: ${loan.amount} ${loan.currency}
      Status: ${loan.status}
      Compliance Score: ${loan.complianceScore}
      Number of Covenants: ${loan.covenants.length}
      Active Covenants: ${JSON.stringify(loan.covenants.map(c => ({ title: c.title, status: c.status, val: c.value, limit: c.threshold })))}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "Summary unavailable.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI analysis currently unavailable due to network or configuration issues.";
  }
};

export const explainCovenantRisk = async (covenant: Covenant, loan: Loan): Promise<string> => {
   if (!ai) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`The ${covenant.title} is critical because it measures the borrower's ability to service debt. With a current value of ${covenant.value || 'N/A'} against a threshold of ${covenant.threshold || 'N/A'}, this covenant indicates tightening liquidity conditions.`);
      }, 1200);
    });
  }

  try {
    const prompt = `
      Explain the significance of the following financial covenant in the context of a corporate loan.
      Explain why a status of "${covenant.status}" is significant here.
      Keep it professional, concise, and educational for a junior banker.
      
      Covenant: ${covenant.title}
      Description: ${covenant.description}
      Current Value: ${covenant.value || 'N/A'}
      Threshold: ${covenant.threshold || 'N/A'}
      Status: ${covenant.status}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Explanation unavailable.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI explanation unavailable.";
  }
};
