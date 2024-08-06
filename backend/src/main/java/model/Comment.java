package model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId;

    @ManyToOne
    private User user;

    private String text;
    private final LocalDateTime timestamp;

    public Comment(User user, String text) {
        this();
        this.user = user;
        this.text = text;
    }

    public Comment() {
        timestamp = LocalDateTime.now();
    }

    public Long getCommentId() {
        return commentId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}
