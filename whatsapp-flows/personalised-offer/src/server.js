/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * Licensed under the MIT license.
 */

import express from "express";
import crypto from "crypto";
import {
  decryptRequest,
  encryptResponse,
  FlowEndpointException,
} from "./encryption.js";
import { getNextScreen } from "./flow.js";

const app = express();

app.use(
  express.json({
    verify: (req, _res, buffer, encoding) => {
      req.rawBody = buffer?.toString(encoding || "utf8");
    },
  })
);

const {
  APP_SECRET,
  PRIVATE_KEY,
  PASSPHRASE = "",
  PORT = "3000",
} = process.env;

app.post("/", async (req, res) => {
  if (!PRIVATE_KEY) {
    return res.status(500).send('Private key is empty. Configure "PRIVATE_KEY".');
  }

  if (!isRequestSignatureValid(req)) {
    return res.status(432).send();
  }

  let decryptedRequest;
  try {
    decryptedRequest = decryptRequest(req.body, PRIVATE_KEY, PASSPHRASE);
  } catch (error) {
    console.error(error);
    if (error instanceof FlowEndpointException) {
      return res.status(error.statusCode).send();
    }
    return res.status(500).send();
  }

  const { aesKeyBuffer, initialVectorBuffer, decryptedBody } = decryptedRequest;
  console.log("Decrypted request:", decryptedBody);

  try {
    const screenResponse = await getNextScreen(decryptedBody);
    return res.send(
      encryptResponse(screenResponse, aesKeyBuffer, initialVectorBuffer)
    );
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
});

app.get("/", (_req, res) => {
  res.send("WhatsApp Flows Personalised Offer endpoint is active.");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

function isRequestSignatureValid(req) {
  if (!APP_SECRET) {
    console.warn("APP_SECRET not configured. Signature validation skipped.");
    return true;
  }

  const signatureHeader = req.get("x-hub-signature-256");
  if (!signatureHeader) {
    return false;
  }

  const receivedSignature = Buffer.from(
    signatureHeader.replace("sha256=", ""),
    "utf8"
  );
  const digest = crypto
    .createHmac("sha256", APP_SECRET)
    .update(req.rawBody)
    .digest("hex");
  const expectedSignature = Buffer.from(digest, "utf8");

  return (
    receivedSignature.length === expectedSignature.length &&
    crypto.timingSafeEqual(receivedSignature, expectedSignature)
  );
}
