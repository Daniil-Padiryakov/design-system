import InputSearch from "./InputSearch.vue";

export default {
    title: "Общие/InputSearch",
    component: InputSearch,
};

export const standart = () => ({
    components: { InputSearch },
    data() {
        return {
            value: "",
            placeholder: "Поиск по параметрам",
        };
    },
    methods: {
        onSearch(value) {
            alert(value);
        },
    },
    template: `
    <div>
       <InputSearch v-model="value" @onSearch="onSearch" :placeholder="placeholder"></InputSearch>
    </div>
    `,
});