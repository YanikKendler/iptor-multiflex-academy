package model;

import jakarta.persistence.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;

@Entity
public class QuizResult {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    Long quizResultId;

    @ManyToOne
    private Video video;

    @ManyToOne
    private User user;

    private static final List<AnswerOption> selectedAnswers = new LinkedList<>();

    private int score;

    private LocalDateTime timestamp;

    public QuizResult(Video video, User user, int score) {
        this();
        this.video = video;
        this.user = user;
        this.score = score;
    }

    public QuizResult() {
        this.timestamp = LocalDateTime.now();
    }

    public static List<AnswerOption> getSelectedAnswers() {
        return selectedAnswers;
    }

    public void addQuestionResult(AnswerOption questionResults) {
        QuizResult.selectedAnswers.add(questionResults);
    }

    public Long getQuizResultId() {
        return quizResultId;
    }

    public void setQuestionResults(List<AnswerOption> questionResults) {
        QuizResult.selectedAnswers.clear();
        QuizResult.selectedAnswers.addAll(questionResults);
    }

    public List<AnswerOption> getQuestionResults() {
        return selectedAnswers;
    }

    public Video getVideo() {
        return video;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public void setVideo(Video video) {
        this.video = video;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }
}
