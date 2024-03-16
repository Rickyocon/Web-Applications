document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('calculateButton').addEventListener('click', function() {
        const gender = document.querySelector('input[name="gender"]:checked').value;
        let weight = parseFloat(document.getElementById('weight').value);
        const weightUnit = document.querySelector('input[name="weightUnit"]:checked').value;
        let timeSinceLastDrink = parseFloat(document.getElementById('timeSinceLastDrink').value);
        const timeUnit = document.querySelector('input[name="timeUnit"]:checked').value;
        const drinkType = document.getElementById('drinkType').value;
        const ounces = parseFloat(document.getElementById('ounces').value);

        if (weightUnit === 'kilograms') {
            weight *= 2.20462; // Convert to pounds
        }
        if (timeUnit === 'minutes') {
            timeSinceLastDrink /= 60; // Convert to hours
        }

        const standardDrinks = calculateStandardDrinks(drinkType, ounces);
        const drinkingLevel = categorizeDrinkingLevel(standardDrinks);
        const bac = calculateBAC(gender, weight, standardDrinks, timeSinceLastDrink, drinkingLevel);

        displayResults(bac, drinkingLevel);
    });

    document.getElementById('resetButton').addEventListener('click', function() {
        document.getElementById('bacForm').reset();
        document.getElementById('result').innerHTML = '';
        document.body.className = 'app-background'; // Reapply the default background class
    });
});

function calculateStandardDrinks(drinkType, ounces) {
    const alcoholPercentage = { beer: 5, maltLiquor: 7, wine: 12, hardLiquor: 40 };
    const alcoholContent = ounces * (alcoholPercentage[drinkType] / 100);
    return alcoholContent / 0.6; // Assumes 0.6 ounces of alcohol per standard drink
}

function categorizeDrinkingLevel(standardDrinks) {
    if (standardDrinks <= 2) return 'Light';
    else if (standardDrinks > 2 && standardDrinks <= 4) return 'Moderate';
    else return 'Heavy';
}

function calculateBAC(gender, weight, standardDrinks, hours, drinkingLevel) {
    const r = gender === 'male' ? 0.68 : 0.55;
    const alcoholGrams = standardDrinks * 14; // 14 grams per standard drink
    const weightGrams = weight * 453.592; // Convert pounds to grams
    let bac = (alcoholGrams / (weightGrams * r)) * 100;
    
    const metabolismRates = {
        'Light': 0.015,
        'Moderate': 0.017,
        'Heavy': 0.02 // Corrected rate
    };
    
    const metabolismRate = metabolismRates[drinkingLevel];
    bac -= metabolismRate * hours;

    return Math.max(0, bac).toFixed(3); // Ensure BAC does not go negative
}

function displayResults(bac, drinkingLevel) {
    const resultElement = document.getElementById('result');
    const bodyElement = document.body;
    bodyElement.className = 'app-background'; // Always apply the default background class

    bodyElement.classList.remove('light-drinking', 'moderate-drinking', 'heavy-drinking');
    if (bac >= 0.02 && bac < 0.05) {
        bodyElement.classList.add('light-drinking');
    } else if (bac >= 0.05 && bac < 0.08) {
        bodyElement.classList.add('moderate-drinking');
    } else if (bac >= 0.08) {
        bodyElement.classList.add('heavy-drinking');
    }

    let message = `Your estimated BAC is ${bac}. Drinking Level: ${drinkingLevel}.<br>`;
       if (bac < 0.02) {
        message += 'No significant effects detected.';
    } else if (bac < 0.05) {
        message += 'You will feel relaxed, experience altered mood, feel a little warmer, and may make poor judgments.';
    } else if (bac < 0.08) {
        message += 'Your behavior may become exaggerated. You may speak louder and gesture more. You may also begin to lose control of small muscles, like the ability to focus your eyes, so vision will become blurry.';
    } else if (bac < 0.10) {
        message += 'This is the current legal limit in the U.S., other than Utah, and at this level, it is considered illegal and unsafe to drive. You will lose more coordination, so your balance, speech, reaction times, and even hearing will get worse.';
    } else if (bac < 0.15) {
        message += 'Reaction time and control will be reduced, speech will be slurred, thinking and reasoning are slower, and the ability to coordinate your arms and legs is poor.';
    } else if (bac < 0.20) {
        message += 'This BAC is very high. You will have much less control over your balance and voluntary muscles. Walking and talking are difficult. You may fall and hurt yourself.';
    } else if (bac < 0.30) {
        message += 'Confusion, feeling dazed, and disorientation are common. Sensations of pain will change, so if you fall and seriously hurt yourself, you may not notice, and you are less likely to do anything about it. Nausea and vomiting are likely to occur, and the gag reflex will be impaired, which could cause choking or aspirating on vomit. Blackouts begin at this BAC, so you may participate in events that you don’t remember.';
    } else if (bac < 0.40) {
        message += 'At this point, you may be unconscious and your potential for death increases. Along with a loss of understanding, at this BAC you’ll also experience severe increases in your heart rate, irregular breathing, and may have a loss of bladder control.';
    } else {
        message += 'This level of BAC may put you in a coma or cause sudden death because your heart or breathing will suddenly stop. This is what is known as a lethal blood alcohol level.';
    }
    resultElement.innerHTML = message;
}



document.getElementById('resetButton').addEventListener('click', function() {
    document.getElementById('bacForm').reset();
    document.getElementById('result').innerHTML = '';
    document.body.className = 'app-background'; // Reapply the default background class
});

