export async function getQuestionBank({
  subject = "",
  concept = "",
  difficulty = "",
  mode = "",
} = {}) {
  const { default: questions } = await import("../data/questions.json");
  return questions.filter(
    (question) =>
      (!subject || question.subject === subject) &&
      (!concept || question.concept === concept) &&
      (!difficulty || question.difficulty === difficulty) &&
      (!mode || question.question_type === mode),
  );
}
