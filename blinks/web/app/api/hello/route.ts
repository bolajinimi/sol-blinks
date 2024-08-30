// Import necessary modules
import { ActionGetResponse, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS } from "@solana/actions";
import { clusterApiUrl, Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

// GET Request Handler
export async function GET(request: Request) {
  try {
    const requestURL = new URL(request.url);
    const iconURL = new URL("/shoe.png", requestURL.origin);
    const responseBody: ActionGetResponse = {
      icon: iconURL.toString(),
      description: "This is a Solana shoe store!",
      title: "1.5 SOL",
      label: "Buy",
      links: {
        actions: [
          {
            href: request.url,
            label: "Buy",
            parameters: [
              { name: 'address', type: 'text', label: 'Home Address', required: true },
              { name: 'phone', type: 'text', label: 'Phone Number', required: true },
              { name: 'size', type: 'text', label: 'Shoe Size', required: true },
              // Optional parameters
              // { name: 'quantity', type: 'text', label: 'Quantity (1-10)' },
              // { name: 'color', type: 'text', label: 'Shoe Color' },
            ],
          },
        ],
      },
      type: "action",
    };
    return new Response(JSON.stringify(responseBody), {
      headers: {
        ...ACTIONS_CORS_HEADERS,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error processing GET request:", error);
    return new Response(JSON.stringify({ error: "Failed to process request" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}

// POST Request Handler
export async function POST(request: Request) {
  try {
    const requestBody: ActionPostRequest = await request.clone().json();
    const userPubKey = requestBody.account;
    const url = new URL(request.url);
    const action = url.searchParams.get("action");

    // Logging for debugging
    console.log("User Public Key:", userPubKey);
    console.log("Performing action:", action);

    const user = new PublicKey(userPubKey);
    const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed"); // Use confirmed commitment

    // Transaction
    const ix = SystemProgram.transfer({
      fromPubkey: user,
      toPubkey: new PublicKey('BVqhTFKfBmwuLLGF56FZgd7REnnfY7x6UiFrSMv4r46m'),
      lamports: 2,
    });

    const tx = new Transaction();
    if (action === "another") {
      tx.add(ix);
    }
    tx.feePayer = user;
    const { blockhash } = await connection.getLatestBlockhash({ commitment: "confirmed" });
    tx.recentBlockhash = blockhash;

    const serializedTx = tx.serialize({ requireAllSignatures: false, verifySignatures: false }).toString('base64');

    const response: ActionPostResponse = {
      transaction: serializedTx,
      message: `Transaction for ${userPubKey}`,
    };

    return new Response(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error processing POST request:", error);
    return new Response(JSON.stringify({ error: "Failed to process request" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}

// OPTIONS Request Handler
export async function OPTIONS(request: Request) {
  return new Response(null, { headers: ACTIONS_CORS_HEADERS });
}
