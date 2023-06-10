const {
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
} = require('@aws-sdk/client-cognito-identity-provider');

module.exports = async function (fastify, opts) {
  fastify.post('/signup', async function (req, reply) {
    const client = new CognitoIdentityProviderClient({
      region: 'ap-southeast-2',
    });
    const params = {
      ClientId: process.env.AWS_Cognito_ClientId || '',
      Password: req.body.password,
      Username: req.body.email,
      UserAttributes: [
        {
          Name: 'email',
          Value: req.body.email,
        },
        {
          Name: 'given_name',
          Value: req.body.given_name,
        },
        {
          Name: 'family_name',
          Value: req.body.family_name,
        },
        {
          Name: 'address',
          Value: req.body.address,
        },
      ],
    }
    const signUpCommand = new SignUpCommand(params);
    const response = await client.send(signUpCommand)
    return { success: true, data: response };
  });

  fastify.post('/sign-up/confirm-code', async function (req, reply) {
    const { email, code } = req.body;
    const client = new CognitoIdentityProviderClient({
      region: 'ap-southeast-2',
    });
    const input = { // ConfirmSignUpRequest
      ClientId: process.env.AWS_Cognito_ClientId, // required
      Username: email,
      ConfirmationCode: code, // required
    };
    const command = new ConfirmSignUpCommand(input);
    const response = await client.send(command);
    return { success: true, data: response };
  });
}
