
// src/lib/whatsapp-sender.ts
'use server';

console.log("--- [WhatsApp Sender Module - Server Side STUB] ---");
console.log("--- This version is a STUB for Firebase Studio. ---");
console.log("--- Actual WhatsApp client should run locally. ---");

// import { Client, LocalAuth, type Message as WAMessage } from 'whatsapp-web.js';
// import qrcodeTerminal from 'qrcode-terminal';

// let client: Client;
// let isClientInitialized = false;
// let initializationPromise: Promise<void> | null = null;

// let latestQrCode: string | null = null;
// export type WhatsAppClientStateType = 'uninitialized' | 'qr_pending' | 'initializing' | 'ready' | 'auth_failure' | 'disconnected' | 'error' | 'loading_screen';
// let clientStatus: WhatsAppClientStateType = 'uninitialized';
// let statusMessage: string | null = 'Client (server-side) not actively initialized for local client mode.';


// function updateStatus(newStatus: WhatsAppClientStateType, message: string, qr?: string | null) {
//   console.log(`[WhatsApp Sender - STUB] Status Update: ${newStatus} - Message: "${message}" ${qr ? '- QR available' : ''}`);
//   clientStatus = newStatus;
//   statusMessage = message;
//   if (qr !== undefined) {
//     latestQrCode = qr;
//   }
//   if (newStatus === 'ready' || newStatus === 'auth_failure' || newStatus === 'disconnected' || newStatus === 'error') {
//     if (newStatus === 'ready') latestQrCode = null;
//   }
// }

/*
// This function would not be called if the client runs locally.
// It's kept here as a reference or if a hybrid model is ever needed.
export async function initializeWhatsAppClient(): Promise<void> {
  console.log(">>> [WhatsApp Sender - STUB] initializeWhatsAppClient function called - NO-OP in local client mode. <<<");
  updateStatus('uninitialized', 'Server-side client initialization is disabled for local client mode.');
  return;
}
*/

/*
// This function would not be called if the client runs locally.
export async function getWhatsAppStatusSync(): Promise<{ status: WhatsAppClientStateType; qrCode?: string | null; message?: string | null }> {
  console.log(`[WhatsApp Sender - STUB] getWhatsAppStatusSync called. Current status: ${clientStatus}`);
  return { status: clientStatus, qrCode: latestQrCode, message: statusMessage };
}
*/


// This function MIGHT still be used if the AI on the server-side decides to send a notification
// independently, assuming a WA client (even if separate) is configured for the server.
// However, for the "local client takes user message and notifies admin on transfer" flow,
// this function on the server side might not be directly involved.
// The local client would handle the admin notification.
export async function sendAdminNotificationViaWhatsApp(customerName: string = "Customer", customerQuery: string): Promise<void> {
  const adminWaNumber = process.env.ADMIN_WHATSAPP_NUMBER;
  console.log(`[WhatsApp Sender - STUB] sendAdminNotificationViaWhatsApp called for ${customerName}. Admin number from env: ${adminWaNumber ? 'SET' : 'NOT SET'}`);

  if (!adminWaNumber) {
    console.warn('[WhatsApp Sender - STUB] ADMIN_WHATSAPP_NUMBER is not set in .env. Skipping admin WhatsApp notification.');
    return;
  }
  
  // In a real server-side client scenario, you'd check client.getState() or similar
  // For this STUB, we just log.
  console.log(`[WhatsApp Sender - STUB] Pretending to send notification about: "${customerQuery}" to admin ${adminWaNumber}.`);
  console.log(`[WhatsApp Sender - STUB] In local client mode, the actual sending should happen on the local client machine.`);
  
  // Example:
  // if (clientStatus !== 'ready' || !client) {
  //   console.error(`[WhatsApp Sender] Client not ready. Cannot send admin notification.`);
  //   return;
  // }
  // const adminChatId = `${adminWaNumber.replace(/[^0-9]/g, '')}@c.us`;
  // const message = ...;
  // await client.sendMessage(adminChatId, message);
  
  return Promise.resolve(); // STUB does nothing
}

console.log("[WhatsApp Sender - STUB] Module loaded. No auto-initialization for local client mode.");
