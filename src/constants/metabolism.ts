export const ACTIVITY_LEVELS = [
    {
        value: "sedentary",
        label: "Sedentário",
        description: "Pouco ou nenhum exercício",
        multiplier: 1.2,
    },
    {
        value: "light",
        label: "Levemente Ativo",
        description: "Exercício leve 1-3 dias/semana",
        multiplier: 1.375,
    },
    {
        value: "moderate",
        label: "Moderadamente Ativo",
        description: "Exercício moderado 3-5 dias/semana",
        multiplier: 1.55,
    },
    {
        value: "active",
        label: "Muito Ativo",
        description: "Exercício pesado 6-7 dias/semana",
        multiplier: 1.725,
    },
    {
        value: "very_active",
        label: "Extremamente Ativo",
        description: "Exercício muito pesado + trabalho físico",
        multiplier: 1.9,
    },
];

export const calculateBMR = (weight: number, height: number, age: number, gender: "M" | "F") => {
    // Mifflin-St Jeor Equation
    if (gender === "M") {
        return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        return 10 * weight + 6.25 * height - 5 * age - 161;
    }
};

export const calculateTDEE = (bmr: number, activityLevel: string) => {
    const level = ACTIVITY_LEVELS.find((l) => l.value === activityLevel);
    return level ? bmr * level.multiplier : bmr * 1.2; // Default to sedentary if not found
};
