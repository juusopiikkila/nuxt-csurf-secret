import {
    createClient,
    fetchExchange,
    ssrExchange,
} from '@urql/vue';

export default defineNuxtPlugin(async (nuxtApp) => {
    const { csrf } = useCsrf();

    const ssr = ssrExchange({
        isClient: true,
    });

    // Restore SSR payload once app is created
    nuxtApp.hook('app:created', () => {
        if (nuxtApp.payload.data?.urql) {
            ssr.restoreData(nuxtApp.payload.data.urql);
        }
    });

    const client = ref(createClient({
        url: 'http://localhost:3000/graphql',
        fetchOptions: () => ({
            headers: {
                ...csrf ? {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'csrf-token': csrf,
                } : {},
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
