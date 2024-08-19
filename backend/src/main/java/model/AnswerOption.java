package model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
public class AnswerOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long answerOptionId;

    private String text;

    @JsonProperty("isCorrect")
    private boolean isCorrect;

    public AnswerOption(String text, boolean isCorrect) {
        this.text = text;
        this.isCorrect = isCorrect;
    }

    public AnswerOption() {
    }

    public Long getAnswerOptionId() {
        return answerOptionId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public void setAnswerOptionId(Long questionOptionId) {
        this.answerOptionId = questionOptionId;
    }

    public boolean isCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(boolean isCorrect) {
        this.isCorrect = isCorrect;
    }
}
