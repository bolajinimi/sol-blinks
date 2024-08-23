import { ActionGetResponse, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS } from "@solana/actions";
import {PublicKey, SystemProgram, Transaction} from "@solana/web3.js";

export async function GET(request: Request) {
  const responseBody: ActionGetResponse = {
    icon: "https://cryptologos.cc/logos/solana-sol-logo.png",
    description: "Hello, World!",
    title: "Hello, World!",
    label: "click me!",
    error: {
      message: "link not implemented yet",
    },
    type: "action",
  };

  // Create and return the Response object in one step
  return new Response(JSON.stringify(responseBody), {
    headers: {
      ...ACTIONS_CORS_HEADERS,
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", // Allow requests from any origin
    },
  });
}

export async function POST(request: Request) {
  try {
    const requestBody: ActionPostRequest = await request.clone().json(); // Clone the request to avoid locking issues
    const userPubKey = requestBody.account;
    console.log(userPubKey);

    const tx = new Transaction();
    tx.feePayer = new PublicKey(userPubKey);
    tx.recentBlockhash = SystemProgram.programId.toBase58();
    const serialTx  = tx.serialize({requireAllSignatures: false, verifySignatures: false}).toString('base64');

    const response: ActionPostResponse = {
      transaction: serialTx,
      message: "hello " + userPubKey,
    };

    // Create and return the Response object in one step
    return new Response(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Allow requests from any origin
      },
    });
  } catch (error) {
    console.error("Error processing POST request:", error);
    return new Response(JSON.stringify({ error: "Failed to process request" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Allow requests from any origin
      },
    });
  }
}

export async function OPTIONS(request: Request) {
  return new Response(null, {headers: ACTIONS_CORS_HEADERS});
  // try {
  //   const requestBody: ActionPostRequest = await request.clone().json(); // Clone the request to avoid locking issues
  //   const userPubKey = requestBody.account;
  //   console.log(userPubKey);

  //   const response: ActionPostResponse = {
  //     transaction: "",
  //     message: "hello " + userPubKey,
  //   };

  //   // Create and return the Response object in one step
  //   return new Response(JSON.stringify(response), {
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Access-Control-Allow-Origin": "*", // Allow requests from any origin
  //     },
  //   });
  // } catch (error) {
  //   console.error("Error processing POST request:", error);
  //   return new Response(JSON.stringify({ error: "Failed to process request" }), {
  //     status: 500,
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Access-Control-Allow-Origin": "*", // Allow requests from any origin
  //     },
  //   });
  // }
}

