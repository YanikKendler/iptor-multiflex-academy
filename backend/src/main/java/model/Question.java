package model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long questionId;

    @ManyToOne
    @JoinColumn(name = "videoId")
    private Video video;

    @OneToMany(mappedBy = "question", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<AnswerOption> answerOptions;

    private String title;
    private String text;

    public Question(Video video, List<AnswerOption> answerOptions, String title, String text) {
        this.video = video;
        this.answerOptions = answerOptions;
        this.title = title;
        this.text = text;
    }

    public Question() {
    }

    public void addAnswerOption(AnswerOption answerOption) {
        answerOptions.add(answerOption);
    }

    public void removeAnswerOption(AnswerOption answerOption) {
        answerOptions.remove(answerOption);
    }

    public Long getQuestionId() {
        return questionId;
    }

    public Video getVideo() {
        return video;
    }

    public void setVideo(Video videoId) {
        this.video = videoId;
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
