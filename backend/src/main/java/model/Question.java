package model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;

@Entity
public class Question implements Comparable<Question> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long questionId;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<AnswerOption> answerOptions;

    private String text;

    private final LocalDateTime timestamp;

    public Question(String text, List<AnswerOption> answerOptions) {
        this();
        this.text = text;
        this.answerOptions = answerOptions;
    }

    public Question(String text) {
        this();
        this.answerOptions = new LinkedList<>();
        this.text = text;
    }

    public Question() {
        this.timestamp = LocalDateTime.now();
    }

    public Long getQuestionId() {
        return questionId;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
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

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    @Override
    public int compareTo(Question o) {
        try{
            return o.getTimestamp().compareTo(this.getTimestamp()) * -1;
        }
        catch (NullPointerException e){
            return 0;
        }
    }
}
