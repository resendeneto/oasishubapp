// Constantes e cálculo (compartilhados entre UI e camada de dados)
export const IOE_PILLAR_KEYS = ["proposito", "financas", "marketing", "gestao", "lideranca"];
export const LIFE_WHEEL = ["Espiritualidade", "Família", "Saúde", "Finanças pessoais", "Desenvolvimento pessoal", "Equilíbrio emocional", "Relacionamentos", "Propósito"];
export const BUSINESS_WHEEL = ["Clareza de visão", "Marketing", "Vendas", "Finanças empresariais", "Processos", "Liderança", "Equipe", "Execução"];

export function computeIOE(answers) {
  const pillarScores = {};
  IOE_PILLAR_KEYS.forEach((k) => {
    const arr = (answers[k] || []).filter((v) => v !== null && v !== undefined);
    pillarScores[k] = arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  });
  const generalAvg = IOE_PILLAR_KEYS.reduce((a, k) => a + pillarScores[k], 0) / IOE_PILLAR_KEYS.length;
  return { pillarScores, generalAvg, ioe: Math.round(generalAvg * 10) };
}
