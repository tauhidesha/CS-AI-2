// src/app/api/whatsapp/receive-message/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { handleUserMessage } from '@/lib/actions';

export async function POST(request: NextRequest) {
  console.log(">>> [API /whatsapp/receive-message] POST request received <<<");
  try {
    const body = await request.json();
    const { message, imageDataUri, customerName } = body;

    if (!message && !imageDataUri) {
      return NextResponse.json({ error: 'Bad Request: Message or image is required.' }, { status: 400 });
    }

    console.log(`[API /whatsapp/receive-message] Processing message from: ${customerName || 'Unknown User'}, Text: "${message ? message.substring(0, 50) + '...' : ''}", Image: ${imageDataUri ? 'Yes' : 'No'}`);

    // Pass customerName if available, handleUserMessage can decide what to do with it.
    // For now, handleUserMessage doesn't directly use customerName from this API.
    const aiResponse = await handleUserMessage(message || '', imageDataUri);

    console.log(`[API /whatsapp/receive-message] AI Response: "${aiResponse}"`);
    return NextResponse.json({ reply: aiResponse });

  } catch (error: any) {
    console.error('[API /whatsapp/receive-message] Error processing message:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message || String(error) }, { status: 500 });
  }
}
