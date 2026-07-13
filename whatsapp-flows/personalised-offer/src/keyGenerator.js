/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * Licensed under the MIT license.
 */

import crypto from "crypto";

const passphrase = process.argv[2];

if (!passphrase) {
  throw new Error(
    "Passphrase is empty. Use: node src/keyGenerator.js {passphrase}"
  );
}

try {
  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
      cipher: "des-ede3-cbc",
      passphrase,
    },
  });

  console.log(`Successfully created your public/private key pair.

PASSPHRASE="${passphrase}"

PRIVATE_KEY="${keyPair.privateKey}"

PUBLIC KEY:
${keyPair.publicKey}`);
} catch (error) {
  console.error("Error while creating public/private key pair:", error);
}
