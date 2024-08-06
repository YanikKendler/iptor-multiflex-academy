package model;

import jakarta.persistence.*;

@Entity
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId;

    @ManyToOne
    private User userId;

    private String text;

    public Comment(String title, String text) {
        this.text = text;
    }

    public Comment() {
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
}
