/* eslint-disable no-global-assign */
import { ActionGetResponse, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS } from "@solana/actions";
import { clusterApiUrl, Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

export async function GET(request: Request) {
  const responseBody: ActionGetResponse = {
    icon: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
    description: "This is a solana shoe store!",
    title: "1.5 SOL",
    label: "Buy",
    links: {
      actions: [
        {
          href: request.url,
          label: "Buy",
          parameters: [
            {
              name: 'address',
              type: 'text',
              label: 'home address',
              required: true,
            },
            {
              name: 'phone',
              type: 'text',
              label: 'phone number',
              required: true,
            },
            {
              name: 'size',
              type: 'text',
              label: 'shoe size',
              required: true,
            },
            // {
            //   name: 'quantity',
            //   type: 'text',
            //   label: '1-10',
            // },
            // {
            //   name: 'color',
            //   type: 'text',
            //   label: 'shoe color',
            //   required: true,
            // },
          ],
        },


      ]
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
}

export async function POST(request: Request) {
  try {
    const requestBody: ActionPostRequest = await request.clone().json();
    const userPubKey = requestBody.account;
    console.log(userPubKey);

    const url = new URL(request.url)
    const action = url.searchParams.get("action");

    console.log("performing action "+action)

    const user = new PublicKey(userPubKey);
    const connection = new Connection(clusterApiUrl("testnet"));
    const ix = SystemProgram.transfer({
        fromPubkey: user,
        toPubkey: new PublicKey('BVqhTFKfBmwuLLGF56FZgd7REnnfY7x6UiFrSMv4r46m'),
        lamports: 1
    });


    const tx = new Transaction();
    if (action === "another"){
      tx.add(ix)
    }
    tx.feePayer = user;
    const bh = (await connection.getLatestBlockhash({commitment: "finalized"})).blockhash;
    tx.recentBlockhash = bh
    const serialTx  = tx.serialize({requireAllSignatures: false, verifySignatures: false}).toString('base64');

    const response: ActionPostResponse = {
      transaction: serialTx,
      message: "hello " + userPubKey,
    };

    // Create and return the Response object in one step
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
        "Access-Control-Allow-Origin": "*", // Allow requests from any origin
      },
    });
  }
}

export async function OPTIONS(request: Request) {
  return new Response(null, {headers: ACTIONS_CORS_HEADERS});


}

