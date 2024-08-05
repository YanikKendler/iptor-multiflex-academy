package model;

import jakarta.persistence.*;

@Entity
public class AnswerOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long questionOptionId;

    @ManyToOne
    @JoinColumn(name = "questionId")
    private Question question;

    private String name;

    private boolean isCorrect;

    public AnswerOption(String name, boolean isCorrect, Question question) {
        this.name = name;
        this.isCorrect = isCorrect;
    }

    public AnswerOption() {
    }

    public Long getQuestionOptionId() {
        return questionOptionId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setQuestionOptionId(Long questionOptionId) {
        this.questionOptionId = questionOptionId;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public boolean isCorrect() {
        return isCorrect;
    }

    public void setCorrect(boolean correct) {
        isCorrect = correct;
    }
}
