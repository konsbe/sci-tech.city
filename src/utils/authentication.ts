import { BaseClient, Issuer, custom, generators } from "openid-client";
import { ErrorResponse } from "../app/actions";

async function setupKeycloakClient() {
  const keycloakIssuer = await Issuer.discover("https://accounts.google.com");
  console.log('Discovered issuer %s %O', keycloakIssuer.issuer, keycloakIssuer.metadata);
  
  const client = new keycloakIssuer.Client({
    client_id: "sci-tech.city",
    client_secret:
      "TQV5U29k1gHibH5bx1layBo0OSAvAbRT3UYW3EWrSYBB5swxjVfWUa1BS8lqzxG/0v9wruMcrGadany3",
    redirect_uri: "http://localhost:3000/",
  });
  
  
  const code_verifier = generators.codeVerifier();
  const code_challenge = generators.codeChallenge(code_verifier);
  
  // This must happen on server-side b/c the library is not available in the browser:
  // const code_verifier = generators.codeVerifier();
  // const code_challenge = generators.codeChallenge(code_verifier);
  const authorizationUrl = client.authorizationUrl({
    scope: "openid email profile rights",
    code_challenge,
    code_challenge_method: "S256",
  });

}



export function isErrorResponse(object: unknown): object is ErrorResponse {
  return (
      typeof object === 'object' &&
      object !== null &&
      'message' in object &&
      'code' in object &&
      typeof (object as ErrorResponse).message === 'string' &&
      typeof (object as ErrorResponse).code === 'number'
  );
}


export const unauthorizedErrorCode = {message: 'Unauthorized', code: 401}

// setupKeycloakClient();
