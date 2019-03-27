import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import * as path from 'path';
import { ProxyResolver } from './modules/proxy';

async function bootstrap() {
	const schema = await buildSchema({
		resolvers: [ ProxyResolver ],
		emitSchemaFile: path.resolve(__dirname, 'schema.gql')
	});
	const server = new ApolloServer({
		schema,
		playground: true
	});

	const { url } = await server.listen(4000);
	console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();
