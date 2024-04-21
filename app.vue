<template>
    <div>
        {{ data }}
    </div>
</template>

<script lang="ts" setup>
import { gql, useQuery } from '@urql/vue';

const { data } = await useQuery({
    query: gql`
        query {
            country(code: "FI") {
                name
                code
            }
        }
    `,
});
</script>
