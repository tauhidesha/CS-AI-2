// This file can be deleted as the WhatsApp client status will be managed locally.
// Keeping it as an empty placeholder for now if you prefer a soft delete.
// Or it can be removed entirely from the project.

// import { NextResponse } from 'next/server';
// export async function GET() {
//   return NextResponse.json({ 
//     status: 'disabled', 
//     message: 'WhatsApp client runs locally for testing. This server-side status API is not active.' 
//   });
// }

// For a hard delete, this file would be removed.
// For now, let's make it clear it's not used.
import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({message: "This API endpoint is deprecated as WhatsApp client runs locally for testing." }, { status: 404 });
}
