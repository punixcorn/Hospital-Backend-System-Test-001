import { GEMINI_API_KEY } from "../constants/env.js";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export interface LLMdata {
	actionable_steps: {
		checklist: string;
		plan: string;
		number_of_days: number;
		interval_between_days: number;
	};
}

/**
 * Extracts actionable steps and scheduling information from a doctor's note.
 * Returns a JSON object with the following structure:
 *
 * {
 *   "actionable_steps": {
 *     "checklist": "string",
 *     "plan": "string",
 *     "number_of_days": "string",
 *     "interval_between_days": number
 *   }
 * }
 *
 * @param doctorNote - The doctor's note to parse.
 * @returns A JSON object with the extracted information, or an object with an error message.
 */
export const extractActionableSteps = async (
	doctorNote: string,
): Promise<LLMdata | { error: string }> => {
	const prompt = `
You are an AI assistant specializing in extracting actionable steps and scheduling information from doctor's notes. Your output MUST ALWAYS be a JSON object with the following structure:

{
  "actionable_steps": {
    "checklist": "string",
    "plan": "string",
    "number_of_days": "string",
    "interval_between_days": number
  }
}


**Explanation of the JSON fields:**

*   **actionable_steps:** This is the main key containing all extracted information.  It will always be the top-level key.
    *   **checklist:**  A string containing a concise checklist of immediate, one-time tasks required, e.g., "Buy Amoxicillin 500mg",  "Schedule follow-up appointment with Dr. Smith".  If there are no immediate one-time tasks from the note, the value should be an empty string "".
    *   **plan:** A string describing a schedule of actions including frequency, duration, and specific reminders. e.g., "Take Amoxicillin 500mg daily for 7 days", "Apply ointment to affected area twice daily for 2 weeks". If there is no schedule from the note, the value should be an empty string "".
    *   **number_of_days:**  A string, representing the *total number* of days for which a medication or treatment is prescribed. e.g., "7", "14", "30". If no duration is specified in the note, the value should be an empty string "".
    *   **interval_between_days:** A number, representing the interval in *days* between taking medication/performing treatment, as specified in the doctor's note.  For example, taking a drug every other day would have an interval of '1'.  Taking a drug every day would have an interval of '0'. If the note doesn't explicitly specify any interval or implies daily use, the value should be '0'.  If there is no medication/treatment involved, the value should be '0'.


**Example Input Doctor's Note:**

"Patient to take Amoxicillin 500mg daily for 7 days. Purchase medication at pharmacy. Schedule a follow-up appointment in two weeks."

**Expected JSON Output:**


{
  "actionable_steps": {
    "checklist": "Buy Amoxicillin 500mg, Schedule follow-up appointment with Dr. Smith",
    "plan": "Take Amoxicillin 500mg daily for 7 days",
    "number_of_days": "7",
    "interval_between_days": 0
  }
}


**Important Considerations:**

*   ALWAYS return valid JSON. Ensure correct syntax and escaping.
*   If the note does not contain information for a particular field (checklist, plan, number_of_days), return an empty string "".
*   Focus on ONLY extracting actionable steps and the specified schedule information. Do not provide additional explanation or context.
*   Prioritize accuracy and completeness within the constraints of the defined JSON structure.
*   Do not return anything else than JSON.

Now, analyze the following doctor's note and provide your response in the specified JSON format:

[DOCTOR_NOTE_HERE]
`;

	const filledPrompt = prompt.replace("[DOCTOR_NOTE_HERE]", doctorNote);
	try {
		const result = await model.generateContent(filledPrompt);
		console.log(result.response.text());
		const data = result.response
			.text()
			.replace("```json", "")
			.replace("```", "");
		return JSON.parse(data) as LLMdata;
	} catch (err) {
		return {
			error: err.message,
		};
	}
};
