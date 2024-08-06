package model;

import jakarta.persistence.*;

import java.util.LinkedList;
import java.util.List;

@Entity
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long questionId;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<AnswerOption> answerOptions;

    private String title;
    private String text;

    public Question(String title, String text) {
        this.answerOptions = new LinkedList<>();
        this.title = title;
        this.text = text;
    }

    public Question() {
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void addAnswerOption(AnswerOption answerOption) {
        answerOptions.add(answerOption);
    }

    public void removeAnswerOption(AnswerOption answerOption) {
        answerOptions.remove(answerOption);
    }

    public List<AnswerOption> getAnswerOptions() {
        return answerOptions;
    }

    public void setAnswerOptions(List<AnswerOption> answerOptions) {
        this.answerOptions = answerOptions;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
