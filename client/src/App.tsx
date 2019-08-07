import React from 'react';
import logo from './logo.svg';
import './App.css';

import Amplify, { Auth } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react/dist/Auth';
import AWSAppSyncClient from 'aws-appsync';
import { Rehydrated } from './Rehydrated';
import { AUTH_TYPE } from 'aws-appsync/lib/link/auth-link';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";


Amplify.configure({
  Auth: {
    region: process.env.REACT_APP_AWS_AUTH_REGION, // REQUIRED - Amazon Cognito Region
    userPoolId: process.env.REACT_APP_USER_POOL_ID, // OPTIONAL - Amazon Cognito User Pool ID
    userPoolWebClientId: process.env.REACT_APP_CLIENT_APP_ID, // User Pool App Client ID
  },
});

const client = new AWSAppSyncClient({
  url: process.env.REACT_APP_GRAPHQL_ENDPOINT || '',
  region: process.env.REACT_APP_AWS_CLIENT_REGION || '',
  auth: {
    type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
    jwtToken: async () =>
      (await Auth.currentSession()).getIdToken().getJwtToken(),
  },
});

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
    <ApolloHooksProvider client={client}>
      <Rehydrated client={client}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
      </Rehydrated>
    </ApolloHooksProvider>
    </ApolloProvider>
  );
}

// export default App;
export default withAuthenticator(App, { includeGreetings: true });
