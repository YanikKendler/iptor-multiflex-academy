package model;

import jakarta.persistence.*;

@Entity
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId;


    @ManyToOne
    @JoinColumn(name = "videoId")
    private Video video;

    private String title;
    private String text;

    public Comment(Video video, String title, String text) {
        this.video = video;
        this.title = title;
        this.text = text;
    }

    public Comment() {
    }

    public Long getCommentId() {
        return commentId;
    }

    public Video getVideo() {
        return video;
    }

    public void setVideo(Video video) {
        this.video = video;
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
