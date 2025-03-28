//@ts-check

/**
 * @type {import("@trivago/prettier-plugin-sort-imports").PrettierConfig}
 */
export default {
    tabWidth: 4,
    printWidth: 100,
    semi: true,
    experimentalTernaries: true,
    trailingComma: "es5",
    arrowParens: "always",

    importOrder: [
        "^node(:.*)?$",
        "^react|react-dom$",
        "<THIRD_PARTY_MODULES>",
        "^@ylfjuk",
        "^[@~&]/",
        "^../",
        "^[./]",
        ".(s?css)",
        ".(svg|png)",
    ],

    importOrderSeparation: false,
    importOrderSortSpecifiers: true,
    importOrderCaseInsensitive: false,
    importOrderGroupNamespaceSpecifiers: true,

    plugins: ["@trivago/prettier-plugin-sort-imports"],
};
