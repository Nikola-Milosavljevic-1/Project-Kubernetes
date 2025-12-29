/**
 * Calcule la probabilité de gagner en fonction du montant misé
 * Plus on mise, plus on a de chances de gagner
 *
 * Formule : probabilité de base (1%) + bonus selon le montant
 * Le bonus augmente progressivement avec la mise
 *
 * @param {number} betAmount - Le montant misé par le joueur
 * @returns {number} La probabilité de gagner (entre 0 et 1)
 */
function calculateWinProbability(betAmount) {
  // Probabilité de base : 0.01% (0.0001)
  const baseProbability = 0.0001;

  // Bonus : plus on mise, plus on a de chances
  // Pour 10 jetons : +0.1%, pour 50 : +0.5%, pour 100 : +1%, etc.
  const bonus = Math.min(betAmount * 0.001, 0.05); // Maximum 5% de bonus

  return Math.min(baseProbability + bonus, 0.1); // Maximum 10% de chance au total
}

/**
 * Détermine si le joueur a gagné ou perdu
 * Utilise la probabilité calculée pour faire un tirage aléatoire
 *
 * @param {number} betAmount - Le montant misé
 * @returns {boolean} true si le joueur gagne, false sinon
 */
function checkWin(betAmount) {
  const probability = calculateWinProbability(betAmount);
  const random = Math.random(); // Nombre entre 0 et 1

  // Si le nombre aléatoire est inférieur à la probabilité, on gagne
  return random < probability;
}

module.exports = {
  calculateWinProbability,
  checkWin
};
