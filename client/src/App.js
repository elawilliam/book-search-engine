import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

// Create main GraphQL API endpoint //
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Create middleware to attach JWT token to each request as an `authorization` header //
const authLink = setContext((_, { headers }) => {
  // Get authentication token from local storage if available //
  const token = localStorage.getItem('id_token');
  // Return headers to the context so httpLink can read them //
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // Set up client to execute the `authLink` middleware prior to making the request to our GraphQL API //
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Routes>
            <Route
              path='/'
              element={<SearchBooks />}
            />
            <Route
              path='/saved'
              element={<SavedBooks />}
            />
            <Route
              path='*'
              element={<h1 className='display-2'>Wrong page!</h1>}
            />
          </Routes>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;