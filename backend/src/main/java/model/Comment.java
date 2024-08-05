package model;

import jakarta.persistence.*;

@Entity
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId;

    private Long userId;

    @ManyToOne
    @JoinColumn(name = "videoId")
    private Video video;

    private String title;
    private String text;

    public Comment(Video video, String title, String text, Long userId) {
        this.video = video;
        this.title = title;
        this.text = text;
        this.userId = userId;
    }

    public Comment() {
    }

    public Long getCommentId() {
        return commentId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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
