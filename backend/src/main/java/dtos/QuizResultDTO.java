package dtos;

import model.AnswerOption;

import java.util.List;

public record QuizResultDTO(Long quizResultId, List<AnswerOption> selectedAnswers, int score) {
}
