import { NextResponse } from 'next/server';
import { generateSystemPrompt } from '../../portfolioContext';

export async function POST(req) {
  try {
    const { message } = await req.json();

    // Check if we have the required environment variables
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured in environment variables');
      return NextResponse.json(
        { 
          success: false,
          error: 'Chat service is not configured properly. Please contact the site administrator to set up the API key.' 
        },
        { status: 500 }
      );
    }

    // Prepare the request to the Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{
              text: `${generateSystemPrompt()}

The user said: "${message}"`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      
      if (response.status === 429) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Rate limit exceeded. Please try again later.' 
          },
          { status: 429 }
        );
      } else {
        return NextResponse.json(
          { 
            success: false,
            error: `Failed to get response from Gemini API. Status: ${response.status}` 
          },
          { status: 500 }
        );
      }
    }

    const data = await response.json();
    
    // Extract the response text from the Gemini API response
    let botResponse = 'I\'m sorry, I couldn\'t understand that. Can you please rephrase?';
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      botResponse = data.candidates[0].content.parts[0].text || botResponse;
    }

    return NextResponse.json({ 
      success: true, 
      response: botResponse 
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error in chat API' 
      },
      { status: 500 }
    );
  }
}