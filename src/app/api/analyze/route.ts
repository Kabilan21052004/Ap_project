import { NextResponse } from 'next/server';

// Replace with your Gemini API key
const GEMINI_API_KEY = 'AIzaSyAcfOKnaIa6IHyDrY-e_vWB4J2wyrd4zQg';
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function POST(request: Request) {
  try {
    const { text, fileType } = await request.json();
    console.log('Received request with fileType:', fileType);

    if (!text || typeof text !== 'string') {
      console.error('Invalid or missing text content');
      return NextResponse.json(
        { error: 'Invalid or missing resume text' },
        { status: 400 }
      );
    }

    try {
      console.log('Making request to Gemini API...');
      
      const prompt = `You are a professional resume analyzer and career coach. Analyze the following resume and provide detailed feedback in these categories:

1. Overall Impression
2. Content & Structure
3. Skills & Qualifications
4. Impact & Achievements
5. Areas for Improvement
6. Specific Recommendations

Format your response in Markdown with appropriate headings and bullet points. Be constructive but honest in your feedback.

Resume text:
${text}`;

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: {
            parts: [{
              text: prompt
            }]
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
            topP: 0.8,
            topK: 40
          }
        }),
        cache: 'no-store'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Gemini API error response:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        
        return NextResponse.json(
          { 
            error: 'Error from Gemini API', 
            details: errorData?.error?.message || response.statusText
          },
          { status: response.status }
        );
      }

      const data = await response.json();
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.error('Unexpected Gemini API response format:', data);
        throw new Error('Invalid response format from Gemini API');
      }

      const analysis = data.candidates[0].content.parts[0].text;
      return NextResponse.json({ analysis });
    } catch (error) {
      console.error('Gemini API request failed:', error);
      return NextResponse.json(
        { 
          error: 'Failed to communicate with Gemini API',
          details: error instanceof Error ? error.message : 'Unknown error occurred'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Request processing error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 