import {
    createClient,
    fetchExchange,
    ssrExchange,
} from '@urql/vue';

export default defineNuxtPlugin(async (nuxtApp) => {
    const { csrf } = useCsrf();

    const ssr = ssrExchange({
        isClient: false,
    });

    // Extract SSR payload once app is rendered
    nuxtApp.hook('app:rendered', () => {
        // eslint-disable-next-line no-param-reassign
        nuxtApp.payload.data = {
            ...nuxtApp.payload?.data,
            urql: ssr.extractData(),
        };
    });

    const client = ref(createClient({
        url: 'http://localhost:3000/graphql',
        fetchOptions: () => ({
            headers: {
                cookie: `csrf=${useRequestEvent()!.context.csrfSecret}`,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'csrf-token': csrf,
            },
        }),
        exchanges: [
            ssr,
            fetchExchange,
        ],
    }));

    nuxtApp.provide('urql', client);
    nuxtApp.vueApp.provide('$urql', client);
});
