import "@/components/resources";

import { action } from "@storybook/addon-actions";
import BtnFavorite from "./BtnFavorite.vue";

export default {
    title: "Общие/BtnFavorite",
    component: BtnFavorite,
};

export const normal = () => ({
    components: { BtnFavorite },
    methods: {
        onClick: action("click"),
    },
    template: "<BtnFavorite @click='onClick'/>",
});

export const isLoading = () => ({
    components: { BtnFavorite },
    methods: {
        onClick: action("click"),
    },
    template: "<BtnFavorite @click='onClick' :is-loading='true'/>",
});

export const isActive = () => ({
    components: { BtnFavorite },
    methods: {
        onClick: action("click"),
    },
    template: "<BtnFavorite @click='onClick' :is-active='true'/>",
});
