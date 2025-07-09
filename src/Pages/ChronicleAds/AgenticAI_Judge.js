import config from "../../config/config";
import service from "../../appwrite/database";

export default class AiJudgeService {
  static async sendAd({ adId, title, description, url }) {
    console.log("Sending ad for moderation:", { adId, title, description, url });
    try {
      const data = {
        prompt: `
          You are a content safety reviewer for a public ad platform.

          Here is a user-submitted ad:
          Title: "${title}"
          Description: "${description}"
          URL: "${url}"

          Review if this ad is:
          - Safe for public
          - Non-offensive
          - Not spam or misleading
          - Doesn't promote adult or illegal content

          Respond with only: "APPROVED" or "REJECTED" and Why.
        `,
      };

      const postEndpoint = `https://${config.appwriteFunctionId}.appwrite.global/api`;

      const response = await fetch(postEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`POST request failed with status ${response.status}`);
      }

       const result = await response.json();
       console.log("AI moderation result:", result);
    //   const rawText = data.result; // this is the string
        const status = result.includes("APPROVED") ? "APPROVED" : "REJECTED";
        const reason = result.replace(/(APPROVED|REJECTED)[:\-]?\s*/i, "").trim();
      await service.updateAd(adId, {
        moderationStatus: status,
        moderationReason: reason || result,
      });
      return { status, reason }; 
    } catch (error) {
      await service.updateAd(adId, {
        moderationStatus: "APPROVED",
      });
      console.error("Error sending prompt:", error);
      throw error;
    }
  }
}
