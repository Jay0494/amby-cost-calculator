// Seed usage per product (kg per finished unit)
const SEED_KG = {
    family: 2.45,
    decanter: 0.61,
    pouch: 0.07,
    business: 2.45
};

// 25kg gas for 100kg dates => 0.25kg gas per 1kg dates
const GAS_PER_KG_SEEDS = 25 / 100; // 0.25

// Material configuration
const materials = {
    dateSeeds: {
        type: "seed",
        costId: "cost_dateSeeds",
        unitId: "unit_dateSeeds",
        usedIn: ["family", "decanter", "pouch", "business"]
    },
    familyContainer: {
        type: "material",
        costId: "cost_familyContainer",
        unitId: "unit_familyContainer",
        usedIn: ["family"]
    },
    decanterContainer: {
        type: "material",
        costId: "cost_decanterContainer",
        unitId: "unit_decanterContainer",
        usedIn: ["decanter"]
    },
    pouchContainer: {
        type: "material",
        costId: "cost_pouchContainer",
        unitId: "unit_pouchContainer",
        usedIn: ["pouch"]
    },
    businessContainer: {
        type: "material",
        costId: "cost_businessContainer",
        unitId: "unit_businessContainer",
        usedIn: ["business"]
    },
    sticker250: {
        type: "material",
        costId: "cost_sticker250",
        unitId: "unit_sticker250",
        usedIn: ["decanter", "pouch"]
    },
    sticker1L: {
        type: "material",
        costId: "cost_sticker1L",
        unitId: "unit_sticker1L",
        usedIn: ["family", "business"]
    },
    outerFilm: {
        type: "material",
        costId: "cost_outerFilm",
        unitId: "unit_outerFilm",
        usedIn: ["family", "decanter", "business"] // pouch has no outer film
    },
    innerFilm: {
        type: "material",
        costId: "cost_innerFilm",
        unitId: "unit_innerFilm",
        usedIn: ["family", "decanter", "pouch", "business"]
    },
    packaging: {
        type: "material",
        costId: "cost_packaging",
        unitId: "unit_packaging",
        usedIn: ["family", "decanter", "pouch", "business"]
    },
    branding: {
        type: "material",
        costId: "cost_branding",
        unitId: "unit_branding",
        usedIn: ["family", "decanter", "pouch", "business"]
    },
    // GAS with special logic tied to seed usage
    gas: {
        type: "gas",
        costId: "cost_gas",
        unitId: "unit_gas",
        usedIn: ["family", "decanter", "pouch", "business"]
    }
    };

    // Which container determines if we should calculate that product
    const productContainerField = {
    family: "familyContainer",
    decanter: "decanterContainer",
    pouch: "pouchContainer",
    business: "businessContainer"
    };

    function getCostPerUnit(costId, unitId) {
    const cost = parseFloat(document.getElementById(costId).value);
    const units = parseFloat(document.getElementById(unitId).value);

    if (!cost || !units || units === 0) return null;

    // generic: cost per kg (for seeds/gas) or cost per piece (for materials)
    return cost / units;
    }

    function calculateProductCost(productKey) {
    let total = 0;

    Object.values(materials).forEach(mat => {
        if (!mat.usedIn.includes(productKey)) return;

        const cpu = getCostPerUnit(mat.costId, mat.unitId);
        if (cpu == null) return; // material not provided → skip it

        if (mat.type === "seed") {
        // cost per kg seeds * kg required for that product
        total += cpu * SEED_KG[productKey];
        } else if (mat.type === "gas") {
        // gas per unit = seedKg * 0.25
        const gasKgForProduct = SEED_KG[productKey] * GAS_PER_KG_SEEDS;
        total += cpu * gasKgForProduct;
        } else {
        // normal materials: assume 1 piece per finished product
        total += cpu * 1;
        }
    });

    return total;
    }

    function shouldCalculateProduct(productKey) {
    const containerKey = productContainerField[productKey];
    const container = materials[containerKey];
    const units = parseFloat(
        document.getElementById(container.unitId).value
    );

    // If container units are empty or zero -> don't calculate this product
    if (!units || units === 0) return false;
    return true;
    }

    function calculateCosts() {
    const results = {
        family: document.getElementById("result_family"),
        decanter: document.getElementById("result_decanter"),
        pouch: document.getElementById("result_pouch"),
        business: document.getElementById("result_business")
    };

    ["family", "decanter", "pouch", "business"].forEach(key => {
        if (!shouldCalculateProduct(key)) {
        results[key].value = ""; // no summary if container not entered
        return;
        }

        const cost = calculateProductCost(key);
        results[key].value = "₦" + cost.toFixed(2);
    });
    }
