import { Resolver, Query, Arg, Int } from 'type-graphql';
import axios from 'axios';
import { GraphQLScalarType } from 'graphql';
import cacheManager from 'cache-manager';

let memoryCache = cacheManager.caching({ store: 'memory', max: 100, ttl: 600 });

export const ObjectScalar = new GraphQLScalarType({
	name: 'ObjectScalar',
	parseLiteral: () => ({
		value: 'TypeGraphQL parseLiteral'
	}),
	parseValue: () => ({
		value: 'TypeGraphQL parseValue'
	}),
	serialize: (obj) => obj
});

@Resolver()
export class ProxyResolver {
	@Query((returns) => [ ObjectScalar ])
	async ProxyGet(
		@Arg('url', (type) => String, { nullable: false })
		url: string,
		@Arg('cache_ttl', (type) => Int, { defaultValue: 60, nullable: true })
		cache_ttl: number
	): Promise<any> {
		let cache = await memoryCache.get(url);
		if (cache) return JSON.parse(cache);

		const { data } = await axios.get(url);
		await memoryCache.set(url, JSON.stringify(data), { ttl: cache_ttl });
		return data;
	}
}
