import type { RuntimeConfig } from 'nuxt/schema'
import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'

export function createApolloClient(config: RuntimeConfig) {
  // 🔹 Définir un link Http pour les requêtes GraphQL
  const httpLink = new HttpLink({
    uri: config.public.gqlHost,
  })

  const ngrokHeader = config.public.ngrokHeader === 'true'
    ? { 'ngrok-skip-browser-warning': 'true' }
    : {}

  // 🔹 Ajouter un middleware pour insérer les headers
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        ...ngrokHeader,
      },
    }
  })

  return new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
      },
    },
  })
}
