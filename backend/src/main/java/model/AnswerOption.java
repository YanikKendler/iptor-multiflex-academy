package model;

import jakarta.persistence.*;

@Entity
public class AnswerOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long questionOptionId;

    private String text;

    private boolean isCorrect;

    public AnswerOption(String text, boolean isCorrect) {
        this.text = text;
        this.isCorrect = isCorrect;
    }

    public AnswerOption() {
    }

    public Long getQuestionOptionId() {
        return questionOptionId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public void setQuestionOptionId(Long questionOptionId) {
        this.questionOptionId = questionOptionId;
    }

    public boolean isCorrect() {
        return isCorrect;
    }

    public void setCorrect(boolean correct) {
        isCorrect = correct;
    }
}
