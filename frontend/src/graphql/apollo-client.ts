import { HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from '@apollo/experimental-nextjs-app-support';
import { cookies } from 'next/headers';

export const { getClient } = registerApolloClient(() => {
  const httpLink = new HttpLink({
    uri: 'http://localhost:3001/graphql',
    fetchOptions: { cache: 'no-store' },
  });
  const authLink = setContext(async (_, { headers }) => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    return {
      headers: {
        ...headers,
        authorization: accessToken ? `${accessToken}` : '',
      },
    };
  });
  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
});
